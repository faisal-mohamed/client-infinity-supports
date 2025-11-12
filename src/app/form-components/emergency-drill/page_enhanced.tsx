import React from 'react';
import ContentAwarePagination from './components/ContentAwarePagination';

const formSchema = {
  page1: {
    // Section 1: General Information
    generalInfo: [
      { key: 'drillDate', label: 'Date of Drill', type: 'text' },
      { key: 'drillTime', label: 'Time of Drill', type: 'text' },
      { key: 'clientName', label: 'Client\'s Name (if applicable)', type: 'text' },
      { key: 'supportWorkers', label: 'Support Worker(s) Involved', type: 'text' },
      { key: 'supervisorNotified', label: 'Supervisor/Manager Notified', type: 'radio', options: ['Yes', 'No'] }
    ],
    
    // Section 2: Type of Emergency Drill Conducted
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
    }
  },
  
  page2: {
    // Section 3: Drill Execution Details
    executionDetails: [
      { key: 'planFollowed', label: 'Was the emergency plan followed?', type: 'radio', options: ['Yes', 'No'] },
      { key: 'safetyProtocols', label: 'Were all safety measures and protocols implemented?', type: 'radio', options: ['Yes', 'No'] },
      { key: 'servicesContacted', label: 'Emergency services contacted? (if applicable)', type: 'radio', options: ['Yes', 'No'] },
      { key: 'clientResponse', label: 'Client response and involvement', type: 'textarea' },
      { key: 'supportAction', label: 'Support worker actions', type: 'textarea' }
    ],

    // Section 4: Observations & Challenges
    observations: [
      { key: 'whatWentWell', label: 'What went well?', type: 'textarea' },
      { key: 'challenges', label: 'What difficulties or challenges were encountered?', type: 'textarea' },
      { key: 'unexpectedIssues', label: 'Any unexpected issues?', type: 'textarea' }
    ],
    
    // Section 5: Recommendations & Improvements
    recommendations: [
      { key: 'procedureChanges', label: 'Suggested changes to procedures', type: 'textarea' },
      { key: 'additionalTrainingRequired', label: 'Additional training or support required?', type: 'radio', options: ['Yes', 'No'] },
      { key: 'trainingDetails', label: 'If yes, specify', type: 'textarea' },
      { key: 'planUpdateNeeded', label: 'Updates needed for the client\'s emergency plan?', type: 'radio', options: ['Yes', 'No'] },
      { key: 'planUpdateDetails', label: 'If yes, specify', type: 'textarea' }
    ],
    
    // Section 6: Follow-Up Actions
    followup: [
      { key: 'debriefConducted', label: 'Debrief conducted?', type: 'radio', options: ['Yes', 'No'] },
      { key: 'supervisorComments', label: 'Supervisor/Manager Comments', type: 'textarea' },
      { key: 'nextDrillDate', label: 'Date of Next Scheduled Drill', type: 'text' }
    ],
    
    // Section 7: Signatures
    signatures: [
      { key: 'supportWorkerSignature', label: 'Support Worker', type: 'signature' },
      { key: 'supportWorkerSignatureDate', label: 'Support Worker Date', type: 'text' },
      { key: 'supervisorSignature', label: 'Supervisor/Manager', type: 'signature' },
      { key: 'supervisorSignatureDate', label: 'Supervisor Date', type: 'text' }
    ]
  }
};

const EmergencyDrillEnhanced = ({ formData, commonFieldsData, settings }: any) => {
  // Combine both page schemas into one for dynamic pagination
  const combinedSchema = {
    ...formSchema.page1,
    ...formSchema.page2
  };

  return (
    <div className="bg-gray-100 min-h-screen print:bg-white print:py-0">
      <div className="w-[900px] mx-auto py-8 print:py-0">
        <ContentAwarePagination
          schema={combinedSchema}
          data={formData}
          commonFieldsData={commonFieldsData}
          settings={settings}
        />
      </div>
    </div>
  );
};

export default EmergencyDrillEnhanced;
