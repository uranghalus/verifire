// app/apar/components/apar-delete-dialog.tsx
'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Apar } from '../types/apar'
import { deleteAparMutation } from '../hooks/use-apar'


interface AparDeleteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentApar: Apar | null
    onSuccess?: () => void
}

export function AparDeleteDialog({
    open,
    onOpenChange,
    currentApar,
    onSuccess
}: AparDeleteDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [confirmText, setConfirmText] = useState('')

    // Reset confirm text ketika dialog dibuka/ditutup
    useEffect(() => {
        if (open) {
            setConfirmText('')
        }
    }, [open])

    const handleDelete = async () => {
        if (!currentApar) return

        if (confirmText !== currentApar.kode_apar) {
            toast.error(`Ketik "${currentApar.kode_apar}" untuk konfirmasi`)
            return
        }

        setIsLoading(true)
        try {
            await deleteAparMutation(currentApar.id)
            toast.success('APAR berhasil dihapus')
            onSuccess?.()
            onOpenChange(false)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan')
        } finally {
            setIsLoading(false)
        }
    }

    if (!currentApar) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        Hapus APAR
                    </DialogTitle>
                    <DialogDescription>
                        Tindakan ini tidak dapat dibatalkan. APAR akan dihapus secara permanen dari sistem.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="rounded-lg border p-3">
                        <h4 className="font-medium mb-2">Detail APAR yang akan dihapus:</h4>
                        <div className="text-sm space-y-1">
                            <p><span className="font-medium">Kode:</span> {currentApar.kode_apar}</p>
                            <p><span className="font-medium">Lokasi:</span> {currentApar.lokasi}</p>
                            <p><span className="font-medium">Lantai:</span> {currentApar.lantai || '-'}</p>
                            <p><span className="font-medium">Jenis:</span> {currentApar.jenis}</p>
                            <p><span className="font-medium">Size:</span> {currentApar.size} kg</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Ketik <span className="font-mono text-destructive">{currentApar.kode_apar}</span> untuk konfirmasi:
                        </label>
                        <Input
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder={`Ketik ${currentApar.kode_apar} untuk konfirmasi`}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={confirmText !== currentApar.kode_apar || isLoading}
                    >
                        {isLoading ? 'Menghapus...' : 'Hapus APAR'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}