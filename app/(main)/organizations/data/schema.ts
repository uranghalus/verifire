import { z } from 'zod';

export const organizationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Minimal 2 karakter'),
  slug: z.string().min(2, 'Slug wajib diisi'),
});

export type OrganizationForm = z.infer<typeof organizationSchema>;
