import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/supabase/server';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getUsageSummary } from '@/lib/usage';
import { USAGE_LABEL } from '@/lib/plans';
import BillingButton from '@/components/BillingButton';

const proEnabled = process.env.NEXT_PUBLIC_PRO_ENABLED === 'true';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Dashboard', robots: { index: false, follow: false } };

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  let summary: Awaited<ReturnType<typeof getUsageSummary>> | null = null;
  try { summary = await getUsageSummary(user.id); } catch (e) { console.error('[ProposalHero] dashboard usage failed', e instanceof Error ? e.message : 'unknown'); }
  const reset = summary?.resetsOn.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

  return <><Header /><main className="dashboard-page"><div className="wide-container">
    <div className="dash-heading">
      <div><div className="eyebrow">Your account</div><h1>Welcome back.</h1><p>{user.email} · {summary?.pro ? <span className="usage-label">PRO</span> : null} <strong>{summary?.pro ? 'Pro plan' : 'Basic plan'}</strong></p>{summary?.pro && summary.sub && <p style={{ opacity: .8 }}>{summary.sub.status === 'cancelled' && summary.sub.ends_at ? `Cancelled. Pro access continues until ${new Date(summary.sub.ends_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}.` : summary.sub.status === 'past_due' ? 'Your last payment failed. Please update your payment method in Manage subscription.' : summary.sub.renews_at ? `Renews on ${new Date(summary.sub.renews_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}.` : null}</p>}</div>
      <div className="dash-actions">
        <Link className="hero-primary" href="/generator">New proposal <ArrowRight size={15} /></Link>
        <Link className="dash-secondary" href="/prompts">New prompt</Link>
        {summary?.sub?.status && <BillingButton endpoint="/api/billing/portal" label="Manage subscription" className="dash-secondary" />}
        <form action="/auth/signout" method="post"><button className="dash-secondary">Sign out</button></form>
      </div>
    </div>

    {summary ? <>
      <p style={{ margin: '0 0 12px', opacity: .8 }}>Monthly usage. Each tool has its own counter. Resets on {reset} (UTC).</p>
      <div className="dash-usage">{summary.rows.map((r) => <Usage key={r.kind} title={USAGE_LABEL[r.kind]} used={r.used} limit={r.limit} remaining={r.remaining} />)}</div>
    </> : <div className="error-box" role="alert">We couldn&apos;t load your usage right now. Your account is fine. Please refresh in a moment.</div>}

    <div className="dashboard-grid">
      <section className="dash-primary"><span className="dash-label">Win the work</span><h2>Start with the client brief.</h2><p>Generate the proposal, then use Humanize, Analyze and Score before you send it.</p><Link href="/generator" className="dash-open">Open Proposal Generator <ArrowRight size={15} /></Link></section>
      <section className="dash-secondary-card"><span className="dash-label">Do the work</span><h2>Build it with better prompts.</h2><p>Turn requirements into structured prompts for coding, design, research, content and more.</p><Link href="/prompts" className="dash-open">Open Prompt Generator <ArrowRight size={15} /></Link></section>
    </div>

    {!summary?.pro && <section className="dash-note"><div><Sparkles size={18} /><div><strong>Need more than the Basic allowance?</strong><span>Pro raises every monthly limit.</span></div></div>{proEnabled ? <BillingButton endpoint="/api/billing/checkout" label="Upgrade to Pro" className="dash-open" /> : <Link href="/pricing">See Pro <ArrowRight size={14} /></Link>}</section>}
  </div></main><Footer /></>;
}

function Usage({ title, used, limit, remaining }: { title: string; used: number; limit: number; remaining: number }) {
  const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
  return <div className="dash-usage-card">
    <span>{title}</span>
    <strong>{used} <small>/ {limit} used</small></strong>
    <div className="usage-bar" role="progressbar" aria-label={`${title}: ${used} of ${limit} used`} aria-valuemin={0} aria-valuemax={limit} aria-valuenow={used}><i style={{ width: `${pct}%` }} /></div>
    <em>{remaining} remaining this month</em>
  </div>;
}
