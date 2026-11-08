-- Run once in Supabase -> SQL Editor. Additive and safe: it only grants your SERVER permission
-- to use the tables that already exist in your schema. No data is changed or deleted.
-- Visitors and normal signed-in users still cannot touch other people's rows (RLS stays on,
-- and the server also filters every query by the signed-in user's id).

grant select, insert, update, delete on public.proposals to service_role;
grant select, insert, update on public.profiles to service_role;
grant select, insert, update on public.usage to service_role;
grant select, insert, update on public.subscriptions to service_role;

-- ROLLBACK (only if ever needed):
--   revoke select, insert, update, delete on public.proposals from service_role;
--   revoke select, insert, update on public.profiles from service_role;
