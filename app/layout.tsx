import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ProposalHero',
  description: 'Generate winning Fiverr proposals instantly',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}