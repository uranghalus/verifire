import { z } from 'zod';

export const createOrganizationSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  slug: z
    .string()
    .min(3, 'Slug minimal 3 karakter')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan strip'),
  logo: z.string().url().optional().nullable(),
  metadata: z.any().optional().nullable(),
});

export const updateOrganizationSchema = createOrganizationSchema.partial();
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
