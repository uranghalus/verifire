
import { Main } from '@/components/main'
import { Metadata } from 'next'
import AparClient from './components/apar-client'





export const metadata: Metadata = {
    title: 'Data Apar',
    description: 'Data Apar page',
}

async function getAparData() {
    try {
        const res = await fetch(`${process.env.BETTER_AUTH_URL}/api/apar`, {
            cache: 'no-store',
        })

        if (!res.ok) {
            throw new Error('Failed to fetch APAR data')
        }

        return res.json()
    } catch (error) {
        console.error('Error fetching APAR data:', error)
        return { data: [] }
    }
}

export default async function AparPage() {
    const { data } = await getAparData()
    return (
        <Main fluid>
            <div className='flex flex-wrap items-end justify-between gap-2'>
                <div>
                    <h2 className='text-2xl font-bold tracking-tight'>Daftar Apar</h2>
                    <p className='text-muted-foreground'>
                        Manage your fire safety equipment here.
                    </p>
                </div>
                {/* <UsersPrimaryButtons /> */}
            </div>
            <AparClient initialData={data} />
        </Main>

    )
}
