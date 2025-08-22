export const positionDescriptionSchema = {
  schemaVersion: 1,
  formKey: 'positionDescription',
  title: 'Position Description Form',
  layout: { columns: 2 },
  sections: [] as any[],
};

// sections populated from user provided JSON
positionDescriptionSchema.sections = [
  {
    id: 'positionInfo', title: 'Position Description', columns: 2,
    fields: [
      { key: 'positionTitle', label: 'Position Title', type: 'text', value: 'Support Worker', readOnly: true },
      { key: 'businessUnit', label: 'Business Unit', type: 'text' },
      { key: 'reportsTo', label: 'Reports To', type: 'text' },
      { key: 'purpose', label: 'Purpose', type: 'textarea', columns: 2 },
    ]
  },
  {
    id: 'workplaceResponsibilities', title: 'Responsibilities and Accountabilities - for the Workplace', columns: 2,
    fields: [
      { key: 'workplaceResponsibilities', label: 'Workplace Responsibilities', type: 'readonly', columns: 2, 
        content: [
          'Follow company policies including Code of Conduct, Anti-Discrimination, Harassment/Victimisation policies.',
          'Adhere to Workplace Health and Safety.',
          'Ensure all Company Standard Operating Procedures are adhered too.',
          'Display a positive attitude and be an active, dependable member of the team.',
          'Lead by example in everything you do.',
          'Support and treat others with respect.',
          'Always provide constructive feedback in a way that does not blame.',
          'Be accountable for your actions and results.',
          'Be consistent and speak the truth.'
        ]
      }
    ]
  },
  {
    id: 'positionResponsibilities', title: 'Responsibilities and Accountabilities - for the Position', columns: 2,
    fields: [
      { key: 'positionResponsibilities', label: 'Position Responsibilities', type: 'readonly', columns: 2,
        content: [
          'The specific duties that you will undertake as a Support Worker will be set and agreed by the person you support or their family.',
          'You are invited to reach out to people seeking support where the job description appeals to you.',
          'Further verbal and/or written instructions will be provided by the person seeking support or their family.',
          'As a rule, Infinity Supports WA requires Support Workers to perform all tasks within specific guidelines.'
        ]
      }
    ]
  },
  {
    id: 'generalGuidelines', title: 'General Guidelines', columns: 2,
    fields: [
      { key: 'generalGuidelines', label: 'General Guidelines', type: 'readonly', columns: 2,
        content: [
          'At all times, work under general guidance from the person seeking support or their family.',
          'You are responsible for managing your time, and for planning and organising activities on support.',
          'You may be asked to work with limited supervision.',
          'Perform activities requiring sound judgment, initiative, confidentiality, and sensitivity.',
          'Follow all Infinity Supports WA guidelines regarding incident reporting, mandatory reporting, providing feedback and flagging risks.'
        ]
      }
    ]
  },
  {
    id: 'specificSupportAreas', title: 'Specific Support Areas', columns: 2,
    fields: [
      { key: 'specificSupportAreas', label: 'Specific Support Areas', type: 'readonly', columns: 2,
        content: [
          'Support Worker provides one on one support to client in their home or in a community setting.',
          'Provide support to a client to meet emotional and psychological needs.',
          'Provide care support which is responsive to the client\'s individual needs.',
          'Support Worker is required to conduct all manual handling tasks when required.',
          'Always maintain the dignity and respect of the client.',
          'Always maintain the rights of the clients during service provision.',
          'Incident reporting as identified.',
          'The Support Worker ensures the clients safety and supervision during service provision.',
          'Individualised care plan and documentation provides strategies to engage and communicate effectively.',
          'Support Worker is required to maintain regular communication with the Service Delivery Manager.',
          'Maintain Workplace Health and Safety by adhering to the client\'s care plan.',
          'Identification and reporting of hazards - environmental, mechanical, and other potential hazards.',
          'Use of PPE as identified on care plan and when extraordinary event occurs.',
          'Comply with all policies and procedures relevant to performing tasks within a client\'s home.',
          'Required to perform and complete other duties as required keeping within a support workers scope of practice.'
        ]
      }
    ]
  },
  {
    id: 'workplaceHealthSafety', title: 'Workplace Health & Safety', columns: 2,
    fields: [
      { key: 'workplaceHealthSafety', label: 'Workplace Health & Safety', type: 'readonly', columns: 2,
        content: [
          'Conduct own work and ensure direct reports work in a safe manner.',
          'Identify and raise hazards and WHS issues on an on-going basis.',
          'Adhere to all safe working procedures in accordance with instructions/operating procedures.',
          'WHS issues are identified and addressed in a timely manner.',
          'Take reasonable care of yourself and others who may be affected by your actions.',
          'Abide by all Company Policies.',
          'Where appropriate PPE as required.',
          'Follow all Safety Instructions from your manager or the business.'
        ]
      }
    ]
  },
  {
    id: 'qualityEnvironmental', title: 'Quality & Environmental Aspects', columns: 2,
    fields: [
      { key: 'qualityEnvironmental', label: 'Quality & Environmental Aspects', type: 'readonly', columns: 2,
        content: [
          'Understand customer expectations from service and products.',
          'Maintain company quality standards.',
          'Follow company quality control processes.',
          'Report any customer complaints with management.',
          'Recycle and use appropriate waste storage bins.',
          'Minimise paper and electricity use where it is possible and practical.',
          'Report ideas and opportunities to your manager.'
        ]
      }
    ]
  },
  {
    id: 'experienceQualifications', title: 'Experience, Qualifications and Skills', columns: 2,
    fields: [
      { key: 'experienceQualifications', label: 'Experience, Qualifications and Skills', type: 'readonly', columns: 2,
        content: [
          'Maintain current Australian driver\'s license.',
          'A current first aid and CPR certification',
          'Medication Competency (Desirable)',
          'Manual Handling Training (Desirable)',
          'NDIS workers screening',
          'Working with children check',
          'Australian citizenship or visa with legal right to work in Australia.',
          'Car with current registration and comprehensive insurance',
          'NDIS Online Trainings: worker orientation module, worker induction modules, supporting effective communication training, supporting safe and enjoyable meal training.',
          'Safe waste management training',
          'Infection control training',
          'COVID Vaccination including third/booster dose.',
          'Behaviour support training',
          'Seizure training'
        ]
      }
    ]
  },
  {
    id: 'keyRequirements', title: 'Key Requirements & Attributes', columns: 2,
    fields: [
      { key: 'keyRequirements', label: 'Key Requirements & Attributes', type: 'readonly', columns: 2,
        content: [
          'Ability to adapt to different environments and cultures, demonstrating flexibility and a passion for providing a high level of care to the client.',
          'Understanding of services offered and systems to follow.',
          'Ability to make sound decisions under pressure and de-escalate crises.',
          'Excellent interpersonal and listening skills with evidence of empathy, tact and patience towards others.',
          'Critical thinking and complex problem-solving skills',
          'Emerging knowledge of the local area and its health services and other community services.'
        ]
      }
    ]
  },
  {
    id: 'employeeAcknowledgement', title: 'Employee Acknowledgement', columns: 2,
    fields: [
      { key: 'employeeName', label: 'Name', type: 'text', required: true },
      { key: 'employeeSignatureDate', label: 'Date', type: 'date', format: 'YYYY-MM-DD', required: true },
      { key: 'employeeSignature', label: 'Signature', type: 'signature', required: true, columns: 2 },
    ]
  },
];
