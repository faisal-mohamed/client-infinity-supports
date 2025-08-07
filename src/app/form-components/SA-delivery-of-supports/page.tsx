import React, { useEffect } from "react";
import Page1 from "./page_1";
import Page2 from "./page_2";
import Page3 from "./page_3";
import Page4 from "./page_4";
import Page5 from "./page_5";
import Page6 from "./page_6";
import Page7 from "./page_7";
import Page8 from "./page_8";
import Page9 from "./page_9";

const formSchema  : any = {
  page1: {
    fields: [
      { key: "agreementDate", label: "Date", type: "date" },
      { key: "ndisNumber", label: "NDIS Number", type: "text" },
      { key: "surname", label: "Surname", type: "text" },
      { key: "givenNames", label: "Given name(s)", type: "text" },
      {
        key: "sex",
        label: "Sex",
        type: "checkbox-group",
        options: ["Male", "Female", "Prefer not to say", "Others"],
      },
      { key: "pronoun", label: "Pronoun", type: "text" },
      {
        key: "indigenousStatus",
        label: "Aboriginal or Torres Strait Islander?",
        type: "checkbox-group",
        options: ["Yes", "No"],
      },
      { key: "preferredName", label: "Preferred name", type: "text" },
      { key: "dob", label: "Date of Birth", type: "date" },
      { key: "street", label: "Number / Street", type: "text" },
      { key: "state", label: "State", type: "text" },
      { key: "postcode", label: "Postcode", type: "text" },
      { key: "email", label: "Email address", type: "text" },
      { key: "homePhone", label: "Home Phone No", type: "text" },
      { key: "mobilePhone", label: "Mobile No", type: "text" },
    ],
  },
  page2: {
    fields: [
      {
        key: "subjectToSection73G",
        label: "Is this participant subject to Section 73 G of the NDIS Act? (If yes please refer to the  Provider responsibility section for further information) ",
        type: "checkbox",
      },
      {
        key: "isNonVerbal",
        label: "Is this participant non-verbal? (If yes refer complete the mode of communication section of the participant risk assessment) ",
        type: "checkbox",
      },
      {
        key: "noCopyRequested",
        label: "Participant may wish not to receive a copy of this agreement. In this case, they shall tick the dedicated tick box at the end of the service agreement and sign the document. ",
        type: "checkbox",
      },
      {
        key: "planAttached",
        label:
          "A copy of the Individual’s plan is attached to this Service Agreement.",
        type: "checkbox",
      },
      {
        key: "planNotAttached",
        label: "Individual chooses not to attach their plan.",
        type: "checkbox",
      },
    ],
  },
  page3: {
  fields: [
    {
      key: "selfManaged",
      label:
        "The Individual has chosen to self-manage the funding for NDIS supports provided under this Service Agreement. After providing those supports, Infinity Supports WA will send the Individual an invoice for those supports for the Individual to pay. The Individual will pay the invoice within 7 days.",
      type: "checkbox",
    },
    {
      key: "nomineeManaged",
      label:
        "The Individual’s Nominee manages the funding for supports provided under this Service  Agreement. After providing those supports, Infinity Support WA will send the Individual’s  Nominee an invoice for those supports for the Individual’s Nominee to pay. The Individual’s Nominee will pay the invoice within 7 days.",
      type: "checkbox",
    },
    {
      key: "ndiaManaged",
      label:
        "The Individual has nominated the NDIA to manage the funding for supports provided under this Service Agreement. After providing those supports, Infinity Supports WA will claim payment for those supports from the NDIA. ",
      type: "checkbox",
    },
    {
      key: "planManagerManaged",
      label:
        "The Individual has nominated the Plan Management Provider to manage the funding for NDIS supports provided under this Service Agreement...",
      type: "checkbox",
      additionalFields: [
        { key: "planManagerName", label: "Plan Management Provider", type: "text" },
        { key: "fundingSource", label: "Funding Source", type: "text" },
      ],
    },
  ],
},

  page4: {
    sections: {
      providerResponsibilities: [
        "Review the provision of supports with the Individual in line with the applicable requirements.",
        "Once agreed, provide supports that meet the Individual’s needs at the Individual’s preferred times.",
        "Communicate openly and honestly in a timely manner.",
        "Treat the Individual with courtesy and respect.",
        "Consult the Individual on decisions about how supports are provided.",
        "Give the Individual information about managing any complaints or disagreements and details of Infinity Supports WA cancellation policy (if relevant)",
        "Listen to the Individual’s feedback and resolve problems in a timely manner.",
        "Where possible, give the Individual a minimum of 24 hours’ notice if Infinity Supports WA must change a scheduled appointment to provide supports.",
        "Give the Individual the required notice if Infinity Supports WA needs to end the Service Agreement (see ‘Ending this Service Agreement’ below for more information)",
        "Protect the Individual’s privacy and confidential information.",
        "Provide supports in a manner consistent with all relevant laws, including but not limited to, the National Disability Insurance Scheme Act 2013 and rules, and the Australian Consumer Law; keep accurate records on the supports provided to the Individual.",
      ],
      individualResponsibilitiesHeading:
        "Responsibilities of Individual / Individual’s representative",
    },
  },

  page5: {
    responsibilities: [
      "Pay for additional expenses (i.e. things that are not included as part of an Individual’s supports) that are not included in the cost of the supports. Examples include entrance fees, event tickets, meals, etc.",
      "If the individual requires buddy shifts to assist with the introduction of new workers, and this is the desired method by the individual or their family, Infinity Supports WA may claim for up to 6 hours of weekday support per year from the individual’s plan.",
      "Inform Infinity Supports WA about how they wish the supports to be delivered to meet the Individual’s needs.",
      "Treat Infinity Supports WA with courtesy and respect.",
      "Talk to Infinity Supports WA if the Individual has any concerns about the supports being provided.",
      `Give Infinity Supports WA a minimum of seven days’ notice if the Individual cannot make a scheduled appointment; and if the notice is not provided by them, then
     Infinity Supports WA’s cancellation policy will apply in line with the current NDIS Price Guide.`,
      "Give Infinity Supports WA the required notice if the Individual needs to end the Service Agreement (see ‘Ending this Service Agreement’ below for more information).",
      "Let Infinity Supports WA know immediately if the Individual’s plan/ funding is suspended or replaced by a new plan or the Individual’s funding ceases.",
      "Will update Infinity Supports WA of any changes in circumstances including any changes to living arrangements including addresses, medication, behaviour, contact details or health of the individual which may affect service provision.",
      "Will supply all medication in a webster pack with a pharmacy generated signing sheet.",
    ],
  },

  page9: {
    fields: [
      {
        key: "mediaConsent",
        label:
          "Hereby give consent to Infinity Supports WA to obtain and images and likeness of myself. I give permission for Infinity Supports WA to use such images on media releases including social media and branding & promotion ",
        type: "radio",
        options: ["Yes", "No"],
      },
      {
        key: "infoSharingConsent",
        label:
          "Hereby give consent to Infinity Supports WA to obtain & share relevant documented information regarding my service. This may include but not limited to: ",
        type: "radio",
        options: ["Yes", "No"],
        subItems: [
          "Legal Guardian/Next of Kin",
          "GP/health care professional",
          "Therapy providers",
          "Plan Managers",
          "Others: ____________________________________________",
        ],
      },
      {
  key: "othersInfoSharingConsent",
  label: "If Others, specify",
  type: "text"
},
      {
        key: "moneyHandlingConsent",
        label:
          "I  consent for staff to assist me (the participant) with handling my money (e.g. Buying Lunch) and assisting with my personal property, receipts will be provided for all purchases ",
        type: "radio",
        options: ["Yes", "No"],
      },
      {
        key: "ndisAuditConsent",
        label:
          "I consent to take part in a NDIS audit and my documents be reviewed as required. ",
        type: "radio",
        options: ["Yes", "No"],
      },
      {
        key: "participantSignature",
        label: "Signature of participant",
        type: "signature",
      },
      {
        key: "participantSignatureDate",
        label: "Date of participant signature",
        type: "date",
      },
      {
        key: "participantName",
        label: "Name of participant",
        type: "text",
      },
      {
        key: "nomineeSignature",
        label: "Signature of nominee",
        type: "signature",
      },
      {
        key: "nomineeSignatureDate",
        label: "Date of nominee signature",
        type: "date",
      },
      {
        key: "nomineeName",
        label: "Name of nominee",
        type: "text",
      },
      {
        key: "providerSignature",
        label: "Signature on behalf of Infinity Supports WA",
        type: "signature",
      },
      {
        key: "providerSignatureDate",
        label: "Date of provider signature",
        type: "date",
      },
      {
        key: "providerName",
        label: "Name of provider representative",
        type: "text",
      },
    ],
  },
};



const SADeliverySupports = ({formData, commonFieldsData, settings} : any) => {

  return (
    <div className="bg-gray-100 min-h-screen print:bg-white print:py-0">
      {/* Fixed width container that will zoom out on mobile */}
      <div className="w-[900px] mx-auto py-8 print:py-0">
      <Page1 schema={formSchema.page1} data={formData} settings={settings} commonFieldsData={commonFieldsData} />

      <Page2 schema={formSchema.page2} data={formData} settings={settings} commonFieldsData={commonFieldsData} />
      <Page3 schema={formSchema.page3} data={formData} settings={settings} commonFieldsData={commonFieldsData} />
      <Page4 schema={formSchema.page4} data={formData} settings={settings} commonFieldsData={commonFieldsData} />
      <Page5 schema={formSchema.page5} data={formData} settings={settings} commonFieldsData={commonFieldsData} />

      <Page6 settings={settings} />
      <Page7  settings={settings}/>
      <Page8 settings={settings} />
      <Page9 schema={formSchema.page9} data={formData} settings={settings} commonFieldsData={commonFieldsData} />
      </div>
    </div>
  );
};

export default SADeliverySupports;
