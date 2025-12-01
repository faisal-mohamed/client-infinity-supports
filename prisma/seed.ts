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
      title: 'Individual Activity Risk Assessment',
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
    },
    {
      formKey: 'multi_disciplinary_meeting',
      title: 'Multi Disciplinary Meeting',
      version: 1,
      requiresSignature: false
    },
    // Staff forms
    {
      formKey: 'employee_details',
      title: 'Employee Details',
      version: 1,
      requiresSignature: false,
    },
    {
      formKey: 'employee_welcome',
      title: 'Employee Welcome Pack',
      version: 1,
      requiresSignature: true,
    },
    {
      formKey: 'support_worker',
      title: 'Position Description',
      version: 1,
      requiresSignature: true,
    },
    {
      formKey: 'pre_employment_medical',
      title: 'Pre-Employment Medical',
      version: 1,
      requiresSignature: true,
    },
    {
      formKey: 'ndis_workforce_capability',
      title: 'NDIS Workforce Capability Framework',
      version: 1,
      requiresSignature: true,
    },
    {
      formKey: 'bullying_harassment_training',
      title: 'Bullying and Harassment Training',
      version: 1,
      requiresSignature: true,
    },
    {
      formKey: 'bullying_training',
      title: 'Bullying Training',
      version: 1,
      requiresSignature: true,
    },
    {
      formKey: 'ndis_code_of_conduct',
      title: 'NDIS Code of Conduct',
      version: 1,
      requiresSignature: true,
    },
    {
      formKey: 'fair_work_information',
      title: 'Fairwork Information Statements',
      version: 1,
      requiresSignature: false,
    },
    {
      formKey: 'orientation',
      title: 'Staff Orientation',
      version: 1,
      requiresSignature: true,
    },
    {
      formKey: 'govt_tax',
      title: 'TFN Declaration',
      version: 1,
      requiresSignature: true,
    },
    {
      formKey: 'super_choice_form',
      title: 'Superannuation Standard Choice Form',
      version: 1,
      requiresSignature: true,
    },
    {
      formKey: 'vehicle_safety_inspection',
      title: 'Vehicle Safety Inspection Checklist',
      version: 1,
      requiresSignature: true,
    },
    {
      formKey: 'conflict_of_interest',
      title: 'Conflict of Interest Disclosure Form',
      version: 1,
      requiresSignature: true,
    },
    {
      formKey: 'documentation_acknowledgement',
      title: 'Documentation Acknowledgement',
      version: 1,
      requiresSignature: true,
    }
  ];

  for (const form of forms) {
    await prisma.masterForm.upsert({
      where: { 
        formKey_version: {
          formKey: form.formKey,
          version: form.version
        }
      },
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
