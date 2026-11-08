import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProposalsManager, { type SavedProposal } from '@/components/ProposalsManager';
import PlanBadge from '@/components/PlanBadge';
import { createAdminClient } from '@/supabase/admin';
import { getIsPro, getSessionUser } from '@/lib/account';
import { SAVED_LIMITS } from '@/lib/plans';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'My proposals', robots: { index: false, follow: false } };

export default async function Page() {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  let items: SavedProposal[] = [];
  let failed = false;
  let pro = false;
  try {
    pro = await getIsPro(user.id);
    const { data, error } = await createAdminClient().from('proposals').select('id,title,client_name,brief,proposal,status,created_at,updated_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(SAVED_LIMITS.pro);
    if (error) throw error;
    items = (data || []) as SavedProposal[];
  } catch (e) {
    failed = true;
    console.error('[ProposalHero] proposals page failed', (e as { code?: string })?.code);
  }
  const limit = pro ? SAVED_LIMITS.pro : SAVED_LIMITS.basic;

  return (
    <>
      <Header />
      <main className="dashboard-page">
        <div className="wide-container">
          <div className="dash-heading">
            <div>
              <div className="eyebrow">Your library</div>
              <h1>My proposals</h1>
              <p><PlanBadge pro={pro} /> Save the proposals you like, edit them, and track which ones you sent and won.</p>
            </div>
            <div className="dash-actions">
              <Link className="btn-primary" href="/generator">New proposal</Link>
              {!pro ? <Link className="btn-ghost" href="/pricing">Save up to {SAVED_LIMITS.pro} with Pro</Link> : null}
            </div>
          </div>
          {failed ? (
            <div className="error-box" role="alert">We could not load your proposals right now. Please refresh in a moment.</div>
          ) : (
            <ProposalsManager initial={items} limit={limit} pro={pro} />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
