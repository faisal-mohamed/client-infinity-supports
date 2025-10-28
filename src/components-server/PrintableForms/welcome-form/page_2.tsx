

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
const Page2 = ({ settings, images }: any) => (
  <A4PageWrapper>
    <div className="a4-inner font-sans text-black text-sm">
      {/* Top: Logo */}
      <div className="w-full max-w-3xl mx-auto px-6 pt-8 flex justify-center">
        <img
          src={images?.infinityLogo}
          alt="Infinity Supports WA logo"
          className="mb-6 w-[160px] h-[64px] object-contain"
        />
      </div>
      {/* Middle: About Us Section fills vertical space */}
      <div className="flex-1 w-full max-w-3xl mx-auto px-6 flex items-start justify-center">
        <div className="w-full">
          <p className="text-center font-bold mb-4 text-base">About Us</p>
          <p className="text-justify text-sm leading-relaxed">
            Infinity Supports WA Pty Ltd was started by Sharon Mays and Anand Sekar in 2021. As individuals in the industry of supporting people with disabilities, we are both very passionate about supporting individuals to live their best lives and achieve their life goals. Everyone should be given the opportunity to the best quality individual support, and this was our drive to develop Infinity Supports WA. We had identified areas we wanted to improve on and listened to the individuals we had both worked with. From this information and the support of some amazing support workers it is our vision to ensure we deliver services to our clients in a person-centred manner.
          </p>
        </div>
      </div>
      {/* Bottom: Footer at page bottom */}
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

export default Page2;
