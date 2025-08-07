

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
const Page10: React.FC<any> = ({settings}: any ) => {
  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full font-[Times_New_Roman] text-black text-sm leading-relaxed">
        {/* Top: Logo */}
         <div className="flex justify-center pt-6 pb-4">
          <img
            src="/infinity_logo.png"
            alt="Infinity Supports WA logo"
            className="h-[60px] w-[150px] object-contain"
          />
        </div>

        {/* Middle: Rights Content */}
        <div className="flex-grow w-full max-w-3xl mx-auto px-6">
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li>Consideration always.</li>
            <li>Participants' specific requirements are adhered to and cared for.</li>
            <li>Participants are treated equally and can state their personal preferences regarding activities or participation.</li>
            <li>Infinity Supports WA always operates in an anti-discriminatory manner.</li>
            <li>Participant information always remains confidential and private while under the care of Infinity Supports WA.</li>
            <li>Participants can exercise personal self-resilience and freedom, including the right to partake in decision-making.</li>
            <li>Participants have the right to accept services involving their personal requirements and are supported throughout the process.</li>
          </ul>

          <p className="font-bold mt-6 mb-2">Other rights participants are entitled to include:</p>

          <ul className="list-disc list-inside space-y-2 mb-6">
            <li>The right to lodge a complaint.</li>
            <li>The right to access outside organisations, resources, and support throughout their time at Infinity Supports WA</li>
            <li>Privileges or commitments under the Disability Act 2006 and the facilities as well as any related expenses to be incurred</li>
            <li>Participants have the opportunity to dismiss care or assistance without any retribution or discrimination towards any potential future access to assistance or resources</li>
            <li>Participants will have choice and flexibility in many aspects of their service of care.</li>
            <li>Having the opportunity to choose a person to help and promote their experiences on behalf of Infinity Supports WA.</li>
            <li>Have the right to receive help, support and assistance provided by sufficiently skilled workers.</li>
            <li>Having the option to change providers where required and receive encouragement to ensure adequate, secure and exceptional quality of care is maintained</li>
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

export default Page10;
