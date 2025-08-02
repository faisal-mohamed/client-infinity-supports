

// import React from 'react';
// import A4PageWrapper from './A4PageWrapper';

// interface Field {
//   key: string;
//   label: string;
//   type: string;
// }

// interface Page5Props {
//    schema: any;
//   data: any;
//   commonFieldsData: Record<string, string>;
//   settings: any;
//   images?: any;
// }

// const Page5: React.FC<Page5Props> = ({ data, schema, settings, images }) => {
//   const getCheckboxValue = (key: string) => data?.[key] === true;

//   return (
//     <A4PageWrapper>
//       <div className="flex flex-col h-full text-sm font-sans">
//         {/* Header with Logo */}
//        <div className="flex justify-center pt-6 pb-4">
//           <img
//             src={`${images?.infinityLogo}`}
//             alt="Infinity Supports WA logo"
//             className="h-[60px] w-[150px] object-contain"
//           />
//         </div>

//         {/* Intro Section */}
//         <div className="px-6 pb-4">
//           <ol className="list-decimal list-inside space-y-2 mb-4 font-normal">
//             <li>
//               <span className="font-semibold">Communication:</span> Ensure that all stakeholders,
//               including participants, families, and your team, understand the dual assessment of
//               reliance and health-safety impact, as well as the corresponding mitigation plans.
//             </li>
//             <li>
//               <span className="font-semibold">Emergency Planning:</span> For participants with higher
//               risk levels, develop emergency plans that outline steps to be taken in case of service
//               disruptions or unexpected events.
//             </li>
//           </ol>

//           <p className="mb-4 font-normal">
//             By considering both the participants' level of reliance on the services and the potential
//             consequences for their health and safety in case of disruptions, we can create a more
//             comprehensive risk assessment framework that prioritises their well-being.
//           </p>
//         </div>

//         {/* Risk Assessment Table */}
//         <div className="flex-1 flex flex-col px-6">
//           <table className="w-full border border-black border-collapse text-sm flex-1">
//             <thead className="bg-gray-300 font-semibold">
//               <tr>
//                 <th className="border border-black p-2 text-left w-24">Risk Level</th>
//                 <th className="border border-black p-2 text-left">Description</th>
//                 <th className="border border-black p-2 text-left">Criteria</th>
//                 <th className="border border-black p-2 text-left">Impact on Health-Safety</th>
//                 <th className="border border-black p-2 text-center w-24">Select Risk</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td className="border border-black p-2 text-green-600 font-semibold">Low</td>
//                 <td className="border border-black p-2">
//                   Participants have a low reliance on provider services to meet daily living needs.
//                 </td>
//                 <td className="border border-black p-2">
//                   Participants can independently perform most daily living activities without
//                   assistance. Any disruptions in services would have minimal impact on their
//                   overall well-being.
//                 </td>
//                 <td className="border border-black p-2">
//                   Disruptions in services would have minimal impact on participants' health and
//                   safety, as they can manage most activities independently.
//                 </td>
//                 <td className="border border-black p-2 text-center">
//                   <input
//                     type="checkbox"
//                     className="w-3 h-3"
//                     checked={getCheckboxValue('riskLevelLow')}
//                     readOnly
//                   />
//                 </td>
//               </tr>
//               <tr>
//                 <td className="border border-black p-2 text-blue-700 font-semibold">Moderate</td>
//                 <td className="border border-black p-2">
//                   Participants have a moderate reliance on provider services for certain daily living
//                   needs.
//                 </td>
//                 <td className="border border-black p-2">
//                   Participants can perform 
// some daily activities 
// independently but rely on 
// the provider for specific 
// tasks such as 
// transportation, meal 
// preparation, or medication 
// management. A disruption 
//                 </td>
//                 <td className="border border-black p-2">
// Disruptions in services 
// could moderately impact 
// participants' health and 
// safety, particularly for                 </td>
//                 <td className="border border-black p-2 text-center">
//                   <input
//                     type="checkbox"
//                     className="w-3 h-3"
//                     checked={getCheckboxValue('riskLevelModerate')}
//                     readOnly
//                   />
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         {/* Footer */}
//         <div className="pt-4">
//           <div className="flex justify-between text-xs px-2">
//             <div>Website: {settings?.company_website}</div>
//             <div>{settings?.participant_risk_assessment}</div>
//             <div>Review Date: {settings?.review_date}</div>
//           </div>
//         </div>
//       </div>
//     </A4PageWrapper>
//   );
// };

// export default Page5;


import React from 'react';
import A4PageWrapper from './A4PageWrapper';

interface Field {
  key: string;
  label: string;
  type: string;
}

interface Page5Props {
  schema: any;
  data: any;
  commonFieldsData: Record<string, string>;
  settings: any;
  images?: any;
}
import { format, parseISO, isValid } from "date-fns";

const Page5: React.FC<Page5Props> = ({ data, schema, settings, images }) => {
  const getCheckboxValue = (key: string) => data?.[key] === true;

  const footer = (
    <div className="flex justify-between text-xs px-2">
      <div>Website: {settings?.company_website}</div>
      <div>{settings?.participant_risk_assessment}</div>
<div>
  Review Date:{' '}
  {settings?.review_date && /^\d{4}-\d{2}-\d{2}$/.test(settings.review_date)
    ? format(parseISO(settings.review_date), 'dd-MM-yyyy')
    : 'N/A'}
</div>    </div>
  );

  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full text-sm font-sans">
        {/* Header with Logo */}
        <div className="flex justify-center pt-6">
          <img
            src={`${images?.infinityLogo}` || '/infinity_logo.png'}
            alt="Infinity Supports WA logo"
            className="h-[60px] w-[150px] object-contain mb-4"
          />
        </div>

        {/* Intro Section */}
        <div className="px-6 pb-4">
          <ol className="list-decimal list-inside space-y-4 leading-[1.8] mb-6 font-normal">
            <li>
              <span className="font-semibold">Communication:</span> Ensure that all stakeholders,
              including participants, families, and your team, understand the dual assessment of
              reliance and health-safety impact, as well as the corresponding mitigation plans.
            </li>
            <li>
              <span className="font-semibold">Emergency Planning:</span> For participants with higher
              risk levels, develop emergency plans that outline steps to be taken in case of service
              disruptions or unexpected events.
            </li>
          </ol>

          <p className="mb-4 leading-relaxed font-normal">
            By considering both the participants' level of reliance on the services and the potential
            consequences for their health and safety in case of disruptions, we can create a more
            comprehensive risk assessment framework that prioritises their well-being.
          </p>
        </div>

        {/* Risk Assessment Table - vertically stretches */}
        <div className="flex-1 flex flex-col px-6">
          <div className="flex-1">
            <table className="w-full h-full border border-black border-collapse text-sm table-fixed">
              <thead className="bg-gray-300 font-semibold">
                <tr>
                  <th className="border border-black p-2 text-left w-24">Risk Level</th>
                  <th className="border border-black p-2 text-left">Description</th>
                  <th className="border border-black p-2 text-left">Criteria</th>
                  <th className="border border-black p-2 text-left">Impact on Health-Safety</th>
                  <th className="border border-black p-2 text-center w-24">Select Risk</th>
                </tr>
              </thead>
              <tbody className="align-top">
                <tr>
                  <td className="border border-black p-2 text-green-600 font-semibold">Low</td>
                  <td className="border border-black p-2">
                    Participants have a low reliance on provider services to meet daily living needs.
                  </td>
                  <td className="border border-black p-2">
                    Participants can independently perform most daily living activities without
                    assistance. Any disruptions in services would have minimal impact on their
                    overall well-being.
                  </td>
                  <td className="border border-black p-2">
                    Disruptions in services would have minimal impact on participants' health and
                    safety, as they can manage most activities independently.
                  </td>
                  <td className="border border-black p-2 text-center">
                    <input
                      type="checkbox"
                      className="w-3 h-3"
                      checked={getCheckboxValue('riskLevelLow')}
                      readOnly
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2 text-blue-700 font-semibold">Moderate</td>
                  <td className="border border-black p-2">
                    Participants have a moderate reliance on provider services for certain daily living
                    needs.
                  </td>
                  <td className="border border-black p-2">
                    Participants can perform some daily activities independently but rely on the
                    provider for specific tasks such as transportation, meal preparation, or medication
                    management.
                  </td>
                  <td className="border border-black p-2">
                    Disruptions in services could moderately impact participants' health and safety,
                    particularly for those who depend on providers for essential activities.
                  </td>
                  <td className="border border-black p-2 text-center">
                    <input
                      type="checkbox"
                      className="w-3 h-3"
                      checked={getCheckboxValue('riskLevelModerate')}
                      readOnly
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page5;

