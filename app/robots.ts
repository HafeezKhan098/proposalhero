import type { MetadataRoute } from 'next';
const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://proposalhero.vercel.app').replace(/\/$/, '');
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/auth/', '/dashboard'] }, sitemap: `${base}/sitemap.xml` };
}
