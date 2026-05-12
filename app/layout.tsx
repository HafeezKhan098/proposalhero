import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

export const metadata: Metadata = {
  title: 'ProposalHero — Free AI Fiverr Proposal Generator',
  description: 'Generate winning Fiverr and Upwork proposals in seconds with AI. Free proposal generator that sounds human, not robotic. No signup needed.',
  keywords: 'fiverr proposal generator, AI proposal writer, upwork proposal generator, fiverr proposal template, winning fiverr proposal, AI proposal tool free',
  openGraph: {
    title: 'ProposalHero — Free AI Fiverr Proposal Generator',
    description: 'Generate winning Fiverr proposals in seconds. Sounds human, not robotic. Free to try.',
    url: 'https://proposalhero.vercel.app',
    siteName: 'ProposalHero',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProposalHero — Free AI Fiverr Proposal Generator',
    description: 'Generate winning Fiverr proposals in seconds. Free to try.',
  },
  alternates: {
    canonical: 'https://proposalhero.vercel.app',
  },
  robots: {
    index: true,
    follow: true,
  }
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