// import React from 'react';
// import { format, parseISO, isValid } from "date-fns";
// import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from './page_FIXED';

// // ===== A4 PAGE WRAPPER (Same as individual-risk-assessment) =====
// const A4PageWrapper: React.FC<{
//   children: React.ReactNode;
//   className?: string;
//   footer?: React.ReactNode;
// }> = ({ children, className = '', footer }) => {
//   return (
//     <div
//       className={`
//         a4-page
//         w-[210mm] min-h-[297mm]
//         mx-auto
//         bg-white
//         border border-gray-300
//         shadow-lg
//         flex flex-col
//         p-[20mm]
//         print:shadow-none
//         print:border-none
//         print:p-[15mm]
//         print:break-after-page
//         print:break-inside-avoid
//         font-montserrat
//         ${className}
//       `}
//       style={{
//         boxSizing: 'border-box',
//       }}
//     >
//       <div className="flex-1 flex flex-col">
//         {children}
//       </div>
//       {footer && (
//         <div className="mt-auto pt-[10mm] border-t border-gray-200">
//           {footer}
//         </div>
//       )}
//     </div>
//   );
// };

// const Page17 = ({ settings, images }: any) => {
//   const formatDate = (value: string) => {
//     if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
//       const parsed = parseISO(value);
//       if (isValid(parsed)) {
//         return format(parsed, "dd-MM-yyyy");
//       }
//     }
//     return value || 'N/A';
//   };

//   const footer = (
//     <div className={`flex justify-between ${A4_PDF_TYPOGRAPHY.footer} px-2 text-gray-600`}>
//       <span>Website: {settings?.company_website || 'https://www.infinitysupportswa.org'}</span>
//       <span>{settings?.welcome_form || 'WF001'}</span>
//       <span>Review Date: {formatDate(settings?.review_date)}</span>
//     </div>
//   );

//   return (
//     <A4PageWrapper footer={footer}>
//       <div className="flex flex-col h-full">
//         {/* Logo Header */}
//         <div className="flex justify-center pt-6 pb-4">
//           <img
//             src={images?.infinityLogo}
//             alt="Infinity Supports WA logo"
//             width={STANDARD_LOGO.width}
//             height={STANDARD_LOGO.height}
//             className={STANDARD_LOGO.className}
//           />
//         </div> <br /><br />

//         {/* Content */}
//         <div className="flex-1 w-full max-w-3xl mx-auto px-6 space-y-4">
//           <ul className={`list-disc list-inside mb-2 ${A4_PDF_TYPOGRAPHY.body} space-y-1`}>
//             <li className="text-justify">● The time, date, and place at which the reportable incident occurred (if known)</li> <br />
//             <li className="text-justify">● The names and contact details of the persons involved in the reportable incident</li> <br />
//           </ul>
//           <br /><br />
//           <ul className="space-y-4">
//             <li className="relative pl-6">
//               <span className="absolute left-0 top-[2px] text-xs">✓</span>
//               <div className={`${A4_PDF_TYPOGRAPHY.body} text-justify`}>
//                 For an incident to be reportable, a certain act or event must have occurred (or be alleged to have occurred) in connection with the provision of supports or services by the registered NDIS provider. This includes: <br />
//                 <ul className="list-disc pl-5 mt-2 space-y-1">
//                   <li>● The death of a person with disability</li> <br />
//                   <li>● Serious injury of a person with disability</li> <br />
//                   <li>● Abuse or neglect of a person with disability</li> <br />
//                   <li>● Unlawful sexual or physical contact with, or assault of, a person with disability</li> <br />
//                   <li>●	Sexual misconduct, committed against, or in the presence of, a person with disability, including grooming of the person with disability for sexual activity</li>
//                 </ul>
//               </div>
//             </li>
//             <br /><br />
//             <li className="relative pl-6">
//               <span className="absolute left-0 top-[2px] text-xs">✓</span>
//               <div className={`${A4_PDF_TYPOGRAPHY.body} text-justify`}>
//                 Infinity Supports WA will submit a notification form via the NDIS Commission portal within 24 hours if any of the above incidents occur.
//               </div>
//             </li> <br /><br />

//             <li className="relative pl-6">
//               <span className="absolute left-0 top-[2px] text-xs">✓</span>
//               <div className={`${A4_PDF_TYPOGRAPHY.body} text-justify`}>
//                 The Commissioner must be provided the following information within 5 business days after the provider becomes aware of the incident: <br />
//                 <ul className="list-disc pl-5 mt-2 space-y-1">
//                   <li>● The names and contact details of any witnesses to the reportable incident</li> <br />
//                   <li>● Any further actions proposed in response to the incident</li>
//                 </ul>
//               </div>
//             </li>
//             <br /><br />
//             <li className="relative pl-6">
//               <span className="absolute left-0 top-[2px] text-xs">✓</span>
//               <div className={`${A4_PDF_TYPOGRAPHY.body} text-justify`}>
//                 If an unauthorised restrictive practice is used, the NDIS should be notified within 5 business days of the provider becoming aware of it. If the incident resulted in injury, it must be reported within 24 hours.
//               </div>
//             </li>
//             <br /><br />
//             <li className="relative pl-6">
//               <span className="absolute left-0 top-[2px] text-xs">✓</span>
//               <div className={`${A4_PDF_TYPOGRAPHY.body} text-justify`}>
//                 If police intervention is required, the incident must be reported as soon as possible. If unsure whether to report an incident, the notifier or approver should contact the NDIS Commission for advice.
//               </div>
//             </li> <br /><br />


//             <li className="relative pl-6">
//               <span className="absolute left-0 top-[2px] text-xs">✓</span>
//               <div className={`${A4_PDF_TYPOGRAPHY.body} text-justify`}>
//                 Infinity Supports WA will also inform: <br />
//                 <ul className="list-disc pl-5 mt-2 space-y-1">
//                   <li>● Authorities for notifiable work-related injuries, fatalities, or dangerous occurrences</li> <br />
//                   <li>● Police if the incident relates to the death of a person</li>
//                 </ul>
//               </div>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </A4PageWrapper>
//   );
// };

// export default Page17;



import React from 'react';
import { format, parseISO, isValid } from "date-fns";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from './page_FIXED';

const A4PageWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}> = ({ children, className = '', footer }) => {
  return (
    <div
      className={`
        a4-page
        w-[210mm] min-h-[297mm]
        mx-auto
        bg-white
        border border-gray-300
        shadow-lg
        flex flex-col
        p-[20mm]
        print:shadow-none
        print:border-none
        print:p-[15mm]
        print:break-after-page
        print:break-inside-avoid
        font-montserrat
        ${className}
      `}
      style={{ boxSizing: 'border-box' }}
    >
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      {footer && (
        <div className="mt-auto pt-[10mm] border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

const Page17 = ({ settings, images }: any) => {
  const formatDate = (value: string) => {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const parsed = parseISO(value);
      if (isValid(parsed)) {
        return format(parsed, "dd-MM-yyyy");
      }
    }
    return value || 'N/A';
  };

  const footer = (
    <div className={`flex justify-between ${A4_PDF_TYPOGRAPHY.footer} px-2 text-gray-600`}>
      <span>Website: {settings?.company_website || 'https://www.infinitysupportswa.org'}</span>
      <span>{settings?.welcome_form || 'WF001'}</span>
      <span>Review Date: {formatDate(settings?.review_date)}</span>
    </div>
  );

  return (
    <A4PageWrapper footer={footer}>
      <div className="flex flex-col h-full">
        {/* Logo Header */}
        <div className="flex justify-center pt-6 pb-4">
          <img
            src={images?.infinityLogo}
            alt="Infinity Supports WA logo"
            width={STANDARD_LOGO.width}
            height={STANDARD_LOGO.height}
            className={STANDARD_LOGO.className}
          />
        </div> <br /><br />

        {/* Content */}
        <div className="flex-1 w-full max-w-3xl mx-auto px-6 space-y-4">
          <ul className={`list-disc list-inside mb-4 ${A4_PDF_TYPOGRAPHY.body}`}>
            <li className="text-justify">● The time, date, and place at which the reportable incident occurred (if known)</li> <br />
            <li className="text-justify">● The names and contact details of the persons involved in the reportable incident</li>
          </ul>
          <br /><br />
          <ul className="space-y-5">
            {/* ✓ Item 1 */}
            <li className="flex items-start">
              <span className="mr-2 mt-[2px] text-xs">✓</span>
              <div className={`${A4_PDF_TYPOGRAPHY.body} text-justify`}>
                For an incident to be reportable, a certain act or event must have occurred (or be alleged to have occurred) in connection with the provision of supports or services by the registered NDIS provider. This includes:
                <br /> <br />
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>● The death of a person with disability</li>  <br />
                  <li>● Serious injury of a person with disability</li> <br />
                  <li>● Abuse or neglect of a person with disability</li> <br />
                  <li>● Unlawful sexual or physical contact with, or assault of, a person with disability</li> <br />
                  <li>● Sexual misconduct, committed against, or in the presence of, a person with disability, including grooming of the person with disability for sexual activity</li>
                </ul>
              </div>
            </li>

            <br /><br />

            {/* ✓ Item 2 */}
            <li className="flex items-start">
              <span className="mr-2 mt-[2px] text-xs">✓</span>
              <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify`}>
                Infinity Supports WA will submit a notification form via the NDIS Commission portal within 24 hours if any of the above incidents occur.
              </p>
            </li>

            <br /><br />

            {/* ✓ Item 3 */}
            <li className="flex items-start">
              <span className="mr-2 mt-[2px] text-xs">✓</span>
              <div className={`${A4_PDF_TYPOGRAPHY.body} text-justify`}>
                The Commissioner must be provided the following information within 5 business days after the provider becomes aware of the incident: <br />
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>● The names and contact details of any witnesses to the reportable incident</li> <br />
                  <li>● Any further actions proposed in response to the incident</li>
                </ul>
              </div>
            </li>
            <br /><br />
            {/* ✓ Item 4 */}
            <li className="flex items-start">
              <span className="mr-2 mt-[2px] text-xs">✓</span>
              <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify`}>
                If an unauthorised restrictive practice is used, the NDIS should be notified within 5 business days of the provider becoming aware of it. If the incident resulted in injury, it must be reported within 24 hours.
              </p>
            </li>

            <br /><br />

            {/* ✓ Item 5 */}
            <li className="flex items-start">
              <span className="mr-2 mt-[2px] text-xs">✓</span>
              <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify`}>
                If police intervention is required, the incident must be reported as soon as possible. If unsure whether to report an incident, the notifier or approver should contact the NDIS Commission for advice.
              </p>
            </li>

            <br /><br />

            {/* ✓ Item 6 */}
            <li className="flex items-start">
              <span className="mr-2 mt-[2px] text-xs">✓</span>
              <div className={`${A4_PDF_TYPOGRAPHY.body} text-justify`}>
                Infinity Supports WA will also inform: <br />
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>● Authorities for notifiable work-related injuries, fatalities, or dangerous occurrences</li> <br />
                  <li>● Police if the incident relates to the death of a person</li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page17;
