'use client'

import * as React from 'react'

import { type Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from './datatable-faceted-filter'
import { Cross } from 'lucide-react'
import { DataTableViewOptions } from './datatable-view-options'


type FilterOption = {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
}

type DataTableFilter = {
    columnId: string
    title: string
    options: FilterOption[]
}

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    searchPlaceholder?: string
    searchKey?: string
    filters?: DataTableFilter[]
}

/**
 * ✅ Komponen ini aman untuk digunakan di lingkungan Next.js (App Router).
 * Pastikan file ini disimpan di dalam komponen `client` (karena ada event handlers).
 */
export function DataTableToolbar<TData>({
    table,
    searchPlaceholder = 'Filter...',
    searchKey,
    filters = [],
}: DataTableToolbarProps<TData>) {
    const isFiltered =
        table.getState().columnFilters.length > 0 || !!table.getState().globalFilter

    const handleReset = React.useCallback(() => {
        table.resetColumnFilters()
        table.setGlobalFilter('')
    }, [table])

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
                {/* Search Input */}
                {searchKey ? (
                    <Input
                        placeholder={searchPlaceholder}
                        value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
                        onChange={(e) => table.getColumn(searchKey)?.setFilterValue(e.target.value)}
                        className="h-8 w-[150px] lg:w-[250px]"
                    />
                ) : (
                    <Input
                        placeholder={searchPlaceholder}
                        value={table.getState().globalFilter ?? ''}
                        onChange={(e) => table.setGlobalFilter(e.target.value)}
                        className="h-8 w-[150px] lg:w-[250px]"
                    />
                )}

                {/* Faceted Filters */}
                <div className="flex gap-x-2">
                    {filters.map((filter) => {
                        const column = table.getColumn(filter.columnId)
                        if (!column) return null
                        return (
                            <DataTableFacetedFilter
                                key={filter.columnId}
                                column={column}
                                title={filter.title}
                                options={filter.options}
                            />
                        )
                    })}
                </div>

                {/* Reset Button */}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={handleReset}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <Cross className="ms-2 h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* View Options */}
            <DataTableViewOptions table={table} />
        </div>
    )
}
