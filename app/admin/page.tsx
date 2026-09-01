import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { findUserById, listUsers } from "@/lib/db/users"
import { cn } from "@/lib/utils"
import { ShieldCheck } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const JWT_SECRET = process.env.JWT_SECRET || "peace-driven-default-secret-key"

const PHASE_NAMES: Record<number, string> = {
    1: "Connection",
    2: "Awareness",
    3: "Stabilization",
    4: "Activation",
}

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
    if (!viewer?.isAdmin) {
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
                            Read-only roster of every signup and where they are in
                            the Activation Pathway.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {users.length === 0 ? (
                            <p className="p-6 text-sm text-muted-foreground">
                                No users have signed up yet.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border/50 text-left text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                            <th className="px-6 py-3">Name</th>
                                            <th className="px-6 py-3">Email</th>
                                            <th className="px-6 py-3">Phase</th>
                                            <th className="px-6 py-3">Step</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Signed Up</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => {
                                            const status = user.onboardingStatus
                                            return (
                                                <tr
                                                    key={user.id}
                                                    className="border-b border-border/50 last:border-0"
                                                >
                                                    <td className="px-6 py-4 font-semibold whitespace-nowrap">
                                                        {user.firstName} {user.lastName}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {status?.currentPhase
                                                            ? `${status.currentPhase} · ${PHASE_NAMES[status.currentPhase] || ""}`
                                                            : "—"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {status?.currentStep || "—"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={cn(
                                                                "rounded-full border px-2.5 py-0.5 text-xs font-bold",
                                                                status?.isCompleted
                                                                    ? "border-green-500/20 bg-green-500/10 text-green-600"
                                                                    : "border-primary/20 bg-primary/10 text-primary"
                                                            )}
                                                        >
                                                            {status?.isCompleted
                                                                ? "Completed"
                                                                : "In Progress"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                                                        {new Date(
                                                            user.createdAt
                                                        ).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
