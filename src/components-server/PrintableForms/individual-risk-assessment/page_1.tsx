// import React from 'react';
// import A4PageWrapper from './A4PageWrapper';

// interface Page1Props {
//   schema: any;
//   data: Record<string, any>;
//   commonFieldsData: Record<string, any>;
//   settings: Record<string, any>;
//   images?: Record<string, string>;
// }

// const Page1: React.FC<Page1Props> = ({ schema, data, commonFieldsData, settings, images }) => {
//   const commonFieldMapping: Record<string, string> = {
//     personName: 'name',
//     address: 'street',
//     dob: 'dob',
//     disability: 'disability',
//     phoneNumber: 'phone',
//     ndisNumber: 'ndis',
//     state: 'state',
//     street: 'street',
//     postcode: 'postCode',
//     email: 'email',
//     homePhone: 'phone',
//     sex: 'sex'
//   };

//   const getValue = (key: string) => {
//     if (commonFieldMapping?.[key]) {
//       return commonFieldsData?.[commonFieldMapping?.[key]] ?? '';
//     }
//     return data?.[key] ?? '';
//   };

//   return (
//     <A4PageWrapper>
//       <div
//         className="print-page flex flex-col justify-between w-full h-[1122px] overflow-hidden text-black text-xs font-sans"
//         style={{ breakAfter: 'page', fontSize: '12px', lineHeight: '2.4' }}
//       >
//         {/* Top Section */}
//         <div className="p-6">
//           {/* Logo */}
//           <div className="flex justify-center mb-4">
//             <img
//               src={`${images?.infinityLogo || '/infinity_logo.png'}`}
//               alt="Infinity Supports WA logo"
//               className="w-[250px] h-[100px] object-contain"
//             />
//           </div>

//           {/* Title */}
//           <div className="text-center font-bold text-[14px] mb-6">
//             Individual Activity Risk Assessment
//           </div>

//           {/* Header Info Fields */}
//           <div className="flex justify-between mb-6 max-w-3xl mx-auto">
//             <div className="w-1/2 space-y-4">
//               {schema?.headerInfo?.slice?.(0, 3)?.map?.((field: any) => (
//                 <div key={field?.key}>
//                   <span className="underline">{field?.label}:</span>{' '}
//                   <span className="ml-1">{getValue(field?.key)}</span>
//                 </div>
//               ))}
//             </div>
//             <div className="w-1/2 text-right space-y-4">
//               {schema?.headerInfo?.slice?.(3)?.map?.((field: any) => (
//                 <div key={field?.key}>
//                   <span className="underline">{field?.label}:</span>{' '}
//                   <span className="ml-1">{getValue(field?.key)}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Risk Matrix Table */}
//           <div className="overflow-x-auto">
//             <img
//               src={`${images?.riskMatrix || '/individual_risk_assessment.png'}`}
//               alt="Risk Matrix Table"
//               className="w-full border border-black"
//             />
//           </div>

//           {/* Risk Legend */}
//           <div className="mt-6 max-w-3xl mx-auto text-[14px] space-y-4">
//             <div>
//               <span className="underline">LOW</span>{' '}
//               <span className="text-green-600 font-semibold">GREEN</span>
//               <div>Visit acceptable. Ensure control options are followed.</div>
//             </div>
//             <div>
//               <span className="underline">MEDIUM</span>{' '}
//               <span className="text-yellow-400 font-semibold">YELLOW</span>
//               <div>
//                 Visit should only proceed after consultation with manager. The risks should
//                 be reviewed to consider all the hazards involved. The risks must be reduced prior
//                 to the visit – if in doubt, re-classify as Moderate Risk.
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <footer className="pt-4 border-t border-gray-300 flex justify-between text-xs text-blue-700 font-normal px-6">
//           <a
//             className="underline"
//             href={settings?.company_website || 'https://www.infinitysupportswa.org'}
//             target="_blank"
//             rel="noreferrer"
//           >
//             {settings?.company_website || 'https://www.infinitysupportswa.org'}
//           </a>
//           <div>Date of Review: {settings?.review_date || 'N/A'}</div>
//         </footer>
//       </div>
//     </A4PageWrapper>
//   );
// };

// export default Page1;


import React, { useEffect } from 'react';
import A4PageWrapper from './A4PageWrapper';

interface Page1Props {
  schema: any;
  data: Record<string, any>;
  commonFieldsData: Record<string, any>;
  settings: Record<string, any>;
  images?: Record<string, string>;
}

const Page1: React.FC<Page1Props> = ({
  schema,
  data,
  commonFieldsData,
  settings,
  images,
}) => {
  const commonFieldMapping: Record<string, string> = {
    personName: 'name',
    address: 'street',
    dob: 'dob',
    disability: 'disability',
    phoneNumber: 'phone',
    ndisNumber: 'ndis',
    state: 'state',
    street: 'street',
    postcode: 'postCode',
    email: 'email',
    homePhone: 'phone',
    sex: 'sex',
  };



console.log('Page1 component rendered with data:', data, 'commonFieldsData:', commonFieldsData);

  // const getValue = (key: string) => {
  //   if (commonFieldMapping?.[key]) {
  //     return commonFieldsData?.[commonFieldMapping?.[key]] ?? '';
  //   }
  //   return data?.[key] ?? '';
  // };
const getValue = (key: string): string => {
  if (commonFieldMapping?.[key]) {
    const commonVal = commonFieldsData?.[commonFieldMapping[key]];
    if (commonVal !== undefined && commonVal !== null && commonVal !== '') {
      return commonVal;
    }
  }
  return data?.[key] ?? '';
};

  const footer = (
    <div className="flex justify-between text-sm px-2">
      <div>{settings?.company_website || 'https://www.infinitysupportswa.org'}</div>
      <div>Date of Review: {settings?.review_date || 'N/A'}</div>
    </div>
  );

  return (
    <A4PageWrapper footer={footer}>
      <div className="flex flex-col h-full text-[16px] font-sans leading-snug">
        {/* Top Section */}
        <div className="px-6 pt-6 pb-4 flex flex-col gap-6">
          {/* Logo */}
          <div className="flex justify-center">
            <img
              src={images?.infinityLogo || '/infinity_logo.png'}
              alt="Infinity Supports WA logo"
              className="w-[250px] h-[100px] object-contain"
            />
          </div>

          {/* Title */}
          <div className="text-center font-bold text-[18px] uppercase">
            Individual Activity Risk Assessment
          </div>

          {/* Header Info Fields */}
          <div className="flex justify-between max-w-3xl mx-auto">
            <div className="w-1/2 space-y-2">
              {schema?.headerInfo?.slice?.(0, 3)?.map?.((field: any) => (
                <div key={field?.key}>
                  <span className="underline">{field?.label}:</span>{' '}
                  <span>{getValue(field?.key)}</span>
                </div>
              ))}
            </div>
            <div className="w-1/2 text-right space-y-2">
              {schema?.headerInfo?.slice?.(3)?.map?.((field: any) => (
                <div key={field?.key}>
                  <span className="underline">{field?.label}:</span>{' '}
                  <span>{getValue(field?.key)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Matrix Image */}
          <div className="overflow-x-auto">
            <img
              src={images?.riskMatrix || '/individual_risk_assessment.png'}
              alt="Risk Matrix Table"
              className="w-full border border-black"
            />
          </div>

          {/* Risk Legend */}
          <div className="max-w-3xl mx-auto text-[15px] space-y-4">
            <div>
              <span className="underline">LOW</span>{' '}
              <span className="text-green-600 font-semibold">GREEN</span>
              <div>Visit acceptable. Ensure control options are followed.</div>
            </div>
            <div>
              <span className="underline">MEDIUM</span>{' '}
              <span className="text-yellow-500 font-semibold">YELLOW</span>
              <div>
                Visit should only proceed after consultation with manager. The risks should be
                reviewed to consider all the hazards involved. The risks must be reduced prior to the
                visit – if in doubt, re-classify as Moderate Risk.
              </div>
            </div>
          </div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page1;
