export type BlockType =
  | 'section_header'
  | 'paragraph'
  | 'styled_paragraph'
  | 'list'
  | 'checkbox'
  | 'radio'
  | 'text'
  | 'date'
  | 'signature'
  | 'section1_table'
  | 'consent_table'
  | 'signature_group'
  | 'section_with_list'; // Section header followed by a list

export interface SchemaBlock {
  type: BlockType;
  key?: string; // for data-backed items (text/date/checkbox/radio/signature)
  label?: string; // field label or header text
  content?: string; // paragraph text
  items?: (string | { key: string; label: string; items: string[]; subItems?: string[] })[]; // list items, radio options, or consent table items
  subItems?: string[]; // sub-items (like for infoSharingConsent)
  meta?: Record<string, any>; // any renderer-specific metadata
}

// Single-flow, ordered blocks as they should appear
export const saDeliverySchema: SchemaBlock[] = [
  // Section 1 table (special renderer)
  { type: 'section1_table' },

  // Agreement intro (pulled from page_2 content)

  {
    type: 'checkbox',
    key: 'subjectToSection73G',
    label:
      'Is this participant subject to Section 73 G of the NDIS Act? (If yes please refer to the Provider responsibility section for further information)'
  },
  {
    type: 'checkbox',
    key: 'isNonVerbal',
    label:
      'Is this participant non-verbal? (If yes refer complete the mode of communication section of the participant risk assessment)'
  },
  {
    type: 'checkbox',
    key: 'noCopyRequested',
    label:
      'Participant may wish not to receive a copy of this agreement. In this case, they shall tick the dedicated tick box at the end of the service agreement and sign the document.'
  },
  { type: 'checkbox', key: 'planAttached', label: "A copy of the Individual's plan is attached to this Service Agreement." },
  { type: 'checkbox', key: 'planNotAttached', label: 'Individual chooses not to attach their plan.' },

  {
    type: 'paragraph',
    content:
      'The Parties agree that this Service Agreement is made in line with the funding body which provides the Individual\'s funding, which aims to:'
  },
  {
    type: 'list',
    items: [
      'Support the independence and social and economic participation of people with disability, and',
      'Enable people with a disability to exercise choice and control in the pursuit of their goals and the planning and delivery of their supports.'
    ]
  },

  { type: 'section_header', label: 'Schedule of Supports' },
  {
    type: 'styled_paragraph',
    content:
      '<red>Infinity Supports WA</red> agrees to provide the Individual named in Section 1 the support as per the Schedule of Supports and the duration of the support.'
  },
  {
    type: 'paragraph',
    content:
      'The supports and their prices are set out in the Schedule of Supports. All supports are as per the NDIS Price Guide and are GST inclusive (if applicable) and include the cost of providing the supports. All figures quoted below are based on NDIS pricing and the Individual\'s NDIS plan at the time of agreement. Prices, funding totals and hours will be adjusted periodically to reflect changes to NDIS pricing and the Individual\'s NDIS plan.'
  },
  {
    type: 'styled_paragraph',
    content: 'Additional agreed information in the provision of support by <red>Infinity Supports WA</red> Pty Ltd.'
  },

  // Service Payments (NDIS)
  { type: 'section_header', label: 'Service Payments (NDIS)' },
  { type: 'checkbox', key: 'selfManaged', label: 'The Individual has chosen to self-manage the funding for NDIS supports provided under this Service Agreement. After providing those supports, Infinity Supports WA will send the Individual an invoice for those supports for the Individual to pay. The Individual will pay the invoice within 7 days.' },
  { type: 'checkbox', key: 'nomineeManaged', label: "The Individual's Nominee manages the funding for supports provided under this Service Agreement. After providing those supports, Infinity Support WA will send the Individual's Nominee an invoice for those supports for the Individual's Nominee to pay. The Individual's Nominee will pay the invoice within 7 days." },
  { type: 'checkbox', key: 'ndiaManaged', label: 'The Individual has nominated the NDIA to manage the funding for supports provided under this Service Agreement. After providing those supports, Infinity Supports WA will claim payment for those supports from the NDIA.' },
  { type: 'checkbox', key: 'planManagerManaged', label: 'The Individual has nominated the Plan Management Provider to manage the funding for NDIS supports provided under this Service Agreement.' },
  { type: 'text', key: 'planManagerName', label: 'Plan Management Provider' },
  { type: 'text', key: 'fundingSource', label: 'Funding Source' },

  // GST / NDIS
  { type: 'section_header', label: 'Goods and services tax (GST) / NDIS' },
  {
    type: 'paragraph',
    content:
      "For the purposes of GST legislation, the Parties confirm that a supply of supports under this Service Agreement is a supply of one or more of the reasonable and necessary supports specified in the statement included, under subsection 33(2) of the National Disability Insurance Scheme Act 2013 (NDIS Act), in the Participant's NDIS plan currently in effect under section 37 of the NDIS Act."
  },

  // Responsibilities of Infinity Supports WA (static list)
  { 
    type: 'section_with_list', 
    label: 'Responsibilities of Infinity Supports WA',
    content: 'Infinity Support WA agrees to:',
    items: [
      'Review the provision of supports with the Individual in line with the applicable requirements.',
      "Once agreed, provide supports that meet the Individual’s needs at the Individual’s preferred times.",
      'Communicate openly and honestly in a timely manner.',
      'Treat the Individual with courtesy and respect.',
      'Consult the Individual on decisions about how supports are provided.',
      'Give the Individual information about managing any complaints or disagreements and details of Infinity Supports WA cancellation policy (if relevant).',
      "Listen to the Individual’s feedback and resolve problems in a timely manner.",
      "Where possible, give the Individual a minimum of 24 hours’ notice if Infinity Supports WA must change a scheduled appointment to provide supports.",
      "Give the Individual the required notice if Infinity Supports WA needs to end the Service Agreement (see ‘Ending this Service Agreement’ below for more information).",
      "Protect the Individual’s privacy and confidential information.",
      'Provide supports in a manner consistent with all relevant laws, including but not limited to, the National Disability Insurance Scheme Act 2013 and rules, and the Australian Consumer Law; keep accurate records on the supports provided to the Individual.'
    ]
  },

  // Responsibilities of Individual / Individual's representative (static list)
  { 
    type: 'section_with_list', 
    label: "Responsibilities of Individual / Individual's representative",
    content: 'agrees to:',
    items: [
      "Pay for additional expenses (i.e. things that are not included as part of an Individual's supports) that are not included in the cost of the supports. Examples include entrance fees, event tickets, meals, etc.",
      "If the individual requires buddy shifts to assist with the introduction of new workers, and this is the desired method by the individual or their family, Infinity Supports WA may claim for up to 6 hours of weekday support per year from the individual's plan.",
      "Inform Infinity Supports WA about how they wish the supports to be delivered to meet the Individual's needs.",
      'Treat Infinity Supports WA with courtesy and respect.',
      'Talk to Infinity Supports WA if the Individual has any concerns about the supports being provided.',
      "Give Infinity Supports WA a minimum of seven days' notice if the Individual cannot make a scheduled appointment; and if the notice is not provided by them, then Infinity Supports WA's cancellation policy will apply in line with the current NDIS Price Guide.",
      "Give Infinity Supports WA the required notice if the Individual needs to end the Service Agreement (see 'Ending this Service Agreement' below for more information).",
      "Let Infinity Supports WA know immediately if the Individual's plan/ funding is suspended or replaced by a new plan or the Individual's funding ceases.",
      'Will update Infinity Supports WA of any changes in circumstances including any changes to living arrangements including addresses, medication, behaviour, contact details or health of the individual which may affect service provision.',
      'Will supply all medication in a webster pack with a pharmacy generated signing sheet.'
    ]
  },

  // Changes and Termination
  {
    type: 'paragraph',
    content: "The Individual's plan is expected to remain in effect during the period the supports are provided and will immediately notify the Infinity Supports WA if the Individual's plan is replaced by a new plan or the Individual's funding ceases."
  },
  { 
    type: 'section_header', 
    label: 'Changes to this Schedule of Supports' 
  },
  {
    type: 'paragraph',
    content: 'If changes to the supports or their delivery are required, the Parties agree to discuss and review the Schedule of Supports. The Parties agree that any changes to the Schedule of Supports will be in writing, signed, and dated by both Parties.'
  },
  { 
    type: 'section_header', 
    label: 'Ending this Service Agreement' 
  },
  {
    type: 'paragraph',
    content: "Should either Party wishes to end this Service Agreement before the cease date they must give 2 weeks' notice in writing. If either Party seriously breaches this Service Agreement the requirement of notice will be waived."
  },
  { 
    type: 'section_header', 
    label: 'Feedback, Complaints, and Disputes' 
  },
  {
    type: 'styled_paragraph',
    content: 'If the Individual wishes to give <red>Infinity Supports WA</red> feedback or If the Individual is not happy with the provision of supports and wishes to make a complaint, the Individual can talk to Sharon Mays Director or Anand Sekar Director 0493282661.'
  },
  {
    type: 'styled_paragraph',
    content: 'Email: <link>admin@infinitysupportswa.org</link>. Alternatively, the individual can lodge their complaint or feedback on <link>www.infinitysupportswa.org</link>.'
  },
  {
    type: 'styled_paragraph',
    content: 'If the Individual is not satisfied or does not want to talk to this person, the Individual can contact the National Disability Insurance Agency by calling 1800 800 110, visiting one of their offices in person, or visiting <link>www.ndis.gov.au</link> for further information. The Individual can contact Department of Communities, Disability Services on (08) 9426 9200, or visiting one of their offices, or visit <link>www.disability.wa.gov.au</link>.'
  },

  // Emergency Preparedness (complete content)
  { type: 'section_header', label: 'Emergency Preparedness' },
  {
    type: 'paragraph',
    content: 'Infinity Supports WA, will develop a plan to respond to any unplanned event that can cause:'
  },
  {
    type: 'list',
    items: [
      'Deaths; or',
      'Significant injuries to employees or occupants; and/or',
      "Shut down the business; and/or",
      'Disruption to operations; and/or',
      'Physical or environmental damage'
    ]
  },
  {
    type: 'paragraph',
    content: 'For your peace of mind, all our support workers are trained on how to respond in case of an emergency, and they will receive a copy of your Individual Disaster Management Plan so that they are fully aware of your health condition and the required action plans in case of an emergency.'
  },
  {
    type: 'paragraph',
    content: 'Individual Disaster Management Plan and Risk Assessment will be developed and signed by Infinity Supports WA and the Individual and/or representative. Providers\' Responsibility related to participants Individual Disaster Management Plan and Risk Assessment is subject to 73G requirements.'
  },
  {
    type: 'paragraph',
    content: 'It is the provider\'s responsibility to document the assessment of the participant\'s risk factors using Intake Form, Support Plan, and Participant, Home, and Community Risk Assessment forms.'
  },
  {
    type: 'list',
    items: [
      'A copy of the Individual Disaster Management Plan and Risk Assessment will be provided to the participant and another copy should be kept in their file.',
      "The Individual Disaster Management Plan and Risk Assessment will be reviewed every year or when the participant's circumstances change. If there is any update on the Individual Disaster Management Plan and Risk Assessment, a copy of the new Individual Disaster Management Plan and Risk Assessment will be provided to the client and a copy will be kept in their folder."
    ]
  },
  {
    type: 'list',
    items: [
      'It is the provider\'s responsibility to mention the rights and responsibilities of the participant and the provider on the service agreement.',
      'Using the Human Resource Management process will assist the provider to ensure that the participant\'s support worker has been screened.',
      'Participants who are subject to this requirement will be registered on the High-Risk Participant Register and some specific support workers will be delegated to those who are registered on this form.'
    ]
  },

  // Participant Risk Level Communication (complete content)
  { type: 'section_header', label: 'Participant Risk Level Communication' },
  {
    type: 'list',
    items: [
      'For participants who are subject to this requirement, the implementation of the services mentioned in their services will be reviewed every three months by the Service Operations and should be by someone other than the support workers.',
      'The Service Operations will supervise and monitor the performance of the support workers through a face-to-face interview at the participant\'s home when the support worker is not at home to ensure their performance is consistent with the agreement and the participant\'s safety and well-being at least every 3 months or when suspicious of any harm to the participant.',
      'The Service Operations will provide a report to every key personnel regarding the care and skill with which personal support is being provided to the participant by the support worker after every visit to the participant\'s home or if there is any complication in service provision.'
    ]
  },
  {
    type: 'paragraph',
    content: 'Infinity Supports WA PTY Ltd will be required to complete an audit with NDIS, as a participant you may be asked to provide comments and feedback regarding your service. This is an OPT IN or OUT option to be completed on the consent form.'
  },

  // Consents & Signatures - Using special table format
  { 
    type: 'consent_table',
    items: [
      {
        key: 'mediaConsent',
        label: 'Hereby give consent to Infinity Supports WA to obtain and images and likeness of myself. I give permission for Infinity Supports WA to use such images on media releases including social media and branding & promotion',
        items: ['Yes', 'No']
      },
      {
        key: 'mediaProfile',
        label: 'Hereby give consent to Infinity Supports WA to obtain and use my photograph for the purpose of creating a client profile (and other internal documents).',
        items: ['Yes', 'No']
      },
      {
        key: 'infoSharingConsent',
        label: 'Hereby give consent to Infinity Supports WA to obtain & share relevant documented information regarding my service. This may include but not limited to:',
        items: ['Yes', 'No'],
        subItems: [
          'Legal Guardian/Next of Kin',
          'GP/health care professional',
          'Therapy providers',
          'Plan Managers',
          'Others'
        ]
      },
      {
        key: 'moneyHandlingConsent',
        label: 'I consent for staff to assist me (the participant) with handling my money (e.g. Buying Lunch) and assisting with my personal property, receipts will be provided for all purchases',
        items: ['Yes', 'No']
      },
      {
        key: 'ndisAuditConsent',
        label: 'I consent to take part in a NDIS audit and my documents be reviewed as required.',
        items: ['Yes', 'No']
      }
    ]
  },
  // "If Others, specify" field - REMOVED: now displayed inline within infoSharingConsent
  // { type: 'text', key: 'othersInfoSharingConsent', label: 'If Others, specify' },

  // Signature Groups (table format with 3 columns: Signature/Date/Name)
  {
    type: 'signature_group',
    meta: {
      title: 'Participant',
      signatureKey: 'participantSignature',
      dateKey: 'participantSignatureDate',
      nameKey: 'participantName'
    }
  },
  {
    type: 'signature_group',
    meta: {
      title: 'Nominee',
      titleNote: 'I confirm that this agreement has been explained to the person receiving the services (participant) and that they agree to this: [If signed by a Nominee:]',
      signatureKey: 'nomineeSignature',
      dateKey: 'nomineeSignatureDate',
      nameKey: 'nomineeName'
    }
  },
  {
    type: 'signature_group',
    meta: {
      title: 'Provider',
      signatureKey: 'providerSignature',
      dateKey: 'providerSignatureDate',
      nameKey: 'providerName',
      signatureLabel: 'Signature on behalf of Infinity Supports WA'
    }
  }
];
