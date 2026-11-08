import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://proposalhero.vercel.app').replace(/\/$/, '');

export const metadata: Metadata = {
    metadataBase: new URL(SITE),

    title: {
        default: 'ProposalHero — AI Proposal Generator for Freelancers',
        template: '%s | ProposalHero',
    },

    description:
        'AI proposal generator for freelancers. Write better Upwork and Fiverr proposals, humanize AI proposals, analyze client briefs, score pitches and build better prompts.',

    keywords: [
        'AI proposal generator',
        'freelance proposal generator',
        'Upwork proposal generator',
        'Fiverr proposal generator',
        'AI proposal writer',
        'freelance proposal writer',
        'proposal generator for freelancers',
        'humanize AI proposal',
        'proposal improvement tool',
        'freelance AI tools',
        'freelance proposal writing',
        'Upwork proposal writer',
        'Fiverr proposal writer',
        'AI tools for freelancers',
        'freelancing tools',
        'freelancer productivity tools',
        'client proposal generator',
        'job proposal generator',
        'AI freelancer tools',
    ],

    icons: {
        icon: '/icon-192.png',
        shortcut: '/icon-192.png',
        apple: '/icon-192.png',
    },

    openGraph: {
        title: 'ProposalHero — AI Proposal Generator for Freelancers',
        description:
            'Write client-specific freelance proposals, improve them with AI and build better prompts for the work you win.',
        url: SITE,
        siteName: 'ProposalHero',
        images: [
            {
                url: '/og.png',
                width: 1200,
                height: 630,
                alt: 'ProposalHero — AI tools for freelancers',
            },
        ],
        type: 'website',
    },

    twitter: {
        card: 'summary_large_image',
        title: 'ProposalHero — AI Proposal Generator for Freelancers',
        description:
            'Write better freelance proposals and build better AI prompts.',
        images: ['/og.png'],
    },

    robots: {
        index: true,
        follow: true,
    },
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

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Organization',
                            name: 'ProposalHero',
                            url: SITE,
                            logo: `${SITE}/logo.png`,
                        }),
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'WebSite',
                            name: 'ProposalHero',
                            url: SITE,
                        }),
                    }}
                />
            </body>
        </html>
    );
}