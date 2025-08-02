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

// Page 13 - Information Safety & Cancellation Charges (HAS logo header - Content starts from top)
const Page13 = ({ settings, images }: any) => {
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
            Infinity Supports WA workers will support participants if they need to gain access to an interpreter if required.
          </p> <br /><br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} mb-3 text-justify leading-relaxed`}>
            Following the information provided in this policy and procedure, Infinity Supports WA workers must use a Consent Form to verify and clarify the information stated in this policy and procedure. This consent form indicates whether participants have allowed Infinity Supports WA to hold, retain and use vital information of the participant. This information may include the following; however, is not limited to:
          </p> <br /><br />

          <ul className={`${A4_PDF_TYPOGRAPHY.body} list-disc list-inside mb-3 space-y-1`}>
            <li>● Full Name</li>
            <li>● Nationality</li>
            <li>● Date of Birth</li>
            <li>● Preferences</li>
            <li>● Personal Goals</li>
            <li>● Medical Information</li>
            <li>● Referrals</li>
            <li>● Case/Progress Notes</li>
          </ul>
          <br /><br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} mb-3 text-justify leading-relaxed`}>
            If an individual is in a situation where they are unsure about disclosing another's personal information, they should communicate and discuss with the Directors.
          </p>
          <br /><br />
          <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-2`}>Keeping your Information Safe</p> <br />
          <ul className={`${A4_PDF_TYPOGRAPHY.body} list-disc list-inside mb-4 space-y-1`}>
            <li>● We will protect your information and only use it with your consent with the people that work with you. This will help them deliver quality supports.</li> <br />
            <li>● We will only share your information if we feel you are unsafe or if the law requires us to do so.</li> <br />
            <li>● The information is yours and you are free to see this at any time.</li> <br />
          </ul>
          <br /><br />
          <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-2`}>Cancellation Charges and Exit Process</p> <br />
          <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-2`}>Cancellation Charges:</p> <br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} mb-5`}>A cancellation is a short notice cancellation if:</p> <br />
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page13;
