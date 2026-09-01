import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let cached: SupabaseClient | null = null

/**
 * Server-only Supabase client using the service role key, so it can read
 * and write the `users` table directly (auth here is our own JWT/cookie
 * scheme, not Supabase Auth, so RLS is left locked down and bypassed via
 * the service role instead of policies keyed on auth.uid()).
 *
 * Never import this from client components.
 */
export function getSupabase(): SupabaseClient {
    if (cached) return cached

    const url = process.env.SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !serviceRoleKey) {
        throw new Error(
            "Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local"
        )
    }

    cached = createClient(url, serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    })
    return cached
}
