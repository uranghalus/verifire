import { type LinkProps } from '@tanstack/react-router';
import 'better-auth';

export type User = {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  email: string;
  emailVerified?: boolean;
  name: string;
  image?: string | null | undefined;
  banned?: boolean | null | undefined;
  role?: string;
  banReason?: string | null | undefined;
  banExpires?: Date | null | undefined;
};

type Team = {
  name: string;
  logo: React.ElementType;
  plan: string;
};

type BaseNavItem = {
  title: string;
  badge?: string;
  icon?: React.ElementType;
};

type NavLink = BaseNavItem & {
  url: LinkProps['to'] | (string & {});
  items?: never;
};

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: LinkProps['to'] | (string & {}) })[];
  url?: never;
};

type NavItem = NavCollapsible | NavLink;

type NavGroup = {
  title: string;
  items: NavItem[];
};

type SidebarData = {
  user: User;
  teams: Team[];
  navGroups: NavGroup[];
};

export type { SidebarData, NavGroup, NavItem, NavCollapsible, NavLink };
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
