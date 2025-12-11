'use client'

import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Organization } from '@/generated/prisma'
import { useOrganizations } from '../hooks/organization-client'

type OrganizationMultiDeleteDialogProps<TData> = {
    open: boolean
    onOpenChange: (open: boolean) => void
    table: Table<TData>
}

const CONFIRM_WORD = 'HAPUS'

export function OrganizationMultiDeleteDialog<TData>({
    open,
    onOpenChange,
    table,
}: OrganizationMultiDeleteDialogProps<TData>) {
    const [value, setValue] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)
    const { mutate } = useOrganizations()

    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDelete = async () => {
        if (value.trim() !== CONFIRM_WORD) {
            toast.error(`Harap ketik "${CONFIRM_WORD}" untuk konfirmasi.`)
            return
        }

        try {
            setIsDeleting(true)
            const selectedOrganizations = selectedRows.map((row) => row.original as Organization)

            // Hapus data via API
            const deletePromises = selectedOrganizations.map(org =>
                fetch(`/api/organizations/${org.id}`, {
                    method: 'DELETE'
                })
            )

            const results = await Promise.allSettled(deletePromises)

            const successCount = results.filter(r => r.status === 'fulfilled').length
            const errorCount = results.filter(r => r.status === 'rejected').length

            onOpenChange(false)
            setValue('')
            table.resetRowSelection()

            // Refresh data
            mutate()

            if (errorCount > 0) {
                toast.warning(
                    `Berhasil menghapus ${successCount} data, gagal ${errorCount} data`
                )
            } else {
                toast.success(`Berhasil menghapus ${selectedRows.length} data organisasi`)
            }
        } catch (error) {
            console.error('Error deleting organizations:', error)
            toast.error('Terjadi kesalahan saat menghapus data')
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
            disabled={value.trim() !== CONFIRM_WORD || isDeleting}
            isLoading={isDeleting}
            title={
                <span className='text-destructive'>
                    <AlertTriangle
                        className='stroke-destructive me-1 inline-block'
                        size={18}
                    />
                    Hapus {selectedRows.length} data organisasi
                </span>
            }
            desc={
                <div className='space-y-4'>
                    <p className='mb-2'>
                        Apakah Anda yakin ingin menghapus {selectedRows.length} data organisasi yang dipilih?
                        <br />
                        Tindakan ini tidak dapat dibatalkan.
                    </p>

                    <Label className='my-4 flex flex-col items-start gap-1.5'>
                        <span>Konfirmasi dengan mengetik `{CONFIRM_WORD}`:</span>
                        <Input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={`Ketik "${CONFIRM_WORD}" untuk konfirmasi.`}
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