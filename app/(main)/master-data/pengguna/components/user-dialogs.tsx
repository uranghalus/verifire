"use client"

import { useState, useEffect, useMemo } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { UserWithDetails } from "@/app/(main)/master-data/pengguna/data/action"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { ShieldUser, Shield, Binoculars, UserStar, User, CheckCircle, XCircle, Ban, Check } from "lucide-react"
import { useSearchParams } from "next/navigation"
import useSWR from "swr"
import { useDialog } from "@/context/dialog-provider"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Definisikan roles dengan icon
const roles = [
    { label: 'Admin', value: 'admin', icon: ShieldUser },
    { label: 'Superadmin', value: 'superadmin', icon: Shield },
    { label: 'Inspektor', value: 'inspektor', icon: Binoculars },
    { label: 'Manager', value: 'manager', icon: UserStar },
    { label: 'User', value: 'user', icon: User },
];



// Helper function untuk get role badge
const getRoleBadge = (role: string) => {
    const roleConfig = roles.find(r => r.value === role) || roles.find(r => r.value === 'user')
    const IconComponent = roleConfig?.icon || User

    return (
        <Badge
            variant="outline"
            className={`flex items-center gap-1 px-2 py-1 text-xs ${role === "superadmin"
                ? "bg-red-50 text-red-700 border-red-200"
                : role === "admin"
                    ? "bg-purple-50 text-purple-700 border-purple-200"
                    : role === "inspektor"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : role === "manager"
                            ? "bg-orange-50 text-orange-700 border-orange-200"
                            : "bg-gray-50 text-gray-700 border-gray-200"
                }`}
        >
            <IconComponent className="h-3 w-3" />
            {roleConfig?.label || 'User'}
        </Badge>
    )
}

export function UserDialogs() {
    const searchParams = useSearchParams()
    const { open, setOpen, currentRow } = useDialog<UserWithDetails>()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "user"
    })
    const [banData, setBanData] = useState({
        reason: "",
        expires: ""
    })

    // Build SWR key untuk mutate
    const swrKey = useMemo(() => {
        const params = new URLSearchParams()
        const role = searchParams.get("role") || "all"
        const status = searchParams.get("status") || "all"
        const search = searchParams.get("search") || ""
        const page = searchParams.get("page") || "1"
        const limit = "10"

        if (role && role !== "all") params.set("role", role)
        if (status && status !== "all") params.set("status", status)
        if (search) params.set("search", search)
        params.set("page", page)
        params.set("limit", limit)

        return `/api/user?${params.toString()}`
    }, [searchParams])

    const { mutate } = useSWR(swrKey, fetcher, {
        revalidateOnFocus: false,
    })

    // Reset form ketika dialog dibuka
    useEffect(() => {
        if (open === 'edit' && currentRow) {
            setFormData({
                name: currentRow.name,
                email: currentRow.email,
                password: "",
                role: currentRow.role || "user"
            })
        } else if (open === 'add') {
            setFormData({
                name: "",
                email: "",
                password: "",
                role: "user"
            })
        } else if ((open === 'ban' || open === 'unban') && currentRow) {
            setBanData({
                reason: currentRow.banReason || "",
                expires: currentRow.banExpires ? formatDateForInput(currentRow.banExpires) : ""
            })
        }
    }, [open, currentRow])

    function formatDateForInput(date: Date) {
        return new Date(date).toISOString().split('T')[0]
    }

    const handleEdit = async () => {
        setLoading(true)

        toast.promise(
            async () => {
                const response = await fetch(`/api/user/${currentRow?.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        role: formData.role
                    }),
                })

                if (!response.ok) {
                    const result = await response.json()
                    throw new Error(result.error || "Failed to update user")
                }

                mutate()
                setOpen(null)
                return "User updated successfully"
            },
            {
                loading: 'Updating user...',
                success: (message) => message,
                error: (error) => error.message || "Failed to update user",
                finally: () => setLoading(false)
            }
        )
    }

    const handleAdd = async () => {
        setLoading(true)

        toast.promise(
            async () => {
                const response = await fetch("/api/user", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                })

                if (!response.ok) {
                    const result = await response.json()
                    throw new Error(result.error || "Failed to create user")
                }

                mutate()
                setOpen(null)
                return "User created successfully"
            },
            {
                loading: 'Creating user...',
                success: (message) => message,
                error: (error) => error.message || "Failed to create user",
                finally: () => setLoading(false)
            }
        )
    }

    const handleDelete = async () => {
        setLoading(true)

        toast.promise(
            async () => {
                const response = await fetch(`/api/user/${currentRow?.id}`, {
                    method: "DELETE",
                })

                if (!response.ok) {
                    const result = await response.json()
                    throw new Error(result.error || "Failed to delete user")
                }

                mutate()
                setOpen(null)
                return "User deleted successfully"
            },
            {
                loading: 'Deleting user...',
                success: (message) => message,
                error: (error) => error.message || "Failed to delete user",
                finally: () => setLoading(false)
            }
        )
    }

    const handleBan = async () => {
        setLoading(true)

        const action = open === 'ban' ? 'ban' : 'unban'

        toast.promise(
            async () => {
                const response = await fetch(`/api/user/${currentRow?.id}/ban`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        banned: open === 'ban',
                        banReason: banData.reason,
                        banExpires: banData.expires ? new Date(banData.expires).toISOString() : null
                    }),
                })

                if (!response.ok) {
                    const result = await response.json()
                    throw new Error(result.error || `Failed to ${action} user`)
                }

                mutate()
                setOpen(null)
                return `User ${action === 'ban' ? 'banned' : 'unbanned'} successfully`
            },
            {
                loading: `${action === 'ban' ? 'Banning' : 'Unbanning'} user...`,
                success: (message) => message,
                error: (error) => error.message || `Failed to ${action} user`,
                finally: () => setLoading(false)
            }
        )
    }

    const handleResetPassword = async () => {
        setLoading(true)

        toast.promise(
            async () => {
                const response = await fetch(`/api/user/${currentRow?.id}/reset-password`, {
                    method: "POST",
                })

                if (!response.ok) {
                    const result = await response.json()
                    throw new Error(result.error || "Failed to reset password")
                }

                setOpen(null)
                return "Password reset email sent successfully"
            },
            {
                loading: 'Sending reset password email...',
                success: (message) => message,
                error: (error) => error.message || "Failed to reset password",
                finally: () => setLoading(false)
            }
        )
    }


    return (
        <>
            {/* Add User Dialog */}
            <Dialog open={open === 'add'} onOpenChange={() => setOpen(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>
                            Create a new user account. The user will receive an email to verify their account.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="add-name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="add-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="add-email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="add-email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="add-password" className="text-right">
                                Password
                            </Label>
                            <Input
                                id="add-password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="col-span-3"
                                required
                                minLength={6}
                                placeholder="Minimum 6 characters"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="add-role" className="text-right">
                                Role
                            </Label>
                            <select
                                id="add-role"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="col-span-3 border rounded-md p-2"
                            >
                                {roles.map((role) => (
                                    <option key={role.value} value={role.value}>
                                        {role.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(null)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAdd} disabled={loading}>
                            {loading ? "Creating..." : "Create User"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={open === 'edit'} onOpenChange={() => setOpen(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                            Update user information for {currentRow?.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-role" className="text-right">
                                Role
                            </Label>
                            <select
                                id="edit-role"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="col-span-3 border rounded-md p-2"
                            >
                                {roles.map((role) => (
                                    <option key={role.value} value={role.value}>
                                        {role.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(null)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEdit} disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete User Dialog */}
            <Dialog open={open === 'delete'} onOpenChange={() => setOpen(null)}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={currentRow?.avatarUrl} alt={currentRow?.name} />
                                <AvatarFallback>
                                    {currentRow?.name?.substring(0, 2).toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{currentRow?.name}</p>
                                <p className="text-sm text-muted-foreground">{currentRow?.email}</p>
                                <div className="mt-2">
                                    Are you sure you want to delete this user? This action cannot be undone.
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex items-center gap-4 p-3 border rounded-lg bg-muted/50">
                            <div className="flex-1 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Role:</span>
                                    <div className="mt-1">{getRoleBadge(currentRow?.role || 'user')}</div>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Status:</span>
                                    <div className="mt-1">
                                        {currentRow?.banned ? (
                                            <Badge variant="destructive" className="text-xs">
                                                <Ban className="h-3 w-3 mr-1" />
                                                Banned
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                                                <Check className="h-3 w-3 mr-1" />
                                                Active
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Verified:</span>
                                    <div className="mt-1">
                                        {currentRow?.verified ? (
                                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                Verified
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700">
                                                <XCircle className="h-3 w-3 mr-1" />
                                                Unverified
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Created:</span>
                                    <div className="mt-1 text-xs">
                                        {currentRow?.createdAt ? format(new Date(currentRow.createdAt), "MMM d, yyyy") : '-'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                            {loading ? "Deleting..." : "Delete User"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Ban User Dialog */}
            <Dialog open={open === 'ban'} onOpenChange={() => setOpen(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Ban User</DialogTitle>
                        <DialogDescription className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={currentRow?.avatarUrl} alt={currentRow?.name} />
                                <AvatarFallback>
                                    {currentRow?.name?.substring(0, 2).toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{currentRow?.name}</p>
                                <p className="text-sm text-muted-foreground">{currentRow?.email}</p>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="ban-reason">Ban Reason *</Label>
                            <Textarea
                                id="ban-reason"
                                placeholder="Enter the reason for banning this user..."
                                value={banData.reason}
                                onChange={(e) => setBanData({ ...banData, reason: e.target.value })}
                                className="min-h-[100px]"
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                This reason will be visible to the user and recorded in the audit log.
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="ban-expires">Ban Expires (Optional)</Label>
                            <Input
                                id="ban-expires"
                                type="date"
                                value={banData.expires}
                                onChange={(e) => setBanData({ ...banData, expires: e.target.value })}
                                min={new Date().toISOString().split('T')[0]}
                            />
                            <p className="text-xs text-muted-foreground">
                                Leave empty for permanent ban. The user will be automatically unbanned on this date.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleBan}
                            disabled={loading || !banData.reason.trim()}
                        >
                            {loading ? "Banning..." : "Ban User"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Unban User Dialog */}
            <Dialog open={open === 'unban'} onOpenChange={() => setOpen(null)}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>Unban User</DialogTitle>
                        <DialogDescription className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={currentRow?.avatarUrl} alt={currentRow?.name} />
                                <AvatarFallback>
                                    {currentRow?.name?.substring(0, 2).toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{currentRow?.name}</p>
                                <p className="text-sm text-muted-foreground">{currentRow?.email}</p>
                                {currentRow?.banReason && (
                                    <div className="mt-2 p-2 bg-muted rounded text-sm">
                                        <span className="font-medium">Ban reason:</span> {currentRow.banReason}
                                    </div>
                                )}
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p>Are you sure you want to unban this user? They will be able to access the system immediately.</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(null)}>
                            Cancel
                        </Button>
                        <Button onClick={handleBan} disabled={loading}>
                            {loading ? "Unbanning..." : "Unban User"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reset Password Dialog */}
            <Dialog open={open === 'reset-password'} onOpenChange={() => setOpen(null)}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>Reset Password</DialogTitle>
                        <DialogDescription className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={currentRow?.avatarUrl} alt={currentRow?.name} />
                                <AvatarFallback>
                                    {currentRow?.name?.substring(0, 2).toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{currentRow?.name}</p>
                                <p className="text-sm text-muted-foreground">{currentRow?.email}</p>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p>This will send a password reset email to <strong>{currentRow?.email}</strong>. The user will be able to set a new password using the link in the email.</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(null)}>
                            Cancel
                        </Button>
                        <Button onClick={handleResetPassword} disabled={loading}>
                            {loading ? "Sending..." : "Send Reset Email"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}