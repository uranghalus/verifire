"use client";

import { useState, useEffect } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
} from "@tanstack/react-table";
import { organizationColumns } from "./organization-columns";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { useOrganizations } from "../hooks/organization-client";
import { DataTablePagination } from "@/components/datatable/data-table-pagination";
import { DataTableToolbar } from "@/components/datatable/datatable-toolbar";
import { DataTableBulkActions } from "./datatable-bulk-action";

export function OrganizationTable() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    // Gunakan SWR hook
    const { data, total, isLoading, error, mutate } = useOrganizations(
        page,
        limit,
        debouncedSearch
    );

    const table = useReactTable({
        data: data || [],
        columns: organizationColumns,
        pageCount: Math.ceil((total || 0) / limit),
        state: {
            pagination: { pageIndex: page - 1, pageSize: limit },
        },
        onPaginationChange: (updater) => {
            const newState =
                typeof updater === "function"
                    ? updater({ pageIndex: page - 1, pageSize: limit })
                    : updater;

            setPage(newState.pageIndex + 1);
            setLimit(newState.pageSize);
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
    });

    return (
        <div className="border rounded-md p-5 space-y-6">
            <div className="flex mb-4 gap-2">
                <DataTableToolbar
                    searchPlaceholder="Cari organisasi..."
                    onSearchChange={setSearch}
                    searchValue={search}
                />
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
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={organizationColumns.length} className="text-center py-6">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={organizationColumns.length} className="text-center py-6 text-red-500">
                                    Error: {error.message}
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length ? (
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
                                <TableCell colSpan={organizationColumns.length} className="text-center py-6">
                                    No results
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <DataTablePagination table={table} />
            <DataTableBulkActions table={table} />
        </div>
    );
}