import { ApiError } from '@/lib/errors';

const API = 'https://api.lemonsqueezy.com/v1';

export function lsConfig() {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;
  if (!apiKey || !storeId || !variantId) {
    console.error('[ProposalHero billing] Lemon Squeezy env vars are not fully configured');
    throw new ApiError(503, 'Billing is not available right now. Please try again later.', 'billing_unconfigured');
  }
  return { apiKey, storeId, variantId };
}

export async function lsFetch(path: string, apiKey: string, init: { method?: string; body?: unknown } = {}) {
  return fetch(`${API}${path}`, {
    method: init.method || 'GET',
    headers: { Accept: 'application/vnd.api+json', 'Content-Type': 'application/vnd.api+json', Authorization: `Bearer ${apiKey}` },
    body: init.body ? JSON.stringify(init.body) : undefined,
    signal: AbortSignal.timeout(15_000),
  });
}

export function isLemonUrl(u: unknown): u is string {
  if (typeof u !== 'string') return false;
  try { const x = new URL(u); return x.protocol === 'https:' && (x.hostname === 'lemonsqueezy.com' || x.hostname.endsWith('.lemonsqueezy.com')); } catch { return false; }
}

export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true; // non-browser or same-origin GET-like; auth cookie is still required
  try { return new URL(origin).host === req.headers.get('host'); } catch { return false; }
}
