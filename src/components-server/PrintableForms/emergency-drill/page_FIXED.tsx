import React from 'react'
import Page1_FIXED from './page_1_FIXED';
import Page2_FIXED from './page_2_FIXED';

// ===== TYPOGRAPHY CONSTANTS =====
export const A4_PDF_TYPOGRAPHY = {
  title: 'text-base font-semibold',        // 16px
  sectionHeader: 'text-sm font-medium',    // 14px  
  body: 'text-xs',                         // 12px
  footer: 'text-[10px]'                    // 10px
};

// ===== STANDARD LOGO CONFIGURATION =====
export const STANDARD_LOGO = {
  width: 180,
  height: 72,
  className: "object-contain"
};

// ===== PDF FONT STYLES =====
export const PDF_FONT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
  
  .font-montserrat {
    font-family: 'Montserrat', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

const formSchema = {
 page1: {
     generalInfo: [
    { key: 'drillDate', label: 'Date of Drill', type: 'text' },
    { key: 'drillTime', label: 'Time of Drill', type: 'text' },
    { key: 'clientName', label:  `Client's Name  (if applicable)`, type: 'text' },
    { key: 'supportWorkers', label: 'Support Worker(s) Involved', type: 'text' },
    { key: 'supervisorNotified', label: 'Supervisor/Manager Notified', type: 'radio', options: ['Yes', 'No'] }
  ],
  drillTypes: [
    { key: 'fire', label: 'Fire or smoke emergency', type: 'checkbox' },
    { key: 'medical', label: 'Medical emergency  (e.g., client collapse, choking, seizure)', type: 'checkbox' },
    { key: 'gas', label: 'Gas leak or carbon monoxide alert', type: 'checkbox' },
    { key: 'power', label: 'Power outage', type: 'checkbox' },
    { key: 'natural', label: 'Natural disaster  (e.g., flood, earthquake)', type: 'checkbox' },
    { key: 'security', label: 'Security threat  (e.g., unauthorized visitor, break-in) ', type: 'checkbox' },
    { key: 'otherDrill', label: 'Other (specify)', type: 'text' }
  ],
  executionDetails: [
    { key: 'planFollowed', label: 'Was the emergency plan followed?', type: 'radio', options: ['Yes', 'No'] },
    { key: 'safetyProtocols', label: 'Were all safety measures and protocols implemented?', type: 'radio', options: ['Yes', 'No'] },
    { key: 'servicesContacted', label: 'Emergency services contacted?  (if applicable)', type: 'radio', options: ['Yes', 'No'] },
    { key: 'clientResponse', label: 'Client response and involvement', type: 'text' },
    { key: 'supportAction', label: 'Support worker actions', type: 'text' }
  ]
 },
 page2: {
    observations: [
      { key: 'whatWentWell', label: 'What went well?', type: 'text' },
      { key: 'challenges', label: 'What difficulties or challenges were encountered?', type: 'text' },
      { key: 'unexpectedIssues', label: 'Any unexpected issues?', type: 'text' }
    ],
    recommendations: [
      { key: 'procedureChanges', label: 'Suggested changes to procedures', type: 'text' },
      { key: 'additionalTrainingRequired', label: 'Additional training or support required?', type: 'radio', options: ['Yes', 'No'] },
      { key: 'trainingDetails', label: 'If yes, specify', type: 'text' },
      { key: 'planUpdateNeeded', label: `Updates needed for the client's emergency plan?`, type: 'radio', options: ['Yes', 'No'] },
      { key: 'planUpdateDetails', label: 'If yes, specify', type: 'text' }
    ],
    followup: [
      { key: 'debriefConducted', label: 'Debrief conducted?', type: 'radio', options: ['Yes', 'No'] },
      { key: 'supervisorComments', label: 'Supervisor/Manager Comments', type: 'text' },
      { key: 'nextDrillDate', label: 'Date of Next Scheduled Drill', type: 'text' }
    ],
    signatures: [
      { key: 'supportWorkerSignature', label: 'Support Worker', type: 'text' },
      { key: 'supervisorSignature', label: 'Supervisor/Manager', type: 'text' },
      { key: 'signatureDate', label: 'Date', type: 'text' }
    ]
  }
};

const EmergencyDrill_FIXED = ({formData, commonFieldsData, settings, images} : any) => {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PDF_FONT_STYLES }} />
      <div>
        <Page1_FIXED schema={formSchema.page1} data={formData} commonFieldsData={commonFieldsData} settings={settings} images={images} />
        <Page2_FIXED schema={formSchema.page2} data={formData} commonFieldsData={commonFieldsData} settings={settings} images={images} />
      </div>
    </>
  )
}

export default EmergencyDrill_FIXED
