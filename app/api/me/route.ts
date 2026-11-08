import { NextResponse } from 'next/server';
import { getIsPro, getSessionUser } from '@/lib/account';
import { createAdminClient } from '@/supabase/admin';

export const dynamic = 'force-dynamic';

// Lightweight identity + plan for the header. Plan comes from the verified subscription row only.
export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ user: null }, { headers: { 'Cache-Control': 'no-store' } });
    const [{ data: profile }, pro] = await Promise.all([
      createAdminClient().from('profiles').select('full_name').eq('id', user.id).maybeSingle(),
      getIsPro(user.id),
    ]);
    return NextResponse.json({ user: { email: user.email || '', name: profile?.full_name || '', pro } }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    console.error('[ProposalHero] /api/me failed', e instanceof Error ? e.message : 'unknown');
    return NextResponse.json({ error: 'unavailable' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
