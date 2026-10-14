// Single source of truth for plan limits. Server enforcement, dashboard,
// pricing copy and generator UI must all read from here.
export type UsageKind = 'proposal' | 'prompt' | 'improvement' | 'analysis' | 'score';

export const USAGE_KINDS: UsageKind[] = ['proposal', 'prompt', 'improvement', 'analysis', 'score'];

export const USAGE_COLUMN: Record<UsageKind, string> = {
  proposal: 'proposal_generations',
  prompt: 'prompt_generations',
  improvement: 'improvements',
  analysis: 'analyses',
  score: 'scores',
};

export const USAGE_LABEL: Record<UsageKind, string> = {
  proposal: 'Proposal generations',
  prompt: 'Prompt generations',
  improvement: 'Humanize & improve',
  analysis: 'Brief analyses',
  score: 'Proposal scores',
};

// Per browser (signed cookie). Cookie limits can be reset by clearing cookies;
// they are a friendly trial limit, not strong anti-abuse.
export const GUEST_LIMITS: Record<UsageKind, number> = { proposal: 3, prompt: 3, improvement: 1, analysis: 1, score: 1 };

// Per UTC calendar month, signed-in Basic account.
export const BASIC_LIMITS: Record<UsageKind, number> = { proposal: 3, prompt: 3, improvement: 3, analysis: 2, score: 2 };

// Pro: generous but capped. Not wired to anything until billing (Phase 3) is verified.
export const PRO_LIMITS: Record<UsageKind, number> = { proposal: 300, prompt: 300, improvement: 150, analysis: 100, score: 100 };

// Hard server-side input caps (characters).
export const INPUT_LIMITS = { brief: 8000, task: 4000, proposal: 6000, short: 300, medium: 1500 } as const;
