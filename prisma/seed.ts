import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createUserWithCredentials(
  email: string,
  name: string,
  password: string,
  role: Role
) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    console.log(`ℹ️ User ${email} already exists, skipping.`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role,
      is_active: true,
      accounts: {
        create: {
          type: 'credentials',
          provider: 'credentials',
          providerAccountId: email,

          // field wajib tambahan
          accountId: email, // bisa pakai email atau cuid
          providerId: 'credentials', // cocokkan dengan provider
          password: hashedPassword,

          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
  });

  console.log(`✅ Created user: ${email} (${role})`);
  return user;
}

async function main() {
  console.log('🌱 Seeding users...');

  await createUserWithCredentials(
    'admin@appdutamall.com',
    'Admin',
    'admin123',
    'SUPERADMIN'
  );

  await createUserWithCredentials(
    'user@example.com',
    'User',
    'user123',
    'USER'
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
