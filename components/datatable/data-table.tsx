import { type Table as TanstackTable, flexRender } from '@tanstack/react-table';
import type * as React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { DataTablePagination } from './data-table-pagination';
import { getCommonPinningStyles } from '@/lib/data-table';

interface DataTableProps<TData> extends React.ComponentProps<'div'> {
    table: TanstackTable<TData>;
    actionBar?: React.ReactNode;
}

export function DataTable<TData>({
    table,
    actionBar,
    children
}: DataTableProps<TData>) {
    return (
        <div className='flex flex-1 flex-col space-y-4'>
            {children}
            <ScrollArea className='h-full w-full'>
                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader className='bg-muted sticky top-0 z-10'>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            style={{
                                                ...getCommonPinningStyles({ column: header.column })
                                            }}
                                            className='whitespace-nowrap table-fixed'
                                        >
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
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && 'selected'}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                style={{
                                                    ...getCommonPinningStyles({ column: cell.column })
                                                }}
                                                className='h-11'
                                            >
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
                                        colSpan={table.getAllColumns().length}
                                        className='h-24 text-center'
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <ScrollBar orientation='horizontal' />
            </ScrollArea>
            <div className='flex flex-col gap-2.5'>
                <DataTablePagination table={table} />
                {actionBar &&
                    table.getFilteredSelectedRowModel().rows.length > 0 &&
                    actionBar}
            </div>
        </div>
    );
}
