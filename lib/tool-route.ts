import { NextResponse } from 'next/server';
import { consume, rollback, limitMessage, type UsageKind } from '@/lib/usage';
import { ApiError, errorResponse, invalid } from '@/lib/errors';

const MAX_BODY = 40_000;

type Opts<I, O> = {
  kind: UsageKind;
  label: string;
  fallback: string;
  parse: (body: Record<string, unknown>) => I;
  run: (input: I) => Promise<O>;
};

/** Shared POST handler: validate -> charge once -> call AI -> refund on any failure. */
export function toolRoute<I, O>(o: Opts<I, O>) {
  return async function POST(req: Request) {
    let charged = false;
    try {
      const len = Number(req.headers.get('content-length') || 0);
      if (len > MAX_BODY) throw new ApiError(413, 'That request is too large.', 'too_large');
      let body: unknown;
      try { body = await req.json(); } catch { throw invalid('Invalid request.'); }
      if (!body || typeof body !== 'object' || Array.isArray(body)) throw invalid('Invalid request.');
      const input = o.parse(body as Record<string, unknown>);

      const usage = await consume(o.kind);
      if (!usage.allowed) return NextResponse.json({ error: limitMessage(usage, o.label), code: 'limit_reached', usage }, { status: 429 });
      charged = true;

      const data = await o.run(input);
      return NextResponse.json({ data, usage });
    } catch (e) {
      if (charged) await rollback(o.kind);
      if (!(e instanceof ApiError)) {
        const x = e as { name?: string; status?: number; code?: string; message?: string; details?: string; hint?: string };
        console.error('[ProposalHero] route error', { kind: o.kind, name: x?.name, status: x?.status, code: x?.code, message: String(x?.message || '').slice(0, 300), details: x?.details, hint: x?.hint });
      }
      return errorResponse(e, o.fallback);
    }
  };
}
