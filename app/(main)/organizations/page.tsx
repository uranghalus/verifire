import React from 'react'
import OrganizationTable from './components/organization-table'
import { DialogProvider } from '@/context/dialog-provider'
import { Main } from '@/components/main'


export default function page() {
  return (
    <DialogProvider>
      <Main>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Data APAR</h2>
            <p className='text-muted-foreground'>
              Kelola data Alat Pemadam Api Ringan (APAR) di sini.
            </p>
          </div>
          <OrganizationPrimaryButtons />
        </div>
        <OrganizationTable />
      </Main>
    </DialogProvider>
  )
}
