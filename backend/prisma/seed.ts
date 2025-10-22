import { prisma } from '../src/config/database';
import bcrypt from 'bcryptjs';

async function main() {
  // Hash password untuk user
  const hashedPassword = await bcrypt.hash('password', 10);

  // Buat role Manager dan Kasir jika belum ada
  const managerRole = await prisma.role.upsert({
    where: { name: 'Manager' },
    update: {},
    create: { name: 'Manager' },
  });

  const kasirRole = await prisma.role.upsert({
    where: { name: 'Kasir' },
    update: {},
    create: { name: 'Kasir' },
  });

  // Buat user Manager
  const managerUser = await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: {},
    create: {
      email: 'manager@example.com',
      password: hashedPassword,
      name: 'Manager Utama',
    },
  });

  // Buat user Kasir
  const kasirUser = await prisma.user.upsert({
    where: { email: 'kasir@example.com' },
    update: {},
    create: {
      email: 'kasir@example.com',
      password: hashedPassword,
      name: 'Kasir Utama',
    },
  });

  // Hubungkan role ke user
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: managerUser.id, roleId: managerRole.id } },
    update: {},
    create: { userId: managerUser.id, roleId: managerRole.id },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: kasirUser.id, roleId: kasirRole.id } },
    update: {},
    create: { userId: kasirUser.id, roleId: kasirRole.id },
  });

  console.log('Seeder berhasil dijalankan: Manager dan Kasir telah dibuat.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });