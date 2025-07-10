const fs = require("fs");
const path = require("path");

// List of dummy migration names you want to mark as applied
const dummyMigrations = [
  "20250710100542_added_form_lifecycle",
  "20250710104257_revert_removed_expires_at_formassignment"
];

const migrationsDir = path.join(__dirname, "prisma", "migrations");

dummyMigrations.forEach(migration => {
  const folderPath = path.join(migrationsDir, migration);
  const sqlFilePath = path.join(folderPath, "migration.sql");

  // Create the folder if it doesn't exist
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`📁 Created folder: ${folderPath}`);
  }

  // Create empty migration.sql
  fs.writeFileSync(sqlFilePath, "-- dummy migration\n");
  console.log(`📝 Created empty migration.sql in: ${migration}`);
});

console.log("✅ Dummy migration folders ready!");
