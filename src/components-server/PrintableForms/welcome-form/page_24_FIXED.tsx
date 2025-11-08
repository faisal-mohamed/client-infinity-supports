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

const Page24 = ({ settings, images }: any) => {
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
        {/* Logo Header */}
        <div className="flex justify-center pt-6 pb-4">
          <img
            src={images?.infinityLogo}
            alt="Infinity Supports WA logo"
            width={STANDARD_LOGO.width}
            height={STANDARD_LOGO.height}
            className={STANDARD_LOGO.className}
          />
        </div> <br /><br />

        {/* Content */}
        <div className="flex-1 w-full max-w-3xl mx-auto px-6 space-y-5">
          <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify`}>
            Infinity Supports WA provides participants with protection against inhumane or
            degrading treatment, while also prioritizing personal dignity, privacy, self-respect,
            and individual needs.
          </p>
          <br /><br /><br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify`}>
            Infinity Supports WA is committed to maintaining a safe working environment for all
            staff and workers.
          </p>
          <br /><br /><br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify`}>
            Infinity Supports WA is committed to regularly reviewing the use of restrictive
            practices, including incident reporting where applicable, assessing appropriateness and
            exploring alternatives, and providing aggregated reports.
          </p>
          <br /><br /><br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify`}>
            In instances of challenging behaviour, Infinity Supports WA will employ a positive
            behaviour support approach.
          </p>
        </div>
        <br /><br /><br />
      </div>
    </A4PageWrapper>
  );
};

export default Page24;
