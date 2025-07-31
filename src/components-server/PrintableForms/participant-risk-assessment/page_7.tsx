


// import React from "react";
// import A4PageWrapper from "./A4PageWrapper";

// interface Page7Props {
//      schema: any;
//   data: any;
//   commonFieldsData: Record<string, string>;
//   settings: any;
//   images?: any;
// }

// const Page7: React.FC<Page7Props> = ({ schema, data, commonFieldsData, settings, images }) => {
//   const rows = schema?.riskRows?.slice(0, 4); // First 4 rows

//   return (
//     <A4PageWrapper>
//       <div className="flex flex-col h-full text-sm font-sans">
//         {/* Logo */}
//         <div className="flex justify-center pt-6 pb-4">
//          <img
//             src={`${images?.infinityLogo}`}
//             alt="Infinity Supports WA logo"
//             className="h-[60px] w-[150px] object-contain"
//           />
//         </div>

//         {/* Safe Meeting Point Table */}
//         <div className="px-6">
//           <table className="w-full border border-black border-collapse mb-6">
//             <thead>
//               <tr className="bg-gray-300 font-semibold">
//                 <th className="border border-black p-2 text-left">
//                   Participant household safe meeting point
//                 </th>
//                 <th className="border border-black w-[70%] p-2"></th>
//               </tr>
//             </thead>
//             <tbody>
//               {schema?.householdMeetingPoint?.map((field: any) => (
//                 <tr key={field.key}>
//                   <td className="border border-black p-2 font-medium">{field?.label}</td>
//                   <td className="border border-black p-2">{data?.[field.key] || ""}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Instruction */}
//           <p className="text-xs font-bold text-center mb-4 uppercase">
//             If risk is identified, please discuss with the manager
//           </p>

//           {/* Risk Table */}
//           <table className="w-full border border-black border-collapse">
//             <thead className="bg-gray-300 font-semibold">
//               <tr>
//                 <th className="border border-black p-2 text-left">Issue/Task</th>
//                 <th className="border border-black p-2 text-left">Risk Score</th>
//                 <th className="border border-black p-2 text-left">Control Measure</th>
//                 <th className="border border-black p-2 text-left">Person Responsible</th>
//               </tr>
//             </thead>
//             <tbody>
//               {rows.map((row: any, i: number) => (
//                 <tr key={i} className="h-20 align-top">
//                   <td className="border border-black p-2 align-top">{data?.[row.issue] || ""}</td>
//                   <td className="border border-black p-2 align-top">{data?.[row.score] || ""}</td>
//                   <td className="border border-black p-2 align-top">{data?.[row.control] || ""}</td>
//                   <td className="border border-black p-2 align-top">{data?.[row.person] || ""}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Footer */}
//         <div className="pt-4 mt-auto px-6">
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

// export default Page7;


import React from "react";
import A4PageWrapper from "./A4PageWrapper";
import { format, parseISO, isValid } from "date-fns";

interface Page7Props {
  schema: any;
  data: any;
  commonFieldsData: Record<string, string>;
  settings: any;
  images?: any;
}

const Page7: React.FC<Page7Props> = ({ schema, data, commonFieldsData, settings, images }) => {
  const rows = schema?.riskRows?.slice(0, 4); // First 4 rows

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
    <A4PageWrapper footer={footer}>
      <div className="flex flex-col h-full text-sm font-sans">
        {/* Logo */}
        <div className="flex justify-center pt-6">
          <img
            src={`${images?.infinityLogo}` || '/infinity_logo.png'}
            alt="Infinity Supports WA logo"
            className="h-[60px] w-[150px] object-contain mb-4"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col px-6">
          {/* Safe Meeting Point Table */}
          <table className="w-full border border-black border-collapse mb-6">
            <thead>
              <tr className="bg-gray-300 font-semibold">
                <th className="border border-black p-2 text-left">
                  Participant household safe meeting point
                </th>
                <th className="border border-black w-[70%] p-2"></th>
              </tr>
            </thead>
            <tbody>
              {schema?.householdMeetingPoint?.map((field: any) => (
                <tr key={field.key}>
                  <td className="border border-black p-2 font-medium">{field?.label}</td>
                  <td className="border border-black p-2">{data?.[field.key] || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Instruction */}
          <p className="text-xs font-bold text-center mb-4 uppercase">
            If risk is identified, please discuss with the manager
          </p>

          {/* Risk Table */}
          <table className="w-full border border-black border-collapse h-full table-fixed">
            <thead className="bg-gray-300 font-semibold">
              <tr>
                <th className="border border-black p-2 text-left">Issue/Task</th>
                <th className="border border-black p-2 text-left">Risk Score</th>
                <th className="border border-black p-2 text-left">Control Measure</th>
                <th className="border border-black p-2 text-left">Person Responsible</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row: any, i: number) => (
                <tr key={i} className="h-24 align-top">
                  <td className="border border-black p-2 align-top">{data?.[row.issue] || ""}</td>
                  <td className="border border-black p-2 align-top">{data?.[row.score] || ""}</td>
                  <td className="border border-black p-2 align-top">{data?.[row.control] || ""}</td>
                  <td className="border border-black p-2 align-top">{data?.[row.person] || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page7;
