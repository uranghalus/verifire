/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'


import { Main } from '@/components/main'
import { Metadata } from 'next'
import OrganizationClient from './components/organization-client'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export const metadata: Metadata = {
  title: 'Data Organisasi',
  description: 'Data Organisasi page',
}
async function getOrganizationData() {
  try {
    const res = await auth.api.listOrganizations({
      headers: await headers()
    })
    if (!res) {
      throw new Error('Failed to fetch organization data')
    }

    // Normalize response to always return an array of organizations
    const orgs = Array.isArray(res) ? res : (res as any).data ?? []

    // Ensure logo and metadata are never undefined (use null instead)
    return (orgs as any[]).map((o) => ({
      id: o.id,
      name: o.name,
      slug: o.slug,
      createdAt: o.createdAt,
      logo: o.logo ?? null,
      metadata: o.metadata ?? null,
    }))
  } catch (error) {
    console.error('Error fetching organization data:', error)
    return []
  }
}
export default async function page() {
  const data = await getOrganizationData()
  console.log('Fetched Data', data);

  return (
    <Main fluid>
      <OrganizationClient initialData={data} />
    </Main>
  )
}
