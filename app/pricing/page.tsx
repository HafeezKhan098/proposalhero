import type { Metadata } from 'next';
import Link from 'next/link';
import { Check } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BillingButton from '@/components/BillingButton';
import { BASIC_LIMITS, GUEST_LIMITS, PRO_LIMITS, SAVED_LIMITS } from '@/lib/plans';

export const metadata: Metadata = {
  title: 'Pricing: Free and Pro Plans',
  description: 'Start free with 3 proposals and 3 prompts a month. Upgrade to ProposalHero Pro for $9 a month for much higher limits and a saved library of up to 500 proposals.',
  alternates: { canonical: '/pricing' },
};

const proEnabled = process.env.NEXT_PUBLIC_PRO_ENABLED === 'true';

const basic = [
  `Try it as a guest: ${GUEST_LIMITS.proposal} proposals and ${GUEST_LIMITS.prompt} prompts, no signup`,
  `${BASIC_LIMITS.proposal} proposals per month`,
  `${BASIC_LIMITS.prompt} prompts per month`,
  `${BASIC_LIMITS.improvement} Humanize & improve per month`,
  `${BASIC_LIMITS.analysis} brief analyses per month`,
  `${BASIC_LIMITS.score} proposal scores per month`,
  `Save up to ${SAVED_LIMITS.basic} proposals`,
  'Profile that fills in your skills and portfolio',
];

const pro = [
  `${PRO_LIMITS.proposal} proposals per month`,
  `${PRO_LIMITS.prompt} prompts per month`,
  `${PRO_LIMITS.improvement} Humanize & improve per month`,
  `${PRO_LIMITS.analysis} brief analyses per month`,
  `${PRO_LIMITS.score} proposal scores per month`,
  `Save up to ${SAVED_LIMITS.pro} proposals and track won and lost`,
  'Pro badge on your account',
  'Everything in Basic',
];

const faqs: [string, string][] = [
  ['When do my limits reset?', 'Monthly limits reset on the first day of each calendar month (UTC). Each tool has its own counter, so using one tool never uses up another.'],
  ['What happens if a generation fails?', 'You are not charged for it. If the AI service fails or returns an unusable result, the use is returned to your allowance.'],
  ['Can I cancel Pro?', 'Yes. You can cancel at any time from Manage subscription. If you cancel, Pro access continues until the end of the period you have already paid for.'],
  ['What if I downgrade and have more than 3 saved proposals?', 'Nothing is deleted. You keep everything you saved, but you will need to delete some before saving new ones on the Basic plan.'],
  ['Who processes payments?', 'Payments are processed by Lemon Squeezy. ProposalHero never sees or stores your card details.'],
];

export default function Page() {
  return (
    <>
      <Header />
      <main className="marketing-page">
        <section className="pricing-hero">
          <div className="content-narrow">
            <div className="eyebrow">Pricing</div>
            <h1>Start free.<br /><em>Upgrade when it earns its place.</em></h1>
            <p>Try the full workflow without a card. Pro is for freelancers who pitch and deliver with ProposalHero every week.</p>
          </div>
        </section>

        <section className="pricing-cards">
          <div className="pricing-card-v2">
            <div className="plan-head"><span>BASIC</span><strong>$0</strong><small>free forever</small></div>
            <p>Enough room to test the workflow and decide whether it belongs in your toolkit.</p>
            <ul>{basic.map((x) => <li key={x}><Check size={15} aria-hidden="true" />{x}</li>)}</ul>
            <Link href="/signup" className="plan-btn light">Create free account</Link>
          </div>

          <div className="pricing-card-v2 featured">
            <div className="popular">{proEnabled ? 'PRO' : 'COMING SOON'}</div>
            <div className="plan-head"><span>PRO</span><strong>$9<small>/month</small></strong><small>for regular freelance use</small></div>
            <p>For when proposals, prompts and refinements are part of your weekly routine.</p>
            <ul>{pro.map((x) => <li key={x}><Check size={15} aria-hidden="true" />{x}</li>)}</ul>
            {proEnabled ? (
              <>
                <BillingButton endpoint="/api/billing/checkout" label="Upgrade to Pro" className="plan-btn dark" />
                <small className="checkout-note">Secure checkout by Lemon Squeezy. Cancel any time.</small>
              </>
            ) : (
              <>
                <Link href="/contact" className="plan-btn dark">Ask to be notified</Link>
                <small className="checkout-note">Pro checkout is not open yet. You will not be charged for anything today.</small>
              </>
            )}
          </div>
        </section>

        <section className="pricing-copy">
          <div className="content-narrow">
            <h2>Why there is a free limit</h2>
            <p>Every generation uses real AI infrastructure that costs money to run. The free plan lets you experience the product honestly, and Pro pays for regular use. Limits are published above so there are no surprises.</p>
            <h2>Pricing questions</h2>
            <div className="faq-list">{faqs.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
