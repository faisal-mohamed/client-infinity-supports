

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
const Page20: React.FC<any> = ({settings}:  any ) => {
  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full font-[Times_New_Roman] text-black text-base leading-relaxed">
        {/* Logo */}
        <div className="flex justify-center pt-6 pb-4">
          <img
            src="/infinity_logo.png"
            alt="Infinity Supports WA logo"
            className="h-[60px] w-[150px] object-contain"
          />
        </div>

        {/* Content */}
        <div className="flex-grow w-full max-w-3xl mx-auto px-6">
          <p className="mb-4">
            You always have the right to expect the best possible standard of service from us, and we
            will treat any concern or complaint you provide as a serious issue. No matter what the
            situation, a Staff will not react badly to your complaint; you should feel safe knowing
            that they will not retaliate or hurt you in any way.
          </p>
          <p className="mb-4">
            You can make an anonymous complaint using Complaint Report Form. Remember not to identify
            yourself during this process if you wish us not to know who is making the complaint.
          </p>
          <p className="mb-4">
            You can make a complaint regarding our services, or a Staff provided to work with you. If
            you do not feel comfortable making a complaint, someone else can do this on your behalf,
            including:
          </p>

          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>an advocate</li>
            <li>a family member</li>
            <li>a close friend</li>
            <li>your care worker</li>
            <li>a person you know and trust.</li>
          </ul>

          <p className="mb-4">You can complain about your services and supports when:</p>

          <ul className="list-disc list-inside space-y-1 mb-10">
            <li>something has gone wrong</li>
            <li>something is not working well</li>
            <li>something has not been done the right way</li>
            <li>something makes you unhappy</li>
            <li>you have been treated badly.</li>
          </ul>
        </div>

        {/* Footer */}
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

export default Page20;
