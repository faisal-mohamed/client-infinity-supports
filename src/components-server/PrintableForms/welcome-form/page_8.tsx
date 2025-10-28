

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
const Page8 = ({ settings, images }: any) => (
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

      {/* Main Content, flex-1 for vertical fill */}
      <div className="flex-1 w-full max-w-3xl mx-auto px-6 flex flex-col space-y-5">
        {/* Opening Paragraph */}
        <p>
          If you are using the National Disability Insurance Agency (NDIA) to manage your funds, our organisation will
          work with the NDIA.
        </p>

        {/* Access Services */}
        <div>
          <p className="font-bold mb-2">How to access our Services</p>
          <ul className="list-disc list-inside space-y-1 text-base">
            <li>Contact us by phone 0493 282661 or 0493 141 688</li>
            <li>
              Email:{' '}
              <a
                href="mailto:admin@infinitysupportswa.org"
                className="text-blue-700 underline"
              >
                admin@infinitysupportswa.org
              </a>
            </li>
            <li>Or via our Referral Form on our website: infinitysupportswa.org</li>
          </ul>
        </div>

        {/* What's Next */}
        <div>
          <p className="font-bold mb-2">What’s next?</p>
          <ul className="list-disc list-inside space-y-2 text-base">
            <li>
              Our Service Operations Manager will contact you to arrange a meeting to discuss your support
              requirements.
            </li>
            <li>
              We will complete a Client Intake Form with you and a Client Consent to ensure we have all your most
              current requirements and permission to communicate with other stakeholders involved in your care.
            </li>
            <li>
              You will provide us with a copy of your NDIS Plan and details of any Support Coordinator you have
              engaged.
            </li>
            <li>
              We will then complete a Service Agreement and onboarding documentation which will include:
              <ul className="list-disc list-inside ml-5 mt-1 space-y-1">
                <li>The services you have asked us to deliver</li>
                <li>The amount of funding you would like us to utilise</li>
                <li>How your plan funds are managed and your preferred payment</li>
                <li>Your Rights and Responsibilities</li>
                <li>Our Responsibilities</li>
                <li>How to change or amend the Service Agreement</li>
                <li>How to give feedback or make a complaint</li>
                <li>Multimedia form</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer always at bottom */}
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

export default Page8;
