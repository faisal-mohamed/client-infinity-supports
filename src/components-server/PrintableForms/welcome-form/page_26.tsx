// import React from 'react';
// import A4PageWrapper from './A4PageWrapper';

// const Page26  = ({ schema, data, settings, commonFieldsData , images}: any) => {

//   const commonFieldMapping: Record<string, string> = {
//     name: 'name',
//     ndisNumber: 'ndis',
//     dob: 'dob',
//     address: 'street',
//   };

//   const getDisplayValue = (key: string): React.ReactNode => {
//     // Handle signature as image
//     if (key === 'signature') {
//       const signatureBase64 = data?.[key];
//       if (signatureBase64?.startsWith('data:image')) {
//         return (
//           <img
//             src={signatureBase64}
//             alt="Signature"
//             className="h-[80px] mt-2 border border-gray-300 rounded"
//           />
//         );
//       } else {
//         return '__________________________';
//       }
//     }

//     // Handle common fields
//     if (commonFieldMapping[key]) {
//       return commonFieldsData?.[commonFieldMapping[key]] || '__________________________';
//     }

//     // Default fallback
//     return data?.[key] || '__________________________';
//   };

//   return (
//     <A4PageWrapper>
//       <div className="flex flex-col h-full text-sm text-black font-[Times_New_Roman]">
//         {/* Content */}
//         <div className="flex-grow max-w-3xl mx-auto px-6 pt-10">
//           {/* Logo */}
//           <div className="flex justify-center pt-6 pb-4">
//              <img
//             src={images?.infinityLogo}
//             alt="Infinity Supports WA logo"
//             className="mb-8 w-[200px] h-[80px] object-contain"
//           />
//           </div>

//           {/* Title */}
//           <h2 className="text-center font-bold text-sm mb-6">
//             {schema?.title}
//           </h2>

//           {/* Static Content */}
//           <div className="mb-4">{schema?.fields?.[0]?.content}</div>
//           <div className="mb-6">{schema?.fields?.[1]?.content}</div>

//           {/* Read-only Inputs */}
//           <div className="space-y-4">
//             {schema?.fields?.slice(2).map((field: any) => (
//               <div key={field?.key} className="mb-2">
//                 <p className="font-medium">{field?.label}:</p>
//                 <div>{getDisplayValue(field?.key)}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Footer */}
//         <footer className="w-full border-t border-gray-300 py-4">
//           <div className="max-w-3xl mx-auto px-6 flex justify-between text-xs text-gray-500">
//             <span>Website: {settings?.company_website}</span>
//             <span>{settings?.welcome_form}</span>
//             <span>Review Date: {settings?.review_date}</span>
//           </div>
//         </footer>
//       </div>
//     </A4PageWrapper>
//   );
// };

// export default Page26;


import React from 'react';
import A4PageWrapper from './A4PageWrapper';

const Page26 = ({ schema, data, settings, commonFieldsData, images }: any) => {
  const commonFieldMapping: Record<string, string> = {
    name: 'name',
    ndisNumber: 'ndis',
    dob: 'dob',
    address: 'street',
  };

  const getDisplayValue = (key: string): React.ReactNode => {
    // Handle signature as image
    if (key === 'signature') {
      const signatureBase64 = data?.[key];
      if (signatureBase64?.startsWith('data:image')) {
        return (
          <img
            src={signatureBase64}
            alt="Signature"
            className="h-[80px] mt-2 border border-gray-300 rounded"
          />
        );
      } else {
        return '__________________________';
      }
    }

    // Handle common fields
    if (commonFieldMapping[key]) {
      return commonFieldsData?.[commonFieldMapping[key]] || '__________________________';
    }

    // Default fallback
    return data?.[key] || '__________________________';
  };

  return (
    <A4PageWrapper>
      <div className="a4-inner text-sm text-black font-[Times_New_Roman]">
        {/* Content */}
        <div className="flex-1 max-w-3xl mx-auto px-6 pt-6 flex flex-col">
          {/* Logo */}
          <div className="flex justify-center pb-2">
            <img
              src={images?.infinityLogo}
              alt="Infinity Supports WA logo"
              className="mb-4 w-[140px] h-[56px] object-contain"
            />
          </div>

          {/* Title */}
          <h2 className="text-center font-bold text-sm mb-5">
            {schema?.title}
          </h2>

          {/* Static Content */}
          <div className="mb-2">{schema?.fields?.[0]?.content}</div>
          <div className="mb-4">{schema?.fields?.[1]?.content}</div>

          {/* Read-only Inputs */}
          <div className="space-y-2">
            {schema?.fields?.slice(2).map((field: any) => (
              <div key={field?.key} className="mb-1">
                <p className="font-medium">{field?.label}:</p>
                <div>{getDisplayValue(field?.key)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full border-t border-gray-300 py-3">
          <div className="max-w-3xl mx-auto px-6 flex justify-between text-xs text-gray-500">
            <span>Website: {settings?.company_website}</span>
            <span>{settings?.welcome_form}</span>
            <span>Review Date: {settings?.review_date}</span>
          </div>
        </footer>
      </div>
    </A4PageWrapper>
  );
};

export default Page26;
