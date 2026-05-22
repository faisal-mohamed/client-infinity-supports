

// import React from "react";
// import A4PageWrapper from "./A4PageWrapper";

// const Page10: React.FC<any> = ({data, commonFieldsData, settings, schema, images} : any) => {
//   return (
//     <A4PageWrapper>
//       <div className="flex flex-col h-full text-sm font-sans px-6 py-6">
//         {/* Logo */}
//         <div className="flex justify-center pt-6 pb-4">
//           <img
//             src={`${images?.infinityLogo}`}
//             alt="Infinity Supports WA logo"
//             className="h-[60px] w-[150px] object-contain"
//           />
//         </div>

//         {/* Contacts Table - stretch to fill space */}
//         <div className="flex-1 flex flex-col">
//           <table className="w-full h-full border-collapse border border-black text-xs flex-grow">
//             <tbody>
//               <tr>
//                 <td className="border border-black px-2 py-1">Gas Authority</td>
//                 <td className="border border-black px-2 py-1">Gas Corp</td>
//                 <td className="border border-black px-2 py-1">13 13 52</td>
//               </tr>
//               <tr>
//                 <td className="border border-black px-2 py-1">State Emergency</td>
//                 <td className="border border-black px-2 py-1">SES</td>
//                 <td className="border border-black px-2 py-1">13 25 00</td>
//               </tr>

//               {/* Section Header */}
//               <tr className="bg-gray-300 font-bold">
//                 <td className="border border-black px-2 py-1" colSpan={3}>
//                   Other Key Contacts
//                 </td>
//               </tr>

//               <tr>
//                 <td className="border border-black px-2 py-1">Health Direct</td>
//                 <td className="border border-black px-2 py-1" colSpan={2}>
//                   1800 022 222
//                 </td>
//               </tr>
//               <tr>
//                 <td className="border border-black px-2 py-1">Poisons Line</td>
//                 <td className="border border-black px-2 py-1" colSpan={2}>
//                   13 11 26
//                 </td>
//               </tr>
//               <tr>
//                 <td className="border border-black px-2 py-1">
//                   Lifeline (24 hours crisis counselling)
//                 </td>
//                 <td className="border border-black px-2 py-1" colSpan={2}>
//                   13 11 14
//                 </td>
//               </tr>
//               <tr>
//                 <td className="border border-black px-2 py-1">Beyond Blue</td>
//                 <td className="border border-black px-2 py-1" colSpan={2}>
//                   1300 22 4636
//                 </td>
//               </tr>
//               <tr>
//                 <td className="border border-black px-2 py-1">Crisis Care</td>
//                 <td className="border border-black px-2 py-1" colSpan={2}>
//                   1800 199 008
//                 </td>
//               </tr>
//               <tr>
//                 <td className="border border-black px-2 py-1">NDIS</td>
//                 <td className="border border-black px-2 py-1" colSpan={2}>
//                   1800 800 110
//                 </td>
//               </tr>
//               <tr>
//                 <td className="border border-black px-2 py-1">
//                   Mental Health Emergency Response Line
//                 </td>
//                 <td className="border border-black px-2 py-1" colSpan={2}>
//                   1300 555 788 (Perth) <br />
//                   1300 676 822 (Peel)
//                 </td>
//               </tr>

//               {/* Section Header */}
//               <tr className="bg-gray-300 font-bold text-xs">
//                 <td className="border border-black px-2 py-1" colSpan={3}>
//                   Type of support to be put in place in the event of an emergency or disaster and how we will support the participant (based on the Service agreement)
//                 </td>
//               </tr>

//               {/* Support Items */}
//               <tr className="font-semibold">
//                 <td className="border border-black px-2 py-1">Emergency</td>
//                 <td className="border border-black px-2 py-1" colSpan={2}>
//                   Support provided to the participants in the event of an emergency
//                 </td>
//               </tr>
//               <tr className="align-top">
//                 <td className="border border-black px-2 py-1">
//                   Infinity is unable to support for extended period
//                 </td>
//                 <td className="border border-black px-2 py-1" colSpan={2}>
//                   Infinity will assist the client/family to source alternative providers
//                 </td>
//               </tr>
//               <tr className="align-top">
//                 <td className="border border-black px-2 py-1">
//                   Client taken ill during support.
//                 </td>
//                 <td className="border border-black px-2 py-1" colSpan={2}>
//                   Call 000, Call family, take to nearest ED
//                 </td>
//               </tr>
//               <tr className="align-top">
//                 <td className="border border-black px-2 py-1">Closure of business</td>
//                 <td className="border border-black px-2 py-1" colSpan={2}>
//                   Infinity will assist the client/family to source alternative providers
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         {/* Footer */}
//         <div className="pt-4 mt-6">
//          <div className="flex justify-between text-xs px-2">
//             <div>Website: {settings?.company_website}</div>
//             <div>{settings?.participant_risk_assessment}</div>
//             <div>Review Date: {settings?.review_date}</div>
//           </div>
//         </div>
//       </div>
//     </A4PageWrapper>
//   );
// };

// export default Page10;


import React from "react";
import A4PageWrapper from "./A4PageWrapper";
import { format, parseISO, isValid } from "date-fns";

const Page10: React.FC<any> = ({
  data,
  commonFieldsData,
  settings,
  schema,
  images,
}) => {
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
      <div className="flex flex-col h-full text-sm font-sans px-6 py-6">
        {/* Logo */}
        <div className="flex justify-center pt-4 pb-2">
          <img
            src={images?.infinityLogo || "/infinity_logo.png"}
            alt="Infinity Supports WA logo"
            className="h-[60px] w-[150px] object-contain mb-2"
          />
        </div>

        {/* Table Section */}
        <div className="flex-1 flex flex-col">
          <table className="w-full border-collapse border border-black text-xs leading-[1.75]">
            <tbody className="align-top">
              {/* Gas and SES */}
              <tr>
                <td className="border border-black px-2 py-2">Gas Authority</td>
                <td className="border border-black px-2 py-2">Gas Corp</td>
                <td className="border border-black px-2 py-2">13 13 52</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-2">State Emergency</td>
                <td className="border border-black px-2 py-2">SES</td>
                <td className="border border-black px-2 py-2">13 25 00</td>
              </tr>

              {/* Other Key Contacts Section */}
              <tr className="bg-gray-300 font-bold">
                <td className="border border-black px-2 py-2" colSpan={3}>
                  Other Key Contacts
                </td>
              </tr>
              {[
                ["Health Direct", "1800 022 222"],
                ["Poisons Line", "13 11 26"],
                ["Lifeline (24 hours crisis counselling)", "13 11 14"],
                ["Beyond Blue", "1300 22 4636"],
                ["Crisis Care", "1800 199 008"],
                ["NDIS", "1800 800 110"],
              ].map(([label, number], i) => (
                <tr key={i}>
                  <td className="border border-black px-2 py-2">{label}</td>
                  <td className="border border-black px-2 py-2" colSpan={2}>
                    {number}
                  </td>
                </tr>
              ))}

              {/* Mental Health Emergency Contact */}
              <tr>
                <td className="border border-black px-2 py-2">
                  Mental Health Emergency Response Line
                </td>
                <td className="border border-black px-2 py-2" colSpan={2}>
                  1300 555 788 (Perth) <br />
                  1300 676 822 (Peel)
                </td>
              </tr>

              {/* Advocacy Contacts */}
              <tr>
                <td className="border border-black px-2 py-2 align-top" rowSpan={5}>
                  <div className="font-bold mb-1">Advocacy Services</div>
                  <div className="italic text-[10px]">(Infinity Supports WA does not recommend any particular advocacy provider. You are free to choose any service that best suits your needs.)</div>
                </td>
                <td className="border border-black px-2 py-2" colSpan={2}>Advocare (Aged &amp; Disability Advocacy) : 1800 655 566</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-2" colSpan={2}>People With Disabilities WA (PWdWA) : 1800 193 331</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-2" colSpan={2}>Developmental Disability WA (DDWA) : (08) 9420 7203</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-2" colSpan={2}>Advocacy WA : (08) 9474 6222</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-2" colSpan={2}>Mental Health Advocacy Service : 1800 999 057</td>
              </tr>
            </tbody>
          </table>

          {/* Gap between the two tables */}
          <div className="h-6" />

          {/* Support Items Table */}
          <table className="w-full border-collapse border border-black text-xs leading-[1.75]">
            <tbody className="align-top">
              {/* Support Header */}
              <tr className="bg-gray-300 font-bold text-xs">
                <td className="border border-black px-2 py-2" colSpan={3}>
                  Type of support to be put in place in the event of an emergency or disaster and how
                  we will support the participant (based on the Service agreement)
                </td>
              </tr>

              {/* Support Items */}
              <tr className="font-semibold">
                <td className="border border-black px-2 py-2 w-1/3">Emergency</td>
                <td className="border border-black px-2 py-2" colSpan={2}>
                  Support provided to the participants in the event of an emergency
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-2 w-1/3">
                  Infinity is unable to support for extended period
                </td>
                <td className="border border-black px-2 py-2" colSpan={2}>
                  Infinity will assist the client/family to source alternative providers
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-2 w-1/3">Client taken ill during support.</td>
                <td className="border border-black px-2 py-2" colSpan={2}>
                  Call 000, Call family, take to nearest ED
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-2 w-1/3">Closure of business</td>
                <td className="border border-black px-2 py-2" colSpan={2}>
                  Infinity will assist the client/family to source alternative providers
                </td>
              </tr>

              {/* Additional Emergency Scenarios from form data */}
              {data?.additionalEmergencyScenarios && (
                <tr className="align-top">
                  <td className="border border-black px-2 py-2 w-1/3">
                    Additional Scenarios
                  </td>
                  <td className="border border-black px-2 py-2" colSpan={2}>
                    {data.additionalEmergencyScenarios}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {(() => {
            const hasEmergencyPlans = Array.from({ length: 10 }, (_, i) => i + 1).some(
              (num) => data?.[`participantSpecificEmergencyScenario${num}`] || data?.[`participantSpecificEmergencySupport${num}`]
            );

            if (!hasEmergencyPlans) return null;

            return (
              <>
                {/* Gap between the two tables */}
                <div className="h-6" />

                {/* Participant Specific Emergency Table */}
                <table className="w-full border-collapse border border-black text-xs leading-[1.75]">
                  <tbody className="align-top">
                    <tr className="bg-gray-300 font-bold text-xs">
                      <td className="border border-black px-2 py-2" colSpan={3}>
                        Participant Specific Emergencies
                      </td>
                    </tr>
                    <tr className="bg-gray-100 font-semibold">
                      <td className="border border-black px-2 py-2 w-1/3">Emergency</td>
                      <td className="border border-black px-2 py-2" colSpan={2}>Plan</td>
                    </tr>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => {
                      const scenario = data?.[`participantSpecificEmergencyScenario${num}`];
                      const support = data?.[`participantSpecificEmergencySupport${num}`];
                      if (!scenario && !support) return null;
                      return (
                        <tr key={num}>
                          <td className="border border-black px-2 py-2 w-1/3 font-semibold">
                            {scenario || "N/A"}
                          </td>
                          <td className="border border-black px-2 py-2" colSpan={2}>
                            {support || "N/A"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            );
          })()}
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page10;
