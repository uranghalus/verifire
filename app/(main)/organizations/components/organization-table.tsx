/* eslint-disable @typescript-eslint/no-explicit-any */
// components/organization-table.tsx
'use client'

import { useState } from 'react'

import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table'
import { organizationColumns as columns } from './organization-columns'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from '@/components/ui/table'
import { useOrganizations } from '../hooks/organization-client'
import { DataTablePagination } from '@/components/datatable/data-table-pagination'

export function OrganizationTable() {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [search, setSearch] = useState('')


    const { data, mutate } = useOrganizations(page, limit, search)


    const table = useReactTable({
        data: data?.data ?? [],
        columns,
        pageCount: Math.ceil((data?.total ?? 0) / limit),
        state: { pagination: { pageIndex: page - 1, pageSize: limit } },
        onPaginationChange: (updater) => {
            const newState = typeof updater === 'function' ? updater({ pageIndex: page - 1, pageSize: limit }) : updater
            setPage(newState.pageIndex + 1)
            setLimit(newState.pageSize)
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
    })


    return (
        <div>
            <div className="flex mb-4 gap-2">
                <Input placeholder="Cari organisasi..." value={search} onChange={(e) => setSearch(e.target.value)} />
                <Button onClick={() => mutate()}>Search</Button>
            </div>


            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id}>
                                {hg.headers.map((h) => (
                                    <TableHead key={h.id} className="border p-2">
                                        {flexRender(h.column.columnDef.header, h.getContext())}
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
                                        <TableCell key={cell.id} className="p-2">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center py-6">
                                    No results
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