
import { getOrganization } from '@/hooks/crud/use-organization';
import { searchParamsCache } from '@/lib/searchparams';
import React from 'react'
import { Organization } from '../types/organization';
import OrganizationTable from './organization-table';
import { columns } from './organization-columns';

export default async function OrganizationList() {
    const page = Number(searchParamsCache.get('page') ?? 1);
    const limit = Number(searchParamsCache.get('perPage') ?? 10);
    const search = String(searchParamsCache.get('name') ?? '');

    const data = await getOrganization({
        page,
        limit,
        search,
    });
    const totalOrganizations = data.meta.total;
    const organizations: Organization[] = data.data

    return (
        <OrganizationTable
            data={organizations}
            totalItems={totalOrganizations}
            columns={columns}
        />
    );
}

