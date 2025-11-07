import { getClientSession } from '@/lib/get-session';

export const getUsers = async () => {
  const session = await getClientSession();
  console.log('Session in getUsers:', session);
  // const checkPermission = await canServer(userId as string, 'user', 'list');

  // if (!checkPermission) {
  //   throw new Error('Anda tidak memiliki izin untuk melihat daftar pengguna.');
  // } else {
  //   const data = await auth.api.listUsers({
  //     query: {
  //       limit: 100,
  //     },
  //     headers: await headers(),
  //   });
  //   return { data };
  // }
};
