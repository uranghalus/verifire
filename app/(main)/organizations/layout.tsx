// app/organizations/layout.tsx
'use client'

import { DialogProvider } from '@/context/dialog-provider'

export default function OrganizationsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <DialogProvider>
            {children}
        </DialogProvider>
    )
}
