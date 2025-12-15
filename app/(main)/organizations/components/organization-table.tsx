'use client'

import { useState } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
} from '@tanstack/react-table'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { useDebounce, useOrganizations } from '@/hooks/crud/use-organization'
import { columns } from './organization-columns'
import { flexRender } from '@tanstack/react-table'
export function OrganizationTable() {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const debouncedSearch = useDebounce(search, 500)

    const { organizations, meta, isLoading } = useOrganizations(
        page,
        10,
        debouncedSearch
    )

    const table = useReactTable({
        data: organizations,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        pageCount: Math.ceil((meta?.total ?? 0) / 10),
    })



    return (
        <div className="space-y-4">
            <Input
                placeholder="Search organization..."
                value={search}
                onChange={(e) => {
                    setPage(1)
                    setSearch(e.target.value)
                }}
            />
            {isLoading && (
                <p className="text-sm text-muted-foreground">Loading...</p>
            )}

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
                    {table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="flex justify-between">
                <Button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                >
                    Prev
                </Button>
                <Button
                    disabled={page >= Math.ceil((meta?.total ?? 0) / 10)}
                    onClick={() => setPage((p) => p + 1)}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}