'use client'

import * as React from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { roles } from '../data/data'
import { DataTableColumnHeader } from '@/components/datatable/datatable-column-header'
import { LongText } from '@/components/long-text'
import UserRowAction from './user-row-action'
import { type User } from '../data/userSchema'

/**
 * ✅ Kompatibel dengan Next.js (App Router)
 * Menggunakan 'use client' untuk mendukung interaksi (Checkbox, dll)
 */
export const usersColumns: ColumnDef<User>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        meta: {
            className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
        },
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) => {
            const { name } = row.original
            return (
                <LongText className="max-w-36">
                    {name}
                </LongText>
            )
        },
        meta: { className: 'w-36' },
    },
    {
        accessorKey: 'email',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: ({ row }) => (
            <div className="w-fit ps-2 text-nowrap">
                {row.getValue('email')}
            </div>
        ),
    },
    {
        accessorKey: 'role',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ row }) => {
            const { role } = row.original
            const userType = roles.find(({ value }) => value === role)
            if (!userType) return null

            const Icon = userType.icon
            return (
                <div className="flex items-center gap-x-2">
                    {Icon && <Icon size={16} className="text-muted-foreground" />}
                    <span className="text-sm capitalize">{row.getValue('role')}</span>
                </div>
            )
        },
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: 'actions',
        cell: ({ row }) => <UserRowAction row={row} />,
    },
]
