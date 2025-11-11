'use server';

import { auth } from '@/lib/auth';
import { ActionResult } from '@/lib/utils';
import { User } from '@/types';
import { APIError } from 'better-auth';

interface authProps {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginUserResult {
  user: User;
}

export async function loginUser(
  params: authProps
): Promise<ActionResult<LoginUserResult>> {
  const { email, password, rememberMe } = params;

  try {
    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
        rememberMe,
      },
    });

    return {
      success: { reason: 'Login successful' },
      error: null,
      data: {
        user: result.user,
      },
    };
  } catch (err) {
    if (err instanceof APIError) {
      return {
        error: { reason: err.message },
        success: null,
      };
    }

    return { error: { reason: 'Something went wrong.' }, success: null };
  }
}
