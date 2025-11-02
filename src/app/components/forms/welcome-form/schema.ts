export type WelcomeBlockType =
  | 'cover_page'
  | 'section_header'
  | 'paragraph'
  | 'list'
  | 'image'
  | 'values_section'
  | 'contact_info'
  | 'acknowledgment_form';

export interface WelcomeSchemaBlock {
  type: WelcomeBlockType;
  key?: string;
  label?: string;
  content?: string;
  items?: string[];
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
  };
  images?: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
  }>;
  meta?: Record<string, any>;
  estimatedHeight?: number; // For pagination
}

// Complete Welcome Form content as schema blocks
export const welcomeFormSchema: WelcomeSchemaBlock[] = [
  // Page 1 - Cover Page
  {
    type: 'cover_page',
    key: 'cover',
    label: 'WELCOME PACK',
    content: 'HELPING YOU ACHIEVE GOALS AND BEYOND',
    image: {
      src: '/welcomeimg/p1-1.png',
      alt: 'Red infinity symbol',
      width: 200,
      height: 100
    },
    images: [
      { src: '/welcomeimg/p1-2.png', alt: 'NDIS logo', width: 56, height: 56, className: 'object-contain' },
      { src: '/welcomeimg/p1-3.png', alt: 'Rainbow pride flag', width: 56, height: 40, className: 'object-contain' },
      { src: '/welcomeimg/p1-4.png', alt: 'Aboriginal flag', width: 56, height: 40, className: 'object-contain' },
      { src: '/welcomeimg/p1-5.png', alt: 'Torres Strait Islander flag', width: 56, height: 40, className: 'object-contain' }
    ],
    estimatedHeight: 800
  },

  // Page 2 - About Us
  {
    type: 'section_header',
    label: 'About Us',
    estimatedHeight: 40
  },
  {
    type: 'paragraph',
    content: 'Infinity Supports WA Pty Ltd was started by Sharon Mays and Anand Sekar in 2021. As individuals in the industry of supporting people with disabilities, we are both very passionate about supporting individuals to live their best lives and achieve their life goals. Everyone should be given the opportunity to the best quality individual support, and this was our drive to develop Infinity Supports WA. We had identified areas we wanted to improve on and listened to the individuals we had both worked with. From this information and the support of some amazing support workers it is our vision to ensure we deliver services to our clients in a person-centred manner.',
    estimatedHeight: 120
  },

  // Page 3 - Vision & Mission
  {
    type: 'image',
    image: {
      src: '/welcomeimg/p3-1.png',
      alt: 'Our Vision logo',
      width: 200,
      height: 130,
      className: 'object-contain mb-14'
    },
    estimatedHeight: 160
  },
  {
    type: 'paragraph',
    content: 'To work with people with disabilities to empower them to live their best lives by employing a person-centred approach',
    meta: { style: 'vision', className: 'font-semibold text-center leading-snug mb-20 max-w-[320px]' },
    estimatedHeight: 80
  },
  {
    type: 'image',
    image: {
      src: '/welcomeimg/p3-2.png',
      alt: 'Mission graphic',
      width: 280,
      height: 100,
      className: 'object-contain mb-6'
    },
    estimatedHeight: 120
  },
  {
    type: 'paragraph',
    content: 'Our Mission is to assist individuals \'achieve goals and beyond\'',
    meta: { style: 'mission', className: 'font-semibold text-center leading-snug max-w-[320px]' },
    estimatedHeight: 60
  },

  // Page 4 - Values
  {
    type: 'image',
    image: {
      src: '/welcomeimg/p4-1.png',
      alt: 'Our Values logo',
      width: 200,
      height: 160,
      className: 'object-contain mb-8'
    },
    estimatedHeight: 180
  },
  {
    type: 'values_section',
    label: 'Our Values',
    items: [
      'Individuals – Giving every individual a voice, choice & control and the opportunity to live a fulfilled life.',
      'Passion – We are passionate to listen and empower people with disabilities to achieve their goals.',
      'Integrity – We protect privacy of those we work with whilst being always honest and transparent.',
      'Respect – We embrace diversity. We believe in inclusiveness and equality.'
    ],
    estimatedHeight: 200
  },

  // Page 5 - Community Participation
  {
    type: 'section_header',
    label: 'Community Participation',
    estimatedHeight: 30
  },
  {
    type: 'paragraph',
    content: 'Here at Infinity Supports WA, we understand how important it is to be a part of your local community. By utilizing your NDIS funding, our highly skilled support staff can assist you in gaining a higher level of independence and having the confidence to participate in local groups/activities of your choice. At Infinity Supports WA, we focus on a person-centred approach to enable you to participate in activities of your choices such as:',
    estimatedHeight: 100
  },
  {
    type: 'list',
    items: [
      'Training and Education',
      'Recreation and Sports',
      'Arts and Crafts',
      'Social Support',
      'Personal Development Skills'
    ],
    estimatedHeight: 80
  },
  {
    type: 'paragraph',
    content: 'Our individualised supports enable you to lead the way to achieve your goals. We make sure that we connect you with someone you feel comfortable with and share interests with as all our support workers come with different skills, personalities, and hobbies.',
    estimatedHeight: 60
  },
  {
    type: 'paragraph',
    content: 'We understand that you may have concerns stepping out of your comfort zone, but we strive to create a safe environment to make your joining an enjoyable experience.',
    estimatedHeight: 50
  },

  // Page 5 continued - Independent Living Skills
  {
    type: 'section_header',
    label: 'Independent Living Skills',
    estimatedHeight: 30
  },
  {
    type: 'paragraph',
    content: 'At Infinity Supports WA we strive to ensure every person with a disability can live their best life. We understand "one size doesn\'t fit all", so our person-centred approach means that supports are tailored exactly to your needs. We will work closely with you and your formal & informal networks to ensure we address the area of your life you require assistance. Together we will develop a support plan that is right for you. With our diverse team we will ensure you have complete choice and control of the people you work with, so you are comfortable with them in your home.',
    estimatedHeight: 120
  },
  {
    type: 'paragraph',
    content: 'Some of the services our support team can offer are:\n* Activities for daily living: such as showering, dressing, and other personal care activities',
    estimatedHeight: 60
  },

  // Continue with more content blocks for remaining pages...
  // Page 10 - Rights
  {
    type: 'list',
    items: [
      'Consideration always.',
      'Participants\' specific requirements are adhered to and cared for.',
      'Participants are treated equally and can state their personal preferences regarding activities or participation.',
      'Infinity Supports WA always operates in an anti-discriminatory manner.',
      'Participant information always remains confidential and private while under the care of Infinity Supports WA.',
      'Participants can exercise personal self-resilience and freedom, including the right to partake in decision-making.',
      'Participants have the right to accept services involving their personal requirements and are supported throughout the process.'
    ],
    estimatedHeight: 200
  },
  {
    type: 'section_header',
    label: 'Other rights participants are entitled to include:',
    estimatedHeight: 30
  },
  {
    type: 'list',
    items: [
      'The right to lodge a complaint.',
      'The right to access outside organisations, resources, and support throughout their time at Infinity Supports WA',
      'Privileges or commitments under the Disability Act 2006 and the facilities as well as any related expenses to be incurred',
      'Participants have the opportunity to dismiss care or assistance without any retribution or discrimination towards any potential future access to assistance or resources',
      'Participants will have choice and flexibility in many aspects of their service of care.',
      'Having the opportunity to choose a person to help and promote their experiences on behalf of Infinity Supports WA.',
      'Have the right to receive help, support and assistance provided by sufficiently skilled workers.',
      'Having the option to change providers where required and receive encouragement to ensure adequate, secure and exceptional quality of care is maintained'
    ],
    estimatedHeight: 240
  },

  // Page 15 - Incident Management
  {
    type: 'list',
    items: [
      'An unexpected death, serious injury or alleged assault (including physical, sexual abuse, sexual assault or indecent assault) that occurs as a result of or during the delivery of services.',
      'Allegations of serious, unlawful or criminal activity or conduct involving an Infinity Supports WA employee, subcontractor or volunteer that has caused, or has the potential to cause, serious harm to you.',
      'An incident where you assault or cause serious harm to others (including our employees, volunteers or contractors), as a result of or during the delivery of services.',
      'A severe fire, natural disaster, accident or other incident that will—or is likely to—prevent service provision, result in closure or cause significant damage to premises or property, or pose a substantial threat to your health and safety.'
    ],
    estimatedHeight: 160
  },
  {
    type: 'paragraph',
    content: 'Infinity Supports WA has established procedures that identify, manage and resolve incidents, which include:',
    estimatedHeight: 40
  },
  {
    type: 'list',
    items: [
      'Staff members must report all incidents to Infinity Supports WA.',
      'Completion of an incident report that identifies and documents the incident.',
      'Infinity Supports WA is responsible for reporting \'reportable incidents\' to the NDIS Commission and other required agencies.',
      'Compliance with the National Disability Insurance Scheme (Incident Management and Reportable Incidents) Rules 2018.',
      'Supporting and assisting you if you are affected by the incident.',
      'Reviewing the incident internally if you or others were affected.',
      'Collaborating with you, your family and/or advocate to manage and resolve the incident.',
      'Reviewing the incident and making necessary amendments to systems and processes to reduce the risk of recurrence.'
    ],
    estimatedHeight: 240
  },
  {
    type: 'paragraph',
    content: 'Infinity Supports WA will implement appropriate preventive measures to mitigate further harm or injury as necessary. As part of the investigation process, the incident scene and any evidence must be preserved until the investigation concludes.',
    estimatedHeight: 80
  },

  // Page 20 - Complaints
  {
    type: 'paragraph',
    content: 'You always have the right to expect the best possible standard of service from us, and we will treat any concern or complaint you provide as a serious issue. No matter what the situation, a Staff will not react badly to your complaint; you should feel safe knowing that they will not retaliate or hurt you in any way.',
    estimatedHeight: 80
  },
  {
    type: 'paragraph',
    content: 'You can make an anonymous complaint using Complaint Report Form. Remember not to identify yourself during this process if you wish us not to know who is making the complaint.',
    estimatedHeight: 60
  },
  {
    type: 'paragraph',
    content: 'You can make a complaint regarding our services, or a Staff provided to work with you. If you do not feel comfortable making a complaint, someone else can do this on your behalf, including:',
    estimatedHeight: 60
  },
  {
    type: 'list',
    items: [
      'an advocate',
      'a family member',
      'a close friend',
      'your care worker',
      'a person you know and trust.'
    ],
    estimatedHeight: 80
  },
  {
    type: 'paragraph',
    content: 'You can complain about your services and supports when:',
    estimatedHeight: 40
  },
  {
    type: 'list',
    items: [
      'something has gone wrong',
      'something is not working well',
      'something has not been done the right way',
      'something makes you unhappy',
      'you have been treated badly.'
    ],
    estimatedHeight: 80
  },

  // Page 25 - Important Contacts
  {
    type: 'contact_info',
    label: 'Important Contacts',
    items: [
      'Infinity Supports WA is not an emergency service. We are unable to answer phone calls outside of our normal working hours (8.30 am to 4.30 pm Monday to Friday).',
      'NDIS\nPhone: 1800 800 110\nEmail: enquiries@ndis.gov.au',
      'Emergency\nDial 000',
      'Crisis and Mental Health Support\nBeyond Blue: 1300 224 636\nLifeline Australia: 13 11 14\nSuicide Call Back Service: 1300 659 467\nMental Health Emergency Response Line: 1300 555 788 (Metro) / 1800 676 822 (Peel)\nKids Helpline: 1800 55 1800\nMensline Australia: 130 78 99 78\nSexual Assault, Family and Domestic Violence Line: 1800 424 017',
      'Medical\nHealth Direct (24 hours health advice): 1800 022 222\nPoisons Information Line: 131 126'
    ],
    estimatedHeight: 300
  },

  // Page 26 - Acknowledgment Form
  {
    type: 'acknowledgment_form',
    key: 'acknowledgment',
    label: 'Welcome Pack Receipt Acknowledgement',
    content: 'I confirm I have received the Welcome Pack from Infinity Supports and have read and understood the content.\n\nA printed version of the Welcome Pack is also available. If you would like a printed version, please contact us.',
    meta: {
      fields: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'signature', label: 'Signature', type: 'signature' },
        { key: 'relationship', label: 'Relationship', type: 'text' },
        { key: 'date', label: 'Date', type: 'date' }
      ]
    },
    estimatedHeight: 400
  }
];

// Height calculation constants (matching SA Delivery pattern)
export const WELCOME_PAGE_BUDGET = 1000; // Available height per page
export const WELCOME_BLOCK_SPACING = 16; // Space between blocks
export const WELCOME_SAFETY_BUFFER = 100; // Header + footer margin
export const WELCOME_A4_WIDTH = 794; // 210mm in pixels
export const WELCOME_A4_HEIGHT = 1123; // 297mm in pixels
