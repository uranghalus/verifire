"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


import React from "react"
import { DataTablePagination } from "@/components/datatable/data-table-pagination"
import { DataTableToolbar } from "@/components/datatable/datatable-toolbar"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    server: {
        page: number
        pageSize: number
        total: number
        setPage: (p: number) => void
        setPageSize: (p: number) => void
        setSortBy: (col: string) => void
        setSortDirection: (dir: "asc" | "desc") => void
    }
}

export function UserTable<TData extends Record<string, unknown>, TValue>({
    columns,
    data,
    server,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter: '',
            columnFilters: [],
            pagination: {
                pageIndex: server.page,
                pageSize: server.pageSize,
            },
        },
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        pageCount: Math.ceil(server.total / server.pageSize),

        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    return (
        <div className='space-y-4'>
            {/* ✅ Toolbar */}
            <DataTableToolbar
                table={table}
                searchPlaceholder='Cari nama...'
                searchKey='name'
                filters={[
                    {
                        columnId: 'role',
                        title: 'Role',
                        options: [
                            { label: 'Admin', value: 'admin' },
                            { label: 'User', value: 'user' },
                        ],
                    },
                    {
                        columnId: 'status',
                        title: 'Status',
                        options: [
                            { label: 'Active', value: 'active' },
                            { label: 'Banned', value: 'banned' },
                        ],
                    },
                ]}
            />

            {/* ✅ Table */}
            <div className='overflow-hidden rounded-md border'>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className='h-24 text-center'>
                                    Tidak ada hasil
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <DataTablePagination table={table} />
        </div>
    )
}