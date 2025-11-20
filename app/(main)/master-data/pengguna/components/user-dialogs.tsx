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
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { authClient } from "@/lib/auth-client"


const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Definisikan roles dengan icon
const roles = [
    { label: 'Admin', value: 'admin', icon: ShieldUser },
    { label: 'Superadmin', value: 'superadmin', icon: Shield },
    { label: 'Inspektor', value: 'inspektor', icon: Binoculars },
    { label: 'Manager', value: 'manager', icon: UserStar },
    { label: 'User', value: 'user', icon: User },
];

// Schema validation dengan Zod
const addUserSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name is too long"),
    email: z.string().email("Invalid email address"),
    username: z.string().min(1, "Username is required").max(50, "Username is too long"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["admin", "superadmin", "inspektor", "manager", "user"]),
})
const editUserSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name is too long"),
    username: z.string().optional(),
    email: z.string().email("Invalid email address"),
    role: z.enum(["admin", "superadmin", "inspektor", "manager", "user"]),
})
type EditUserFormValues = z.infer<typeof editUserSchema>
type AddUserFormValues = z.infer<typeof addUserSchema>

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
    const editForm = useForm<EditUserFormValues>({
        resolver: zodResolver(editUserSchema),
        defaultValues: {
            name: "",
            email: "",
            role: "user",
        },
        mode: "onChange",
    })
    useEffect(() => {
        if (open === "edit" && currentRow) {
            editForm.reset({
                name: currentRow.name,
                email: currentRow.email,
                role: (currentRow.role as EditUserFormValues['role']) || "user",
            })
        }
    }, [open, currentRow, editForm])
    const isEditFormValid = editForm.formState.isValid

    // Handler untuk submit edit
    const handleEdit = async (data: EditUserFormValues) => {
        setLoading(true)

        toast.promise(
            async () => {
                if (!currentRow?.id) throw new Error("No user selected")

                const response = await fetch(`/api/user/${currentRow.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: data.name,
                        email: data.email,
                        role: data.role,
                    }),
                })

                const result = await response.json()

                if (!response.ok) throw new Error(result.error || "Failed to update user")

                // ⭐ Ambil session user login
                const { data: session } = await authClient.getSession()

                // ⭐ Jika user yang di-edit adalah user login → refresh session
                if (session?.user?.id === currentRow.id) {
                    window.dispatchEvent(new Event("better-auth:refresh-session"))
                }

                mutate()
                setOpen(null)
                return "User updated successfully"
            },
            {
                loading: "Updating user...",
                description: "Sedang memperbarui data user.",
                success: (message) => {
                    return {
                        message: 'Berhasil!!',
                        description: message
                    }
                },
                error: (error) => error.message || "Failed to update user",
                finally: () => setLoading(false),
            }
        )
    }

    // Form setup dengan react-hook-form & zod
    const form = useForm<AddUserFormValues>({
        resolver: zodResolver(addUserSchema),
        defaultValues: {
            username: "",
            name: "",
            email: "",
            password: "",
            role: "user",
        },
        mode: "onChange"
    })
    // 
    const handleAdd = async (data: AddUserFormValues) => {
        setLoading(true)

        toast.promise(
            async () => {
                const response = await fetch("/api/user", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                })

                const result = await response.json()

                if (!response.ok) {
                    throw new Error(result.error || "Failed to create user")
                }

                // Refresh data
                mutate()
                setOpen(null)

                return "User created successfully"
            },
            {
                loading: 'Tunggu Sebentar...',
                description: 'Sedang membuat user baru.',
                success: (message) => {
                    return {
                        message: 'Berhasil!!',
                        description: message
                    }
                },
                error: (error) => {
                    console.error('Create user error:', error)
                    return error.message || "Failed to create user"
                },
                finally: () => setLoading(false)
            }
        )
    }
    // LINK delete handler
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
                description: 'This action cannot be undone.',
                success: (message) => {
                    return {
                        message: 'Berhasil!!',
                        description: message
                    }
                },
                error: (error) => error.message || "Failed to delete user",
                finally: () => setLoading(false)
            }
        )
    }
    // LINK ban/unban handler
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
                description: action === 'ban' ? 'Sedang memproses ban user.' : 'Sedang memproses unban user.',
                success: (message) => {
                    return {
                        message: 'Berhasil!!',
                        description: message
                    }
                },
                error: (error) => error.message || `Failed to ${action} user`,
                finally: () => setLoading(false)
            }
        )
    }
    // LINK reset password handler
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
                success: (message) => {
                    return {
                        message: 'Berhasil!!',
                        description: message
                    }
                },
                error: (error) => error.message || "Failed to reset password",
                finally: () => setLoading(false)
            }
        )
    }

    const isFormValid = form.formState.isValid

    return (
        <>
            {/* Add User Dialog */}
            <Dialog open={open === 'add'} onOpenChange={() => setOpen(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>
                            Create a new user account. The user will be able to login immediately.
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleAdd)} className="space-y-6">
                            <div className="space-y-4">
                                {/* Name Field */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter full name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='username'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter Username"
                                                    {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                {/* Email Field */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="Enter email address"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Password Field */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="Minimum 6 characters"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Role Field */}
                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Role</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a role" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {roles.map((role) => (
                                                        <SelectItem key={role.value} value={role.value}>
                                                            <div className="flex items-center gap-2">
                                                                <role.icon className="h-4 w-4" />
                                                                {role.label}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(null)}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading || !isFormValid}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Creating...
                                        </>
                                    ) : (
                                        "Create User"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={open === "edit"} onOpenChange={() => setOpen(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                            Update user information for <strong>{currentRow?.name}</strong>.
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...editForm}>
                        <form onSubmit={editForm.handleSubmit(handleEdit)} className="space-y-6">
                            <div className="space-y-4">
                                {/* Name */}
                                <FormField
                                    control={editForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter full name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Email */}
                                <FormField
                                    control={editForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email *</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="Enter email address" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Role */}
                                <FormField
                                    control={editForm.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Role</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a role" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {roles.map((role) => (
                                                        <SelectItem key={role.value} value={role.value}>
                                                            <div className="flex items-center gap-2">
                                                                <role.icon className="h-4 w-4" />
                                                                {role.label}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setOpen(null)} disabled={loading}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading || !isEditFormValid}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Delete User Dialog */}
            <Dialog open={open === 'delete'} onOpenChange={() => setOpen(null)}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription asChild>
                            <div className="flex items-start gap-3">
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
                        <DialogTitle className="mb-2">Ban User</DialogTitle>
                        <DialogDescription asChild>
                            <div className="flex items-start gap-3 rounded-md border p-3">
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
                        <DialogDescription asChild>
                            <div className="flex items-start gap-3 rounded-md border p-3 bg-muted/50">
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
                        <DialogDescription asChild>
                            <div className="flex items-start gap-3">
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