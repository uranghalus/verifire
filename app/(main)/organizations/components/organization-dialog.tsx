'use client'
import { useDialog } from '@/context/dialog-provider'
import OrganizationDeleteDialog from './organization-delete-dialog'
import { OrganizationActionDialog } from './organization-action-dialog'

export default function OrganizationDialog() {
    const { open, setOpen, currentRow, setCurrentRow } = useDialog()

    const closeAll = () => {
        setOpen(null)
        setCurrentRow(null)
    }

    return (
        <>
            {/* ADD */}
            <OrganizationActionDialog
                open={open === 'add'}
                onOpenChange={(isOpen) => {
                    if (!isOpen) closeAll()
                }}
            />

            {/* EDIT */}
            {currentRow && (
                <OrganizationActionDialog
                    open={open === 'edit'}
                    currentRow={currentRow as any}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) closeAll()
                    }}
                />
            )}

            {/* DELETE */}
            {currentRow && (
                <OrganizationDeleteDialog
                    open={open === 'delete'}
                    currentRow={currentRow as any}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) closeAll()
                    }}
                />
            )}
        </>
    )
}
