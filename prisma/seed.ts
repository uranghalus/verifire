import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed process...');

  // Cek apakah sudah ada SUPERADMIN
  const existingSuperadmin = await prisma.user.findFirst({
    where: { role: 'SUPERADMIN' },
  });

  if (!existingSuperadmin) {
    const adminPassword = await bcrypt.hash('admin123', 10);

    await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@appdutamall.com',
        password: adminPassword,
        role: 'SUPERADMIN',
        is_active: true,
      },
    });

    console.log(
      '✅ Superadmin account created (admin@appdutamall.com / admin123)'
    );
  } else {
    console.log('ℹ️ Superadmin already exists, skipping creation.');
  }

  // Seeder user biasa
  const existingUser = await prisma.user.findUnique({
    where: { email: 'user@example.com' },
  });

  if (!existingUser) {
    const userPassword = await bcrypt.hash('user123', 10);

    await prisma.user.create({
      data: {
        name: 'User',
        email: 'user@example.com',
        password: userPassword,
        role: 'USER',
        is_active: true,
      },
    });

    console.log('✅ Regular user created (user@example.com / user123)');
  } else {
    console.log('ℹ️ Regular user already exists, skipping creation.');
  }

  console.log('🌱 Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
