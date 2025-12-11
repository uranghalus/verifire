// components/organization-primary-button.tsx
'use client'

import { Button } from '@/components/ui/button'
import { useDialog } from '@/context/dialog-provider'
import { Plus, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { useOrganizations } from '../hooks/organization-client'

export default function OrganizationPrimaryButton() {
    const { setOpen } = useDialog()
    const { mutate } = useOrganizations()

    const handleRefresh = () => {
        toast.promise(
            mutate(),
            {
                loading: 'Menyegarkan data...',
                success: 'Data berhasil disegarkan',
                error: 'Gagal menyegarkan data',
            }
        )
    }

    return (
        <div className='flex items-center gap-4'>
            <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="gap-2"
            >
                <RefreshCw size={16} />
                Refresh
            </Button>
            <Button
                className='gap-2'
                onClick={() => setOpen('add')}
            >
                <Plus size={18} />
                <span>Tambah Organisasi</span>
            </Button>
        </div>
    )
}