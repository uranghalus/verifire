/* eslint-disable @typescript-eslint/no-explicit-any */
// components/organization-dialogs.tsx
import { useDialog } from '@/context/dialog-provider'

import { OrganizationDeleteDialog } from './organization-delete-dialog'
import { OrganizationActionDialog } from './organization-action-dialog'

export function OrganizationDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = useDialog()

    const handleClose = (type: 'edit' | 'delete' | 'members' | 'invitations') => {
        setOpen(null)
        setTimeout(() => {
            setCurrentRow(null)
        }, 500)
    }

    return (
        <>
            {/* Add Dialog */}
            <OrganizationActionDialog
                key='organization-add'
                open={open === 'add'}
                onOpenChange={() => setOpen('add')}
            />

            {/* Edit, View, and Other Dialogs */}
            {currentRow && (
                <>
                    <OrganizationActionDialog
                        key={`organization-edit-${(currentRow as any).id}`}
                        open={open === 'edit'}
                        onOpenChange={() => handleClose('edit')}
                        currentRow={currentRow as any}
                    />

                    {/*
                    <OrganizationMembersDialog
                        key={`organization-members-${currentRow.id}`}
                        open={open === 'members'}
                        onOpenChange={() => handleClose('members')}
                        currentRow={currentRow}
                    />
                    
                    <OrganizationInvitationsDialog
                        key={`organization-invitations-${currentRow.id}`}
                        open={open === 'invitations'}
                        onOpenChange={() => handleClose('invitations')}
                        currentRow={currentRow}
                    />
                    */}

                    <OrganizationDeleteDialog
                        key={`organization-delete-${(currentRow as any).id}`}
                        open={open === 'delete'}
                        onOpenChange={() => handleClose('delete')}
                        currentRow={currentRow as any}
                    />
                </>
            )}
        </>
    )
}