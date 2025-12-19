/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useDialog } from '@/context/dialog-provider'
import React from 'react'
import OrganizationDeleteDialog from './organization-delete-dialog'
import { OrganizationActionDialog } from './organization-action-dialog'

export default function OrganizationDialog() {
    const { open, setOpen, currentRow, setCurrentRow } = useDialog()

    const handleClose = (type: 'edit' | 'delete') => {
        setOpen(null)
        setTimeout(() => {
            setCurrentRow(null)
        }, 500)
    }

    return (
        <>
            <OrganizationActionDialog onOpenChange={() => setOpen('add')} open={open === 'add'} key={'organization-add'} />
            {
                currentRow && (
                    <OrganizationDeleteDialog onOpenChange={() => handleClose('delete')} open={open === 'delete'} key={`organization-delete-${currentRow as any}`} currentRow={currentRow as any} />
                )
            }
        </>
    )
}
