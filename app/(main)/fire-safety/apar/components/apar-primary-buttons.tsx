// components/apar-primary-buttons.tsx
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDialog } from '@/context/dialog-provider'


export function AparPrimaryButtons() {
    const { setOpen } = useDialog()

    return (
        <Button className='space-x-1' onClick={() => setOpen('add')}>
            <span>Tambah APAR</span> <Plus size={18} />
        </Button>
    )
}