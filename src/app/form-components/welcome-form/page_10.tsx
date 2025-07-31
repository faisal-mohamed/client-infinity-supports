

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
      <div className="flex flex-col h-full font-[Times_New_Roman] text-black text-base leading-relaxed">
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
            <li>The right to access outside organisations, resources, and support during their time with Infinity Supports WA.</li>
            <li>Privileges or commitments under the Disability Act 2006 and related facilities or expenses.</li>
            <li>The right to dismiss care or assistance without retribution or discrimination against future services.</li>
            <li>The right to choice and flexibility in many aspects of their care services.</li>
            <li>The opportunity to choose a person to represent and promote their experiences.</li>
            <li>The right to receive support from sufficiently skilled workers.</li>
            <li>The option to change providers when needed, and to be encouraged and supported in maintaining high-quality care.</li>
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
