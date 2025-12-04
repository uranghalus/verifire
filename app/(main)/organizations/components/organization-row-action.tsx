// components/organization-row-action.tsx
import { type Row } from '@tanstack/react-table'
import { Ellipsis, Trash2, UserPen, Users } from 'lucide-react'
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

interface OrganizationRowActionsProps {
    row: Row<Organization>
}

export function OrganizationRowActions({ row }: OrganizationRowActionsProps) {
    const { setOpen, setCurrentRow } = useDialog()

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
                <DropdownMenuItem
                    onClick={() => {
                        setCurrentRow(row.original)
                        setOpen('edit')
                    }}
                >
                    Edit
                    <DropdownMenuShortcut>
                        <UserPen size={16} />
                    </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => {
                        setCurrentRow(row.original)
                        setOpen('members')
                    }}
                >
                    Kelola Anggota
                    <DropdownMenuShortcut>
                        <Users size={16} />
                    </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => {
                        setCurrentRow(row.original)
                        setOpen('delete')
                    }}
                    className='text-red-600'
                >
                    Delete
                    <DropdownMenuShortcut>
                        <Trash2 size={16} />
                    </DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}