


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
const Page13 = ({ settings, images }: any) => (
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
        <p className="mb-3">
          Infinity Supports WA workers will support participants if they need to gain access to an interpreter if required.
        </p>
        <p className="mb-3">
          Following the information provided in this policy and procedure, Infinity Supports WA workers must use a Consent Form to verify and clarify the information stated in this policy and procedure. This consent form indicates whether participants have allowed Infinity Supports WA to hold, retain and use vital information of the participant. This information may include the following; however, is not limited to:
        </p>

        <ul className="list-disc list-inside mb-3 space-y-1">
          <li>Full Name</li>
          <li>Nationality</li>
          <li>Date of Birth</li>
          <li>Preferences</li>
          <li>Personal Goals</li>
          <li>Medical Information</li>
          <li>Referrals</li>
          <li>Case/Progress Notes</li>
        </ul>

        <p className="mb-3">
          If an individual is in a situation where they are unsure about disclosing another’s personal information, they should communicate and discuss with the Directors.
        </p>

        <p className="font-bold mb-2">Keeping your Information Safe</p>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>We will protect your information and only use it with your consent with the people that work with you. This will help them deliver quality supports.</li>
          <li>We will only share your information if we feel you are unsafe or if the law requires us to do so.</li>
          <li>The information is yours and you are free to see this at any time.</li>
        </ul>

        <p className="font-bold mb-2">Cancellation Charges and Exit Process</p>
        <p className="font-bold mb-2">Cancellation Charges:</p>
        <p className="mb-5">A cancellation is a short notice cancellation if:</p>
      </div>

      {/* Footer */}
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

export default Page13;
