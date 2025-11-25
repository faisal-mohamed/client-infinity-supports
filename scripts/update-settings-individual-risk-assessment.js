/**
 * MIGRATION SCRIPT: Update Individual Risk Assessment to Individual Activity Risk Assessment
 *
 * This script updates the form name in the database:
 * - MasterForm table: Updates form title
 * - AppSettings table: Updates settings label and description
 *
 * WHEN TO RUN:
 * - ✅ Already run on development database
 * - ⚠️ MUST BE RUN on production database after deployment
 *
 * HOW TO RUN:
 *   node scripts/update-settings-individual-risk-assessment.js
 *
 * NOTE: This is a one-time migration. After running, the database will be permanently updated.
 * Future forms will automatically use the new name from the seed file.
 */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function updateFormName() {
  try {
    console.log("🔄 Updating form name in database...");

    // 1. Update MasterForm table (form title)
    const formResult = await prisma.masterForm.updateMany({
      where: {
        formKey: "individual_risk_assessment",
      },
      data: {
        title: "Individual Activity Risk Assessment",
      },
    });

    console.log(
      `✅ Updated ${formResult.count} form record(s) in MasterForm table`
    );

    // 2. Update AppSettings table (settings label and description)
    const settingsResult = await prisma.appSettings.updateMany({
      where: {
        key: "individual_risk_assessment",
      },
      data: {
        label: "Individual Activity Risk Assessment ID",
        description:
          "Unique identifier for Individual Activity Risk Assessment forms",
      },
    });

    console.log(
      `✅ Updated ${settingsResult.count} setting record(s) in AppSettings table`
    );
    console.log(
      '📝 Form name changed from "Individual Risk Assessment" to "Individual Activity Risk Assessment"'
    );
  } catch (error) {
    console.error("❌ Error updating form name:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update
updateFormName()
  .then(() => {
    console.log("✨ Update completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Update failed:", error);
    process.exit(1);
  });
