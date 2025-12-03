/* eslint-disable @typescript-eslint/no-explicit-any */
// components/organization-delete-dialog.tsx
'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Organization } from '../types/organization'

type OrganizationDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: Organization | any
}

export function OrganizationDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: OrganizationDeleteDialogProps) {
    const [value, setValue] = useState('')

    const handleDelete = async () => {
        if (value.trim() !== currentRow.name) return

        try {
            const response = await fetch(`/api/organizations/${currentRow.id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                onOpenChange(false)
                setValue('')
                // Refresh data
                window.location.reload()
            } else {
                console.error('Failed to delete organization')
            }
        } catch (error) {
            console.error('Error deleting organization:', error)
        }
    }

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            handleConfirm={handleDelete}
            disabled={value.trim() !== currentRow.name}
            title={
                <span className='text-destructive'>
                    <AlertTriangle
                        className='stroke-destructive me-1 inline-block'
                        size={18}
                    />
                    Hapus Organisasi
                </span>
            }
            desc={
                <div className='space-y-4'>
                    <p className='mb-2'>
                        Apakah Anda yakin ingin menghapus organisasi{' '}
                        <span className='font-bold'>{currentRow.name}</span>?
                        <br />
                        Tindakan ini akan menghapus data organisasi dari sistem secara permanen.
                    </p>

                    <Label className='my-2'>
                        Nama Organisasi:
                        <Input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder='Masukkan nama organisasi untuk konfirmasi penghapusan.'
                        />
                    </Label>

                    <Alert variant='destructive'>
                        <AlertTitle>Peringatan!</AlertTitle>
                        <AlertDescription>
                            Data yang dihapus tidak dapat dikembalikan. Pastikan data yang akan dihapus sudah benar.
                        </AlertDescription>
                    </Alert>
                </div>
            }
            confirmText='Hapus'
            destructive
        />
    )
}