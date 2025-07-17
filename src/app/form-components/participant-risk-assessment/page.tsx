import React, {  } from "react";
import A4PageWrapper from "./A4PageWrapper";
import Page1 from "./page_1";
import Page2 from "./page_2";
import Page3 from "./page_3";
import Page4 from "./page_4";
import Page5 from "./page_5";
import Page6 from "./page_6";
import Page8 from "./page_8";
import Page7 from "./page_7";
import Page9 from "./page_9";
import Page10 from "./page_10";
import Page11 from "./page_11";
import Page12 from "./page_12";
import Page13 from "./page_13";

export const riskAssessmentSchema : any = {
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
    { key: "safeMeetingAddress", label: "Address", type: "text" },
    { key: "safeMeetingDescription", label: "Description", type: "text" },
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
}

};

// export const formData = {
//   ndisNumber: "NDIS-1234567890",
//   givenNames: "John",
//   familyName: "Doe",
//   preferredName: "Johnny",
//   dob: "1990-05-20",
//   address: "123 Main Street, Perth",
//   phoneNumber: "0412 345 678",
//   preferredContact: "Phone",
//   email: "john.doe@example.com",
//   medicalSpecify: "Asthma",
//   medicalEffect: "Breathing difficulty",
//   medicalTreatment: "Inhaler",
//   emergencyContactName: "Jane Doe",
//   emergencyContactPhone: "0412 876 543",
//   emergencyContactEmail: "jane.doe@example.com",
//   participantInvolved: "Yes",
//   participantInvolvedReason: "N/A",
//   staffInvolved: "Support Worker 1",
//   othersInvolved: "Family Member",
//   //Page 2
//   risk1: "yes",
//   risk1Rating: "L",
//   risk1Comment: "",
//   risk2: "no",
//   risk2Rating: "M",
//   risk2Comment: "Front lawn evacuation zone",
//   risk3: "yes",
//   risk3Rating: "H",
//   risk3Comment: "Support required during night shift",
//   risk4: "no",
//   risk4Rating: "",
//   risk4Comment: "",
//   risk5: "yes",
//   risk5Rating: "M",
//   risk5Comment: "",
//   risk6: "yes",
//   risk6Rating: "L",
//   risk6Comment: "",
//   risk7: "yes",
//   risk7Rating: "L",
//   risk7Comment: "",
//   risk8: "no",
//   risk8Rating: "H",
//   risk8Comment: "Not trained on public transport",
//   risk9: "no",
//   risk9Rating: "L",
//   risk9Comment: "Avoids crowd proactively",
//   //Page 3
//   noiseSensitive: "yes",
//   noiseSensitiveComment: "Loud noises cause anxiety",
//   noiseSensitiveRating: "M",
//   familyBehavioralHistory: "yes",
//   familyBehavioralHistoryComment: "History of anxiety in family",
//   familyBehavioralHistoryRating: "M",
//   behaviorPractitionerInvolved: "no",
//   behaviorPractitionerInvolvedComment: "No current involvement",
//   behaviorPractitionerInvolvedRating: "N/A",
//   mobilityIssues: "no",
//   mobilityIssuesComment: "No mobility issues reported",
//   mobilityIssuesRating: "N/A",
//   showeringToiletingHazards: "yes",
//   showeringToiletingHazardsComment: "Slippery floor hazard",
//   showeringToiletingHazardsRating: "M",
//   medicationRespDepression: [
//     "Benzodiazepines",
//     "Opioids",
//     "Polypharmacy",
//     "Psychotropic polypharmacy",
//     "Combination of any of the above medications",
//   ],
//   medicationRiskYesNo: "yes",
//   medicationRiskComment: "Needs monitoring and documented control plan",
//   medicationRespDepressionRating: "H",

//   //Page 4
//   promptMedicationRequired: "yes",
//   assistanceMedicationRequired: "no",
//   adminMedicationRequired: "no",
//   noMedicationRequired: "yes",
//   //Page 5
//   riskLevelLow: true,
//   riskLevelModerate: false,

//   //page 6
//   riskLevelHigh: true,
//   riskLevelCritical: false,

//   //page 7 and page 8
//   description: "Near the park gate",

//   // Page 7 rows
//   issue1: "Fire evacuation",
//   score1: "2",
//   control1: "Evacuation plan in place",
//   person1: "Support Worker",

//   issue2: "Gas leak",
//   score2: "3",
//   control2: "Gas shutoff training",
//   person2: "Caregiver",

//   issue3: "Medication error",
//   score3: "4",
//   control3: "Double-check procedure",
//   person3: "Registered Nurse",

//   issue4: "Electrical hazard",
//   score4: "2",
//   control4: "Sockets checked monthly",
//   person4: "Maintenance Staff",

//   // Page 8 rows
//   issue5: "Infection outbreak",
//   score5: "5",
//   control5: "PPE provided",
//   person5: "Admin",

//   issue6: "Fall risk",
//   score6: "3",
//   control6: "Handrails installed",
//   person6: "Occupational Therapist",

//   issue7: "Flooding",
//   score7: "1",
//   control7: "Drainage system",
//   person7: "Building Manager",

//   issue8: "Aggressive behavior",
//   score8: "4",
//   control8: "De-escalation training",
//   person8: "Support Worker",

//   issue9: "Power outage",
//   score9: "2",
//   control9: "Backup generator",
//   person9: "Supervisor",

//   issue10: "Transport delay",
//   score10: "1",
//   control10: "Alternative transport booked",
//   person10: "Logistics Officer",

//   //page 13
//   authorisedBy: 'Jane Smith',
//   role: 'Coordinator',
//   signature: 'Signed digitally',
//   signatureDate: '2025-07-15',
//   guardianSignature: 'John Doe',
//   guardianDate: '2025-07-15',
//   copySupplied: 'yes',
//   copyOnFile: 'no',
//   reviewDate: '2025-08-01',

//   //page 11
//   scenario1: "Client unable to speak due to anxiety",
//   mode1: "Uses picture cards",
//   scenario2: "Client disoriented in a new environment",
//   mode2: "Body movement and hand gestures"

// };

const ParticipantRiskAssessment = ({formData, commonFieldsData, settings}: any) => {
  const totalPages = 13;



  return (
    <div className="bg-gray-100 min-h-screen py-8">
        <Page1 schema={riskAssessmentSchema.page1} formData={formData} commonFieldsData={commonFieldsData} settings={settings} />
        <Page2 schema={riskAssessmentSchema.page2} data={formData} commonFieldsData={commonFieldsData} settings={settings}  />
        <Page3 schema={riskAssessmentSchema.page3} formData={formData} commonFieldsData={commonFieldsData} settings={settings}  />
        <Page4 schema={riskAssessmentSchema.page4} data={formData} commonFieldsData={commonFieldsData} settings={settings}  />
        <Page5 schema={riskAssessmentSchema.page5} data={formData} commonFieldsData={commonFieldsData} settings={settings}  />
        <Page6 schema={riskAssessmentSchema.page6} data={formData}  commonFieldsData={commonFieldsData} settings={settings} />
        <Page7 schema={riskAssessmentSchema.page7} data={formData} commonFieldsData={commonFieldsData} settings={settings}  />
 
        <Page8 schema={riskAssessmentSchema.page7} data={formData}  commonFieldsData={commonFieldsData} settings={settings} />
      
        <Page9 schema={riskAssessmentSchema.page9} data={formData} commonFieldsData={commonFieldsData} settings={settings} />
        <Page10 schema={riskAssessmentSchema.page10} data={formData} commonFieldsData={commonFieldsData} settings={settings} />
        <Page11 data={formData} schema={riskAssessmentSchema.page11} commonFieldsData={commonFieldsData} settings={settings} />

        <Page12 commonFieldsData={commonFieldsData} settings={settings} />

        <Page13 schema={riskAssessmentSchema.page13} data={formData} commonFieldsData={commonFieldsData} settings={settings} />
    </div>
  );
};

export default ParticipantRiskAssessment;
