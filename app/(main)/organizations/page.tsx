import React from 'react'

import { DialogProvider } from '@/context/dialog-provider'
import { Main } from '@/components/main'
import OrganizationPrimaryButton from './components/organization-primary-button'
import { Metadata } from 'next'
import OrganizationClient from './components/organization-client'

export const metadata: Metadata = {
  title: 'Data Organisasi',
  description: 'Data Organisasi page',
}
async function getOrganizationData() {
  try {
    const res = await fetch(`api/organizations`, {
      cache: 'no-store',
    })

    if (!res.ok) {
      throw new Error('Failed to fetch organization data')
    }

    return res.json()
  } catch (error) {
    console.error('Error fetching organization data:', error)
    return { data: [] }
  }
}
export default async function page() {
  const { data } = await getOrganizationData()
  return (
    <Main fluid>
      <OrganizationClient initialData={data} />
    </Main>
  )
}
