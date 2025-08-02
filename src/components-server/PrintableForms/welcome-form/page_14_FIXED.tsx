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

// Page 14 - Cancellation Conditions & Incident Reporting (HAS logo header - Content starts from top)
const Page14 = ({ settings, images }: any) => {
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
          {/* Cancellation Conditions */}
          <ul className={`${A4_PDF_TYPOGRAPHY.body} list-disc list-inside mb-3 space-y-1`}>
            <li>
              ● You do not show up for a scheduled support within a reasonable time, or are not present at the agreed place and time when the provider is travelling to deliver the support.
            </li> <br />
            <li>
              ● You have given less than seven (7) clear business days' notice for cancellation of support in line with the current NDIS price guide.
            </li> <br />
            <li>● The support is less than 8 hours continuous duration; AND</li> <br />
            <li>● The agreed total price for the support is less than $1000; OR</li> <br />
            <li>● Less than seven (7) business days' notice is given for any other support.</li> <br />
          </ul>
          <br /><br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} mb-4 text-justify leading-relaxed`}>
            In these circumstances, full support fees will be charged.
          </p>
          <br />
          {/* Exit Policy */}
          <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-2`}>Exiting Services</p> <br /><br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} mb-2 text-justify leading-relaxed`}>
            If either party chooses to end this Service Agreement before the cease date, they must give 2 weeks' notice in writing.
          </p> <br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} mb-5 text-justify leading-relaxed`}>
            If either party seriously breaches this Service Agreement, the requirement of notice will be waived.
          </p> <br /><br />

          {/* Incident Reporting */}
          <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} text-center mb-2`} style={{textAlign: 'center'}}>Incident Reporting</p> <br /><br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} mb-2 text-justify leading-relaxed`}>
            While we hope that incident reporting is not necessary, in the event it occurs, we are prepared to support and assist you by following procedures that appropriately handle a critical incident.
          </p> <br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} mb-2 text-justify leading-relaxed`}>
            An incident is classified as an event (or alleged event) that occurs during the delivery of services and causes—or is likely to cause—a significant negative impact on your health, safety, or wellbeing.
          </p> <br /><br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} mb-2 text-justify leading-relaxed`}>
            If an incident does occur, we will engage the required authorities to support you during this time.
          </p> <br /><br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} mb-4`}>
            Incidents that relate to you may include, but are not necessarily limited to:
          </p> <br /><br />
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page14;
