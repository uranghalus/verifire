import {
    ShieldUser,
    Shield,
    Binoculars,
    UserStar,
    User,
    Mail,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Definisikan roles dengan icon
export const roles = [
    { label: 'All Roles', value: 'all', icon: User },
    { label: 'Admin', value: 'admin', icon: ShieldUser },
    { label: 'Superadmin', value: 'superadmin', icon: Shield },
    { label: 'Inspektor', value: 'inspektor', icon: Binoculars },
    { label: 'Manager', value: 'manager', icon: UserStar },
    { label: 'User', value: 'user', icon: User },
];

// Helper function to render account icons
export const getAccountIcon = (account: string) => {
    switch (account) {
        case "credential":
            return <Mail className="h-3 w-3" />
        case "github":
            return <span className="text-xs">GH</span>
        case "google":
            return <span className="text-xs">G</span>
        default:
            return null
    }
}

// Helper function untuk get role icon
export const getRoleIcon = (roleValue: string) => {
    const role = roles.find(r => r.value === roleValue) || roles.find(r => r.value === 'user')
    const IconComponent = role?.icon || User
    return <IconComponent className="h-4 w-4" />
}

// Helper function untuk get role badge
export const getRoleBadge = (role: string) => {
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