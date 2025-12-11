'use client'
import React from 'react'


import { Main } from '@/components/main'
import { Metadata } from 'next'
import { OrganizationTable } from './components/organization-table'
import { DialogProvider } from '@/context/dialog-provider'
import { OrganizationDialogs } from './components/organization-dialogs'

// export const metadata: Metadata = {
//   title: 'Data Organisasi',
//   description: 'Data Organisasi page',
// }
export default function page() {
  return (
    <DialogProvider>

      <Main fluid>
        <OrganizationTable />
        <OrganizationDialogs />
      </Main>
    </DialogProvider>
  )
}
