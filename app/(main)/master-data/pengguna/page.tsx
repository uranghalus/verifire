
import { Main } from '@/components/main';
import { DialogProvider } from '@/context/dialog-provider';
import { Metadata } from 'next';
import React from 'react'
import UserTable from './components/user-table';
import { authClient } from '@/lib/auth-client';
import { getServerSession } from '@/lib/get-session';
import { getUsers } from './data/data';
export const metadata: Metadata = {
    title: "Data Pengguna", // Akan menjadi: verifire - Dashboard
};

export default async function PenggunaPage() {
    const session = await getServerSession()
    if (!session) {
        return (
            <DialogProvider>
                <Main fluid>
                    <div className='flex flex-wrap items-end justify-between gap-2'>
                        <div>
                            <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
                            <p className='text-muted-foreground'>
                                Manage your users and their roles here.
                            </p>
                        </div>
                    </div>
                    <p className='text-sm text-muted-foreground'>Not authenticated</p>
                </Main>
            </DialogProvider>
        )
    }

    const { data } = await getUsers({ userId: session.session.userId });
    console.log("data:", data);
    console.log(session);

    return (
        <DialogProvider>
            <Main fluid>
                <div className='flex flex-wrap items-end justify-between gap-2'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
                        <p className='text-muted-foreground'>
                            Manage your users and their roles here.
                        </p>
                    </div>
                    {/* <UsersPrimaryButtons /> */}
                </div>
                {/* <UserTable data={users}/> */}
                {JSON.stringify(data)}
            </Main>
        </DialogProvider>
    )
}
