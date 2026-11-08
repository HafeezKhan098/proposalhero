import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { guides } from '@/lib/guides';

export const metadata: Metadata = {
  title: 'Freelance Proposal and AI Prompt Guides',
  description: 'Practical guides for freelancers: how to write Upwork and Fiverr proposals, a freelance proposal template, how to make AI proposals sound human and how to write better AI prompts.',
  alternates: { canonical: '/resources' },
};

export default function Page() {
  return (
    <>
      <Header />
      <main className="marketing-page">
        <section className="simple-hero">
          <div className="content-narrow">
            <div className="eyebrow">Guides</div>
            <h1>Useful ideas for<br /><em>better freelance work.</em></h1>
            <p>Practical, honest guides on proposals, prompts and working with AI. No hype, and no promises that any one message will win a job.</p>
          </div>
        </section>
        <section className="resource-grid">
          <div className="content-narrow grid-resource">
            {guides.map((g) => (
              <article key={g.slug}>
                <span>{g.category} · {g.minutes} min read</span>
                <h2><Link href={`/resources/${g.slug}`}>{g.title}</Link></h2>
                <p>{g.description}</p>
                <Link href={`/resources/${g.slug}`}>Read the guide <ArrowRight size={14} aria-hidden="true" /></Link>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
