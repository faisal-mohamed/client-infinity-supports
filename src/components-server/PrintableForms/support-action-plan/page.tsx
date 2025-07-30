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
    { key: "goal1", label: "Goal 1", type: "text" },
    { key: "goal2", label: "Goal 2", type: "text" },
    { key: "goal3", label: "Goal 3", type: "text" },
    { key: "goal4", label: "Goal 4", type: "text" },
    { key: "goal5", label: "Goal 5", type: "text" },
    { key: "goal6", label: "Goal 6", type: "text" },
    { key: "goal7", label: "Goal 7", type: "text" }
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
        { key: "preferredProviders1", label: "Preferred providers 1", type: "textarea" },

        {key: "preferredProvidersCapital2", label: "Preferred providers 2", type: "textarea" },

        { key: "alternativeProviders1", label: "Alternative providers 1", type: "textarea" },
                { key: "alternativeProvidersCapital2", label: "Alternative providers 2", type: "textarea" },

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
        { key: "preferredProviders2", label: "Preferred providers 1", type: "textarea" },

        { key: "preferredProvidersMainstream2", label: "Preferred providers 2", type: "textarea" },
        { key: "alternativeProviders2", label: "Alternative providers 1", type: "textarea" },

        { key: "alternativeProvidersMainstream2", label: "Alternative providers 2", type: "textarea" },
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




const ScheduleForSupport = ({ settings, commonFieldsData, formData, images} : any ) => {
  return (
    <div>
        <Page1 schema={formSchema.page1} data={formData} settings={settings} commonFieldsData={commonFieldsData} images={images}/>
        <Page2 schema={formSchema.page2} data={formData} settings={settings} commonFieldsData={commonFieldsData} images={images}/>
        <Page3 schema={formSchema.page3} data={formData} settings={settings} commonFieldsData={commonFieldsData} images={images}/>
        <Page4 schema={formSchema.page4} data={formData} settings={settings} commonFieldsData={commonFieldsData} images={images}/>
        
    </div>
  )
}

export default ScheduleForSupport