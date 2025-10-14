import React from 'react'
import Page1 from './page_1';
import Page2 from './page_2';



const  formSchema = {
 page1: {
     generalInfo: [
    { key: 'drillDate', label: 'Date of Drill', type: 'text' },
    { key: 'drillTime', label: 'Time of Drill', type: 'text' },
    { key: 'clientName', label: 'Client’s Name  (if applicable)', type: 'text' },
    { key: 'supportWorkers', label: 'Support Worker(s) Involved', type: 'text' },
    { key: 'supervisorNotified', label: 'Supervisor/Manager Notified', type: 'radio', options: ['Yes', 'No'] }
  ],
  drillTypes: {
    key: 'selectedDrillType',
    label: 'Type of Emergency Drill Conducted',
    type: 'select',
    options: [
      { value: 'Fire or smoke emergency', label: 'Fire or smoke emergency' },
      { value: 'Medical emergency (e.g., client collapse, choking, seizure)', label: 'Medical emergency (e.g., client collapse, choking, seizure)' },
      { value: 'Gas leak or carbon monoxide alert', label: 'Gas leak or carbon monoxide alert' },
      { value: 'Power outage', label: 'Power outage' },
      { value: 'Natural disaster (e.g., flood, earthquake)', label: 'Natural disaster (e.g., flood, earthquake)' },
      { value: 'Security threat (e.g., unauthorized visitor, break-in)', label: 'Security threat (e.g., unauthorized visitor, break-in)' },
      { value: 'Other (specify)', label: 'Other (specify)' }
    ],
    otherField: {
      key: 'otherDrill',
      label: 'Please specify other drill type',
      type: 'text',
      showWhen: 'Other (specify)'
    }
  },
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
      { key: 'planUpdateNeeded', label: 'Updates needed for the client’s emergency plan?', type: 'radio', options: ['Yes', 'No'] },
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


// export const formData = {
//   drillDate: '2025-07-17',
//   drillTime: '10:30 AM',
//   clientName: 'John Doe',
//   supportWorkers: 'Alice, Bob',
//   supervisorNotified: 'Yes',
//   fire: true,
//   medical: false,
//   gas: true,
//   power: false,
//   natural: false,
//   security: true,
//   otherDrill: 'Cybersecurity lockdown drill',
//   planFollowed: 'Yes',
//   safetyProtocols: 'Yes',
//   servicesContacted: 'No',
//   clientResponse: 'Participated calmly and followed instructions.',
//   supportAction: 'Evacuated the client safely and reported to supervisor.',

//   //page2
//   whatWentWell: 'Evacuation process was smooth.',
//   challenges: 'Client hesitated to leave bedroom.',
//   unexpectedIssues: 'Alarm did not trigger automatically.',
//   procedureChanges: 'Install more visible exit signs.',
//   additionalTrainingRequired: 'Yes',
//   trainingDetails: 'Need refresher on fire extinguisher use.',
//   planUpdateNeeded: 'No',
//   planUpdateDetails: 'yes',
//   debriefConducted: 'Yes',
//   supervisorComments: 'Good job handling unexpected alarm issue.',
//   nextDrillDate: '2025-10-10',
//   supportWorkerSignature: 'Jane Doe',
//   supervisorSignature: 'Mark Smith',
//   signatureDate: '2025-07-18'
// };


const EmergencyDrill = ({formData, commonFieldsData, settings, images} : any) => {

  
  return (
    <div>
        <Page1 schema={formSchema.page1} data={formData} commonFieldsData={commonFieldsData} settings={settings} images={images} />
        <Page2 schema={formSchema.page2} data={formData} commonFieldsData={commonFieldsData} settings={settings} images={images} />
    </div>
  )
}

export default EmergencyDrill