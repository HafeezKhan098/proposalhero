'use client';
import { useState } from 'react';

export default function BillingButton({ endpoint, label, className }: { endpoint: string; label: string; className?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function go() {
    if (busy) return;
    setBusy(true); setError('');
    try {
      const r = await fetch(endpoint, { method: 'POST' });
      const j = await r.json().catch(() => ({}));
      if (r.status === 401) { window.location.href = '/login'; return; }
      if (!r.ok || !j.url) throw new Error(j.error || 'Something went wrong. Please try again.');
      window.location.href = j.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
      setBusy(false);
    }
  }
  return <>
    <button type="button" className={className} onClick={go} disabled={busy}>{busy ? 'Please wait…' : label}</button>
    {error && <small role="alert" style={{ display: 'block', marginTop: 8 }}>{error}</small>}
  </>;
}
