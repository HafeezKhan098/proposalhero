'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X, ArrowUpRight, UserRound, LayoutDashboard, LogOut, Settings, FileText, Crown } from 'lucide-react';
import { createClient } from '@/supabase/client';
import PlanBadge from '@/components/PlanBadge';

type Me = { name: string; pro: boolean };

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [me, setMe] = useState<Me | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const accountRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);

  // Session (from Supabase) -----------------------------------------------
  useEffect(() => {
    const supabase = createClient();
    let mounted = true;
    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(!error && data.user ? { id: data.user.id, email: data.user.email } : null);
      setAuthLoading(false);
    }
    void loadUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ? { id: session.user.id, email: session.user.email } : null);
      setAuthLoading(false);
      setAccountOpen(false);
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  // Display name + verified plan (from our server) -------------------------
  const userId = user?.id;
  useEffect(() => {
    if (!userId) { setMe(null); return; }
    let cancelled = false;
    fetch('/api/me', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => { if (!cancelled && j?.user) setMe({ name: j.user.name || '', pro: !!j.user.pro }); })
      .catch(() => { /* header still works without it */ });
    return () => { cancelled = true; };
  }, [userId, pathname]);

  // Close menus on route change, outside click and Escape -------------------
  useEffect(() => { setOpen(false); setProduct(false); setAccountOpen(false); }, [pathname]);
  useEffect(() => {
    function onDown(event: MouseEvent) {
      const t = event.target as Node;
      if (accountRef.current && !accountRef.current.contains(t)) setAccountOpen(false);
      if (productRef.current && !productRef.current.contains(t)) setProduct(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') { setAccountOpen(false); setProduct(false); setOpen(false); }
    }
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, []);

  async function handleSignOut() {
    const { error } = await createClient().auth.signOut();
    if (error) { alert('We could not sign you out. Please try again.'); return; }
    setUser(null); setMe(null); setAccountOpen(false); setOpen(false);
    window.location.href = '/';
  }

  const email = user?.email || '';
  const fallbackName = email.split('@')[0] || 'Account';
  const displayName = me?.name?.trim() || fallbackName;
  const initials = displayName.split(/[._\-\s]+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('');
  const pro = !!me?.pro;

  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <Image src="/logo.png" alt="ProposalHero" width={150} height={40} className="brand-logo" priority />
          <span>ProposalHero</span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <div className="nav-dropdown" ref={productRef}>
            <button className="nav-link" onClick={() => setProduct((v) => !v)} aria-expanded={product} aria-haspopup="true" type="button">
              Product <ChevronDown size={14} aria-hidden="true" />
            </button>
            {product && (
              <div className="dropdown-panel">
                <Link href="/generator"><strong>Proposal Generator</strong><small>Write client-specific proposals</small></Link>
                <Link href="/prompts"><strong>Prompt Generator</strong><small>Build prompts for modern AI tools</small></Link>
                <Link href="/features"><strong>All features</strong><small>Improve, humanize, analyze and score</small></Link>
                <Link href="/resources"><strong>Guides</strong><small>Practical proposal and prompt guides</small></Link>
              </div>
            )}
          </div>
          <Link href="/generator">Proposal Generator</Link>
          <Link href="/prompts">Prompt Generator</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/resources">Guides</Link>
        </nav>

        <div className="nav-actions">
          {authLoading ? (
            <span className="nav-skeleton" aria-hidden="true" />
          ) : user ? (
            <div className="account-menu" ref={accountRef}>
              <button type="button" className="account-trigger" onClick={() => setAccountOpen((v) => !v)} aria-expanded={accountOpen} aria-haspopup="true" aria-label="Open account menu">
                <span className={`account-avatar ${pro ? 'is-pro' : ''}`}>{initials || <UserRound size={18} aria-hidden="true" />}</span>
                <span className="account-email">{displayName}</span>
                {pro ? <PlanBadge pro /> : null}
                <ChevronDown size={15} aria-hidden="true" />
              </button>
              {accountOpen && (
                <div className="account-dropdown">
                  <div className="account-dropdown-user">
                    <span className={`account-avatar ${pro ? 'is-pro' : ''}`}>{initials || <UserRound size={18} aria-hidden="true" />}</span>
                    <div>
                      <strong>{displayName}</strong>
                      <small>{email}</small>
                      <PlanBadge pro={pro} />
                    </div>
                  </div>
                  <Link href="/dashboard"><LayoutDashboard size={17} aria-hidden="true" />Dashboard</Link>
                  <Link href="/proposals"><FileText size={17} aria-hidden="true" />My proposals</Link>
                  <Link href="/settings"><Settings size={17} aria-hidden="true" />Profile and settings</Link>
                  {pro ? (
                    <Link href="/settings#billing"><Crown size={17} aria-hidden="true" />Manage subscription</Link>
                  ) : (
                    <Link href="/pricing" className="menu-upgrade"><Crown size={17} aria-hidden="true" />Upgrade to Pro</Link>
                  )}
                  <button type="button" onClick={handleSignOut}><LogOut size={17} aria-hidden="true" />Sign out</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="nav-signin">Sign in</Link>
              <Link href="/signup" className="nav-cta">Start free <ArrowUpRight size={15} aria-hidden="true" /></Link>
            </>
          )}

          <button className="mobile-trigger" onClick={() => setOpen((v) => !v)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} type="button">
            {open ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mobile-nav">
          <Link href="/generator">Proposal Generator <ArrowUpRight size={16} aria-hidden="true" /></Link>
          <Link href="/prompts">Prompt Generator <ArrowUpRight size={16} aria-hidden="true" /></Link>
          <Link href="/features">Features</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/resources">Guides</Link>
          <Link href="/how-it-works">How it works</Link>
          <div className={`mobile-nav-actions ${user ? 'mobile-nav-account' : ''}`}>
            {authLoading ? null : user ? (
              <>
                <div className="mobile-account">
                  <strong>{displayName}</strong>
                  <PlanBadge pro={pro} />
                </div>
                <Link href="/dashboard"><LayoutDashboard size={17} aria-hidden="true" /> Dashboard</Link>
                <Link href="/proposals"><FileText size={17} aria-hidden="true" /> My proposals</Link>
                <Link href="/settings"><Settings size={17} aria-hidden="true" /> Profile and settings</Link>
                {!pro ? <Link href="/pricing"><Crown size={17} aria-hidden="true" /> Upgrade to Pro</Link> : null}
                <button type="button" onClick={handleSignOut}><LogOut size={17} aria-hidden="true" /> Sign out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="nav-signin">Sign in</Link>
                <Link href="/signup" className="nav-cta">Start free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
