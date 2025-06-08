// // // Consolidated React + Tailwind component based on 7 screenshots + schema-driven layout

// // import React from 'react';

// // interface Field {
// //   id: string;
// //   label: string;
// //   colspan?: number;
// //   rowSpan?: number;
// //   type?: 'text' | 'checkbox' | 'section' | 'textarea';
// // }

// // interface Section {
// //   title: string;
// //   fields: Field[][];
// // }

// // interface Props {
// //   uiSchema: {
// //     sections: Section[];
// //   };
// //   formData: Record<string, any>;
// // }

// // const ClientIntakeFormRenderer: React.FC<Props> = ({ uiSchema, formData }) => {
// //   return (
// //     <div className="p-4 text-sm font-sans">
// //       {uiSchema.sections.map((section, sectionIndex) => (
// //         <div key={sectionIndex} className="mb-6 border border-black">
// //           {section.title && (
// //             <div className="bg-gray-300 px-2 py-1 text-sm font-semibold border-b border-black">
// //               {section.title}
// //             </div>
// //           )}
// //           <table className="w-full table-fixed border-collapse border border-black text-sm">
// //             <tbody>
// //               {section.fields.map((row, rowIndex) => (
// //                 <tr key={rowIndex} className="border-t border-black">
// //                   {row.map((field, colIndex) => (
// //                     <td
// //                       key={colIndex}
// //                       className={`border border-black px-2 py-1 align-top`}
// //                       colSpan={field.colspan || 1}
// //                       rowSpan={field.rowSpan || 1}
// //                     >
// //                       {field.type === 'checkbox' ? (
// //                         <div className="flex items-center gap-2">
// //                           <input
// //                             type="checkbox"
// //                             className="w-4 h-4"
// //                             checked={formData[field.id] || false}
// //                             readOnly
// //                           />
// //                           <span>{field.label}</span>
// //                         </div>
// //                       ) : field.type === 'textarea' ? (
// //                         <div>
// //                           {field.label && <strong>{field.label}</strong>}
// //                           <div className="mt-1 text-gray-700 whitespace-pre-wrap min-h-[80px]">
// //                             {formData[field.id] || ''}
// //                           </div>
// //                         </div>
// //                       ) : (
// //                         <div className="flex flex-col">
// //                           <span className="font-medium text-black">{field.label}</span>
// //                           <span className="text-gray-700 whitespace-pre-wrap">
// //                             {formData[field.id] || ''}
// //                           </span>
// //                         </div>
// //                       )}
// //                     </td>
// //                   ))}
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// // export default ClientIntakeFormRenderer;



// // ✅ Full Infinity Supports WA form renderer using Tailwind CSS and multi-page schema structure

// import React, { useState } from 'react';

// interface Field {
//   id: string;
//   label: string;
//   colspan?: number;
//   rowSpan?: number;
//   type?: 'text' | 'checkbox' | 'section' | 'textarea' | 'radio';
//   options?: string[];
// }

// interface Section {
//   title: string;
//   fields: Field[][];
// }

// const InfinitySupportsForm = () => {
//   const [currentPage, setCurrentPage] = useState(0);

//   const pages: { sections: Section[] }[] = [
//     uiSchemaPage1,
//     uiSchemaPage2,
//     uiSchemaPage3,
//     uiSchemaPage4,
//     uiSchemaPage5,
//     uiSchemaPage6,
//     uiSchemaPage7
// ];
//   const pageNames = [
//     'Client Intake Form',
//     'Medical & Support Contact',
//     'About Me & Personal Situation',
//     'Primary & Secondary Contact',
//     'Medication & Health Concerns',
//     'Care Permissions & Safety Considerations',
//     'Support Preferences'
//   ];

//   const formData: Record<string, any> = {
//   // Full merged data for all 7 pages
//   date: '05/06/2025',
//   given_name: 'John',
//   surname: 'Smith',
//   ndis_number: 'NDIS123456789',
//   pronoun: 'He/Him',
//   sex_male: true,
//   sex_female: false,
//   preferred_name: 'Johnny',
//   date_of_birth: '15/01/1990',
//   yes_checkbox: false,
//   no_checkbox: true,
//   street_address: '123 Main Street, Anytown',
//   state: 'WA',
//   postcode: '6000',
//   email: 'john.smith@email.com',
//   home_phone: '08 1234 5678',
//   mobile: '0412 345 678',
//   disability_conditions: 'Autism Spectrum Disorder Intellectual Disability Anxiety Disorder',
//   medical_centre_name: 'Perth Medical Centre',
//   phone: '08 9876 5432',
//   sc_name: 'Sarah Johnson',
//   sc_email: 'sarah.johnson@support.com',
//   sc_company: 'Support Services WA',
//   sc_contact: '0423 456 789',
//   other_supports: 'Physiotherapy weeklySpeech therapy fortnightly Occupational therapy monthly Psychologist sessions',
//   about_me: 'I enjoy music, drawing, and spending time with family. I like routine and need clear instructions. I respond well to visual cues and positive reinforcement. I have difficulty with changes in routine and need advance notice of any changes. I communicate best in quiet environments.',
//   advocate_name: 'Mary Smith',
//   advocate_relationship: 'Mother',
//   advocate_phone: '08 1234 5678',
//   advocate_mobile: '0412 345 678',
//   advocate_email: 'mary.smith@email.com',
//   advocate_address: '123 Main Street, Anytown, WA 6000',
//   advocate_postal: '123 Main Street, Anytown, WA 6000',
//   advocate_other: 'Available during business hours, prefers email contact',
//   cultural_yes: false,
//   cultural_no: true,
//   interpreter_yes: false,
//   interpreter_no: true,
//   language: 'English',
//   cultural_values: 'Australian values, family-oriented',
//   cultural_behaviours: 'Respectful, punctual',
//   written_communication: 'Basic reading and writing skills',
//   country_of_birth: 'Australia'
// };

//   const renderField = (field: Field) => {
//     const value = formData[field.id] || '';

//     if (field.type === 'checkbox') {
//       return (
//         <div className="flex items-center gap-2">
//           <input type="checkbox" className="w-4 h-4" checked={Boolean(value)} readOnly />
//           <span>{field.label}</span>
//         </div>
//       );
//     } else if (field.type === 'textarea') {
//       return (
//         <div>
//           {field.label && <strong>{field.label}</strong>}
//           <div className="mt-1 text-gray-700 whitespace-pre-wrap min-h-[80px]">{value}</div>
//         </div>
//       );
//     } else {
//       return (
//         <div className="flex flex-col">
//           <span className="font-medium text-black">{field.label}</span>
//           <span className="text-gray-700 whitespace-pre-wrap">{value}</span>
//         </div>
//       );
//     }
//   };

//   const renderSection = (section: Section, index: number) => (
//     <div key={index} className="border-b border-black last:border-b-0">
//       {section.title && (
//         <div className="bg-gray-300 px-2 py-1 text-sm font-semibold border-b border-black">{section.title}</div>
//       )}
//       <table className="w-full border-collapse border-black text-sm">
//         <tbody>
//           {section.fields.map((row, rowIndex) => (
//             <tr key={rowIndex}>
//               {row.map((field, colIndex) => (
//                 <td
//                   key={colIndex}
//                   className="border border-black px-2 py-1 align-top"
//                   colSpan={field.colspan || 1}
//                   rowSpan={field.rowSpan || 1}
//                 >
//                   {renderField(field)}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );

//   return (
//     <div className="max-w-4xl mx-auto bg-white p-4 text-sm font-sans">
//       {/* Header */}
//       <div className="text-center mb-4">
//         <div className="flex items-center justify-center mb-2">
//           <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
//             <div className="w-8 h-1 bg-pink-400 rounded-full transform rotate-12"></div>
//             <div className="w-8 h-1 bg-pink-400 rounded-full transform -rotate-12 -ml-6"></div>
//           </div>
//         </div>
//         <h1 className="text-lg font-normal text-gray-600 mb-1">Infinity Supports WA</h1>
//         <p className="text-xs text-gray-500 mb-2">NDIS SERVICES PROVIDER</p>
//         <h2 className="text-base font-bold text-black">{pageNames[currentPage]}</h2>
//       </div>

//       {/* Form Content */}
//       <div className="border border-black">
//         {pages[currentPage].sections.map((section, index) => renderSection(section, index))}
//       </div>

//       {/* Footer */}
//       <div className="mt-4 text-center text-xs text-gray-500">
//         <div className="flex justify-between items-center">
//           <span>Website: infinitysupportswa.org</span>
//           <span>CF001</span>
//           <span>Review Date: 14/03/2026</span>
//         </div>
//       </div>

//       {/* Navigation */}
//       <div className="mt-6 flex justify-between">
//         <button
//           onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
//           disabled={currentPage === 0}
//           className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-colors text-sm"
//         >
//           Previous
//         </button>
//         <span className="py-2 px-4 text-sm text-gray-600">
//           Page {currentPage + 1} of {pages.length}
//         </span>
//         <button
//           onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
//           disabled={currentPage === pages.length - 1}
//           className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors text-sm"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default InfinitySupportsForm;
