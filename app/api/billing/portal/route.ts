import { NextResponse } from 'next/server';
import { createClient } from '@/supabase/server';
import { createAdminClient } from '@/supabase/admin';
import { isLemonUrl, lsConfig, lsFetch, sameOrigin } from '@/lib/lemon';
import { errorResponse } from '@/lib/errors';

// Returns a fresh customer-portal URL for the signed-in user's OWN subscription.
// Portal URLs are signed and expire, so we fetch a new one each time instead of storing it.
export async function POST(req: Request) {
  try {
    if (!sameOrigin(req)) return NextResponse.json({ error: 'Invalid request.' }, { status: 403 });
    const { data: { user } } = await (await createClient()).auth.getUser();
    if (!user) return NextResponse.json({ error: 'Please sign in.', code: 'unauthenticated' }, { status: 401 });
    const { data: sub } = await createAdminClient().from('subscriptions').select('subscription_id').eq('user_id', user.id).maybeSingle();
    if (!sub?.subscription_id) return NextResponse.json({ error: 'No subscription found for this account.' }, { status: 404 });
    const { apiKey } = lsConfig();
    const res = await lsFetch(`/subscriptions/${encodeURIComponent(sub.subscription_id)}`, apiKey);
    if (!res.ok) {
      console.error('[ProposalHero billing] portal fetch failed', { status: res.status });
      return NextResponse.json({ error: 'We could not open billing right now. Please try again.' }, { status: 502 });
    }
    const url = (await res.json())?.data?.attributes?.urls?.customer_portal;
    if (!isLemonUrl(url)) return NextResponse.json({ error: 'We could not open billing right now. Please try again.' }, { status: 502 });
    return NextResponse.json({ url });
  } catch (e) {
    return errorResponse(e, 'We could not open billing right now. Please try again.');
  }
}
