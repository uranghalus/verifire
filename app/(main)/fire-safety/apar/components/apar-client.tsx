'use client'
import React, { useState } from 'react'
import { Apar } from '../types/apar'
import { DialogProvider } from '@/context/dialog-provider'
import { AparTable } from './apar-table'
import { AparDialogs } from './apar-dialogs'
interface AparClientProps {
    initialData: Apar[]
}
export default function AparClient({ initialData }: AparClientProps) {
    const [data, setData] = useState<Apar[]>(initialData)
    const [loading, setLoading] = useState(false)

    const refreshData = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/apar')
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
                        <h2 className='text-2xl font-bold tracking-tight'>Data APAR</h2>
                        <p className='text-muted-foreground'>
                            Kelola data Alat Pemadam Api Ringan (APAR) di sini.
                        </p>
                    </div>
                    {/* <AparPrimaryButtons /> */}
                </div>
                <AparTable data={data}
                    searchParams={searchParams}
                    onRefresh={refreshData}
                    loading={loading} />
            </div>
            <AparDialogs />
        </DialogProvider>
    )
}
