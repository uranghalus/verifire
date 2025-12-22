import { Main } from '@/components/main'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import React from 'react'
import { OrganizationDetailCard } from '../components/organization-detail-card'

export default async function OrganizationDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const data = await auth.api.getFullOrganization({
        query: {
            organizationId: id,
            membersLimit: 5, // preview saja
        },
        headers: await headers(),
    })
    return (
        <Main fluid>
            <OrganizationDetailCard data={data as any} />
        </Main>
    )
}
