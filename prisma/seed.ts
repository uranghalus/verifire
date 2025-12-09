import prisma from '../lib/prisma';
import { auth } from '../lib/auth';
import { faker } from '@faker-js/faker';
import { createId } from '@paralleldrive/cuid2';
// ===================================================
// 1) SEED SUPER ADMIN (Better Auth + Prisma)
// ===================================================
async function seedAdmin() {
  const email = 'admin@example.com';
  const password = 'Admin123!';
  const name = 'Super Admin';
  const role = 'admin';

  // Cek apakah user sudah ada
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    console.log('✅ Admin sudah ada:', existing.email);
    return;
  }

  // Buat user lewat Better Auth API
  const result = await auth.api.createUser({
    body: { email, password, name, role },
  });

  console.log('🎉 Admin berhasil dibuat lewat Better Auth API!');
  console.log('Email:', result.user.email);
  console.log('Password:', password);
}

// ===================================================
// 2) SEED DUMMY ORGANIZATIONS (PRISMA)
// ===================================================
export async function seedOrganizations() {
  const organizations = Array.from({ length: 10 }).map((_, i) => {
    const name = faker.company.name();
    const slug = faker.helpers.slugify(name.toLowerCase());

    return {
      id: createId(),
      name,
      slug: `${slug}-${i}`, // pastikan unik
      logo: faker.image.dataUri({ width: 200, height: 200 }),
      metadata: JSON.stringify({ seed: true, index: i }),
      createdAt: new Date(),
    };
  });

  await prisma.organization.createMany({
    data: organizations,
    skipDuplicates: true,
  });

  console.log('🎉 Dummy organizations berhasil dibuat!');
}

// ===================================================
// MAIN SEEDER
// ===================================================
async function main() {
  // await seedAdmin();
  await seedOrganizations();

  await prisma.$disconnect();
}

// Jalankan seeder
main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
