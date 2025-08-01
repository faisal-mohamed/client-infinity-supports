


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
const Page6 = ({ settings, images }: any) => (
  <A4PageWrapper>
    <div className="a4-inner font-[Times_New_Roman] text-black text-base leading-relaxed">
      {/* Top: Logo */}
      <div className="w-full max-w-3xl mx-auto px-6 pt-8 flex justify-center">
        <img
          src={images?.infinityLogo}
          alt="Infinity Supports WA logo"
          className="mb-6 w-[140px] h-[56px] object-contain"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-3xl mx-auto px-6 flex flex-col">
        <ul className="mb-5 pl-4 list-disc">
          <li className="mb-2">Medication management</li>
          <li className="mb-2">Domestic support: cleaning, washing, cooking, and gardening</li>
          <li className="mb-2">Meal Prep</li>
        </ul>

        <p className="font-bold mb-2">Mentoring &amp; Life Skills</p>
        <p className="mb-4">
          Our skilled support staff can provide mentoring, guidance and encouragement to promote independence
          through a person-centred approach. Learning from the mentor’s lived experience, we work with you to develop
          problem solving skills, participate in social activities and school transitions. Mentors can help develop
          employment skills, from resume writing to interview techniques through to on-the-job support. Our
          mentors can provide social and emotional support for you to strengthen your communication and social skills.
          We aim to match individuals and mentors by listening to you, giving you choice and control, and considering
          age, gender, and common interests.
        </p>

        <p className="font-bold mb-2">Support Coordination</p>
        <p className="mb-4">
          The Support Coordination team at Infinity Supports WA are here to help you understand and make the most of
          your NDIS plan. With your choice and control at forefront, we can assist you to source providers who can
          help you achieve your goals.
        </p>
        <p className="mb-4">
          We ensure we get to know all our clients personally so we can understand your support needs and ensure you
          utilise your NDIS to its full potential. We take the stress out of calling providers by selecting a few
          companies who can provide the supports you are looking for and then guide you through your selection process.
        </p>
        <p className="mb-8">
          Our Support Coordinators will assist you in preparing for your NDIS plan review by ensuring all
          stakeholders have prepared reports. Together, we will develop the goals you would like to
          achieve in your next plan and identify the supports you require to help you achieve those goals.
        </p>
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

export default Page6;
