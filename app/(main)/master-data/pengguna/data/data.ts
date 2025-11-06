import { authClient } from '@/lib/auth-client';
import { Binoculars, HatGlasses, ShieldUser, UserStar } from 'lucide-react';

export const roles = [
  { label: 'Admin', value: 'admin', icon: ShieldUser },
  { label: 'Superadmin', value: 'superadmin', icon: HatGlasses },
  { label: 'Inspektor', value: 'inspektor', icon: Binoculars },
  { label: 'Manager', value: 'manager', icon: UserStar },
];
type Props = {
  userId: string;
};
export async function getUsers({ userId }: Props) {
  const data = await authClient.admin.hasPermission({
    userId: userId,
    permission: { user: ['view', 'create', 'edit', 'delete'] },
  });

  return { data };
  // const { data: users, error } = await authClient.admin.listUsers({
  //   query: {
  //     limit: 100,
  //     offset: 100,
  //     sortBy: 'name',
  //     sortDirection: 'desc',
  //   },
  // });
  // return { users, error };
}
