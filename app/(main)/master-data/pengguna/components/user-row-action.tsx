"use client"

import { MoreHorizontal, Edit, Trash2, Ban, CheckCircle, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserWithDetails } from '../data/action'
import { useDialog } from "@/context/dialog-provider"

interface UserActionsProps {
    user: UserWithDetails
    mutate: () => void
}

export function UserActions({ user, mutate }: UserActionsProps) {
    const { setOpen, setCurrentRow } = useDialog<UserWithDetails>()

    const handleEdit = () => {
        setCurrentRow(user)
        setOpen('edit')
    }

    const handleDelete = () => {
        setCurrentRow(user)
        setOpen('delete')
    }

    const handleBan = () => {
        setCurrentRow(user)
        setOpen(user.banned ? 'unban' : 'ban')
    }

    const handleResetPassword = () => {
        setCurrentRow(user)
        setOpen('reset-password')
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleResetPassword}>
                    <Key className="mr-2 h-4 w-4" />
                    Reset Password
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleBan}>
                    {user.banned ? (
                        <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Unban User
                        </>
                    ) : (
                        <>
                            <Ban className="mr-2 h-4 w-4" />
                            Ban User
                        </>
                    )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-red-600 focus:text-red-600"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}