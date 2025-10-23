import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 🔐 Seed Admin
  const email = "faisal@admin.com";
  // Password meets requirements: 15+ chars, uppercase, number, special char
  const password = "Faisal@admin123";
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
    {
      formKey: 'person_centred_plan',
      title: 'Person Centred Plan',
      version: 1,
      requiresSignature: false,
    },{
      formKey: 'sa_delivery_of_supports',
      title: 'SA Delivery of Supports',
      version: 1,
      requiresSignature: true,
    },
    {
      formKey: 'participant_risk_assessment',
      title: 'Participant Risk Assessment',
      version: 1,
      requiresSignature: true,
    },
    {
      formKey: 'emergency_drill',
      title: 'Emergency Drill',
      version: 1, 
      requiresSignature: true,
    },
    {
      formKey: 'individual_risk_assessment',
      title: 'Individual Risk Assessment',
      version: 1,
      requiresSignature: true,
    },
    {
      formKey: 'welcome_form',
      title: 'Welcome Form',
      version: 1,
      requiresSignature: true
    },
    {
      formKey: 'support_action_plan',
      title: 'Support Co-Ordination Action Plan',
      version: 1,
      requiresSignature: true
    },
      {
      formKey: 'schedule_of_supports',
      title: 'Schedule of Supports',
      version: 1,
      requiresSignature: true
    },
    {
      formKey: 'sa_support_coordination',
      title: 'Service Agreement Support Co-Ordination',
      version: 1,
      requiresSignature: true 
    }
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
