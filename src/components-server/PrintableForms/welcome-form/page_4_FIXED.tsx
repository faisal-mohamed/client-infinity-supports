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

// Page 4 - Our Values (HAS logo header - Content centered)
const Page4 = ({ settings, images }: any) => {
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

        {/* Middle: Values Section - Centered content */}
        <div className="flex-1 flex flex-col items-center px-6 max-w-3xl mx-auto">
          <img
            src={images?.p4_1}
            alt="Our Values logo"
            className="mb-6"
            style={{ width: 140, height: 96 }}
          />
          <br /><br /><br /><br /><br />

          <h1 className={`${A4_PDF_TYPOGRAPHY.title} mb-8 text-center`}>
            Our Values
          </h1> <br /><br /><br />

          <section className={`${A4_PDF_TYPOGRAPHY.body} leading-relaxed max-w-2xl space-y-4 text-justify`}>
            <p>
              <strong>Individuals</strong> – Giving every individual a voice, choice & control and the
              opportunity to live a fulfilled life.
            </p> <br /><br />
            <p>
              <strong>Passion</strong> – We are passionate to listen and empower people with disabilities to
              achieve their goals.
            </p> <br /><br />
            <p>
              <strong>Integrity</strong> – We protect privacy of those we work with whilst being always honest
              and transparent.
            </p> <br /><br />
            <p>
              <strong>Respect</strong> – We embrace diversity. We believe in inclusiveness and equality.
            </p> 
          </section>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page4;
