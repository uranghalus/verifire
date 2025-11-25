// app/apar/components/apar-dialogs.tsx (Alternatif)
'use client'

import { AparActionDialog } from './apar-action-dialog'
import { AparDeleteDialog } from './apar-delete-dialog'
import { useDialog } from '@/context/dialog-provider'
import { Apar } from '../types/apar'
import { useApar } from '../hooks/use-apar'
import { useSearchParams } from 'next/navigation'

export function AparDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = useDialog<Apar>()
    const searchParams = useSearchParams()
    const { mutate } = useApar({
        page: parseInt(searchParams.get('page') || '1'),
        limit: 10,
        search: searchParams.get('search') || '',
        lantai: searchParams.get('lantai') || '',
        jenis: searchParams.get('jenis') || '',
        size: searchParams.get('size') || '',
    })

    const handleSuccess = () => {
        // Trigger revalidation untuk data APAR
        mutate()
        setCurrentRow(null)
    }

    const handleOpenChange = (isOpen: boolean, dialogType: 'add' | 'edit' | 'delete' | null) => {
        if (!isOpen) {
            setOpen(null)
            setTimeout(() => setCurrentRow(null), 300)
        } else {
            setOpen(dialogType)
        }
    }

    return (
        <>
            <AparActionDialog
                open={open === 'add'}
                onOpenChange={(isOpen) => handleOpenChange(isOpen, isOpen ? 'add' : null)}
                onSuccess={handleSuccess}
            />

            <AparActionDialog
                open={open === 'edit'}
                onOpenChange={(isOpen) => handleOpenChange(isOpen, isOpen ? 'edit' : null)}
                currentApar={currentRow}
                onSuccess={handleSuccess}
            />

            <AparDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen) => handleOpenChange(isOpen, isOpen ? 'delete' : null)}
                currentApar={currentRow}
                onSuccess={handleSuccess}
            />
        </>
    )
}