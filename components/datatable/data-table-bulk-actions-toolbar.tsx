// components/data-table-bulk-actions-toolbar.tsx
import { type Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"

interface DataTableBulkActionsProps<TData> {
    table: Table<TData>
    entityName: string
    children?: React.ReactNode
}

export function DataTableBulkActionToolbar<TData>({
    table,
    entityName,
    children,
}: DataTableBulkActionsProps<TData>) {
    const selectedRows = table.getFilteredSelectedRowModel().rows

    if (selectedRows.length === 0) {
        return null
    }

    return (
        <div className="fixed inset-x-0 bottom-4 z-50 mx-auto w-fit animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-1/2 duration-200">
            <div className="flex items-center gap-2 rounded-lg border bg-background/95 p-2 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="text-sm text-muted-foreground">
                    {selectedRows.length} {entityName}(s) terpilih
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => table.resetRowSelection()}
                    className="h-8 text-xs"
                >
                    Batalkan
                </Button>
                {children}
            </div>
        </div>
    )
}