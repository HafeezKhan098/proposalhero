import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Contact',
    description:
        'Contact ProposalHero for account, billing, privacy or product questions.',
    alternates: { canonical: '/contact' },
};

export default function Page() {
    return (
        <>
            <Header />

            <main className="marketing-page">
                <section className="simple-hero">
                    <div className="content-narrow">
                        <div className="eyebrow">Contact</div>

                        <h1>
                            Need a hand?
                            <br />
                            <em>We&apos;re listening.</em>
                        </h1>

                        <p>
                            For account, billing, privacy or product questions, email the
                            ProposalHero team.
                        </p>

                        <a
                            className="contact-email"
                            href="https://mail.google.com/mail/?view=cm&fs=1&to=proposalhero@gmail.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Mail size={18} />
                            proposalhero@gmail.com
                            <ArrowUpRight size={16} />
                        </a>
                    </div>
                </section>

                <section className="contact-grid">
                    <div>
                        <span>ACCOUNT</span>
                        <h2>Login, signup or saved work</h2>
                        <p>
                            Include the email associated with your ProposalHero account and a
                            short description of the problem.
                        </p>
                    </div>

                    <div>
                        <span>BILLING</span>
                        <h2>Pro subscription questions</h2>
                        <p>
                            For checkout or subscription issues, include the email used for
                            your purchase. Payment processing is handled through Lemon
                            Squeezy.
                        </p>
                    </div>

                    <div>
                        <span>PRIVACY</span>
                        <h2>Data or deletion requests</h2>
                        <p>
                            Tell us what you need and we&apos;ll help with the applicable account
                            information.
                        </p>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}