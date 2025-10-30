'use client'

import { getCookie } from '@/lib/cookies'
import { cn } from '@/lib/utils'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

import { useEffect, useState } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { User } from 'better-auth'
import { Header } from '../header'
import { Search } from '../search'
import { ThemeSwitch } from '../theme-switcher'
import { ProfileDropdown } from '../profile-dropdown'

type AuthenticatedLayoutProps = {
    children?: React.ReactNode
    user: User
}

export default function AuthenticatedLayout({ children, user }: AuthenticatedLayoutProps) {
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
                    <AppSidebar user={user} />
                    <SidebarInset
                        className={cn(
                            '@container/content',
                            'has-[[data-layout=fixed]]:h-svh',
                            'peer-data-[variant=inset]:has-[[data-layout=fixed]]:h-[calc(100svh-(var(--spacing)*4))]'
                        )}
                    ><Header>
                            <div className="ms-auto flex items-center space-x-4">
                                <Search />
                                <ThemeSwitch />
                                <ProfileDropdown user={user} />
                            </div>
                        </Header>
                        {children}
                    </SidebarInset>
                </SidebarProvider>
            </LayoutProvider>
        </SearchProvider>
    )
}
