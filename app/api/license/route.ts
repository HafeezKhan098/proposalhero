import { NextRequest, NextResponse } from 'next/server';
import { activateLicense, applyPro, deactivateLicense } from '@/lib/license';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// Soft protection so nobody can use this endpoint to burn Lemon Squeezy's rate limit.
// (In-memory, per server instance; good enough to stop casual abuse.)
const WINDOW_MS = 10 * 60 * 1000;
const MAX_FAILURES = 10;
const failures = new Map<string, { count: number; reset: number }>();

function clientIp(req: NextRequest): string {
  return (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
}

function isBlocked(ip: string): boolean {
  const f = failures.get(ip);
  if (!f) return false;
  if (Date.now() > f.reset) {
    failures.delete(ip);
    return false;
  }
  return f.count >= MAX_FAILURES;
}

function recordFailure(ip: string) {
  const now = Date.now();
  if (failures.size > 500) {
    failures.forEach((v, k) => {
      if (now > v.reset) failures.delete(k);
    });
  }
  const f = failures.get(ip);
  if (f && now <= f.reset) f.count += 1;
  else failures.set(ip, { count: 1, reset: now + WINDOW_MS });
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'That request was not valid. Please refresh and try again.' }, { status: 400 });
  }

  if (body.action === 'activate') {
    const ip = clientIp(req);
    if (isBlocked(ip)) {
      return NextResponse.json(
        { error: 'Too many attempts. Please wait a few minutes and try again.' },
        { status: 429 }
      );
    }
    const result = await activateLicense(typeof body.licenseKey === 'string' ? body.licenseKey : '');
    if (!result.ok) {
      if (result.status === 400) recordFailure(ip);
      return NextResponse.json({ error: result.message }, { status: result.status });
    }
    const res = NextResponse.json({ ok: true, pro: true });
    applyPro(res, { pro: true, setCookie: result.cookie });
    return res;
  }

  if (body.action === 'deactivate') {
    await deactivateLicense(req);
    const res = NextResponse.json({ ok: true, pro: false });
    applyPro(res, { pro: false, clear: true });
    return res;
  }

  return NextResponse.json({ error: 'Unknown request.' }, { status: 400 });
}
