import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

export const metadata: Metadata = {
  verification: {
    google: 'm5kEgZMt2z3gIVtTw9ig-dUWufXtZ19SHSFzxha3xQg',
  },
  title: 'ProposalHero — AI Proposal Writer for Fiverr & Upwork',
  description: 'Write personalized Fiverr and Upwork proposals with AI. Paste the job, pick a tone, edit and copy. 3 free proposals a day, no signup needed.',
  keywords: 'fiverr proposal generator, AI proposal writer, upwork proposal generator, fiverr proposal template, winning fiverr proposal, AI proposal tool free',
  openGraph: {
    title: 'ProposalHero — AI Proposal Writer for Fiverr & Upwork',
    description: 'Write personalized Fiverr and Upwork proposals with AI. Edit, humanize and copy. Free to try.',
    url: 'https://proposalhero.vercel.app',
    siteName: 'ProposalHero',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProposalHero — AI Proposal Writer for Fiverr & Upwork',
    description: 'Write personalized Fiverr and Upwork proposals with AI. Free to try.',
  },
  alternates: {
    canonical: 'https://proposalhero.vercel.app',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}