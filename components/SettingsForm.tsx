'use client';

import { useState, type FormEvent } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { createClient } from '@/supabase/client';

export type ProfileValues = {
  full_name: string; job_title: string; bio: string; skills: string; experience: string;
  portfolio_url: string; github_url: string; linkedin_url: string; writing_style: string;
};

const STYLES = [
  { value: 'professional', label: 'Professional' }, { value: 'friendly', label: 'Friendly' },
  { value: 'confident', label: 'Confident' }, { value: 'expert', label: 'Expert' }, { value: 'casual', label: 'Casual' },
];

export function ProfileForm({ initial }: { initial: ProfileValues }) {
  const [v, setV] = useState<ProfileValues>(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const set = (k: keyof ProfileValues, value: string) => setV((s) => ({ ...s, [k]: value }));

  async function save(e: FormEvent) {
    e.preventDefault();
    if (saving) return;
    setSaving(true); setMsg(''); setErr('');
    try {
      const r = await fetch('/api/profile', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(v) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || 'We could not save your profile. Please try again.');
      setMsg('Profile saved. The Proposal Generator will use these details to fill in your skills, portfolio and experience.');
    } catch (e2) { setErr(e2 instanceof Error ? e2.message : 'Something went wrong.'); }
    finally { setSaving(false); }
  }

  return (
    <form className="st-form" onSubmit={save} noValidate>
      <div className="st-grid">
        <label>Display name<input value={v.full_name} maxLength={80} autoComplete="name" onChange={(e) => set('full_name', e.target.value)} placeholder="Your name" /></label>
        <label>Job title<input value={v.job_title} maxLength={100} onChange={(e) => set('job_title', e.target.value)} placeholder="e.g. Web developer" /></label>
      </div>
      <label>Short bio<textarea value={v.bio} maxLength={600} rows={3} onChange={(e) => set('bio', e.target.value)} placeholder="One or two sentences about the work you do." /></label>
      <label>Skills (separate with commas)<input value={v.skills} onChange={(e) => set('skills', e.target.value)} placeholder="e.g. Figma, React, SEO" /></label>
      <label>Relevant experience<textarea value={v.experience} maxLength={1500} rows={4} onChange={(e) => set('experience', e.target.value)} placeholder="Real examples only. This is added to your proposals when it is relevant." /></label>
      <div className="st-grid">
        <label>Portfolio link<input type="url" value={v.portfolio_url} maxLength={300} onChange={(e) => set('portfolio_url', e.target.value)} placeholder="https://" /></label>
        <label>Preferred writing style
          <select value={v.writing_style} onChange={(e) => set('writing_style', e.target.value)}>
            {STYLES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </label>
      </div>
      <div className="st-grid">
        <label>GitHub link (optional)<input type="url" value={v.github_url} maxLength={300} onChange={(e) => set('github_url', e.target.value)} placeholder="https://github.com/…" /></label>
        <label>LinkedIn link (optional)<input type="url" value={v.linkedin_url} maxLength={300} onChange={(e) => set('linkedin_url', e.target.value)} placeholder="https://linkedin.com/in/…" /></label>
      </div>
      <div aria-live="polite">
        {msg ? <div className="pm-message">{msg}</div> : null}
        {err ? <div className="error-box" role="alert">{err}</div> : null}
      </div>
      <button type="submit" className="btn-primary" disabled={saving}>{saving ? <Loader2 className="spin" size={15} aria-hidden="true" /> : <Save size={15} aria-hidden="true" />} {saving ? 'Saving…' : 'Save profile'}</button>
    </form>
  );
}

export function PasswordForm() {
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setMsg(''); setErr('');
    if (pw.length < 8) { setErr('Use at least 8 characters.'); return; }
    if (pw !== pw2) { setErr('The two passwords do not match.'); return; }
    setBusy(true);
    const { error } = await createClient().auth.updateUser({ password: pw });
    setBusy(false);
    if (error) { setErr('We could not change your password. Sign out, sign in again and retry.'); return; }
    setPw(''); setPw2(''); setMsg('Password updated.');
  }

  return (
    <form className="st-form" onSubmit={submit} noValidate>
      <div className="st-grid">
        <label>New password<input type="password" value={pw} autoComplete="new-password" onChange={(e) => setPw(e.target.value)} /></label>
        <label>Confirm new password<input type="password" value={pw2} autoComplete="new-password" onChange={(e) => setPw2(e.target.value)} /></label>
      </div>
      <div aria-live="polite">
        {msg ? <div className="pm-message">{msg}</div> : null}
        {err ? <div className="error-box" role="alert">{err}</div> : null}
      </div>
      <button type="submit" className="btn-ghost" disabled={busy}>{busy ? 'Updating…' : 'Change password'}</button>
    </form>
  );
}
