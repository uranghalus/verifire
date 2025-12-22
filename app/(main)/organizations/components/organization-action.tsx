'use client'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { useDialog } from '@/context/dialog-provider'
import { SquarePen, Trash2, Users } from 'lucide-react'
import React from 'react'
import { Organization } from '../types/organization'
import { Row } from '@tanstack/react-table'
import Link from 'next/link'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface Props {
    row: Row<Organization>
}
export default function OrganizationAction({ row }: Props) {
    const { setOpen, setCurrentRow } = useDialog()
    return (
        <ButtonGroup aria-label="Organization actions">
            {/* EDIT */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="text-[#c7a762]"
                        onClick={() => {
                            setCurrentRow(row.original)
                            setOpen('edit')
                        }}
                    >
                        <SquarePen className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Edit Organization</TooltipContent>
            </Tooltip>

            {/* MEMBERS */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href={`/organizations/${row.original.id}`}>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="text-[#434656]"
                        >
                            <Users className="h-4 w-4" />
                        </Button>
                    </Link>
                </TooltipTrigger>
                <TooltipContent>Lihat Member</TooltipContent>
            </Tooltip>

            {/* DELETE */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="text-[#ec486a]"
                        onClick={() => {
                            setCurrentRow(row.original)
                            setOpen('delete')
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Delete Organization</TooltipContent>
            </Tooltip>
        </ButtonGroup>
    )
}
