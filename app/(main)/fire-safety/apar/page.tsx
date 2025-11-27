
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
            <AparClient initialData={data} />
        </Main>

    )
}
