import React from 'react';
import { format, parseISO, isValid } from "date-fns";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from './page_FIXED';

// ===== A4 PAGE WRAPPER (Same as individual-risk-assessment) =====
const A4PageWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}> = ({ children, className = '', footer }) => {
  return (
    <div
      className={`
        a4-page
        w-[210mm] min-h-[297mm]
        mx-auto
        bg-white
        border border-gray-300
        shadow-lg
        flex flex-col
        p-[20mm]
        print:shadow-none
        print:border-none
        print:p-[15mm]
        print:break-after-page
        print:break-inside-avoid
        font-montserrat
        ${className}
      `}
      style={{
        boxSizing: 'border-box',
      }}
    >
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      {footer && (
        <div className="mt-auto pt-[10mm] border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

// Page 5 - Community Participation & Independent Living Skills (HAS logo header - Content starts from top)
const Page5 = ({ settings, images }: any) => {
  const formatDate = (value: string) => {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const parsed = parseISO(value);
      if (isValid(parsed)) {
        return format(parsed, "dd-MM-yyyy");
      }
    }
    return value || 'N/A';
  };

  const footer = (
    <div className={`flex justify-between ${A4_PDF_TYPOGRAPHY.footer} px-2 text-gray-600`}>
      <span>Website: {settings?.company_website || '''}</span>
      <span>{settings?.welcome_form || '''}</span>
      <span>Review Date: {formatDate(settings?.review_date)}</span>
    </div>
  );

  return (
    <A4PageWrapper footer={footer}>
      <div className="flex flex-col h-full">
        {/* Top: Logo Header - Using STANDARD_LOGO size */}
        <div className="w-full max-w-3xl mx-auto px-6 pt-8 flex justify-center">
          <img
            src={images?.infinityLogo}
            alt="Infinity Supports WA logo"
            width={STANDARD_LOGO.width}
            height={STANDARD_LOGO.height}
            className={`${STANDARD_LOGO.className} mb-6`}
          />
        </div> <br /><br />

        {/* Main Content - Top aligned */}
        <div className="flex-1 w-full max-w-3xl mx-auto px-6 flex flex-col">
          <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-2`}>Community Participation</p> <br /><br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} mb-3 text-justify leading-relaxed`}>
            Here at infinity supports WA, we understand how important it is to be a part of your local community. By utilizing your NDIS funding, our highly skilled support staff can assist you in gaining a higher level of independence and having the confidence to participate in local groups/activities of your choice. At Infinity Supports WA, we focus on a person-centred approach to enable you to participate in activities of your choices such as:
          </p> <br /><br />
          <ul className={`${A4_PDF_TYPOGRAPHY.body} mb-3 pl-4 list-disc space-y-1`}>
            <li>● Training and Education</li> <br />
            <li>● Recreation and Sports</li> <br />
            <li>● Arts and Crafts</li> <br />
            <li>● Social Support</li> <br />
            <li>● Personal Development Skills</li> <br />
          </ul>
          <br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} mb-3 text-justify leading-relaxed`}>
            Our individualised supports enable you to lead the way to achieve your goals. We make sure that we connect
            you with someone you feel comfortable with and share interests with as all our support workers come with
            different skills, personalities, and hobbies.
          </p> <br /><br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} mb-3 text-justify leading-relaxed`}>
            We understand that you may have concerns stepping out of your comfort zone, but we strive to create a safe
            environment to make your joining an enjoyable experience.
          </p>
          <br /><br />
          <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-2`}>Independent Living Skills</p> <br /><br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} mb-3 text-justify leading-relaxed`}>
            At Infinity Supports WA we strive to ensure every person with a disability can live their best life.
            We understand "one size doesn't fit all", so our person-centred approach means that supports are tailored
            exactly to your needs. We will work closely with you and your formal & informal networks to ensure we
            address the area of your life you require assistance. Together we will develop a support plan that is right
            for you. With our diverse team we will ensure you have complete choice and control of the people you work
            with, so you are comfortable with them in your home.
          </p> <br /><br />
          Some of the services our support team can offer are:  <br />
          <ul className={`${A4_PDF_TYPOGRAPHY.body} mb-3 pl-4 list-disc`}>
            <li>● Activities for daily living: such as showering, dressing, and other personal care activities</li>
          </ul>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page5;
