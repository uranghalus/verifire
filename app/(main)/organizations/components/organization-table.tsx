/* eslint-disable @typescript-eslint/no-explicit-any */
// components/organization-table.tsx
'use client'

import { useState } from 'react'
import {
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'


import { organizationColumns as columns } from './organization-columns'
import { Organization } from '../types/organization'
import { DataTableToolbar } from '@/components/datatable/datatable-toolbar'
import { DataTablePagination } from '@/components/datatable/data-table-pagination'
import { DataTableBulkActions } from './datatable-bulk-action'

interface OrganizationTableProps {
    data: Organization[]
    searchParams: Record<string, unknown>
    onRefresh?: () => void
    loading?: boolean
}

export function OrganizationTable({
    data,
    searchParams,
    onRefresh,
    loading = false
}: OrganizationTableProps) {
    const [rowSelection, setRowSelection] = useState({})
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [sorting, setSorting] = useState<SortingState>([])

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            pagination: {
                pageIndex: (searchParams.page as number) || 0,
                pageSize: (searchParams.limit as number) || 10,
            },
            rowSelection,
            columnVisibility,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        getPaginationRowModel: getPaginationRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Memuat data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className={cn('flex flex-1 flex-col gap-4')}>
            <DataTableToolbar
                table={table}
                searchPlaceholder='Cari nama organisasi, slug...'
                searchKey='name'
                filters={[]}
            />

            <div className='overflow-hidden rounded-md border'>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className='group/row'>
                                {headerGroup.headers.map((header) => {
                                    const meta = header.column.columnDef.meta as any
                                    return (
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            className={cn(
                                                'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                                                meta?.className,
                                                meta?.thClassName
                                            )}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                    className='group/row'
                                >
                                    {row.getVisibleCells().map((cell) => {
                                        const meta = cell.column.columnDef.meta as any
                                        return (
                                            <TableCell
                                                key={cell.id}
                                                className={cn(
                                                    'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                                                    meta?.className,
                                                    meta?.tdClassName
                                                )}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className='h-24 text-center'
                                >
                                    Tidak ada data.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <DataTablePagination table={table} className='mt-auto' />
            <DataTableBulkActions table={table} />
        </div>
    )
}