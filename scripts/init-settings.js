// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// const settings = [
//   // Email Settings
//   {
//     key: 'from_email',
//     value: '',
//     type: 'email',
//     category: 'email_settings',
//     label: 'From Email Address',
//     description: 'Email address used as sender for all outgoing emails',
//     isRequired: true,
//     sortOrder: 1,
//     isActive: true
//   },
//   {
//     key: 'smtp_host',
//     value: 'smtp.gmail.com',
//     type: 'text',
//     category: 'email_settings',
//     label: 'SMTP Host',
//     description: 'The SMTP server used to send emails (e.g., smtp.gmail.com)',
//     isRequired: true,
//     sortOrder: 3,
//     isActive: true
//   },
//   {
//     key: 'smtp_port',
//     value: '587',
//     type: 'number',
//     category: 'email_settings',
//     label: 'SMTP Port',
//     description: 'The port number used to connect to the SMTP server (e.g., 587 for TLS)',
//     isRequired: true,
//     sortOrder: 4,
//     isActive: true
//   },
//   {
//     key: 'smtp_password',
//     value: '',
//     type: 'password',
//     category: 'email_settings',
//     label: 'SMTP App Password',
//     description: 'App password used to authenticate with the SMTP server',
//     isRequired: true,
//     sortOrder: 5,
//     isActive: true
//   },
//   {
//     key: 'admin_email',
//     value: '',
//     type: 'email',
//     category: 'email_settings',
//     label: 'Admin Notification Email',
//     description: 'Email address where system alerts or notifications will be sent',
//     isRequired: true,
//     sortOrder: 6,
//     isActive: true
//   },

//   // Form Metadata
//   {
//     key: 'company_website',
//     value: '',
//     type: 'url',
//     category: 'form_metadata',
//     label: 'Company Website',
//     description: 'Company website URL that appears on forms',
//     isRequired: true,
//     sortOrder: 1,
//     isActive: true
//   },
//   {
//     key: 'review_date',
//     value: new Date().toISOString().split('T')[0],
//     type: 'date',
//     category: 'form_metadata',
//     label: 'Review Date',
//     description: 'Default review date for forms',
//     isRequired: true,
//     sortOrder: 2,
//     isActive: true
//   },

//   // Form IDs
//   {
//     key: 'client_intake_form_id',
//     value: 'CIF-001',
//     type: 'text',
//     category: 'form_ids',
//     label: 'Client Intake Form ID',
//     description: 'Unique identifier for client intake forms',
//     isRequired: true,
//     sortOrder: 1,
//     isActive: true
//   },
//   {
//     key: 'home_visit_form_id',
//     value: 'CF012',
//     type: 'text',
//     category: 'form_ids',
//     label: 'Home Visit Risk Assessment ID',
//     description: 'Unique identifier for home visit risk assessment forms',
//     isRequired: true,
//     sortOrder: 2,
//     isActive: true
//   },
//   {
//     key: 'person_centre_plan_form_id',
//     value: 'CF014',
//     type: 'text',
//     category: 'form_ids',
//     label: 'Person Centre Plan ID',
//     description: 'Unique identifier for person centre plan forms',
//     isRequired: true,
//     sortOrder: 2,
//     isActive: true
//   },
//   {
//     key: 'sa_delivery_of_supports',
//     value: 'CF008A',
//     type: 'text',
//     category: 'form_ids',
//     label: 'SA Delivery of Supports ID',
//     description: 'Unique identifier for SA Delivery of Supports forms',
//     isRequired: true,
//     sortOrder: 2,
//     isActive: true
//   },
//   {
//     key: 'participant_risk_assessment',
//     value: 'CF0080',
//     type: 'text',
//     category: 'form_ids',
//     label: 'Participant Risk Assessment ID',
//     description: 'Unique identifier for Participant Risk Assessment forms',
//     isRequired: true,
//     sortOrder: 2,
//     isActive: true
//   },
//     {
//     key: 'emergency_drill',
//     value: 'CF0000',
//     type: 'text',
//     category: 'form_ids',
//     label: 'Emergency Drill ID',
//     description: 'Unique identifier for Emergency Drill forms',
//     isRequired: true,
//     sortOrder: 2,
//     isActive: true
//   },
//   {
//     key: 'individual_risk_assessment',
//     value: 'CF0000',
//     type: 'text',
//     category: 'form_ids',
//     label: 'Individual Risk Assessment ID',
//     description: 'Unique identifier for Individual Risk Assessment forms',
//     isRequired: true,
//     sortOrder: 2,
//     isActive: true
//   },
//   {
//     key: 'welcome_form',
//     value: 'CF0000',
//     type: 'text',
//     category: 'form_ids',
//     label: 'Welcome Form ID',
//     description: 'Unique identifier for Welcome form',
//     isRequired: true,
//     sortOrder: 2,
//     isActive: true
//   },

//    {
//     key: 'multi_disciplinary_meeting',
//     value: 'CF0000',
//     type: 'text',
//     category: 'form_ids',
//     label: 'Multi Disciplinary Meeting ID',
//     description: 'Unique identifier for Multi Disciplinary Meeting form',
//     isRequired: true,
//     sortOrder: 2,
//     isActive: true
//   },
//    {
//     key: 'support_action_plan',
//     value: 'CF0000',
//     type: 'text',
//     category: 'form_ids',
//     label: 'Support Co-ordination Action Plan ID',
//     description: 'Unique identifier for Support Co-ordination Action Plan form',
//     isRequired: true,
//     sortOrder: 2,
//     isActive: true
//   },
//   {
//     key: 'schedule_of_supports',
//     value: 'CF0000',
//     type: 'text',
//     category: 'form_ids',
//     label: 'Schedule of Supports Form ID',
//     description: 'Unique identifier for Schedule of Supports form',
//     isRequired: true,
//     sortOrder: 2,
//     isActive: true
//   },
// ];

// async function initSettings() {
//   console.log('Initializing settings...');

//   let created = 0;
//   let updated = 0;

//   for (const setting of settings) {
//     try {
//       const existing = await prisma.appSettings.findUnique({
//         where: { key: setting.key }
//       });

//       if (existing) {
//         await prisma.appSettings.update({
//           where: { key: setting.key },
//           data: {
//             label: setting.label,
//             description: setting.description,
//             type: setting.type,
//             category: setting.category,
//             isRequired: setting.isRequired,
//             sortOrder: setting.sortOrder,
//             isActive: setting.isActive
//           }
//         });
//         console.log(`Updated: ${setting.key}`);
//         updated++;
//       } else {
//         await prisma.appSettings.create({
//           data: setting
//         });
//         console.log(`Created: ${setting.key}`);
//         created++;
//       }
//     } catch (error) {
//       console.error(`Error with ${setting.key}:`, error.message);
//     }
//   }

//   console.log(`\nDone! Created: ${created}, Updated: ${updated}`);
//   await prisma.$disconnect();
// }

// initSettings();



const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const settings = [
  // Email Settings
  {
    key: 'from_email',
    type: 'email',
    category: 'email_settings',
    label: 'From Email Address',
    description: 'Email address used as sender for all outgoing emails',
    isRequired: true,
    sortOrder: 1,
  },
  {
    key: 'smtp_host',
    type: 'text',
    category: 'email_settings',
    label: 'SMTP Host',
    description: 'The SMTP server used to send emails (e.g., smtp.gmail.com)',
    isRequired: true,
    sortOrder: 2,
  },
  {
    key: 'smtp_port',
    type: 'number',
    category: 'email_settings',
    label: 'SMTP Port',
    description: 'The port number used to connect to the SMTP server (e.g., 587 for TLS)',
    isRequired: true,
    sortOrder: 3,
  },
  {
    key: 'smtp_password',
    type: 'password',
    category: 'email_settings',
    label: 'SMTP App Password',
    description: 'App password used to authenticate with the SMTP server',
    isRequired: true,
    sortOrder: 4,
  },
  {
    key: 'admin_email',
    type: 'email',
    category: 'email_settings',
    label: 'Admin Notification Email',
    description: 'Email address where system alerts or notifications will be sent',
    isRequired: true,
    sortOrder: 5,
  },

  // Form Metadata
  {
    key: 'company_website',
    type: 'url',
    category: 'form_metadata',
    label: 'Company Website',
    description: 'Company website URL that appears on forms',
    isRequired: true,
    sortOrder: 1,
  },
  {
    key: 'review_date',
    type: 'date',
    category: 'form_metadata',
    label: 'Review Date',
    description: 'Default review date for forms',
    isRequired: true,
    sortOrder: 2,
  },

  // Form IDs
  {
    key: 'client_intake_form_id',
    type: 'text',
    category: 'form_ids',
    label: 'Client Intake Form ID',
    description: 'Unique identifier for client intake forms',
    isRequired: true,
    sortOrder: 1,
  },
  {
    key: 'home_visit_form_id',
    type: 'text',
    category: 'form_ids',
    label: 'Home Visit Risk Assessment ID',
    description: 'Unique identifier for home visit risk assessment forms',
    isRequired: true,
    sortOrder: 2,
  },
  {
    key: 'person_centre_plan_form_id',
    type: 'text',
    category: 'form_ids',
    label: 'Person Centre Plan ID',
    description: 'Unique identifier for person centre plan forms',
    isRequired: true,
    sortOrder: 3,
  },
  {
    key: 'sa_delivery_of_supports',
    type: 'text',
    category: 'form_ids',
    label: 'SA Delivery of Supports ID',
    description: 'Unique identifier for SA Delivery of Supports forms',
    isRequired: true,
    sortOrder: 4,
  },
  {
    key: 'participant_risk_assessment',
    type: 'text',
    category: 'form_ids',
    label: 'Participant Risk Assessment ID',
    description: 'Unique identifier for Participant Risk Assessment forms',
    isRequired: true,
    sortOrder: 5,
  },
  {
    key: 'emergency_drill',
    type: 'text',
    category: 'form_ids',
    label: 'Emergency Drill ID',
    description: 'Unique identifier for Emergency Drill forms',
    isRequired: true,
    sortOrder: 6,
  },
  {
    key: 'individual_risk_assessment',
    type: 'text',
    category: 'form_ids',
    label: 'Individual Risk Assessment ID',
    description: 'Unique identifier for Individual Risk Assessment forms',
    isRequired: true,
    sortOrder: 7,
  },
  {
    key: 'welcome_form',
    type: 'text',
    category: 'form_ids',
    label: 'Welcome Form ID',
    description: 'Unique identifier for Welcome form',
    isRequired: true,
    sortOrder: 8,
  },
  {
    key: 'multi_disciplinary_meeting',
    type: 'text',
    category: 'form_ids',
    label: 'Multi Disciplinary Meeting ID',
    description: 'Unique identifier for Multi Disciplinary Meeting form',
    isRequired: true,
    sortOrder: 9,
  },
  {
    key: 'support_action_plan',
    type: 'text',
    category: 'form_ids',
    label: 'Support Co-ordination Action Plan ID',
    description: 'Unique identifier for Support Co-ordination Action Plan form',
    isRequired: true,
    sortOrder: 10,
  },
  {
    key: 'schedule_of_supports',
    type: 'text',
    category: 'form_ids',
    label: 'Schedule of Supports Form ID',
    description: 'Unique identifier for Schedule of Supports form',
    isRequired: true,
    sortOrder: 11,
  },
];

async function initGlobalSettingKeysOnly() {
  console.log(`🔧 Creating global setting keys only (no values)...\n`);

  let created = 0;
  let updated = 0;

  for (const setting of settings) {
    try {
      const existing = await prisma.appSettings.findUnique({
        where: {
          key_adminId: {
            key: setting.key,
            adminId: 1,
          },
        },
      });

      if (existing) {
        await prisma.appSettings.update({
          where: {
            key_adminId: {
              key: setting.key,
              adminId: null,
            },
          },
          data: {
            label: setting.label,
            description: setting.description,
            type: setting.type,
            category: setting.category,
            isRequired: setting.isRequired,
            sortOrder: setting.sortOrder,
            isActive: true,
            updatedAt: new Date(),
          },
        });
        console.log(`🔁 Updated key: ${setting.key}`);
        updated++;
      } else {
        await prisma.appSettings.create({
          data: {
            ...setting,
            value: null,
            defaultValue: null,
            adminId: null,
            isActive: true,
          },
        });
        console.log(`✅ Created key: ${setting.key}`);
        created++;
      }
    } catch (error) {
      console.error(`❌ Error with ${setting.key}:`, error.message);
    }
  }

  console.log(`\n🎉 Done! Created: ${created}, Updated: ${updated}`);
  await prisma.$disconnect();
}

initGlobalSettingKeysOnly();
