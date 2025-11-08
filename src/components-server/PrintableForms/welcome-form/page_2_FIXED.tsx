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

// Page 2 - About Us (HAS logo header - Content starts from top)
const Page2 = ({ settings, images }: any) => {
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
        </div>

        {/* Middle: About Us Section fills vertical space */}
        <div className="flex-1 w-full max-w-3xl mx-auto px-6 flex items-start justify-center">
          <div className="w-full">
            <p className={`${A4_PDF_TYPOGRAPHY.title} text-center mb-4`}>
              About Us
            </p>
            <p className={`${A4_PDF_TYPOGRAPHY.body} leading-relaxed text-justify`}>
              Infinity Supports WA Pty Ltd was started by Sharon Mays and Anand Sekar in 2021. As individuals in the industry of supporting people with disabilities, we are both very passionate about supporting individuals to live their best lives and achieve their life goals. Everyone should be given the opportunity to the best quality individual support, and this was our drive to develop Infinity Supports WA. We had identified areas we wanted to improve on and listened to the individuals we had both worked with. From this information and the support of some amazing support workers it is our vision to ensure we deliver services to our clients in a person-centred manner.
            </p>
          </div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page2;
