/* eslint-disable @typescript-eslint/no-explicit-any */
import { Main } from '@/components/main'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import React from 'react'
import { OrganizationDetailCard } from '../components/organization-detail-card'
import OrganizationTabs from './components/organization-tabs'

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
            <div className="flex flex-wrap items-end justify-between gap-2 mb-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Unit Bisnis Detail</h2>
                    <p className="text-muted-foreground">Data Detail unit bisnis</p>
                </div>
                {/* <OrganizationPrimaryButton /> */}
            </div>
            <OrganizationTabs />
        </Main>
    )
}
