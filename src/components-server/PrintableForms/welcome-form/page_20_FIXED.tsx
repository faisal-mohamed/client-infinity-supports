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

const Page20 = ({ settings, images }: any) => {
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
        <div className="flex-1 w-full max-w-3xl mx-auto px-6 space-y-3">
          <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify mb-3`}>
            You always have the right to expect the best possible standard of service from us, and we
            will treat any concern or complaint you provide as a serious issue. No matter what the
            situation, a Staff will not react badly to your complaint; you should feel safe knowing
            that they will not retaliate or hurt you in any way.
          </p>
          <br /><br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify mb-3`}>
            You can make an anonymous complaint using Complaint Report Form. Remember not to identify
            yourself during this process if you wish us not to know who is making the complaint.
          </p>
          <br /><br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify mb-3`}>
            You can make a complaint regarding our services, or a Staff provided to work with you. If
            you do not feel comfortable making a complaint, someone else can do this on your behalf,
            including:
          </p>
          <br /><br />
          <ul className={`list-disc list-inside mb-3 space-y-1 ${A4_PDF_TYPOGRAPHY.body}`}>
            <li>● an advocate</li> <br />
            <li>● a family member</li> <br />
            <li>● a close friend</li> <br />
            <li>● your care worker</li> <br />
            <li>● a person you know and trust.</li> 
          </ul>
          <br /><br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify mb-3`}>You can complain about your services and supports when:</p> <br /><br />

          <ul className={`list-disc list-inside space-y-1 mb-5 ${A4_PDF_TYPOGRAPHY.body}`}>
            <li>● something has gone wrong</li> <br />
            <li>● something is not working well</li> <br />
            <li>● something has not been done the right way</li> <br />
            <li>● something makes you unhappy</li> <br />
            <li>● you have been treated badly.</li> 
          </ul>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page20;
