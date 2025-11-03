import { auth } from '@/lib/auth';
import { authClient } from '@/lib/auth-client';

type Resource = 'apar' | 'hydrant' | 'area' | 'inspection' | '*';
type Action = 'create' | 'read' | 'update' | 'delete' | '*';

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

/**
 * ✅ Server-side permission check (with Better Auth API)
 * Digunakan di route handler, server action, atau cron job.
 */
export async function canServerByUserId(
  userId: string,
  resource: Resource,
  action: Action,
  role?: string
): Promise<boolean> {
  try {
    const result = await auth.api.userHasPermission({
      body: {
        userId,
        role, // opsional — bisa dikirim jika kamu ingin override role default user
        permission: { [resource]: [action] },
      },
    });

    return !!result?.data?.success;
  } catch (error) {
    console.error('Server permission check failed:', error);
    return false;
  }
}
