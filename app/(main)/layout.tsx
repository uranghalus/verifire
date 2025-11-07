
import AuthenticatedLayout from '@/components/layout/authenticated-layout'
import { getClientSession } from '@/lib/get-session'
import { unauthorized } from 'next/navigation'
import React from 'react'

interface MainLayoutProps {
    children?: React.ReactNode
}
export default async function MainLayout({ children }: MainLayoutProps) {

    return (
        <AuthenticatedLayout >
            {children}
        </AuthenticatedLayout>
    )
}
