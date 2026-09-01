import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { findUserById, setUserActive } from "@/lib/db/users"

const JWT_SECRET = process.env.JWT_SECRET || "peace-driven-default-secret-key"

async function requireAdmin() {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value
    if (!token) return null

    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
        const userId = (payload as any).userId
        const viewer = await findUserById(userId)
        if (!viewer?.isAdmin) return null
        return viewer
    } catch {
        return null
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await requireAdmin()
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await params
        const { isActive } = await req.json()

        if (typeof isActive !== "boolean") {
            return NextResponse.json({ error: "isActive must be a boolean" }, { status: 400 })
        }

        if (id === admin.id) {
            return NextResponse.json(
                { error: "You can't pause your own account" },
                { status: 400 }
            )
        }

        const target = await findUserById(id)
        if (!target) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const updated = await setUserActive(id, isActive)

        return NextResponse.json({
            user: {
                id: updated?.id,
                isActive: updated?.isActive,
            },
        })
    } catch (error) {
        console.error("Admin user update error:", error)
        return NextResponse.json({ error: "Internal error" }, { status: 500 })
    }
}
