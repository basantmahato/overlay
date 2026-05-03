const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE DEFINITIONS
// Add new templates here - they will be automatically seeded
// ═══════════════════════════════════════════════════════════════════════════════
const templates = [
  {
    id: 'broadcast-pro-football-id',
    name: 'Broadcast Pro Football',
    configJson: {
      sport: 'football',
      layout: 'broadcast-pro',
      features: {
        hasCompetitionField: true,
        hasVenueField: true,
        hasEventsTicker: true,
        hasEventPopup: true,
        hasMatchTimer: true,
      },
      defaults: {
        competition: 'Premier League',
        venue: 'Old Trafford',
        homeColor: '#1a4a8a',
        awayColor: '#cc0000',
        matchTime: "15:00",
        matchPhase: '1st',
      }
    }
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // ADD NEW TEMPLATES HERE
  // Copy the structure above and modify for your new template
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'basketball-pro-id',
    name: 'Basketball Pro',
    configJson: {
      sport: 'basketball',
      layout: 'basketball-pro',
      features: {
        hasQuarters: true,
        hasPeriodTime: true,
        hasPossession: true,
        hasFouls: true,
        hasTimeouts: true,
      },
      defaults: {
        homeColor: '#ff6600',
        awayColor: '#0066ff',
        period: 1,
        periodTime: '12:00',
        shotClock: 24,
      }
    }
  },
  {
    id: 'tennis-pro-id',
    name: 'Tennis Pro',
    configJson: {
      sport: 'tennis',
      layout: 'tennis-pro',
      features: {
        hasSets: true,
        hasGames: true,
        hasPoints: true,
        hasServer: true,
        hasSurface: true,
        hasRound: true,
      },
      defaults: {
        homeColor: '#22c55e',
        awayColor: '#3b82f6',
        surface: 'HARD',
        round: 'Final',
      }
    }
  },
];

async function seedTemplate(templateData) {
  const template = await prisma.template.upsert({
    where: { id: templateData.id },
    update: {
      name: templateData.name,
      configJson: templateData.configJson,
      isActive: true,
    },
    create: {
      id: templateData.id,
      name: templateData.name,
      configJson: templateData.configJson,
      isActive: true,
    }
  });
  return template;
}

async function main() {
  console.log(`🚀 Seeding ${templates.length} template(s)...\n`);

  for (const templateData of templates) {
    try {
      const template = await seedTemplate(templateData);
      console.log(`✅ ${template.name} (ID: ${template.id})`);
    } catch (error) {
      console.error(`❌ Failed to seed ${templateData.name}:`, error.message);
    }
  }

  console.log('\n🎉 Template seeding complete!');
  console.log('\n📋 Registered Templates:');
  templates.forEach(t => console.log(`   • ${t.name} → ${t.id}`));
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
