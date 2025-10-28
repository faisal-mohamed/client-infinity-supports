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

// Page 10 - Participant Rights Continuation (HAS logo header - Content starts from top)
const Page10 = ({ settings, images }: any) => {
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

        {/* Rights Content - Top aligned */}
        <div className="flex-1 w-full max-w-3xl mx-auto px-6 flex flex-col">
          <ul className={`${A4_PDF_TYPOGRAPHY.body} list-disc list-inside space-y-1 mb-5`}>
            <li>Consideration always.</li> <br />
            <li>● Participants' specific requirements are adhered to and cared for.</li> <br />
            <li>● Participants are treated equally and can state their personal preferences regarding activities or participation.</li> <br />
            <li>● Infinity Supports WA always operates in an anti-discriminatory manner.</li> <br />
            <li>● Participant information always remains confidential and private while under the care of Infinity Supports WA.</li> <br />
            <li>● Participants can exercise personal self-resilience and freedom, including the right to partake in decision-making.</li> <br />
            <li>● Participants have the right to accept services involving their personal requirements and are supported throughout the process.</li> 
          </ul>
          <br /><br />
          <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mt-2 mb-2`}>Other rights participants are entitled to include:</p> <br /><br />

          <ul className={`${A4_PDF_TYPOGRAPHY.body} list-disc list-inside space-y-1 mb-5`}>
             <li>● The right to lodge a complaint.</li> <br />
            <li>● The right to access outside organisations, resources, and support throughout their time at Infinity Supports WA</li> <br />
            <li>● Privileges or commitments under the Disability Act 2006 and the facilities as well as any related expenses to be incurred</li> <br />
            <li>● Participants have the opportunity to dismiss care or assistance without any retribution or discrimination towards any potential future access to assistance or resources</li> <br />
            <li>● Participants will have choice and flexibility in many aspects of their service of care.</li> <br />
            <li>● Having the opportunity to choose a person to help and promote their experiences on behalf of Infinity Supports WA.</li> <br />
            <li>● Have the right to receive help, support and assistance provided by sufficiently skilled workers.</li> <br />
            <li>● Having the option to change providers where required and receive encouragement to ensure adequate, secure and exceptional quality of care is maintained</li>
          </ul>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page10;
