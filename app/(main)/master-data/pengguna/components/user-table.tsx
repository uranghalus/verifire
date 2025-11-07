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

export function UserTable<TData extends Record<string, unknown>, TValue>({ columns, data, server }: DataTableProps<TData, TValue>) {
    // Sinkronkan state sorting dengan server
    const [sorting, setSorting] = React.useState<SortingState>([])

    const table = useReactTable({
        data,
        columns,
        state: {
            pagination: { pageIndex: server.page, pageSize: server.pageSize },
            sorting,
        },
        // manual modes
        manualPagination: true,
        pageCount: Math.max(1, Math.ceil(server.total / server.pageSize)),
        manualSorting: true,

        onPaginationChange: (updater) => {
            const next = typeof updater === "function"
                ? updater({ pageIndex: server.page, pageSize: server.pageSize })
                : updater
            if (next.pageIndex !== server.page) server.setPage(next.pageIndex)
            if (next.pageSize !== server.pageSize) server.setPageSize(next.pageSize)
        },

        onSortingChange: (updater) => {
            const next = typeof updater === "function" ? updater(sorting) : updater
            setSorting(next)
            const first = next[0]
            if (first) {
                server.setSortBy(String(first.id))
                server.setSortDirection(first.desc ? "desc" : "asc")
            } else {
                // fallback ke default
                server.setSortBy("name")
                server.setSortDirection("asc")
            }
        },

        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(), // hanya untuk visual caret
        getPaginationRowModel: getPaginationRowModel(),
    })

    return (
        <div className="space-y-4">
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
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
                                <TableCell colSpan={columns.length} className="h-24 text-center">
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