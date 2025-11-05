import { authClient } from '@/lib/auth-client';
import { Binoculars, HatGlasses, ShieldUser, UserStar } from 'lucide-react';

export const roles = [
  { label: 'Admin', value: 'admin', icon: ShieldUser },
  { label: 'Superadmin', value: 'superadmin', icon: HatGlasses },
  { label: 'Inspektor', value: 'inspektor', icon: Binoculars },
  { label: 'Manager', value: 'manager', icon: UserStar },
];
export async function getUsers() {
  const { data: users, error } = await authClient.admin.listUsers({
    query: {
      limit: 100,
      offset: 100,
      sortBy: 'name',
      sortDirection: 'desc',
    },
  });
  return { users, error };
}
