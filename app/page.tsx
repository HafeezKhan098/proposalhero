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
  const [mode, setMode] = useState('generate');
  const [humanScore, setHumanScore] = useState(0);
  const [aiRisk, setAiRisk] = useState('');
  const [naturalness, setNaturalness] = useState(0);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const wordCount = proposal.trim() === '' ? 0 : proposal.trim().split(/\s+/).length;

  async function generate() {
    if (!brief.trim()) return;
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
        body: JSON.stringify({ brief, niche, tone, mode })
      });
      const data = await res.json();
      if (data.error) {
        setError('Something went wrong: ' + data.error);
      } else {
        setProposal(data.proposal);
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

  return (
    <div className="page">
      <nav className="nav">
        <div className="logo">
          <img src="/logo1.png" alt="ProposalHero" style={{height: '40px', width: 'auto'}} />
        </div>
        <a href="https://proposalhero.lemonsqueezy.com/checkout/buy/f42e9931-e975-469b-822f-916086ddbafc?discount=0" target="_blank" className="upgrade-btn">Upgrade $9/mo</a>
      </nav>

      <div className="hero">
        <div className="hero-tag">✦ AI-Powered for Fiverr Freelancers</div>
        <h1>Stop Losing Fiverr Jobs<br /><span>Win More With AI</span></h1>
        <p>Generate proposals that feel human, specific, and win the order. Even works with just a few words.</p>
      </div>

      <div className="card-wrap">
        <div className="card">

          <div className="mode-tabs">
            <button
              className={`mode-tab ${mode === 'generate' ? 'active' : ''}`}
              onClick={() => { setMode('generate'); setProposal(''); }}
            >
              ⚡ Generate Proposal
            </button>
            <button
              className={`mode-tab ${mode === 'humanize' ? 'active' : ''}`}
              onClick={() => { setMode('humanize'); setProposal(''); }}
            >
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

          <label>
            {mode === 'humanize'
              ? 'Paste your existing proposal to humanize'
              : 'Paste Client Job Description'}
          </label>
          <textarea
            value={brief}
            onChange={e => setBrief(e.target.value)}
            placeholder={mode === 'humanize'
              ? 'Paste any AI-generated proposal here and we will make it sound human...'
              : 'Paste the Fiverr job here... even a few words works.'}
            rows={6}
          />
          <div className="char-count">{brief.length} characters</div>

          {error && <div className="error-box">{error}</div>}

          <button className="btn" onClick={generate} disabled={loading || !brief.trim()}>
            {loading
              ? <><div className="spinner"></div> {mode === 'humanize' ? 'Humanizing...' : 'Writing your proposal...'}</>
              : <>{mode === 'humanize' ? '✦ Humanize Now' : '⚡ Generate Winning Proposal'}</>}
          </button>

          {proposal && (
            <div className="output">
              {mode === 'humanize' && humanScore > 0 && (
                <div className="scores">
                  <div className="score-card">
                    <div className="score-label">Human Score</div>
                    <div className="score-bar-wrap">
                      <div className="score-bar" style={{width: `${humanScore}%`, background: '#22c55e'}}></div>
                    </div>
                    <div className="score-val" style={{color: '#22c55e'}}>{humanScore}/100</div>
                  </div>
                  <div className="score-card">
                    <div className="score-label">Naturalness</div>
                    <div className="score-bar-wrap">
                      <div className="score-bar" style={{width: `${naturalness}%`, background: '#3b82f6'}}></div>
                    </div>
                    <div className="score-val" style={{color: '#3b82f6'}}>{naturalness}/100</div>
                  </div>
                  <div className="score-card">
                    <div className="score-label">AI Detection Risk</div>
                    <div className="risk-badge" style={{background: getRiskColor(aiRisk) + '20', color: getRiskColor(aiRisk), border: `1px solid ${getRiskColor(aiRisk)}40`}}>
                      {aiRisk}
                    </div>
                  </div>
                </div>
              )}

              <div className="output-header">
                <div className="output-label"><div className="dot"></div> {mode === 'humanize' ? 'Humanized Proposal' : 'Your Proposal'}</div>
                <div className="output-actions">
                  <span className={`word-count ${wordCount > 150 ? 'over' : ''}`}>{wordCount} / 150 words</span>
                  <button className="copy-btn" onClick={copy}>{copied ? '✓ Copied!' : '⧉ Copy'}</button>
                </div>
              </div>
              <div className="output-text">{proposal}</div>
              <div className="output-footer">
                <p className="tip">✦ Personalize 1–2 lines before sending</p>
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
        <p className="footer">ProposalHero · Built for Fiverr freelancers · Free during beta</p>
      </div>
    </div>
  );
}