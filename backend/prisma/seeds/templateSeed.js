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
  // ═══════════════════════════════════════════════════════════════════════════
  // FOOTBALL TEMPLATES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'football-broadcast-pro',
    name: 'Football Broadcast Pro',
    configJson: {
      sport: 'football',
      category: 'broadcast',
      defaultState: {
        teamA_name: 'HOME', teamA_abbr: 'H', teamA_color: '#3b82f6', teamA_score: 0,
        teamB_name: 'AWAY', teamB_abbr: 'A', teamB_color: '#e63946', teamB_score: 0,
        match_time: '0\'', match_phase: 'LIVE',
        play_clock: 40, down_distance: '1st & 10', possession: 'A',
        competition: 'Premier League', venue: 'Old Trafford',
        events: [], eventDisplayMinutes: 1,
      },
      dashboardComponent: 'FootballBroadcastDashboard',
      overlayComponent: 'FootballBroadcastOverlay',
    }
  },
  // {
  //   id: 'football-modern-glass',
  //   name: 'Football Modern Glass',s
  //   configJson: {
  //     sport: 'football',
  //     category: 'modern',
  //     defaultState: {
  //       teamA_name: 'HOME', teamA_abbr: 'H', teamA_color: '#8b5cf6', teamA_score: 0,
  //       teamB_name: 'AWAY', teamB_abbr: 'A', teamB_color: '#06b6d4', teamB_score: 0,
  //       match_time: '0\'', match_phase: '1st Half',
  //       competition: 'Champions League', venue: 'Stadium',
  //       events: [],
  //     },
  //     dashboardComponent: 'FootballModernDashboard',
  //     overlayComponent: 'FootballModernOverlay',
  //   }
  // },
  // ═══════════════════════════════════════════════════════════════════════════
  // BASKETBALL TEMPLATES - Uncomment when frontend components are created
  // ═══════════════════════════════════════════════════════════════════════════
  /*
  {
    id: 'basketball-modern',
    name: 'Basketball Modern',
    configJson: {
      sport: 'basketball',
      category: 'modern',
      defaultState: {
        teamA_name: 'HOME', teamA_abbr: 'H', teamA_color: '#f97316', teamA_score: 0,
        teamB_name: 'AWAY', teamB_abbr: 'A', teamB_color: '#3b82f6', teamB_score: 0,
        quarter: 1, game_clock: '12:00', shot_clock: 24,
        timeouts_A: 5, timeouts_B: 5,
        teamA_fouls: 0, teamB_fouls: 0,
        possession: 'A',
        competition: 'NBA', venue: 'Madison Square Garden',
      },
      dashboardComponent: 'BasketballModernDashboard',
      overlayComponent: 'BasketballModernOverlay',
    }
  },
  */

  // ═══════════════════════════════════════════════════════════════════════════
  // TENNIS TEMPLATES - Uncomment when frontend components are created
  // ═══════════════════════════════════════════════════════════════════════════
  /*
  {
    id: 'tennis-scoreboard',
    name: 'Tennis Scoreboard',
    configJson: {
      sport: 'tennis',
      category: 'scoreboard',
      defaultState: {
        playerA_name: 'Player 1', playerA_sets: 0, playerA_games: 0, playerA_points: 0,
        playerB_name: 'Player 2', playerB_sets: 0, playerB_games: 0, playerB_points: 0,
        current_set: 1, server: 'A', surface: 'Hard Court', round: 'Final',
        set1_score: '0-0', set2_score: '', set3_score: '',
      },
      dashboardComponent: 'TennisScoreboardDashboard',
      overlayComponent: 'TennisScoreboardOverlay',
    }
  },
  */

  // ═══════════════════════════════════════════════════════════════════════════
  // CRICKET TEMPLATES - Uncomment when frontend components are created
  // ═══════════════════════════════════════════════════════════════════════════
  /*
  {
    id: 'cricket-t20',
    name: 'Cricket T20',
    configJson: {
      sport: 'cricket',
      category: 't20',
      defaultState: {
        batting_team: 'Team A', batting_score: 0, wickets: 0, overs: '0.0',
        bowling_team: 'Team B', bowling_score: 0, bowling_wickets: 0, bowling_overs: '0.0',
        innings: 1, target: null, run_rate: '0.00', required_rate: null,
        batsman1: { name: 'Batsman 1', runs: 0, balls: 0, fours: 0, sixes: 0 },
        batsman2: { name: 'Batsman 2', runs: 0, balls: 0, fours: 0, sixes: 0 },
        bowler: { name: 'Bowler', overs: '0.0', maidens: 0, runs: 0, wickets: 0 },
      },
      dashboardComponent: 'CricketT20Dashboard',
      overlayComponent: 'CricketT20Overlay',
    }
  },
  */

  // ═══════════════════════════════════════════════════════════════════════════
  // ADD NEW TEMPLATES HERE
  // Copy structure above and customize defaultState for your sport/template
  // ═══════════════════════════════════════════════════════════════════════════
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
