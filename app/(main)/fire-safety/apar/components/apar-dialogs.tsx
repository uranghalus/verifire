// app/apar/components/apar-dialogs.tsx
'use client'



import { Apar } from '../types/apar'
import { useDialog } from '@/context/dialog-provider'
import { AparActionDialog } from './apar-action-dialog'
import { AparDeleteDialog } from './apar-delete-dialog'

interface AparDialogsProps {
    onSuccess?: () => void
}

export function AparDialogs({ onSuccess }: AparDialogsProps) {
    const { open, setOpen, currentRow, setCurrentRow } = useDialog<Apar>()

    const handleSuccess = () => {
        onSuccess?.()
        setCurrentRow(null)
    }

    const handleOpenChange = (isOpen: boolean, dialogType: 'add' | 'edit' | 'delete' | null) => {
        if (!isOpen) {
            setOpen(null)
            // Delay reset currentRow untuk menghindari flash content
            setTimeout(() => setCurrentRow(null), 300)
        } else {
            setOpen(dialogType)
        }
    }

    return (
        <>
            {/* Add Dialog */}
            <AparActionDialog
                open={open === 'add'}
                onOpenChange={(isOpen: boolean) => handleOpenChange(isOpen, isOpen ? 'add' : null)}
                onSuccess={handleSuccess}
            />

            {/* Edit Dialog */}
            <AparActionDialog
                open={open === 'edit'}
                onOpenChange={(isOpen: boolean) => handleOpenChange(isOpen, isOpen ? 'edit' : null)}
                currentApar={currentRow}
                onSuccess={handleSuccess}
            />

            {/* Delete Dialog */}
            <AparDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) => handleOpenChange(isOpen, isOpen ? 'delete' : null)}
                currentApar={currentRow}
                onSuccess={handleSuccess}
            />
        </>
    )
}