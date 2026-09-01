-- Lets admins pause/reactivate a user's account. Paused accounts can't log
-- in (checked at /api/auth/login) and lose access on their next request if
-- already signed in (checked wherever the app already re-reads the user
-- row per-request: dashboard, onboarding, admin, and the onboarding APIs).

alter table public.users
    add column if not exists is_active boolean not null default true;
