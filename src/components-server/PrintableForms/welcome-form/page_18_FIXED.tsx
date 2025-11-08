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

const Page18 = ({ settings, images }: any) => {
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
        <div className="flex-1 w-full max-w-3xl mx-auto px-6 space-y-4">
          <ul className="space-y-2 mb-4">
            <li className="flex items-start">
              <span className="mr-2 mt-[2px] text-xs">✓</span>
              <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify`}>
                Where an incident is referred to NDIS, the NDIS investigation takes precedence over any organisational process.
              </p>
            </li> <br />
            <li className="flex items-start">
              <span className="mr-2 mt-[2px] text-xs">✓</span>
              <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify`}>
                The progress of the incidents, accidents and near misses will be tracked in the incident report form.
              </p>
            </li> 
          </ul> <br /><br />
     
          <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify mb-3`}>
            <span className={A4_PDF_TYPOGRAPHY.sectionHeader}>Step 2:</span> Submit a 5-business day form: this form should be submitted via the "My Reportable Incidents" portal within 5 business days after key management personnel are notified. Some additional information, including the corrective actions, is recorded in this form. Any unauthorised use of restrictive practices is recorded by this form.
          </p> <br /><br />

          <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify mb-5`}>
            <span className={A4_PDF_TYPOGRAPHY.sectionHeader}>Step 3:</span> If required, the final report should be submitted: If this is required, the NDIS Commission will contact the provider and advise the due date for this matter. The final report field will be accessible on the NDIS Commission portal if the provider is required to submit a final report.
          </p> <br /><br />

          <table className={`w-full border border-gray-300 ${A4_PDF_TYPOGRAPHY.body} mb-4`}>
            <thead className="bg-gray-200 font-semibold">
              <tr>
                <th className="border border-gray-300 px-3 py-2 text-left">Reportable incident</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Required timeframe</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-3 py-2">Death of a person with disability</td>
                <td className="border border-gray-300 px-3 py-2 font-bold">24 hours</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">Serious injury of a person with disability</td>
                <td className="border border-gray-300 px-3 py-2 font-bold">24 hours</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">Abuse or neglect of a person with disability</td>
                <td className="border border-gray-300 px-3 py-2 font-bold">24 hours</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page18;
