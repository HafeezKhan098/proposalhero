'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [brief, setBrief] = useState('');
  const [niche, setNiche] = useState('logo design');
  const [tone, setTone] = useState('friendly and professional');
  const [proposal, setProposal] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const wordCount = proposal.trim() === '' ? 0 : proposal.trim().split(/\s+/).length;

  async function generate() {
    if (!brief.trim()) return;
    setLoading(true);
    setProposal('');
    setError('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief, niche, tone })
      });
      const data = await res.json();
      if (data.error) {
        setError('Something went wrong: ' + data.error);
      } else {
        setProposal(data.proposal);
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

  return (
    <div className="page">
      <nav className="nav">
        <div className="logo">
          <img src="/logo1.png" alt="ProposalHero" style={{ height: '40px', width: 'auto' }} />
        </div>
        <span className="badge">Free Beta</span>
      </nav>

      <div className="hero">
        <div className="hero-tag">✦ AI-Powered for Fiverr Freelancers</div>
        <h1>Stop Losing Fiverr Jobs<br /><span>Win More With AI</span></h1>
        <p>Paste any Fiverr job — even just a few words. Get a proposal that feels human, specific, and wins the order.</p>
      </div>

      <div className="card-wrap">
        <div className="card">

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

          <label>Paste Client Job Description</label>
          <textarea
            value={brief}
            onChange={e => setBrief(e.target.value)}
            placeholder="Paste the Fiverr job here... even a few words works. e.g. 'need a logo for my bakery'"
            rows={6}
          />
          <div className="char-count">{brief.length} characters</div>

          {error && (
            <div className="error-box">{error}</div>
          )}

          <button className="btn" onClick={generate} disabled={loading || !brief.trim()}>
            {loading
              ? <><div className="spinner"></div> Writing your proposal...</>
              : <>⚡ Generate Winning Proposal</>}
          </button>

          {proposal && (
            <div className="output">
              <div className="output-header">
                <div className="output-label"><div className="dot"></div> Your Proposal</div>
                <div className="output-actions">
                  <span className={`word-count ${wordCount > 150 ? 'over' : ''}`}>
                    {wordCount} / 150 words
                  </span>
                  <button className="copy-btn" onClick={copy}>{copied ? '✓ Copied!' : '⧉ Copy'}</button>
                </div>
              </div>
              <div className="output-text">{proposal}</div>
              <div className="output-footer">
                <p className="tip">✦ Personalize 1–2 lines before sending for best results</p>
                <button className="regenerate-btn" onClick={generate} disabled={loading}>
                  {loading ? 'Writing...' : '↻ Try again'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="features">
          {[
            { icon: '🎯', title: 'Reads the brief', desc: 'Finds what clients really want' },
            { icon: '⚡', title: 'Instant results', desc: 'Proposal in under 10 seconds' },
            { icon: '🏆', title: 'Wins more jobs', desc: 'Sounds human, not like AI' },
          ].map((f, i) => (
            <div className="feature" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
        <p className="footer">ProposalHero · Built for Fiverr freelancers · Free during beta</p>
      </div>
    </div>
  );
}