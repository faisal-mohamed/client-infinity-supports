

import React from 'react';
import A4PageWrapper from './A4PageWrapper';

const Page8: React.FC = ({settings}: any ) => {
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

        {/* Middle: Main Content */}
        <div className="flex-grow w-full max-w-3xl mx-auto px-6 space-y-6">
          {/* Opening Paragraph */}
          <p>
            If you are using the National Disability Insurance Agency (NDIA) to manage your funds, our organisation will
            work with the NDIA.
          </p>

          {/* Access Services */}
          <div>
            <p className="font-bold mb-2">How to access our Services</p>
            <ul className="list-disc list-inside space-y-1">
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
            <ul className="list-disc list-inside space-y-2">
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

        {/* Bottom: Footer (consistent with other pages) */}
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

export default Page8;
