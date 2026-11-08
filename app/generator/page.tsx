import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Generator from '@/components/Generator';
import { proposalFaqs } from '@/lib/seo-faqs';

export const metadata: Metadata = {
  title: 'AI Proposal Generator for Upwork, Fiverr and Freelancers',
  description: 'Free AI proposal generator for freelancers. Paste a real job brief and get a personalized Upwork, Fiverr or direct-client proposal. Humanize, analyze and score it before you send.',
  alternates: { canonical: '/generator' },
};

const faqJson = JSON.stringify({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: proposalFaqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
}).replace(/</g, '\\u003c');

export default function Page() {
  return (
    <>
      <Header />
      <main className="tool-page">
        <div className="wide-container">
          <div className="tool-page-head">
            <div>
              <div className="eyebrow">Proposal Generator</div>
              <h1>Write the proposal.<br /><em>Keep your voice.</em></h1>
              <p>Paste a client job, add the details you actually want included, and get a proposal you can edit, humanize and send.</p>
            </div>
            <div className="tool-side-note"><strong>Built for</strong><span>Upwork · Fiverr · Direct clients</span><span>3 free tries, no signup</span></div>
          </div>
          <Generator mode="proposal" />
        </div>
        <section className="tool-seo">
          <div className="content-narrow">
            <h2>A freelance proposal generator built around the client brief</h2>
            <p>ProposalHero starts from what the client actually asked for, not from a stock template. It identifies the client priorities, opens with their situation, outlines a clear approach and leaves room for your real skills, experience and portfolio. Then you can use Humanize and improve to remove stiff AI phrasing, Analyze brief to understand the opportunity, and Score proposal to check the pitch before you send it.</p>
            <p>Want to learn the craft as well? Read our guides on <Link href="/resources/how-to-write-an-upwork-proposal">writing an Upwork proposal</Link>, <Link href="/resources/how-to-write-a-fiverr-proposal">writing a Fiverr proposal</Link> and using a <Link href="/resources/freelance-proposal-template">freelance proposal template</Link>.</p>
            <h2>Frequently asked questions</h2>
            <div className="faq-list">{proposalFaqs.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
          </div>
        </section>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJson }} />
      </main>
      <Footer />
    </>
  );
}
