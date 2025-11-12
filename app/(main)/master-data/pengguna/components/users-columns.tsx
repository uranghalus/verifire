"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import {
    CheckCircle,
    XCircle,
    Ban,
    Check,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserWithDetails } from '../data/action'


import { UserActions } from "./user-row-action"
import { getAccountIcon, getRoleBadge } from "./user-table-utils"

export const userTableColumns = (mutate: () => void): ColumnDef<UserWithDetails>[] => [
    {
        accessorKey: "name",
        header: "User",
        cell: ({ row }) => {
            const user = row.original
            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback className="text-xs">
                            {user.name?.substring(0, 2).toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium text-sm">{user.name}</span>
                        <span className="text-xs text-muted-foreground">
                            {user.email}
                        </span>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "verified",
        header: "Verification",
        cell: ({ row }) => {
            const verified = row.original.verified
            return (
                <Badge
                    variant="outline"
                    className={`flex items-center gap-1 px-2 py-1 text-xs ${verified
                        ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700"
                        : "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700"
                        }`}
                >
                    {verified ? (
                        <CheckCircle className="h-3 w-3" />
                    ) : (
                        <XCircle className="h-3 w-3" />
                    )}
                    {verified ? "Verified" : "Unverified"}
                </Badge>
            )
        },
    },
    {
        accessorKey: "accounts",
        header: "Linked Accounts",
        cell: ({ row }) => {
            const accounts = row.original.accounts
            return (
                <div className="flex gap-1">
                    {accounts.map((account) => (
                        <div
                            key={account}
                            className="rounded-full bg-muted p-1.5 text-muted-foreground dark:bg-neutral-700 dark:text-neutral-300"
                            title={account.charAt(0).toUpperCase() + account.slice(1)}
                        >
                            {getAccountIcon(account)}
                        </div>
                    ))}
                    {accounts.length === 0 && (
                        <span className="text-xs text-muted-foreground">None</span>
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const role = row.original.role || "user"
            return getRoleBadge(role)
        },
    },
    {
        accessorKey: "banned",
        header: "Status",
        cell: ({ row }) => {
            const user = row.original
            return user.banned ? (
                <Badge
                    variant="destructive"
                    className="flex items-center gap-1 px-2 py-1 text-xs"
                >
                    <Ban className="h-3 w-3" />
                    Banned
                </Badge>
            ) : (
                <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700 flex items-center gap-1 px-2 py-1 text-xs"
                >
                    <Check className="h-3 w-3" />
                    Active
                </Badge>
            )
        },
    },
    {
        accessorKey: "lastSignIn",
        header: "Last Sign In",
        cell: ({ row }) => {
            const lastSignIn = row.original.lastSignIn
            return (
                <span className="text-xs text-muted-foreground">
                    {lastSignIn
                        ? format(new Date(lastSignIn), "MMM d, yyyy 'at' h:mm a")
                        : "Never"}
                </span>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
            const createdAt = row.original.createdAt
            return (
                <span className="text-xs text-muted-foreground">
                    {format(new Date(createdAt), "MMM d, yyyy 'at' h:mm a")}
                </span>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original
            return <UserActions user={user} mutate={mutate} />
        },
    },
]