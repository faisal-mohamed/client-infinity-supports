
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
const Page5: React.FC<any> = ({settings} : any ) => {
  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full font-[Times_New_Roman] text-black text-sm leading-relaxed">
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
          <p className="font-bold mb-2">Community Participation</p>
          <p className="mb-4">
            Here at Infinity Supports WA, we understand how important it is to be a part of your local community.
            By utilizing your NDIS funding, our highly skilled support staff can assist you in gaining a higher level
            of independence and having the confidence to participate in local groups/activities of your choice.
            At Infinity Supports WA, we focus on a person-centred approach to enable you to participate in activities
            of your choices such as:
          </p>
          <p className="mb-4">
            * Training and Education
            <br />
            * Recreation and Sports
            <br />
            * Arts and Crafts
            <br />
            * Social Support
            <br />
            * Personal Development Skills
          </p>
          <p className="mb-4">
            Our individualised supports enable you to lead the way to achieve your goals. We make sure that we connect
            you with someone you feel comfortable with and share interests with as all our support workers come with
            different skills, personalities, and hobbies.
          </p>
          <p className="mb-4">
            We understand that you may have concerns stepping out of your comfort zone, but we strive to create a safe
            environment to make your joining an enjoyable experience.
          </p>

          <p className="font-bold mb-2">Independent Living Skills</p>
          <p className="mb-4">
            At Infinity Supports WA we strive to ensure every person with a disability can live their best life.
            We understand "one size doesn’t fit all", so our person-centred approach means that supports are tailored
            exactly to your needs. We will work closely with you and your formal &amp; informal networks to ensure we
            address the area of your life you require assistance. Together we will develop a support plan that is right
            for you. With our diverse team we will ensure you have complete choice and control of the people you work
            with, so you are comfortable with them in your home.
          </p>
          <p className="mb-2">
            Some of the services our support team can offer are:
          </p>
          <p className="mb-4">
            * Activities for daily living: such as showering, dressing, and other personal care activities
            <br />
            * Medication management
            <br />
            * Domestic support: such as cleaning, washing, cooking, and gardening
            <br />
            * Meal Prep
          </p>
        </div>

        {/* Bottom: Footer (consistent with other pages) */}
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

export default Page5;
