import React from 'react'
import ContentAwarePagination from './components/ContentAwarePagination';
import './print-styles.css';

export const formSchema  : any = {
    page1: {
        logoPath: '/infinity_logo.png',
        mainImagePath: '/person_centred_plan_cover_image.png',
    },
  page2: {
    fields: [
      { label: 'Name', key: 'name', type: 'text' },
      { label: 'Address', key: 'address', type: 'text' },
      { label: 'Date of Birth', key: 'dob', type: 'date' },
      { label: 'Parent/guardian', key: 'guardian', type: 'text' },
      { label: 'Address', key: 'guardianAddress', type: 'text' },
      { label: 'Contact Number', key: 'contactNumber', type: 'text' },
      { label: 'Disability', key: 'disability', type: 'text' },
      { label: 'NDIS Number', key: 'ndisNumber', type: 'text' },
      { label: 'My Story', key: 'myStory', type: 'textarea', height: '120px' },
      { label: 'Strengths', key: 'strengths', type: 'textarea', height: '80px' },
      { label: 'Challenges', key: 'challenges', type: 'text' },
      { label: 'Allergies', key: 'allergies', type: 'text' },
    ],
  },
  page3: {
    fields: [
      { label: 'History of Respiratory Depression', key: 'respiratoryHistory', type: 'textarea' },
      { label: 'Precautions', key: 'precautions', type: 'textarea' },
      { label: 'Health Conditions', key: 'healthConditions', type: 'textarea' },
      { label: 'Companion Card', key: 'companionCard', type: 'text' },
      { label: 'Ambulance Cover', key: 'ambulanceCover', type: 'text' },
      {
        label: 'Proactive & preventative healthcare prompts',
        key: 'healthcarePrompt',
        type: 'checkbox',
        options: ['Yes', 'No'],
        description: 'Does the participant require support to organize regular medical & dental check ups',
        note: '(If yes, coordinator to set annual reminders to prompt and assist participant to organize annual health checks)',
      },
    ],
  },
page4: {
  goals: {
    type: 'table',
    columns: [
      { key: 'goal', 
          label: 'GOAL',
          type: 'textarea' ,
          subLabel: "Be specific and concise. Include the measure and time frame."
        },
        { key: 'rating', label: 'Outcome Rating', type: 'text', subLabel: 'Each goal needs to be marked as one of thebelow:',
          subRating: ['Not Achieved', 'Partly Achieved', 'Completely Achieved', 'Withdrawn', 'New Goal']
         },
        { key: 'actions', label: 'Actions & Resources', type: 'textarea', subLabel: 'What needs to be put in place to support the participant to achieve the goal? What resources and skills are needed?' },
        { key: 'byWhom', label: 'By Whom', type: 'text' },
        { key: 'byWhen', label: 'By When', type: 'date' },
        { key: 'reviewDate', label: 'Review Date', type: 'date' },
    ],
  },
},
page5: {
  fields: [
    { key: 'pbsSupportPlanIncluded', label: 'PBS Support Plan included?', type: 'text' },
    { key: 'restrictivePractices', label: 'Any Restrictive Practices?', type: 'text' },
    { key: 'organizationName', label: 'Name of organization:', type: 'text' },
    { key: 'contactPersonOrg', label: 'Contact person:', type: 'text' },
    { key: 'contactNumberOrg', label: 'Contact number:', type: 'text' },
  ],
  informalSupports: {
    type: 'table',
    rows: 4,
    columns: [
      { key: 'support', label: 'Informal Support', type: 'text' },
      { key: 'role', label: 'Role', type: 'text' },
      { key: 'frequency', label: 'Frequency', type: 'text' },
    ],
  },
}
};

// export const formData = {
//   // Page 2 & 3 fields
//   name: 'John Doe',
//   address: '123 Main Street',
//   dob: '1990-05-15',
//   guardian: 'Jane Doe',
//   guardianAddress: '456 Elm Street',
//   contactNumber: '0412345678',
//   disability: 'Autism',
//   ndisNumber: 'NDIS-1234567890',
//   myStory: 'I love art and community activities...',
//   strengths: 'Creativity, patience',
//   challenges: 'Communication',
//   allergies: 'Peanuts',
//   respiratoryHistory: 'None',
//   precautions: 'Mask in public',
//   healthConditions: 'Asthma',
//   companionCard: 'Yes',
//   ambulanceCover: 'Yes',
//   healthcarePrompt: 'Yes',

//   // Page 4 - Flattened table values
//   goal1: 'Improve social interaction by attending one group activity per week for 6 months.',
//   rating1: 'Partly achieved',
//   actions1: 'Weekly community group sessions and support staff for transport.',
//   byWhom1: 'Support Worker',
//   byWhen1: '2025-08-31',
//   reviewDate1: '2026-03-15',

//   goal2: 'Gain part-time employment in retail by the end of the year.',
//   rating2: 'New Goal',
//   actions2: 'Enroll in job-readiness workshops and resume preparation.',
//   byWhom2: 'Employment Coach',
//   byWhen2: '2025-12-31',
//   reviewDate2: '2026-01-15',

//   goal3: 'Learn cooking skills by completing a 4-week cooking class.',
//   rating3: 'Completely achieved',
//   actions3: 'Cooking class registration and weekly attendance support.',
//   byWhom3: 'Coordinator',
//   byWhen3: '2025-06-30',
//   reviewDate3: '2025-08-01',

//   //page5
//   pbsSupportPlanIncluded: 'Yes',
//   restrictivePractices: 'None',
//   organizationName: 'CareCompanion Services',
//   contactPersonOrg: 'Emily Watts',
//   contactNumberOrg: '0423 456 789',

//   support1: 'Mother',
//   role1: 'Emotional and daily care',
//   frequency1: 'Daily',

//   support2: 'Brother',
//   role2: 'Transport to appointments',
//   frequency2: 'Weekly',

//   support3: 'Friend',
//   role3: 'Social outings',
//   frequency3: 'Fortnightly',

//   support4: 'Neighbor',
//   role4: 'Emergency contact',
//   frequency4: 'Occasionally',
// };

const PersonCentredPlan = ({ formKey, commonFieldsData, settings, formData, images} : any ) => {
  return (
    <div className="bg-gray-100 min-h-screen print:bg-white print:py-0">
      {/* Fixed width container that will zoom out on mobile */}
      <div className="w-[900px] mx-auto py-8 print:py-0">
        <ContentAwarePagination
          formData={formData}
          commonFieldsData={commonFieldsData}
          settings={settings}
          images={images}
        />
      </div>
    </div>
  )
}

export default PersonCentredPlan
