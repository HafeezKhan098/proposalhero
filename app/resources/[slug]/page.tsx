import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getGuide, guides } from '@/lib/guides';

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://proposalhero.vercel.app').replace(/\/$/, '');

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  return {
    title: g.title,
    description: g.description,
    alternates: { canonical: `/resources/${g.slug}` },
    openGraph: { type: 'article', title: g.title, description: g.description, url: `${SITE}/resources/${g.slug}`, images: [{ url: '/og.png', width: 1200, height: 630, alt: g.title }] },
  };
}

const json = (o: unknown) => JSON.stringify(o).replace(/</g, '\\u003c');

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();

  const url = `${SITE}/resources/${g.slug}`;
  const article = {
    '@context': 'https://schema.org', '@type': 'Article', headline: g.title, description: g.description,
    datePublished: g.updated, dateModified: g.updated, mainEntityOfPage: url,
    author: { '@type': 'Organization', name: 'ProposalHero' },
    publisher: { '@type': 'Organization', name: 'ProposalHero', logo: { '@type': 'ImageObject', url: `${SITE}/logo.png` } },
  };
  const crumbs = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: `${SITE}/resources` },
      { '@type': 'ListItem', position: 3, name: g.h1, item: url },
    ],
  };
  const faq = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: g.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };
  const related = g.related.map((s) => getGuide(s)).filter((x): x is NonNullable<typeof x> => !!x);
  const isPrompt = g.category === 'Prompting';

  return (
    <>
      <Header />
      <main className="marketing-page">
        <article className="guide">
          <div className="content-narrow">
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/resources">Guides</Link>
            </nav>
            <div className="eyebrow">{g.category} · {g.minutes} min read</div>
            <h1>{g.h1}</h1>
            <p className="guide-intro">{g.intro}</p>
            <p className="guide-updated">Last updated {new Date(g.updated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}</p>

            {g.sections.map((s) => (
              <section key={s.heading} className="guide-section">
                <h2>{s.heading}</h2>
                {s.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
                {s.example ? <pre className="guide-example">{s.example}</pre> : null}
                {s.bullets ? <ul>{s.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul> : null}
              </section>
            ))}

            <aside className="guide-cta">
              <h2>{isPrompt ? 'Turn a rough task into a structured prompt' : 'Turn the job post into a first draft'}</h2>
              <p>{isPrompt ? 'Describe the task in plain words, pick your AI tool and copy a structured prompt. Free to try, no card required.' : 'Paste the real client brief and get a proposal you can edit, humanize and send. Free to try, no card required.'}</p>
              <Link href={isPrompt ? '/prompts' : '/generator'} className="btn-primary">{isPrompt ? 'Open Prompt Generator' : 'Open Proposal Generator'} <ArrowRight size={15} aria-hidden="true" /></Link>
            </aside>

            <section className="guide-section">
              <h2>Frequently asked questions</h2>
              <div className="faq-list">
                {g.faqs.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
              </div>
            </section>

            {related.length > 0 ? (
              <section className="guide-related">
                <h2>Keep reading</h2>
                <ul>{related.map((r) => <li key={r.slug}><Link href={`/resources/${r.slug}`}>{r.title}</Link></li>)}</ul>
              </section>
            ) : null}
          </div>
        </article>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json(article) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json(crumbs) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json(faq) }} />
      </main>
      <Footer />
    </>
  );
}
