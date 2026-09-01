import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { findUserById, updateUserFields } from "@/lib/db/users"

const JWT_SECRET = process.env.JWT_SECRET || "peace-driven-default-secret-key"

export async function POST() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("auth_token")?.value

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
        const userId = (payload as any).userId

        const viewer = await findUserById(userId)
        if (!viewer) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }
        if (!viewer.isActive) {
            return NextResponse.json(
                { error: "This account has been paused." },
                { status: 403 }
            )
        }

        await updateUserFields(userId, {
            "onboardingStatus.hasSeenCelebration": true
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Celebration completion error:", error)
        return NextResponse.json({ error: "Internal Error" }, { status: 500 })
    }
}
