export function UserTableSkeleton() {
    return (
        <div className="border rounded-md p-4 space-y-3 animate-pulse">
            <div className="h-4 w-1/3 bg-muted rounded" />
            <div className="h-4 w-1/4 bg-muted rounded" />
            <div className="h-32 w-full bg-muted rounded" />
        </div>
    )
}