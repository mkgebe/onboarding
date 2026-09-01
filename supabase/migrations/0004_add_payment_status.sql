-- Manual payment tracking. No processor is wired in yet, so admins set
-- this by hand from /admin: trial, paid, renewal_due, or expired, plus
-- an optional renewal date for their own reference.

alter table public.users
    add column if not exists payment_status text not null default 'trial',
    add column if not exists renewal_date date;

alter table public.users
    add constraint users_payment_status_check
    check (payment_status in ('trial', 'paid', 'renewal_due', 'expired'));
