// "use client";

// import page from "@/app/admin/clients/[id]/forms/[formId]/page";
// import React from "react";

// // --- Schema & Response Data ---
// const homeVisitSchema = {
//   logo: {
//     page1: {
//       src: "/infinity_logo.png",
//       width: 150,
//       height: 60
//     },
//     page2: {
//       src: "/infinity_logo.png",
//       width: 200,
//       height: 80
//     },
//     page3: {
//       src: "/infinity_logo.png",
//       width: 250,
//       height: 100
//     },
//   },
//   metadataFields: [
//     { label: "Name", key: "name" },
//     { label: "NDIS Number", key: "ndisNumber" },
//     { label: "DOB", key: "dob" },
//     { label: "Address", key: "address" },
//     { label: "Date of completion of risk assessment", key: "completionDate" }
//   ],
//   pages: [
//     {
//       title: "Page 1",
//       sections: [
//         {
//           title: "CLIENT AND FAMILY",
//           fields: [
//             { label: "Will anyone else be present during the visit?", key: "visitCompany" },
//             { label: "Any history of verbal or physical aggression from the client or family?", key: "aggressionHistory" },
//             { label: "Any history of alcohol or drug use?", key: "drugUseHistory" },
//             { label: "Is there an advanced care directive?", key: "careDirective" }
//           ]
//         },
//         {
//           title: "ENVIRONMENT",
//           fields: [
//             { label: "If there are any pets, has the client agreed to restrain them during the visit?", key: "petsRestrained" },
//             { label: "Are there any weapons in the home?", key: "weaponsInHome" }
//           ]
//         }
//       ]
//     },
//     {
//       title: "Page 2",
//       sections: [
//         {
//           title: "SAFETY & ACCESS",
//           fields: [
//             { label: "If there are any smokers, have they agreed to refrain from smoking during the visit?", key: "smokingAgreement" },
//             { label: "Are there smoke detectors present and in working condition?", key: "smokeDetectors" },
//             { label: "Any apparent fire hazards?", key: "fireHazards" },
//             { label: "Are there any difficulties locating the address/access to the building?", key: "accessDifficulties" },
//             { label: "Is there parking available?", key: "parking" },
//             {
//               label: "Is entry via the front door? If no, which door is used for entry?",
//               key: "entryPoint",
//               type: "checkboxGroup",
//               options: ["Left side", "Right Side", "Rear", "Other"]
//             },
//             { label: "Are there any issues with mobile phone reception?", key: "mobileReception" }
//           ]
//         }
//       ]
//     },
//     {
//       title: "Page 3",
//       type: "static",
//       image: "/home_risk_assessment.png",
//       content: [
//         {
//           heading: "Risk Assessment Outcome – Proceed with Visit as follows:",
//           blocks: [
//             {
//               title: "LOW GREEN",
//               color: "green",
//               text: "Visit acceptable. Ensure control options are followed."
//             },
//             {
//               title: "MEDIUM YELLOW",
//               color: "yellow",
//               text: "Visit should only proceed after consultation with Manager. The risks should be reviewed to consider all the hazards involved. The risks must be reduced prior to the visit – if in doubt, re-classify as Moderate Risk."
//             },
//             {
//               title: "MODERATE ORANGE",
//               color: "orange",
//               text: "Visit should only proceed after consultation with Director. The risks should be reviewed to consider all the hazards involved. The risks must be reduced prior to the visit – if in doubt, re-classify as High Risk."
//             }
//           ]
//         }
//       ]
//     },
//     {
//   title: "Page 4",
//   type: "table",
//   riskLevel: {
//     label: "HIGH RED",
//     description: "Visit must only proceed with Director approval. The risks associated with the visit must be re-assessed & other options considered."
//   },
//   fields: [
//     { label: "Issue/Task", key: "issue1" },
//     { label: "Risk Score", key: "riskScore1" },
//     { label: "Control Measure", key: "control1" },
//     { label: "Person Responsible", key: "responsible1" },

//     { label: "Issue/Task", key: "issue2" },
//     { label: "Risk Score", key: "riskScore2" },
//     { label: "Control Measure", key: "control2" },
//     { label: "Person Responsible", key: "responsible2" },

//     { label: "Issue/Task", key: "issue3" },
//     { label: "Risk Score", key: "riskScore3" },
//     { label: "Control Measure", key: "control3" },
//     { label: "Person Responsible", key: "responsible3" }
//   ]
// },

//   ],
//   footer: {
//     left: "Document Number: CF012",
//     center: "www.infinitysupportwa.org",
//     right: "DOR: 14/03/2026"
//   }
// };

// const homeVisitResponse = {
//   name: "John Doe",
//   ndisNumber: "123456789",
//   dob: "01/01/1990",
//   address: "123 Main St, Perth, WA",
//   completionDate: "2025-07-01",

//   visitCompany: "Yes",
//   aggressionHistory: "No",
//   drugUseHistory: "No",
//   careDirective: "Yes",
//   petsRestrained: "Yes",
//   weaponsInHome: "No",
//   smokingAgreement: "Yes",
//   smokeDetectors: "Yes",
//   fireHazards: "No",
//   accessDifficulties: "No",
//   parking: "Street parking available",
//   entryPoint: ["Left side", "Rear"],
//   mobileReception: "Weak signal inside",
  
//   issue1: "",
//   riskScore1: "",
//   control1: "",
//   responsible1: "",

//   issue2: "",
//   riskScore2: "",
//   control2: "",
//   responsible2: "",

//   issue3: "",
//   riskScore3: "",
//   control3: "",
//   responsible3: "",

//   designation: "Support Worker",
//   signature: "John Smith",


// };

// // --- Components ---
// const Footer = () => (
//   <div className="flex justify-between text-[12px] mt-4 px-4 pb-4">
//     <div>{homeVisitSchema.footer.left}</div>
//     <div>
//       <a
//         href={`https://${homeVisitSchema.footer.center}`}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="text-blue-600 underline"
//       >
//         {homeVisitSchema.footer.center}
//       </a>
//     </div>
//     <div>{homeVisitSchema.footer.right}</div>
//   </div>
// );

// const Page1 = () => (
//   <div className="border border-black max-w-3xl mx-auto my-8 text-[13px]">
//     <div className="flex justify-center pt-4">
//       <img
//         src={homeVisitSchema.logo.page1.src}
//         alt="Logo"
//         width={homeVisitSchema.logo.page1.width}
//         height={homeVisitSchema.logo.page1.height}
//       />
//     </div>

//     <div className="px-4 py-2">
//       {homeVisitSchema.metadataFields.map((field) => (
//         <p key={field.key}>
//           <strong>{field.label}:</strong> {homeVisitResponse[field.key]}
//         </p>
//       ))}
//     </div>

//     <table className="w-full border-collapse border border-black text-[13px]">
//       <tbody>
//         {homeVisitSchema.pages[0].sections.map((section) => (
//           <React.Fragment key={section.title}>
//             <tr className="bg-gray-300 font-bold text-[12px]">
//               <td className="border border-black p-1" colSpan={2}>
//                 {section.title}
//               </td>
//             </tr>
//             {section.fields.map((field) => (
//               <tr key={field.key}>
//                 <td className="border border-black p-2 align-top">{field.label}</td>
//                 <td className="border border-black p-2 align-top">
//                   {homeVisitResponse[field.key] || ""}
//                 </td>
//               </tr>
//             ))}
//           </React.Fragment>
//         ))}
//       </tbody>
//     </table>

//     <Footer />
//   </div>
// );

// const Page2 = () => {
//   const section = homeVisitSchema.pages[1].sections[0];

//   return (
//     <div className="border border-black max-w-3xl mx-auto my-8 text-[13px]">
//       <div className="flex justify-center pt-4">
//         <img
//           src={homeVisitSchema.logo.page2.src}
//           alt="Logo"
//           width={homeVisitSchema.logo.page2.width}
//           height={homeVisitSchema.logo.page2.height}
//         />
//       </div>

//       <table className="w-full border-collapse border border-black text-[13px]">
//         <tbody>
//           {section.fields.map((field) => {
//             const value = homeVisitResponse[field.key];

//             if (field.type === "checkboxGroup") {
//               return (
//                 <tr key={field.key}>
//                   <td className="border border-black p-2 align-top" style={{ width: "60%" }}>
//                     {field.label}
//                   </td>
//                   <td className="border border-black" colSpan={2}></td>
//                   <td className="border border-black p-2 text-[12px]" style={{ width: "30%" }}>
//                     {field.options.map((opt) => (
//                       <div key={opt}>
//                         <input
//                           type="checkbox"
//                           checked={Array.isArray(value) && value.includes(opt)}
//                           readOnly
//                           className="align-middle mr-1"
//                         />
//                         {opt}
//                       </div>
//                     ))}
//                   </td>
//                 </tr>
//               );
//             }

//             return (
//               <tr key={field.key}>
//                 <td className="border border-black p-2 align-top">{field.label}</td>
//                 <td className="border border-black"></td>
//                 <td className="border border-black"></td>
//                 <td className="border border-black p-2 align-top">{value}</td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>

//       <Footer />
//     </div>
//   );
// };

// const Page3 = () => {
//   const page = homeVisitSchema.pages[2];

//   return (
//     <div className="border border-black max-w-3xl mx-auto my-8 p-4 text-[13px]">
//       <div className="flex justify-center pt-4">
//       <img
//         src={homeVisitSchema.logo.page3.src}
//         alt="Logo"
//         width={homeVisitSchema.logo.page3.width}
//         height={homeVisitSchema.logo.page3.height}
//       />
//     </div>
//       <img src={page.image} alt="Risk Matrix" className="mb-4 w-full" />
//       {page.content.map((section, idx) => (
//         <div key={idx}>
//           <p className="underline font-semibold mb-2">{section.heading}</p>
//           {section.blocks.map((block, i) => (
//             <React.Fragment key={i}>
//               <p className="mb-1">
//                 <strong>
//                   {block.title.split(" ")[0]}{" "}
//                   <span className={`text-${block.color}-600`}>{block.title.split(" ")[1]}</span>
//                 </strong>
//               </p>
//               <p className="mb-2">{block.text}</p>
//             </React.Fragment>
//           ))}
//         </div>
//       ))}
//       <Footer />
//     </div>
//   );
// };

// const Page4 = () => {
//   const page = homeVisitSchema.pages[3];
//   return (
//     <div className="max-w-[800px] mx-auto p-4 text-[13px] border border-black my-8">
//       <div className="flex justify-center mb-2">
//         <img
//           src="/infinity_logo.png"
//           alt="Infinity Supports WA logo"
//           className="object-contain"
//           width={250}
//           height={100}
//         />
//       </div>

//       <div className="mb-2 text-base">
//         <span>{page.riskLevel.label.split(" ")[0]}</span>
//         <span className="text-red-600"> {page.riskLevel.label.split(" ")[1]}</span>
//       </div>
//       <div className="mb-6 text-sm leading-tight">
//         {page.riskLevel.description}
//       </div>

//       <table className="w-full border border-black border-collapse text-xs">
//         <thead>
//           <tr className="bg-gray-400 text-black font-bold text-[10px]">
//             <th className="border border-black px-1 py-1 text-left" style={{ width: "45%" }}>Issue/Task</th>
//             <th className="border border-black px-1 py-1 text-left" style={{ width: "10%" }}>Risk Score</th>
//             <th className="border border-black px-1 py-1 text-left" style={{ width: "30%" }}>Control Measure</th>
//             <th className="border border-black px-1 py-1 text-left" style={{ width: "15%" }}>Person Responsible</th>
//           </tr>
//         </thead>
//         <tbody>
//           {[1, 2, 3].map((row) => (
//             <tr key={row} style={{ height: "100px" }}>
//               <td className="border border-black p-1 align-top">{homeVisitResponse[`issue${row}`]}</td>
//               <td className="border border-black p-1 align-top">{homeVisitResponse[`riskScore${row}`]}</td>
//               <td className="border border-black p-1 align-top">{homeVisitResponse[`control${row}`]}</td>
//               <td className="border border-black p-1 align-top">{homeVisitResponse[`responsible${row}`]}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div className="flex justify-between text-[10px] mt-8 px-1">
//         <div>Document Number: <span className="font-bold">CF012</span></div>
//         <div>
//           <a
//             href="http://www.infinitysupportswa.org"
//             rel="noopener noreferrer"
//             target="_blank"
//             className="text-blue-600 underline"
//           >
//             www.infinitysupportswa.org
//           </a>
//         </div>
//         <div>DOR: 14/03/2026</div>
//       </div>
//     </div>
//   );
// };

// const Page5 = () => (
//   <div className="border border-black max-w-3xl mx-auto my-8 text-[13px] flex flex-col items-center pt-8 px-4">
//     <img
//       alt="Infinity Supports WA logo"
//       src="/infinity_logo.png"
//       width={200}
//       height={100}
//       className="mx-auto"
//     />

//     <div className="w-full max-w-4xl mt-8 flex justify-between text-black font-semibold text-sm px-4 sm:px-0">
//       <div>Name: <span className="font-bold">{homeVisitResponse.name}</span></div>
//       <div>Signature: <span className="font-bold">{homeVisitResponse.signature}</span></div>
//       <div>Designation: <span className="font-bold">{homeVisitResponse.designation}</span></div>
//     </div>

//     <div className="flex-grow py-10" />

//     <footer className="w-full max-w-4xl flex justify-between text-xs text-black px-4 sm:px-0 pb-4">
//       <div>Document Number: CF012</div>
//       <a
//         className="text-blue-700 underline"
//         href="https://www.infinitysupportswa.org"
//         target="_blank"
//         rel="noopener noreferrer"
//       >
//         www.infinitysupportswa.org
//       </a>
//       <div>DOR: 14/03/2026</div>
//     </footer>
//   </div>
// );


// // --- Main Component ---
// const HomeVisitRiskAssessment = () => (
//   <>
//     <Page1 />
//     <Page2 />
//     <Page3 />
//     <Page4 />
//     <Page5 />
//   </>
// );

// export default HomeVisitRiskAssessment;
