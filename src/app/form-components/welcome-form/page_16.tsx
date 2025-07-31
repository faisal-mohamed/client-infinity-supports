


import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { parseISO, isValid, format } from 'date-fns';
 const formatDate = (value: string): string => {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const parsed = parseISO(value);
    if (isValid(parsed)) {
      return format(parsed, 'dd-MM-yyyy');
    }
  }
  return value;
};
const Page16: React.FC<any> = ({settings}: any ) => {
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
<div>Review Date: {formatDate(settings?.review_date)}</div>
          </div>
        </footer>
      </div>
    </A4PageWrapper>
  );
};

export default Page16;
