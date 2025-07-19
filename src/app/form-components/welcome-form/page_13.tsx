


import React from 'react';
import A4PageWrapper from './A4PageWrapper';

const Page13: React.FC = ({settings}: any ) => {
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

        {/* Middle: Content */}
        <div className="flex-grow w-full max-w-3xl mx-auto px-6">
          <p className="mb-4">
            Infinity Supports WA workers will support participants if they need to gain access to an interpreter if required.
          </p>
          <p className="mb-4">
            Following the information provided in this policy and procedure, Infinity Supports WA workers must use a Consent Form to verify and clarify the information stated in this policy and procedure. This consent form indicates whether participants have allowed Infinity Supports WA to hold, retain and use vital information of the participant. This information may include the following; however, is not limited to:
          </p>

          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Full Name</li>
            <li>Nationality</li>
            <li>Date of Birth</li>
            <li>Preferences</li>
            <li>Personal Goals</li>
            <li>Medical Information</li>
            <li>Referrals</li>
            <li>Case/Progress Notes</li>
          </ul>

          <p className="mb-4">
            If an individual is in a situation where they are unsure about disclosing another’s personal information, they should communicate and discuss with the Directors.
          </p>

          <p className="font-bold mb-2">Keeping your Information Safe</p>
          <ul className="list-disc list-inside mb-6 space-y-1">
            <li>We will protect your information and only use it with your consent with the people that work with you. This will help them deliver quality supports.</li>
            <li>We will only share your information if we feel you are unsafe or if the law requires us to do so.</li>
            <li>The information is yours and you are free to see this at any time.</li>
          </ul>

          <p className="font-bold mb-2">Cancellation Charges and Exit Process</p>
          <p className="font-bold mb-2">Cancellation Charges:</p>
          <p className="mb-6">A cancellation is a short notice cancellation if:</p>
        </div>

        {/* Bottom: Footer */}
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

export default Page13;
