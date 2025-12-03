import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

import { DataTableColumnHeader } from '@/components/datatable/datatable-column-header'
import { Organization } from '../types/organization'
import { DataTableRowActions } from './datatable-row-action'


export const organizationColumns: ColumnDef<Organization>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label='Select all'
                className='translate-y-[2px]'
            />
        ),
        meta: {
            className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
        },
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label='Select row'
                className='translate-y-[2px]'
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Nama Organisasi' />
        ),
        cell: ({ row }) => (
            <div className='font-medium ps-3'>{row.getValue('name')}</div>
        ),
        meta: {
            className: cn(
                'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
                'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
            ),
        },
        enableHiding: false,
    },
    {
        accessorKey: 'slug',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Slug' />
        ),
        cell: ({ row }) => (
            <div className='max-w-48 truncate'>{row.getValue('slug')}</div>
        ),
    },
    {
        accessorKey: 'memberCount',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Jumlah Anggota' />
        ),
        cell: ({ row }) => {
            const memberCount = row.original.memberCount || 0
            return <Badge variant="outline">{memberCount} anggota</Badge>
        },
    },
    {
        accessorKey: 'createdAt',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Dibuat' />
        ),
        cell: ({ row }) => {
            const date = new Date(row.getValue('createdAt'))
            return <div>{date.toLocaleDateString('id-ID')}</div>
        },
    },
    {
        id: 'actions',
        cell: DataTableRowActions,
    },
]