import { getSupabase } from "@/lib/supabase"

export type PaymentStatus = "trial" | "paid" | "renewal_due" | "expired"

export interface OnboardingStatus {
    hasSeenCelebration: boolean
    currentPhase: number
    currentStep: string
    isCompleted: boolean
    updatedAt: string | null
}

export interface User {
    id: string
    email: string
    password?: string | null
    firstName: string
    lastName: string
    isAdmin: boolean
    isActive: boolean
    paymentStatus: PaymentStatus
    renewalDate: string | null
    onboardingStatus: OnboardingStatus
    connection: Record<string, any>
    awareness: Record<string, any>
    stabilization: Record<string, any>
    createdAt: string
}

type UserRow = {
    id: string
    email: string
    password: string | null
    first_name: string
    last_name: string
    is_admin: boolean
    is_active: boolean
    payment_status: PaymentStatus
    renewal_date: string | null
    onboarding_status: OnboardingStatus
    connection: Record<string, any>
    awareness: Record<string, any>
    stabilization: Record<string, any>
    created_at: string
}

const SELECT_COLUMNS =
    "id, email, password, first_name, last_name, is_admin, is_active, payment_status, renewal_date, onboarding_status, connection, awareness, stabilization, created_at"

function toUser(row: UserRow): User {
    return {
        id: row.id,
        email: row.email,
        password: row.password,
        firstName: row.first_name,
        lastName: row.last_name,
        isAdmin: row.is_admin,
        isActive: row.is_active,
        paymentStatus: row.payment_status,
        renewalDate: row.renewal_date,
        onboardingStatus: row.onboarding_status,
        connection: row.connection,
        awareness: row.awareness,
        stabilization: row.stabilization,
        createdAt: row.created_at,
    }
}

export async function findUserByEmail(email: string): Promise<User | null> {
    const supabase = getSupabase()
    const { data, error } = await supabase
        .from("users")
        .select(SELECT_COLUMNS)
        .eq("email", email)
        .maybeSingle()

    if (error) throw error
    return data ? toUser(data as unknown as UserRow) : null
}

export async function findUserById(id: string): Promise<User | null> {
    const supabase = getSupabase()
    const { data, error } = await supabase
        .from("users")
        .select(SELECT_COLUMNS)
        .eq("id", id)
        .maybeSingle()

    if (error) throw error
    return data ? toUser(data as unknown as UserRow) : null
}

export interface UserSummary {
    id: string
    email: string
    firstName: string
    lastName: string
    isAdmin: boolean
    isActive: boolean
    paymentStatus: PaymentStatus
    renewalDate: string | null
    onboardingStatus: OnboardingStatus
    createdAt: string
}

/**
 * Roster for the /admin portal: everyone, newest first, without the
 * password hash or the bulky connection/awareness/stabilization blobs.
 */
export async function listUsers(): Promise<UserSummary[]> {
    const supabase = getSupabase()
    const { data, error } = await supabase
        .from("users")
        .select(
            "id, email, first_name, last_name, is_admin, is_active, payment_status, renewal_date, onboarding_status, created_at"
        )
        .order("created_at", { ascending: false })

    if (error) throw error

    return (data ?? []).map((row: any) => ({
        id: row.id,
        email: row.email,
        firstName: row.first_name,
        lastName: row.last_name,
        isAdmin: row.is_admin,
        isActive: row.is_active,
        paymentStatus: row.payment_status,
        renewalDate: row.renewal_date,
        onboardingStatus: row.onboarding_status,
        createdAt: row.created_at,
    }))
}

/**
 * Admin-only: pause or reactivate a user's account. Paused users are
 * blocked at login, and lose access on their next request anywhere the
 * app re-reads the user row per-request (dashboard, onboarding, admin,
 * onboarding APIs).
 */
export async function setUserActive(
    userId: string,
    isActive: boolean
): Promise<User | null> {
    const supabase = getSupabase()
    const { data, error } = await supabase
        .from("users")
        .update({ is_active: isActive })
        .eq("id", userId)
        .select(SELECT_COLUMNS)
        .maybeSingle()

    if (error) throw error
    return data ? toUser(data as unknown as UserRow) : null
}

/**
 * Admin-only: set a user's payment status and optional renewal date.
 * No payment processor is wired in, so this is a plain manual field.
 */
export async function setUserPayment(
    userId: string,
    input: { paymentStatus?: PaymentStatus; renewalDate?: string | null }
): Promise<User | null> {
    const supabase = getSupabase()
    const payload: Record<string, any> = {}
    if (input.paymentStatus !== undefined) payload.payment_status = input.paymentStatus
    if (input.renewalDate !== undefined) payload.renewal_date = input.renewalDate

    const { data, error } = await supabase
        .from("users")
        .update(payload)
        .eq("id", userId)
        .select(SELECT_COLUMNS)
        .maybeSingle()

    if (error) throw error
    return data ? toUser(data as unknown as UserRow) : null
}

export async function createUser(input: {
    email: string
    password: string
    firstName: string
    lastName: string
}): Promise<User> {
    const supabase = getSupabase()
    const { data, error } = await supabase
        .from("users")
        .insert({
            email: input.email,
            password: input.password,
            first_name: input.firstName,
            last_name: input.lastName,
        })
        .select(SELECT_COLUMNS)
        .single()

    if (error) throw error
    return toUser(data as unknown as UserRow)
}

// Top-level dot-path keys (e.g. "connection.triage.neurodiversity",
// "onboardingStatus.isCompleted") map to these jsonb columns.
const JSON_COLUMNS: Record<string, string> = {
    onboardingStatus: "onboarding_status",
    connection: "connection",
    awareness: "awareness",
    stabilization: "stabilization",
}

function setPath(target: Record<string, any>, path: string[], value: unknown) {
    let cursor = target
    for (let i = 0; i < path.length - 1; i++) {
        const key = path[i]
        if (typeof cursor[key] !== "object" || cursor[key] === null) {
            cursor[key] = {}
        }
        cursor = cursor[key]
    }
    cursor[path[path.length - 1]] = value
}

/**
 * Applies dot-path updates (e.g. { "connection.triage.disc": "D",
 * "onboardingStatus.currentPhase": 2 }) onto the user's jsonb columns.
 * Mirrors the flexible dot-path update shape the onboarding UI already
 * sends (a holdover from Mongoose's $set), since Postgres jsonb has no
 * built-in equivalent — so we fetch, deep-merge in JS, and write back
 * only the jsonb columns actually touched.
 */
export async function updateUserFields(
    userId: string,
    updates: Record<string, unknown>
): Promise<User | null> {
    const touchedTopLevel = new Set<string>()
    for (const key of Object.keys(updates)) {
        const top = key.split(".")[0]
        if (JSON_COLUMNS[top]) touchedTopLevel.add(top)
    }

    if (touchedTopLevel.size === 0) {
        return findUserById(userId)
    }

    const supabase = getSupabase()
    const columns = Array.from(touchedTopLevel).map((top) => JSON_COLUMNS[top])

    const { data: current, error: fetchError } = await supabase
        .from("users")
        .select(columns.join(","))
        .eq("id", userId)
        .maybeSingle()

    if (fetchError) throw fetchError
    if (!current) return null

    const blobs: Record<string, Record<string, any>> = {}
    for (const top of touchedTopLevel) {
        const column = JSON_COLUMNS[top]
        blobs[top] = { ...(current as Record<string, any>)[column] }
    }

    for (const [key, value] of Object.entries(updates)) {
        const path = key.split(".")
        const top = path[0]
        if (!JSON_COLUMNS[top]) continue
        setPath(blobs[top], path.slice(1), value)
    }

    const payload: Record<string, any> = {}
    for (const top of touchedTopLevel) {
        payload[JSON_COLUMNS[top]] = blobs[top]
    }

    const { data: updated, error } = await supabase
        .from("users")
        .update(payload)
        .eq("id", userId)
        .select(SELECT_COLUMNS)
        .single()

    if (error) throw error
    return toUser(updated as unknown as UserRow)
}
