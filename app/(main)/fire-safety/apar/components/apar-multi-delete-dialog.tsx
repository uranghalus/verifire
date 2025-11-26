// components/apar-multi-delete-dialog.tsx
'use client'

import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Apar } from '../types/apar'


type AparMultiDeleteDialogProps<TData> = {
    open: boolean
    onOpenChange: (open: boolean) => void
    table: Table<TData>
}

const CONFIRM_WORD = 'HAPUS'

export function AparMultiDeleteDialog<TData>({
    open,
    onOpenChange,
    table,
}: AparMultiDeleteDialogProps<TData>) {
    const [value, setValue] = useState('')

    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleDelete = async () => {
        if (value.trim() !== CONFIRM_WORD) {
            toast.error(`Harap ketik "${CONFIRM_WORD}" untuk konfirmasi.`)
            return
        }

        try {
            const selectedApar = selectedRows.map((row) => row.original as Apar)

            // Hapus data via API
            const deletePromises = selectedApar.map(apar =>
                fetch(`/api/apar/${apar.id}`, { method: 'DELETE' })
            )

            await Promise.all(deletePromises)

            onOpenChange(false)
            setValue('')

            toast.promise(sleep(1000), {
                loading: 'Menghapus data APAR...',
                success: () => {
                    table.resetRowSelection()
                    return `Berhasil menghapus ${selectedRows.length} data APAR`
                },
                error: 'Error menghapus data',
            })
        } catch (error) {
            console.error('Error deleting APAR:', error)
            toast.error('Terjadi kesalahan saat menghapus data')
        }
    }

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            handleConfirm={handleDelete}
            disabled={value.trim() !== CONFIRM_WORD}
            title={
                <span className='text-destructive'>
                    <AlertTriangle
                        className='stroke-destructive me-1 inline-block'
                        size={18}
                    />
                    Hapus {selectedRows.length} data APAR
                </span>
            }
            desc={
                <div className='space-y-4'>
                    <p className='mb-2'>
                        Apakah Anda yakin ingin menghapus {selectedRows.length} data APAR yang dipilih?
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
            confirmText='Hapus'
            destructive
        />
    )
}