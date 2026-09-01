import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { findUserById, listUsers } from "@/lib/db/users"
import { AdminUsersTable } from "@/components/admin/users-table"
import { ShieldCheck } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const JWT_SECRET = process.env.JWT_SECRET || "peace-driven-default-secret-key"

export default async function AdminPage() {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
        redirect("/login")
    }

    let userId: string
    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
        userId = (payload as any).userId
    } catch {
        redirect("/login")
    }

    const viewer = await findUserById(userId)
    if (!viewer) {
        redirect("/api/auth/logout")
    }
    if (!viewer.isActive) {
        redirect("/api/auth/logout")
    }
    if (!viewer.isAdmin) {
        redirect("/dashboard")
    }

    const users = await listUsers()

    return (
        <div className="container mx-auto max-w-6xl animate-in p-4 duration-700 fade-in slide-in-from-bottom-4 sm:p-6 lg:p-8">
            <div className="flex flex-col space-y-8">
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                        <ShieldCheck className="h-5 w-5" />
                        <span className="text-xs font-bold tracking-widest uppercase">
                            Admin
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                        Users
                    </h1>
                    <p className="text-muted-foreground">
                        {users.length} {users.length === 1 ? "user" : "users"} signed
                        up so far.
                    </p>
                </div>

                <Card className="border-border bg-background shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg">All Users</CardTitle>
                        <CardDescription>
                            Every signup, where they are in the Activation Pathway,
                            and whether their account is active.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <AdminUsersTable initialUsers={users} viewerId={viewer.id} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
