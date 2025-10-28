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

// Data categories for the privacy table
const tableRows = [
  {
    color: '#e07a5f',
    text: 'Incident reports | Emergency contact details | Consent forms',
    maxWidth: 320
  },
  {
    color: '#d87f5a',
    text: 'Health status | Contact information | Medical Documents',
    maxWidth: 280
  },
  {
    color: '#c97f7a',
    text: 'Immunisation records | Organisation information',
    maxWidth: 260
  },
  {
    color: '#a97a7a',
    text: 'Development of records, plans, portfolios and observations',
    maxWidth: 360
  },
  {
    color: '#9a9a9a',
    text: 'Intake of delivery services, assessment and data review',
    maxWidth: 360
  }
];

// Page 12 - Privacy Policy (HAS logo header - Content starts from top)
const Page12 = ({ settings, images }: any) => {
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
          <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-1`}>Your Privacy</p> <br /> <br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} mb-2`}>Privacy and Confidentiality Policy (extract)</p> <br /> <br />
          <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-1`}>Full policy available on request and on our website</p> <br /> <br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} mb-4 text-justify leading-relaxed`}>
            Infinity Supports WA will only require confidential information to determine potential participants' suitability for a service and to monitor the services provided.
            <br /> <br />
            A participant is entitled to supply, access, update and use any personal information if necessary to ensure correct information is in the system. They may refuse to disclose some information and have the right to revoke their consent to disclose personal information.
            <br /> <br />
            Personal participant information that Infinity Supports WA collects involves, but is not limited to:
          </p>

          {/* Data Categories Table */}
          <table className="w-full border-collapse mb-5">
            <tbody>
              {tableRows.map((row, idx) => (
                <tr key={idx}>
                  <td className="border border-black p-0">
                    <div
                      className={`text-white font-semibold px-3 py-1 rounded-r-md w-full ${A4_PDF_TYPOGRAPHY.small}`}
                      style={{
                        backgroundColor: row.color,
                        maxWidth: `${row.maxWidth}px`
                      }}
                    >
                      {row.text}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
              <br /><br />
          {/* Closing paragraph */}
          <p className={`${A4_PDF_TYPOGRAPHY.body} mb-4 text-justify leading-relaxed`}>
            Before collecting personal information from participants or their advocates, Infinity Supports WA workers must clarify why the information is being collected, how it will be stored and used, and why Infinity Supports WA requires it. Infinity Supports WA only gathers the necessary personal information of participants for the protected and adequate provision of services. All private and confidential information must be stored securely.
          </p>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page12;
