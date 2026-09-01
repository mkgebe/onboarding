-- Admin flag for the /admin portal. Defaults to false for every existing
-- and future user; promote an admin manually, e.g.:
--   update public.users set is_admin = true where email = 'you@example.com';

alter table public.users
    add column if not exists is_admin boolean not null default false;
