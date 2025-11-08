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

const Page19 = ({ settings, images }: any) => {
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
          {/* Reportable Incidents Table */}
          <table className={`w-full border border-gray-300 ${A4_PDF_TYPOGRAPHY.body} mb-4 table-fixed`}>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-3 align-top leading-[1.5]">
                  Unlawful sexual or physical contact with, or assault of, a person with disability
                </td>
                <td className="border border-gray-300 p-3 font-bold text-center w-36 align-top">
                  24 hours
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-3 align-top leading-[1.5]">
                  Sexual misconduct committed against, or in the presence of, a person with disability,
                  including grooming of the person for sexual activity
                </td>
                <td className="border border-gray-300 p-3 font-bold text-center w-36 align-top">
                  24 hours
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3 align-top leading-[1.5]">
                  The use of a restrictive practice in relation to a person with disability if the use
                  is not in accordance with a required state or territory authorisation and/or not in
                  accordance with a behaviour support plan.
                </td>
                <td className="border border-gray-300 p-3 font-bold text-center w-36 align-top">
                  Five business days
                </td>
              </tr>
            </tbody>
          </table>
          <br /><br />
          {/* Feedback Section */}
          <p className={`text-center ${A4_PDF_TYPOGRAPHY.sectionHeader} mb-2`} style={{textAlign: 'center'}}>Complaints and Feedback</p> <br /><br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify mb-2`}>
            Your feedback allows us to provide you with high-quality services; we actively seek your
            input. Feedback can be provided using our feedback form which is available as an online
            form on our website. Alternatively, a physical copy can be provided on request to your
            support worker, manager or our management team. We would like your feedback on:
          </p> <br /><br />

          <ul className={`list-disc list-inside space-y-1 mb-3 ${A4_PDF_TYPOGRAPHY.body}`}>
            <li>● Quality of care received</li> <br />
            <li>● Consistency of services provided</li> <br />
            <li>● Support worker performance</li> <br />
            <li>● Supports that work for you</li> <br />
            <li>● Changes you want made to assist you</li> <br />
            <li>● What you like and dislike about our services</li> <br />
          </ul>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page19;
