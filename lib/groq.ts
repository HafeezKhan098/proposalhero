import Groq from 'groq-sdk';
import { ApiError, invalid } from '@/lib/errors';

export const model = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';

let client: Groq | null = null;
function getClient(): Groq {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error('[ProposalHero] GROQ_API_KEY is not configured');
    throw new ApiError(503, 'The AI service is not available right now. Please try again later.', 'ai_unconfigured');
  }
  client ??= new Groq({ apiKey, timeout: 45_000, maxRetries: 1 });
  return client;
}

export async function structured<T>(
  name: string,
  schema: Record<string, unknown>,
  messages: { role: 'system' | 'user'; content: string }[],
  max_completion_tokens = 2200
): Promise<T> {
  const groq = getClient();
  let response;
  try {
    response = await groq.chat.completions.create({
      model,
      messages,
      response_format: { type: 'json_schema', json_schema: { name, strict: true, schema } },
      reasoning_effort: 'low',
      // Reasoning tokens count toward this limit; leave headroom so JSON is not cut off.
      max_completion_tokens: max_completion_tokens + 1500,
    });
  } catch (error: unknown) {
    const err = error as { status?: number; name?: string; message?: string; error?: { error?: { code?: string; type?: string } } };
    // Diagnostics only: status + error type. Never prompt content or keys.
    console.error('[ProposalHero AI] provider error', { route: name, model, status: err.status, name: err.name, code: err.error?.error?.code, type: err.error?.error?.type, message: String(err.message || '').slice(0, 300) });
    throw error;
  }

  const choice = response.choices[0];
  if (choice?.finish_reason === 'length') {
    console.error('[ProposalHero AI] output truncated', { route: name, model });
    throw new ApiError(502, 'The AI response was cut off. Please try again, or shorten your input. You were not charged.', 'truncated');
  }
  const content = choice?.message?.content;
  if (!content) throw new ApiError(502, 'The AI returned an empty response. Please try again. You were not charged.', 'empty');
  try {
    return JSON.parse(content) as T;
  } catch {
    console.error('[ProposalHero AI] invalid JSON', { route: name, model });
    throw new ApiError(502, 'The AI returned an unreadable response. Please try again. You were not charged.', 'bad_json');
  }
}

export function assertUsefulInput(input: unknown, min: number, max: number, label = 'text'): string {
  if (typeof input !== 'string') throw invalid(`Please provide ${label}.`);
  const text = input.trim();
  if (text.length < min) throw invalid('Please provide a little more detail so the AI can create something useful.');
  if (text.length > max) throw invalid(`That is too long. Please keep it under ${max.toLocaleString()} characters.`);
  const words = text.toLowerCase().split(/\s+/).filter(Boolean);
  const junk = ['hello', 'hi', 'hey', 'website', 'proposal', 'random', 'test', 'asdf', 'help'];
  if (words.length <= 3 && words.some((w) => junk.includes(w))) {
    throw invalid('That input is too vague. Add the client brief, project details, or task you want help with.');
  }
  return text;
}

/** Optional short field: trims and caps instead of failing. */
export function optionalField(v: unknown, max: number, fallback = ''): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : fallback;
}
