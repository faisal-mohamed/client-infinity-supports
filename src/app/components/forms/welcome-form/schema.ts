export type WelcomeBlockType =
  | 'cover_page'
  | 'section_header'
  | 'paragraph'
  | 'list'
  | 'image'
  | 'values_section'
  | 'contact_info'
  | 'acknowledgment_form'
  | 'table'
  | 'checkmark_list'
  | 'contact_block'
  | 'agency_list'
  | 'data_category_bars';

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
  table?: {
    headers: string[];
    rows: string[][];
  };
  contacts?: Array<{
    title: string;
    telephone?: string;
    email?: string;
    website?: string;
  }>;
  agencies?: Array<{
    name: string;
    color: string;
  }>;
  dataCategories?: Array<{
    text: string;
    color: string;
    maxWidth?: number;
  }>;
  meta?: Record<string, any>;
  estimatedHeight?: number; // For pagination
}

// Complete Welcome Form content as schema blocks
// 🔍 TOTAL: ~26 pages worth of content blocks
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
    content: 'Some of the services our support team can offer are:',
    estimatedHeight: 30
  },
  {
    type: 'list',
    items: [
      'Activities for daily living: such as showering, dressing, and other personal care activities',
      'Medication management',
      'Domestic support: such as cleaning, washing, cooking, and gardening',
      'Meal Prep'
    ],
    estimatedHeight: 90
  },

  // Page 6 - Mentoring & Life Skills
  {
    type: 'section_header',
    label: 'Mentoring & Life Skills',
    estimatedHeight: 30
  },
  {
    type: 'paragraph',
    content: 'Our skilled support staff can provide mentoring, guidance and encouragement to promote independence through a person-centred approach. Learning from the mentor\'s lived experience, we work with you to develop problem solving skills, participation in social activities and school transitions. Mentors can support with skills to gain employment from resume writing to interview techniques through to on-the-job support. Our mentors can provide social and emotional support for you to develop your communication and social skills. We aim to match individuals and mentors by listening to you, giving you choice and control, understanding age, gender, and common interests.',
    estimatedHeight: 140
  },

  // Page 6 - Support Coordination
  {
    type: 'section_header',
    label: 'Support Coordination',
    estimatedHeight: 30
  },
  {
    type: 'paragraph',
    content: 'The Support Coordination team at Infinity Supports WA are here to help you understand and make the most of your NDIS plan. With your choice and control at forefront, we can assist you to source providers who can help you achieve your goals.',
    estimatedHeight: 60
  },
  {
    type: 'paragraph',
    content: 'We ensure we get to know all our clients personally so we can understand your support needs and ensure you utilise your NDIS to its full potential. We take the stress out of calling providers by selecting a few companies who can provide the supports you are looking for and then guide you through your selection process.',
    estimatedHeight: 80
  },
  {
    type: 'paragraph',
    content: 'Our Support Coordinators will assist you in the preparation of your NDIS plan review by ensuring all stakeholders have prepared reports for the review. Together, we will develop the goals you would like to achieve in your next plan and identify supports you will require to help you achieve your goals.',
    estimatedHeight: 80
  },

  // Page 7 - Service Provider Assistance
  {
    type: 'paragraph',
    content: 'We are also available to assist you should you encounter any problems with your service providers. This may be something small, but you don\'t feel comfortable approaching it or maybe questions you don\'t feel like you\'re getting answered. We are there to be the middleman so you can maintain your relationships while ensuring your voice is being heard.',
    estimatedHeight: 80
  },

  // Page 7 - Management of Budgets, Statements and Fees
  {
    type: 'section_header',
    label: 'Management of Budgets, Statements and Fees',
    estimatedHeight: 30
  },
  {
    type: 'paragraph',
    content: 'You receive a NDIS funding package to pay for your disability support and support management. Your package lets you decide the type of disability supports you need, who provides it and where it is provided. Thank you for choosing Infinity Supports WA as part of your support team. Our team will never offer you financial advice or information.',
    estimatedHeight: 80
  },
  {
    type: 'paragraph',
    content: 'Infinity Supports WA will regularly inform you of the cost of the services being provided. We are transparent with our fee structure. When starting your service with us, we will provide you with a statement that clearly outlines your fees. We then will provide you with a statement each month that outlines your fees.',
    estimatedHeight: 80
  },
  {
    type: 'paragraph',
    content: 'Fees may be changed during your service delivery as per NDIS price guide, but you will be informed of this increase two weeks in advance.',
    estimatedHeight: 60
  },
  {
    type: 'paragraph',
    content: 'Please note: There are annual changes in the NDIS Price Guide; these will automatically adjust your fees.',
    estimatedHeight: 50
  },
  {
    type: 'paragraph',
    content: 'Before services are provided, we will inform you of:',
    estimatedHeight: 30
  },
  {
    type: 'list',
    items: [
      'chargeable fees',
      'payment methods, i.e. direct debit, cheque, money order (please never pay a Staff directly)',
      'your budget (or the amount of money you can spend)',
      'methods for payment of fees.'
    ],
    estimatedHeight: 80
  },

  // Page 8 - How to access our Services
  {
    type: 'paragraph',
    content: 'If you are using the National Disability Insurance Agency (NDIA) to manage your funds, our organisation will work with the NDIA.',
    estimatedHeight: 50
  },
  {
    type: 'section_header',
    label: 'How to access our Services',
    estimatedHeight: 30
  },
  {
    type: 'list',
    items: [
      'Contact us by phone 0493 282661 or 0493 141 688',
      'Email: admin@infinitysupportswa.org',
      'Or via our Referral Form on our website: infinitysupportswa.org'
    ],
    estimatedHeight: 70
  },

  // Page 8 - What's next?
  {
    type: 'section_header',
    label: 'What\'s next?',
    estimatedHeight: 30
  },
  {
    type: 'list',
    items: [
      'Our Service Operations Manager will contact you to arrange a meeting to discuss your support requirements.',
      'We will complete a Client Intake Form with you and a Client Consent to ensure we have all your most current requirements and permission to communication with other stakeholders involved in your care.',
      'You will provide us with a copy of your NDIS Plan and details of any Support Coordinator you have engaged.',
      'We will them complete a Service Agreement and onboarding documentation which will include:'
    ],
    estimatedHeight: 140
  },
  {
    type: 'list',
    items: [
      'The services you have asked us to deliver.',
      'The amount of funding you would like us to utilise.',
      'How your plan funds are managed and your preferred payment.',
      'Your Rights and Responsibilities',
      'Our Responsibilities',
      'How to change or amend the Service Agreement',
      'How to give feedback or make a complaint.',
      'Multimedia form'
    ],
    meta: { className: 'ml-8' },
    estimatedHeight: 180
  },

  // Page 9 - Service Agreement Items (continuation)
  {
    type: 'list',
    items: [
      'Individual Risk Assessment',
      'Home Risk Assessment'
    ],
    meta: { className: 'ml-8' },
    estimatedHeight: 50
  },
  {
    type: 'paragraph',
    content: 'We will then discuss with you how you would like your support plan and emergency to plan to look. You will be given the opportunity to provide information which you would like us to share with you support workers and best they can support you to achieve your goals.',
    estimatedHeight: 80
  },

  // Page 9 - Your Rights and Responsibilities
  {
    type: 'section_header',
    label: 'Your Rights and Responsibilities',
    estimatedHeight: 30
  },
  {
    type: 'paragraph',
    content: 'Client Charter Policy and Procedure (extract)',
    estimatedHeight: 30
  },
  {
    type: 'paragraph',
    content: 'Full policy available on request and on our website',
    meta: { className: 'font-bold' },
    estimatedHeight: 30
  },
  {
    type: 'section_header',
    label: 'Rights of the Participants',
    estimatedHeight: 30
  },
  {
    type: 'paragraph',
    content: 'Infinity Supports WA understands the importance of upholding the rights of the participants and intends to do so by implementing certain practices to adhere to these rights and responsibilities.',
    estimatedHeight: 60
  },
  {
    type: 'paragraph',
    content: 'The Charter of Human Rights and Responsibilities ACT 2006 and the Disability ACT 2006 set out the rights and responsibilities of participants. Infinity Supports WA utilises this piece of legislation as a guideline to ensure:',
    estimatedHeight: 60
  },
  {
    type: 'list',
    items: [
      'Participants can recognise their specific physical, mental, financial, economic, religious, and cognitive growth capabilities.',
      'All participants are valued individually and considered for their uniqueness.',
      'Participants are not exposed to any form of violence, misconduct, negligence, or isolation.',
      'Participants are informed of personal desires and inclinations.',
      'Participants are considerate of issues that impact their livelihood (e.g., choices made regarding wellbeing as well as implementation of our strategies, services, and facilities).',
      'Participants are addressed and treated respectfully, with compassion and dignity.'
    ],
    estimatedHeight: 180
  },

  // Page 10 - Rights (continued from Page 9)
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

  // Page 11 - Expectations of Participants
  {
    type: 'section_header',
    label: 'Expectations of Participants',
    estimatedHeight: 30
  },
  {
    type: 'paragraph',
    content: 'In accordance with the legislation, Infinity Supports WA expects its participants to:',
    estimatedHeight: 40
  },
  {
    type: 'list',
    items: [
      'Advise Infinity Supports WA if assistance or support is no longer needed.',
      'Notify workers of any developments with the participant\'s conditions and desires.',
      'Be courteous and respectful to workers as well as other participants.',
      'Regard others\' freedoms like their privacy rights and confidentiality.',
      'Value the integrity and human morality of its workers and other participants.',
      'Notify workers of any developmental, welfare, or physical condition concerns that may affect assistance provided to you.',
      'Engage constructively in the creation, delivery, and analysis of support services targeting people.',
      'Take accountability for any selections and the consequences of any choices made.',
      'Make any payments and expenses related to the delivery of your service urgently or when requested.'
    ],
    estimatedHeight: 220
  },

  // Page 11 - Worker Responsibilities
  {
    type: 'section_header',
    label: 'Worker Responsibilities',
    estimatedHeight: 30
  },
  {
    type: 'list',
    items: [
      'To adhere to and enforce the concept of human rights.',
      'To support and aid all participants in times of need.',
      'To recognise and implement the necessary measures to ensure that all participants are receiving quality care.',
      'Ensure that the interests of the participants are considered and upheld.',
      'Ensure all rights and responsibilities are effectively enforced within the framework of Infinity Supports WA.',
      'Notify Management or the Director of any breaches or violations of human rights—whether of their own or the participant\'s.'
    ],
    estimatedHeight: 160
  },

  // Page 12 - Your Privacy
  {
    type: 'section_header',
    label: 'Your Privacy',
    estimatedHeight: 30
  },
  {
    type: 'paragraph',
    content: 'Privacy and Confidentiality Policy (extract)',
    estimatedHeight: 30
  },
  {
    type: 'paragraph',
    content: 'Full policy available on request and on our website',
    meta: { className: 'font-bold' },
    estimatedHeight: 30
  },
  {
    type: 'paragraph',
    content: 'Infinity Supports WA will only require confidential information to determine potential participants\' suitability for a service and to monitor the services provided. A participant is entitled to supply, access, update and use any personal information if necessary to ensure correct information is in the system. They may refuse to disclose some information and have the right to revoke their consent to disclose personal information. Personal participant information that Infinity Supports WA collects involves, but is not limited to:',
    estimatedHeight: 120
  },
  {
    type: 'data_category_bars',
    dataCategories: [
      { text: 'Incident reports | Emergency contact details | Consent forms', color: '#e07a5f', maxWidth: 320 },
      { text: 'Health status | Contact information | Medical Documents', color: '#d87f5a', maxWidth: 280 },
      { text: 'Immunisation records | Organisation information', color: '#c97f7a', maxWidth: 260 },
      { text: 'Development of records, plans, portfolios and observations', color: '#a97a7a', maxWidth: 360 },
      { text: 'Intake of delivery services, assessment and data review', color: '#9a9a9a', maxWidth: 360 }
    ],
    estimatedHeight: 150
  },
  {
    type: 'paragraph',
    content: 'Before collecting personal information from participants or their advocates, Infinity Supports WA workers must clarify why the information is being collected, how it will be stored and used, and why Infinity Supports WA requires it. Infinity Supports WA only gathers the necessary personal information of participants for the protected and adequate provision of services. All private and confidential information must be stored securely.',
    estimatedHeight: 100
  },

  // Page 13 - Interpreter Support & Consent
  {
    type: 'paragraph',
    content: 'Infinity Supports WA workers will support participants if they need to gain access to an interpreter if required.',
    estimatedHeight: 50
  },
  {
    type: 'paragraph',
    content: 'Following the information provided in this policy and procedure, Infinity Supports WA workers must use a Consent Form to verify and clarify the information stated in this policy and procedure. This consent form indicates whether participants have allowed Infinity Supports WA to hold, retain and use vital information of the participant. This information may include the following; however, is not limited to:',
    estimatedHeight: 100
  },
  {
    type: 'list',
    items: [
      'Full Name',
      'Nationality',
      'Date of Birth',
      'Preferences',
      'Personal Goals',
      'Medical Information',
      'Referrals',
      'Case/Progress Notes'
    ],
    estimatedHeight: 120
  },
  {
    type: 'paragraph',
    content: 'If an individual is in a situation where they are unsure about disclosing another\'s personal information, they should communicate and discuss with the Directors.',
    estimatedHeight: 60
  },

  // Page 13 - Keeping your Information Safe
  {
    type: 'section_header',
    label: 'Keeping your Information Safe',
    estimatedHeight: 30
  },
  {
    type: 'list',
    items: [
      'We will protect your information and only use it with your consent with the people that work with you. This will help them deliver quality supports.',
      'We will only share your information if we feel you are unsafe or if the law requires us to do so.',
      'The information is yours and you are free to see this at any time.'
    ],
    estimatedHeight: 90
  },

  // Page 13 - Cancellation Charges
  {
    type: 'section_header',
    label: 'Cancellation Charges and Exit Process',
    estimatedHeight: 30
  },
  {
    type: 'section_header',
    label: 'Cancellation Charges:',
    estimatedHeight: 30
  },
  {
    type: 'paragraph',
    content: 'A cancellation is a short notice cancellation if:',
    estimatedHeight: 40
  },

  // Page 14 - Cancellation Conditions
  {
    type: 'list',
    items: [
      'You do not show up for a scheduled support within a reasonable time, or are not present at the agreed place and time when the provider is travelling to deliver the support.',
      'You have given less than seven (7) clear business days\' notice for cancellation of support in line with the current NDIS price guide.',
      'The support is less than 8 hours continuous duration; AND',
      'The agreed total price for the support is less than $1000; OR',
      'Less than seven (7) business days\' notice is given for any other support.'
    ],
    estimatedHeight: 140
  },
  {
    type: 'paragraph',
    content: 'In these circumstances, full support fees will be charged.',
    estimatedHeight: 40
  },

  // Page 14 - Exiting Services
  {
    type: 'section_header',
    label: 'Exiting Services',
    estimatedHeight: 30
  },
  {
    type: 'paragraph',
    content: 'If either party chooses to end this Service Agreement before the cease date, they must give 2 weeks\' notice in writing.',
    estimatedHeight: 50
  },
  {
    type: 'paragraph',
    content: 'If either party seriously breaches this Service Agreement, the requirement of notice will be waived.',
    estimatedHeight: 50
  },

  // Page 14 - Incident Reporting (Header)
  {
    type: 'section_header',
    label: 'Incident Reporting',
    meta: { className: 'text-center font-bold' },
    estimatedHeight: 30
  },
  {
    type: 'paragraph',
    content: 'While we hope that an incident reporting does not occur, in the event it does, we are prepared to support and assist you by following procedures that appropriately deal with a critical incident.',
    estimatedHeight: 60
  },
  {
    type: 'paragraph',
    content: 'An incident is classified as an event (or alleged event) that occurs because of, or during, the delivery of services and has caused, or is likely to cause, a significant negative impact on your health, safety or wellbeing.',
    estimatedHeight: 70
  },
  {
    type: 'paragraph',
    content: 'If an incident does occur, we will engage the required authorities to support you during this time.',
    estimatedHeight: 50
  },
  {
    type: 'paragraph',
    content: 'Incidents that relate to you may include, but are not necessarily limited to:',
    estimatedHeight: 40
  },

  // Page 14-15 - Incident Types
  {
    type: 'list',
    items: [
      'an unexpected death, serious injury or alleged assault (including physical, sexual abuse, sexual assault or indecent assault) that occurs as a result or during the delivery of services',
      'allegations of serious, unlawful or criminal activity or conduct involving [Organisation Name] employee, subcontractor or volunteer that has caused, or has the potential to cause, serious harm to you',
      'an incident where you assault or cause serious harm to others (including our employees, volunteers or contractors), as a result, or during the delivery, of services',
      'a severe fire, natural disaster, accident or other incidents that will, or is likely to prevent service provision, or that results in closure or significant damage to premises or property, or that poses a substantial threat to your health and safety.'
    ],
    estimatedHeight: 180
  },
  {
    type: 'paragraph',
    content: 'Infinity Supports WA has established procedures that identify, manage and resolve incidents which include:',
    estimatedHeight: 50
  },

  // Page 15 - Incident Management Procedures
  {
    type: 'list',
    items: [
      'Staff members will report all incidents to the Infinity Supports WA',
      'completion of an incident report that identifies and records an incident',
      'the Infinity Supports WA is responsible for reporting incidents that are \'reportable incidents\' to the NDIS Commissioner and other required agencies',
      'compliance with the National Disability Insurance Scheme (Incident Management and Reportable) Rules 2018',
      'supporting and assisting you if you are affected by the incident',
      'review of the incident by the Infinity Supports WA if you or others were affected',
      'collaborating with you, your family and/or advocate to manage and resolve the incident',
      'reviewing the incident and making necessary amendments to systems and processes to reduce the risk of recurrence.'
    ],
    estimatedHeight: 240
  },
  {
    type: 'paragraph',
    content: 'Infinity Supports WA will put in place appropriate preventive measures to mitigate further harm or injury as necessary. As part of the investigation process, the incident scene and evidence must be preserved until its conclusion. (In situations such as assisting an injured individual, enhancing area safety, aiding police investigations, or handling the deceased, site disturbance may occur.)',
    estimatedHeight: 100
  },

  // Page 16 - Incident Investigation Details
  {
    type: 'paragraph',
    content: 'The area will be inspected and verified to ensure that no new hazards have arisen while securing it.',
    estimatedHeight: 50
  },
  {
    type: 'paragraph',
    content: 'If medical treatment beyond first aid is required, the Safety representative will promptly notify the relevant person via phone or email.',
    estimatedHeight: 50
  },
  {
    type: 'paragraph',
    content: 'Any incidents, including near misses, must be reported to the manager or supervisor using Incident Report, and recorded in our Incident Register.',
    estimatedHeight: 50
  },
  {
    type: 'paragraph',
    content: 'In the event of an incident, injury, or illness, Infinity Supports WA will take immediate and appropriate action to minimize the risk of further harm or damage, provided it is safe to do so.',
    estimatedHeight: 60
  },

  // Page 16 - Report Notifiable Incident
  {
    type: 'section_header',
    label: '1. Report Notifiable Incident',
    estimatedHeight: 30
  },
  {
    type: 'paragraph',
    content: 'The incident notification process consists of 3 steps. These steps are as follows:',
    estimatedHeight: 40
  },
  {
    type: 'section_header',
    label: 'Step 1: Notify the NDIS Commission:',
    estimatedHeight: 30
  },
  {
    type: 'checkmark_list',
    items: [
      'Safety representative is responsible for reporting incidents that are reportable incidents to the Commissioner. In addition, any key personnel can notify Commissioner of reportable incidents.',
      'A notifiable incident shall be reported as soon as possible. The following information is required to be registered in the incident report form:'
    ],
    estimatedHeight: 80
  },
  {
    type: 'list',
    items: [
      'the name and contact details of the registered NDIS provider.',
      'a description of the reportable incident (a description of the impact on, or harm caused to, the person with disability)',
      'the immediate actions taken in response to the reportable incident, including actions taken to ensure the health, safety and wellbeing of persons with disability affected by the incident and whether the incident has been reported to police or any other body',
      'the name and contact details of the person making the notification',
      'the time, date and place at which the reportable incident occurred (if known)',
      'the names and contact details of the persons involved in the reportable incident'
    ],
    estimatedHeight: 180
  },

  // Page 17 - Reportable Incident Types
  {
    type: 'checkmark_list',
    items: [
      'For an incident to be reportable a certain act or event needs to have happened (or alleged to have happened) in connection with the provision of supports or services by the registered NDIS provider. This includes:'
    ],
    estimatedHeight: 50
  },
  {
    type: 'list',
    items: [
      'The death of a person with disability',
      'Serious injury of a person with disability',
      'Abuse or neglect of a person with disability',
      'Unlawful sexual or physical contact with, or assault of, a person with disability',
      'Sexual misconduct, committed against, or in the presence of, a person with disability, including grooming of the person with disability for sexual activity'
    ],
    estimatedHeight: 140
  },
  {
    type: 'checkmark_list',
    items: [
      'Infinity Supports WA will submit a notification form via NDIS commission portal within 24 hours, if any above incidents occur.',
      'Commissioner shall be provided with the following information within 5 business days after the provider became aware that the incident occurred:'
    ],
    estimatedHeight: 80
  },
  {
    type: 'list',
    items: [
      'the names and contact details of any witnesses to the reportable incident',
      'any further actions proposed to be taken in response to the reportable incident'
    ],
    estimatedHeight: 60
  },
  {
    type: 'checkmark_list',
    items: [
      'If an unauthorised restrictive practice is used, NDIS should be notified in 5 business days of being notified of the incident. However, the incident should be reported in 24 hours if the incident has resulted in injury to a disabled person.',
      'In cases where there is a need for police intervention, even after consideration of the incident, it should be reported as soon as possible. If there is any uncertainty about whether the incident needs to be reported or not, the notifier or approver should contact the NDIS Commission to seek further advice.',
      'Infinity Supports WA will also inform:'
    ],
    estimatedHeight: 140
  },
  {
    type: 'list',
    items: [
      'Authorities for notifiable work-related injuries, fatalities or dangerous occurrences',
      'Police if the incident relates to the death of a person'
    ],
    estimatedHeight: 60
  },

  // Page 18 - Incident Reporting Steps 2 & 3
  {
    type: 'checkmark_list',
    items: [
      'Where an incident is referred to NDIS, the NDIS investigation takes precedence over any organisational process.',
      'The progress of the incidents, accidents and near misses will be tracked in incident report form.'
    ],
    estimatedHeight: 80
  },
  {
    type: 'paragraph',
    content: 'Step 2: Submit a 5-business day form: this form should be submitted via the "My Reportable Incidents" portal within 5 business days after key management personnel are notified. Some additional information, including the corrective actions, is recorded in this form. any unauthorised use of restrictive practices is recorded by this form.',
    estimatedHeight: 90
  },
  {
    type: 'paragraph',
    content: 'Step 3: If required, the final report should be submitted: If this is required, the NDIS Commission will contact the provider and advise the due date for this matter. The final report field will be accessible on the NDIS Commission portal if the provider is required to submit a final report.',
    estimatedHeight: 90
  },

  // Page 18-19 - Incident Timeframe Table
  {
    type: 'table',
    table: {
      headers: ['Reportable incident', 'Required timeframe'],
      rows: [
        ['death of a person with disability', '24 hours'],
        ['serious injury of a person with disability', '24 hours'],
        ['abuse or neglect of a person with disability', '24 hours'],
        ['unlawful sexual or physical contact with, or assault of, a person with disability', '24 hours'],
        ['sexual misconduct committed against, or in the presence of, a person with disability, including grooming of the person for sexual activity', '24 hours'],
        ['the use of a restrictive practice in relation to a person with disability if the use is not in accordance with a required state or territory authorisation and/or not in accordance with a behaviour support plan.', 'Five business days']
      ]
    },
    estimatedHeight: 250
  },
  // Page 19 - Complaints and Feedback
  {
    type: 'section_header',
    label: 'Complaints and Feedback',
    meta: { className: 'text-center font-bold' },
    estimatedHeight: 30
  },
  {
    type: 'paragraph',
    content: 'Your feedback allows us to provide you with high-quality services; we actively seek your input. Feedback can be provided using our feedback form which is available as an online form on our website. Alternatively, a physical copy can be provided on request to your support worker, manager or our management team. We would like your feedback on:',
    estimatedHeight: 90
  },
  {
    type: 'list',
    items: [
      'quality of care received',
      'consistency of services provided',
      'support worker performance',
      'supports that work for you',
      'changes you want made to assist you',
      'what you like and dislike about our services'
    ],
    estimatedHeight: 120
  },

  // Page 20 - Complaint Information
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

  // Page 21 - How to Submit Complaints
  {
    type: 'paragraph',
    content: 'Please send your complaints addressed to the Complaint Manager via any of the below means:',
    estimatedHeight: 40
  },
  {
    type: 'table',
    table: {
      headers: ['Method', 'Details'],
      rows: [
        ['Email:', 'admin@infinitysupportswa.org'],
        ['Postal address:', 'Complete Form02 Complaint Report Form should you wish to remain anonymous do not fill in the participant details and mail it to PO BOX 4275, Baldivis 6171'],
        ['Phone', 'Speak to your support worker or coordinator\nCall us on 0493282661 or 0493141688\n(Monday to Friday 8.30 am to 4.30pm)'],
        ['Website', 'visit our website and complete an online complaint/feedback form.\nhttps://infinitysupportswa.org/feedback-and-complaints/']
      ]
    },
    estimatedHeight: 200
  },
  {
    type: 'paragraph',
    content: 'Once a complaint has been received, Infinity Supports WA will investigate the complaint and find a resolution. The Managing Director will write a letter to confirm that your complaint has been received. This letter will provide you with the expected date Infinity Supports WA of the complaint resolution.',
    estimatedHeight: 90
  },
  {
    type: 'paragraph',
    content: 'The complaint will then be investigated, and a plan to resolve it created. You will be informed of this plan, and we will ask you to provide your opinion on our recommended solution. You can advise if you are happy with the proposed solution or unhappy with the outcome and feel the matter is not resolved. Any ongoing issue could be identified by tracking and analysing feedback and complaint data. As a part of the continuous improvement process, the feedback, complaints and dispute resolution will be discussed in management team meetings regularly.',
    estimatedHeight: 130
  },

  // Page 22 - External Complaint Organizations
  {
    type: 'paragraph',
    content: 'If you are not happy with the solution proposed by Infinity Supports WA regarding your complaint, you can speak to other organisations, such as:',
    estimatedHeight: 50
  },
  {
    type: 'contact_block',
    contacts: [
      {
        title: 'Commonwealth Ombudsman – Disability Services',
        telephone: '1300 362 072',
        email: 'ombudsman@ombudsman.gov.au',
        website: 'www.ombudsman.gov.au'
      },
      {
        title: 'NDIS Complaints',
        telephone: '1800 800 110',
        email: 'feedback@ndis.gov.au',
        website: 'https://www.ndis.gov.au/contact/feedback-and-complaints'
      }
    ],
    estimatedHeight: 160
  },
  {
    type: 'paragraph',
    content: 'Individuals can make a complaint directly to the following agencies at any time they wish to:',
    estimatedHeight: 40
  },
  {
    type: 'agency_list',
    agencies: [
      { name: 'Commission for Children and Young People', color: '#f97316' },
      { name: 'NDIS Commissions, Complaints, Integrity and Privacy Unit', color: '#ea580c' },
      { name: 'Ombudsman', color: '#fb923c' },
      { name: 'The National Disability Insurance Agency (NDIA)', color: '#fdba74' },
      { name: 'Office of the Commissioner for Privacy and Data Protection', color: '#fed7aa' },
      { name: 'Independent Broad-based Anti-Corruption Commission (IBAC)', color: '#9ca3af' },
      { name: 'Disability Services Commission', color: '#6b7280' }
    ],
    estimatedHeight: 200
  },

  // Page 23 - Elimination Of Restrictive Practices
  {
    type: 'section_header',
    label: 'Elimination Of Restrictive Practices',
    estimatedHeight: 30
  },
  {
    type: 'paragraph',
    content: 'Infinity Supports WA is dedicated to actively working towards reducing and ultimately eliminating the use of restrictive practices.',
    estimatedHeight: 50
  },
  {
    type: 'paragraph',
    content: 'Infinity Supports WA pledges to ensure that restrictive practices are employed only under extremely limited and specific circumstances, as a final resort, utilizing the least intrusive methods and for the shortest duration necessary. Such practices should be proportionate and justified, serving to safeguard the rights and safety of the individual or others.',
    estimatedHeight: 100
  },
  {
    type: 'paragraph',
    content: 'Infinity Supports WA is committed to providing suitable support and monitoring in an environment tailored to the unique needs of participants exhibiting cognitive or intellectual disabilities or behaviours that pose, or have the potential to pose, harm.',
    estimatedHeight: 90
  },
  {
    type: 'paragraph',
    content: 'Infinity Supports WA is dedicated to upholding the rights, safety, and well-being of individuals within our Organisation. We firmly believe in recognizing the purpose behind every behaviour and responding appropriately to resolve issues, including those exhibited by individuals posing potential harm and those diagnosed with mental illnesses.',
    estimatedHeight: 100
  },
  {
    type: 'paragraph',
    content: 'Infinity Supports WA will adhere to the regulations outlined in the National Disability Insurance Scheme (Restrictive Practices and Behaviour Support) Rules 2018, and the Disability (NDIS Transition) Amendment Act 2019.',
    estimatedHeight: 70
  },

  // Page 24 - Restrictive Practices Continued
  {
    type: 'paragraph',
    content: 'Infinity Supports WA is committed to ensuring that our services consistently meet established standards, with a primary focus on safeguarding and advancing the human rights of all participants.',
    estimatedHeight: 60
  },
  {
    type: 'paragraph',
    content: 'Infinity Supports WA provides participants with protection against inhumane or degrading treatment, while also prioritizing personal dignity, privacy, self-respect, and individual needs.',
    estimatedHeight: 70
  },
  {
    type: 'paragraph',
    content: 'Infinity Supports WA is committed to maintaining a safe working environment for all staff and workers.',
    estimatedHeight: 50
  },
  {
    type: 'paragraph',
    content: 'Infinity Supports WA is committed to regularly reviewing the use of restrictive practices, including incident reporting where applicable, assessing appropriateness and exploring alternatives, and providing aggregated reports.',
    estimatedHeight: 80
  },
  {
    type: 'paragraph',
    content: 'In instances of challenging behaviour, Infinity Supports WA will employ a positive behaviour support approach.',
    estimatedHeight: 50
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
