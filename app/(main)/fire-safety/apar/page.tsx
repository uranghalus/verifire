
import { Main } from '@/components/main'
import { DialogProvider } from '@/context/dialog-provider'
import { Metadata } from 'next'

import AparTable from './components/apar-table'
import { AparDialogs } from './components/apar-dialogs'



export const metadata: Metadata = {
    title: 'Data Apar',
    description: 'Data Apar page',
}
export default function AparPage() {
    return (
        <DialogProvider>
            <Main fluid>
                <div className='flex flex-wrap items-end justify-between gap-2'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight'>Daftar Apar</h2>
                        <p className='text-muted-foreground'>
                            Manage your fire safety equipment here.
                        </p>
                    </div>
                    {/* <UsersPrimaryButtons /> */}

                </div>
                <AparTable />
                <AparDialogs />
            </Main>
        </DialogProvider>
    )
}
