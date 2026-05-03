const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function listTemplates() {
  const templates = await prisma.template.findMany({
    orderBy: { createdAt: 'desc' }
  });
  
  console.log('\n=== Current Templates in Database ===');
  console.log('Total:', templates.length);
  console.log('');
  
  templates.forEach((t, i) => {
    console.log(`${i + 1}. ID: ${t.id}`);
    console.log(`   Name: ${t.name}`);
    console.log(`   Active: ${t.isActive}`);
    console.log(`   Created: ${t.createdAt.toISOString()}`);
    console.log('');
  });
  
  return templates;
}

async function deleteTemplate(id) {
  console.log(`\nDeleting template: ${id}`);
  
  const overlays = await prisma.overlay.findMany({
    where: { templateId: id }
  });
  
  if (overlays.length > 0) {
    console.log(`⚠️  WARNING: ${overlays.length} overlay(s) use this template!`);
    console.log('Overlays:', overlays.map(o => o.name).join(', '));
    console.log('Deleting overlays first...');
    
    for (const overlay of overlays) {
      await prisma.overlay.delete({ where: { id: overlay.id } });
      console.log(`  - Deleted overlay: ${overlay.name}`);
    }
  }
  
  await prisma.template.delete({ where: { id } });
  console.log('✅ Template deleted.');
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (command === 'list') {
    await listTemplates();
  } else if (command === 'delete' && args[1]) {
    await deleteTemplate(args[1]);
    await listTemplates();
  } else {
    console.log('Usage:');
    console.log('  node prisma/cleanupTemplates.js list          - List all templates');
    console.log('  node prisma/cleanupTemplates.js delete <id>   - Delete template by ID');
    console.log('');
    await listTemplates();
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
