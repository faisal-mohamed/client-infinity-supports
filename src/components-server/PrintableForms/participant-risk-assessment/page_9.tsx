

// import React from "react";
// import A4PageWrapper from "./A4PageWrapper";

// const Page9: React.FC<any> = ({data, commonFieldsData, settings, schema, images} : any) => {
//   return (
//     <A4PageWrapper>
//       <div className="flex flex-col h-full text-sm font-sans px-6 py-6">
//         {/* Header */}
//           <div className="flex justify-center pt-6 pb-4">
//           <img
//             src={`${images?.infinityLogo}`}
//             alt="Infinity Supports WA logo"
//             className="h-[60px] w-[150px] object-contain"
//           />
    
//         </div>
//               <p className="text-xs uppercase tracking-wider text-black-700 font-semibold" style={{ textAlign: 'center' }}>
//             Risk Assessment Matrix
//           </p>
//           <br />

//         {/* Risk Matrix Placeholder */}
//         <img src="/participant_risk_assessment_matrix.png" alt="" />

//         {/* Summary */}
//         {/* <div className="mb-6 font-medium">
//           <p>
//             Visit should only proceed after consultation with{" "}
//             <span className="underline">Manager</span>. The risks should be
//             reviewed to consider all the hazards involved. The risks must be
//             reduced prior to the visit.
//           </p>
//         </div> */}

//         {/* Emergency Contact Table */}
//         <div className="border border-black mb-6">
//           <table className="w-full border-collapse text-xs">
//             <thead>
//               <tr>
//                 <th
//                   colSpan={3}
//                   className="border border-black px-2 py-1 text-left font-bold bg-gray-300"
//                 >
//                   Emergency Contact Numbers
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td className="border border-black px-2 py-1 w-1/3">Police</td>
//                 <td colSpan={2} className="border border-black px-2 py-1 text-center">
//                   <img
//                     src={images?.emergencyNo}
//                     alt="000 Emergency"
//                     className="max-h-[60px] mx-auto"
//                   />
//                 </td>
//               </tr>
//               <tr>
//                 <td className="border border-black px-2 py-1">Fire</td>
//                 <td className="border border-black px-2 py-1"></td>
//                 <td className="border border-black px-2 py-1"></td>
//               </tr>
//               <tr>
//                 <td className="border border-black px-2 py-1">Ambulance</td>
//                 <td className="border border-black px-2 py-1"></td>
//                 <td className="border border-black px-2 py-1"></td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         {/* Utilities Table */}
//         <div className="border border-black">
//           <table className="w-full border-collapse text-xs">
//             <thead>
//               <tr>
//                 <th
//                   colSpan={3}
//                   className="border border-black px-2 py-1 text-left font-bold bg-gray-300"
//                 >
//                   Utilities
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td className="border border-black px-2 py-1 w-1/3">Electricity Authority</td>
//                 <td className="border border-black px-2 py-1">Western Power</td>
//                 <td className="border border-black px-2 py-1">13 13 51</td>
//               </tr>
//               <tr>
//                 <td className="border border-black px-2 py-1">Water Authority</td>
//                 <td className="border border-black px-2 py-1">Water Corp</td>
//                 <td className="border border-black px-2 py-1">13 13 75</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         {/* Footer */}
//         <div className="pt-4 mt-auto">
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

// export default Page9;


import React from "react";
import A4PageWrapper from "./A4PageWrapper";

const Page9: React.FC<any> = ({ data, commonFieldsData, settings, schema, images }) => {
  const footer = (
    <div className="flex justify-between text-[10px] px-2">
      <div>Website: {settings?.company_website}</div>
      <div>{settings?.participant_risk_assessment}</div>
      <div>Review Date: {settings?.review_date}</div>
    </div>
  );

  return (
    <A4PageWrapper footer={footer}>
      <div className="flex flex-col h-full font-sans text-[10px] px-4 pt-2 pb-4">
        {/* Logo */}
        <div className="flex justify-center mb-2">
          <img
            src={images?.infinityLogo || "/infinity_logo.png"}
            alt="Infinity Supports WA logo"
            className="h-[40px] w-[100px] object-contain"
          />
        </div>

        {/* Risk Assessment Matrix */}
        <p className="uppercase tracking-wider font-semibold text-center mb-1">
          Risk Assessment Matrix
        </p>
        <div className="mb-2 flex justify-center">
          <img
            src={images?.riskAssessmentMatrix}
            alt="Risk Assessment Matrix"
            className="h-[80px] object-contain"
          />
        </div>

        {/* Emergency Contact Table */}
        <div className="border border-black mb-2">
          <table className="w-full border-collapse text-[9px]">
            <thead>
              <tr>
                <th
                  colSpan={3}
                  className="border border-black px-1 py-0.5 text-left font-bold bg-gray-300"
                >
                  Emergency Contact Numbers
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black px-1 py-0.5 w-1/3">Police</td>
                <td colSpan={2} className="border border-black px-1 py-0.5 text-center">
                  <img
                    src={images?.emergencyNo}
                    alt="000 Emergency"
                    className="max-h-[25px] mx-auto"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1 py-0.5">Fire</td>
                <td className="border border-black px-1 py-0.5"></td>
                <td className="border border-black px-1 py-0.5"></td>
              </tr>
              <tr>
                <td className="border border-black px-1 py-0.5">Ambulance</td>
                <td className="border border-black px-1 py-0.5"></td>
                <td className="border border-black px-1 py-0.5"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Utilities Table */}
        <div className="border border-black">
          <table className="w-full border-collapse text-[9px]">
            <thead>
              <tr>
                <th
                  colSpan={3}
                  className="border border-black px-1 py-0.5 text-left font-bold bg-gray-300"
                >
                  Utilities
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black px-1 py-0.5 w-1/3">Electricity Authority</td>
                <td className="border border-black px-1 py-0.5">Western Power</td>
                <td className="border border-black px-1 py-0.5">13 13 51</td>
              </tr>
              <tr>
                <td className="border border-black px-1 py-0.5">Water Authority</td>
                <td className="border border-black px-1 py-0.5">Water Corp</td>
                <td className="border border-black px-1 py-0.5">13 13 75</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page9;
