

// import React from 'react';
// import A4PageWrapper from './A4PageWrapper';

// const Page15= ({settings, images}: any ) => {
//   return (
//     <A4PageWrapper>
//       <div className="flex flex-col h-full font-[Times_New_Roman] text-black text-base leading-relaxed">
//         {/* Top: Logo */}
//         <div className="flex justify-center pt-6 pb-4">
//            <img
//             src={images?.infinityLogo}
//             alt="Infinity Supports WA logo"
//             className="mb-8 w-[200px] h-[80px] object-contain"
//           />
//         </div>

//         {/* Middle: Content */}
//         <div className="flex-grow w-full max-w-3xl mx-auto px-6">
//           {/* First bullet list */}
//           <ul className="list-disc list-inside mb-6 space-y-2">
//             <li>
//               An unexpected death, serious injury or alleged assault (including physical,
//               sexual abuse, sexual assault or indecent assault) that occurs as a result of or
//               during the delivery of services.
//             </li>
//             <li>
//               Allegations of serious, unlawful or criminal activity or conduct involving an
//               Infinity Supports WA employee, subcontractor or volunteer that has caused,
//               or has the potential to cause, serious harm to you.
//             </li>
//             <li>
//               An incident where you assault or cause serious harm to others (including our
//               employees, volunteers or contractors), as a result of or during the delivery
//               of services.
//             </li>
//             <li>
//               A severe fire, natural disaster, accident or other incident that will—or is
//               likely to—prevent service provision, result in closure or cause significant
//               damage to premises or property, or pose a substantial threat to your health and safety.
//             </li>
//           </ul>

//           <p className="mb-4">
//             Infinity Supports WA has established procedures that identify, manage and
//             resolve incidents, which include:
//           </p>

//           {/* Second bullet list */}
//           <ul className="list-disc list-inside mb-6 space-y-2">
//             <li>Staff members must report all incidents to Infinity Supports WA.</li>
//             <li>Completion of an incident report that identifies and documents the incident.</li>
//             <li>
//               Infinity Supports WA is responsible for reporting ‘reportable incidents’ to the NDIS Commission
//               and other required agencies.
//             </li>
//             <li>
//               Compliance with the National Disability Insurance Scheme (Incident Management
//               and Reportable Incidents) Rules 2018.
//             </li>
//             <li>Supporting and assisting you if you are affected by the incident.</li>
//             <li>Reviewing the incident internally if you or others were affected.</li>
//             <li>
//               Collaborating with you, your family and/or advocate to manage and resolve the incident.
//             </li>
//             <li>
//               Making necessary amendments to systems and processes to reduce the risk of recurrence.
//             </li>
//           </ul>

//           <p className="mb-12">
//             Infinity Supports WA will implement appropriate preventive measures to
//             mitigate further harm or injury as necessary. As part of the investigation
//             process, the incident scene and any evidence must be preserved until the
//             investigation concludes.
//           </p>
//         </div>

//         {/* Bottom: Footer */}
//          <footer className="w-full border-t border-gray-300 py-4">
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

// export default Page15;

import React from 'react';
import A4PageWrapper from './A4PageWrapper';

const Page15 = ({ settings, images }: any) => (
  <A4PageWrapper>
    <div className="a4-inner font-[Times_New_Roman] text-black text-base leading-relaxed">
      {/* Top: Logo */}
      <div className="flex justify-center pt-6 pb-2">
        <img
          src={images?.infinityLogo}
          alt="Infinity Supports WA logo"
          className="mb-4 w-[140px] h-[56px] object-contain"
        />
      </div>

      {/* Middle: Content */}
      <div className="flex-1 w-full max-w-3xl mx-auto px-6 flex flex-col">
        {/* First bullet list */}
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>
            An unexpected death, serious injury or alleged assault (including physical,
            sexual abuse, sexual assault or indecent assault) that occurs as a result of or
            during the delivery of services.
          </li>
          <li>
            Allegations of serious, unlawful or criminal activity or conduct involving an
            Infinity Supports WA employee, subcontractor or volunteer that has caused,
            or has the potential to cause, serious harm to you.
          </li>
          <li>
            An incident where you assault or cause serious harm to others (including our
            employees, volunteers or contractors), as a result of or during the delivery
            of services.
          </li>
          <li>
            A severe fire, natural disaster, accident or other incident that will—or is
            likely to—prevent service provision, result in closure or cause significant
            damage to premises or property, or pose a substantial threat to your health and safety.
          </li>
        </ul>

        <p className="mb-3">
          Infinity Supports WA has established procedures that identify, manage and
          resolve incidents, which include:
        </p>

        {/* Second bullet list */}
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Staff members must report all incidents to Infinity Supports WA.</li>
          <li>Completion of an incident report that identifies and documents the incident.</li>
          <li>
            Infinity Supports WA is responsible for reporting ‘reportable incidents’ to the NDIS Commission
            and other required agencies.
          </li>
          <li>
            Compliance with the National Disability Insurance Scheme (Incident Management
            and Reportable Incidents) Rules 2018.
          </li>
          <li>Supporting and assisting you if you are affected by the incident.</li>
          <li>Reviewing the incident internally if you or others were affected.</li>
          <li>
            Collaborating with you, your family and/or advocate to manage and resolve the incident.
          </li>
          <li>
            Making necessary amendments to systems and processes to reduce the risk of recurrence.
          </li>
        </ul>

        <p className="mb-4">
          Infinity Supports WA will implement appropriate preventive measures to
          mitigate further harm or injury as necessary. As part of the investigation
          process, the incident scene and any evidence must be preserved until the
          investigation concludes.
        </p>
      </div>

      {/* Bottom: Footer */}
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

export default Page15;
