import { createClient } from '@/supabase/server';
import { createAdminClient } from '@/supabase/admin';
import { isEntitled } from '@/lib/billing';

export async function getSessionUser() {
  const { data: { user } } = await (await createClient()).auth.getUser();
  return user;
}

export async function getSubscription(userId: string) {
  const { data } = await createAdminClient().from('subscriptions').select('status,ends_at,renews_at').eq('user_id', userId).maybeSingle();
  return data as { status: string | null; ends_at: string | null; renews_at: string | null } | null;
}

export async function getIsPro(userId: string): Promise<boolean> {
  return isEntitled(await getSubscription(userId));
}

export const PROFILE_STYLES = ['professional', 'friendly', 'confident', 'expert', 'casual'] as const;

export type Profile = {
  full_name: string; job_title: string; bio: string; skills: string[]; experience: string;
  portfolio_url: string; github_url: string; linkedin_url: string; writing_style: string;
};

export const EMPTY_PROFILE: Profile = { full_name: '', job_title: '', bio: '', skills: [], experience: '', portfolio_url: '', github_url: '', linkedin_url: '', writing_style: 'professional' };

export async function getProfile(userId: string): Promise<Profile> {
  const { data } = await createAdminClient().from('profiles').select('full_name,job_title,bio,skills,experience,portfolio_url,github_url,linkedin_url,writing_style').eq('id', userId).maybeSingle();
  if (!data) return { ...EMPTY_PROFILE };
  return {
    full_name: data.full_name || '', job_title: data.job_title || '', bio: data.bio || '',
    skills: Array.isArray(data.skills) ? data.skills : [], experience: data.experience || '',
    portfolio_url: data.portfolio_url || '', github_url: data.github_url || '', linkedin_url: data.linkedin_url || '',
    writing_style: data.writing_style || 'professional',
  };
}
