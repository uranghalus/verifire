import { cookies } from "next/headers"
import { cn } from "@/lib/utils"
import { LayoutProvider } from "@/context/layout-provider"
import { SearchProvider } from "@/context/search-provider"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { AppSidebar } from "@/components/app-sidebar"

import { getClientSession, getServerSession } from "@/lib/get-session"
import { Header } from "@/components/header"
import { Search } from "@/components/search"
import { ThemeSwitch } from "@/components/theme-switcher"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { NuqsAdapter } from 'nuqs/adapters/next/app';
type AuthenticatedLayoutProps = {
    children?: React.ReactNode
}

export default async function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
    // ✅ Harus memakai await sekarang
    const cookieStore = await cookies()
    const sidebarState = cookieStore.get("sidebar_state")?.value
    const defaultOpen = sidebarState !== "false"

    return (
        <SearchProvider>
            <LayoutProvider>
                <SidebarProvider defaultOpen={defaultOpen}>
                    <AppSidebar />

                    <SidebarInset
                        className={cn(
                            "@container/content",
                            "has-[[data-layout=fixed]]:h-svh",
                            "peer-data-[variant=inset]:has-[[data-layout=fixed]]:h-[calc(100svh-(var(--spacing)*4))]"
                        )}
                    >
                        <Header>
                            <div className="ms-auto flex items-center space-x-4">
                                <Search />
                                <ThemeSwitch />
                                <ProfileDropdown />
                            </div>
                        </Header>

                        <NuqsAdapter>{children}</NuqsAdapter>
                    </SidebarInset>
                </SidebarProvider>
            </LayoutProvider>
        </SearchProvider>
    )
}
