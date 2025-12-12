/* eslint-disable @typescript-eslint/no-explicit-any */
// types/organization.ts
export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  metadata?: Record<string, any>;
}

export interface CreateOrganizationInput {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  metadata?: Record<string, any>;
}

export interface UpdateOrganizationInput
  extends Partial<CreateOrganizationInput> {
  id: string;
}

export interface OrganizationListResponse {
  data: Organization[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrganizationFilters {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
