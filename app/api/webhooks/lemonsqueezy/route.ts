import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/supabase/admin';
import { KNOWN_STATUSES, isEntitled } from '@/lib/billing';

export const runtime = 'nodejs';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ok = (note: string) => NextResponse.json({ ok: true, note });

export async function POST(req: Request) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) { console.error('[ProposalHero webhook] LEMONSQUEEZY_WEBHOOK_SECRET missing'); return NextResponse.json({ error: 'not configured' }, { status: 503 }); }

  // 1) Verify signature over the RAW body (per Lemon Squeezy docs: HMAC-SHA256 hex in X-Signature).
  const raw = await req.text();
  const sig = req.headers.get('x-signature') || '';
  if (!raw || !sig) return NextResponse.json({ error: 'invalid' }, { status: 401 });
  const digest = Buffer.from(crypto.createHmac('sha256', secret).update(raw).digest('hex'), 'utf8');
  const given = Buffer.from(sig, 'utf8');
  if (digest.length !== given.length || !crypto.timingSafeEqual(digest, given)) return NextResponse.json({ error: 'invalid' }, { status: 401 });

  // 2) Parse. Anything we do not need is acknowledged (200) so Lemon Squeezy stops retrying.
  let body: any;
  try { body = JSON.parse(raw); } catch { return NextResponse.json({ error: 'bad json' }, { status: 400 }); }
  const event: unknown = body?.meta?.event_name;
  if (typeof event !== 'string' || !event.startsWith('subscription_') || event.startsWith('subscription_payment_')) return ok('ignored event');
  const data = body?.data;
  if (data?.type !== 'subscriptions' || !data?.id) return ok('ignored payload');
  const a = data.attributes || {};

  const testMode = body?.meta?.test_mode === true || a.test_mode === true;
  if (testMode && process.env.LEMONSQUEEZY_ALLOW_TEST_MODE !== 'true') return ok('test event ignored');

  const wantVariant = process.env.LEMONSQUEEZY_VARIANT_ID;
  if (wantVariant && String(a.variant_id) !== String(wantVariant)) return ok('other product ignored');

  const status = String(a.status || '');
  if (!KNOWN_STATUSES.includes(status)) return ok('unknown status ignored');

  // 3) Which user? Taken from custom data WE attached server-side at checkout (inside the signed payload).
  const userId = body?.meta?.custom_data?.user_id;
  if (typeof userId !== 'string' || !UUID.test(userId)) { console.error('[ProposalHero webhook] no valid user_id in custom_data', { event }); return ok('no user'); }

  const subscriptionId = String(data.id);
  const updatedAt = a.updated_at && !Number.isNaN(Date.parse(a.updated_at)) ? new Date(a.updated_at) : new Date();

  try {
    const admin = createAdminClient();
    const { data: existing, error: readErr } = await admin.from('subscriptions').select('subscription_id,status,ends_at,provider_updated_at').eq('user_id', userId).maybeSingle();
    if (readErr) throw readErr;

    if (existing?.subscription_id === subscriptionId) {
      // Out-of-order / replayed older event: never overwrite newer state.
      if (existing.provider_updated_at && new Date(existing.provider_updated_at) > updatedAt) return ok('stale event ignored');
    } else if (existing?.subscription_id && isEntitled(existing) && !(status === 'active' || status === 'on_trial')) {
      // A different (old) subscription must not downgrade a currently entitled one.
      return ok('other subscription ignored');
    }

    const { error } = await admin.from('subscriptions').upsert({
      user_id: userId,
      provider: 'lemonsqueezy',
      subscription_id: subscriptionId,
      customer_id: a.customer_id != null ? String(a.customer_id) : null,
      variant_id: a.variant_id != null ? String(a.variant_id) : null,
      status,
      renews_at: a.renews_at ?? null,
      ends_at: a.ends_at ?? null,
      provider_updated_at: updatedAt.toISOString(),
      test_mode: testMode,
    }, { onConflict: 'user_id' });

    if (error) {
      // Permanent problems (unknown user / subscription already linked to someone else): ack, do not retry.
      if (error.code === '23503' || error.code === '23505') { console.error('[ProposalHero webhook] rejected', { code: error.code, event }); return ok('rejected'); }
      throw error;
    }
    return ok('applied');
  } catch (e) {
    const x = e as { code?: string; message?: string };
    console.error('[ProposalHero webhook] database error', { event, code: x?.code, message: String(x?.message || '').slice(0, 200) });
    return NextResponse.json({ error: 'temporary failure' }, { status: 500 }); // Lemon Squeezy will retry
  }
}
