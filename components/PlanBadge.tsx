import { Crown } from 'lucide-react';

// Driven only by the server-verified plan. Always has a text label (never color alone).
export default function PlanBadge({ pro, size = 'sm' }: { pro: boolean; size?: 'sm' | 'md' }) {
  return (
    <span className={`plan-badge ${pro ? 'is-pro' : 'is-basic'} ${size === 'md' ? 'md' : ''}`} title={pro ? 'Pro plan' : 'Basic plan'}>
      {pro ? <Crown size={size === 'md' ? 14 : 11} aria-hidden="true" /> : null}
      {pro ? 'PRO' : 'BASIC'}
    </span>
  );
}
