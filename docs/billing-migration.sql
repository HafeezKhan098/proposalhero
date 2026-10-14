-- ProposalHero billing migration (additive and safe: no data is deleted or changed).
-- Run once in Supabase -> SQL Editor.

-- Lets the webhook ignore older/out-of-order events and mark Lemon Squeezy test events.
alter table public.subscriptions add column if not exists provider_updated_at timestamptz;
alter table public.subscriptions add column if not exists test_mode boolean not null default false;

-- Your server (service_role) must be allowed to write subscriptions. Visitors still cannot.
grant select, insert, update on public.subscriptions to service_role;
grant select, insert, update on public.usage to service_role;

-- ROLLBACK (only if you ever need to undo):
--   alter table public.subscriptions drop column if exists provider_updated_at;
--   alter table public.subscriptions drop column if exists test_mode;
