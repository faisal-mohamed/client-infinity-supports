const { PrismaClient } = require('@prisma/client');

async function fixDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Checking and fixing Admin table schema...');
    
    // Execute the SQL to add missing columns if they don't exist
    await prisma.$executeRaw`
      DO $$ 
      BEGIN
          -- Check if resetToken column exists, if not add it
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'Admin' AND column_name = 'resetToken'
          ) THEN
              ALTER TABLE "Admin" ADD COLUMN "resetToken" TEXT;
              RAISE NOTICE 'Added resetToken column to Admin table';
          ELSE
              RAISE NOTICE 'resetToken column already exists';
          END IF;
          
          -- Check if resetTokenExpiry column exists, if not add it
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'Admin' AND column_name = 'resetTokenExpiry'
          ) THEN
              ALTER TABLE "Admin" ADD COLUMN "resetTokenExpiry" TIMESTAMP(3);
              RAISE NOTICE 'Added resetTokenExpiry column to Admin table';
          ELSE
              RAISE NOTICE 'resetTokenExpiry column already exists';
          END IF;
      END $$;
    `;
    
    console.log('Database schema fixed successfully!');
    
    // Test the fix by trying to query an admin
    const adminCount = await prisma.admin.count();
    console.log(`Admin table is working correctly. Found ${adminCount} admins.`);
    
  } catch (error) {
    console.error('Error fixing database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixDatabase();
