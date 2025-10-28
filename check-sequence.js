// Run this script to check your FormSubmission table state
// node check-sequence.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkFormSubmissionState() {
  try {
    console.log('🔍 Checking FormSubmission table state...\n');

    // Get all FormSubmission records
    const submissions = await prisma.formSubmission.findMany({
      orderBy: { id: 'asc' },
      select: {
        id: true,
        clientId: true,
        formId: true,
        isSubmitted: true,
        createdAt: true
      }
    });

    console.log('📊 Current FormSubmission records:');
    console.log('ID\tClient\tForm\tSubmitted\tCreated');
    console.log('---\t------\t----\t---------\t-------');
    
    submissions.forEach(sub => {
      console.log(`${sub.id}\t${sub.clientId}\t${sub.formId}\t${sub.isSubmitted}\t${sub.createdAt.toISOString().split('T')[0]}`);
    });

    console.log(`\n📈 Statistics:`);
    console.log(`Total records: ${submissions.length}`);
    
    if (submissions.length > 0) {
      const minId = Math.min(...submissions.map(s => s.id));
      const maxId = Math.max(...submissions.map(s => s.id));
      const expectedCount = maxId - minId + 1;
      const actualCount = submissions.length;
      const missingCount = expectedCount - actualCount;
      
      console.log(`ID range: ${minId} - ${maxId}`);
      console.log(`Expected sequential count: ${expectedCount}`);
      console.log(`Actual count: ${actualCount}`);
      console.log(`Missing/skipped IDs: ${missingCount}`);
      
      // Find gaps
      const ids = submissions.map(s => s.id).sort((a, b) => a - b);
      const gaps = [];
      for (let i = minId; i <= maxId; i++) {
        if (!ids.includes(i)) {
          gaps.push(i);
        }
      }
      
      if (gaps.length > 0) {
        console.log(`\n🕳️  Missing ID numbers: ${gaps.join(', ')}`);
      }
    }

    // Check sequence current value (PostgreSQL specific)
    const result = await prisma.$queryRaw`
      SELECT currval(pg_get_serial_sequence('"FormSubmission"', 'id')) as current_sequence;
    `;
    
    console.log(`\n🔢 Current sequence value: ${result[0]?.current_sequence || 'Not available'}`);

  } catch (error) {
    console.error('❌ Error checking FormSubmission state:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkFormSubmissionState();
