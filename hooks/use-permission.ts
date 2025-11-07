import { auth } from '@/lib/auth';
import { authClient } from '@/lib/auth-client';

type Resource =
  | 'apar'
  | 'hydrant'
  | 'area'
  | 'inspection'
  | '*'
  | 'report'
  | 'user'
  | 'project'
  | 'role'
  | 'session';
type Action =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | '*'
  | 'list'
  | 'revoke'
  | 'set-role'
  | 'ban'
  | 'impersonate'
  | 'set-password';

/**
 * ✅ Client-side permission check
 * Contoh: await can("apar", "create")
 */
export async function can(
  resource: Resource,
  action: Action
): Promise<boolean> {
  try {
    const result = await authClient.admin.hasPermission({
      permissions: {
        [resource]: [action],
      },
    });
    // 🧠 Ambil nilai boolean-nya
    return !!result?.data?.success;
  } catch (error) {
    console.error('Permission check failed:', error);
    return false;
  }
}

/**
 * ✅ Server-side permission check
 * Gunakan di route handler atau server action
 * Contoh: await canServer(req.auth, "hydrant", "update")
 */
export async function canServer(
  userId: string,
  resource: Resource,
  action: Action
): Promise<boolean> {
  try {
    const result = await auth.api.userHasPermission({
      body: {
        userId: userId,
        permissions: {
          [resource]: [action],
        },
      },
    });
    return !!result;
  } catch (error) {
    console.error('Permission check failed:', error);
    return false;
  }
}
