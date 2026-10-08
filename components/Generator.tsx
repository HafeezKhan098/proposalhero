'use client';
import { useState, type ReactNode } from 'react';
import { ScanSearch, BarChart3, Check, Copy, FileText, Loader2, Sparkles, Wand2 } from 'lucide-react';

type Mode = 'proposal' | 'prompt';
const categories = ['Logo Design', 'Web Development', 'UI/UX Design', 'Copywriting', 'SEO', 'Social Media', 'Video Editing', 'Graphic Design', 'WordPress', 'Mobile Development', 'Data Entry', 'Translation', 'Other'];
const promptCategories = ['Web Design', 'Coding', 'UI/UX', 'App Development', 'Marketing', 'SEO', 'Content', 'Social Media', 'Business', 'Image Generation', 'Video', 'Education', 'Research', 'AI Agents', 'Freelancing', 'Productivity'];
const tools = ['ChatGPT', 'Claude', 'Gemini', 'Cursor', 'Lovable', 'v0', 'Bolt'];
const tones = ['Friendly', 'Professional', 'Confident', 'Expert', 'Casual'];

function CopyButton({ value }: { value: string }) { const [done, setDone] = useState(false); return <button className="icon-btn" onClick={async () => { await navigator.clipboard?.writeText(value); setDone(true); setTimeout(() => setDone(false), 1500) }}><Copy size={15} />{done ? 'Copied' : 'Copy proposal'}</button> }

function ReadyProposal({ data }: { data: any }) {
  return <article className="ready-proposal">
    <div className="ready-proposal-meta"><span>READY-TO-SEND DRAFT</span><span>Review before sending</span></div>
    {data.subject_line && <div className="ready-subject"><span>Subject</span><strong>{data.subject_line}</strong></div>}
    <div className="ready-copy">{String(data.proposal || '').split(/\n+/).map((part: string, i: number) => part.trim() ? <p key={i}>{part.trim()}</p> : null)}</div>
    <div className="ready-note"><strong>Make it yours.</strong> Edit a few words, add any real detail only you know, and make the final message sound like you before sending.</div>
  </article>
}

function ResultPanel({ data, onImprove, onAnalyze, onScore, working, mode }: { data: any; onImprove: () => void; onAnalyze: () => void; onScore: () => void; working: string; mode: Mode }) {
  const plain = mode === 'proposal' ? (data.proposal || '') : [data.prompt, data.follow_up].filter(Boolean).join('\n\n');
  if (mode === 'prompt') return <div className="result-shell"><div className="result-toolbar"><div><span className="status-dot" /> Generated prompt</div></div><div className="prompt-result"><span className="doc-kicker">READY TO USE</span><h2>{data.title}</h2><div className="prompt-box"><pre>{data.prompt}</pre></div>{data.variables?.length > 0 && <div className="result-section"><h3>Variables to replace</h3><div className="chip-list">{data.variables.map((x: string, i: number) => <span key={i}>{x}</span>)}</div></div>}<div className="result-section"><h3>Why it works</h3><p>{data.why_it_works}</p></div><div className="result-bottom-actions"><CopyButton value={plain} /></div></div></div>;
  return <div className="result-shell">
    <div className="result-toolbar"><div><span className="status-dot" /> Generated proposal</div><span className="result-ready-label">Ready to edit & send</span></div>
    <ReadyProposal data={data} />
    <div className="result-bottom-actions proposal-actions">
      <CopyButton value={plain} />
      <button className="tool-action" onClick={onImprove} disabled={!!working}>{working === 'improve' ? <Loader2 className="spin" size={15} /> : <Wand2 size={15} />} Humanize & improve</button>
      <button className="tool-action" onClick={onAnalyze} disabled={!!working}>{working === 'analyze' ? <Loader2 className="spin" size={15} /> : <ScanSearch size={15} />} Analyze brief</button>
      <button className="tool-action" onClick={onScore} disabled={!!working}>{working === 'score' ? <Loader2 className="spin" size={15} /> : <BarChart3 size={15} />} Score proposal</button>
    </div>
    {data.improved && <div className="insight-panel"><div className="insight-head"><div><span className="doc-kicker">Humanized version</span><h3>More natural. Still yours.</h3></div><CopyButton value={data.improved} /></div><div className="improved-copy">{data.improved}</div></div>}
    {data.analysis && <div className="insight-panel"><span className="doc-kicker">Brief analysis</span><h3>{data.analysis.proposal_angle}</h3><p>{data.analysis.summary}</p><div className="insight-columns"><div><b>Client priorities</b><ul>{data.analysis.client_priorities?.map((x: string, i: number) => <li key={i}>{x}</li>)}</ul></div><div><b>Useful questions</b><ul>{data.analysis.questions?.map((x: string, i: number) => <li key={i}>{x}</li>)}</ul></div></div></div>}
    {data.review && <div className="insight-panel score-panel"><div><span className="doc-kicker">Proposal score</span><h3>{data.review.score}/100 <small>{data.review.verdict}</small></h3></div><div className="score-columns"><div><b>Strengths</b><ul>{data.review.strengths?.map((x: string, i: number) => <li key={i}>{x}</li>)}</ul></div><div><b>Next steps</b><ul>{data.review.next_steps?.map((x: string, i: number) => <li key={i}>{x}</li>)}</ul></div></div></div>}
  </div>
}

export default function Generator({ mode = 'proposal' }: { mode?: Mode }) {
  const [brief, setBrief] = useState(''); const [platform, setPlatform] = useState('Upwork'); const [category, setCategory] = useState('Web Development'); const [tone, setTone] = useState('Professional'); const [skills, setSkills] = useState(''); const [experience, setExperience] = useState(''); const [portfolio, setPortfolio] = useState(''); const [mention, setMention] = useState(''); const [tool, setTool] = useState('ChatGPT'); const [promptCategory, setPromptCategory] = useState('Web Design'); const [style, setStyle] = useState('Structured'); const [loading, setLoading] = useState(false); const [working, setWorking] = useState(''); const [error, setError] = useState(''); const [data, setData] = useState<any>(null);
  async function run() { setLoading(true); setError(''); setData(null); try { const endpoint = mode === 'proposal' ? '/api/generate-proposal' : '/api/generate-prompt'; const body = mode === 'proposal' ? { brief, platform, category, tone, skills, experience, portfolio, mention } : { task: brief, category: promptCategory, tool, style }; const r = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }); const j = await r.json(); if (!r.ok) throw new Error(j.error || 'Something went wrong.'); setData(j.data) } catch (e) { setError(e instanceof Error ? e.message : 'Something went wrong.') } finally { setLoading(false) } }
  async function toolCall(endpoint: string, body: any, key: string) { setWorking(key); setError(''); try { const r = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }); const j = await r.json(); if (!r.ok) throw new Error(j.error || 'Unable to complete that action.'); if (key === 'improve' && j.data?.improved) setData({ ...data, improved: j.data.improved, changes: j.data.changes, qualityScore: j.data.score }); else if (key === 'analyze') setData({ ...data, analysis: j.data }); else if (key === 'score') setData({ ...data, review: j.data }); } catch (e) { setError(e instanceof Error ? e.message : 'Unable to complete that action.') } finally { setWorking('') } }
  const proposalText = mode === 'proposal' ? (data?.proposal || '') : '';
  return <div className={`generator-shell ${mode}`}>
    <div className="generator-topbar"><div className="generator-product"><div className="product-icon">{mode === 'proposal' ? <FileText size={18} /> : <Sparkles size={18} />}</div><div><strong>{mode === 'proposal' ? 'Proposal Generator' : 'Prompt Generator'}</strong><span>{mode === 'proposal' ? 'Job post → personalized proposal → humanize → send' : 'Task → structured prompt → copy → build'}</span></div></div><div className="generator-usage"><span className="usage-label">FREE</span><span>3 free tries · no signup</span></div></div>
    <div className="generator-grid">
      <aside className="generator-form">
        <div className="form-heading"><span>01</span><div><h2>{mode === 'proposal' ? 'Build your proposal' : 'Build your prompt'}</h2><p>{mode === 'proposal' ? 'Paste the client job and add only the details that matter.' : 'Describe the outcome and choose how you want the prompt structured.'}</p></div></div>
        {mode === 'proposal' ? <>
          <div className="inline-fields"><Field label="Platform"><select value={platform} onChange={e => setPlatform(e.target.value)}><option>Fiverr</option><option>Upwork</option><option>Direct client</option></select></Field><Field label="Your category"><select value={category} onChange={e => setCategory(e.target.value)}>{categories.map(x => <option key={x}>{x}</option>)}</select></Field></div>
          <div className="tone-row"><span className="field-label">Tone</span><div className="segmented">{tones.map(x => <button type="button" key={x} className={tone === x ? 'active' : ''} onClick={() => setTone(x)}>{x}</button>)}</div></div>
          <Field label="Client's job description"><textarea className="brief-area" value={brief} onChange={e => setBrief(e.target.value)} maxLength={8000} placeholder="Paste the client's job description or project brief here…" /><div className="char-count">{brief.length.toLocaleString()} / 8,000</div></Field>
          <Field label="Improve your proposal (optional)"><input value={mention} onChange={e => setMention(e.target.value)} placeholder="Anything specific to mention, ask or emphasize…" /></Field>
          <div className="optional-grid"><Field label="Your relevant skills"><input value={skills} onChange={e => setSkills(e.target.value)} placeholder="e.g. Figma, React, SEO" /></Field><Field label="Portfolio / project link"><input value={portfolio} onChange={e => setPortfolio(e.target.value)} placeholder="https://" /></Field></div>
          <Field label="Your relevant experience"><textarea value={experience} onChange={e => setExperience(e.target.value)} placeholder="A short real example you want included…" /></Field>
        </> : <>
          <Field label="What do you want AI to do?"><textarea className="brief-area" value={brief} onChange={e => setBrief(e.target.value)} placeholder="Example: Create a mobile-first website for a local coffee shop with a menu, location section and online ordering CTA…" /></Field>
          <div className="inline-fields"><Field label="Prompt category"><select value={promptCategory} onChange={e => setPromptCategory(e.target.value)}>{promptCategories.map(x => <option key={x}>{x}</option>)}</select></Field><Field label="AI tool"><select value={tool} onChange={e => setTool(e.target.value)}>{tools.map(x => <option key={x}>{x}</option>)}</select></Field></div>
          <div className="tone-row"><span className="field-label">Prompt style</span><div className="segmented">{['Structured', 'Expert', 'Creative', 'Concise'].map(x => <button type="button" key={x} className={style === x ? 'active' : ''} onClick={() => setStyle(x)}>{x}</button>)}</div></div>
          <div className="prompt-hint"><strong>Built for the tools you already use.</strong><span>Clear objective, context, constraints, quality criteria and expected output.</span></div>
        </>}
        {error && <div className="error-box">{error}</div>}
        <button className="generate-btn" onClick={run} disabled={loading || brief.trim().length < (mode === 'proposal' ? 20 : 12)}>{loading ? <><Loader2 className="spin" size={17} /> Generating…</> : <><Sparkles size={17} /> {mode === 'proposal' ? 'Generate proposal' : 'Generate prompt'} <span>⌘↵</span></>}</button>
        <div className="form-foot"><Check size={14} /> No invented credentials. <span>•</span> Always review before sending.</div>
      </aside>
      <main className="generator-output">
        {!data ? <div className="empty-workspace"><div className="empty-icon">{mode === 'proposal' ? <FileText size={24} /> : <Sparkles size={24} />}</div><span className="doc-kicker">ProposalHero workspace</span><h1>{mode === 'proposal' ? 'Your send-ready proposal starts here.' : 'Your production-ready prompt starts here.'}</h1><p>{mode === 'proposal' ? 'Paste the real client brief on the left. You will get a concise proposal you can personalize, humanize and send—not a long AI explanation.' : 'Describe the outcome on the left. You will get a structured prompt you can copy into your chosen AI tool.'}</p><div className="empty-lines"><i /><i /><i /></div><div className="empty-features"><span><Check size={14} /> Client-specific</span><span><Check size={14} /> Editable</span><span><Check size={14} /> Human-first</span></div></div> : <ResultPanel data={data} working={working} mode={mode} onImprove={() => toolCall('/api/improve-proposal', { proposal: proposalText, goal: 'more natural, concise, conversational and human while keeping every client-specific detail truthful' }, 'improve')} onAnalyze={() => toolCall('/api/analyze-brief', { brief }, 'analyze')} onScore={() => toolCall('/api/score-proposal', { proposal: proposalText }, 'score')} />}</main>
    </div>
  </div>
}
function Field({ label, children }: { label: string; children: ReactNode }) { return <div className="field-v2"><label>{label}</label>{children}</div> }
