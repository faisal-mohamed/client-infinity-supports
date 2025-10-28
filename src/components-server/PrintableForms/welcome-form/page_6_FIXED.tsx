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

// Page 6 - Services Continuation (HAS logo header - Content starts from top)
const Page6 = ({ settings, images }: any) => {
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
      <span>Website: {settings?.company_website || 'https://www.infinitysupportswa.org'}</span>
      <span>{settings?.welcome_form || 'WF001'}</span>
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
          <ul className={`${A4_PDF_TYPOGRAPHY.body} mb-5 pl-4 list-disc space-y-2`}>
            <li>● Medication management</li> <br />
            <li>● Domestic support: cleaning, washing, cooking, and gardening</li> <br />
            <li>● Meal Prep</li> <br />
          </ul>
          <br /><br />

          <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-2`}>Mentoring & Life Skills</p> <br /><br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} mb-4 text-justify leading-relaxed`}> 
            Our skilled support staff can provide mentoring, guidance and encouragement to promote independence through a person-centred approach. Learning from the mentor’s lived experience, we work with you to develop problem solving skills, participation in social activities and school transitions. Mentors can support with skills to gain employment from resume writing to interview techniques through to on-the-job support. Our mentors can provide social and emotional support for you to develop your communication and social skills. We aim to match individuals and mentors by listening to you, giving you choice and control, understanding age, gender, and common interests.
          </p> <br /><br />

          <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-2`}>Support Coordination</p> <br /><br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} mb-4 text-justify leading-relaxed`}>
            The Support Coordination team at Infinity Supports WA are here to help you understand and make the most of
            your NDIS plan. With your choice and control at forefront, we can assist you to source providers who can
            help you achieve your goals.
          </p>  <br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} mb-4 text-justify leading-relaxed`}>
            We ensure we get to know all our clients personally so we can understand your support needs and ensure you
            utilise your NDIS to its full potential. We take the stress out of calling providers by selecting a few
            companies who can provide the supports you are looking for and then guide you through your selection process.
          </p> <br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} mb-8 text-justify leading-relaxed`}>
            Our Support Coordinators will assist you in the preparation of your NDIS plan review by ensuring all stakeholders have prepared reports for the review. Together, we will develop the goals you would like to achieve in your next plan and identify supports you will require to help you achieve your goals.
          </p>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page6;
