

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
const Page3 = ({ settings, images }: any) => (
  <A4PageWrapper>
    <div className="a4-inner font-sans text-black text-sm flex flex-col justify-between min-h-full">
      {/* Top: Logo */}
      <div className="flex justify-center pt-8">
        <img
          src={images?.infinityLogo}
          alt="Infinity Supports WA logo"
          className="mb-4 w-[140px] h-[56px] object-contain"
        />
      </div>

      {/* Middle: Vision & Mission */}
      <div className="flex flex-col items-center justify-center text-center px-6">
        {/* Our Vision */}
        <img
          src={images?.p3_1}
          alt="Our Vision logo"
          className="mb-8 w-[160px] h-[96px] object-contain"
        />
        <p className="font-semibold text-[14px] leading-snug mb-8 max-w-[320px]">
          To work with people with disabilities to empower them to live their best lives
          by employing a person-centred approach
        </p>
        {/* Our Mission */}
        <img
          src={images?.p3_2}
          alt="Mission graphic"
          className="mb-4 w-[180px] h-[70px] object-contain"
        />
        <p className="font-semibold text-[14px] leading-snug max-w-[320px]">
          Our Mission is to assist individuals ‘achieve goals and beyond’
        </p>
      </div>

      {/* Footer at bottom */}
      <footer className="w-full border-t border-gray-300 py-3">
        <div className="max-w-3xl mx-auto px-6 flex justify-between text-xs text-gray-500">
          <span>Website: {settings?.company_website}</span>
          <span>{settings?.welcome_form}</span>
<div>Review Date: {formatDate(settings?.review_date)}</div>
        </div>
      </footer>
    </div>
  </A4PageWrapper>
);

export default Page3;
