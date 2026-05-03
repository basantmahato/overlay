const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function removeAllTemplates() {
  console.log('🗑️  Removing all templates...\n');

  try {
    // Get count before deletion
    const countBefore = await prisma.template.count();
    console.log(`Found ${countBefore} template(s) to remove`);

    if (countBefore === 0) {
      console.log('No templates found. Nothing to remove.');
      return;
    }

    // Delete all templates
    // Note: This will fail if templates are linked to overlays (foreign key constraint)
    // In that case, we need to handle it differently
    const result = await prisma.template.deleteMany({});
    
    console.log(`\n✅ Removed ${result.count} template(s)`);
    console.log('\n📋 All templates have been deleted from the database.');

  } catch (error) {
    if (error.code === 'P2003') {
      // Foreign key constraint failed - templates are linked to overlays
      console.error('\n❌ Cannot delete templates: Some templates are linked to overlays.');
      console.log('\nOptions:');
      console.log('1. Delete overlays first: npx prisma overlay.deleteMany()');
      console.log('2. Or use cleanup:templates to delete specific unused templates');
      console.log('3. Or set isActive=false instead of deleting');
      
      // Alternative: deactivate all instead
      console.log('\n🔄 Deactivating all templates instead...');
      await prisma.template.updateMany({
        data: { isActive: false }
      });
      console.log('✅ All templates deactivated (isActive=false)');
    } else {
      console.error('\n❌ Error removing templates:', error.message);
      process.exit(1);
    }
  }
}

async function main() {
  // Confirm with user
  console.log('⚠️  WARNING: This will remove ALL templates from the database!');
  console.log('If templates are linked to overlays, they will be deactivated instead.\n');
  
  await removeAllTemplates();
}

main()
  .catch((e) => {
    console.error('❌ Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
