

import React from 'react';
import A4PageWrapper from './A4PageWrapper';

const Page6: React.FC<any> = ({settings}: any ) => {
  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full font-[Times_New_Roman] text-black text-base leading-relaxed">
        {/* Top: Logo */}
        <div className="w-full max-w-3xl mx-auto px-6 pt-10 flex justify-center">
          <img
            src="/infinity_logo.png"
            alt="Infinity Supports WA logo"
            className="w-[200px] h-[80px] object-contain mb-8"
          />
        </div>

        {/* Middle: Main Content */}
        <div className="flex-grow w-full max-w-3xl mx-auto px-6">
          <p className="mb-2">* Medication management</p>
          <p className="mb-2">* Domestic support: such as cleaning, washing, cooking, and gardening</p>
          <p className="mb-6">* Meal Prep</p>

          <p className="font-bold mb-2">Mentoring &amp; Life Skills</p>
          <p className="mb-6">
            Our skilled support staff can provide mentoring, guidance and encouragement to promote independence
            through a person-centred approach. Learning from the mentor’s lived experience, we work with you to develop
            problem solving skills, participation in social activities and school transitions. Mentors can support with
            skills to gain employment from resume writing to interview techniques through to on-the-job support. Our
            mentors can provide social and emotional support for you to develop your communication and social skills.
            We aim to match individuals and mentors by listening to you, giving you choice and control, understanding
            age, gender, and common interests.
          </p>

          <p className="font-bold mb-2">Support Coordination</p>
          <p className="mb-6">
            The Support Coordination team at Infinity Supports WA are here to help you understand and make the most of
            your NDIS plan. With your choice and control at forefront, we can assist you to source providers who can
            help you achieve your goals.
          </p>
          <p className="mb-6">
            We ensure we get to know all our clients personally so we can understand your support needs and ensure you
            utilise your NDIS to its full potential. We take the stress out of calling providers by selecting a few
            companies who can provide the supports you are looking for and then guide you through your selection process.
          </p>
          <p className="mb-12">
            Our Support Coordinators will assist you in the preparation of your NDIS plan review by ensuring all
            stakeholders have prepared reports for the review. Together, we will develop the goals you would like to
            achieve in your next plan and identify supports you will require to help you achieve your goals.
          </p>
        </div>

        {/* Bottom: Footer (standardized with Page5) */}
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

export default Page6;
