"use client";

import React from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DataTableToolbar } from "@/components/datatable/datatable-toolbar";
import { DataTablePagination } from "@/components/datatable/data-table-pagination";



interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    server: {
        page: number;
        pageSize: number;
        total: number;
        setPage: (p: number) => void;
        setPageSize: (n: number) => void;
        setSortBy: (col: string) => void;
        setSortDirection: (dir: "asc" | "desc") => void;
    };
    toolbar: {
        search: string;
        setSearch: (v: string) => void;
        role?: string;
        setRole: (v: string | undefined) => void;
    };
}

export function UserTable<TData extends Record<string, any>, TValue>({
    columns,
    data,
    server,
    toolbar,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            pagination: {
                pageIndex: server.page - 1,
                pageSize: server.pageSize,
            },
        },

        manualPagination: true,
        manualSorting: true,

        pageCount: Math.ceil(server.total / server.pageSize),

        onSortingChange: (sort) => {
            setSorting(sort);
            const s = sort[0];
            if (s) {
                server.setSortBy(s.id);
                server.setSortDirection(s.desc ? "desc" : "asc");
            }
        },

        onPaginationChange: (updater) => {
            const next =
                typeof updater === "function"
                    ? updater({
                        pageIndex: server.page - 1,
                        pageSize: server.pageSize,
                    })
                    : updater;

            if (next.pageIndex !== server.page - 1)
                server.setPage(next.pageIndex + 1);

            if (next.pageSize !== server.pageSize)
                server.setPageSize(next.pageSize);
        },

        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="space-y-4">
            {/* ✅ Toolbar */}
            <DataTableToolbar
                table={table}
                searchValue={toolbar.search}
                onSearchChange={toolbar.setSearch}
                roleValue={toolbar.role}
                onRoleChange={toolbar.setRole}
            />

            {/* ✅ Table */}
            <div className="overflow-hidden rounded-md border">
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
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Tidak ada hasil
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <DataTablePagination table={table} />
        </div>
    );
}
