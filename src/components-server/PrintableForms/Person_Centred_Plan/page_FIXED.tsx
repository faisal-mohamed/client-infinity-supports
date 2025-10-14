import React from 'react'
import PersonCentredPlan from '../../../app/form-components/person_centred_plan/page';

// ===== A4 PDF TYPOGRAPHY STANDARDS WITH MONTSERRAT =====
export const A4_PDF_TYPOGRAPHY = {
  // Main content hierarchy with improved line spacing
  title: 'text-base font-bold font-montserrat leading-relaxed',           // 16px - Form titles
  sectionHeader: 'text-sm font-semibold font-montserrat leading-relaxed', // 14px - Section headers
  subHeader: 'text-xs font-semibold font-montserrat leading-relaxed',     // 12px - Subsection headers
  body: 'text-xs font-normal font-montserrat leading-relaxed',            // 12px - Main content
  label: 'text-xs font-medium font-montserrat leading-relaxed',           // 12px - Field labels
  input: 'text-xs font-normal font-montserrat leading-relaxed',           // 12px - Input content
  small: 'text-xs font-normal font-montserrat leading-relaxed',           // 10px - Fine print
  footer: 'text-xs font-normal font-montserrat leading-normal',           // 10px - Footer content
  
  // Table specific
  tableHeader: 'text-xs font-bold font-montserrat leading-tight',         // 12px - Table headers
  tableCell: 'text-xs font-normal font-montserrat leading-relaxed',       // 12px - Table content
  
  // Signature section
  signatureLabel: 'text-xs font-semibold font-montserrat leading-relaxed', // 12px - Signature labels
  signatureContent: 'text-xs font-bold font-montserrat leading-relaxed',   // 12px - Signature content
} as const;

// ===== PDF-SPECIFIC FONT STYLES =====
export const PDF_FONT_STYLES = `
  * {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
  }
  
  .font-montserrat {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
  }
  
  /* Ensure consistent rendering across different environments */
  .pdf-container {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
` as const;

// ===== STANDARDIZED LOGO CONFIGURATION =====
export const STANDARD_LOGO = {
  width: 180,
  height: 72,
  className: "object-contain"
} as const;

export const formSchema: any = {
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

const PersonCentredPlan_FIXED = ({ formKey, commonFieldsData, settings, formData, images }: any) => {
  // Create enhanced settings with logo image
  const enhancedSettings = {
    ...settings,
    logoImage: images?.infinityLogo
  };

  return (
    <div className="pdf-container font-montserrat">
      <style dangerouslySetInnerHTML={{ __html: PDF_FONT_STYLES }} />
      <PersonCentredPlan
        formKey={formKey}
        formData={formData}
        commonFieldsData={commonFieldsData}
        settings={enhancedSettings}
        images={images}
      />
    </div>
  )
}

export default PersonCentredPlan_FIXED
