import { NextResponse } from 'next/server';
import { createAdminClient } from '@/supabase/admin';
import { EMPTY_PROFILE, PROFILE_STYLES, getProfile, getSessionUser } from '@/lib/account';
import { ApiError, errorResponse, invalid } from '@/lib/errors';
import { sameOrigin } from '@/lib/lemon';

export const dynamic = 'force-dynamic';

const text = (v: unknown, max: number, label: string) => {
  if (v === undefined || v === null) return '';
  if (typeof v !== 'string') throw invalid(`${label} is not valid.`);
  const t = v.trim();
  if (t.length > max) throw invalid(`${label} is too long (maximum ${max} characters).`);
  return t;
};

const link = (v: unknown, label: string) => {
  const t = text(v, 300, label);
  if (!t) return '';
  let u: URL;
  try { u = new URL(t); } catch { throw invalid(`${label} must be a full link starting with https://`); }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') throw invalid(`${label} must be a full link starting with https://`);
  return u.toString();
};

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ profile: null }, { headers: { 'Cache-Control': 'no-store' } });
    return NextResponse.json({ profile: await getProfile(user.id) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    console.error('[ProposalHero] profile read failed', e instanceof Error ? e.message : 'unknown');
    return NextResponse.json({ profile: null }, { headers: { 'Cache-Control': 'no-store' } });
  }
}

export async function PUT(req: Request) {
  try {
    if (!sameOrigin(req)) throw new ApiError(403, 'Invalid request.');
    const user = await getSessionUser();
    if (!user) throw new ApiError(401, 'Please sign in to save your profile.', 'unauthenticated');
    let body: unknown;
    try { body = await req.json(); } catch { throw invalid('Invalid request.'); }
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw invalid('Invalid request.');
    const b = body as Record<string, unknown>;

    const rawSkills = Array.isArray(b.skills) ? b.skills : typeof b.skills === 'string' ? b.skills.split(',') : [];
    const skills = rawSkills.map((s) => String(s).trim()).filter(Boolean);
    if (skills.length > 20) throw invalid('Please list up to 20 skills.');
    if (skills.some((s) => s.length > 40)) throw invalid('Each skill must be 40 characters or fewer.');
    const style = typeof b.writing_style === 'string' && (PROFILE_STYLES as readonly string[]).includes(b.writing_style) ? b.writing_style : EMPTY_PROFILE.writing_style;

    const row = {
      id: user.id,
      email: user.email || null,
      full_name: text(b.full_name, 80, 'Name'),
      job_title: text(b.job_title, 100, 'Job title'),
      bio: text(b.bio, 600, 'Bio'),
      skills,
      experience: text(b.experience, 1500, 'Experience'),
      portfolio_url: link(b.portfolio_url, 'Portfolio link'),
      github_url: link(b.github_url, 'GitHub link'),
      linkedin_url: link(b.linkedin_url, 'LinkedIn link'),
      writing_style: style,
    };
    const { error } = await createAdminClient().from('profiles').upsert(row, { onConflict: 'id' });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (!(e instanceof ApiError)) {
      const x = e as { code?: string; message?: string };
      console.error('[ProposalHero] profile save failed', { code: x?.code, message: String(x?.message || '').slice(0, 200) });
    }
    return errorResponse(e, 'We could not save your profile. Please try again.');
  }
}
