


import React from 'react';
import A4PageWrapper from './A4PageWrapper';

const Page9: React.FC = ({settings}: any ) => {
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
          <ul className="list-disc list-inside mb-4">
            <li>Individual Risk Assessment</li>
            <li>Home Risk Assessment</li>
          </ul>

          <p className="mb-6">
            We will then discuss with you how you would like your support plan and emergency plan to look. You will be
            given the opportunity to provide information which you would like us to share with your support workers and
            how best they can support you to achieve your goals.
          </p>

          <p className="font-bold mb-2">Your Rights and Responsibilities</p>
          <p className="mb-2">Client Charter Policy and Procedure (extract)</p>
          <p className="font-bold mb-2">Full policy available on request and on our website</p>
          <p className="font-bold mb-2">Rights of the Participants</p>

          <p className="mb-4">
            Infinity Supports WA understands the importance of upholding the rights of the participants and intends to do
            so by implementing certain practices to adhere to these rights and responsibilities.
          </p>

          <p className="mb-4">
            The Charter of Human Rights and Responsibilities ACT 2006 and the Disability ACT 2006 set out the rights and
            responsibilities of participants. Infinity Supports WA utilises this piece of legislation as a guideline to
            ensure:
          </p>

          <ul className="list-disc list-inside mb-6 space-y-1">
            <li>Participants can recognise their specific physical, mental, financial, economic, religious, and cognitive growth capabilities.</li>
            <li>All participants are valued individually and considered for their uniqueness.</li>
            <li>Participants are not exposed to any form of violence, misconduct, negligence, or isolation.</li>
            <li>Participants are informed of personal desires and inclinations.</li>
            <li>Participants are considerate of issues that impact their livelihood (e.g., choices made regarding wellbeing as well as implementation of our strategies, services, and facilities).</li>
            <li>Participants are addressed and treated respectfully, with compassion and dignity.</li>
          </ul>
        </div>

        {/* Bottom: Footer (standardized) */}
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

export default Page9;
