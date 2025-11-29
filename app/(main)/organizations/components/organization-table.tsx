"use client"
import { DataTable } from '@/components/datatable/data-table'
import React from 'react'
import { OrgColumns } from './organization-columns'
import { authClient } from '@/lib/auth-client'
import { Organization } from '@/generated/prisma'

export default function OrganizationTable() {
    const [data, setData] = React.useState<Organization[]>([])
    const [loading, setLoading] = React.useState(true)


    async function loadOrganizations() {
        try {
            const res = await authClient.useListOrganizations()
            const items = Array.isArray(res.data)
                ? res.data.map((o) => ({
                    ...o,
                    // ensure metadata is a string or null (required by Organization type)
                    metadata:
                        o.metadata == null
                            ? null
                            : typeof o.metadata === 'string'
                                ? o.metadata
                                : JSON.stringify(o.metadata),
                    // ensure logo is explicitly null instead of undefined
                    logo: o.logo ?? null,
                }))
                : []
            setData(items as Organization[])
        } catch (err) {
            console.error('Error load organizations', err)
        } finally {
            setLoading(false)
        }
    }


    React.useEffect(() => {
        loadOrganizations()
    }, [])
    return (
        <div>
            <DataTable columns={OrgColumns} data={data || []} />
        </div>
    )
}
