'use client'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { useDialog } from '@/context/dialog-provider'
import { SquarePen, Trash2, Users } from 'lucide-react'
import React from 'react'
import { Organization } from '../types/organization'
import { Row } from '@tanstack/react-table'

interface Props {
    row: Row<Organization>
}
export default function OrganizationAction({ row }: Props) {
    const { setOpen, setCurrentRow } = useDialog()
    return (
        <ButtonGroup aria-label="Button group">
            <Button variant='outline' size={'icon'} className='text-[#c7a762]' onClick={() => {
                setCurrentRow(row.original)
                setOpen('edit')
            }}><SquarePen /></Button>
            <Button variant='outline' size={'icon'} className='text-[#434656]'><Users /></Button>
            <Button variant='outline' size={'icon'} className='text-[#ec486a]' onClick={() => {
                setCurrentRow(row.original)
                setOpen('delete')
            }}><Trash2 /></Button>
        </ButtonGroup>
    )
}
