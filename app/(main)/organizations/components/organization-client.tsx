'use client'
import { useState } from 'react'
import { Organization } from '../types/organization'
import { DialogProvider } from '@/context/dialog-provider'
import OrganizationPrimaryButton from './organization-primary-button'
import { OrganizationTable } from './organization-table'
import { OrganizationDialogs } from './organization-dialogs'

interface OrganizationClientProps {
    initialData: Organization[]
}
export default function OrganizationClient({ initialData }: OrganizationClientProps) {
    const [data, setData] = useState<Organization[]>(initialData)
    const [loading, setLoading] = useState(false)
    const refreshData = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/organizations')
            const result = await res.json()
            setData(result.data)
        } catch (error) {
            console.error('Error refreshing data:', error)
        } finally {
            setLoading(false)
        }
    }

    // Untuk search params di Next.js (jika menggunakan useSearchParams)
    const [searchParams] = useState({})
    return (
        <DialogProvider >
            <div className="flex flex-1 flex-col gap-4 sm:gap-6">
                <div className='flex flex-wrap items-end justify-between gap-2'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight'>Data Organisasi</h2>
                        <p className='text-muted-foreground'>
                            Kelola data organisasi dan keanggotaan di sini.
                        </p>
                    </div>
                    <OrganizationPrimaryButton />
                </div>
                <OrganizationTable data={data}
                    searchParams={searchParams}
                    onRefresh={refreshData}
                    loading={loading} />
            </div>
            <OrganizationDialogs />
        </DialogProvider>
    )
}
