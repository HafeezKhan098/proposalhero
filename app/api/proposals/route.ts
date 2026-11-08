import { NextResponse } from 'next/server';
import { createAdminClient } from '@/supabase/admin';
import { getIsPro, getSessionUser } from '@/lib/account';
import { ApiError, errorResponse, invalid } from '@/lib/errors';
import { sameOrigin } from '@/lib/lemon';
import { SAVED_LIMITS } from '@/lib/plans';

export const dynamic = 'force-dynamic';
const COLUMNS = 'id,title,client_name,brief,proposal,status,created_at,updated_at';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) throw new ApiError(401, 'Please sign in to see your saved proposals.', 'unauthenticated');
    const { data, error } = await createAdminClient().from('proposals').select(COLUMNS).eq('user_id', user.id).order('created_at', { ascending: false }).limit(SAVED_LIMITS.pro);
    if (error) throw error;
    return NextResponse.json({ proposals: data || [] }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    return errorResponse(e, 'We could not load your proposals. Please try again.');
  }
}

export async function POST(req: Request) {
  try {
    if (!sameOrigin(req)) throw new ApiError(403, 'Invalid request.');
    const user = await getSessionUser();
    if (!user) throw new ApiError(401, 'Please create a free account to save proposals.', 'unauthenticated');
    let body: unknown;
    try { body = await req.json(); } catch { throw invalid('Invalid request.'); }
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw invalid('Invalid request.');
    const b = body as Record<string, unknown>;

    const proposal = typeof b.proposal === 'string' ? b.proposal.trim() : '';
    if (proposal.length < 20) throw invalid('There is no proposal text to save.');
    if (proposal.length > 8000) throw invalid('This proposal is too long to save (maximum 8,000 characters).');
    const brief = typeof b.brief === 'string' ? b.brief.trim().slice(0, 8000) : '';
    const title = (typeof b.title === 'string' ? b.title.trim() : '').slice(0, 120) || 'Untitled proposal';
    const client = typeof b.client_name === 'string' ? b.client_name.trim().slice(0, 100) : '';

    const admin = createAdminClient();
    const pro = await getIsPro(user.id);
    const limit = pro ? SAVED_LIMITS.pro : SAVED_LIMITS.basic;
    const { count, error: countErr } = await admin.from('proposals').select('id', { count: 'exact', head: true }).eq('user_id', user.id);
    if (countErr) throw countErr;
    if ((count || 0) >= limit) {
      throw new ApiError(403, pro ? `You have reached the ${limit} saved-proposal limit. Delete one to save another.` : `Basic accounts can save ${limit} proposals. Delete one, or upgrade to Pro to save up to ${SAVED_LIMITS.pro}.`, 'saved_limit');
    }

    const { data, error } = await admin.from('proposals').insert({ user_id: user.id, title, client_name: client || null, brief, proposal, status: 'draft' }).select(COLUMNS).single();
    if (error) throw error;
    return NextResponse.json({ proposal: data }, { status: 201 });
  } catch (e) {
    if (!(e instanceof ApiError)) {
      const x = e as { code?: string; message?: string };
      console.error('[ProposalHero] proposal save failed', { code: x?.code, message: String(x?.message || '').slice(0, 200) });
    }
    return errorResponse(e, 'We could not save this proposal. Please try again.');
  }
}
