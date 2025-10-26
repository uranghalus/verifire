'use client'

import { getCookie } from '@/lib/cookies'
import { cn } from '@/lib/utils'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

import { useEffect, useState } from 'react'
import { AppSidebar } from '@/components/app-sidebar'

type AuthenticatedLayoutProps = {
    children?: React.ReactNode
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
    // 🧠 Karena document.cookie hanya tersedia di client, kita pakai state
    const [defaultOpen, setDefaultOpen] = useState(true)

    useEffect(() => {
        const cookieValue = getCookie('sidebar_state')
        setDefaultOpen(cookieValue !== 'false')
    }, [])

    return (
        <SearchProvider>
            <LayoutProvider>
                <SidebarProvider defaultOpen={defaultOpen}>
                    {/* <SkipToMain /> */}
                    <AppSidebar />
                    <SidebarInset
                        className={cn(
                            '@container/content',
                            'has-[[data-layout=fixed]]:h-svh',
                            'peer-data-[variant=inset]:has-[[data-layout=fixed]]:h-[calc(100svh-(var(--spacing)*4))]'
                        )}
                    >
                        {children}
                    </SidebarInset>
                </SidebarProvider>
            </LayoutProvider>
        </SearchProvider>
    )
}
