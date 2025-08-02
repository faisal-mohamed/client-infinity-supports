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

const Page16 = ({ settings, images }: any) => {
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
        {/* Header with Logo and Tagline */}
        <div className="w-full max-w-3xl mx-auto px-6 pt-8 flex flex-col items-center mb-4">
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
          <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify`}>
            Individual, enhancing area safety, aiding police investigations, or handling the deceased—site disturbance may occur.
          </p> <br /><br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify`}>
            The area will be inspected and verified to ensure that no new hazards have arisen while securing it.
          </p> <br /><br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify`}>
            If medical treatment beyond first aid is required, the Safety Representative will promptly notify the relevant person via phone or email.
          </p> <br /><br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify`}>
            Any incidents, including near misses, must be reported to the manager or supervisor using the Incident Report and recorded in our Incident Register.
          </p> <br /><br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify mb-4`}>
            In the event of an incident, injury, or illness, Infinity Supports WA will take immediate and appropriate action to minimize the risk of further harm or damage—provided it is safe to do so.
          </p> <br /><br />

          <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-2`}>1. Report Notifiable Incident</p> <br /><br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify mb-2`}>
            The incident notification process consists of 3 steps. These steps are as follows: 
          </p> <br /><br />

          <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-2`}>Step 1: Notify the NDIS Commission:</p> <br /><br />
          <ul className="list-none space-y-2 mb-3">
            <li className="flex items-start">
              <span className="text-black mr-2 mt-[2px] text-xs">✓</span>
              <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify`}>
                The Safety Representative is responsible for reporting incidents that are reportable to the Commissioner. Additionally, any key personnel may notify the Commissioner of reportable incidents.
              </p>
            </li> <br />
            <li className="flex items-start">
              <span className="text-black mr-2 mt-[2px] text-xs">✓</span>
              <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify`}>
                A notifiable incident shall be reported as soon as possible. The following details must be included in the incident report:
              </p>
            </li> <br />
          </ul>

          <ul className={`list-disc list-inside ml-6 space-y-1 ${A4_PDF_TYPOGRAPHY.body}`}>
            <li className="text-justify">● The name and contact details of the registered NDIS provider</li>
            <li className="text-justify">● A description of the reportable incident and its impact on the participant</li>
            <li className="text-justify">
              ● Immediate actions taken in response to the incident, including how health and safety of participants were protected, and if reported to police or other bodies
            </li>
            <li className="text-justify">● The name and contact details of the person making the notification</li>
          </ul>
        </div>
      </div>
    </A4PageWrapper>
  );
}

export default Page16;
