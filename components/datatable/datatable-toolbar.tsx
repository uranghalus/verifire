
import { type Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from './datatable-faceted-filter'
import { DataTableViewOptions } from './datatable-view-options'
import { Cross } from 'lucide-react'


type DataTableToolbarProps<TData> = {
    table: Table<TData>
    searchPlaceholder?: string
    searchKey?: string
    filters?: {
        columnId: string
        title: string
        options: {
            label: string
            value: string
            icon?: React.ComponentType<{ className?: string }>
        }[]
    }[]
}

export function DataTableToolbar<TData>({
    searchValue,
    onSearchChange,
    roleValue,
    onRoleChange,
    statusValue,
    onStatusChange,
    table,
}: {
    table: Table<TData>,
    searchValue: string,
    onSearchChange: (value: string) => void,
    roleValue?: string,
    onRoleChange: (v: string | undefined) => void,
    statusValue?: string,
    onStatusChange: (v: string | undefined) => void,
}) {
    return (
        <div className="flex items-center justify-between">

            <div className="flex flex-1 items-center gap-2">
                {/* ✅ SEARCH input is now WORKING */}
                <Input
                    placeholder="Cari nama..."
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="h-8 w-[250px]"
                />

                {/* ✅ ROLE filter */}
                <DataTableFacetedFilter
                    title="Role"
                    column={table.getColumn("role")!}
                    selected={roleValue}
                    onChange={onRoleChange}
                    options={[
                        { label: "Admin", value: "admin" },
                        { label: "User", value: "user" },
                    ]}
                />

                {/* ✅ Status filter */}
                <DataTableFacetedFilter
                    title="Status"
                    column={table.getColumn("status")!}
                    selected={statusValue}
                    onChange={onStatusChange}
                    options={[
                        { label: "Active", value: "active" },
                        { label: "Banned", value: "banned" },
                    ]}
                />
            </div>

            <DataTableViewOptions table={table} />
        </div>
    );
}