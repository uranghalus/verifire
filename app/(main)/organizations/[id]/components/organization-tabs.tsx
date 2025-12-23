import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'
import DetailOverview from './detail-overview'

export default function OrganizationTabs() {
    return (
        <Tabs defaultValue='overview' className='space-y-4'>
            <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="teams">Teams</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
                <DetailOverview />
            </TabsContent>

            <TabsContent value="members">
                {/* <MembersTab data={data.members} role={currentUserRole} /> */}Peler 2
            </TabsContent>

            <TabsContent value="teams">
                {/* <TeamsTab data={data.teams} role={currentUserRole} /> */}Peler 3
            </TabsContent>
        </Tabs>
    )
}
