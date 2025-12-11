// data/schema.ts
import { z } from 'zod';

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(3, 'Nama minimal 3 karakter')
    .max(100, 'Nama maksimal 100 karakter'),
  slug: z
    .string()
    .min(3, 'Slug minimal 3 karakter')
    .max(50, 'Slug maksimal 50 karakter')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan strip')
    .refine((val) => !val.startsWith('-') && !val.endsWith('-'), {
      message: 'Slug tidak boleh diawali atau diakhiri dengan strip',
    })
    .refine((val) => !val.includes('--'), {
      message: 'Slug tidak boleh mengandung dua strip berurutan',
    }),
  logo: z.string().url('Logo harus berupa URL valid').optional().nullable(),
  metadata: z.any().optional().nullable(),
});

export const updateOrganizationSchema = createOrganizationSchema.partial();

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
