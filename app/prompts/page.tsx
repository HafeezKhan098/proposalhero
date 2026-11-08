import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Generator from '@/components/Generator';
import { promptFaqs } from '@/lib/seo-faqs';

export const metadata: Metadata = {
  title: 'AI Prompt Generator for ChatGPT, Claude, Gemini and More',
  description: 'Free AI prompt generator. Turn a rough task into a structured prompt for ChatGPT, Claude, Gemini, Cursor, Lovable, v0 and Bolt across coding, design, SEO, marketing and more.',
  alternates: { canonical: '/prompts' },
};

const faqJson = JSON.stringify({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: promptFaqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
}).replace(/</g, '\\u003c');

export default function Page() {
  return (
    <>
      <Header />
      <main className="tool-page">
        <div className="wide-container">
          <div className="tool-page-head">
            <div>
              <div className="eyebrow">Prompt Generator</div>
              <h1>Better prompts.<br /><em>Less prompt engineering.</em></h1>
              <p>Describe the task, choose the AI tool and get a structured prompt with context, constraints, quality criteria and expected output.</p>
            </div>
            <div className="tool-side-note"><strong>Works with</strong><span>ChatGPT · Claude · Gemini</span><span>Cursor · Lovable · v0 · Bolt</span></div>
          </div>
          <Generator mode="prompt" />
        </div>
        <section className="tool-seo">
          <div className="content-narrow">
            <h2>One prompt generator for the AI tools freelancers actually use</h2>
            <p>Choose from coding, web design, UI and UX, app development, marketing, SEO, content, social media, image generation, research, AI agents, freelancing and productivity. ProposalHero turns your rough instructions into a reusable prompt that you can copy into your preferred AI tool and refine with your own context.</p>
            <div className="seo-pills">{['Web Design', 'Coding', 'UI/UX', 'SEO', 'Marketing', 'Content', 'AI Agents', 'Freelancing'].map((x) => <span key={x}>{x}</span>)}</div>
            <p>New to prompting? Read our guide on <Link href="/resources/how-to-write-better-ai-prompts">how to write better AI prompts</Link>, with a simple structure and before-and-after examples.</p>
            <h2>Frequently asked questions</h2>
            <div className="faq-list">{promptFaqs.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
          </div>
        </section>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJson }} />
      </main>
      <Footer />
    </>
  );
}
