import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PlanBadge from '@/components/PlanBadge';
import BillingButton from '@/components/BillingButton';
import { ProfileForm, PasswordForm } from '@/components/SettingsForm';
import { getProfile, getSessionUser, getSubscription, type Profile } from '@/lib/account';
import { isEntitled } from '@/lib/billing';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Profile and settings', robots: { index: false, follow: false } };

const proEnabled = process.env.NEXT_PUBLIC_PRO_ENABLED === 'true';
const dateFmt = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : '');

export default async function Page() {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  let profile: Profile | null = null;
  let sub: Awaited<ReturnType<typeof getSubscription>> = null;
  let failed = false;
  try { [profile, sub] = await Promise.all([getProfile(user.id), getSubscription(user.id)]); }
  catch (e) { failed = true; console.error('[ProposalHero] settings page failed', (e as { code?: string })?.code); }
  const pro = isEntitled(sub);

  return (
    <>
      <Header />
      <main className="dashboard-page">
        <div className="wide-container st-page">
          <div className="dash-heading">
            <div>
              <div className="eyebrow">Your account</div>
              <h1>Profile and settings</h1>
              <p>{user.email} <PlanBadge pro={pro} size="md" /></p>
            </div>
            <div className="dash-actions"><Link className="btn-ghost" href="/dashboard">Back to dashboard</Link></div>
          </div>

          {failed || !profile ? (
            <div className="error-box" role="alert">We could not load your profile right now. Please refresh in a moment.</div>
          ) : (
            <section className="st-card" aria-labelledby="profile-h">
              <h2 id="profile-h">Your profile</h2>
              <p className="st-sub">Optional. Your skills, experience and portfolio link are filled into the Proposal Generator for you. Only add facts that are true.</p>
              <ProfileForm initial={{ ...profile, skills: profile.skills.join(', ') }} />
            </section>
          )}

          <section className="st-card" id="billing" aria-labelledby="billing-h">
            <h2 id="billing-h">Plan and billing</h2>
            {pro ? (
              <>
                <p className="st-sub">
                  You are on <strong>Pro</strong>.{' '}
                  {sub?.status === 'cancelled' && sub.ends_at ? `Your subscription is cancelled. Pro access continues until ${dateFmt(sub.ends_at)}.` : sub?.status === 'past_due' ? 'Your last payment failed. Please update your payment method.' : sub?.renews_at ? `Your plan renews on ${dateFmt(sub.renews_at)}.` : ''}
                </p>
                <BillingButton endpoint="/api/billing/portal" label="Manage subscription" className="btn-primary" />
              </>
            ) : (
              <>
                <p className="st-sub">You are on the free Basic plan. Pro raises every monthly limit and lets you save up to 500 proposals.</p>
                {proEnabled ? <BillingButton endpoint="/api/billing/checkout" label="Upgrade to Pro" className="btn-primary" /> : <Link className="btn-primary" href="/pricing">See Pro</Link>}
                {sub?.status ? <div style={{ marginTop: 12 }}><BillingButton endpoint="/api/billing/portal" label="View past billing" className="btn-ghost" /></div> : null}
              </>
            )}
          </section>

          <section className="st-card" aria-labelledby="security-h">
            <h2 id="security-h">Password</h2>
            <p className="st-sub">Choose a new password for {user.email}.</p>
            <PasswordForm />
          </section>

          <section className="st-card" aria-labelledby="signout-h">
            <h2 id="signout-h">Sign out</h2>
            <form action="/auth/signout" method="post"><button className="btn-ghost" type="submit">Sign out of ProposalHero</button></form>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
