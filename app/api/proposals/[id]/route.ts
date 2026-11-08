import { NextResponse } from 'next/server';
import { createAdminClient } from '@/supabase/admin';
import { getSessionUser } from '@/lib/account';
import { ApiError, errorResponse, invalid } from '@/lib/errors';
import { sameOrigin } from '@/lib/lemon';

export const dynamic = 'force-dynamic';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const STATUSES = ['draft', 'sent', 'won', 'lost', 'archived'];
const COLUMNS = 'id,title,client_name,brief,proposal,status,created_at,updated_at';

type Ctx = { params: Promise<{ id: string }> };

async function authorize(req: Request, ctx: Ctx) {
  if (!sameOrigin(req)) throw new ApiError(403, 'Invalid request.');
  const user = await getSessionUser();
  if (!user) throw new ApiError(401, 'Please sign in.', 'unauthenticated');
  const { id } = await ctx.params;
  if (!UUID.test(id)) throw new ApiError(404, 'Proposal not found.');
  return { userId: user.id, id };
}

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    const { userId, id } = await authorize(req, ctx);
    let body: unknown;
    try { body = await req.json(); } catch { throw invalid('Invalid request.'); }
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw invalid('Invalid request.');
    const b = body as Record<string, unknown>;
    const patch: Record<string, unknown> = {};
    if (b.title !== undefined) { if (typeof b.title !== 'string') throw invalid('Title is not valid.'); patch.title = b.title.trim().slice(0, 120) || 'Untitled proposal'; }
    if (b.client_name !== undefined) { if (typeof b.client_name !== 'string') throw invalid('Client name is not valid.'); patch.client_name = b.client_name.trim().slice(0, 100) || null; }
    if (b.status !== undefined) { if (typeof b.status !== 'string' || !STATUSES.includes(b.status)) throw invalid('Status is not valid.'); patch.status = b.status; }
    if (b.proposal !== undefined) {
      if (typeof b.proposal !== 'string' || b.proposal.trim().length < 20) throw invalid('The proposal text is too short.');
      if (b.proposal.length > 8000) throw invalid('This proposal is too long (maximum 8,000 characters).');
      patch.proposal = b.proposal.trim();
    }
    if (Object.keys(patch).length === 0) throw invalid('Nothing to update.');
    // Ownership is enforced by user_id in the filter, never by a client-supplied id alone.
    const { data, error } = await createAdminClient().from('proposals').update(patch).eq('id', id).eq('user_id', userId).select(COLUMNS).maybeSingle();
    if (error) throw error;
    if (!data) throw new ApiError(404, 'Proposal not found.');
    return NextResponse.json({ proposal: data });
  } catch (e) {
    if (!(e instanceof ApiError)) console.error('[ProposalHero] proposal update failed', (e as { code?: string })?.code);
    return errorResponse(e, 'We could not update this proposal. Please try again.');
  }
}

export async function DELETE(req: Request, ctx: Ctx) {
  try {
    const { userId, id } = await authorize(req, ctx);
    const { data, error } = await createAdminClient().from('proposals').delete().eq('id', id).eq('user_id', userId).select('id');
    if (error) throw error;
    if (!data || data.length === 0) throw new ApiError(404, 'Proposal not found.');
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (!(e instanceof ApiError)) console.error('[ProposalHero] proposal delete failed', (e as { code?: string })?.code);
    return errorResponse(e, 'We could not delete this proposal. Please try again.');
  }
}
