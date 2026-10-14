import { createAdminClient } from '@/supabase/admin';
import { createClient } from '@/supabase/server';
import { cookies } from 'next/headers';
import crypto from 'node:crypto';
import { ApiError } from '@/lib/errors';
import { isEntitled } from '@/lib/billing';
import { BASIC_LIMITS, GUEST_LIMITS, PRO_LIMITS, USAGE_COLUMN, type UsageKind } from '@/lib/plans';

export type { UsageKind };
export type UsageResult = { allowed: boolean; count: number; limit: number; remaining: number; guest: boolean; pro: boolean; kind: UsageKind };

const result = (kind: UsageKind, allowed: boolean, count: number, limit: number, guest: boolean, pro: boolean): UsageResult =>
  ({ kind, allowed, count, limit, remaining: Math.max(0, limit - count), guest, pro });

/* ---------- guests (signed cookie) ---------- */

function secret(): string {
  const s = process.env.USAGE_SECRET;
  if (s && s.length >= 16) return s;
  if (process.env.NODE_ENV === 'production') {
    console.error('[ProposalHero] USAGE_SECRET is missing or shorter than 16 characters');
    throw new ApiError(503, 'The service is temporarily unavailable. Please try again later.', 'misconfigured');
  }
  return 'dev-only-insecure-secret'; // local development only
}
const sign = (v: string) => crypto.createHmac('sha256', secret()).update(v).digest('hex');
const safeEq = (a: string, b: string) => a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
const cookieOpts = { httpOnly: true, sameSite: 'lax' as const, secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 365, path: '/' };

export async function getGuestCount(kind: UsageKind) {
  const c = await cookies();
  const raw = c.get(`ph_guest_${kind}`)?.value || '';
  const [count, sig] = raw.split('.');
  if (!count || !sig || !safeEq(sig, sign(`${kind}:${count}`))) return 0;
  const n = Number(count);
  return Number.isInteger(n) && n >= 0 ? n : 0;
}

async function writeGuest(kind: UsageKind, n: number) {
  (await cookies()).set(`ph_guest_${kind}`, `${n}.${sign(`${kind}:${n}`)}`, cookieOpts);
}

async function consumeGuest(kind: UsageKind): Promise<UsageResult> {
  const count = await getGuestCount(kind);
  const limit = GUEST_LIMITS[kind];
  if (count >= limit) return result(kind, false, count, limit, true, false);
  await writeGuest(kind, count + 1);
  return result(kind, true, count + 1, limit, true, false);
}

async function rollbackGuest(kind: UsageKind) {
  await writeGuest(kind, Math.max(0, (await getGuestCount(kind)) - 1));
}

/* ---------- signed-in users (database) ---------- */

export function currentPeriodStart(): string {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)).toISOString().slice(0, 10);
}

/** Pro only when the verified subscription row (written solely by the signed Lemon Squeezy webhook) is entitled. */
async function getSub(userId: string) {
  const { data } = await createAdminClient().from('subscriptions').select('status,ends_at,renews_at').eq('user_id', userId).maybeSingle();
  return data as { status: string | null; ends_at: string | null; renews_at: string | null } | null;
}
async function isPro(userId: string): Promise<boolean> {
  return isEntitled(await getSub(userId));
}

type UsageRow = Record<string, unknown> & { id: string };

async function getOrCreateRow(userId: string): Promise<UsageRow> {
  const admin = createAdminClient();
  const period = currentPeriodStart();
  const find = () => admin.from('usage').select('*').eq('user_id', userId).eq('usage_date', period).maybeSingle();
  let { data } = await find();
  if (data) return data as UsageRow;
  const ins = await admin.from('usage').insert({ user_id: userId, usage_date: period, proposal_generations: 0, prompt_generations: 0, improvements: 0, analyses: 0, scores: 0 }).select().single();
  if (!ins.error) return ins.data as UsageRow;
  // Lost an insert race: the row exists now.
  ({ data } = await find());
  if (data) return data as UsageRow;
  throw ins.error;
}

async function adjust(userId: string, kind: UsageKind, delta: 1 | -1, limit?: number): Promise<{ ok: boolean; count: number }> {
  const admin = createAdminClient();
  const col = USAGE_COLUMN[kind];
  // Compare-and-swap: the update only applies if the counter is unchanged since we read it.
  for (let attempt = 0; attempt < 5; attempt++) {
    const row = await getOrCreateRow(userId);
    const current = Number(row[col] || 0);
    if (delta === 1 && limit !== undefined && current >= limit) return { ok: false, count: current };
    if (delta === -1 && current <= 0) return { ok: true, count: 0 };
    const { data, error } = await admin.from('usage').update({ [col]: current + delta }).eq('id', row.id).eq(col, current).select('id');
    if (error) throw error;
    if (data && data.length > 0) return { ok: true, count: current + delta };
  }
  throw new ApiError(503, 'We are busy right now. Please try again.', 'contention');
}

async function consumeUser(userId: string, kind: UsageKind): Promise<UsageResult> {
  const pro = await isPro(userId);
  const limit = (pro ? PRO_LIMITS : BASIC_LIMITS)[kind];
  const r = await adjust(userId, kind, 1, limit);
  return result(kind, r.ok, r.count, limit, false, pro);
}

/* ---------- public API ---------- */

export async function consume(kind: UsageKind): Promise<UsageResult> {
  const { data: { user } } = await (await createClient()).auth.getUser();
  return user ? consumeUser(user.id, kind) : consumeGuest(kind);
}

/** Refund one use after a failed generation. Safe to call for guests and users. Never throws. */
export async function rollback(kind: UsageKind): Promise<void> {
  try {
    const { data: { user } } = await (await createClient()).auth.getUser();
    if (!user) return await rollbackGuest(kind);
    await adjust(user.id, kind, -1);
  } catch (e) {
    console.error('[ProposalHero] rollback failed', { kind, message: e instanceof Error ? e.message : 'unknown' });
  }
}

export function limitMessage(u: UsageResult, label: string) {
  return u.guest
    ? `You've used your ${u.limit} free ${label}${u.limit === 1 ? '' : 's'} as a guest. Create a free account to get a monthly allowance.`
    : u.pro
      ? `You've reached your monthly ${label} limit. It resets on the 1st (UTC).`
      : `You've reached your monthly free ${label} limit. It resets on the 1st (UTC), or upgrade to Pro for more.`;
}

/* ---------- read-only summary for the dashboard ---------- */
export async function getUsageSummary(userId: string) {
  const admin = createAdminClient();
  const sub = await getSub(userId);
  const pro = isEntitled(sub);
  const limits = pro ? PRO_LIMITS : BASIC_LIMITS;
  const { data } = await admin.from('usage').select('*').eq('user_id', userId).eq('usage_date', currentPeriodStart()).maybeSingle();
  const now = new Date();
  const resetsOn = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  const rows = (Object.keys(USAGE_COLUMN) as UsageKind[]).map((kind) => {
    const used = Number((data as Record<string, unknown> | null)?.[USAGE_COLUMN[kind]] || 0);
    return { kind, used, limit: limits[kind], remaining: Math.max(0, limits[kind] - used) };
  });
  return { pro, sub, rows, resetsOn };
}
