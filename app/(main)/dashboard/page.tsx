import { Header } from '@/components/header'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switcher'
import React from 'react'

export default function Dashboard() {
    return (
        <div>
            <Header>
                <div className="ms-auto flex items-center space-x-4">
                    <Search />
                    <ThemeSwitch />
                    <ProfileDropdown />
                </div>
            </Header>
        </div>
    )
}
