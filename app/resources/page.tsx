import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
export const metadata: Metadata = { title: 'Resources for Freelancers', description: 'Practical proposal, AI and prompting resources for freelancers who want better client conversations and delivery.', alternates: { canonical: '/resources' } };
const articles = [
  ['Proposal writing', 'How to write a freelance proposal that feels specific', 'A practical structure for turning a job post into a response that addresses the client situation instead of repeating your résumé.'],
  ['AI workflow', 'How to use AI without sounding like AI', 'Use AI for structure and speed, then add your own judgment, evidence and voice before you send anything.'],
  ['Prompting', 'The anatomy of a useful AI prompt', 'A useful prompt gives the model an objective, context, constraints, quality bar and a clear expected output.'],
  ['Freelancing', 'Questions to ask before you send a proposal', 'A short pre-send checklist for client fit, scope, credibility, next step and whether the proposal actually responds to the brief.'],
  ['Proposal review', 'How to spot a generic proposal', 'If the same message could be sent to ten unrelated clients, it probably needs more context and a stronger opening.'],
  ['Delivery', 'From winning the job to doing the work', 'Once a client says yes, use structured prompts to turn requirements into plans, drafts, code, research and QA.'],
] as const;
export default function Page(){return <><Header/><main className="marketing-page"><section className="simple-hero"><div className="content-narrow"><div className="eyebrow">Resources</div><h1>Useful ideas for<br/><em>better freelance work.</em></h1><p>Short, practical guides for proposals, prompting and AI-assisted delivery.</p></div></section><section className="resource-grid"><div className="content-narrow grid-resource">{articles.map(([cat,title,text])=><article key={title}><span>{cat}</span><h2>{title}</h2><p>{text}</p><Link href="/generator">Try the workflow <ArrowRight size={14}/></Link></article>)}</div></section></main><Footer/></>}
