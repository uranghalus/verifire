'use client'

import * as React from 'react'

import { type Column } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ArrowDownIcon, ArrowUpDown, ArrowUpIcon, EyeClosed } from 'lucide-react'

type DataTableColumnHeaderProps<TData, TValue> =
    React.HTMLAttributes<HTMLDivElement> & {
        column: Column<TData, TValue>
        title: string
    }

/**
 * ✅ Komponen ini kompatibel dengan Next.js (App Router)
 * Wajib 'use client' karena mengandung interaksi (sorting, dropdown)
 */
export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
}: DataTableColumnHeaderProps<TData, TValue>) {
    // Jika kolom tidak bisa disortir, tampilkan teks biasa
    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>
    }

    return (
        <div className={cn('flex items-center space-x-2', className)}>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 data-[state=open]:bg-accent"
                    >
                        <span>{title}</span>
                        {column.getIsSorted() === 'desc' ? (
                            <ArrowDownIcon className="ms-2 h-4 w-4" />
                        ) : column.getIsSorted() === 'asc' ? (
                            <ArrowUpIcon className="ms-2 h-4 w-4" />
                        ) : (
                            <ArrowUpDown className="ms-2 h-4 w-4" />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                        <ArrowUpIcon className="text-muted-foreground/70 size-3.5" />
                        Asc
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                        <ArrowDownIcon className="text-muted-foreground/70 size-3.5" />
                        Desc
                    </DropdownMenuItem>

                    {column.getCanHide() && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                                <EyeClosed className="text-muted-foreground/70 size-3.5" />
                                Hide
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
