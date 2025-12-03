'use client'

import { Button } from '@/components/ui/button'
import { useDialog } from '@/context/dialog-provider'
import { Plus } from 'lucide-react'
import React from 'react'

export default function OrganizationPrimaryButton() {
    const { setOpen } = useDialog()
    return (
        <div className='flex items-center gap-4'>
            <Button className='space-x-1' onClick={() => setOpen('add')}>
                <span>Tambah Data</span> <Plus size={18} />
            </Button>
        </div>
    )
}
