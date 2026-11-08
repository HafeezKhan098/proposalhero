# Launch checklist

Tick every box in order. Do not skip the tests.

## A. One-time setup
- [ ] Supabase SQL Editor: run `docs/billing-migration.sql`, then `docs/saved-proposals-migration.sql`.
- [ ] Vercel -> Settings -> Environment Variables (Production) contain:
  `GROQ_API_KEY`, `GROQ_MODEL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`,
  `SUPABASE_SECRET_KEY`, `USAGE_SECRET`, `NEXT_PUBLIC_SITE_URL` (your real https domain).
- [ ] Supabase -> Authentication -> URL Configuration: Site URL = your domain; add `https://YOUR-DOMAIN/**` to Redirect URLs.
- [ ] Billing variables set (see `docs/BILLING-SETUP.md`); `NEXT_PUBLIC_PRO_ENABLED=true` only after a test purchase works.
- [ ] `LEMONSQUEEZY_ALLOW_TEST_MODE` is deleted or `false` for real sales.

## B. Build
- [ ] `npm install`
- [ ] `npm run build` finishes with no errors.
- [ ] In the build output, a Middleware entry is listed (session refresh is running).

## C. Test as a visitor (private/incognito window)
- [ ] Home page loads; generate 3 proposals. The 4th shows the limit message with Create account and Sign in links, and your text is still there.
- [ ] Prompt Generator: 3 prompts, then the limit message.
- [ ] Open `/dashboard`, `/proposals`, `/settings` while signed out: each redirects to the login page.

## D. Test as a Basic user
- [ ] Sign up, click the email link, sign in.
- [ ] Settings: save your profile. Generator now pre-fills skills, experience and portfolio.
- [ ] Generate a proposal, click Save proposal. It appears in My proposals.
- [ ] Edit it, change the status, copy it, delete it.
- [ ] Save 3 proposals, then try a 4th: you see the Basic limit message with the upgrade option.
- [ ] Dashboard numbers match what you used. Header shows your name (no PRO badge).
- [ ] Forgot password email arrives, and the reset link works in the same browser.

## E. Test as a Pro user (Lemon Squeezy test mode first)
- [ ] Upgrade to Pro with the test card. Dashboard, header and settings show the PRO badge within a minute.
- [ ] Limits show 300 / 300 / 150 / 100 / 100 and the library shows 500.
- [ ] Manage subscription opens the Lemon Squeezy portal. Cancel: dashboard says access continues until the end date.
- [ ] Lemon Squeezy -> Webhooks -> recent deliveries all show 200.
- [ ] Remove test data: `delete from public.subscriptions where test_mode = true;`

## F. Phone check (real phone or browser dev tools at 320, 375 and 390 px wide)
- [ ] No sideways scrolling on any page.
- [ ] Menu opens, closes after tapping a link, and Escape closes it on desktop.
- [ ] Generator, results, My proposals and Settings are readable and every button is easy to tap.

## G. SEO (after the site is live)
- [ ] Open `/sitemap.xml` and `/robots.txt`: both load and use your real domain.
- [ ] Google Search Console: add your domain, verify it, submit `/sitemap.xml`.
- [ ] Inspect the home page, `/generator`, `/prompts` and one guide with the URL Inspection tool; click Request indexing.
- [ ] Test social sharing: paste the home URL into a chat app; the dark ProposalHero card should appear.
- [ ] Run PageSpeed Insights on the home page and record the real scores.

## H. Go live with real payments
- [ ] Lemon Squeezy: switch off Test mode, recreate product, API key and webhook in live mode.
- [ ] Update the four LEMONSQUEEZY variables in Vercel, redeploy, make one real purchase yourself, confirm PRO shows, then cancel and refund yourself if you wish.
