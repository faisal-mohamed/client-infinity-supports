// // CombinedClientForm.tsx
// "use client";

// import React from "react";

// const formData = {
//   // Page 1
//   date: "",
//   ndisNumber: "",
//   givenName: "",
//   surname: "",
//   sex: [],     // array of selected options
//   sexOther: "", // text if "Others" is filled
//   pronoun: "",
//   aboriginal: [],
//   preferredName: "",
//   dob: "",
//   street: "",
//   state: "",
//   postcode: "",
//   email: "",
//   homePhone: "",
//   mobile: "",
//   disability: "",
//   // Page 2
//   medicalCentre: "",
//   medicalPhone: "",
//   coordinatorName: "",
//   coordinatorEmail: "",
//   coordinatorCompany: "",
//   coordinatorContact: "",
//   otherSupports: "",
//   // Page 3
//   allAboutMe: "",
//   advocateName: "",
//   advocateRelation: "",
//   advocatePhone: "",
//   advocateMobileEmail: "",
//   advocateAddress: "",
//   postalAddress: "",
//   otherInfo: "",
//   culturalBarriers: [],
//   culturalDetails: "",
//   //Page 4
//   primaryContactName: "",
//   primaryRelationship: "",
//   primaryHomePhone: "",
//   primaryMobile: "",
//   secondaryContactName: "",
//   secondaryRelationship: "",
//   secondaryHomePhone: "",
//   secondaryMobile: "",
//   livingArrangements: [],
//   otherLiving: "",
//   travelMethods: [],
//   otherTravel: "",
// };

// const uiSchemaPage1 = [
//   { type: "title", label: "Client Intake Form", colspan: 3 },
//   { type: "field", label: "Date", key: "date", colspan: 2 },
//   { type: "section", label: "Participant Details", colspan: 1 },
//   { type: "field", label: "NDIS Number", key: "ndisNumber", colspan: 2 },
//   {
//   type: "row",
//   fields: [
//     { label: "Given name(s)", key: "givenName", colspan:1  },
//     { label: "Surname", key: "surname", colspan: 1 },
//     {
//       type: "custom",
//       label: "Sex",
//       render: (data : any) => (
//         <div className="space-y-1 text-xs">
//           {["Male", "Female", "Prefer not to say"].map((opt, i) => (
//             <label key={i} className="inline-flex items-center mr-2">
//               <input type="checkbox" className="mr-1" checked={data.sex?.includes(opt)} readOnly />
//               {opt}
//             </label>
//           ))}
//           <div className="mt-1 flex items-center">
//             <span className="mr-2">Others:</span>
//             <span className="border-b border-black w-full">{data.sexOther}</span>
//           </div>
//         </div>
//       ),
//       //colspan: 1,
//       key: "sex" // for tracking
//     }
//   ]
// },

//   { type: "field", label: "Pronoun", key: "pronoun", colspan: 3 },
//   { type: "checkbox-group", label: "Are you an Aboriginal or Torres Strait Island descent?", key: "aboriginal", options: ["Yes", "No"], colspan: 3 },
//   { type: "row", fields: [
//     { label: "Preferred name", key: "preferredName", colspan: 2 },
//     { label: "Date of Birth", key: "dob" }
//   ]},
//   { type: "section", label: "Residential Address Details", colspan: 3 },
//   { type: "field", label: "Number / Street", key: "street", colspan: 3 },
//   { type: "row", fields: [
//     { label: "State", key: "state" },
//     { label: "Postcode", key: "postcode", colspan: 2 }
//   ]},
//   { type: "section", label: "Participant Contact Details", colspan: 3 },
//   { type: "field", label: "Email address", key: "email", colspan: 3 },
//   { type: "row", fields: [
//     { label: "Home Phone No", key: "homePhone" },
//     { label: "Mobile No", key: "mobile", colspan: 2 }
//   ]},
//   { type: "section", label: "Disability Conditions/Disability type(s)", colspan: 3 },
//   { type: "textarea", key: "disability", colspan: 3 }
// ];


// const uiSchemaPage2 = [
//   { type: "title", label: "GP Medical Contact", colspan: 2 },
//   { type: "field", label: "Medical Centre Name", key: "medicalCentre", colspan: 2 },
//   { type: "field", label: "Phone", key: "medicalPhone", colspan: 2 },
//   { type: "section", label: "Support Coordinator", colspan: 2 },
//   { type: "row", fields: [
//     { label: "Name", key: "coordinatorName" },
//     { label: "Email Address", key: "coordinatorEmail" }
//   ]},
//   { type: "row", fields: [
//     { label: "Company", key: "coordinatorCompany" },
//     { label: "Contact number", key: "coordinatorContact" }
//   ]},
//   { type: "title", label: "What other supports including mainstream health services you receive at present", colspan: 2 },
//   { type: "textarea", key: "otherSupports", colspan: 2, height: "h-64" }
// ];

// const uiSchemaPage3 = [
//   { type: "title", label: "All About Me", colspan: 2 },
//   { type: "textarea", key: "allAboutMe", colspan: 2, height: "h-[150px]" },

//   { type: "title", label: "Advocate/representative details (if applicable)", colspan: 2 },
//   {
//     type: "row",
//     fields: [
//       { label: "Name", key: "advocateName" },
//       { label: "Relationship with the participant", key: "advocateRelation" }
//     ]
//   },
//   {
//     type: "row",
//     fields: [
//       { label: "Phone No", key: "advocatePhone" },
//       { label: "Mobile No", key: "advocateMobile" },
//       { label: "Email", key: "advocateEmail" }
//     ]
//   },
//   { type: "field", label: "Address Details", key: "advocateAddress", colspan: 2 },
//   { type: "field", label: "Postal Address Details", key: "postalAddress", colspan: 2 },
//   { type: "textarea", label: "Other Information", key: "otherInfo", colspan: 2 },

//   { type: "title", label: "Personal Situation", colspan: 2 },

//   {
//     type: "checkbox-group",
//     label:
//       "Are there any cultural, communication barriers or intimacy issues that need to be considered when delivering services?",
//     key: "barrierExistence",
//     options: ["Yes", "No"],
//     colspan: 2
//   },

//   {
//     type: "checkbox-group",
//     label: "Verbal communication or spoken language - Is an interpreter needed?",
//     key: "interpreterNeeded",
//     options: ["Yes", "No"],
//     colspan: 2
//   },

//   { type: "field", label: "Language", key: "language", colspan: 2 },
//   {
//     type: "field",
//     label: "Cultural values/ beliefs or assumptions",
//     key: "culturalBeliefs",
//     colspan: 2
//   },
//   {
//     type: "field",
//     label: "Cultural behaviours",
//     key: "culturalBehaviours",
//     colspan: 2
//   },
//   {
//     type: "field",
//     label: "Written communication/literacy",
//     key: "writtenCommunication",
//     colspan: 2
//   },
//   {
//     type: "field",
//     label: "Country of birth",
//     key: "countryOfBirth",
//     colspan: 2
//   }
// ];



// const uiSchemaPage4 = [
//   { type: "title", label: "Primary Contact", colspan: 3 },
//   { type: "row", fields: [
//     { label: "Contact Name", key: "primaryContactName" },
//     { label: "", key: "" },
//     { label: "Relationship", key: "primaryRelationship" }
//   ]},
//   { type: "row", fields: [
//     { label: "Home Phone No", key: "primaryHomePhone" },
//     { label: "", key: "" },
//     { label: "Mobile No", key: "primaryMobile" }
//   ]},
//   { type: "title", label: "Secondary Contact", colspan: 3 },
//   { type: "row", fields: [
//     { label: "Contact Name", key: "secondaryContactName" },
//     { label: "", key: "" },
//     { label: "Relationship", key: "secondaryRelationship" }
//   ]},
//   { type: "row", fields: [
//     { label: "Home Phone No", key: "secondaryHomePhone" },
//     { label: "", key: "" },
//     { label: "Mobile No", key: "secondaryMobile" }
//   ]},
//   { type: "title", label: "Living and Support Arrangements", colspan: 3 },
//   { type: "checkbox-group", key: "livingArrangements", colspan: 3, options: [
//     "Live with Parent/Family/Support Person",
//     "Live in private rental arrangement with others",
//     "Live in private rental arrangement alone",
//     "Owns own home.",
//     "Aged Care Facility",
//     "Mental Health Facility",
//     "Lives in public housing",
//     "Short Term Crisis/Respite",
//     "Staff Supported Group Home",
//     "Hostel/SRS Private Accommodation"
//   ]},
//   { type: "field", label: "Other Living Arrangement", key: "otherLiving", colspan: 3 },
//   { type: "title", label: "Travel", colspan: 3 },
//   { type: "checkbox-group", key: "travelMethods", colspan: 3, options: [
//     "Taxi",
//     "Pick up/ drop off by Parent/Family/Support Person",
//     "Transport by a provider",
//     "Independently use Public Transport",
//     "Walk",
//     "Assisted Public Transport",
//     "Drive own car."
//   ]},
//   { type: "field", label: "Other Travel Method", key: "otherTravel", colspan: 3 }
// ];

// const uiSchemaPage5 = [
//   { type: "title", label: "Behaviours of Concern", colspan: 3 },
//   { type: "checkbox-detail", key: "behavioursOfConcern", detailsKey: "behavioursOfConcernDetail", colspan: 3, label: "Behaviours of concern", options: [
//     "Aggression", "Wandering", "Property damage", "Self-harm", "Sexualised behaviour", "Inappropriate behaviour", "Absconding", "Other"
//   ]},
//   { type: "title", label: "Triggers", colspan: 3 },
//   { type: "textarea", key: "behaviourTriggers", colspan: 3, height: "h-24" },
//   { type: "title", label: "Behaviour Management Strategy", colspan: 3 },
//   { type: "textarea", key: "behaviourStrategy", colspan: 3, height: "h-24" },
//   { type: "field", label: "Behaviour Support Plan Available", key: "behaviourSupportPlan", colspan: 3 },
//   { type: "field", label: "Behaviour Support Practitioner", key: "behaviourPractitioner", colspan: 3 }
// ];

// const uiSchemaPage6 = [
//   { type: "title", label: "Risks", colspan: 3 },
//   { type: "checkbox-detail", key: "riskFactors", detailsKey: "riskFactorDetail", colspan: 3, label: "Identified Risks", options: [
//     "Falls", "Choking", "Medication errors", "Seizures", "Infection", "Travel", "Allergies", "Other"
//   ]},
//   { type: "title", label: "Additional Precautions or Notes", colspan: 3 },
//   { type: "textarea", key: "riskNotes", colspan: 3, height: "h-24" },
//   { type: "title", label: "Medication Summary", colspan: 3 },
//   { type: "textarea", key: "medicationSummary", colspan: 3, height: "h-24" }
// ];

// const uiSchemaPage7 = [
//   { type: "title", label: "Participant Communication & Goals", colspan: 3 },
//   { type: "field", label: "Verbal/Non-verbal", key: "communicationMode", colspan: 3 },
//   { type: "field", label: "Communication Method", key: "communicationMethod", colspan: 3 },
//   { type: "title", label: "Participant Goals", colspan: 3 },
//   { type: "textarea", key: "participantGoals", colspan: 3, height: "h-24" },
//   { type: "title", label: "Support Needs", colspan: 3 },
//   { type: "textarea", key: "supportNeeds", colspan: 3, height: "h-24" }
// ];






// const renderRow = (field: any, data: any) => {
//   if (field.type === "title") {
//     return (
//       <tr key={field.label}>
//         <th colSpan={field.colspan} className="border border-black text-left font-bold px-2 py-1 bg-gray-200">
//           {field.label}
//         </th>
//       </tr>
//     );
//   }

//   if (field.type === "section") {
//     return (
//       <tr key={field.label}>
//         <td colSpan={field.colspan} className="border border-black font-semibold bg-gray-100 px-2 py-1">
//           {field.label}
//         </td>
//       </tr>
//     );
//   }

//   if (field.type === "field") {
//     return (
//       <tr key={field.key}>
//         <td colSpan={field.colspan || 1} className="border border-black px-2 py-1 font-semibold">
//           {field.label}
//         </td>
//         <td colSpan={3 - (field.colspan || 1)} className="border border-black px-2 py-1">
//           {data[field.key]}
//         </td>
//       </tr>
//     );
//   }

//   if (field.type === "textarea") {
//     return (
//       <tr key={field.key}>
//         <td colSpan={field.colspan} className={`border border-black px-2 py-1 align-top ${field.height || 'h-24'}`}>
//           <div className="font-semibold mb-1">{field.label}</div>
//           <div className="text-sm whitespace-pre-wrap">{data[field.key]}</div>
//         </td>
//       </tr>
//     );
//   }

//   if (field.type === "row") {
//     return (
//       <tr key={field.fields.map((f: any) => f.key || f.label).join("-")}>
//         {field.fields.map((f: any) => {
//           if (f.type === "checkbox-group") {
//             return (
//               <td key={f.key} colSpan={f.colspan || 1} className="border border-black px-2 py-1 align-top">
//                 <div className="font-semibold mb-1">{f.label}</div>
//                 <div className="space-y-1 text-xs">
//                   {f.options.map((opt: string, i: number) => {
//                     if (opt === "Others") {
//                       return (
//                         <div key={`other-${i}`} className="flex items-center">
//                           <span className="mr-2">Others:</span>
//                           <span className="border-b border-black flex-1">
//                             {data[f.key + "Other"] || ""}
//                           </span>
//                         </div>
//                       );
//                     }
//                     return (
//                       <label key={i} className="inline-flex items-center mr-2 text-xs">
//                         <input type="checkbox" className="mr-1" checked={data[f.key]?.includes(opt)} readOnly />
//                         {opt}
//                       </label>
//                     );
//                   })}
//                 </div>
//               </td>
//             );
//           } else if (f.type === "custom") {
//             return (
//               <td key={f.key || f.label} colSpan={f.colspan || 1} className="border border-black px-2 py-1">
//                 <div className="font-semibold mb-1">{f.label}</div>
//                 {f.render(data)}
//               </td>
//             );
//           } else {
//             return (
//               <td key={f.key} colSpan={f.colspan || 1} className="border border-black px-2 py-1">
//                 <div className="font-semibold text-xs">{f.label}</div>
//                 <div className="text-xs">{data[f.key]}</div>
//               </td>
//             );
//           }
//         })}
//       </tr>
//     );
//   }

//   if (field.type === "checkbox-group") {
//     return (
//       <tr key={field.key}>
//         <td colSpan={field.colspan} className="border border-black px-2 py-1">
//           <div className="font-semibold mb-1">{field.label}</div>
//           {field.options.map((opt: string, i: number) => (
//             <label key={i} className="inline-flex items-center mr-4">
//               <input type="checkbox" className="mr-1" checked={data[field.key]?.includes(opt)} readOnly />
//               {opt}
//             </label>
//           ))}
//         </td>
//       </tr>
//     );
//   }

//   if (field.type === "checkbox-detail") {
//     return (
//       <tr key={field.key}>
//         <td colSpan={2} className="border border-black px-2 py-1">
//           <div className="font-bold mb-1">{field.label}</div>
//           {field.options.map((opt: string, i: number) => (
//             <label key={i} className="inline-flex items-center mr-4">
//               <input type="checkbox" className="mr-1" checked={data[field.key]?.includes(opt)} readOnly />
//               {opt}
//             </label>
//           ))}
//           <div className="mt-2 text-sm">{data[field.detailsKey]}</div>
//         </td>
//       </tr>
//     );
//   }

//   return null;
// };

// const renderField = (field: any, data: any, setData: any) => {
//   switch (field.type) {
//     case "yesno":
//       return (
//         <div className="mb-4" key={field.key}>
//           <label className="block font-medium mb-1">{field.label}</label>
//           <select
//             className="border p-2 rounded w-full"
//             value={data[field.key] || ""}
//             onChange={(e) => setData({ ...data, [field.key]: e.target.value })}
//           >
//             <option value="">Select</option>
//             <option value="Yes">Yes</option>
//             <option value="No">No</option>
//           </select>
//         </div>
//       );
//     case "yesno-followup":
//       return (
//         <div className="mb-4" key={field.key}>
//           <label className="block font-medium mb-1">{field.label}</label>
//           <select
//             className="border p-2 rounded w-full mb-2"
//             value={data[field.key] || ""}
//             onChange={(e) => setData({ ...data, [field.key]: e.target.value })}
//           >
//             <option value="">Select</option>
//             <option value="Yes">Yes</option>
//             <option value="No">No</option>
//           </select>
//           {data[field.key] === "Yes" && (
//             <input
//               type="text"
//               placeholder={field.followupLabel}
//               className="border p-2 rounded w-full"
//               value={data[field.followupKey] || ""}
//               onChange={(e) => setData({ ...data, [field.followupKey]: e.target.value })}
//             />
//           )}
//         </div>
//       );
//     default:
//       return null;
//   }
// };


// const PageRenderer = ({ schema }: { schema: any[] }) => {
//   const [data, setData] = React.useState(formData);

//   return (
//     <div className="space-y-6">
//       {schema.map((item) => renderField(item, data, setData))}
//     </div>
//   );
// };

// export default function CombinedClientForm() {
//   return (
//     <div className="bg-gray-100 py-10 px-4 flex flex-col items-center font-[Open_Sans] space-y-12">
//       {[ uiSchemaPage1, uiSchemaPage2, uiSchemaPage3, uiSchemaPage4, uiSchemaPage5, uiSchemaPage6, uiSchemaPage7].map((schema, i) => (
//         <section key={`page-${i + 1}`} className="bg-white p-4 w-full max-w-3xl border">
//           <table className="w-full border-collapse border border-black text-sm">
//             <tbody>
//               {schema.map(field => renderRow(field, formData))}
//             </tbody>
//           </table>
//         </section>
//       ))}
//          <h2 className="text-xl font-semibold mt-6 mb-2">Page 5</h2>
//       <PageRenderer schema={uiSchemaPage5} />
//       <h2 className="text-xl font-semibold mt-6 mb-2">Page 6</h2>
//       <PageRenderer schema={uiSchemaPage6} />
//       <h2 className="text-xl font-semibold mt-6 mb-2">Page 7</h2>
//       <PageRenderer schema={uiSchemaPage7} />
//     </div>
//   );
// }



// CombinedClientFormGrid.tsx (Exact replica of scanned form layout using Tailwind grid)
"use client";

import React from "react";

const formData = {
  date: "",
  ndisNumber: "",
  givenName: "",
  surname: "",
  sex: [],
  sexOther: "",
  pronoun: "",
  aboriginal: [],
  preferredName: "",
  dob: "",
  street: "",
  state: "",
  postcode: "",
  email: "",
  homePhone: "",
  mobile: "",
  disability: ""
};

const Field = ({ label, value, className = "" }: { label: string; value?: string; className?: string }) => (
  <div className={`border border-black text-xs px-2 py-1 ${className}`}>
    <span className="font-semibold mr-1">{label}</span>{value}
  </div>
);

const GridField = ({ label, value }: { label: string; value: string }) => (
  <div className="flex border border-black text-xs px-2 py-1 items-center">
    <span className="font-semibold mr-1">{label}</span><span className="flex-1">{value}</span>
  </div>
);

const CheckboxField = ({ label, checked }: { label: string; checked: boolean }) => (
  <label className="inline-flex items-center text-xs mr-4">
    <input type="checkbox" checked={checked} readOnly className="mr-1 w-3 h-3" />
    {label}
  </label>
);

export default function CombinedClientFormGrid() {
  return (
    <div className="max-w-[700px] mx-auto border border-black text-xs">
      <div className="text-center font-bold border-b border-black py-1">Client Intake Form</div>

      <div className="grid grid-cols-3">
        <Field label="Date:" value={formData.date} className="col-span-3" />
        <div className="col-span-3 grid grid-cols-3">
          <div className="col-span-1 font-bold border border-black bg-gray-200 px-2 py-1">Participant Details</div>
          <div className="col-span-2 font-bold border border-black bg-gray-200 px-2 py-1">NDIS Number:</div>
        </div>

        <div className="col-span-3 grid grid-cols-3 border-b border-black">
          <div className="border border-black px-2 py-1">Given name(s):<div>{formData.givenName}</div></div>
          <div className="border border-black px-2 py-1">Surname:<div>{formData.surname}</div></div>
          <div className="border border-black px-2 py-1">
            <div>Sex:</div>
            <div className="flex flex-col gap-1 mt-1">
              <CheckboxField label="Male" checked={formData.sex.includes("Male")} />
              <CheckboxField label="Female" checked={formData.sex.includes("Female")} />
              <CheckboxField label="Prefer not to say." checked={formData.sex.includes("Prefer not to say")} />
              <div className="flex items-center text-xs">
                <span className="mr-2">Others:</span>
                <span className="border-b border-black flex-1 h-4">{formData.sexOther}</span>
              </div>
            </div>
          </div>
        </div>

        <GridField label="Pronoun:" value={formData.pronoun} className="col-span-3" />

        <div className="col-span-3 border border-black px-2 py-1">
          <span className="font-semibold">Are you an Aboriginal or Torres Strait Island descent?</span>
          <CheckboxField label="Yes" checked={formData.aboriginal.includes("Yes")} />
          <CheckboxField label="No" checked={formData.aboriginal.includes("No")} />
        </div>

        <div className="col-span-2">
          <GridField label="Preferred name:" value={formData.preferredName} />
        </div>
        <div>
          <GridField label="Date of Birth:" value={formData.dob} />
        </div>

        <div className="col-span-3 font-bold border border-black bg-gray-200 px-2 py-1">Residential Address Details</div>
        <div className="col-span-3">
          <GridField label="Number / Street:" value={formData.street} />
        </div>
        <GridField label="State:" value={formData.state} />
        <GridField label="Postcode:" value={formData.postcode} />
        <div></div>

        <div className="col-span-3 font-bold border border-black bg-gray-200 px-2 py-1">Participant Contact Details</div>
        <div className="col-span-3">
          <GridField label="Email address:" value={formData.email} />
        </div>

        <GridField label="Home Phone No:" value={formData.homePhone} />
        <GridField label="Mobile No:" value={formData.mobile} />
        <div></div>

        <div className="col-span-3 font-bold border border-black bg-gray-200 px-2 py-1">Disability Conditions/Disability type(s)</div>
        <div className="col-span-3 border border-black h-24 px-2 py-1 whitespace-pre-wrap">
          {formData.disability}
        </div>
      </div>
    </div>
  );
}
