import prisma from '../lib/prisma';
import { auth } from '../lib/auth';

// kamu bisa juga import PrismaClient kalau mau cek user manual

async function main() {
  const email = 'admin@example.com';
  const password = 'Admin123!';
  const name = 'Super Admin';
  const role = 'admin';

  // 🔍 cek dulu apakah user sudah ada lewat Prisma
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    console.log('✅ Admin sudah ada:', existing.email);
    await prisma.$disconnect();
    return;
  }

  // 🚀 buat user lewat Better Auth API
  const result = await auth.api.createUser({
    body: {
      email,
      password,
      name,
      role,
    },
  });

  console.log('🎉 Admin berhasil dibuat lewat Better Auth API!');
  console.log('Email:', result.user.email);
  console.log('Password:', password);

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
