'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Copy, Pencil, Trash2, Check, X, ChevronDown, FileText } from 'lucide-react';

export type SavedProposal = {
  id: string; title: string; client_name: string | null; brief: string; proposal: string;
  status: string; created_at: string; updated_at: string;
};

const STATUSES: { value: string; label: string }[] = [
  { value: 'draft', label: 'Draft' }, { value: 'sent', label: 'Sent' }, { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' }, { value: 'archived', label: 'Archived' },
];

function fmt(iso: string) {
  try { return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); } catch { return ''; }
}

async function api(url: string, method: string, body?: unknown) {
  const r = await fetch(url, { method, headers: body ? { 'content-type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || 'Something went wrong. Please try again.');
  return j;
}

export default function ProposalsManager({ initial, limit, pro }: { initial: SavedProposal[]; limit: number; pro: boolean }) {
  const [items, setItems] = useState<SavedProposal[]>(initial);
  const [filter, setFilter] = useState('all');
  const [openId, setOpenId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ title: '', client_name: '', proposal: '' });
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const shown = filter === 'all' ? items : items.filter((p) => p.status === filter);

  function replace(next: SavedProposal) { setItems((list) => list.map((p) => (p.id === next.id ? next : p))); }

  async function changeStatus(p: SavedProposal, status: string) {
    setError(''); setMessage(''); setBusy(p.id);
    try { const j = await api(`/api/proposals/${p.id}`, 'PATCH', { status }); replace(j.proposal); setMessage('Status updated.'); }
    catch (e) { setError(e instanceof Error ? e.message : 'Something went wrong.'); }
    finally { setBusy(''); }
  }

  function startEdit(p: SavedProposal) {
    setEditId(p.id); setOpenId(p.id); setError(''); setMessage('');
    setDraft({ title: p.title, client_name: p.client_name || '', proposal: p.proposal });
  }

  async function saveEdit(p: SavedProposal) {
    setError(''); setMessage(''); setBusy(p.id);
    try {
      const j = await api(`/api/proposals/${p.id}`, 'PATCH', { title: draft.title, client_name: draft.client_name, proposal: draft.proposal });
      replace(j.proposal); setEditId(null); setMessage('Changes saved.');
    } catch (e) { setError(e instanceof Error ? e.message : 'Something went wrong.'); }
    finally { setBusy(''); }
  }

  async function remove(p: SavedProposal) {
    setError(''); setMessage(''); setBusy(p.id);
    try { await api(`/api/proposals/${p.id}`, 'DELETE'); setItems((list) => list.filter((x) => x.id !== p.id)); setConfirmId(null); setMessage('Proposal deleted.'); }
    catch (e) { setError(e instanceof Error ? e.message : 'Something went wrong.'); }
    finally { setBusy(''); }
  }

  async function copy(p: SavedProposal) {
    try { await navigator.clipboard.writeText(p.proposal); setCopied(p.id); setTimeout(() => setCopied(''), 1800); }
    catch { setError('Copy was blocked by your browser. Open the proposal and select the text instead.'); }
  }

  return (
    <div className="pm">
      <div className="pm-toolbar">
        <div className="pm-count"><strong>{items.length}</strong> of {limit} saved{!pro && items.length >= limit ? ' (library full)' : ''}</div>
        <div className="pm-filter" role="group" aria-label="Filter by status">
          {[{ value: 'all', label: 'All' }, ...STATUSES].map((s) => (
            <button key={s.value} type="button" className={filter === s.value ? 'active' : ''} aria-pressed={filter === s.value} onClick={() => setFilter(s.value)}>{s.label}</button>
          ))}
        </div>
      </div>

      <div aria-live="polite">
        {message ? <div className="pm-message">{message}</div> : null}
        {error ? <div className="error-box" role="alert">{error}</div> : null}
      </div>

      {items.length === 0 ? (
        <div className="pm-empty">
          <FileText size={26} aria-hidden="true" />
          <h2>No saved proposals yet.</h2>
          <p>Generate a proposal, then choose Save proposal. It will appear here so you can edit it, copy it and track whether you won the job.</p>
          <Link href="/generator" className="btn-primary">Write a proposal</Link>
        </div>
      ) : shown.length === 0 ? (
        <div className="pm-empty"><p>No proposals with this status.</p></div>
      ) : (
        <ul className="pm-list">
          {shown.map((p) => {
            const isOpen = openId === p.id;
            const isEdit = editId === p.id;
            return (
              <li key={p.id} className="pm-item">
                <div className="pm-row">
                  <button type="button" className="pm-title" onClick={() => setOpenId(isOpen ? null : p.id)} aria-expanded={isOpen}>
                    <span className="pm-title-text">{p.title}</span>
                    <span className="pm-meta">{p.client_name ? `${p.client_name} · ` : ''}Saved {fmt(p.created_at)}</span>
                    <ChevronDown size={16} aria-hidden="true" className={isOpen ? 'flip' : ''} />
                  </button>
                  <label className="pm-status">
                    <span className="sr-only">Status for {p.title}</span>
                    <select value={p.status} disabled={busy === p.id} onChange={(e) => changeStatus(p, e.target.value)} className={`st-${p.status}`}>
                      {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </label>
                </div>

                {isOpen ? (
                  <div className="pm-body">
                    {isEdit ? (
                      <div className="pm-edit">
                        <label>Title<input value={draft.title} maxLength={120} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></label>
                        <label>Client name (optional)<input value={draft.client_name} maxLength={100} onChange={(e) => setDraft({ ...draft, client_name: e.target.value })} /></label>
                        <label>Proposal<textarea value={draft.proposal} maxLength={8000} rows={12} onChange={(e) => setDraft({ ...draft, proposal: e.target.value })} /></label>
                        <div className="pm-actions">
                          <button type="button" className="btn-primary" disabled={busy === p.id} onClick={() => saveEdit(p)}><Check size={15} aria-hidden="true" /> Save changes</button>
                          <button type="button" className="btn-ghost" onClick={() => setEditId(null)}><X size={15} aria-hidden="true" /> Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="pm-text">{p.proposal.split(/\n+/).map((part, i) => (part.trim() ? <p key={i}>{part.trim()}</p> : null))}</div>
                        {p.brief ? <details className="pm-brief"><summary>Original client brief</summary><p>{p.brief}</p></details> : null}
                        <div className="pm-actions">
                          <button type="button" className="btn-ghost" onClick={() => copy(p)}><Copy size={15} aria-hidden="true" /> {copied === p.id ? 'Copied' : 'Copy'}</button>
                          <button type="button" className="btn-ghost" onClick={() => startEdit(p)}><Pencil size={15} aria-hidden="true" /> Edit</button>
                          {confirmId === p.id ? (
                            <>
                              <button type="button" className="btn-danger" disabled={busy === p.id} onClick={() => remove(p)}>Yes, delete</button>
                              <button type="button" className="btn-ghost" onClick={() => setConfirmId(null)}>Keep it</button>
                            </>
                          ) : (
                            <button type="button" className="btn-ghost danger" onClick={() => setConfirmId(p.id)}><Trash2 size={15} aria-hidden="true" /> Delete</button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
