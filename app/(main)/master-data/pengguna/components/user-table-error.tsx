import { Button } from "@/components/ui/button"

interface UserTableErrorProps {
    onRetry: () => void
}

export function UserTableError({ onRetry }: UserTableErrorProps) {
    return (
        <div className="flex items-center justify-center h-64">
            <div className="text-center">
                <div className="text-red-500 mb-2">Failed to load users</div>
                <Button variant="outline" onClick={onRetry}>
                    Retry
                </Button>
            </div>
        </div>
    )
}