const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const settings = [
  // Email Settings
  {
    key: 'from_email',
    value: '',
    type: 'email',
    category: 'email_settings',
    label: 'From Email Address',
    description: 'Email address used as sender for all outgoing emails',
    isRequired: true,
    sortOrder: 1,
    isActive: true
  },
  {
    key: 'email_app_id',
    value: '',
    type: 'password',
    category: 'email_settings',
    label: 'Email Service App ID',
    description: 'Secret App ID or API key for email service integration',
    isRequired: true,
    sortOrder: 2,
    isActive: true
  },
  {
    key: 'smtp_host',
    value: 'smtp.gmail.com',
    type: 'text',
    category: 'email_settings',
    label: 'SMTP Host',
    description: 'The SMTP server used to send emails (e.g., smtp.gmail.com)',
    isRequired: true,
    sortOrder: 3,
    isActive: true
  },
  {
    key: 'smtp_port',
    value: '587',
    type: 'number',
    category: 'email_settings',
    label: 'SMTP Port',
    description: 'The port number used to connect to the SMTP server (e.g., 587 for TLS)',
    isRequired: true,
    sortOrder: 4,
    isActive: true
  },
  {
    key: 'smtp_password',
    value: '',
    type: 'password',
    category: 'email_settings',
    label: 'SMTP App Password',
    description: 'App password used to authenticate with the SMTP server',
    isRequired: true,
    sortOrder: 5,
    isActive: true
  },
  {
    key: 'admin_email',
    value: '',
    type: 'email',
    category: 'email_settings',
    label: 'Admin Notification Email',
    description: 'Email address where system alerts or notifications will be sent',
    isRequired: true,
    sortOrder: 6,
    isActive: true
  },

  // Form Metadata
  {
    key: 'company_website',
    value: '',
    type: 'url',
    category: 'form_metadata',
    label: 'Company Website',
    description: 'Company website URL that appears on forms',
    isRequired: true,
    sortOrder: 1,
    isActive: true
  },
  {
    key: 'review_date',
    value: new Date().toISOString().split('T')[0],
    type: 'date',
    category: 'form_metadata',
    label: 'Review Date',
    description: 'Default review date for forms',
    isRequired: true,
    sortOrder: 2,
    isActive: true
  },

  // Form IDs
  {
    key: 'client_intake_form_id',
    value: 'CIF-001',
    type: 'text',
    category: 'form_ids',
    label: 'Client Intake Form ID',
    description: 'Unique identifier for client intake forms',
    isRequired: true,
    sortOrder: 1,
    isActive: true
  },
  {
    key: 'home_visit_form_id',
    value: 'CF012',
    type: 'text',
    category: 'form_ids',
    label: 'Home Visit Risk Assessment ID',
    description: 'Unique identifier for home visit risk assessment forms',
    isRequired: true,
    sortOrder: 2,
    isActive: true
  },
  {
    key: 'person_centre_plan_form_id',
    value: 'CF014',
    type: 'text',
    category: 'form_ids',
    label: 'Person Centre Plan ID',
    description: 'Unique identifier for person centre plan forms',
    isRequired: true,
    sortOrder: 2,
    isActive: true
  },
  {
    key: 'sa_delivery_of_supports',
    value: 'CF008A',
    type: 'text',
    category: 'form_ids',
    label: 'SA Delivery of Supports ID',
    description: 'Unique identifier for SA Delivery of Supports forms',
    isRequired: true,
    sortOrder: 2,
    isActive: true
  },
  {
    key: 'participant_risk_assessment',
    value: 'CF0080',
    type: 'text',
    category: 'form_ids',
    label: 'Participant Risk Assessment ID',
    description: 'Unique identifier for Participant Risk Assessment forms',
    isRequired: true,
    sortOrder: 2,
    isActive: true
  },
    {
    key: 'emergency_drill',
    value: 'CF0000',
    type: 'text',
    category: 'form_ids',
    label: 'Emergency Drill ID',
    description: 'Unique identifier for Emergency Drill forms',
    isRequired: true,
    sortOrder: 2,
    isActive: true
  },
  {
    key: 'individual_risk_assessment',
    value: 'CF0000',
    type: 'text',
    category: 'form_ids',
    label: 'Individual Risk Assessment ID',
    description: 'Unique identifier for Individual Risk Assessment forms',
    isRequired: true,
    sortOrder: 2,
    isActive: true
  }
];

async function initSettings() {
  console.log('Initializing settings...');

  let created = 0;
  let updated = 0;

  for (const setting of settings) {
    try {
      const existing = await prisma.appSettings.findUnique({
        where: { key: setting.key }
      });

      if (existing) {
        await prisma.appSettings.update({
          where: { key: setting.key },
          data: {
            label: setting.label,
            description: setting.description,
            type: setting.type,
            category: setting.category,
            isRequired: setting.isRequired,
            sortOrder: setting.sortOrder,
            isActive: setting.isActive
          }
        });
        console.log(`Updated: ${setting.key}`);
        updated++;
      } else {
        await prisma.appSettings.create({
          data: setting
        });
        console.log(`Created: ${setting.key}`);
        created++;
      }
    } catch (error) {
      console.error(`Error with ${setting.key}:`, error.message);
    }
  }

  console.log(`\nDone! Created: ${created}, Updated: ${updated}`);
  await prisma.$disconnect();
}

initSettings();
