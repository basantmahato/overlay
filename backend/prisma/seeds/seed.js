const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = 'admin@example.com';
  const password = 'password123';

  // ── Seed default template ───────────────────────────────────────────────────
  const existingTemplate = await prisma.template.findFirst({
    where: { name: 'Football Scoreboard' },
  });

  if (!existingTemplate) {
    await prisma.template.create({
      data: {
        name: 'Football Scoreboard',
        configJson: {
          fields: ['teamA_name','teamA_score','teamB_name','teamB_score',
                   'match_time','match_phase','play_clock','down_distance','possession'],
          description: 'Standard American football bottom-bar overlay',
        },
        isActive: true,
      },
    });
    console.log('Seeded Template: Football Scoreboard');
  }

  // ── Seed admin user ─────────────────────────────────────────────────────────
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    console.log('User already exists, skipping user seed.');
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  });

  console.log('Seeded User:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
