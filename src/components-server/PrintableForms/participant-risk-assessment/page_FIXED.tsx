import React from 'react'
import Page1 from './page_1_FIXED'
import Page2 from './page_2_FIXED'
import Page3 from './page_3_FIXED'
import Page4 from './page_4_FIXED'
import Page5 from './page_5_FIXED'
import Page6 from './page_6_FIXED'
import Page7 from './page_7_FIXED'
import Page8 from './page_8_FIXED'
import Page9 from './page_9_FIXED'
import Page10 from './page_10_FIXED'
import Page11 from './page_11_FIXED'
import Page12 from './page_12_FIXED'
// import Page8 from './page_8_FIXED'
// import Page9 from './page_9_FIXED'
// import Page10 from './page_10_FIXED'
// import Page11 from './page_11_FIXED'
// import Page12 from './page_12_FIXED'
import Page13 from './page_13_FIXED'

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
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
  
  * {
    font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  }
  
  .font-montserrat {
    font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  }
  
  /* Ensure consistent rendering across different environments */
  .pdf-container {
    font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
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

export const riskAssessmentSchema: any = {
  page1: {
    participantDetails: [
      { key: "ndisNumber", label: "NDIS Number", type: "text" },
      { key: "givenNames", label: "Given name/s", type: "text" },
      { key: "familyName", label: "Family name", type: "text" },
      { key: "preferredName", label: "Preferred name", type: "text" },
      { key: "dob", label: "Date of birth", type: "date" },
      { key: "address", label: "Address", type: "text" },
      { key: "phoneNumber", label: "Phone No", type: "text" },
      {
        key: "preferredContact",
        label: "Preferred contact method",
        type: "text",
      },
      { key: "email", label: "Email", type: "text" },
    ],
    knownMedicalConditions: [
      { key: "medicalSpecify", label: "Specify", type: "text" },
      { key: "medicalEffect", label: "Effect", type: "text" },
      { key: "medicalTreatment", label: "Treatment", type: "text" },
    ],
    emergencyContact: [
      { key: "emergencyContactName", label: "Name/s", type: "text" },
      { key: "emergencyContactPhone", label: "Phone", type: "text" },
      { key: "emergencyContactEmail", label: "Email", type: "text" },
    ],
    personsInvolved: [
      {
        key: "participantInvolved",
        label: "Was participant involved?",
        type: "radio",
        options: ["Yes", "No"],
      },
      { key: "participantInvolvedReason", label: "Reason", type: "text" },
      { key: "staffInvolved", label: "Staff involved", type: "text" },
      { key: "othersInvolved", label: "Others involved", type: "text" },
    ],
  },
  page2: {
    fields: [
      {
        key: "risk1",
        label: "Is the client able to open door?",
      },
      {
        key: "risk2",
        label: "Is there a safe evacuation point at your home?",
        commentLabel: "Location",
      },
      {
        key: "risk3",
        label:
          "Is the service to be provided at night or outside of normal working hours?",
      },
      {
        key: "risk4",
        label: "Are there the any expressive language concerns?",
      },
      {
        key: "risk5",
        label:
          "Has relevant medical history been communicated including potential risk situations?",
      },
      {
        key: "risk6",
        label: "Does the Participant have any road safety skills?",
      },
      {
        key: "risk7",
        label: "Can the participant travel in an unmodified vehicle?",
      },
      {
        key: "risk8",
        label: "Can the participant use public transport?",
      },
      {
        key: "risk9",
        label: "Is the client known to be affected by crowds?",
      },
    ],
  },
  page3: {
    fields: [
      {
        key: "noiseSensitive",
        label: "Is the client affected by noises or sudden sounds?",
        type: "checkbox-yesno",
      },
      {
        key: "familyBehavioralHistory",
        label:
          "Is there a history of any family members with behavioural issues?",
        type: "checkbox-yesno",
      },
      {
        key: "behaviorPractitionerInvolved",
        label: "Is there a behaviour practitioner involved?",
        type: "checkbox-yesno",
      },
      {
        key: "mobilityIssues",
        label:
          "Does the client have mobility issues? (e.g., wheelchair or other?)",
        type: "checkbox-yesno",
      },
      {
        key: "showeringToiletingHazards",
        label:
          "Have hazards associated with showering, sponging and toileting been considered? (e.g., manual handling/ slips trips and falls/ biological hazards/ humidity, etc.)",
        type: "checkbox-yesno",
      },
      {
        key: "medicationRespDepression",
        label:
          "Does the participant take any of the following medications that can cause Respiratory Depression?",
        type: "multi-checkbox",
        options: [
          "Benzodiazepines",
          "Opioids",
          "Polypharmacy",
          "Psychotropic polypharmacy",
          "Combination of any of the above medications",
        ],
      },
      {
        key: "medicationRiskYesNo",
        label: "Do these medications pose a risk?",
        type: "checkbox-yesno",
      },
      {
        key: "medicationRiskComment",
        label: "If yes, please specify and capture this in the controls table",
        type: "text",
      },
    ],
  },
  page4: {
    fields: [
      {
        key: "promptMedicationRequired",
        label: "Prompt Medication Required",
        type: "checkbox",
      },
      {
        key: "assistanceMedicationRequired",
        label: "Assistance of Medication Required",
        type: "checkbox",
      },
      {
        key: "adminMedicationRequired",
        label: "Administration of Medication Required",
        type: "checkbox",
      },
      {
        key: "noMedicationRequired",
        label: "NO – This participant does not require medication management",
        type: "checkbox",
      },
    ],
  },
  page5: {
    fields: [
      {
        key: "riskLevelLow",
        label: "Select Low Risk Level",
        type: "checkbox",
      },
      {
        key: "riskLevelModerate",
        label: "Select Moderate Risk Level",
        type: "checkbox",
      },
    ],
  },
  page6: {
    fields: [
      {
        key: "riskLevelHigh",
        label: "High Risk Level Selected",
        type: "checkbox",
      },
      {
        key: "riskLevelCritical",
        label: "Critical Risk Level Selected",
        type: "checkbox",
      },
    ],
  },
  page7: {
    title: "Risk Assessment Table",
    householdMeetingPoint: [
      { key: "householdSafeAddress", label: "Address", type: "text" },
      { key: "householdSafeDesc", label: "Description", type: "text" },
    ],
    riskRows: [
      { issue: "issue1", score: "score1", control: "control1", person: "person1" },
      { issue: "issue2", score: "score2", control: "control2", person: "person2" },
      { issue: "issue3", score: "score3", control: "control3", person: "person3" },
      { issue: "issue4", score: "score4", control: "control4", person: "person4" },
      { issue: "issue5", score: "score5", control: "control5", person: "person5" },
      { issue: "issue6", score: "score6", control: "control6", person: "person6" },
      { issue: "issue7", score: "score7", control: "control7", person: "person7" },
      { issue: "issue8", score: "score8", control: "control8", person: "person8" },
      { issue: "issue9", score: "score9", control: "control9", person: "person9" },
      { issue: "issue10", score: "score10", control: "control10", person: "person10" },
    ],
  },
  page11: {
    communicationTable: {
      fields: [
        {
          key: "scenario1",
          label: "Possible scenarios of concern",
          type: "text"
        },
        {
          key: "mode1",
          label: "Mode of communication",
          type: "text"
        },
        {
          key: "scenario2",
          label: "Possible scenarios of concern",
          type: "text"
        },
        {
          key: "mode2",
          label: "Mode of communication",
          type: "text"
        }
      ]
    }
  },
  page12: {
    fields: [
      { key: 'additionalNotes', label: 'Additional Notes', type: 'textarea' },
      { key: 'reviewComments', label: 'Review Comments', type: 'textarea' }
    ]
  },
  page13: {
    fields: [
      { key: 'authorisedBy', label: 'Authorised by:', type: 'text' },
      { key: 'role', label: 'Role:', type: 'text' },
      { key: 'signature', label: 'Signature:', type: 'text' },
      { key: 'signatureDate', label: 'Date:', type: 'date' },
      { key: 'guardianSignature', label: 'Participant / Guardian Signature:', type: 'signature' },
      { key: 'guardianDate', label: 'Date:', type: 'date' },
      { key: 'copySupplied', label: 'Is a copy supplied to the participant?', type: 'checkbox' },
      { key: 'copyOnFile', label: 'Copy placed on file?', type: 'checkbox' },
      { key: 'reviewDate', label: 'Date for Review:', type: 'date' }
    ]
  }
};

const ParticipantRiskAssessment = ({ formData, commonFieldsData, settings, images }: any) => {
  return (
    <div className="pdf-container font-montserrat">
      <style dangerouslySetInnerHTML={{ __html: PDF_FONT_STYLES }} />
      <Page1 schema={riskAssessmentSchema.page1} formData={formData} commonFieldsData={commonFieldsData} settings={settings} images={images} />
      <Page2 schema={riskAssessmentSchema.page2} data={formData} commonFieldsData={commonFieldsData} settings={settings} images={images} />
      <Page3 schema={riskAssessmentSchema.page3} formData={formData} commonFieldsData={commonFieldsData} settings={settings} images={images} />
      <Page4 schema={riskAssessmentSchema.page4} data={formData} commonFieldsData={commonFieldsData} settings={settings} images={images} />
      <Page5 schema={riskAssessmentSchema.page5} data={formData} commonFieldsData={commonFieldsData} settings={settings} images={images} />
      <Page6 schema={riskAssessmentSchema.page6} data={formData} commonFieldsData={commonFieldsData} settings={settings} images={images} />
      <Page7 schema={riskAssessmentSchema.page7} data={formData} commonFieldsData={commonFieldsData} settings={settings} images={images} />
      <Page8 schema={riskAssessmentSchema.page7} data={formData} commonFieldsData={commonFieldsData} settings={settings} images={images} />
      <Page9 schema={riskAssessmentSchema.page9} data={formData} commonFieldsData={commonFieldsData} settings={settings} images={images} />
      <Page10 data={formData} commonFieldsData={commonFieldsData} settings={settings} schema={riskAssessmentSchema.page12} images={images} />
      <Page11 data={formData} schema={riskAssessmentSchema.page11} commonFieldsData={commonFieldsData} settings={settings} images={images} />
      <Page12 data={formData} commonFieldsData={commonFieldsData} settings={settings} schema={riskAssessmentSchema.page12} images={images} />
      {/* <Page8 schema={riskAssessmentSchema.page7} data={formData} commonFieldsData={commonFieldsData} settings={settings} images={images} />
      <Page9 schema={riskAssessmentSchema.page9} data={formData} commonFieldsData={commonFieldsData} settings={settings} images={images} />
      <Page10 schema={riskAssessmentSchema.page10} data={formData} commonFieldsData={commonFieldsData} settings={settings} images={images} />
      <Page11 data={formData} schema={riskAssessmentSchema.page11} commonFieldsData={commonFieldsData} settings={settings} images={images} />
      <Page12 commonFieldsData={commonFieldsData} settings={settings} images={images} /> */} 
      <Page13 schema={riskAssessmentSchema.page13} data={formData} commonFieldsData={commonFieldsData} settings={settings} images={images} />
    </div>
  )
}

export default ParticipantRiskAssessment
