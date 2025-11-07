import { headers } from 'next/headers';
import { cache } from 'react';
import { auth } from './auth';
import { authClient } from './auth-client';

export const getServerSession = cache(async () => {
  console.log('getServerSession');
  return await auth.api.getSession({ headers: await headers() });
});

export const getClientSession = async () => {
  const { data: session, error } = await authClient.getSession();
  console.log('getClientSession', session, error);
  return { data: session, error };
};
