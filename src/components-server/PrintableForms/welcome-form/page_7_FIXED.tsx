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

// Page 7 - Budget Management & Fees (HAS logo header - Content starts from top)
const Page7 = ({ settings, images }: any) => {
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
        <div className="flex justify-center pt-6 pb-2">
          <img
            src={images?.infinityLogo}
            alt="Infinity Supports WA logo"
            width={STANDARD_LOGO.width}
            height={STANDARD_LOGO.height}
            className={`${STANDARD_LOGO.className} mb-4`}
          />
        </div> <br /><br />

        {/* Main Content - Top aligned */}
        <div className="flex-1 w-full max-w-3xl mx-auto px-6 flex flex-col">
          <p className={`${A4_PDF_TYPOGRAPHY.body} mb-3 text-justify leading-relaxed`}>
            We are also available to assist you should you encounter any problems with your service providers. This may
            be something small, but you don't feel comfortable approaching it or maybe questions you don't feel like
            you're getting answered. We are there to be the middleman so you can maintain your relationships while
            ensuring your voice is being heard.
          </p> <br /><br />

          <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-1`}>Management of Budgets, Statements and Fees</p> <br /><br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} mb-3 text-justify leading-relaxed`}>
            You receive a NDIS funding package to pay for your disability support and support management. Your package
            lets you decide the type of disability supports you need, who provides it and where it is provided. Thank
            you for choosing Infinity Supports WA as part of your support team. Our team will never offer you financial
            advice or information.
          </p> <br /><br />

          <p className={`${A4_PDF_TYPOGRAPHY.body} mb-3 text-justify leading-relaxed`}>
            Infinity Supports WA will regularly inform you of the cost of the services being provided. We are
            transparent with our fee structure. When starting your service with us, we will provide you with a statement
            that clearly outlines your fees. We then will provide you with a statement each month that outlines your
            fees.
          </p>
          <br /><br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} mb-3 text-justify leading-relaxed`}>
            Fees may be changed during your service delivery as per NDIS price guide, but you will be informed of this
            increase two weeks in advance.
          </p> <br /><br />

          <p className={`${A4_PDF_TYPOGRAPHY.body} mb-3 text-justify leading-relaxed`}>
            <span className="font-bold">Please note</span>: There are annual changes in the NDIS Price Guide; these will
            automatically adjust your fees.
          </p> <br /><br />

          <p className={`${A4_PDF_TYPOGRAPHY.body} mb-3`}>Before services are provided, we will inform you of:</p> <br /><br />

          <ul className={`${A4_PDF_TYPOGRAPHY.body} list-disc list-inside space-y-1 mb-6`}>
            <li>● chargeable fees</li> <br />
            <li>
               ● payment methods, i.e. direct debit, cheque, money order (please never pay a Staff directly)
            </li> <br />
            <li> ● your budget (or the amount of money you can spend)</li> <br />
            <li> ● methods for payment of fees.</li> <br />
          </ul>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page7;
