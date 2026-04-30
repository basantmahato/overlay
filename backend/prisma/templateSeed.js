const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🚀 Seeding Broadcast Pro Template...');

  const template = await prisma.template.upsert({
    where: { id: 'broadcast-pro-football-id' }, // We can use a stable ID for seeding
    update: {
      name: 'Broadcast Pro Football',
      configJson: {
        competition: 'Premier League',
        venue: 'Old Trafford',
        homeColor: '#1a4a8a',
        awayColor: '#cc0000',
        layout: 'broadcast-pro'
      }
    },
    create: {
      id: 'broadcast-pro-football-id',
      name: 'Broadcast Pro Football',
      configJson: {
        competition: 'Premier League',
        venue: 'Old Trafford',
        homeColor: '#1a4a8a',
        awayColor: '#cc0000',
        layout: 'broadcast-pro'
      }
    }
  });

  console.log('✅ Template Seeded:', template.name);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
