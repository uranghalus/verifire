import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Hash password pakai bcrypt (Better Auth juga pakai ini)
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  // Seeder admin
  await prisma.user.upsert({
    where: { email: 'admin@appdutamall.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@appdutamall.com',
      password: adminPassword,
      role: 'SUPERADMIN',
      is_active: true,
    },
  });

  // Seeder user biasa
  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'User',
      email: 'user@example.com',
      password: userPassword,
      role: 'USER',
      is_active: true,
    },
  });

  console.log('✅ Users seeded successfully');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding users:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
