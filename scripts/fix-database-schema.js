#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

async function fixDatabaseSchema() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔧 Fixing database schema...');
    
    // Add missing Admin columns
    await prisma.$executeRaw`
      DO $$ 
      BEGIN
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'Admin' AND column_name = 'resetToken'
          ) THEN
              ALTER TABLE "Admin" ADD COLUMN "resetToken" TEXT;
              RAISE NOTICE '✅ Added resetToken column to Admin table';
          END IF;
          
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'Admin' AND column_name = 'resetTokenExpiry'
          ) THEN
              ALTER TABLE "Admin" ADD COLUMN "resetTokenExpiry" TIMESTAMP(3);
              RAISE NOTICE '✅ Added resetTokenExpiry column to Admin table';
          END IF;
      END $$;
    `;
    
    await prisma.$disconnect();
    
    console.log('🔄 Regenerating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    console.log('🎉 Database schema fixed and Prisma client regenerated!');
    console.log('Please restart your Next.js development server.');
    
  } catch (error) {
    console.error('❌ Error fixing database schema:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  fixDatabaseSchema();
}

module.exports = { fixDatabaseSchema };
