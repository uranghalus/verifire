
import AuthenticatedLayout from '@/components/layout/authenticated-layout'
import { getServerSession } from '@/lib/get-session'
import { unauthorized } from 'next/navigation'
import React from 'react'

interface MainLayoutProps {
    children?: React.ReactNode
}
export default async function MainLayout({ children }: MainLayoutProps) {

    const session = await getServerSession()

    if (!session?.user) unauthorized()
    const user = session.user
    return (
        <AuthenticatedLayout user={
            user
        }>
            {children}
        </AuthenticatedLayout>
    )
}
