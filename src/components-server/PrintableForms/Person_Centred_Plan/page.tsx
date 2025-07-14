import React from 'react'
import Page2 from './page_2';
import Page3 from './page_3';
import Page4 from './page_4';
import Page5 from './page_5';
import Page1 from './page_1';
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
      { key: 'goal', label: 'Goal', type: 'textarea' },
      { key: 'rating', label: 'Outcome Rating', type: 'text' },
      { key: 'actions', label: 'Actions & Resources', type: 'textarea' },
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


const PersonCentredPlan = ({ formKey, commonFieldsData, settings, formData, images} : any ) => {
  return (
    <div className="bg-gray-100 min-h-screen py-8 print:bg-white print:py-0">
      <Page1 formSchema={formSchema.page1} commonFieldsData={commonFieldsData} settings={settings} data={formData} images={images} />
      <Page2 formSchema={formSchema.page2}  commonFieldsData={commonFieldsData} settings={settings} data={formData} images={images} />
      <Page3 formSchema={formSchema.page3}   commonFieldsData={commonFieldsData} settings={settings} data={formData} images={images}/> 
      <Page4 formSchema={formSchema.page4}   commonFieldsData={commonFieldsData} settings={settings} data={formData} images={images}/>  
      <Page5 formSchema={formSchema.page5}   commonFieldsData={commonFieldsData} settings={settings} data={formData} images={images}/>
    </div>
  )
}

export default PersonCentredPlan
