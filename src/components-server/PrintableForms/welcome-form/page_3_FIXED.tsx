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

// Page 3 - Vision & Mission (HAS logo header - Content centered)
const Page3 = ({ settings, images }: any) => {
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
      <span>Website: {settings?.company_website || ''}</span>
      <span>{settings?.welcome_form || ''}</span>
      <span>Review Date: {formatDate(settings?.review_date)}</span>
    </div>
  );

  return (
    <A4PageWrapper footer={footer}>
      <div className="flex flex-col justify-between min-h-full">
        {/* Top: Logo Header - Using STANDARD_LOGO size */}
        <div className="flex justify-center pt-8">
          <img
            src={images?.infinityLogo}
            alt="Infinity Supports WA logo"
            width={STANDARD_LOGO.width}
            height={STANDARD_LOGO.height}
            className={`${STANDARD_LOGO.className} mb-4`}
          />
        </div> <br /><br />

        {/* Middle: Vision & Mission - Centered content */}
        <div className="flex flex-col items-center justify-center text-center px-6">
          {/* Our Vision */}
          <img
            src={images?.p3_1}
            alt="Our Vision logo"
            className="mb-8"
            style={{ width: 160, height: 96 }}
          /> <br /><br /><br /><br /><br />
          <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} leading-snug mb-8 max-w-[320px]`}>
            To work with people with disabilities to empower them to live their best lives
            by employing a person-centred approach
          </p> <br /><br /><br /><br />
          
          {/* Our Mission */}
          <img
            src={images?.p3_2}
            alt="Mission graphic"
            className="mb-4"
            style={{ width: 180, height: 70 }}
          /> <br /><br /><br /><br /><br />
          <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} leading-snug max-w-[320px]`}>
            Our Mission is to assist individuals 'achieve goals and beyond'
          </p>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page3;
