import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Generator from '@/components/Generator';
import { ArrowRight, Check, ChevronDown, ShieldCheck, Sparkles, Target } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Proposal Generator for Freelancers | ProposalHero',
  description: 'AI proposal generator for freelancers. Create personalized Upwork and Fiverr proposals, humanize AI-written proposals, analyze client briefs and score your pitch before you send it.',
  alternates: { canonical: '/' },
};

const faqs = [
  ['Is ProposalHero free?', 'Yes. Guests can try the Proposal Generator and Prompt Generator before creating an account. Free accounts get a monthly allowance and a usage dashboard; Pro is being prepared for heavier use.'],
  ['Does it work for Upwork and Fiverr?', 'Yes. Choose Upwork, Fiverr or direct client when creating a proposal. The generator uses the job description and the details you provide rather than a generic template.'],
  ['Can ProposalHero humanize my proposal?', 'Yes. After generating a proposal, use Humanize & improve to make the draft more natural, conversational and client-specific while preserving the substance.'],
  ['Will it invent my experience?', 'The proposal engine is instructed not to invent credentials, portfolio results, prices, dates or client facts. Always review the final proposal before sending it.'],
  ['What is the Prompt Generator for?', 'It turns a rough task into a structured prompt for tools such as ChatGPT, Claude, Gemini, Cursor, Lovable, v0 and Bolt.'],
  ['How is this different from ChatGPT?', 'ProposalHero packages the freelance workflow around the job: proposal writing, humanizing, analysis, scoring and reusable AI prompts. You spend less time designing prompts and more time reviewing useful output.'],
  ['Can I cancel Pro?', 'Yes. Pro checkout and subscription management are handled by Lemon Squeezy. You can cancel according to the subscription terms shown at checkout.'],
  ['Do I need to enter my portfolio or experience?', 'No. Those fields are optional. If you leave them blank, ProposalHero avoids making claims about your background.'],
] as const;

const faqJson = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })),
});
const softwareJson = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'ProposalHero',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description: 'AI proposal generator and prompt tools for freelancers.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
});

export default function Home() {
  return <>
    <Header />
    <main>
      <section className="hero-v2">
        <div className="hero-v2-inner">
          <div>
            <div className="eyebrow light">AI proposal generator for freelancers</div>
            <h1>Win the work.<br /><em>Then do the work.</em></h1>
            <p>Turn a real client brief into a proposal that sounds like you—not a template. Improve it, humanize it, understand the brief and build better AI prompts when the project starts.</p>
            <div className="hero-links">
              <a href="#proposal-generator" className="hero-primary">Create a proposal <ArrowRight size={17} /></a>
              <Link href="/prompts" className="hero-secondary">Explore Prompt Generator</Link>
            </div>
            <div className="hero-proof">
              <span><Check size={14} /> 3 proposal tries</span>
              <span><Check size={14} /> 3 prompt tries</span>
              <span><Check size={14} /> No card required</span>
            </div>
          </div>
          <div className="hero-aside">
            <div className="hero-card">
              <div className="hero-card-top"><span className="live-dot" /> ProposalHero workspace <span>01</span></div>
              <div className="hero-card-body">
                <span className="mini-label">Client brief</span>
                <strong>Website redesign for a growing studio</strong>
                <p>Modernize the site, improve mobile UX and make the service offer easier to understand.</p>
                <div className="hero-card-bottom"><span>Understood</span><span>Personalized</span><span>Ready to edit</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="proposal-generator" className="product-section">
        <div className="wide-container">
          <div className="section-intro">
            <div><div className="eyebrow">The product</div><h2>Start with the proposal.</h2></div>
            <p>Everything you need to go from a client job post to a proposal you can actually review and send.</p>
          </div>
          <Generator mode="proposal" />
        </div>
      </section>

      <section className="seo-section">
        <div className="content-narrow">
          <div className="eyebrow">AI proposal generator for freelancers</div>
          <h2>Write better Upwork and Fiverr proposals without starting from a blank page.</h2>
          <p>ProposalHero is an AI proposal generator and freelance proposal writer built for real client work. Paste an Upwork job, Fiverr brief or direct-client project and get a concise proposal based on what the client actually asked for. Then humanize the draft, analyze the brief and score the proposal before you send it.</p>
          <div className="seo-keywords"><span>AI proposal generator</span><span>Upwork proposal generator</span><span>Fiverr proposal generator</span><span>freelance proposal writer</span><span>humanize AI proposals</span><span>proposal improvement</span></div>
          <div className="seo-grid">
            <div><h3><Target size={18} /> Read the opportunity</h3><p>Identify the client&apos;s goals, constraints, priorities and the details worth addressing in your opening.</p></div>
            <div><h3><Sparkles size={18} /> Write for the client</h3><p>Generate a concise proposal with an opening, understanding, approach, deliverables and next step.</p></div>
            <div><h3><ShieldCheck size={18} /> Keep it credible</h3><p>No fabricated experience or portfolio claims. Add your own evidence where it belongs.</p></div>
          </div>
        </div>
      </section>

      <section className="feature-strip">
        <div className="wide-container"><div className="feature-strip-grid">
          <div><span className="feature-number">01</span><h3>Humanize</h3><p>Remove stiff AI phrasing and make the proposal sound more like a capable person who actually read the brief.</p></div>
          <div><span className="feature-number">02</span><h3>Analyze</h3><p>See client priorities, hidden concerns, useful questions and the strongest angle for your pitch.</p></div>
          <div><span className="feature-number">03</span><h3>Score</h3><p>Get an honest quality check for clarity, personalization, credibility, specificity and the call to action.</p></div>
          <div><span className="feature-number">04</span><h3>Build</h3><p>Use Prompt Generator to turn the work you won into structured prompts for the AI tools you already use.</p></div>
        </div></div>
      </section>

      <section className="comparison-section"><div className="content-narrow">
        <div className="eyebrow">Why specificity matters</div><h2>Generic proposals are easy to ignore.</h2>
        <div className="compare-grid">
          <div className="compare-card bad"><span>Generic</span><p>“Hi, I am a professional developer with years of experience. I can build a high-quality website for you. Please check my portfolio.”</p><ul><li>Could be sent to anyone</li><li>Talks mostly about the freelancer</li><li>No evidence of understanding</li></ul></div>
          <div className="compare-card good"><span>Job-specific</span><p>“Your current site has the right service offer, but the mobile journey makes it harder for a first-time visitor to understand what happens next. I&apos;d start by simplifying that path…”</p><ul><li>Starts with the client&apos;s situation</li><li>Shows a concrete approach</li><li>Creates a useful next step</li></ul></div>
        </div>
      </div></section>

      <section className="prompt-callout"><div className="wide-container"><div><div className="eyebrow light">And when you win?</div><h2>Use AI to do the work better.</h2><p>Prompt Generator creates structured prompts for ChatGPT, Claude, Gemini, Cursor, Lovable, v0 and Bolt—without making you become a prompt engineer first.</p></div><Link href="/prompts" className="hero-primary">Open Prompt Generator <ArrowRight size={17} /></Link></div></section>

      <section className="pricing-preview"><div className="content-narrow">
        <div className="section-intro"><div><div className="eyebrow">Simple pricing</div><h2>Start free. Upgrade when it earns its place.</h2></div><Link href="/pricing" className="text-link">See full pricing <ArrowRight size={15} /></Link></div>
        <div className="pricing-mini"><div><span>FREE</span><strong>$0</strong><p>Try proposals and prompts before you commit.</p><ul><li>3 guest proposals</li><li>3 guest prompts</li><li>Free account: 3 proposals and 3 prompts / month</li></ul></div><div className="pricing-mini-pro"><span>PRO</span><strong>$9<span>/month</span></strong><p>For freelancers who use the workflow regularly.</p><ul><li>Generous proposal & prompt usage</li><li>More refinement, analysis & scoring</li><li>Full workspace and history</li></ul></div></div>
      </div></section>

      <section className="faq-section"><div className="content-narrow"><div className="eyebrow">FAQ</div><h2>Questions freelancers usually ask.</h2><div className="faq-list">{faqs.map(([q, a]) => <details key={q}><summary>{q}<ChevronDown size={17} /></summary><p>{a}</p></details>)}</div></div></section>
      <section className="final-cta"><div><div className="eyebrow light">Your next client is waiting</div><h2>Give the brief a better first response.</h2><p>Start with three proposal generations. No credit card required.</p><a href="#proposal-generator" className="hero-primary">Write a proposal <ArrowRight size={17} /></a></div></section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: softwareJson }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJson }} />
    </main>
    <Footer />
  </>;
}
