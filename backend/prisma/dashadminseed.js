const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = 'admin@overlay.io';
  const adminPassword = 'adminpassword123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  console.log('🚀 Seeding Admin User...');

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: 'ADMIN',
      password: hashedPassword
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  console.log('✅ Admin User Created/Updated:');
  console.log(`   Email: ${admin.email}`);
  console.log(`   Role: ${admin.role}`);
  console.log('   Status: READY FOR LOGIN');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
