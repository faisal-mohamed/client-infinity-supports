// import React from 'react';
// import A4PageWrapper from './A4PageWrapper';

// const Page16: React.FC = () => {
//   return (
//     <A4PageWrapper>
//       <div className="flex flex-col h-full px-8 py-10 text-black font-['Times New Roman'] text-[12px] leading-[1.5]">
//         {/* Header */}
//         <header className="flex flex-col items-center mb-8">
//           <img
//             src="https://storage.googleapis.com/a1aa/image/4e1b5393-57fe-407f-a05c-ce2adb575757.jpg"
//             alt="Infinity Supports WA logo"
//             className="mb-2"
//             width={150}
//             height={60}
//           />
//           <p className="text-[10px] text-gray-500 font-semibold tracking-widest uppercase">
//             ACHIEVING GOALS AND BEYOND
//           </p>
//         </header>

//         {/* Content */}
//         <main className="flex-1">
//           <p className="mb-3">
//             individual, enhancing area safety, aiding police investigations, or handling the deceased, site disturbance may occur.)
//           </p>
//           <p className="mb-3">
//             The area will be inspected and verified to ensure that no new hazards have arisen while securing it.
//           </p>
//           <p className="mb-3">
//             If medical treatment beyond first aid is required, the Safety representative will promptly notify the relevant person via phone or email.
//           </p>
//           <p className="mb-3">
//             Any incidents, including near misses, must be reported to the manager or supervisor using Incident Report, and recorded in our Incident Register.
//           </p>
//           <p className="mb-6">
//             In the event of an incident, injury, or illness, Infinity Supports WA will take immediate and appropriate action to minimize the risk of further harm or damage, provided it is safe to do so.
//           </p>

//           <h2 className="font-bold text-[12px] mb-2">1. Report Notifiable Incident</h2>
//           <p className="mb-2">
//             The incident notification process consists of 3 steps. These steps are as follows:
//           </p>

//           <p className="font-semibold mb-2">Step 1: Notify the NDIS Commission:</p>
//           <ul className="list-none space-y-2 mb-2">
//             <li className="flex items-start">
//               <span className="text-black mr-2 mt-[6px]">✓</span>
//               <p>
//                 Safety representative is responsible for reporting incidents that are reportable incidents to the Commissioner. In addition, any key personnel can notify Commissioner of reportable incidents.
//               </p>
//             </li>
//             <li className="flex items-start">
//               <span className="text-black mr-2 mt-[6px]">✓</span>
//               <p>
//                 A notifiable incident shall be reported as soon as possible. The following information is required to be registered in the incident report form:
//               </p>
//             </li>
//           </ul>

//           <ul className="list-disc list-inside ml-6 space-y-1">
//             <li>the name and contact details of the registered NDIS provider.</li>
//             <li>a description of the reportable incident (a description of the impact on, or harm caused to, the person with disability)</li>
//             <li>
//               the immediate actions taken in response to the reportable incident, including actions taken to ensure the health, safety and wellbeing of persons with disability affected by the incident and whether the incident has been reported to police or any other body
//             </li>
//             <li>the name and contact details of the person making the notification</li>
//           </ul>
//         </main>

//         {/* Footer */}
//         <footer className="mt-12 flex justify-between text-[8px] text-gray-500">
//           <span>Website: infinitysupportswa.org</span>
//           <span>CF016</span>
//           <span>Review Date: 14/03/2026</span>
//         </footer>
//       </div>
//     </A4PageWrapper>
//   );
// };

// export default Page16;


import React from 'react';
import A4PageWrapper from './A4PageWrapper';

const Page16: React.FC = ({settings}: any ) => {
  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full font-[Times_New_Roman] text-black text-base leading-relaxed">
        {/* Top: Header with Logo and Tagline */}
        <div className="w-full max-w-3xl mx-auto px-6 pt-10 flex flex-col items-center mb-6">
          <img
            src="/infinity_logo.png"
            alt="Infinity Supports WA logo"
            className="w-[150px] h-[60px] object-contain mb-2"
          />
          <p className="text-xs text-gray-500 font-semibold tracking-widest uppercase">
            ACHIEVING GOALS AND BEYOND
          </p>
        </div>

        {/* Middle: Content */}
        <div className="flex-grow w-full max-w-3xl mx-auto px-6">
          <p className="mb-3">
            Individual, enhancing area safety, aiding police investigations, or handling the deceased—site disturbance may occur.
          </p>
          <p className="mb-3">
            The area will be inspected and verified to ensure that no new hazards have arisen while securing it.
          </p>
          <p className="mb-3">
            If medical treatment beyond first aid is required, the Safety Representative will promptly notify the relevant person via phone or email.
          </p>
          <p className="mb-3">
            Any incidents, including near misses, must be reported to the manager or supervisor using the Incident Report and recorded in our Incident Register.
          </p>
          <p className="mb-6">
            In the event of an incident, injury, or illness, Infinity Supports WA will take immediate and appropriate action to minimize the risk of further harm or damage—provided it is safe to do so.
          </p>

          <p className="font-bold mb-2">1. Report Notifiable Incident</p>
          <p className="mb-2">
            The incident notification process consists of 3 steps. These steps are as follows:
          </p>

          <p className="font-semibold mb-2">Step 1: Notify the NDIS Commission:</p>
          <ul className="list-none space-y-2 mb-2">
            <li className="flex items-start">
              <span className="text-black mr-2 mt-[6px]">✓</span>
              <p>
                The Safety Representative is responsible for reporting incidents that are reportable to the Commissioner. Additionally, any key personnel may notify the Commissioner of reportable incidents.
              </p>
            </li>
            <li className="flex items-start">
              <span className="text-black mr-2 mt-[6px]">✓</span>
              <p>
                A notifiable incident shall be reported as soon as possible. The following details must be included in the incident report:
              </p>
            </li>
          </ul>

          <ul className="list-disc list-inside ml-6 space-y-1">
            <li>The name and contact details of the registered NDIS provider</li>
            <li>A description of the reportable incident and its impact on the participant</li>
            <li>
              Immediate actions taken in response to the incident, including how health and safety of participants were protected, and if reported to police or other bodies
            </li>
            <li>The name and contact details of the person making the notification</li>
          </ul>
        </div>

        {/* Bottom: Footer */}
         <footer className="w-full border-t border-gray-300 py-4">
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

export default Page16;
