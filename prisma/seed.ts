import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 🔐 Seed Admin
  const email = "faisal@admin.com";
  const password = "admin123";
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {},
    create: {
      name: "Admin",
      email,
      passwordHash: hashedPassword,
    },
  });

  console.log("✅ Seeded admin:", admin.email);

  // 📝 Seed Master Forms
    const forms = [
    {
      formKey: 'client_intake_form',
      title: 'Client Intake Form',
      version: 1,
      requiresSignature: false,
    },
    {
      formKey: 'home_visit_risk_assessment',
      title: 'Home & Visit Risk Assessment',
      version: 1,
      requiresSignature: true,
    },
  ];

  for (const form of forms) {
    await prisma.masterForm.upsert({
      where: { formKey: form.formKey },
      update: form,
      create: form,
    });
    console.log(`✅ Seeded form: ${form.formKey}`);
  }

}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
