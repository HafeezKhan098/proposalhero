import type { MetadataRoute } from 'next';
const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://proposalhero.vercel.app').replace(/\/$/, '');
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['/', '/generator', '/prompts', '/features', '/how-it-works', '/pricing', '/resources', '/contact', '/privacy', '/terms'];
  return paths.map((path) => ({ url: base + path, changeFrequency: path === '/' ? 'weekly' : 'monthly', priority: path === '/' ? 1 : path === '/generator' || path === '/prompts' ? 0.9 : 0.6 }));
}
