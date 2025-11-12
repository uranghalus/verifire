"use client"

import {
    Search,
    UserPlus,
    RefreshCw,
    Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useDialog } from "@/context/dialog-provider"
import { getRoleIcon, roles } from "./user-table-utils"


interface UserTableFiltersProps {
    search: string
    onSearchChange: (value: string) => void
    role: string
    onRoleChange: (value: string) => void
    status: string
    onStatusChange: (value: string) => void
    onRefresh: () => void
    onExport: () => void
    isValidating: boolean
    isLoading: boolean
}

export function UserTableFilters({
    search,
    onSearchChange,
    role,
    onRoleChange,
    status,
    onStatusChange,
    onRefresh,
    onExport,
    isValidating,
    isLoading
}: UserTableFiltersProps) {
    const { setOpen } = useDialog()

    const handleAddUser = () => {
        setOpen('add')
    }

    return (
        <div className="flex flex-wrap gap-4 items-center justify-between my-6 rounded-md border p-3">
            <div className="flex flex-wrap gap-4 items-center">
                {/* Search input */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search by name or email..."
                        className="pl-9 pr-4 py-2 w-[280px]"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                {/* Role filter dengan icon */}
                <Select
                    value={role}
                    onValueChange={onRoleChange}
                >
                    <SelectTrigger className="w-[160px]">
                        <div className="flex items-center gap-2">
                            {getRoleIcon(role === 'all' ? 'user' : role)}
                            <SelectValue placeholder="All Roles" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        {roles.map((roleItem) => (
                            <SelectItem key={roleItem.value} value={roleItem.value}>
                                <div className="flex items-center gap-2">
                                    <roleItem.icon className="h-4 w-4" />
                                    {roleItem.label}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Status filter */}
                <Select
                    value={status}
                    onValueChange={onStatusChange}
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="banned">Banned</SelectItem>
                    </SelectContent>
                </Select>

                {/* Refresh button */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={onRefresh}
                    disabled={isValidating}
                >
                    <RefreshCw className={`h-4 w-4 ${isValidating ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            <div className="flex gap-2">
                <Button
                    variant="outline"
                    onClick={onExport}
                    className="flex items-center gap-2"
                    disabled={isLoading}
                >
                    <Download className="h-4 w-4" />
                    Export
                </Button>
                <Button
                    onClick={handleAddUser}
                    className="flex items-center gap-2"
                >
                    <UserPlus className="h-4 w-4" />
                    Add User
                </Button>
            </div>
        </div>
    )
}