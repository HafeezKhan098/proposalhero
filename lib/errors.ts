import { NextResponse } from 'next/server';

export class ApiError extends Error {
  constructor(public status: number, public publicMessage: string, public code = 'error') {
    super(publicMessage);
  }
}

export const invalid = (msg: string) => new ApiError(400, msg, 'invalid_input');

/** Map any thrown value to a safe public response. Never leaks provider text, keys or stacks. */
export function errorResponse(e: unknown, fallback: string) {
  if (e instanceof ApiError) return NextResponse.json({ error: e.publicMessage, code: e.code }, { status: e.status });
  const status = (e as { status?: number } | null)?.status;
  if (status === 429) return NextResponse.json({ error: 'The AI service is busy right now. Please try again in a moment. You were not charged.', code: 'provider_rate_limited' }, { status: 429 });
  if (typeof status === 'number' && status >= 400 && status < 500) {
    return NextResponse.json({ error: 'The AI service could not process this request. Try shortening your text. You were not charged.', code: 'provider_rejected' }, { status: 502 });
  }
  return NextResponse.json({ error: fallback, code: 'internal' }, { status: 500 });
}
