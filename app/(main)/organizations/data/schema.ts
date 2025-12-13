import { z } from 'zod';

export const organizationSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
});

export type OrganizationForm = z.infer<typeof organizationSchema>;
