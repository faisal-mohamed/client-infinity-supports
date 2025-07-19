import React from 'react'
import Page1 from './page_1'
import Page2 from './page_2'
import Page3 from './page_3'
import Page4 from './page_4';

export const formSchema : any = {
  page1: {
    title: "Support Coordination Action Plan",
  sections: [
    {
      title: "1. Participant Details",
      fields: [
        { key: "participantName", label: "Name", type: "text" },
        { key: "ndisNumber", label: "NDIS number", type: "text" },
        { key: "planDates", label: "Plan Dates", type: "text" },
        { key: "dob", label: "DOB", type: "text" },
        { key: "gender", label: "Gender", type: "text" },
        { key: "address", label: "Address", type: "text" },
        { key: "email", label: "Email Address", type: "text" },
        { key: "phone", label: "Phone", type: "text" },
        { key: "preferredContactPerson", label: "Preferred Contact Person", type: "text" },
        { key: "communicationConsiderations", label: "Communication considerations", type: "text" }
      ]
    },
    {
      title: "2. Preferred Contact (Plan Nominee / Family Member)",
      fields: [
        { key: "contactName", label: "Name", type: "text" },
        { key: "relationship", label: "Relationship to participant", type: "text" },
        { key: "contactAddress", label: "Address", type: "text" },
        { key: "contactPhone", label: "Contact phone number", type: "text" },
        { key: "contactEmail", label: "Email Address", type: "text" },
        { key: "funding", label: "Funding", type: "multi-checkbox", options: ["Plan managed", "Self-managed", "NDIA managed", "Other"] }
      ]
    },
    {
      title: "3. NDIS Participant’s Goals",
      fields: [
        { key: "goals", label: "Goals", type: "textarea" }
      ]
    }
  ]
  },
   page2: {
    title: "Support Requirements",
    sections: [
      {
        title: "CORE SUPPORTS",
        fields: [
          { key: "coreSupportText", label: "", type: "textarea" },
          { key: "corePreferredProviders", label: "Preferred providers", type: "textarea" },
          { key: "coreAlternativeProviders", label: "Alternative providers", type: "textarea" },
          { key: "coreAgreementSigned", label: "Service Agreement developed/signed?", type: "checkbox-yes-no" },
          { key: "coreSupportsCommenced", label: "Supports have commenced", type: "text" },
          { key: "coreBudgetApproved", label: "Discussion held with Plan Manager and budget approved?", type: "checkbox-yes-no" }
        ]
      },
      {
        title: "CAPACITY BUILDING",
        fields: [
          { key: "capacitySupportText", label: "", type: "textarea" },
          { key: "capacityPreferredProviders", label: "Preferred providers", type: "textarea" },
          { key: "capacityAlternativeProviders", label: "Alternative providers", type: "textarea" },
          { key: "capacityAgreementSigned", label: "Service Agreement developed/signed?", type: "checkbox-yes-no" },
          { key: "capacitySupportsInPlace", label: "Supports in place at start of plan", type: "text" },
          { key: "capacityAssessmentRequired", label: "Are additional assessments required?", type: "checkbox-dual", options: ["Yes", "No"] },
          { key: "capacityActions", label: "If Yes - Actions", type: "text" },
          { key: "capacityBudgetApproved", label: "Discussion held with Plan Manager and budget approved?", type: "checkbox-yes-no" }
        ]
      },
      {
        title: "CAPITAL",
        fields: [] // Can be filled as needed later
      }
    ]
  },
  page3:  {
  title: "Support Coordination Action Plan",
  sections: [
    {
      title: "NDIS FUNDED SUPPORTS",
      fields: [
        { key: "supportRequired1", label: "Support Required", type: "textarea" },
        { key: "preferredProviders1", label: "Preferred providers", type: "textarea" },
        { key: "alternativeProviders1", label: "Alternative providers", type: "textarea" },
        { key: "serviceAgreement1", label: "Service Agreement developed/signed?", type: "checkbox-yes-no" },
        { key: "additionalAssessment1", label: "Are additional assessments required to access this support type?", type: "checkbox-dual", options: ["Yes", "No"] },
        { key: "assessmentActions1", label: "If Yes - Actions", type: "text" },
        { key: "planManagerDiscussion1", label: "Discussion held with Plan Manager and budget approved?", type: "checkbox-yes-no" }
      ]
    },
    {
      title: "MAINSTREAM SUPPORTS & SERVICES",
      fields: [
        { key: "supportRequired2", label: "Support Required", type: "textarea" },
        { key: "preferredProviders2", label: "Preferred providers", type: "textarea" },
        { key: "alternativeProviders2", label: "Alternative providers", type: "textarea" },
        { key: "serviceAgreement2", label: "Service Agreement developed/signed?", type: "checkbox-yes-no" },
        { key: "additionalAssessment2", label: "Are additional assessments required to access this support type?", type: "checkbox-dual", options: ["Yes", "No"] },
        { key: "assessmentActions2", label: "If Yes - Actions", type: "text" }
      ]
    }
  ]
},
 page4: {
    title: 'Support Coordination Action Plan',
    budgetApproval: {
      key: 'budgetApproval',
      label: 'Discussion held with Plan Manager and budget approved?'
    },
    goalsSection: {
      title: '5. Goals and funding required for next plan',
      key: 'goalsText'
    },
    signatures: {
      participant: { key: 'participantSignature', label: "Participant’s or Participant’s Representative’s Signature" },
      author: { key: 'authorSignature', label: "Author’s Signature" }
    }
  }


  
};


// export const formData  = {
//   participantName: "Jordan Taylor",
//   ndisNumber: "4312 6789 1011",
//   planDates: "01/01/2025 - 31/12/2025",
//   dob: "12/06/2000",
//   gender: "Male",
//   address: "123 Example Street, Perth WA",
//   email: "jordan.t@example.com",
//   phone: "0456 789 123",
//   preferredContactPerson: "Sam Taylor",
//   communicationConsiderations: "Requires interpreter for Auslan",
//   contactName: "Sam Taylor",
//   relationship: "Parent",
//   contactAddress: "123 Example Street, Perth WA",
//   contactPhone: "0456 789 124",
//   contactEmail: "sam.taylor@example.com",
//   funding: ["Plan managed", "NDIA managed"],
//   goals: `Goal 1. Improve communication skills\nGoal 2. Increase independence in travel\nGoal 3. Attend community workshops\nGoal 4. Build social connections\nGoal 5. Improve health and fitness\nGoal 6. Learn budgeting skills\nGoal 7. Obtain part-time employment`,

//   //page2
//   coreSupportText: "",
//   corePreferredProviders: "1. Provider A",
//   coreAlternativeProviders: "1. Provider X\n2. Provider Y",
//   coreAgreementSigned: "Yes",
//   coreSupportsCommenced: "Commenced on 01/01/2025",
//   coreBudgetApproved: "No",
//   capacitySupportText: "",
//   capacityPreferredProviders: "1. Capacity Co.",
//   capacityAlternativeProviders: "1. Backup Capacity Provider",
//   capacityAgreementSigned: "Yes",
//   capacitySupportsInPlace: "Supports established before plan",
//   capacityAssessmentRequired: "Yes",
//   capacityActions: "Functional capacity evaluation required",
//   capacityBudgetApproved: "Yes",

//   //page3
//     supportRequired1: "Daily Living Assistance",
//   preferredProviders1: "1. Provider A\n2. Provider B",
//   alternativeProviders1: "1. Alt Provider A\n2. Alt Provider B",
//   serviceAgreement1: "Yes",
//   additionalAssessment1: "Yes",
//   assessmentActions1: "Referral required from OT",
//   planManagerDiscussion1: "Yes",

//   supportRequired2: "Public Transport Access",
//   preferredProviders2: "1. Provider C\n2. Provider D",
//   alternativeProviders2: "1. Local Bus Service\n2. Volunteer Drivers",
//   serviceAgreement2: "No",
//   additionalAssessment2: "No",
//   assessmentActions2: "yes",


//   //page4
//       budgetApproval: 'Yes',
//     goalsText: '1. Improve independence at home\n2. Gain employment support\n3. Increase community access and mobility',
//     participantSignature: 'John Doe',
//     participantDate: '2025-07-19',
//     authorSignature: 'Jane Smith',
//     authorDate: '2025-07-20'
  

// };


const ScheduleForSupport = ({formData, settings, commonFields} : any ) => {
  return (
    <div>
        <Page1 schema={formSchema.page1} data={formData} settings={settings}/>
        <Page2 schema={formSchema.page2} data={formData} settings={settings}/>
        <Page3 schema={formSchema.page3} data={formData} settings={settings}/>
        <Page4 schema={formSchema.page4} data={formData} settings={settings}/>
        
    </div>
  )
}

export default ScheduleForSupport