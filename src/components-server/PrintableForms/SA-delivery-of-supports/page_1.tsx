// // import React from 'react';
// // import A4PageWrapper from './A4PageWrapper';

import A4PageWrapper from "./A4PageWrapper";

// // interface Page1Props {
// //   schema?: any;
// //   data: any;
// //   settings: any;
// //   commonFieldsData: any;
// //   images: any;
// // }

// // const Page1: React.FC<Page1Props> = ({ schema, data, settings, commonFieldsData, images }) => {
// //   const commonFieldMapping: Record<string, string> = {
// //     givenNames: 'name',
// //     address: 'street',
// //     dob: 'dob',
// //     disability: 'disability',
// //     ndisNumber: 'ndis',
// //     state: 'state',
// //     street: 'street',
// //     postcode: 'postCode',
// //     email: 'email',
// //     homePhone: 'phone',
// //     sex: 'sex'
// //   };

// //   const getValue = (key: string) => {
// //     if (commonFieldMapping[key]) {
// //       return commonFieldsData?.[commonFieldMapping[key]] ?? '';
// //     }
// //     return data?.[key] ?? '';
// //   };

// //   return (
// //     <A4PageWrapper>
// //       <div className="h-full flex flex-col p-6">
// //         {/* Header with Logo */}
// //         <div className="flex justify-center mb-4">
// //           <img
// //             src={'/infinity_logo.png'}
// //             alt="Infinity Supports WA Logo"
// //             className="h-16 object-contain"
// //           />
// //         </div>

// //         {/* Title */}
// //         <div className="text-center mb-4">
// //           <p className="font-bold underline text-sm">SERVICE AGREEMENT FOR SERVICE DELIVERY</p>
// //         </div>

// //         {/* Section 1 */}
// //         <div className="mb-3">
// //           <p className="font-bold underline text-sm">Section 1</p>
// //         </div>

// //         {/* Table - takes up most of the remaining space */}
// //         <div className="flex-1 flex flex-col">
// //           <table className="w-full border border-black border-collapse text-xs flex-1">
// //             <tbody className="h-full">
// //               <tr>
// //                 <td className="border border-black p-2 font-bold align-top" style={{ width: '20%' }}>
// //                   Date :
// //                 </td>
// //                 <td className="border border-black p-2 align-top" colSpan={3}>
// //                   {getValue('agreementDate')}
// //                 </td>
// //               </tr>

// //               <tr className="bg-gray-300 font-bold">
// //                 <td className="border border-black p-2 align-top" style={{ width: '60%' }} colSpan={3}>
// //                   Participant Details
// //                 </td>
// //                 <td className="border border-black p-2 align-top text-right whitespace-nowrap" style={{ width: '40%' }}>
// //                   NDIS Number: <span className="font-normal">{getValue('ndisNumber')}</span>
// //                 </td>
// //               </tr>

// //               <tr>
// //                 <td className="border border-black p-2 align-top">
// //                   <strong>{schema?.fields?.find((f: any) => f.key === 'surname')?.label}</strong>: {getValue('surname')}
// //                 </td>
// //                 <td className="border border-black p-2 align-top">
// //                   <strong>{schema?.fields?.find((f: any) => f.key === 'givenNames')?.label}</strong>: {getValue('givenNames')}
// //                 </td>
// //                 <td className="border border-black p-2 align-top" colSpan={2}>
// //                   <div>
// //                     <p className="font-semibold mb-1">Sex:</p>
// //                     {['Male', 'Female', 'Prefer not to say', 'Others'].map(option => (
// //                       <div key={option} className="flex items-center text-xs mb-1">
// //                         <input
// //                           type="checkbox"
// //                           readOnly
// //                           checked={getValue('sex') === option}
// //                           className="mr-2 scale-75"
// //                         />
// //                         {option}
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </td>
// //               </tr>

// //               <tr>
// //                 <td className="border border-black p-2 align-top" colSpan={4}>
// //                   <strong>Pronoun</strong> : {getValue('pronoun')}
// //                 </td>
// //               </tr>

// //               <tr>
// //                 <td className="border border-black p-2 align-top" colSpan={3}>
// //                   <strong>Are you an Aboriginal or Torres Strait Island descent?</strong>
// //                 </td>
// //                 <td className="border border-black p-2 align-top">
// //                   <label className="inline-flex items-center mr-3 text-xs">
// //                     <input
// //                       type="checkbox"
// //                       readOnly
// //                       checked={getValue('indigenousStatus') === 'Yes'}
// //                       className="mr-1 scale-75"
// //                     />
// //                     Yes
// //                   </label>
// //                   <label className="inline-flex items-center text-xs">
// //                     <input
// //                       type="checkbox"
// //                       readOnly
// //                       checked={getValue('indigenousStatus') === 'No'}
// //                       className="mr-1 scale-75"
// //                     />
// //                     No
// //                   </label>
// //                 </td>
// //               </tr>

// //               <tr>
// //                 <td className="border border-black p-2 align-top" colSpan={2}>
// //                   <strong>Preferred name</strong> : {getValue('preferredName')}
// //                 </td>
// //                 <td className="border border-black p-2 align-top" colSpan={2}>
// //                   <strong>Date of Birth</strong> : {getValue('dob')}
// //                 </td>
// //               </tr>

// //               <tr className="bg-gray-300 font-bold">
// //                 <td className="border border-black p-2 align-top" colSpan={4}>
// //                   Residential Address Details
// //                 </td>
// //               </tr>

// //               <tr>
// //                 <td className="border border-black p-2 align-top" colSpan={4}>
// //                   <strong>Number / Street</strong> : {getValue('street')}
// //                 </td>
// //               </tr>

// //               <tr>
// //                 <td className="border border-black p-2 align-top" colSpan={2}>
// //                   <strong>State</strong> : {getValue('state')}
// //                 </td>
// //                 <td className="border border-black p-2 align-top" colSpan={2}>
// //                   <strong>Postcode</strong> : {getValue('postcode')}
// //                 </td>
// //               </tr>

// //               <tr className="bg-gray-300 font-bold">
// //                 <td className="border border-black p-2 align-top" colSpan={4}>
// //                   Participant Contact Details
// //                 </td>
// //               </tr>

// //               <tr>
// //                 <td className="border border-black p-2 align-top" colSpan={4}>
// //                   <strong>Email address</strong> : {getValue('email')}
// //                 </td>
// //               </tr>

// //               <tr>
// //                 <td className="border border-black p-2 align-top" colSpan={2}>
// //                   <strong>Home Phone No</strong> : {getValue('homePhone')}
// //                 </td>
// //                 <td className="border border-black p-2 align-top" colSpan={2}>
// //                   <strong>Mobile No</strong> : {getValue('mobilePhone')}
// //                 </td>
// //               </tr>
// //             </tbody>
// //           </table>
// //         </div>

// //         {/* Footer Description */}
// //         <div className="mt-4">
// //           <p className="leading-relaxed text-xs">
// //             All figures quoted are based on NDIS price guide. This Service Agreement is made for the purpose
// //             of providing supports in accordance with the Individual's plan, it outlines key responsibilities required
// //             to enable <span className="text-red-600 font-semibold">Infinity Supports WA</span> to deliver quality support to
// //           </p>
// //         </div>

// //         {/* Footer - at bottom */}
// //         <div className="flex justify-between items-center text-xs font-bold mt-4 pt-3 border-t border-gray-200">
// //           <div>Website: {settings?.company_website}</div>
// //           <div>{settings?.sa_delivery_of_supports}</div>
// //           <div>Review Date: {settings?.review_date}</div>
// //         </div>
// //       </div>
// //     </A4PageWrapper>
// //   );
// // };

// // export default Page1;


// import React from 'react';
// import A4PageWrapper from './A4PageWrapper';

// interface Page1Props {
//   schema?: any;
//   data: any;
//   settings: any;
//   commonFieldsData: any;
//   images: any;
// }

// const Page1: React.FC<Page1Props> = ({ schema, data, settings, commonFieldsData, images }) => {
//   const commonFieldMapping: Record<string, string> = {
//     givenNames: 'name',
//     address: 'street',
//     dob: 'dob',
//     disability: 'disability',
//     ndisNumber: 'ndis',
//     state: 'state',
//     street: 'street',
//     postcode: 'postCode',
//     email: 'email',
//     homePhone: 'phone',
//     sex: 'sex'
//   };

//   const getValue = (key: string) => {
//     if (commonFieldMapping[key]) {
//       return commonFieldsData?.[commonFieldMapping[key]] ?? '';
//     }
//     return data?.[key] ?? '';
//   };

//   return (
//     <A4PageWrapper>
//       {/* Header and Title */}
//       <div className="px-6 pt-6">
//         <div className="flex justify-center mb-4">
//           <img
//             src="/infinity_logo.png"
//             alt="Infinity Supports WA Logo"
//             className="h-16 object-contain"
//           />
//         </div>

//         <div className="text-center mb-4">
//           <p className="font-bold underline text-base">SERVICE AGREEMENT FOR SERVICE DELIVERY</p>
//         </div>

//         <div className="mb-3">
//           <p className="font-bold underline text-base">Section 1</p>
//         </div>
//       </div>

//       {/* Content (Table + Description) */}
//       <div className="px-6 flex-1 overflow-hidden">
//         <table className="w-full border border-black border-collapse text-sm">
//           <tbody>
//             <tr>
//               <td className="border border-black p-2 font-bold align-top" style={{ width: '20%' }}>
//                 Date :
//               </td>
//               <td className="border border-black p-2 align-top" colSpan={3}>
//                 {getValue('agreementDate')}
//               </td>
//             </tr>

//             <tr className="bg-gray-300 font-bold">
//               <td className="border border-black p-2 align-top" style={{ width: '60%' }} colSpan={3}>
//                 Participant Details
//               </td>
//               <td className="border border-black p-2 align-top text-right whitespace-nowrap" style={{ width: '40%' }}>
//                 NDIS Number: <span className="font-normal">{getValue('ndisNumber')}</span>
//               </td>
//             </tr>

//             <tr>
//               <td className="border border-black p-2 align-top">
//                 <strong>{schema?.fields?.find((f: any) => f.key === 'surname')?.label}</strong>: {getValue('surname')}
//               </td>
//               <td className="border border-black p-2 align-top">
//                 <strong>{schema?.fields?.find((f: any) => f.key === 'givenNames')?.label}</strong>: {getValue('givenNames')}
//               </td>
//               <td className="border border-black p-2 align-top" colSpan={2}>
//                 <div>
//                   <p className="font-semibold mb-1">Sex:</p>
//                   {['Male', 'Female', 'Prefer not to say', 'Others'].map(option => (
//                     <div key={option} className="flex items-center text-sm mb-1">
//                       <input
//                         type="checkbox"
//                         readOnly
//                         checked={getValue('sex') === option}
//                         className="mr-2 scale-75"
//                       />
//                       {option}
//                     </div>
//                   ))}
//                 </div>
//               </td>
//             </tr>

//             <tr>
//               <td className="border border-black p-2 align-top" colSpan={4}>
//                 <strong>Pronoun</strong> : {getValue('pronoun')}
//               </td>
//             </tr>

//             <tr>
//               <td className="border border-black p-2 align-top" colSpan={3}>
//                 <strong>Are you an Aboriginal or Torres Strait Island descent?</strong>
//               </td>
//               <td className="border border-black p-2 align-top">
//                 <label className="inline-flex items-center mr-3 text-sm">
//                   <input
//                     type="checkbox"
//                     readOnly
//                     checked={getValue('indigenousStatus') === 'Yes'}
//                     className="mr-1 scale-75"
//                   />
//                   Yes
//                 </label>
//                 <label className="inline-flex items-center text-sm">
//                   <input
//                     type="checkbox"
//                     readOnly
//                     checked={getValue('indigenousStatus') === 'No'}
//                     className="mr-1 scale-75"
//                   />
//                   No
//                 </label>
//               </td>
//             </tr>

//             <tr>
//               <td className="border border-black p-2 align-top" colSpan={2}>
//                 <strong>Preferred name</strong> : {getValue('preferredName')}
//               </td>
//               <td className="border border-black p-2 align-top" colSpan={2}>
//                 <strong>Date of Birth</strong> : {getValue('dob')}
//               </td>
//             </tr>

//             <tr className="bg-gray-300 font-bold">
//               <td className="border border-black p-2 align-top" colSpan={4}>
//                 Residential Address Details
//               </td>
//             </tr>

//             <tr>
//               <td className="border border-black p-2 align-top" colSpan={4}>
//                 <strong>Number / Street</strong> : {getValue('street')}
//               </td>
//             </tr>

//             <tr>
//               <td className="border border-black p-2 align-top" colSpan={2}>
//                 <strong>State</strong> : {getValue('state')}
//               </td>
//               <td className="border border-black p-2 align-top" colSpan={2}>
//                 <strong>Postcode</strong> : {getValue('postcode')}
//               </td>
//             </tr>

//             <tr className="bg-gray-300 font-bold">
//               <td className="border border-black p-2 align-top" colSpan={4}>
//                 Participant Contact Details
//               </td>
//             </tr>

//             <tr>
//               <td className="border border-black p-2 align-top" colSpan={4}>
//                 <strong>Email address</strong> : {getValue('email')}
//               </td>
//             </tr>

//             <tr>
//               <td className="border border-black p-2 align-top" colSpan={2}>
//                 <strong>Home Phone No</strong> : {getValue('homePhone')}
//               </td>
//               <td className="border border-black p-2 align-top" colSpan={2}>
//                 <strong>Mobile No</strong> : {getValue('mobilePhone')}
//               </td>
//             </tr>
//           </tbody>
//         </table>

//         <h4 className="mt-4">
//   All figures quoted are based on NDIS price guide. This Service Agreement is made for the purpose
//   of providing supports in accordance with the Individual's plan, it outlines key responsibilities required
//   to enable <span className="text-red-600 font-semibold">Infinity Supports WA</span> to deliver quality support to
// </h4>

//       </div>

//       {/* Footer */}
//       <div className="px-6 pb-6 pt-3 border-t border-gray-200 text-sm font-bold flex justify-between">
//         <div>Website: {settings?.company_website}</div>
//         <div>{settings?.sa_delivery_of_supports}</div>
//         <div>Review Date: {settings?.review_date}</div>
//       </div>
//     </A4PageWrapper>
//   );
// };


// export default Page1;



// import React from 'react';
// import A4PageWrapper from './A4PageWrapper';

// interface Page1Props {
//   schema?: any;
//   data: any;
//   settings: any;
//   commonFieldsData: any;
//   images: any;
// }

const Page1: React.FC<any> = ({
  schema,
  data,
  settings,
  commonFieldsData,
  images,
}) => {
  const commonFieldMapping: Record<string, string> = {
    givenNames: 'name',
    address: 'street',
    dob: 'dob',
    disability: 'disability',
    ndisNumber: 'ndis',
    state: 'state',
    street: 'street',
    postcode: 'postCode',
    email: 'email',
    homePhone: 'phone',
    sex: 'sex'
  };

  const getValue = (key: string) => {
    if (commonFieldMapping[key]) {
      return commonFieldsData?.[commonFieldMapping[key]] ?? '';
    }
    return data?.[key] ?? '';
  };

  return (
    <A4PageWrapper>
      {/* Header */}
      <div className="px-6 pt-6 pb-3">
        <div className="flex justify-center mb-4">
          <img
            src={images?.infinityLogo || '/infinity_logo.png'}
            alt="Infinity Supports WA Logo"
            className="h-16 object-contain"
          />
        </div>
        <div className="text-center mb-4">
          <p className="font-bold underline text-base">SERVICE AGREEMENT FOR SERVICE DELIVERY</p>
        </div>
        <div className="mb-3">
          <p className="font-bold underline text-base">Section 1</p>
        </div>
      </div>
      {/* Main Content */}
      <div className="px-6 flex-1 flex flex-col">
        <table className="w-full border border-black border-collapse text-sm mb-1">
          <tbody>
            <tr>
              <td className="border border-black p-2 font-bold align-top" style={{ width: '20%' }}>
                Date :
              </td>
              <td className="border border-black p-2 align-top" colSpan={3}>
                {getValue('agreementDate')}
              </td>
            </tr>
            <tr className="bg-gray-300 font-bold">
              <td className="border border-black p-2 align-top" style={{ width: '60%' }} colSpan={3}>
                Participant Details
              </td>
              <td className="border border-black p-2 align-top text-right whitespace-nowrap" style={{ width: '40%' }}>
                NDIS Number: <span className="font-normal">{getValue('ndisNumber')}</span>
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2 align-top">
                <strong>{schema?.fields?.find((f: any) => f.key === 'surname')?.label}</strong>: {getValue('surname')}
              </td>
              <td className="border border-black p-2 align-top">
                <strong>{schema?.fields?.find((f: any) => f.key === 'givenNames')?.label}</strong>: {getValue('givenNames')}
              </td>
              <td className="border border-black p-2 align-top" colSpan={2}>
                <div>
                  <p className="font-semibold mb-1">Sex:</p>
                  {['Male', 'Female', 'Prefer not to say', 'Others'].map(option => (
                    <div key={option} className="flex items-center text-sm mb-1">
                      <input
                        type="checkbox"
                        readOnly
                        checked={getValue('sex') === option}
                        className="mr-2 scale-75"
                      />
                      {option}
                    </div>
                  ))}
                </div>
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2 align-top" colSpan={4}>
                <strong>Pronoun</strong> : {getValue('pronoun')}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2 align-top" colSpan={3}>
                <strong>Are you an Aboriginal or Torres Strait Island descent?</strong>
              </td>
              <td className="border border-black p-2 align-top">
                <label className="inline-flex items-center mr-3 text-sm">
                  <input
                    type="checkbox"
                    readOnly
                    checked={getValue('indigenousStatus') === 'Yes'}
                    className="mr-1 scale-75"
                  />
                  Yes
                </label>
                <label className="inline-flex items-center text-sm">
                  <input
                    type="checkbox"
                    readOnly
                    checked={getValue('indigenousStatus') === 'No'}
                    className="mr-1 scale-75"
                  />
                  No
                </label>
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2 align-top" colSpan={2}>
                <strong>Preferred name</strong> : {getValue('preferredName')}
              </td>
              <td className="border border-black p-2 align-top" colSpan={2}>
                <strong>Date of Birth</strong> : {getValue('dob')}
              </td>
            </tr>
            <tr className="bg-gray-300 font-bold">
              <td className="border border-black p-2 align-top" colSpan={4}>
                Residential Address Details
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2 align-top" colSpan={4}>
                <strong>Number / Street</strong> : {getValue('street')}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2 align-top" colSpan={2}>
                <strong>State</strong> : {getValue('state')}
              </td>
              <td className="border border-black p-2 align-top" colSpan={2}>
                <strong>Postcode</strong> : {getValue('postcode')}
              </td>
            </tr>
            <tr className="bg-gray-300 font-bold">
              <td className="border border-black p-2 align-top" colSpan={4}>
                Participant Contact Details
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2 align-top" colSpan={4}>
                <strong>Email address</strong> : {getValue('email')}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2 align-top" colSpan={2}>
                <strong>Home Phone No</strong> : {getValue('homePhone')}
              </td>
              <td className="border border-black p-2 align-top" colSpan={2}>
                <strong>Mobile No</strong> : {getValue('mobilePhone')}
              </td>
            </tr>
          </tbody>
        </table>
        <br /><br /><br /><br />
        <p
  className="mt-3 mb-0 font-medium"
  style={{
    fontSize: "1rem",       // Increase as needed (try 1.25rem or even 1.35rem for more)
    lineHeight: "1.5",           // Increase line height for more space; try up to 2.3 if needed
    textAlign: "justify",      // Optional: to improve alignment across the width
  }}
>
  All figures quoted are based on NDIS price guide. This Service Agreement is made for the purpose
  of providing supports in accordance with the Individual's plan, it outlines key responsibilities required
  to enable <span className="text-red-600 font-semibold">Infinity Supports WA</span> to deliver quality support to
</p>


      </div>
      {/* Footer: Sticky to bottom */}
      <div className="px-6 pb-3 pt-3 border-t border-gray-200 text-sm font-bold flex justify-between items-center mt-auto">
        <div>Website: {settings?.company_website}</div>
        <div>{settings?.sa_delivery_of_supports}</div>
        <div>Review Date: {settings?.review_date}</div>
      </div>
    </A4PageWrapper>
  );
};

export default Page1;
