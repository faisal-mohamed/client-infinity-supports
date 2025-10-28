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

// Page 1 - Welcome Pack Cover (NO LOGO HEADER - Content Centered)
const Page1 = ({ images, settings }: any) => {
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
      {/* Content: Centered (NO logo header) */}
      <div className="w-full max-w-3xl mx-auto px-6 pt-8 flex justify-center">
                <img
                  src={images?.infinityLogo}
                  alt="Infinity Supports WA logo"
                  width={STANDARD_LOGO.width}
                  height={STANDARD_LOGO.height}
                  className={`${STANDARD_LOGO.className} mb-6`}
                />
              </div>
      <div className="flex-1 flex flex-col items-center justify-center px-2">
        <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} text-center mb-2 mt-4 font-bold uppercase`}>
          WELCOME PACK
        </p>
        <p className={`${A4_PDF_TYPOGRAPHY.body} text-center mb-4`}>
          HELPING YOU ACHIEVE GOALS AND BEYOND
        </p>
        <img 
          src={images?.p1_1} 
          alt="Red infinity symbol" 
          className="mb-4" 
          style={{ width: 100, height: 36 }} 
        />
        <div className="flex justify-center space-x-2 mb-4">
          <img src={images?.p1_2} alt="NDIS logo" style={{ width: 28, height: 28 }} />
          <img src={images?.p1_3} alt="Rainbow pride flag" style={{ width: 28, height: 18 }} />
          <img src={images?.p1_4} alt="Aboriginal flag" style={{ width: 28, height: 18 }} />
          <img src={images?.p1_5} alt="Torres Strait Islander flag" style={{ width: 28, height: 18 }} />
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page1;
