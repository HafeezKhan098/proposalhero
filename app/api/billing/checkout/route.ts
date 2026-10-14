import { NextResponse } from 'next/server';
import { createClient } from '@/supabase/server';
import { createAdminClient } from '@/supabase/admin';
import { isEntitled } from '@/lib/billing';
import { isLemonUrl, lsConfig, lsFetch, sameOrigin } from '@/lib/lemon';
import { errorResponse } from '@/lib/errors';

// Creates a Lemon Squeezy checkout for the SIGNED-IN user. The user id is attached server-side
// (checkout_data.custom.user_id) and comes back in the signed webhook. Nothing here grants Pro.
export async function POST(req: Request) {
  try {
    if (!sameOrigin(req)) return NextResponse.json({ error: 'Invalid request.' }, { status: 403 });
    const { data: { user } } = await (await createClient()).auth.getUser();
    if (!user) return NextResponse.json({ error: 'Please sign in to upgrade.', code: 'unauthenticated' }, { status: 401 });

    const { data: sub } = await createAdminClient().from('subscriptions').select('status,ends_at').eq('user_id', user.id).maybeSingle();
    if (isEntitled(sub)) return NextResponse.json({ error: 'You already have Pro. Use Manage subscription on your dashboard.', code: 'already_pro' }, { status: 409 });

    const { apiKey, storeId, variantId } = lsConfig();
    const site = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');
    const res = await lsFetch('/checkouts', apiKey, {
      method: 'POST',
      body: { data: { type: 'checkouts', attributes: {
        checkout_data: { email: user.email, custom: { user_id: user.id } },
        ...(site ? { product_options: { redirect_url: `${site}/dashboard?checkout=complete` } } : {}),
      }, relationships: { store: { data: { type: 'stores', id: String(storeId) } }, variant: { data: { type: 'variants', id: String(variantId) } } } } },
    });
    if (!res.ok) {
      console.error('[ProposalHero billing] checkout create failed', { status: res.status });
      return NextResponse.json({ error: 'We could not start checkout. Please try again.', code: 'checkout_failed' }, { status: 502 });
    }
    const json = await res.json();
    const url = json?.data?.attributes?.url;
    if (!isLemonUrl(url)) {
      console.error('[ProposalHero billing] unexpected checkout url');
      return NextResponse.json({ error: 'We could not start checkout. Please try again.', code: 'checkout_failed' }, { status: 502 });
    }
    return NextResponse.json({ url });
  } catch (e) {
    return errorResponse(e, 'We could not start checkout. Please try again.');
  }
}
