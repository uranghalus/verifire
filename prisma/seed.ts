// prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client';
import { auth } from '../lib/auth';

const prisma = new PrismaClient();

async function createUserWithCredentials(
  email: string,
  name: string,
  password: string,
  role: Role,
  emailVerified = true
) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    console.log(`ℹ️ User ${email} already exists, skipping.`);
    return;
  }

  // Map internal roles to Better Auth expected roles
  const authRole: 'admin' | 'user' =
    role === Role.superadmin ? 'admin' : 'user';

  // Gunakan API internal Better Auth (ini bekerja di Node)
  const { user } = await auth.api.createUser({
    body: {
      email,
      password,
      name,
      role: authRole,
      data: { emailVerified, isActive: true, type: 'credentials' }, // pass emailVerified inside `data` since it's not a top-level property
    },
  });

  if (!user) {
    console.error(`❌ Gagal membuat user ${email}:`, user);
  } else {
    console.log(`✅ Created user ${user} (${authRole})`);
  }
}

async function main() {
  console.log('🌱 Seeding users via Better Auth...');

  await createUserWithCredentials(
    'admin@appdutamall.com',
    'Admin',
    'admin123',
    Role.superadmin
  );

  await createUserWithCredentials(
    'user@example.com',
    'User',
    'user123',
    Role.user
  );

  console.log('✅ Seeding complete.');
}

main()
  .catch((err) => {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
