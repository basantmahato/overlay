const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedUsers() {
  console.log('🚀 Seeding Test Users...\n');

  try {
    const usersData = [
      { email: 'user1@overlay.com', password: 'user123' },
      { email: 'user2@overlay.com', password: 'user123' },
    ];

    for (const userData of usersData) {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        console.log(`⚠️  User with email ${userData.email} already exists.`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const user = await prisma.user.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          role: 'USER',
        },
      });

      console.log(`✅ User created successfully: ${user.email}`);
    }
  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
    process.exit(1);
  }
}

async function main() {
  await seedUsers();
}

main()
  .catch((e) => {
    console.error('❌ Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
