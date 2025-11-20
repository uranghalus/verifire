import 'better-auth';
declare module 'better-auth' {
  /**
   * EXTEND USER
   * ------------
   * Semua field custom dari betterAuth.user.additionalFields
   * harus didefinisikan ulang di sini agar dikenali TypeScript.
   */
  interface User {
    username?: string | null;
    role?: string | null;
    banned?: boolean;
    banReason?: string | null;
    banExpires?: Date | null;
  }

  /**
   * EXTEND SESSION.USER
   */
  interface SessionUser {
    username?: string | null;
    role?: string | null;
    banned?: boolean;
  }

  /**
   * EXTEND API LIST USERS
   * ----------------------
   * Agar auth.api.listUsers().users memiliki tipe yang benar.
   */
  type UserWithRole = User;
}
