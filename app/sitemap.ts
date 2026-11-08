import type { MetadataRoute } from 'next';
import { guides } from '@/lib/guides';

const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://proposalhero.vercel.app').replace(/\/$/, '');

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['/', '/generator', '/prompts', '/features', '/how-it-works', '/pricing', '/resources', '/contact', '/privacy', '/terms'];
  const core = pages.map((path) => ({
    url: base + path,
    changeFrequency: (path === '/' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
    priority: path === '/' ? 1 : path === '/generator' || path === '/prompts' ? 0.9 : path === '/privacy' || path === '/terms' || path === '/contact' ? 0.3 : 0.7,
  }));
  const guidePages = guides.map((g) => ({ url: `${base}/resources/${g.slug}`, lastModified: new Date(g.updated), changeFrequency: 'monthly' as const, priority: 0.8 }));
  return [...core, ...guidePages];
}
