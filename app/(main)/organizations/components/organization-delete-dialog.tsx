'use client'
import React, { useState } from 'react'
import { Organization } from '../types/organization'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { deleteOrganization } from '@/hooks/crud/use-organization'
type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: Organization
}
export default function OrganizationDeleteDialog({ currentRow, onOpenChange, open }: Props) {
    const [loading, setLoading] = useState(false)
    const handleDelete = async () => {
        console.log('Current Row Delete', currentRow);
        toast.promise(
            async () => {
                const res = await deleteOrganization({ id: currentRow.id });

                if (!res.success) {
                    throw new Error(res.message); // ⬅️ WAJIB
                }

                return res.message; // ⬅️ INI yang dipakai toast.success
            },
            {
                loading: "Menghapus Data....",
                description: "Sedang menghapus data.",
                success: (message) => {
                    return {
                        message: 'Berhasil!!',
                        description: message
                    }
                },
                error: (error) => error.message || "Gagal menghapus data",
                finally: () => {
                    setLoading(false)
                    onOpenChange(false)
                },
            }
        )
    }
    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            handleConfirm={handleDelete}
            disabled={loading}
            title={
                <span className='text-destructive'>
                    <AlertTriangle
                        className='stroke-destructive me-1 inline-block'
                        size={18}
                    />
                    Hapus Unit Bisnis
                </span>
            }
            desc={
                <div className='space-y-4'>
                    <p className='mb-2'>
                        Apakah Anda yakin ingin menghapus Unit Bisnis{' '}
                        <span className='font-bold'>{currentRow.name}</span>?
                        <br />
                        Tindakan ini akan menghapus data APAR dari sistem secara permanen.
                    </p>

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
