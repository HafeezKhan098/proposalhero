'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  Menu,
  X,
  ArrowUpRight,
  UserRound,
  LayoutDashboard,
  LogOut,
  Settings,
} from 'lucide-react';
import { createClient } from '@/supabase/client';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [user, setUser] = useState<{
    id: string;
    email?: string;
  } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();

      if (!mounted) return;

      if (error) {
        setUser(null);
      } else {
        setUser(
          data.user
            ? {
              id: data.user.id,
              email: data.user.email,
            }
            : null
        );
      }

      setAuthLoading(false);
    }

    void loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      setUser(
        session?.user
          ? {
            id: session.user.id,
            email: session.user.email,
          }
          : null
      );

      setAuthLoading(false);
      setAccountOpen(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert('Unable to sign out. Please try again.');
      return;
    }

    setUser(null);
    setAccountOpen(false);
    setOpen(false);
    window.location.href = '/';
  }

  const email = user?.email || 'Your account';
  const initials = email
    .split('@')[0]
    .split(/[._\-\s]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
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
            <button
              className="nav-link"
              onClick={() => setProduct((value) => !value)}
              aria-expanded={product}
              type="button"
            >
              Product <ChevronDown size={14} />
            </button>

            {product && (
              <div className="dropdown-panel">
                <Link href="/generator" onClick={() => setProduct(false)}>
                  <strong>Proposal Generator</strong>
                  <small>Write client-specific proposals</small>
                </Link>

                <Link href="/prompts" onClick={() => setProduct(false)}>
                  <strong>Prompt Generator</strong>
                  <small>Build prompts for modern AI tools</small>
                </Link>

                <Link href="/features" onClick={() => setProduct(false)}>
                  <strong>All features</strong>
                  <small>Improve, humanize, analyze and score</small>
                </Link>
              </div>
            )}
          </div>

          <Link href="/generator">Proposal Generator</Link>
          <Link href="/prompts">Prompt Generator</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/resources">Resources</Link>
        </nav>

        <div className="nav-actions">
          {authLoading ? (
            <span className="nav-signin" aria-live="polite">
              Loading...
            </span>
          ) : user ? (
            <div className="account-menu" ref={accountRef}>
              <button
                type="button"
                className="account-trigger"
                onClick={() => setAccountOpen((value) => !value)}
                aria-expanded={accountOpen}
                aria-label="Open account menu"
              >
                <span className="account-avatar">
                  {initials || <UserRound size={18} />}
                </span>
                <span className="account-email">{email}</span>
                <ChevronDown size={15} />
              </button>

              {accountOpen && (
                <div className="account-dropdown">
                  <div className="account-dropdown-user">
                    <span className="account-avatar">
                      {initials || <UserRound size={18} />}
                    </span>
                    <div>
                      <strong>Your account</strong>
                      <small>{email}</small>
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setAccountOpen(false)}
                  >
                    <LayoutDashboard size={17} />
                    Dashboard
                  </Link>

                  <Link
                    href="/dashboard"
                    onClick={() => setAccountOpen(false)}
                  >
                    <Settings size={17} />
                    My workspace
                  </Link>

                  <button type="button" onClick={handleSignOut}>
                    <LogOut size={17} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="nav-signin">
                Sign in
              </Link>
              <Link href="/signup" className="nav-cta">
                Start free <ArrowUpRight size={15} />
              </Link>
            </>
          )}

          <button
            className="mobile-trigger"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            type="button"
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mobile-nav">
          <Link href="/generator" onClick={() => setOpen(false)}>
            Proposal Generator <ArrowUpRight size={16} />
          </Link>
          <Link href="/prompts" onClick={() => setOpen(false)}>
            Prompt Generator <ArrowUpRight size={16} />
          </Link>
          <Link href="/features" onClick={() => setOpen(false)}>
            Features <ArrowUpRight size={16} />
          </Link>
          <Link href="/pricing" onClick={() => setOpen(false)}>
            Pricing
          </Link>
          <Link href="/resources" onClick={() => setOpen(false)}>
            Resources
          </Link>
          <Link href="/how-it-works" onClick={() => setOpen(false)}>
            How it works
          </Link>

          <div className="mobile-nav-actions">
            {authLoading ? (
              <span>Loading account...</span>
            ) : user ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)}>
                  <UserRound size={17} /> {email}
                </Link>
                <button type="button" onClick={handleSignOut}>
                  <LogOut size={17} /> Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="nav-signin"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="nav-cta"
                >
                  Start free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}