-- Users table backing the app's own bcrypt + JWT-cookie auth (not Supabase Auth).
-- Accessed exclusively via the server-side service role key, so RLS is left
-- enabled with no policies: it blocks anon/authenticated access entirely and
-- is bypassed by the service role, which is exactly the access model this
-- app relies on.

create extension if not exists pgcrypto;

create table if not exists public.users (
    id uuid primary key default gen_random_uuid(),
    email text not null unique,
    password text,
    first_name text not null,
    last_name text not null,
    onboarding_status jsonb not null default jsonb_build_object(
        'hasSeenCelebration', false,
        'currentPhase', 1,
        'currentStep', '1A',
        'isCompleted', false,
        'updatedAt', null
    ),
    connection jsonb not null default jsonb_build_object(
        'snapshot', '{}'::jsonb,
        'triage', '{}'::jsonb,
        'openShare', null
    ),
    awareness jsonb not null default jsonb_build_object(
        'evaluation360', '[]'::jsonb,
        'growthInputs', '{}'::jsonb,
        'eveningPulse', '{}'::jsonb,
        'rhythmSnapshot', '{}'::jsonb,
        'bossIndex', '{}'::jsonb,
        'capacityPulse', '[]'::jsonb,
        'commitments', '[]'::jsonb
    ),
    stabilization jsonb not null default jsonb_build_object(
        'visionActivation', '{}'::jsonb,
        'visionStatements', '{}'::jsonb,
        'idealDayStory', null,
        'wordOfYear', null,
        'familyMission', jsonb_build_object('values', '[]'::jsonb, 'statement', null)
    ),
    created_at timestamptz not null default now()
);

alter table public.users enable row level security;
