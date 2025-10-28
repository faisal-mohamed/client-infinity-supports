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

// Page 15 - Incident Types and Procedures (HAS logo header - Content starts from top)
const Page15 = ({ settings, images }: any) => {
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
          {/* First bullet list - Incident types */}
          <ul className={`${A4_PDF_TYPOGRAPHY.body} list-disc list-inside mb-4 space-y-1`}>
            <li>
              ● An unexpected death, serious injury or alleged assault (including physical,
              sexual abuse, sexual assault or indecent assault) that occurs as a result of or
              during the delivery of services.
            </li> <br />
            <li>
              ● Allegations of serious, unlawful or criminal activity or conduct involving an
              Infinity Supports WA employee, subcontractor or volunteer that has caused,
              or has the potential to cause, serious harm to you.
            </li> <br />
            <li>
              ● An incident where you assault or cause serious harm to others (including our
              employees, volunteers or contractors), as a result of or during the delivery
              of services.
            </li> <br/>
            <li>
              ● A severe fire, natural disaster, accident or other incident that will—or is
              likely to—prevent service provision, result in closure or cause significant
              damage to premises or property, or pose a substantial threat to your health and safety.
            </li>
          </ul> <br /><br />

          <p className={`${A4_PDF_TYPOGRAPHY.body} mb-3 text-justify leading-relaxed`}>
            Infinity Supports WA has established procedures that identify, manage and
            resolve incidents, which include:
          </p> <br /><br />

          {/* Second bullet list - Procedures */}
          <ul className={`${A4_PDF_TYPOGRAPHY.body} list-disc list-inside mb-4 space-y-1`}>
            <li>● Staff members must report all incidents to Infinity Supports WA.</li> <br />
            <li>● Completion of an incident report that identifies and documents the incident.</li> <br />
            <li>
              ● Infinity Supports WA is responsible for reporting 'reportable incidents' to the NDIS Commission
              and other required agencies.
            </li> <br />
            <li>
              ● Compliance with the National Disability Insurance Scheme (Incident Management
              and Reportable Incidents) Rules 2018.
            </li> <br />
            <li>● Supporting and assisting you if you are affected by the incident.</li> <br />
            <li>● Reviewing the incident internally if you or others were affected.</li> <br />
            <li>
              ● Collaborating with you, your family and/or advocate to manage and resolve the incident.
            </li> <br />
            <li>
              ● Reviewing the incident and making necessary amendments to systems and processes to reduce the risk of recurrence.
            </li> 
          </ul>
                <br /><br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} mb-4 text-justify leading-relaxed`}>
            Infinity Supports WA will implement appropriate preventive measures to
            mitigate further harm or injury as necessary. As part of the investigation
            process, the incident scene and any evidence must be preserved until the
            investigation concludes.
          </p>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page15;
