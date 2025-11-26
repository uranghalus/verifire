/* eslint-disable @typescript-eslint/no-explicit-any */
// components/apar-dialogs.tsx
import { useDialog } from '@/context/dialog-provider'
import { AparActionDialog } from './apar-action-dialog'
import { AparDeleteDialog } from './apar-delete-dialog'


export function AparDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = useDialog()

    const handleClose = (type: 'edit' | 'delete' | 'view' | 'inspections') => {
        setOpen(null)
        setTimeout(() => {
            setCurrentRow(null)
        }, 500)
    }

    return (
        <>
            {/* Add Dialog */}
            <AparActionDialog
                key='apar-add'
                open={open === 'add'}
                onOpenChange={() => setOpen('add')}
            />

            {/* Edit, View, and Inspections Dialogs */}
            {currentRow && (
                <>
                    <AparActionDialog
                        key={`apar-edit-${currentRow.id}`}
                        open={open === 'edit'}
                        onOpenChange={() => handleClose('edit')}
                        currentRow={currentRow as any}
                    />
                    {/* 
                    <AparDetailDialog
                        key={`apar-view-${currentRow.id}`}
                        open={open === 'view'}
                        onOpenChange={() => handleClose('view')}
                        currentRow={currentRow}
                    />

                    <AparInspectionsDialog
                        key={`apar-inspections-${currentRow.id}`}
                        open={open === 'inspections'}
                        onOpenChange={() => handleClose('inspections')}
                        currentRow={currentRow}
                    /> */}

                    <AparDeleteDialog
                        key={`apar-delete-${currentRow.id}`}
                        open={open === 'delete'}
                        onOpenChange={() => handleClose('delete')}
                        currentRow={currentRow as any}
                    />
                </>
            )}
        </>
    )
}