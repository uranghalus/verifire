export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  createdAt: Date | string;
  metadata?: string | null;
  memberCount?: number;
  members?: Member[];
  invitations?: Invitation[];
}

export interface Member {
  id: string;
  organizationId: string;
  organization: Organization;
  userId: string;
  user: User;
  role: string;
  createdAt: Date | string;
}

export interface Invitation {
  id: string;
  organizationId: string;
  organization: Organization;
  email: string;
  role?: string | null;
  status: string;
  expiresAt: Date | string;
  inviterId: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name?: string | null;
  // tambahkan field lain sesuai kebutuhan
}
