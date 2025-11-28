
import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'



import { jenisApar } from '../data/data'

import { DataTableColumnHeader } from '@/components/datatable/datatable-column-header'
import { Apar } from '../types/apar'
import { DataTableRowActions } from './apar-row-action'

export const aparColumns: ColumnDef<Apar>[] = [
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
        accessorKey: 'kode_apar',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Kode APAR' />
        ),
        cell: ({ row }) => (
            <div className='font-medium ps-3'>{row.getValue('kode_apar')}</div>
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
        accessorKey: 'lokasi',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Lokasi' />
        ),
        cell: ({ row }) => (
            <div className='max-w-48 truncate'>{row.getValue('lokasi')}</div>
        ),
    },
    {
        accessorKey: 'lantai',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Lantai' />
        ),
        cell: ({ row }) => {
            const lantai = row.getValue('lantai') as string
            return <div>{lantai || '-'}</div>
        },
    },
    {
        accessorKey: 'jenis',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Jenis' />
        ),
        cell: ({ row }) => {
            const jenis = row.getValue('jenis') as string
            const aparType = jenisApar.find(({ value }) => value === jenis)

            return (
                <div className='flex items-center gap-x-2'>
                    {aparType?.icon && (
                        <aparType.icon size={16} className='text-muted-foreground' />
                    )}
                    <span className='text-sm capitalize'>{aparType?.label}</span>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: 'size',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Size' />
        ),
        cell: ({ row }) => {
            const size = row.original.size
            console.log('Size', size);

            return <div>{typeof size === 'number' ? size.toFixed(1) : size} kg</div>;
        },
    },
    {
        accessorKey: 'user',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Penanggung Jawab' />
        ),
        cell: ({ row }) => {
            const user = row.original.user
            return <div>{user?.name || '-'}</div>

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