'use client';
import { useEffect, useRef, useState } from 'react';

type Platform = 'Fiverr' | 'Upwork';
type Kind = 'humanize' | 'confident' | 'shorter' | 'longer' | 'personalized';
type Busy = 'generate' | 'humanize_tab' | Kind | null;
type Snapshot = { text: string; why: string[] };
type Result = { text: string; why: string[]; prev: Snapshot | null };
type Usage = { used: number; limit: number };
type ApiResponse = {
  proposal?: string;
  why?: string[];
  usage?: Usage;
  error?: string;
  limitReached?: boolean;
  code?: string;
};

const MAX_BRIEF = 8000;
const MAX_PROPOSAL = 6000;
const CHECKOUT_URL =
  'https://proposalhero.lemonsqueezy.com/checkout/buy/f42e9931-e975-469b-822f-916086ddbafc?discount=0';

const CATEGORIES: [string, string][] = [
  ['logo design', 'Logo Design'],
  ['web development', 'Web Development'],
  ['copywriting', 'Copywriting'],
  ['video editing', 'Video Editing'],
  ['social media management', 'Social Media Management'],
  ['SEO', 'SEO'],
  ['translation', 'Translation'],
  ['graphic design', 'Graphic Design'],
  ['voiceover', 'Voiceover'],
  ['data entry', 'Data Entry'],
  ['WordPress', 'WordPress'],
  ['mobile app development', 'Mobile App Development'],
  ['photo editing', 'Photo Editing'],
  ['other', 'Other'],
];

const TONES: [string, string][] = [
  ['friendly', 'Friendly'],
  ['professional', 'Professional'],
  ['confident', 'Confident'],
  ['expert', 'Expert'],
  ['casual', 'Casual'],
];

const LOADING_MESSAGES = [
  "Reading the client's brief...",
  'Identifying what they actually need...',
  'Finding the strongest angle...',
  'Writing your proposal...',
];

const BUSY_TEXT: Record<Exclude<Busy, null | 'generate'>, string> = {
  humanize_tab: 'Humanizing your text...',
  humanize: 'Making it sound more human...',
  confident: 'Making it more confident...',
  shorter: 'Shortening it...',
  longer: 'Adding more detail...',
  personalized: 'Personalizing it...',
};

const countWords = (s: string) => (s.trim() === '' ? 0 : s.trim().split(/\s+/).length);

function isVeryShort(s: string) {
  return s.length < 25 || countWords(s) < 5;
}

export default function Home() {
  const [mode, setMode] = useState<'generate' | 'humanize'>('generate');
  const [platform, setPlatform] = useState<Platform>('Fiverr');
  const [category, setCategory] = useState('logo design');
  const [customCategory, setCustomCategory] = useState('');
  const [tone, setTone] = useState('friendly');
  const [brief, setBrief] = useState('');
  const [ctxOpen, setCtxOpen] = useState(false);
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [link, setLink] = useState('');
  const [mention, setMention] = useState('');
  const [humInput, setHumInput] = useState('');

  const [gen, setGen] = useState<Result | null>(null);
  const [hum, setHum] = useState<Result | null>(null);
  const [busy, setBusy] = useState<Busy>(null);
  const [msgIdx, setMsgIdx] = useState(0);
  const [error, setError] = useState('');
  const [editorError, setEditorError] = useState('');
  const [shortWarn, setShortWarn] = useState(false);
  const [copied, setCopied] = useState(false);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const inFlight = useRef(false);
  const briefRef = useRef<HTMLTextAreaElement>(null);
  const genTextRef = useRef<HTMLTextAreaElement>(null);
  const humTextRef = useRef<HTMLTextAreaElement>(null);
  const genBoxRef = useRef<HTMLDivElement>(null);
  const humBoxRef = useRef<HTMLDivElement>(null);

  // Real usage comes from the server (signed cookie), so a refresh never resets it.
  useEffect(() => {
    fetch('/api/generate')
      .then((r) => r.json())
      .then((d: ApiResponse) => {
        if (d.usage) setUsage(d.usage);
      })
      .catch(() => { });
  }, []);

  // Rotating status messages only while a real request is in flight.
  useEffect(() => {
    if (busy !== 'generate') return;
    setMsgIdx(0);
    const id = setInterval(
      () => setMsgIdx((i) => Math.min(i + 1, LOADING_MESSAGES.length - 1)),
      1500
    );
    return () => clearInterval(id);
  }, [busy]);

  const limitReached = usage !== null && usage.used >= usage.limit;
  const remaining = usage ? Math.max(0, usage.limit - usage.used) : null;

  function scrollTo(ref: React.RefObject<HTMLDivElement | null>) {
    setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  }

  function baseInfo() {
    return {
      platform,
      category: category === 'other' ? customCategory.trim() || 'other' : category,
      tone,
      brief: brief.trim(),
      context: {
        skills: skills.trim(),
        experience: experience.trim(),
        link: link.trim(),
        mention: mention.trim(),
      },
    };
  }

  async function send(
    payload: Record<string, unknown>,
    label: Exclude<Busy, null>,
    scope: 'form' | 'editor'
  ): Promise<ApiResponse | null> {
    if (inFlight.current) return null; // prevents duplicate requests
    inFlight.current = true;
    setBusy(label);
    setError('');
    setEditorError('');
    const fail = (m: string) => (scope === 'form' ? setError(m) : setEditorError(m));
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45000);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      let data: ApiResponse = {};
      try {
        data = await res.json();
      } catch {
        /* non-JSON response (e.g. gateway timeout) */
      }
      if (data.usage) setUsage(data.usage);
      if (!res.ok || data.error) {
        if (data.limitReached && data.code !== 'refine_limit') setShowPaywall(true);
        fail(
          data.error ||
          (res.status === 504
            ? 'That took too long. Please try again.'
            : 'Something went wrong. Please try again.')
        );
        return null;
      }
      if (!data.proposal) {
        fail('The AI returned an empty result. Please try again.');
        return null;
      }
      return data;
    } catch (e) {
      const aborted = e instanceof DOMException && e.name === 'AbortError';
      fail(
        aborted
          ? 'That took too long. Please try again.'
          : 'Could not connect. Check your internet and try again.'
      );
      return null;
    } finally {
      clearTimeout(timer);
      inFlight.current = false;
      setBusy(null);
    }
  }

  async function generate(force = false, fromEditor = false) {
    if (inFlight.current) return;
    const scope = fromEditor ? 'editor' : 'form';
    const fail = (m: string) => (scope === 'form' ? setError(m) : setEditorError(m));
    setError('');
    setEditorError('');
    const text = brief.trim();
    if (!text) {
      fail("Paste the client's job description first. Even a few lines is enough to start.");
      briefRef.current?.focus();
      return;
    }
    if (brief.length > MAX_BRIEF) {
      fail(`That job description is very long. Please trim it to under ${MAX_BRIEF.toLocaleString('en-US')} characters. The key requirements are enough.`);
      return;
    }
    if (limitReached) {
      setShowPaywall(true);
      return;
    }
    if (!force && isVeryShort(text)) {
      setShortWarn(true);
      return;
    }
    setShortWarn(false);
    const data = await send({ action: 'generate', ...baseInfo() }, 'generate', scope);
    if (data?.proposal) {
      setGen({
        text: data.proposal,
        why: data.why ?? [],
        prev: gen ? { text: gen.text, why: gen.why } : null,
      });
      setCopied(false);
      scrollTo(genBoxRef);
    }
  }

  async function refine(kind: Kind) {
    if (!gen || inFlight.current) return;
    if (gen.text.trim().length < 20) {
      setEditorError('Write or generate a proposal first.');
      return;
    }
    const data = await send(
      { action: 'refine', kind, proposal: gen.text, ...baseInfo() },
      kind,
      'editor'
    );
    if (data?.proposal) {
      setGen({
        text: data.proposal,
        why: data.why && data.why.length ? data.why : gen.why,
        prev: { text: gen.text, why: gen.why },
      });
      setCopied(false);
    }
  }

  async function humanizeTab() {
    if (inFlight.current) return;
    setError('');
    setEditorError('');
    const text = humInput.trim();
    if (!text) {
      setError('Paste the proposal you want to humanize first.');
      return;
    }
    if (text.length > MAX_PROPOSAL) {
      setError(`That text is too long. Please keep it under ${MAX_PROPOSAL.toLocaleString('en-US')} characters.`);
      return;
    }
    if (limitReached) {
      setShowPaywall(true);
      return;
    }
    const data = await send({ action: 'humanize', proposal: text }, 'humanize_tab', 'form');
    if (data?.proposal) {
      setHum({ text: data.proposal, why: [], prev: { text, why: [] } });
      setCopied(false);
      scrollTo(humBoxRef);
    }
  }

  async function copyText(text: string, ref: React.RefObject<HTMLTextAreaElement | null>) {
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch {
      try {
        ref.current?.select();
        ok = document.execCommand('copy');
      } catch {
        ok = false;
      }
    }
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      setEditorError("Couldn't copy automatically. Select the text and copy it manually.");
    }
  }

  function addMoreDetails() {
    setShortWarn(false);
    setCtxOpen(true);
    briefRef.current?.focus();
  }

  const faqs = [
    { q: 'Is ProposalHero really free?', a: 'Yes. You get 3 free proposals every day with no signup. For unlimited proposals you can upgrade to Pro for $9/month.' },
    { q: 'Will my proposals sound like AI?', a: "ProposalHero is built to avoid generic AI phrasing and to write from the client's specific brief. You can also edit the draft and use Humanize to make it more conversational. No tool can control how a client will judge a message, so always read it and add your own voice before sending." },
    { q: 'Does it work for Upwork too?', a: 'Yes. Choose Fiverr or Upwork, paste the job description, and pick a category and tone.' },
    { q: 'Does it make up experience?', a: 'No. It only mentions skills, experience and links that you provide. If you leave those fields empty, it writes the proposal without any claims about your background. Always review the draft before you send it.' },
    { q: 'What categories are supported?', a: 'Logo design, web development, copywriting, video editing, SEO, social media, translation, graphic design, voiceover, data entry, WordPress, mobile development, photo editing, and an Other option for anything else.' },
    { q: 'How is this different from ChatGPT?', a: 'ProposalHero is built for one job: replying to client briefs. It picks out what the client asked for, avoids generic openers and invented experience, and gives you an editor with one-tap improvements. A well-written ChatGPT prompt can do similar work; ProposalHero saves you from writing that prompt every time.' },
    { q: 'Can I cancel my subscription anytime?', a: 'Yes. Cancel anytime from your Lemon Squeezy dashboard.' },
  ];

  function renderEditor(which: 'gen' | 'hum') {
    const res = which === 'gen' ? gen : hum;
    if (!res) return null;
    const setRes = which === 'gen' ? setGen : setHum;
    const busyHere = busy !== null;
    const words = countWords(res.text);
    const isGen = which === 'gen';
    return (
      <div className="editor" ref={isGen ? genBoxRef : humBoxRef}>
        <div className="editor-head">
          <div className="output-label">
            <div className="dot"></div>
            {isGen ? 'Your proposal' : 'Humanized text'}
          </div>
          <span className={`word-count ${words > 220 ? 'over' : ''}`}>
            {words} words · {res.text.length} characters
          </span>
        </div>
        <textarea
          ref={isGen ? genTextRef : humTextRef}
          className="editor-text"
          value={res.text}
          onChange={(e) => setRes({ ...res, text: e.target.value })}
          readOnly={busyHere}
          aria-label="Proposal text (editable)"
        />
        {busyHere && busy !== 'generate' && busy !== 'humanize_tab' && (
          <div className="status-line" role="status">
            <div className="spinner blue"></div>
            {BUSY_TEXT[busy as Kind]}
          </div>
        )}
        {editorError && <div className="error-box" role="alert" style={{ marginTop: 12 }}>{editorError}</div>}

        <div className="toolbar">
          <button
            className="tool-btn primary"
            onClick={() => copyText(res.text, isGen ? genTextRef : humTextRef)}
          >
            {copied ? '✓ Copied' : '⧉ Copy'}
          </button>
          {isGen && (
            <button className="tool-btn" onClick={() => generate(true, true)} disabled={busyHere}>
              ↻ Regenerate
            </button>
          )}
          {res.prev && (
            <button
              className="tool-btn"
              onClick={() => setRes({ text: res.prev!.text, why: res.prev!.why, prev: null })}
              disabled={busyHere}
            >
              ↶ {isGen ? 'Undo' : 'Restore original'}
            </button>
          )}
        </div>

        {isGen && (
          <div className="improve">
            <div className="improve-title">Improve proposal</div>
            <div className="improve-grid">
              <button className="tool-btn" onClick={() => refine('humanize')} disabled={busyHere}>✦ Humanize</button>
              <button className="tool-btn" onClick={() => refine('confident')} disabled={busyHere}>Make more confident</button>
              <button className="tool-btn" onClick={() => refine('shorter')} disabled={busyHere}>Make shorter</button>
              <button className="tool-btn" onClick={() => refine('longer')} disabled={busyHere}>Make longer</button>
              <button className="tool-btn wide" onClick={() => refine('personalized')} disabled={busyHere}>Make more personalized</button>
            </div>
          </div>
        )}

        {res.prev && (
          <details className="compare">
            <summary>{isGen ? 'Compare with previous version' : 'Compare with your original'}</summary>
            <div className="compare-text">{res.prev.text}</div>
          </details>
        )}

        {isGen && res.why.length > 0 && (
          <details className="why">
            <summary>Why this proposal works</summary>
            <ul>
              {res.why.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </details>
        )}

        <p className="tip">Read it once and add a personal touch before you send it.</p>
      </div>
    );
  }

  const generating = busy === 'generate';
  const humanizing = busy === 'humanize_tab';

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
        <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer" className="upgrade-btn">Upgrade $9/mo</a>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-tag">✦ AI proposal writer for Fiverr & Upwork freelancers</div>
        <h1>Proposals That Sound Like You,<br /><span>Not Like a Template</span></h1>
        <p>Paste a client&apos;s job, pick a tone, and get a personalized proposal you can edit and send in seconds.</p>
      </div>

      {/* TOOL CARD */}
      <div className="card-wrap">
        {showPaywall && (
          <div className="paywall-overlay" role="dialog" aria-modal="true" aria-labelledby="pw-title">
            <div className="paywall-card">
              <div className="paywall-icon">🔒</div>
              <h2 className="paywall-title" id="pw-title">Free limit reached</h2>
              <p className="paywall-desc">You have used your 3 free proposals today. Upgrade to get unlimited proposals every day, or come back tomorrow.</p>
              <div className="paywall-features">
                <div className="paywall-feature">✓ Unlimited proposals</div>
                <div className="paywall-feature">✓ Humanize mode</div>
                <div className="paywall-feature">✓ All future features</div>
              </div>
              <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer" className="paywall-btn">Upgrade for $9/month</a>
              <button className="paywall-close" onClick={() => setShowPaywall(false)}>Maybe later</button>
            </div>
          </div>
        )}

        <div className="card">
          <div className="mode-tabs">
            <button
              className={`mode-tab ${mode === 'generate' ? 'active' : ''}`}
              onClick={() => { setMode('generate'); setError(''); setEditorError(''); }}
            >
              ⚡ Generate Proposal
            </button>
            <button
              className={`mode-tab ${mode === 'humanize' ? 'active' : ''}`}
              onClick={() => { setMode('humanize'); setError(''); setEditorError(''); }}
            >
              ✦ Humanize Proposal
            </button>
          </div>

          {mode === 'generate' && (
            <>
              <div className="field">
                <label>Platform</label>
                <div className="seg" role="group" aria-label="Platform">
                  {(['Fiverr', 'Upwork'] as Platform[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`seg-btn ${platform === p ? 'active' : ''}`}
                      aria-pressed={platform === p}
                      onClick={() => setPlatform(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field">
                <label htmlFor="category">Your category</label>
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {CATEGORIES.map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
                {category === 'other' && (
                  <input
                    type="text"
                    style={{ marginTop: 8 }}
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="What service do you offer? (optional)"
                    maxLength={60}
                    aria-label="Your service"
                  />
                )}
              </div>

              <div className="field">
                <label>Tone</label>
                <div className="chips" role="group" aria-label="Tone">
                  {TONES.map(([v, l]) => (
                    <button
                      key={v}
                      type="button"
                      className={`chip ${tone === v ? 'active' : ''}`}
                      aria-pressed={tone === v}
                      onClick={() => setTone(v)}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <label htmlFor="brief">Client&apos;s job description</label>
              <textarea
                id="brief"
                ref={briefRef}
                value={brief}
                onChange={(e) => { setBrief(e.target.value); setShortWarn(false); }}
                placeholder={"Paste the client's job here...\nDon't worry if it's short. ProposalHero will analyze what the client is asking for."}
                rows={8}
                style={{ minHeight: 180 }}
              />
              <div className={`char-count ${brief.length > MAX_BRIEF ? 'over' : ''}`}>
                {brief.length.toLocaleString('en-US')} / {MAX_BRIEF.toLocaleString('en-US')} characters
              </div>

              <details className="opt" open={ctxOpen} onToggle={(e) => setCtxOpen(e.currentTarget.open)}>
                <summary>
                  <span>Improve your proposal<span className="opt-hint">optional</span></span>
                </summary>
                <div className="opt-body">
                  <div className="field">
                    <label htmlFor="skills">Your relevant skills</label>
                    <input id="skills" type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g. Figma, brand identity, packaging" maxLength={600} />
                  </div>
                  <div className="field">
                    <label htmlFor="exp">Your relevant experience</label>
                    <textarea id="exp" rows={3} value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="Only what's true. ProposalHero won't add anything else." maxLength={600} />
                  </div>
                  <div className="field">
                    <label htmlFor="link">Portfolio / project link</label>
                    <input id="link" type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://" maxLength={300} />
                  </div>
                  <div className="field">
                    <label htmlFor="mention">Anything specific to mention</label>
                    <textarea id="mention" rows={2} value={mention} onChange={(e) => setMention(e.target.value)} placeholder="e.g. I can start this week" maxLength={600} />
                  </div>
                </div>
              </details>

              {shortWarn && (
                <div className="notice" role="alert">
                  Your job description is very short. We can still generate a proposal, but adding more details will make it more personalized.
                  <div className="btn-row">
                    <button className="btn-secondary" onClick={() => generate(true)}>Generate Anyway</button>
                    <button className="btn-secondary alt" onClick={addMoreDetails}>Add More Details</button>
                  </div>
                </div>
              )}

              {error && <div className="error-box" role="alert">{error}</div>}

              <div className="usage-bar">
                <span className="usage-text">
                  {remaining === null
                    ? '✦ 3 free proposals per day, no signup'
                    : limitReached
                      ? '🔒 Daily limit reached. Upgrade for unlimited'
                      : `✦ ${remaining} free proposal${remaining === 1 ? '' : 's'} remaining today`}
                </span>
              </div>

              <button className="btn" onClick={() => generate(false)} disabled={busy !== null} aria-busy={generating}>
                {generating ? (
                  <>
                    <div className="spinner"></div>
                    <span role="status">{LOADING_MESSAGES[msgIdx]}</span>
                  </>
                ) : (
                  <>⚡ Generate Proposal</>
                )}
              </button>

              {renderEditor('gen')}
            </>
          )}

          {mode === 'humanize' && (
            <>
              <label htmlFor="hum">Paste your existing proposal</label>
              <textarea
                id="hum"
                value={humInput}
                onChange={(e) => setHumInput(e.target.value)}
                placeholder="Paste any proposal here. ProposalHero will make it sound more natural without changing what it says."
                rows={8}
                style={{ minHeight: 180 }}
              />
              <div className={`char-count ${humInput.length > MAX_PROPOSAL ? 'over' : ''}`}>
                {humInput.length.toLocaleString('en-US')} / {MAX_PROPOSAL.toLocaleString('en-US')} characters
              </div>

              {error && <div className="error-box" role="alert">{error}</div>}

              <div className="usage-bar">
                <span className="usage-text">
                  {remaining === null
                    ? '✦ 3 free proposals per day, no signup'
                    : limitReached
                      ? '🔒 Daily limit reached. Upgrade for unlimited'
                      : `✦ ${remaining} free proposal${remaining === 1 ? '' : 's'} remaining today`}
                </span>
              </div>

              <button className="btn" onClick={humanizeTab} disabled={busy !== null} aria-busy={humanizing}>
                {humanizing ? (
                  <>
                    <div className="spinner"></div>
                    <span role="status">Humanizing your text...</span>
                  </>
                ) : (
                  <>✦ Humanize Now</>
                )}
              </button>

              {renderEditor('hum')}
            </>
          )}
        </div>

        {/* FEATURES ROW */}
        <div className="features">
          {[
            { icon: '🎯', title: 'Reads the brief', desc: 'Picks out what the client actually asked for' },
            { icon: '✦', title: 'Humanize mode', desc: 'Rewrites stiff text in a natural voice' },
            { icon: '✍️', title: 'You stay in control', desc: 'Edit, refine and copy in one place' },
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
      <div className="section-divider" />
      <div style={{ background: '#040d21' }} id="how">
        <div className="section section-center">
          <div className="hero-tag" style={{ marginBottom: '16px' }}>Simple Process</div>
          <h2 className="section-title">How ProposalHero Works</h2>
          <p className="section-sub">Three steps from job post to a proposal you can send.</p>
          <div className="steps">
            {[
              { n: '1', title: 'Paste the job', desc: 'Copy any Fiverr or Upwork job description and paste it. Short ones work too.' },
              { n: '2', title: 'Choose your style', desc: 'Pick the platform, your category and a tone. Optionally add your real skills and experience.' },
              { n: '3', title: 'Edit and send', desc: 'Get a draft in seconds, tweak it in the editor, humanize it if you like, then copy it.' },
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
          <h2 className="section-title">Generic vs Job-Specific</h2>
          <p className="section-sub">Generic proposals talk about the freelancer. Good ones talk about the client&apos;s project.</p>
          <div className="before-after">
            <div className="ba-card bad">
              <span className="ba-label bad">❌ Generic proposal</span>
              <p className="ba-text">&quot;Hi! I am a professional logo designer with 5 years of experience. I can make a beautiful logo for you. Please check my portfolio. I will deliver high quality work on time.&quot;</p>
              <ul className="ba-points">
                <li>Starts with &quot;Hi I am a professional&quot;</li>
                <li>Could be sent to any client</li>
                <li>Talks about the freelancer, not the client</li>
                <li>Makes claims without any detail</li>
              </ul>
            </div>
            <div className="ba-card good">
              <span className="ba-label good">✓ Job-specific proposal</span>
              <p className="ba-text">&quot;Opening a bakery next month means your logo needs to work across signage, packaging, and social before day one. For Sweet Crumbs, I&apos;m thinking a hand-lettered wordmark, modern but warm. Do you already have a colour palette in mind?&quot;</p>
              <ul className="ba-points">
                <li>Starts with the client&apos;s situation</li>
                <li>Shows real thinking about their project</li>
                <li>Gives a concrete creative idea</li>
                <li>Ends with a useful question</li>
              </ul>
            </div>
          </div>
          <p className="ba-note">Illustrative examples, not real clients.</p>
        </div>
      </div>

      {/* PRINCIPLES (replaces unverified testimonials) */}
      <div className="section-divider" />
      <div style={{ background: '#040d21' }}>
        <div className="section section-center">
          <div className="hero-tag" style={{ marginBottom: '16px' }}>What It Does</div>
          <h2 className="section-title">Built to Keep Proposals Honest</h2>
          <p className="section-sub">Three principles behind every draft.</p>
          <div className="testimonials">
            {[
              { title: 'It reads the brief', text: "Drafts start from the client's own words and mention specific details from their job, not a stock introduction." },
              { title: 'It never invents experience', text: "It only mentions skills, experience and links you provide. Leave them blank and it writes without any claims about your background." },
              { title: 'You stay in control', text: 'Every draft is editable. Humanize it, shorten it or make it more personal, then review it before you send it.' },
            ].map((t, i) => (
              <div className="testi-card" key={i}>
                <h3>{t.title}</h3>
                <p>{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div className="section-divider" />
      <div style={{ background: '#040d21' }} id="pricing">
        <div className="section section-center">
          <div className="hero-tag" style={{ marginBottom: '16px' }}>Simple Pricing</div>
          <h2 className="section-title">Start Free. Upgrade When Ready.</h2>
          <p className="section-sub">No signup or credit card needed to start.</p>
          <div className="pricing">
            <div className="price-card">
              <div className="price-name">Free</div>
              <div className="price-amount">$0<span>/month</span></div>
              <div className="price-desc">Perfect for trying it out</div>
              <ul className="price-features">
                <li>3 proposals per day</li>
                <li>Generate &amp; Humanize modes</li>
                <li>Fiverr and Upwork</li>
                <li>Edit and copy with one tap</li>
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
                <li>Unlimited Humanize and improvements</li>
                <li>All future features</li>
              </ul>
              <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer" className="price-btn pro">Upgrade to Pro</a>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="section-divider" />
      <div style={{ background: '#040d21' }} id="faq">
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
          <h2>Ready to Write Your Next Proposal?</h2>
          <p>Paste a job, get a draft, make it yours.</p>
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="final-cta-btn">
            ⚡ Try ProposalHero Free
          </a>
        </div>
        <p className="footer">ProposalHero · Built for Fiverr &amp; Upwork freelancers · 3 free proposals every day</p>
      </div>
    </div>
  );
}