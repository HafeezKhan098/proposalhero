'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const FREE_LIMIT = 3;
  const [brief, setBrief] = useState('');
  const [humanBrief, setHumanBrief] = useState('');
  const [niche, setNiche] = useState('logo design');
  const [tone, setTone] = useState('friendly and professional');
  const [proposal, setProposal] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('generate');
  const [humanScore, setHumanScore] = useState(0);
  const [aiRisk, setAiRisk] = useState('');
  const [naturalness, setNaturalness] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    const today = new Date().toDateString();
    const stored = localStorage.getItem('ph_usage');
    if (stored) {
      const { date, count } = JSON.parse(stored);
      if (date === today) setUsageCount(count);
      else localStorage.setItem('ph_usage', JSON.stringify({ date: today, count: 0 }));
    }
  }, []);

  if (!mounted) return null;

  const wordCount = proposal.trim() === '' ? 0 : proposal.trim().split(/\s+/).length;
  const currentBrief = mode === 'humanize' ? humanBrief : brief;
  const setCurrentBrief = mode === 'humanize' ? setHumanBrief : setBrief;

  async function generate() {
    if (!currentBrief.trim()) return;
    if (usageCount >= FREE_LIMIT) { setShowPaywall(true); return; }
    setLoading(true);
    setProposal('');
    setError('');
    setHumanScore(0);
    setAiRisk('');
    setNaturalness(0);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief: currentBrief, niche, tone, mode })
      });
      const data = await res.json();
      if (data.error) {
        setError('Something went wrong: ' + data.error);
      } else {
        setProposal(data.proposal);
        const today = new Date().toDateString();
        const newCount = usageCount + 1;
        setUsageCount(newCount);
        localStorage.setItem('ph_usage', JSON.stringify({ date: today, count: newCount }));
        if (data.mode === 'humanize') {
          setHumanScore(data.humanScore);
          setAiRisk(data.aiRisk);
          setNaturalness(data.naturalness);
        }
      }
    } catch {
      setError('Could not connect. Check your internet and try again.');
    }
    setLoading(false);
  }

  async function copy() {
    await navigator.clipboard.writeText(proposal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function getRiskColor(risk: string) {
    if (risk === 'Low') return '#22c55e';
    if (risk === 'Medium') return '#f59e0b';
    return '#ef4444';
  }

  const faqs = [
    { q: 'Is ProposalHero really free?', a: 'Yes — you get 3 free proposals every day with no signup needed. For unlimited proposals upgrade to Pro for $9/month.' },
    { q: 'Will my proposals sound like AI?', a: 'No. Our AI is specifically trained to write like a real human freelancer. Use the Humanize mode to remove any AI patterns from existing proposals.' },
    { q: 'Does it work for Upwork too?', a: 'Yes. ProposalHero works for both Fiverr and Upwork job descriptions. Just paste the job and select your niche.' },
    { q: 'What niches are supported?', a: 'Logo design, web development, copywriting, video editing, SEO, social media, translation, graphic design, voiceover, data entry, WordPress, mobile development and more.' },
    { q: 'How is this different from ChatGPT?', a: 'ChatGPT writes generic proposals. ProposalHero reads between the lines of the job post, identifies what the client actually needs, and writes a specific proposal that gets replies.' },
    { q: 'Can I cancel my subscription anytime?', a: 'Yes. Cancel anytime from your Lemon Squeezy dashboard. No questions asked.' },
  ];

  return (
    <div className="page">
      {/* NAV */}
      <nav className="nav">
        <div className="logo">
          <img src="/logo1.png" alt="ProposalHero" style={{ height: '40px', width: 'auto' }} />
        </div>
        <div className="nav-links">
          <a href="#how" className="nav-link">How it works</a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <a href="#faq" className="nav-link">FAQ</a>

        </div>
        <a href="https://proposalhero.lemonsqueezy.com/checkout/buy/f42e9931-e975-469b-822f-916086ddbafc?discount=0" target="_blank" className="upgrade-btn">Upgrade $9/mo</a>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-tag">✦ AI-Powered for Fiverr & Upwork Freelancers</div>
        <h1>Stop Losing Fiverr Jobs<br /><span>Win More With AI</span></h1>
        <p>Generate proposals that feel human, specific, and win the order. Even works with just a few words.</p>
      </div>

      {/* TOOL CARD */}
      <div className="card-wrap">

        {showPaywall && (
          <div className="paywall-overlay">
            <div className="paywall-card">
              <div className="paywall-icon">🔒</div>
              <h2 className="paywall-title">Free limit reached</h2>
              <p className="paywall-desc">You have used your 3 free proposals today. Upgrade to get unlimited proposals every day.</p>
              <div className="paywall-features">
                <div className="paywall-feature">✓ Unlimited proposals</div>
                <div className="paywall-feature">✓ Humanize mode</div>
                <div className="paywall-feature">✓ All future features</div>
              </div>
              <a href="https://proposalhero.lemonsqueezy.com/checkout/buy/f42e9931-e975-469b-822f-916086ddbafc?discount=0" target="_blank" className="paywall-btn">Upgrade for $9/month</a>
              <button className="paywall-close" onClick={() => setShowPaywall(false)}>Maybe later</button>
            </div>
          </div>
        )}

        <div className="card">
          <div className="mode-tabs">
            <button className={`mode-tab ${mode === 'generate' ? 'active' : ''}`} onClick={() => { setMode('generate'); setProposal(''); setError(''); }}>
              ⚡ Generate Proposal
            </button>
            <button className={`mode-tab ${mode === 'humanize' ? 'active' : ''}`} onClick={() => { setMode('humanize'); setProposal(''); setError(''); }}>
              ✦ Humanize Proposal
            </button>
          </div>

          {mode === 'generate' && (
            <>
              <label>Your Fiverr Category</label>
              <select value={niche} onChange={e => setNiche(e.target.value)}>
                <option value="logo design">Logo Design</option>
                <option value="web development">Web Development</option>
                <option value="copywriting">Copywriting</option>
                <option value="video editing">Video Editing</option>
                <option value="social media management">Social Media Management</option>
                <option value="SEO">SEO</option>
                <option value="translation">Translation</option>
                <option value="graphic design">Graphic Design</option>
                <option value="voiceover">Voiceover</option>
                <option value="data entry">Data Entry</option>
                <option value="WordPress">WordPress</option>
                <option value="mobile app development">Mobile App Development</option>
                <option value="photo editing">Photo Editing</option>
              </select>
              <label>Proposal Tone</label>
              <select value={tone} onChange={e => setTone(e.target.value)}>
                <option value="friendly and professional">Friendly & Professional</option>
                <option value="confident and direct">Confident & Direct</option>
                <option value="warm and conversational">Warm & Conversational</option>
                <option value="expert and authoritative">Expert & Authoritative</option>
              </select>
            </>
          )}

          <label>{mode === 'humanize' ? 'Paste your existing proposal to humanize' : 'Paste Client Job Description'}</label>
          <textarea
            value={currentBrief}
            onChange={e => setCurrentBrief(e.target.value)}
            placeholder={mode === 'humanize' ? 'Paste any AI-generated proposal here...' : 'Paste the Fiverr job here... even a few words works.'}
            rows={6}
          />
          <div className="char-count">{currentBrief.length} characters</div>
          {error && <div className="error-box">{error}</div>}

          <div className="usage-bar">
            <span className="usage-text">
              {usageCount >= FREE_LIMIT ? '🔒 Daily limit reached — upgrade for unlimited' : `✦ ${FREE_LIMIT - usageCount} free proposal${FREE_LIMIT - usageCount === 1 ? '' : 's'} remaining today`}
            </span>
          </div>

          <button className="btn" onClick={generate} disabled={loading || !currentBrief.trim()}>
            {loading ? <><div className="spinner"></div>{mode === 'humanize' ? 'Humanizing...' : 'Writing your proposal...'}</> : <>{mode === 'humanize' ? '✦ Humanize Now' : '⚡ Generate Winning Proposal'}</>}
          </button>

          {proposal && (
            <div className="output">
              {mode === 'humanize' && humanScore > 0 && (
                <div className="scores">
                  <div className="score-card">
                    <div className="score-label">Human Score</div>
                    <div className="score-bar-wrap"><div className="score-bar" style={{ width: `${humanScore}%`, background: '#22c55e' }}></div></div>
                    <div className="score-val" style={{ color: '#22c55e' }}>{humanScore}/100</div>
                  </div>
                  <div className="score-card">
                    <div className="score-label">Naturalness</div>
                    <div className="score-bar-wrap"><div className="score-bar" style={{ width: `${naturalness}%`, background: '#3b82f6' }}></div></div>
                    <div className="score-val" style={{ color: '#3b82f6' }}>{naturalness}/100</div>
                  </div>
                  <div className="score-card">
                    <div className="score-label">AI Detection Risk</div>
                    <div className="risk-badge" style={{ background: getRiskColor(aiRisk) + '20', color: getRiskColor(aiRisk), border: `1px solid ${getRiskColor(aiRisk)}40` }}>{aiRisk}</div>
                  </div>
                </div>
              )}
              <div className="output-header">
                <div className="output-label"><div className="dot"></div>{mode === 'humanize' ? 'Humanized Proposal' : 'Your Proposal'}</div>
                <div className="output-actions">
                  <span className={`word-count ${wordCount > 150 ? 'over' : ''}`}>{wordCount} / 150 words</span>
                  <button className="copy-btn" onClick={copy}>{copied ? '✓ Copied!' : '⧉ Copy'}</button>
                </div>
              </div>
              <div className="output-text">{proposal}</div>
              <div className="output-footer">
                <p className="tip">✦ Personalize 1–2 lines before sending</p>
                <button className="regenerate-btn" onClick={generate} disabled={loading}>{loading ? 'Writing...' : '↻ Try again'}</button>
              </div>
            </div>
          )}
        </div>

        {/* FEATURES ROW */}
        <div className="features">
          {[
            { icon: '🎯', title: 'Reads the brief', desc: 'Finds what clients really want' },
            { icon: '✦', title: 'Humanize mode', desc: 'Remove AI patterns instantly' },
            { icon: '🏆', title: 'Wins more jobs', desc: 'Sounds human, not like AI' },
          ].map((f, i) => (
            <div className="feature" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      id="how"<div style={{ background: '#040d21' }} id="how"></div>
      <div className="section-divider" />
      <div style={{ background: '#040d21' }}>
        <div className="section section-center">
          <div className="hero-tag" style={{ marginBottom: '16px' }}>Simple Process</div>
          <h2 className="section-title">How ProposalHero Works</h2>
          <p className="section-sub">Three steps to a winning proposal. No learning curve.</p>
          <div className="steps">
            {[
              { n: '1', title: 'Paste the job', desc: 'Copy any Fiverr or Upwork job description and paste it. Even a few words is enough.' },
              { n: '2', title: 'Pick your style', desc: 'Choose your niche and the tone you want. Friendly, confident, expert — you decide.' },
              { n: '3', title: 'Generate and win', desc: 'Get a human-sounding proposal in 10 seconds. Copy it, personalize one line, and send.' },
            ].map((s, i) => (
              <div className="step-card" key={i}>
                <div className="step-number">{s.n}</div>
                <div className="step-card-title">{s.title}</div>
                <div className="step-card-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BEFORE AFTER */}
      <div className="section-divider" />
      <div style={{ background: '#040d21' }}>
        <div className="section section-center">
          <div className="hero-tag" style={{ marginBottom: '16px' }}>See The Difference</div>
          <h2 className="section-title">Before vs After ProposalHero</h2>
          <p className="section-sub">This is the difference between getting ignored and getting hired.</p>
          <div className="before-after">
            <div className="ba-card bad">
              <span className="ba-label bad">❌ Typical proposal</span>
              <p className="ba-text">"Hi! I am a professional logo designer with 5 years of experience. I can make a beautiful logo for you. Please check my portfolio. I will deliver high quality work on time."</p>
              <ul className="ba-points">
                <li>Starts with "Hi I am a professional"</li>
                <li>Copy pasted to every client</li>
                <li>Talks about skills not the client</li>
                <li>Zero personalization</li>
                <li>Gets ignored instantly</li>
              </ul>
            </div>
            <div className="ba-card good">
              <span className="ba-label good">✓ ProposalHero proposal</span>
              <p className="ba-text">"Opening a bakery next month means your logo needs to work across signage, packaging, and social before day one. For Sweet Crumbs, I'm thinking a hand-lettered wordmark — modern but warm."</p>
              <ul className="ba-points">
                <li>References their specific situation</li>
                <li>Shows real thinking about their project</li>
                <li>Gives a concrete creative idea</li>
                <li>Ends with a smart question</li>
                <li>Gets replies and orders</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div className="section-divider" />
      <div style={{ background: '#040d21' }}>
        <div className="section section-center">
          <div className="hero-tag" style={{ marginBottom: '16px' }}>Real Results</div>
          <h2 className="section-title">Freelancers Love ProposalHero</h2>
          <p className="section-sub">Join thousands of freelancers already winning more jobs.</p>
          <div className="testimonials">
            {[
              { text: 'I used to spend 20 minutes on each proposal. Now I generate one in 10 seconds and just personalize two lines. My response rate went from 10% to 35%.', name: 'Ahmed K.', role: 'Logo Designer — Fiverr Level 2' },
              { text: 'The Humanize mode is incredible. I paste my ChatGPT proposal and it comes out sounding like me. Clients actually reply now.', name: 'Sarah M.', role: 'Copywriter — Upwork Top Rated' },
              { text: 'Best free tool I have found for freelancing. The proposals actually read the job post instead of just being generic templates.', name: 'Raj P.', role: 'Web Developer — Fiverr Pro' },
            ].map((t, i) => (
              <div className="testi-card" key={i}>
                <div className="testi-stars">★★★★★</div>
                <p className="testi-text">"{t.text}"</p>
                <div className="testi-author">
                  <div className="testi-avatar">{t.name[0]}</div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRICING */}
      id="pricing"<div style={{ background: '#040d21' }} id="pricing"></div>
      <div className="section-divider" />
      <div style={{ background: '#040d21' }}>
        <div className="section section-center">
          <div className="hero-tag" style={{ marginBottom: '16px' }}>Simple Pricing</div>
          <h2 className="section-title">Start Free. Upgrade When Ready.</h2>
          <p className="section-sub">No hidden fees. No credit card required to start.</p>
          <div className="pricing">
            <div className="price-card">
              <div className="price-name">Free</div>
              <div className="price-amount">$0<span>/month</span></div>
              <div className="price-desc">Perfect for trying it out</div>
              <ul className="price-features">
                <li>3 proposals per day</li>
                <li>Generate & Humanize modes</li>
                <li>All niches supported</li>
                <li>Copy with one click</li>
              </ul>
              <button className="price-btn free" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Get Started Free</button>
            </div>
            <div className="price-card popular">
              <div className="popular-badge">Most Popular</div>
              <div className="price-name">Pro</div>
              <div className="price-amount">$9<span>/month</span></div>
              <div className="price-desc">For serious freelancers</div>
              <ul className="price-features">
                <li>Unlimited proposals</li>
                <li>Humanize mode unlimited</li>
                <li>All tones and niches</li>
                <li>Priority generation</li>
                <li>All future features</li>
                <li>7 day free trial</li>
              </ul>
              <a href="https://proposalhero.lemonsqueezy.com/checkout/buy/f42e9931-e975-469b-822f-916086ddbafc?discount=0" target="_blank" className="price-btn pro">Start Free Trial</a>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      id="faq"<div style={{ background: '#040d21' }} id="faq"></div>
      <div className="section-divider" />
      <div style={{ background: '#040d21' }}>
        <div className="section section-center">
          <div className="hero-tag" style={{ marginBottom: '16px' }}>FAQ</div>
          <h2 className="section-title">Common Questions</h2>
          <p className="section-sub">Everything you need to know about ProposalHero.</p>
          <div className="faq">
            {faqs.map((f, i) => (
              <div className={`faq-item ${openFaq === i ? 'open' : ''}`} key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="faq-question">
                  {f.q}
                  <span className="faq-icon">⌄</span>
                </div>
                <div className="faq-answer">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <div className="section-divider" />
      <div style={{ background: '#040d21', paddingTop: '60px' }}>
        <div className="final-cta">
          <h2>Ready to Win More Fiverr Jobs?</h2>
          <p>Join freelancers already using ProposalHero to get more replies, more orders, and more income.</p>
          <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="final-cta-btn">
            ⚡ Try ProposalHero Free
          </a>
        </div>
        <p className="footer">ProposalHero · Built for Fiverr freelancers · Free during beta</p>
      </div>
    </div>
  );
}