import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, Sparkles, FileText, Settings } from 'lucide-react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import PlanBadge from '@/components/PlanBadge';
import BillingButton from '@/components/BillingButton';
import { createAdminClient } from '@/supabase/admin';
import { getSessionUser, getProfile } from '@/lib/account';
import { getUsageSummary } from '@/lib/usage';
import { SAVED_LIMITS, USAGE_LABEL } from '@/lib/plans';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Dashboard', robots: { index: false, follow: false } };

const proEnabled = process.env.NEXT_PUBLIC_PRO_ENABLED === 'true';
const dateFmt = (d: Date | string) => new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

export default async function Dashboard() {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  let summary: Awaited<ReturnType<typeof getUsageSummary>> | null = null;
  let saved = 0;
  let name = '';
  try { summary = await getUsageSummary(user.id); } catch (e) { console.error('[ProposalHero] dashboard usage failed', (e as { code?: string })?.code); }
  try {
    const { count } = await createAdminClient().from('proposals').select('id', { count: 'exact', head: true }).eq('user_id', user.id);
    saved = count || 0;
    name = (await getProfile(user.id)).full_name;
  } catch (e) { console.error('[ProposalHero] dashboard extras failed', (e as { code?: string })?.code); }

  const pro = !!summary?.pro;
  const savedLimit = pro ? SAVED_LIMITS.pro : SAVED_LIMITS.basic;
  const sub = summary?.sub;
  const greeting = name ? `Welcome back, ${name.split(' ')[0]}.` : 'Welcome back.';

  return (
    <>
      <Header />
      <main className="dashboard-page">
        <div className="wide-container">
          <div className="dash-heading">
            <div>
              <div className="eyebrow">Your account</div>
              <h1>{greeting}</h1>
              <p className="dash-plan-line">{user.email} <PlanBadge pro={pro} size="md" /></p>
              {pro && sub ? (
                <p className="dash-plan-note">
                  {sub.status === 'cancelled' && sub.ends_at ? `Cancelled. Pro access continues until ${dateFmt(sub.ends_at)}.` : sub.status === 'past_due' ? 'Your last payment failed. Please update your payment method in Manage subscription.' : sub.renews_at ? `Renews on ${dateFmt(sub.renews_at)}.` : ''}
                </p>
              ) : null}
            </div>
            <div className="dash-actions">
              <Link className="btn-primary" href="/generator">New proposal <ArrowRight size={15} aria-hidden="true" /></Link>
              <Link className="btn-ghost" href="/prompts">New prompt</Link>
              <Link className="btn-ghost" href="/proposals"><FileText size={15} aria-hidden="true" /> My proposals</Link>
              <Link className="btn-ghost" href="/settings"><Settings size={15} aria-hidden="true" /> Settings</Link>
            </div>
          </div>

          {summary ? (
            <>
              <p className="dash-lede">Monthly usage. Each tool has its own counter, and all of them reset on {dateFmt(summary.resetsOn)} (UTC).</p>
              <div className="dash-usage">
                {summary.rows.map((r) => <Usage key={r.kind} title={USAGE_LABEL[r.kind]} used={r.used} limit={r.limit} unit="this month" />)}
                <Usage title="Saved proposals" used={saved} limit={savedLimit} unit="in your library" />
              </div>
            </>
          ) : (
            <div className="error-box" role="alert">We could not load your usage right now. Your account is fine. Please refresh in a moment.</div>
          )}

          <div className="dashboard-grid">
            <section className="dash-primary">
              <span className="dash-label">Win the work</span>
              <h2>Start with the client brief.</h2>
              <p>Generate the proposal, then use Humanize, Analyze and Score before you send it. Save the ones worth keeping.</p>
              <Link href="/generator" className="dash-open">Open Proposal Generator <ArrowRight size={15} aria-hidden="true" /></Link>
            </section>
            <section className="dash-secondary-card">
              <span className="dash-label">Do the work</span>
              <h2>Build it with better prompts.</h2>
              <p>Turn requirements into structured prompts for coding, design, research, content and more.</p>
              <Link href="/prompts" className="dash-open">Open Prompt Generator <ArrowRight size={15} aria-hidden="true" /></Link>
            </section>
          </div>

          {pro ? (
            <section className="dash-note">
              <div><Sparkles size={18} aria-hidden="true" /><div><strong>Thank you for supporting ProposalHero.</strong><span>Your Pro limits and a {SAVED_LIMITS.pro}-proposal library are active.</span></div></div>
              <BillingButton endpoint="/api/billing/portal" label="Manage subscription" className="btn-ghost" />
            </section>
          ) : (
            <section className="dash-note">
              <div><Sparkles size={18} aria-hidden="true" /><div><strong>Need more than the Basic allowance?</strong><span>Pro raises every monthly limit and keeps up to {SAVED_LIMITS.pro} saved proposals.</span></div></div>
              {proEnabled ? <BillingButton endpoint="/api/billing/checkout" label="Upgrade to Pro" className="btn-primary" /> : <Link href="/pricing" className="btn-primary">See Pro</Link>}
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function Usage({ title, used, limit, unit }: { title: string; used: number; limit: number; unit: string }) {
  const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
  const remaining = Math.max(0, limit - used);
  return (
    <div className="dash-usage-card">
      <span>{title}</span>
      <strong>{used} <small>/ {limit} used</small></strong>
      <div className="usage-bar" role="progressbar" aria-label={`${title}: ${used} of ${limit} used`} aria-valuemin={0} aria-valuemax={limit} aria-valuenow={used}><i style={{ width: `${pct}%` }} /></div>
      <em>{remaining} remaining {unit}</em>
    </div>
  );
}
