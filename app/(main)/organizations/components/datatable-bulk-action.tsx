// components/datatable-bulk-action.tsx
import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2, Download, Archive } from 'lucide-react'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'

import { DataTableBulkActionToolbar } from '@/components/datatable/data-table-bulk-actions-toolbar'
import { OrganizationMultiDeleteDialog } from './organization-multi-delete-dialog'
import { Organization } from '@/generated/prisma'

type DataTableBulkActionsProps<TData> = {
    table: Table<TData>
}

export function DataTableBulkActions<TData>({
    table,
}: DataTableBulkActionsProps<TData>) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleBulkExport = () => {
        const selectedOrganizations = selectedRows.map((row) => row.original as Organization)

        toast.promise(
            sleep(2000).then(() => {
                // Simulasi ekspor data
                const csvContent = selectedOrganizations
                    .map(org => `${org.id},${org.name},${org.slug},${org.createdAt}`)
                    .join('\n')

                const blob = new Blob([csvContent], { type: 'text/csv' })
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'organizations.csv'
                a.click()

                return selectedOrganizations.length
            }),
            {
                loading: 'Mengekspor data...',
                success: (count) => {
                    table.resetRowSelection()
                    return `Berhasil mengekspor ${count} data organisasi`
                },
                error: 'Error mengekspor data',
            }
        )
    }

    const handleBulkArchive = () => {
        const selectedOrganizations = selectedRows.map((row) => row.original as Organization)

        toast.promise(
            Promise.all(
                selectedOrganizations.map(org =>
                    fetch(`/api/organizations/${org.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ metadata: { archived: true } })
                    }).then(res => res.json())
                )
            ),
            {
                loading: 'Mengarsipkan data...',
                success: () => {
                    table.resetRowSelection()
                    return `Berhasil mengarsipkan ${selectedOrganizations.length} data organisasi`
                },
                error: 'Error mengarsipkan data',
            }
        )
    }

    return (
        <>
            <DataTableBulkActionToolbar table={table} entityName='organisasi'>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant='outline'
                            size='icon'
                            onClick={handleBulkExport}
                            className='size-8'
                            aria-label='Ekspor data terpilih'
                            title='Ekspor data terpilih'
                        >
                            <Download />
                            <span className='sr-only'>Ekspor data terpilih</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Ekspor data terpilih</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant='outline'
                            size='icon'
                            onClick={handleBulkArchive}
                            className='size-8'
                            aria-label='Arsipkan data terpilih'
                            title='Arsipkan data terpilih'
                        >
                            <Archive />
                            <span className='sr-only'>Arsipkan data terpilih</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Arsipkan data terpilih</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant='destructive'
                            size='icon'
                            onClick={() => setShowDeleteConfirm(true)}
                            className='size-8'
                            aria-label='Hapus data terpilih'
                            title='Hapus data terpilih'
                        >
                            <Trash2 />
                            <span className='sr-only'>Hapus data terpilih</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Hapus data terpilih</p>
                    </TooltipContent>
                </Tooltip>
            </DataTableBulkActionToolbar>

            <OrganizationMultiDeleteDialog
                table={table}
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
            />
        </>
    )
}