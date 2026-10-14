// Entitlement policy (documented in docs/BILLING-SETUP.md).
// Status values are from Lemon Squeezy's subscription object docs.
export type SubRow = { status: string | null; ends_at: string | null };

export function isEntitled(sub: SubRow | null | undefined, now = new Date()): boolean {
  if (!sub?.status) return false;
  switch (sub.status) {
    case 'active':
    case 'on_trial':
    case 'past_due': // payment retries in progress; access ends if it becomes unpaid/expired
      return true;
    case 'cancelled': // paid period still valid until ends_at
      return !!sub.ends_at && new Date(sub.ends_at) > now;
    default: // paused, unpaid, expired, inactive, unknown
      return false;
  }
}

export const KNOWN_STATUSES = ['on_trial', 'active', 'paused', 'past_due', 'unpaid', 'cancelled', 'expired'];
