import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
export default function AuthShell({title,eyebrow,description,children,footer}:{title:string;eyebrow:string;description:string;children:React.ReactNode;footer:React.ReactNode}){
 return <main className="auth-page"><div className="auth-left"><Link href="/" className="auth-brand"><span>Proposal</span>Hero</Link><div className="auth-copy"><div className="eyebrow light">{eyebrow}</div><h1>{title}</h1><p>{description}</p><div className="auth-points"><div><ShieldCheck size={17}/><span>Your account and saved work stay protected.</span></div><div><ShieldCheck size={17}/><span>Start free. Upgrade only when you need more.</span></div></div></div><Link href="/" className="back-home"><ArrowLeft size={15}/> Back to ProposalHero</Link></div><div className="auth-right"><div className="auth-card-v2">{children}{footer}</div></div></main>
}
