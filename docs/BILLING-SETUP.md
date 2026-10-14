# Billing setup (follow in order; test mode first)

## What was built
- `POST /api/billing/checkout`: creates a Lemon Squeezy checkout for the SIGNED-IN user and attaches their id.
- `POST /api/webhooks/lemonsqueezy`: verifies Lemon Squeezy's signature, then writes the subscription. This is the ONLY thing that can make someone Pro.
- `POST /api/billing/portal`: opens the customer's own billing page (cancel, update card).
- Dashboard shows Pro badge, renewal/end date, Manage subscription.

## Pro access policy
| Subscription status | Pro? |
|---|---|
| active, on_trial | Yes |
| past_due (payment retrying) | Yes, until it becomes unpaid/expired |
| cancelled | Yes, until the paid period ends (ends_at) |
| paused, unpaid, expired | No |
A success page, URL parameter or browser value never grants Pro.

## Step 1: Database (Supabase -> SQL Editor -> new query)
Paste the contents of `docs/billing-migration.sql` and Run. It only adds two columns and permissions.

## Step 2: Lemon Squeezy (turn on TEST MODE first, toggle at the bottom of the left menu)
1. Settings -> API -> create an API key (name it "ProposalHero"). Copy it once. -> `LEMONSQUEEZY_API_KEY`
2. Settings -> Stores: your Store ID (a number). -> `LEMONSQUEEZY_STORE_ID`
3. Products -> your Pro product -> the variant ID (a number, shown on the variant/checkout link or API). -> `LEMONSQUEEZY_VARIANT_ID`
   The product must be a subscription at $9/month.
4. Make up a webhook secret: run `node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"`. -> `LEMONSQUEEZY_WEBHOOK_SECRET`
5. Settings -> Webhooks -> add (+):
   - URL: `https://YOUR-SITE/api/webhooks/lemonsqueezy` (your real https domain)
   - Signing secret: the value from step 4
   - Events: subscription_created, subscription_updated, subscription_cancelled, subscription_resumed, subscription_expired, subscription_paused, subscription_unpaused

## Step 3: Environment variables
Add to `.env.local` AND Vercel (Settings -> Environment Variables), then redeploy:
`LEMONSQUEEZY_API_KEY`, `LEMONSQUEEZY_STORE_ID`, `LEMONSQUEEZY_VARIANT_ID`, `LEMONSQUEEZY_WEBHOOK_SECRET`,
`NEXT_PUBLIC_SITE_URL` (your real https domain), `NEXT_PUBLIC_PRO_ENABLED=true`,
and for test mode only: `LEMONSQUEEZY_ALLOW_TEST_MODE=true`.
The webhook needs a public URL, so test on your Vercel deployment, not localhost.

## Step 4: Test (test mode)
1. Log in on the live site -> Pricing -> Upgrade to Pro -> pay with Lemon Squeezy's test card.
2. Within seconds, dashboard shows PRO and the Pro limits.
   Check in Supabase SQL Editor: `select status, test_mode, ends_at from public.subscriptions;`
3. Manage subscription -> cancel. Dashboard should say Pro continues until the end date.
4. In Lemon Squeezy -> Webhooks -> recent deliveries: all should show 200.

## Step 5: Going live
Turn off Test mode in Lemon Squeezy, recreate the API key/webhook/product in live mode, update the 4 variables
in Vercel, set `LEMONSQUEEZY_ALLOW_TEST_MODE=false` (or delete it), redeploy, make one real purchase yourself.

## Known limits (honest)
- Refunds: this version reacts to subscription status changes. If you refund, also cancel/expire the subscription in Lemon Squeezy.
- Never paste keys or secrets into chat or screenshots.
- Not yet tested against a real Lemon Squeezy account (none available here). Step 4 is that test.
