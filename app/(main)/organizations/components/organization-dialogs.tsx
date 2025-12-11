// components/organization-dialogs.tsx
import { useDialog } from '@/context/dialog-provider'
import { OrganizationDeleteDialog } from './organization-delete-dialog'
import { OrganizationActionDialog } from './organization-action-dialog'
import { OrganizationMembersDialog } from './organization-members-dialog'
import { OrganizationInvitationsDialog } from './organization-invitations-dialog'

export function OrganizationDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = useDialog()

    const handleClose = () => {
        setOpen(null)
        // Clear current row after animation
        setTimeout(() => {
            setCurrentRow(null)
        }, 300)
    }

    return (
        <>
            {/* Add Dialog */}
            <OrganizationActionDialog
                key='organization-add'
                open={open === 'add'}
                onOpenChange={(isOpen) => {
                    if (!isOpen) handleClose()
                    else setOpen('add')
                }}
            />

            {/* Edit, View, and Other Dialogs */}
            {currentRow && (
                <>
                    <OrganizationActionDialog
                        key={`organization-edit-${currentRow.id}`}
                        open={open === 'edit'}
                        onOpenChange={(isOpen) => {
                            if (!isOpen) handleClose()
                            else setOpen('edit')
                        }}
                        currentRow={currentRow}
                    />

                    {/* Members Dialog */}
                    <OrganizationMembersDialog
                        key={`organization-members-${currentRow.id}`}
                        open={open === 'members'}
                        onOpenChange={(isOpen) => {
                            if (!isOpen) handleClose()
                            else setOpen('members')
                        }}
                        organization={currentRow}
                    />

                    {/* Invitations Dialog */}
                    <OrganizationInvitationsDialog
                        key={`organization-invitations-${currentRow.id}`}
                        open={open === 'invitations'}
                        onOpenChange={(isOpen) => {
                            if (!isOpen) handleClose()
                            else setOpen('invitations')
                        }}
                        organization={currentRow}
                    />

                    <OrganizationDeleteDialog
                        key={`organization-delete-${currentRow.id}`}
                        open={open === 'delete'}
                        onOpenChange={(isOpen) => {
                            if (!isOpen) handleClose()
                            else setOpen('delete')
                        }}
                        currentRow={currentRow}
                        onSuccess={handleClose}
                    />
                </>
            )}
        </>
    )
}