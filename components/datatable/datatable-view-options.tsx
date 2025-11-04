'use client'

import * as React from 'react'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { type Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Settings2 } from 'lucide-react'

interface DataTableViewOptionsProps<TData> {
    table: Table<TData>
}

/**
 * ✅ Komponen ini kompatibel dengan Next.js (App Router)
 * Menyediakan menu dropdown untuk toggle visibilitas kolom tabel.
 */
export function DataTableViewOptions<TData>({
    table,
}: DataTableViewOptionsProps<TData>) {
    const columns = React.useMemo(
        () =>
            table
                .getAllColumns()
                .filter(
                    (column) =>
                        typeof column.accessorFn !== 'undefined' && column.getCanHide()
                ),
        [table]
    )

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="ms-auto hidden h-8 lg:flex"
                >
                    <Settings2 className="size-4" />
                    <span className="ml-2">View</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-[150px]">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {columns.map((column) => (
                    <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                        {column.id}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
