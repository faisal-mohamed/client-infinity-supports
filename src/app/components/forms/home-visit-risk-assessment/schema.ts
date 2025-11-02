export interface HomeVisitSchemaBlock {
  type: 'cover_page' | 'section_header' | 'paragraph' | 'form_field' | 'table' | 'signature_section';
  label?: string;
  content?: string;
  fields?: Array<{
    key: string;
    label: string;
    type: 'text' | 'date' | 'textarea' | 'radio' | 'signature';
    options?: string[];
    required?: boolean;
  }>;
  table?: {
    headers: string[];
    rows: Array<{
      fields: Array<{
        key: string;
        type: 'text' | 'select';
        options?: string[];
      }>;
    }>;
  };
  estimatedHeight?: number;
}

export const homeVisitSchema: HomeVisitSchemaBlock[] = [
  {
    type: 'cover_page',
    label: 'HOME & COMMUNITY VISIT RISK ASSESSMENT',
    content: 'This assessment identifies potential risks associated with home and community visits to ensure the safety of both clients and support workers.',
    estimatedHeight: 400
  },
  {
    type: 'section_header',
    label: 'CLIENT AND FAMILY INFORMATION',
    estimatedHeight: 40
  },
  {
    type: 'form_field',
    fields: [
      { key: 'visitCompany', label: 'Will the client be accompanied by family/friends during visits?', type: 'radio', options: ['Yes', 'No'], required: true },
      { key: 'aggressionHistory', label: 'Is there any history of aggression or violence?', type: 'radio', options: ['Yes', 'No'], required: true },
      { key: 'drugUseHistory', label: 'Is there any history of drug or alcohol use that may affect safety?', type: 'radio', options: ['Yes', 'No'], required: true },
      { key: 'careDirective', label: 'Are there any specific care directives or behavioral considerations?', type: 'textarea', required: true }
    ],
    estimatedHeight: 200
  },
  {
    type: 'section_header',
    label: 'ENVIRONMENTAL CONSIDERATIONS',
    estimatedHeight: 40
  },
  {
    type: 'form_field',
    fields: [
      { key: 'petsRestrained', label: 'Are pets properly restrained during visits?', type: 'radio', options: ['Yes', 'No', 'N/A'], required: true },
      { key: 'weaponsInHome', label: 'Are there any weapons or dangerous items in the home?', type: 'radio', options: ['Yes', 'No'], required: true }
    ],
    estimatedHeight: 120
  },
  {
    type: 'section_header',
    label: 'SAFETY CONSIDERATIONS',
    estimatedHeight: 40
  },
  {
    type: 'form_field',
    fields: [
      { key: 'smokingAgreement', label: 'Is there a no-smoking agreement in place?', type: 'radio', options: ['Yes', 'No', 'N/A'], required: true },
      { key: 'smokeDetectors', label: 'Are smoke detectors present and functional?', type: 'radio', options: ['Yes', 'No'], required: true },
      { key: 'fireHazards', label: 'Are there any fire hazards or safety concerns?', type: 'textarea', required: true }
    ],
    estimatedHeight: 160
  },
  {
    type: 'section_header',
    label: 'GEOGRAPHICAL LOCATION',
    estimatedHeight: 40
  },
  {
    type: 'form_field',
    fields: [
      { key: 'accessDifficulties', label: 'Are there any access difficulties (stairs, narrow paths, etc.)?', type: 'textarea', required: true },
      { key: 'parking', label: 'Is adequate parking available?', type: 'radio', options: ['Yes', 'No'], required: true },
      { key: 'entryPoint', label: 'Describe the main entry point and any security measures', type: 'textarea', required: true },
      { key: 'mobileReception', label: 'Is mobile phone reception adequate?', type: 'radio', options: ['Yes', 'No'], required: true }
    ],
    estimatedHeight: 200
  },
  {
    type: 'section_header',
    label: 'RISK ASSESSMENT TABLE',
    estimatedHeight: 40
  },
  {
    type: 'table',
    table: {
      headers: ['Identified Issue/Risk', 'Risk Score (1-5)', 'Control Measures', 'Responsible Person'],
      rows: [
        {
          fields: [
            { key: 'issue1', type: 'text' },
            { key: 'riskScore1', type: 'select', options: ['1', '2', '3', '4', '5'] },
            { key: 'control1', type: 'text' },
            { key: 'responsible1', type: 'text' }
          ]
        },
        {
          fields: [
            { key: 'issue2', type: 'text' },
            { key: 'riskScore2', type: 'select', options: ['1', '2', '3', '4', '5'] },
            { key: 'control2', type: 'text' },
            { key: 'responsible2', type: 'text' }
          ]
        },
        {
          fields: [
            { key: 'issue3', type: 'text' },
            { key: 'riskScore3', type: 'select', options: ['1', '2', '3', '4', '5'] },
            { key: 'control3', type: 'text' },
            { key: 'responsible3', type: 'text' }
          ]
        },
        {
          fields: [
            { key: 'issue4', type: 'text' },
            { key: 'riskScore4', type: 'select', options: ['1', '2', '3', '4', '5'] },
            { key: 'control4', type: 'text' },
            { key: 'responsible4', type: 'text' }
          ]
        },
        {
          fields: [
            { key: 'issue5', type: 'text' },
            { key: 'riskScore5', type: 'select', options: ['1', '2', '3', '4', '5'] },
            { key: 'control5', type: 'text' },
            { key: 'responsible5', type: 'text' }
          ]
        }
      ]
    },
    estimatedHeight: 300
  },
  {
    type: 'signature_section',
    label: 'ASSESSMENT COMPLETION',
    fields: [
      { key: 'assessorName', label: 'Assessor Name', type: 'text', required: true },
      { key: 'assessorSignature', label: 'Assessor Signature', type: 'signature', required: true },
      { key: 'completionDate', label: 'Date of Assessment', type: 'date', required: true },
      { key: 'reviewDate', label: 'Next Review Date', type: 'date', required: true }
    ],
    estimatedHeight: 200
  }
];

export const HOME_VISIT_PAGE_BUDGET = 1000;
export const HOME_VISIT_BLOCK_SPACING = 16;
export const HOME_VISIT_SAFETY_BUFFER = 100;
