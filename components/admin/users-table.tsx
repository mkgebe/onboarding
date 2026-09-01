"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { UserSummary } from "@/lib/db/users"

const PHASE_NAMES: Record<number, string> = {
    1: "Connection",
    2: "Awareness",
    3: "Stabilization",
    4: "Activation",
}

export function AdminUsersTable({
    initialUsers,
    viewerId,
}: {
    initialUsers: UserSummary[]
    viewerId: string
}) {
    const [users, setUsers] = useState(initialUsers)
    const [pendingId, setPendingId] = useState<string | null>(null)

    async function toggleActive(id: string, nextActive: boolean) {
        setPendingId(id)
        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: nextActive }),
            })
            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Failed to update account")
            }

            setUsers((prev) =>
                prev.map((u) => (u.id === id ? { ...u, isActive: nextActive } : u))
            )
            toast.success(nextActive ? "Account reactivated" : "Account paused")
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setPendingId(null)
        }
    }

    if (users.length === 0) {
        return (
            <p className="p-6 text-sm text-muted-foreground">
                No users have signed up yet.
            </p>
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-border/50 text-left text-xs font-bold tracking-wider text-muted-foreground uppercase">
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3">Phase</th>
                        <th className="px-6 py-3">Step</th>
                        <th className="px-6 py-3">Progress</th>
                        <th className="px-6 py-3">Account</th>
                        <th className="px-6 py-3">Signed Up</th>
                        <th className="px-6 py-3" />
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => {
                        const status = user.onboardingStatus
                        const isSelf = user.id === viewerId
                        const isPending = pendingId === user.id

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
                                        {status?.isCompleted ? "Completed" : "In Progress"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={cn(
                                            "rounded-full border px-2.5 py-0.5 text-xs font-bold",
                                            user.isActive
                                                ? "border-green-500/20 bg-green-500/10 text-green-600"
                                                : "border-destructive/20 bg-destructive/10 text-destructive"
                                        )}
                                    >
                                        {user.isActive ? "Active" : "Paused"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    {isSelf ? (
                                        <span className="text-xs text-muted-foreground">You</span>
                                    ) : (
                                        <Button
                                            variant={user.isActive ? "outline" : "default"}
                                            size="sm"
                                            disabled={isPending}
                                            onClick={() =>
                                                toggleActive(user.id, !user.isActive)
                                            }
                                            className="h-8 rounded-lg px-3 text-xs"
                                        >
                                            {isPending ? (
                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                            ) : user.isActive ? (
                                                "Pause"
                                            ) : (
                                                "Activate"
                                            )}
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
