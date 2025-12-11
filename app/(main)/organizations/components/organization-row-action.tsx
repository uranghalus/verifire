// components/datatable-row-action.tsx
import { type Row } from '@tanstack/react-table'
import { Ellipsis, Trash2, UserPen, Users, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDialog } from '@/context/dialog-provider'
import { Organization } from '@/generated/prisma'
import { toast } from 'sonner'

interface DataTableRowActionsProps {
    row: Row<Organization>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
    const { setOpen, setCurrentRow } = useDialog()

    const handleViewDetails = () => {
        toast.promise(
            fetch(`/api/organizations/${row.original.id}`)
                .then(res => res.json())
                .then(data => {
                    // Tampilkan detail dalam toast atau dialog
                    toast.info(`Detail ${data.name}`, {
                        description: `Slug: ${data.slug}\nDibuat: ${new Date(data.createdAt).toLocaleDateString()}`,
                        duration: 5000,
                    })
                }),
            {
                loading: 'Mengambil detail...',
                success: 'Detail berhasil diambil',
                error: 'Gagal mengambil detail',
            }
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='ghost'
                    className='flex h-8 w-8 p-0'
                >
                    <Ellipsis className='h-4 w-4' />
                    <span className='sr-only'>Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[160px]'>
                <DropdownMenuItem onClick={handleViewDetails}>
                    <Eye className="mr-2 h-4 w-4" />
                    Lihat Detail
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => {
                        setCurrentRow(row.original)
                        setOpen('edit')
                    }}
                >
                    <UserPen className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => {
                        setCurrentRow(row.original)
                        setOpen('members')
                    }}
                >
                    <Users className="mr-2 h-4 w-4" />
                    Anggota
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={() => {
                        setCurrentRow(row.original)
                        setOpen('delete')
                    }}
                    className='text-red-600 focus:text-red-600'
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}