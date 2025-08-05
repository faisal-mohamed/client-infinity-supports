import React from 'react'
import Page1 from './page1';
import Page2 from './page2';
import Page3 from './page3';
import Page4 from './page4';
import Page5 from './page5';
import Page6 from './page6';
import Page7 from './page7';

const formSchema = {
    page1: {
        title: "Service Agreement Support Coordination - Section 1",
  fields: [
    { key: "date", label: "Date", type: "date" },

    { key: "surname", label: "Surname", type: "text" },
    { key: "givenNames", label: "Given name(s)", type: "text" },

    {
      key: "sex",
      label: "Sex",
      type: "radio",
      options: ["Male", "Female", "Prefer not to say", "Others"]
    },

    { key: "pronoun", label: "Pronoun", type: "text" },

    {
      key: "indigenousDescent",
      label: "Are you of Aboriginal or Torres Strait Islander descent?",
      type: "radio",
      options: ["Yes", "No"]
    },

    { key: "preferredName", label: "Preferred name", type: "text" },
    { key: "dob", label: "Date of Birth", type: "date" },

    { key: "address", label: "Number / Street", type: "text" },
    { key: "state", label: "State", type: "text", default: "WA" },
    { key: "postcode", label: "Postcode", type: "text" },

    { key: "email", label: "Email address", type: "email" },
    { key: "homePhone", label: "Home Phone No", type: "text" },
    { key: "mobile", label: "Mobile No", type: "text" },

    {
      key: "noCopyRequested",
      label: "Participant may wish not to receive a copy of this agreement",
      type: "checkbox"
    },
    {
      key: "planAttached",
      label: "A copy of the Individual’s plan is attached",
      type: "checkbox"
    },
    {
      key: "planNotAttached",
      label: "Individual chooses not to attach their plan",
      type: "checkbox"
    }
  ]
    },
    page2: {
        title: "Schedule of Support",
  fields: [
    {
      key: "scheduleTable",
      label: "Schedule of Supports",
      type: "table",
      columns: [
        { key: "supportCategory", label: "Support Category", type: "text" },
        { key: "weeks", label: "Weeks", type: "text" },
        { key: "totalHours", label: "Total Hours", type: "text" },
        { key: "costPerHour", label: "Cost per hr", type: "currency" },
        { key: "totalCost", label: "Total Cost", type: "currency" }
      ]
    },
    {
      key: "conflictDeclaration",
      label: "Conflict of Interest Declaration",
      type: "text"
    },
    {
      key: "conflictOptions",
      label: "Conflict of Interest - Providers Considered",
      type: "list", // for 3 entries
      itemType: "text"
    }
  ]
    },
    page3: {
     
  title: "Infinity Supports WA Service Agreement - Page 3",
  fields: [
    { key: "signature", label: "Signed", type: "text" },
    { key: "printName", label: "Print Name", type: "text" },
    { key: "signDate", label: "Date", type: "date" },

    { key: "selfManaged", label: "Self-managed funding", type: "checkbox" },
    { key: "nomineeManaged", label: "Nominee managed funding", type: "checkbox" },
    { key: "ndiaManaged", label: "NDIA managed funding", type: "checkbox" },
    { key: "planManagerManaged", label: "Plan Manager managed funding", type: "checkbox" },

    { key: "planManagerName", label: "Plan Manager Name", type: "text" },
    { key: "planManagerEmail", label: "Email", type: "email" }
  ]
},
page7: {
   
  title: "Consent Form",
  fields: [
    {
      key: "consentMedia",
      label: "Consent to use images on media and promotional content",
      type: "radio",
      options: ["Yes", "No"]
    },
    {
      key: "consentInfoShare",
      label: "Consent to obtain and share relevant documented information",
      type: "radio",
      options: ["Yes", "No"]
    },
    {
      key: "consentAudit",
      label: "Consent to take part in an NDIS audit and document review",
      type: "radio",
      options: ["Yes", "No"]
    },
    {
      key: "participantSignature",
      label: "Signature of participant",
      type: "text"
    },
    {
      key: "participantDate",
      label: "Participant Date",
      type: "date"
    },
    {
      key: "participantName",
      label: "Participant Name",
      type: "text"
    },
    {
      key: "nomineeSignature",
      label: "Signature of Nominee",
      type: "text"
    },
    {
      key: "nomineeDate",
      label: "Nominee Date",
      type: "date"
    },
    {
      key: "nomineeName",
      label: "Nominee Name",
      type: "text"
    },
    {
      key: "staffSignature",
      label: "Signature on behalf of Infinity Supports WA",
      type: "text"
    },
    {
      key: "staffDate",
      label: "Staff Date",
      type: "date"
    },
    {
      key: "staffName",
      label: "Staff Name",
      type: "text"
    }
  ]
}

}
    



// export const formData = {
//   date: "",
//   surname: "",
//   givenNames: "",
//   sex: "",
//   pronoun: "",
//   indigenousDescent: "",
//   preferredName: "",
//   dob: "",
//   address: "",
//   state: "WA",
//   postcode: "",
//   email: "",
//   homePhone: "",
//   mobile: "",
//   noCopyRequested: false,
//   planAttached: false,
//   planNotAttached: false,
//   supportCategory1: "07_001_0106_8_3 Level 1 Support Connection",
//   weeks1: "123",
//   totalHours1: "",
//   costPerHour1: "$74.63",
//   totalCost1: "",

//   supportCategory2: "07_002_0106_8_3 Level 2 Support Coordination",
//   weeks2: "",
//   totalHours2: "",
//   costPerHour2: "$100.14",
//   totalCost2: "",

//   supportCategory3: "07_101_0106_6_3 Psychosocial Recovery Coaching",
//   weeks3: "",
//   totalHours3: "",
//   costPerHour3: "$98.30",
//   totalCost3: "",

//   conflictDeclaration: "Mohamed",
//   conflictOption1: "",
//   conflictOption2: "",
//   conflictOption3: "",


//   //page 3
//   signature: "John Doe",
//   printName: "Johnathan Doe",
//   signDate: "2025-08-04",

//   selfManaged: true,
//   nomineeManaged: false,
//   ndiaManaged: true,
//   planManagerManaged: false,

//   planManagerName: "PlanPro Manager",
//   planManagerEmail: "planpro@example.com",

//   //page 7
//    consentMedia: "Yes",
//   consentInfoShare: "No",
//   consentAudit: "Yes",

//   participantSignature: "John Doe",
//   participantDate: "2025-08-04",
//   participantName: "John Doe",

//   nomineeSignature: "Jane Smith",
//   nomineeDate: "2025-08-04",
//   nomineeName: "Jane Smith",

//   staffSignature: "Michael Staff",
//   staffDate: "2025-08-04",
//   staffName: "Michael Staff",
// };


const SASupportCoordination = ({formKey, formData, settings, commonFieldsData} : any ) => {
  return (
    <div>
        <Page1 data={formData} settings={settings} commonFieldsData={commonFieldsData} />
        <Page2 data={formData} settings={settings} commonFieldsData={commonFieldsData}/>
        <Page3 data={formData} settings={settings} commonFieldsData={commonFieldsData}/>
        <Page4 settings={settings} commonFieldsData={commonFieldsData}/>
        <Page5 settings={settings} commonFieldsData={commonFieldsData}/>
        <Page6 settings={settings} commonFieldsData={commonFieldsData}/>
        <Page7 data={formData} settings={settings} commonFieldsData={commonFieldsData}/>
    </div>
  )
}

export default SASupportCoordination;