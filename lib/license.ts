import { createHmac, timingSafeEqual } from 'crypto';
import type { NextRequest, NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Pro licensing through the Lemon Squeezy License API.
// The License API needs no secret key: it only needs the customer's license key.
// We verify the key belongs to YOUR store (LEMONSQUEEZY_STORE_ID), activate it for
// this browser, and remember that in a signed, httpOnly cookie. No database.
// ---------------------------------------------------------------------------
const LS_URL = 'https://api.lemonsqueezy.com/v1/licenses';
export const PRO_COOKIE = 'ph_pro';
const RECHECK_MS = 12 * 60 * 60 * 1000; // re-verify with Lemon Squeezy twice a day
const GRACE_MS = 7 * 24 * 60 * 60 * 1000; // keep Pro up to a week if Lemon Squeezy is unreachable
const PRO_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function sign(payload: string): string {
  const secret = process.env.USAGE_SECRET || process.env.GROQ_API_KEY || '';
  return createHmac('sha256', secret).update(payload).digest('hex').slice(0, 32);
}

export function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  };
}

const storeId = () => (process.env.LEMONSQUEEZY_STORE_ID || '').trim();
const productId = () => (process.env.LEMONSQUEEZY_PRODUCT_ID || '').trim();

/** Pro can only work when the store id is configured (it stops other stores' keys from working). */
export function proConfigured(): boolean {
  return /^\d+$/.test(storeId());
}

type LsMeta = { store_id?: number | string; product_id?: number | string };
type LsResponse = {
  valid?: boolean;
  activated?: boolean;
  deactivated?: boolean;
  error?: string | null;
  license_key?: { status?: string; expires_at?: string | null };
  instance?: { id?: string };
  meta?: LsMeta;
};

async function lsCall(
  action: 'validate' | 'activate' | 'deactivate',
  params: Record<string, string>
): Promise<LsResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${LS_URL}/${action}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(params).toString(),
      signal: controller.signal,
      cache: 'no-store',
    });
    let data: LsResponse = {};
    try {
      data = await res.json();
    } catch {
      /* non-JSON body */
    }
    // Server errors and rate limiting are temporary, not an answer about the key.
    if (res.status >= 500 || res.status === 429) throw new Error(`Lemon Squeezy responded ${res.status}`);
    return data;
  } finally {
    clearTimeout(timer);
  }
}

function ownedByThisStore(meta?: LsMeta): boolean {
  if (!proConfigured() || !meta) return false;
  if (String(meta.store_id) !== storeId()) return false;
  if (productId() && String(meta.product_id) !== productId()) return false;
  return true;
}

function usable(r: LsResponse): boolean {
  const status = r.license_key?.status;
  if (r.valid !== true || (status !== 'active' && status !== 'inactive')) return false;
  const exp = r.license_key?.expires_at;
  if (exp && Date.parse(exp) < Date.now()) return false;
  return true;
}

const cleanKey = (raw: string): string => {
  const k = raw.trim();
  return /^[A-Za-z0-9-]{10,100}$/.test(k) ? k : '';
};

// ---- signed cookie: base64url(key).instanceId.checkedAt.signature -----------
function makeCookie(key: string, instanceId: string, checkedAt: number): string {
  const payload = `${Buffer.from(key).toString('base64url')}.${instanceId}.${checkedAt}`;
  return `${payload}.${sign(payload)}`;
}

function parseCookie(raw?: string): { key: string; instanceId: string; checkedAt: number } | null {
  if (!raw) return null;
  const parts = raw.split('.');
  if (parts.length !== 4) return null;
  const [k, instanceId, at, sig] = parts;
  if (!safeEqual(sig, sign(`${k}.${instanceId}.${at}`))) return null;
  const checkedAt = Number(at);
  if (!Number.isFinite(checkedAt)) return null;
  const key = cleanKey(Buffer.from(k, 'base64url').toString('utf8'));
  if (!key || !/^[A-Za-z0-9-]{8,64}$/.test(instanceId)) return null;
  return { key, instanceId, checkedAt };
}

// ---------------------------------------------------------------------------
export type ProState = { pro: boolean; setCookie?: string; clear?: boolean };

/** Is this request from a Pro user? Never throws. */
export async function resolvePro(req: NextRequest): Promise<ProState> {
  try {
    const raw = req.cookies.get(PRO_COOKIE)?.value;
    if (!raw) return { pro: false };
    const session = parseCookie(raw);
    if (!session) return { pro: false, clear: true };
    if (!proConfigured()) return { pro: false }; // misconfigured server: don't wipe anyone's cookie

    const age = Date.now() - session.checkedAt;
    if (age >= 0 && age < RECHECK_MS) return { pro: true };

    try {
      const r = await lsCall('validate', { license_key: session.key, instance_id: session.instanceId });
      if (ownedByThisStore(r.meta) && usable(r)) {
        return { pro: true, setCookie: makeCookie(session.key, session.instanceId, Date.now()) };
      }
      return { pro: false, clear: true }; // expired, disabled or removed
    } catch (err) {
      console.error('License re-check failed:', err);
      return age >= 0 && age < GRACE_MS ? { pro: true } : { pro: false };
    }
  } catch (err) {
    console.error('resolvePro error:', err);
    return { pro: false };
  }
}

export type ActivateResult =
  | { ok: true; cookie: string }
  | { ok: false; status: number; message: string };

export async function activateLicense(rawKey: string): Promise<ActivateResult> {
  if (!proConfigured()) {
    console.error('LEMONSQUEEZY_STORE_ID is missing or not a number, so Pro activation is disabled.');
    return { ok: false, status: 503, message: 'Pro activation is not available yet. Please contact support.' };
  }
  const key = cleanKey(rawKey);
  if (!key) {
    return {
      ok: false,
      status: 400,
      message: 'That does not look like a license key. Copy it from your Lemon Squeezy receipt email.',
    };
  }
  const notFound: ActivateResult = {
    ok: false,
    status: 400,
    message: "That license key wasn't found. Check it and try again.",
  };
  try {
    // 1. Check the key first (no side effects), including that it belongs to THIS store.
    const check = await lsCall('validate', { license_key: key });
    if (!ownedByThisStore(check.meta)) return notFound;
    if (!usable(check)) {
      return {
        ok: false,
        status: 400,
        message: 'This license key is no longer active. It may have expired or been disabled. Check your subscription.',
      };
    }
    // 2. Activate it for this browser.
    const act = await lsCall('activate', {
      license_key: key,
      instance_name: `Web ${new Date().toISOString().slice(0, 10)}`,
    });
    if (!act.activated || !act.instance?.id) {
      const atLimit = /activation limit/i.test(act.error || '');
      return {
        ok: false,
        status: 400,
        message: atLimit
          ? 'This license key has reached its device limit. Remove it from another device first, or contact support.'
          : 'Could not activate this license key. Please try again.',
      };
    }
    if (!ownedByThisStore(act.meta)) return notFound;
    return { ok: true, cookie: makeCookie(key, act.instance.id, Date.now()) };
  } catch (err) {
    console.error('License activation failed:', err);
    return {
      ok: false,
      status: 503,
      message: 'Could not reach the license server. Please try again in a minute.',
    };
  }
}

/** Frees this device's activation at Lemon Squeezy (best effort). */
export async function deactivateLicense(req: NextRequest): Promise<void> {
  const session = parseCookie(req.cookies.get(PRO_COOKIE)?.value);
  if (!session) return;
  try {
    await lsCall('deactivate', { license_key: session.key, instance_id: session.instanceId });
  } catch (err) {
    console.error('License deactivation failed:', err);
  }
}

export function applyPro(res: NextResponse, state: ProState) {
  if (state.setCookie) {
    res.cookies.set(PRO_COOKIE, state.setCookie, cookieOptions(PRO_COOKIE_MAX_AGE));
  } else if (state.clear) {
    res.cookies.set(PRO_COOKIE, '', cookieOptions(0));
  }
}
