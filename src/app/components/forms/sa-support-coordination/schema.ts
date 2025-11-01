export type BlockType =
  | 'section_header'
  | 'paragraph'
  | 'list'
  | 'numbered_list'
  | 'checkbox'
  | 'radio'
  | 'text'
  | 'textarea'
  | 'date'
  | 'signature'
  | 'section1_table'
  | 'schedule_table'
  | 'consent_table'
  | 'signature_group'
  | 'section_with_list'
  | 'funding_table'
  | 'radio_group';

export interface SchemaBlock {
  type: BlockType;
  key?: string;
  label?: string;
  content?: string;
  items?: (string | { key: string; label: string; options?: string[] })[];
  options?: string[];
  meta?: Record<string, any>;
}

// Complete Schema for SA Support Coordination form - Based on Reference PDF
export const saSupportCoordinationSchema: SchemaBlock[] = [
  // ===== PAGE 1: Section 1 - Participant Details =====
  { type: 'section1_table', meta: { includeAllFields: true } },

  // 3 Checkboxes after Section 1
  { 
    type: 'checkbox', 
    key: 'noCopyRequested', 
    label: 'Participant may wish not to receive a copy of this agreement. In this case, they shall tick the dedicated tick box at the end of the service agreement and sign the document.' 
  },
  { 
    type: 'checkbox', 
    key: 'planAttached', 
    label: "A copy of the Individual's plan is attached to this Service Agreement." 
  },
  { 
    type: 'checkbox', 
    key: 'planNotAttached', 
    label: "Individual chooses not to attach their plan." 
  },

  // Agreement intro paragraph
  {
    type: 'paragraph',
    content: "The Parties agree that this Service Agreement is made in line with the funding body which provides the Individual's funding, which aims to:"
  },

  // ===== PAGE 2: Schedule of Support =====
  {
    type: 'numbered_list',
    items: [
      'Support the independence and social and economic participation of people with disability and enable people with a disability to exercise choice and control in the pursuit of their goals and the planning and delivery of their supports.'
    ]
  },

  // Schedule Table
  { 
    type: 'schedule_table',
    meta: { 
      title: 'SCHEDULE OF SUPPORT',
      categories: [
        '07_001_0106_8_3 Level 1 Support Connection',
        '07_002_0106_8_3 Level 2 Support Coordination',
        '07_101_0106_6_3 Psychosocial Recovery Coaching'
      ],
      costs: ['$74.63', '$100.14', '$98.30']
    }
  },

  // Schedule paragraphs
  {
    type: 'section_header',
    label: 'SCHEDULE OF SUPPORTS',
    meta: { underline: true }
  },
  {
    type: 'paragraph',
    content: "All figures quoted below! Should read all figures quoted above are based on NDIS. Infinity Supports WA agrees to provide the individual named in Section 1 with the following Support Coordination. The supports and their prices are set out in the Schedule of Supports below (if NDIS). All supports are as per the NDIS Price Guide and are GST inclusive (if applicable) and include the cost of providing the supports. All figures quoted below are based on NDIS pricing and the individual's NDIS plan at the time of agreement. Prices, funding totals and hours will be adjusted periodically to reflect changes to NDIS pricing and the individual's NDIS plan."
  },
  {
    type: 'paragraph',
    content: "If changes to the services or their delivery are required, the Parties agree to discuss and review this Service Agreement. The Parties agree that any changes to this Service Agreement will be in writing, signed, and dated by the Parties."
  },

  // Conflict of Interest
  {
    type: 'section_header',
    label: 'CONFLICT OF INTEREST',
    meta: { bold: true, marginTop: 12 }
  },
  { 
    type: 'textarea', 
    key: 'conflictDeclaration', 
    label: 'Conflict of Interest Declaration:',
    meta: { minHeight: 60, placeholder: 'I ________ have discussed my Support Coordination requirements...' }
  },
  
  {
    type: 'section_header',
    label: 'Conflict of Interest - Providers Considered:',
    meta: { bold: true }
  },
  { type: 'textarea', key: 'conflictOption1', label: '1.', meta: { minHeight: 80, numbered: true } },
  { type: 'textarea', key: 'conflictOption2', label: '2.', meta: { minHeight: 80, numbered: true } },
  { type: 'textarea', key: 'conflictOption3', label: '3.', meta: { minHeight: 80, numbered: true } },

  {
    type: 'paragraph',
    content: "I request that Infinity Supports WA manage my Support Coordination as well as my Service Delivery. My choice will be recorded on the Conflict-of-Interest Register."
  },

  // ===== Support Coordination Services Include =====
  {
    type: 'section_header',
    label: 'Support Coordination Services Include:',
    meta: { bold: true, marginTop: 12 }
  },
  { 
    type: 'checkbox', 
    key: 'supportCoordinationGeneral', 
    label: 'General support coordination to help you understand and implement your NDIS plan' 
  },
  { 
    type: 'checkbox', 
    key: 'providerLiaison', 
    label: 'Liaison with service providers to ensure quality service delivery' 
  },
  { 
    type: 'checkbox', 
    key: 'planReview', 
    label: 'Assistance with plan reviews and goal setting' 
  },
  { 
    type: 'checkbox', 
    key: 'crisisSupport', 
    label: 'Crisis support and problem-solving assistance' 
  },
  { 
    type: 'checkbox', 
    key: 'capacityBuilding', 
    label: 'Capacity building to help you become more independent' 
  },

  // ===== Service Delivery =====
  {
    type: 'section_header',
    label: 'Service Delivery',
    meta: { bold: true, marginTop: 12 }
  },
  {
    type: 'paragraph',
    content: 'All services will be delivered in accordance with NDIS Practice Standards and Quality Indicators. We are committed to providing safe, effective, and person-centered support coordination services that meet your individual needs and goals.'
  },

  // ===== Frequency and Duration =====
  {
    type: 'section_header',
    label: 'Frequency and Duration',
    meta: { bold: true, marginTop: 12 }
  },
  { type: 'text', key: 'frequency', label: 'Frequency of support coordination sessions:' },
  { type: 'text', key: 'duration', label: 'Expected duration of engagement:' },

  // ===== Pricing =====
  {
    type: 'section_header',
    label: 'Pricing',
    meta: { bold: true, marginTop: 12 }
  },
  {
    type: 'paragraph',
    content: 'All support coordination is charged in accordance with the current NDIS Price Guide. Prices are subject to change in line with NDIS pricing updates. We will notify you of any price changes that may affect your service agreement.'
  },

  // ===== Participant Rights and Responsibilities =====
  {
    type: 'section_header',
    label: 'Participant Rights and Responsibilities',
    meta: { bold: true, marginTop: 12 }
  },
  {
    type: 'paragraph',
    content: 'You have the right to receive services that are safe, respectful, and of high quality. You also have responsibilities including treating staff with respect, providing accurate information, and giving reasonable notice for cancellations.'
  },

  // ===== Cancellation Policy =====
  {
    type: 'section_header',
    label: 'Cancellation Policy',
    meta: { bold: true, marginTop: 12 }
  },
  {
    type: 'paragraph',
    content: 'We require at least 2 business days notice for cancellations. Cancellations made with less notice may be charged in accordance with NDIS guidelines.'
  },

  // ===== Complaints and Feedback =====
  {
    type: 'section_header',
    label: 'Complaints and Feedback',
    meta: { bold: true, marginTop: 12 }
  },
  {
    type: 'paragraph',
    content: 'We welcome feedback and take all complaints seriously. You can raise concerns with your support coordinator, our management team, or external bodies such as the NDIS Quality and Safeguards Commission.'
  },

  // ===== Privacy and Confidentiality =====
  {
    type: 'section_header',
    label: 'Privacy and Confidentiality',
    meta: { bold: true, marginTop: 12 }
  },
  {
    type: 'paragraph',
    content: 'We are committed to protecting your privacy and maintaining confidentiality of your personal information in accordance with privacy legislation and NDIS requirements. Information will only be shared with your consent or as required by law.'
  },

  // ===== PAGE 3: Funding Management =====
  { type: 'funding_table' },

  // Payment management checkboxes
  { 
    type: 'checkbox', 
    key: 'selfManaged', 
    label: "Self-managed funding" 
  },
  { 
    type: 'checkbox', 
    key: 'nomineeManaged', 
    label: "Nominee managed funding" 
  },
  { 
    type: 'checkbox', 
    key: 'ndiaManaged', 
    label: "NDIA managed funding" 
  },
  { 
    type: 'checkbox', 
    key: 'planManagerManaged', 
    label: "Plan Manager managed funding" 
  },

  // Plan Manager details
  { type: 'text', key: 'planManagerName', label: 'Plan Manager Name:' },
  { type: 'text', key: 'planManagerEmail', label: 'Email:' },

  // ===== Consent Section =====
  { type: 'consent_table' },

  // ===== Signature Section =====
  { type: 'signature_group' }
];

// Calculate estimated height for each block (for pagination)
export const calculateBlockHeight = (block: SchemaBlock): number => {
  switch (block.type) {
    case 'section1_table':
      return 500;
    case 'schedule_table':
      return 280;
    case 'consent_table':
      return 350;
    case 'funding_table':
      return 200;
    case 'signature_group':
      return 400;
    case 'section_header':
      return block.meta?.marginTop ? 40 : 25;
    case 'paragraph':
      const lines = Math.ceil((block.content?.length || 0) / 85);
      return 18 + lines * 16;
    case 'numbered_list':
    case 'list':
      const itemCount = block.items?.length || 0;
      return 20 + itemCount * 22;
    case 'checkbox':
      return 28;
    case 'text':
      return 35;
    case 'textarea':
      return block.meta?.minHeight || 60;
    case 'date':
      return 35;
    case 'radio_group':
      return 25 + (block.options?.length || 0) * 18;
    case 'section_with_list':
      return 60 + (block.items?.length || 0) * 20;
    default:
      return 30;
  }
};
