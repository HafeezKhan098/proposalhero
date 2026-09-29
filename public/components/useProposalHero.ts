'use client';
import { useState } from 'react';

export function useProposalHero() {
  const [brief, setBrief] = useState('');
  const [proposal, setProposal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function generate(niche: string, tone: string, mode: string) {
    if (!brief.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief, niche, tone, mode })
      });

      const data = await res.json();

      if (data.error) setError(data.error);
      else setProposal(data.proposal);

    } catch {
      setError('Network error');
    }

    setLoading(false);
  }

  return {
    brief,
    setBrief,
    proposal,
    loading,
    error,
    generate
  };
}