// components/organization-delete-dialog.tsx
'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Organization } from '@/generated/prisma'
import { useOrganizations } from '../hooks/organization-client'
import { toast } from 'sonner'

type OrganizationDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: Organization
    onSuccess?: () => void
}

export function OrganizationDeleteDialog({
    open,
    onOpenChange,
    currentRow,
    onSuccess,
}: OrganizationDeleteDialogProps) {
    const [value, setValue] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)
    const { data, mutate } = useOrganizations()

    const handleDelete = async () => {
        if (value.trim() !== currentRow.name) {
            toast.error('Nama organisasi tidak sesuai')
            return
        }

        try {
            setIsDeleting(true)

            // Optimistic update
            const previousData = data || []
            const filteredData = previousData.filter((org: Organization) => org.id !== currentRow.id)

            const promise = fetch(`/api/organizations/${currentRow.id}`, {
                method: 'DELETE',
            }).then(async (response) => {
                if (!response.ok) {
                    const error = await response.json()
                    // Rollback on error
                    mutate(previousData, { revalidate: false })
                    throw new Error(error.error || 'Gagal menghapus organisasi')
                }
                return response.json()
            })

            await toast.promise(promise, {
                loading: 'Menghapus organisasi...',
                success: () => {
                    // Update dengan optimistic data
                    mutate(filteredData, { revalidate: false })

                    // Reset form dan close dialog
                    setValue('')
                    onOpenChange(false)

                    // Panggil callback jika ada
                    if (onSuccess) onSuccess()

                    return 'Organisasi berhasil dihapus'
                },
                error: (error) => {
                    // Revalidate untuk mendapatkan data terbaru
                    mutate()
                    return error.message || 'Terjadi kesalahan saat menghapus organisasi'
                },
            })
        } catch (error) {
            console.error('Error deleting organization:', error)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={(state) => {
                if (!state) {
                    setValue('')
                }
                onOpenChange(state)
            }}
            handleConfirm={handleDelete}
            disabled={value.trim() !== currentRow.name || isDeleting}
            isLoading={isDeleting}
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
                        Ketik <span className='font-bold'>{currentRow.name}</span> untuk konfirmasi:
                        <Input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={`Ketik "${currentRow.name}" untuk konfirmasi`}
                            className='mt-2'
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
            confirmText={isDeleting ? 'Menghapus...' : 'Hapus'}
            destructive
        />
    )
}