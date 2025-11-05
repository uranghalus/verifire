import { z } from 'zod';

const userRoleSchema = z.union([
  z.literal('admin'),
  z.literal('admin'),
  z.literal('inspektor'),
  z.literal('manager'),
]);

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean().nullable(),
  image: z.string().nullable(),
  role: userRoleSchema,
  banned: z.boolean(),
  banReason: z.string().nullable(),
  banExpires: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof userSchema>;
export const userListSchema = z.array(userSchema);
