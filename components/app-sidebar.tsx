'use client'

import { useLayout } from '@/context/layout-provider'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar'

import { NavGroup } from './nav-group'


import { sidebarData } from '@/data/sidebar-data'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'
import { User } from '@/types'


// import { AppTitle } from './app-title'
interface SidebarProps {
    user: User | null
}
export function AppSidebar({ user }: SidebarProps) {
    const { collapsible, variant } = useLayout()

    return (
        <Sidebar collapsible={collapsible} variant={variant}>
            {/* === Header Section === */}
            <SidebarHeader>
                {/* Jika kamu ingin dropdown tim */}
                <TeamSwitcher teams={sidebarData.teams} />

                {/* Jika ingin pakai judul aplikasi biasa: */}
                {/* <AppTitle /> */}
            </SidebarHeader>

            {/* === Navigasi === */}
            <SidebarContent>
                {sidebarData.navGroups.map((group) => (
                    <NavGroup key={group.title} {...group} />
                ))}
            </SidebarContent>

            {/* === Footer (User Info) === */}
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>

            {/* === Sidebar Rail (untuk mode collapsed) === */}
            <SidebarRail />
        </Sidebar>
    )
}
