import {
  LayoutDashboard,
  ListTodo,
  Command,
  FireExtinguisher,
  DatabaseZap,
  UserCog2,
} from 'lucide-react';
// import { ClerkLogo } from '@/assets/clerk-logo';
import { SidebarData } from '@/types';

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Shadcn Admin',
      logo: Command,
      plan: 'Vite + ShadcnUI',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: LayoutDashboard,
        },
        {
          title: 'Role Management',
          icon: UserCog2,
          items: [
            {
              title: 'Permission List',
              url: '/role-management/permission-list',
            },
            {
              title: 'Role List',
              url: '/role-management/role-list',
            },
          ],
        },
        {
          title: 'Data Master',
          icon: DatabaseZap,
          items: [
            {
              title: 'Data Pengguna',
              url: '/master-data/pengguna',
            },
            // {
            //   title: 'Data Departemen',
            //   url: '/master-data/departemen',
            // },
            // {
            //   title: 'Data Jabatan',
            //   url: '/master-data/jabatan',
            // },
            // {
            //   title: 'Data Unit Bisnis',
            //   url: '/master-data/unit-bisnis',
            // },
            // {
            //   title: 'Data Karyawan',
            //   url: '/master-data/karyawan',
            // },
          ],
        },
        {
          title: 'Data Fire Safety',
          icon: FireExtinguisher,
          items: [
            {
              title: 'Data CP Security',
              url: '/fire-safety/cekpoin-security',
            },
            {
              title: 'Data Apar',
              url: '/fire-safety/apar',
            },
            {
              title: 'Data Hydrant',
              url: '/fire-safety/hydrant',
            },
          ],
        },
        {
          title: 'Data Inspeksi',
          icon: ListTodo,
          items: [
            {
              title: 'Inspeksi Apar',
              url: '/inspection/apar',
            },
            {
              title: 'Inspeksi Hydrant',
              url: '/inspection/hydrant',
            },
            {
              title: 'Inspeksi Cekpoint',
              url: '/inspection/cekpoint-security',
            },
          ],
        },
      ],
    },
  ],
};
