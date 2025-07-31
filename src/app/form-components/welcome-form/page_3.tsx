

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
const Page3: React.FC<any> = ({settings} : any ) => {
  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full font-sans text-black text-sm">
        {/* Top: Logo */}
        <div className="w-full max-w-screen-sm mx-auto px-6 pt-10 flex justify-center">
          <img
            src="/infinity_logo.png"
            alt="Infinity Supports WA logo"
            className="mb-8 w-[200px] h-[80px] object-contain"
          />
        </div>

        {/* Middle: Vision & Mission */}
        <div className="flex-grow flex flex-col items-center justify-center px-6 max-w-screen-sm mx-auto">
          {/* Our Vision */}
          <img
            src="/welcomeimg/p3-1.png"
            alt="Our Vision logo"
            className="mb-14 w-[200px] h-[130px] object-contain"
          />
          <p className="font-semibold text-[14px] text-center leading-snug mb-20 max-w-[320px]">
            To work with people with disabilities to empower them to live their best lives
            by employing a person-centred approach
          </p>

          {/* Our Mission */}
          <img
            src="/welcomeimg/p3-2.png"
            alt="Mission graphic"
            className="mb-6 w-[280px] h-[100px] object-contain"
          />
          <p className="font-semibold text-[14px] text-center leading-snug max-w-[320px]">
            Our Mission is to assist individuals ‘achieve goals and beyond’
          </p>
        </div>

        {/* Bottom: Footer (same as Page2) */}
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

export default Page3;
