# ProposalHero V6

Production-oriented Next.js 15 application for ProposalHero: proposal generation, Humanize & improve, client brief analysis, proposal scoring, AI Prompt Generator, Supabase authentication and usage controls.

## Local setup

1. Keep your existing `.env.local` private. The V6 source package intentionally does not include it.
2. Install dependencies with `npm install`.
3. Run `npm run dev`.
4. Run `npm run build` before deployment.

Required environment variables are listed in `.env.example`.

## Important when replacing an existing project

Replace the source files from this package into your existing `D:\proposalhero` project, but keep your existing:

- `node_modules`
- `.git`
- `.env.local`

The V6 source does not include any secrets or local environment file.

## Product

- `/` — marketing homepage with Proposal Generator embedded
- `/generator` — dedicated Proposal Generator workspace
- `/prompts` — dedicated Prompt Generator workspace
- `/features` — product overview
- `/how-it-works` — workflow explanation
- `/pricing` — Free / Pro pricing
- `/resources` — freelancer resources
- `/contact` — contact information
- `/privacy` — Privacy Policy
- `/terms` — Terms of Service
- `/login`, `/signup`, `/forgot-password` — authentication
- `/dashboard` — protected workspace

## Analytics

Vercel Analytics remains integrated through `@vercel/analytics/next` in `app/layout.tsx`.
