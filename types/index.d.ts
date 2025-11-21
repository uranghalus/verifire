import { type LinkProps } from '@tanstack/react-router';

// LINK data apar
export type Apar = {
  id: number;
  kode_apar: string;
  lantai?: string | null;
  lokasi: string;
  jenis: string;
  size: number;
  userId?: string | null;
  createdAt: string;
  updatedAt: string;
};
// LINK Data user
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
