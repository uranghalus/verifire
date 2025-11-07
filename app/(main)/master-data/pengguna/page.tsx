
import { Main } from '@/components/main';
import { DialogProvider } from '@/context/dialog-provider';
import { Metadata } from 'next';
import UsersClient from './components/user-client';


export const metadata: Metadata = {
    title: "Data Pengguna", // Akan menjadi: verifire - Dashboard
};



export default async function PenggunaPage() {


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
                <UsersClient />
            </Main>
        </DialogProvider>
    )
}
