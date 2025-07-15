// import React from 'react';
// import A4PageWrapper from './A4PageWrapper';

// interface Page4Props {
//    schema  ?: any;
//   data : any;
//   settings : any
//   commonFieldsData: any
//   images: any;
// }

// const Page4: React.FC<Page4Props> = ({ schema, data, commonFieldsData, settings, images }) => {
//   return (
//     <A4PageWrapper>
//       <div className="h-full flex flex-col p-6">
//         {/* Header with Logo */}
//         <div className="flex justify-center mb-6">
//           <img
//             src={images?.infinityLogo}
//             alt="Infinity Supports WA Logo"
//             className="h-16 object-contain"
//           />
//         </div>

//         {/* Content area - takes up remaining space */}
//         <div className="flex-1 flex flex-col">
//           {/* Provider Responsibilities */}
//           <div className="flex-1">
//             <ul className="list-disc pl-5 space-y-4 mb-8 text-sm leading-loose">
//               {schema.sections.providerResponsibilities.map((item : any, index : any ) => (
//                 <li key={index} className="leading-loose">
//                   {item.includes("Infinity Supports WA") ? (
//                     <>
//                       {item.split("Infinity Supports WA")[0]}
//                       <span className="text-red-600 font-semibold">Infinity Supports WA</span>
//                       {item.split("Infinity Supports WA")[1]}
//                     </>
//                   ) : (
//                     item
//                   )}
//                 </li>
//               ))}
//             </ul>


//             {/* Individual Responsibilities Heading */}
//             <div>
//               <p className="font-bold underline text-sm leading-loose mb-3">
//                 {schema.sections.individualResponsibilitiesHeading}
//               </p>
//               <p className="text-sm leading-loose">agrees to:</p>
//             </div>
//           </div>
//         </div>

//         {/* Footer - at bottom */}
//         <div className="flex justify-between items-center text-xs font-bold mt-6 pt-3 border-t border-gray-200">
//         <div>Website: {settings?.company_website}</div>
//           <div>{settings?.sa_delivery_of_supports}</div>
//           <div>Review Date: {settings?.review_date}</div>
//         </div>
//       </div>
//     </A4PageWrapper>
//   );
// };

// export default Page4;


import React from 'react';
import A4PageWrapper from './A4PageWrapper';

interface Page4Props {
  schema?: any;
  data: any;
  settings: any;
  commonFieldsData: any;
  images: any;
}

const Page4: React.FC<Page4Props> = ({
  schema,
  data,
  commonFieldsData,
  settings,
  images,
}) => {
  return (
    <A4PageWrapper>
      <div
        className="flex flex-col h-full flex-1 px-6 pt-6 pb-3 text-base text-justify"
        style={{ lineHeight: '2.5' }}
      >
        {/* Header with Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={images?.infinityLogo || '/infinity_logo.png'}
            alt="Infinity Supports WA Logo"
            className="h-16 object-contain"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Provider Responsibilities */}
          <div className="mb-8 space-y-4">
  {schema?.sections?.providerResponsibilities?.map((item: string, index: number) => {
    const [before, after] = item.split('Infinity Supports WA');
    return (
      <p key={index} className="flex items-start gap-2">
        {/* PDF-safe bullet marker */}
        <span className="mr-2">•</span>
        <span>
          {item.includes('Infinity Supports WA') ? (
            <>
              {before}
              <span className="text-red-600 font-semibold">Infinity Supports WA</span>
              {after}
            </>
          ) : (
            item
          )}
        </span>
      </p>
    );
  })}
</div>


          {/* Responsibilities of Individual */}
          <div className="flex-1 flex flex-col justify-end">
            <p className="font-bold underline mb-3">
              {schema?.sections?.individualResponsibilitiesHeading}
            </p>
            <p>agrees to:</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs font-bold mt-auto pt-3 border-t border-gray-200">
          <div>Website: {settings?.company_website}</div>
          <div>{settings?.sa_delivery_of_supports}</div>
          <div>Review Date: {settings?.review_date}</div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page4;
