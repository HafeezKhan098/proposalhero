import Link from 'next/link';
export default function Footer(){return <footer className="site-footer">
  <div className="footer-main">
    <div className="footer-brand"><Link href="/" className="brand"><span>Proposal</span>Hero</Link><p>AI tools for independent freelancers. Win the work with a better proposal, then use better prompts to deliver it.</p><div className="footer-note">Built for freelancers. Designed for real client work.</div></div>
    <div className="footer-col"><h4>Product</h4><Link href="/generator">Proposal Generator</Link><Link href="/prompts">Prompt Generator</Link><Link href="/features">Features</Link><Link href="/how-it-works">How it works</Link></div>
    <div className="footer-col"><h4>Explore</h4><Link href="/pricing">Pricing</Link><Link href="/resources">Resources</Link><Link href="/contact">Contact</Link><Link href="/signup">Start free</Link></div>
    <div className="footer-col"><h4>Legal</h4><Link href="/privacy">Privacy Policy</Link><Link href="/terms">Terms of Service</Link><Link href="/login">Sign in</Link></div>
  </div>
  <div className="footer-bottom"><span>© 2026 ProposalHero</span><span>Human-first AI for freelancers</span></div>
</footer>}
