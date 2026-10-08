'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, Menu, X, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState(false);
  return <header className="site-header">
    <div className="nav-wrap">
      <Link href="/" className="brand">
        <Image
          src="/logo.png"
          alt="ProposalHero"
          width={150}
          height={40}
          className="brand-logo"

        />
        <span>ProposalHero</span>
      </Link>
      <nav className="desktop-nav" aria-label="Primary navigation">
        <div className="nav-dropdown">
          <button className="nav-link" onClick={() => setProduct(v => !v)} aria-expanded={product}>Product <ChevronDown size={14} /></button>
          {product && <div className="dropdown-panel">
            <Link href="/generator" onClick={() => setProduct(false)}><strong>Proposal Generator</strong><small>Write client-specific proposals</small></Link>
            <Link href="/prompts" onClick={() => setProduct(false)}><strong>Prompt Generator</strong><small>Build prompts for modern AI tools</small></Link>
            <Link href="/features" onClick={() => setProduct(false)}><strong>All features</strong><small>Improve, humanize, analyze and score</small></Link>
          </div>}
        </div>
        <Link href="/generator">Proposal Generator</Link>
        <Link href="/prompts">Prompt Generator</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/resources">Resources</Link>
      </nav>
      <div className="nav-actions">
        <Link href="/login" className="nav-signin">Sign in</Link>
        <Link href="/signup" className="nav-cta">Start free <ArrowUpRight size={15} /></Link>
        <button className="mobile-trigger" onClick={() => setOpen(v => !v)} aria-label="Open menu" aria-expanded={open}>{open ? <X size={21} /> : <Menu size={21} />}</button>
      </div>
    </div>
    {open && <div className="mobile-nav">
      <Link href="/generator" onClick={() => setOpen(false)}>Proposal Generator <ArrowUpRight size={16} /></Link>
      <Link href="/prompts" onClick={() => setOpen(false)}>Prompt Generator <ArrowUpRight size={16} /></Link>
      <Link href="/features" onClick={() => setOpen(false)}>Features <ArrowUpRight size={16} /></Link>
      <Link href="/pricing" onClick={() => setOpen(false)}>Pricing</Link>
      <Link href="/resources" onClick={() => setOpen(false)}>Resources</Link>
      <Link href="/how-it-works" onClick={() => setOpen(false)}>How it works</Link>
      <div className="mobile-nav-actions"><Link href="/login" onClick={() => setOpen(false)} className="nav-signin">Sign in</Link><Link href="/signup" onClick={() => setOpen(false)} className="nav-cta">Start free</Link></div>
    </div>}
  </header>
}
