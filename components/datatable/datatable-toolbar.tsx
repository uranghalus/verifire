// components/data-table-toolbar.tsx

import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "./datatable-faceted-filter"
import { CrossIcon } from "lucide-react"
import { DataTableViewOptions } from "./datatable-view-options"



interface DataTableToolbarProps<TData> {
    table: Table<TData>
    searchKey: string
    searchPlaceholder?: string
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
    table,
    searchKey,
    searchPlaceholder = "Search...",
    filters = [],
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder={searchPlaceholder}
                    value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn(searchKey)?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                {filters.map((filter) => (
                    <DataTableFacetedFilter
                        key={filter.columnId}
                        column={table.getColumn(filter.columnId)}
                        title={filter.title}
                        options={filter.options}
                    />
                ))}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <CrossIcon className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <DataTableViewOptions table={table} />
        </div>
    )
}