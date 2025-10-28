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

const agencyPills = [
  { label: 'Commission for Children and Young People', bg: '#fb923c', text: 'white' },
  { label: 'NDIS Commissions, Complaints, Integrity and Privacy Unit', bg: '#ea580c', text: 'white' },
  { label: 'Ombudsman', bg: '#fdba74', text: 'white' },
  { label: 'The National Disability Insurance Agency (NDIA)', bg: '#fed7aa', text: '#1f2937' },
  { label: 'Office of the Commissioner for Privacy and Data Protection', bg: '#fde68a', text: '#1f2937' },
  { label: 'Independent Broad-based Anti-Corruption Commission (IBAC)', bg: '#9ca3af', text: 'white' },
  { label: 'Disability Services Commission', bg: '#6b7280', text: 'white' },
];

const Page22 = ({ settings, images }: any) => {
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
          <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify mb-4`}>
            If you are not happy with the solution proposed by Infinity Supports WA regarding your
            complaint, you can speak to other organisations, such as:
          </p> <br /><br />

          {/* Commonwealth Ombudsman */}
          <div className="mb-4">
            <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-1`}>Commonwealth Ombudsman – Disability Services</p>  <br /><br />
            <p className={A4_PDF_TYPOGRAPHY.body}>
              <span className="inline-block w-[90px] font-medium">Telephone:</span> 1300 362 072
            </p> <br /> <br />
            <p className={A4_PDF_TYPOGRAPHY.body}>
              <span className="inline-block w-[90px] font-medium">Email:</span> ombudsman@ombudsman.gov.au
            </p> <br /><br />
            <p className={A4_PDF_TYPOGRAPHY.body}>
              <span className="inline-block w-[90px] font-medium">Website:</span>
              <a
                className="text-blue-700 underline"
                href="https://www.ombudsman.gov.au"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.ombudsman.gov.au
              </a>
            </p>
          </div> <br /><br />

          {/* NDIS Complaints */}
          <div className="mb-4">
            <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-1`}>NDIS Complaints</p> <br /><br />
            <p className={A4_PDF_TYPOGRAPHY.body}> 
              <span className="inline-block w-[90px] font-medium">Telephone:</span> 1800 800 110
            </p> <br /> <br />
            <p className={A4_PDF_TYPOGRAPHY.body}>
              <span className="inline-block w-[90px] font-medium">Email:</span> feedback@ndis.gov.au
            </p> <br /> <br />
            <p className={A4_PDF_TYPOGRAPHY.body}>
              <span className="inline-block w-[90px] font-medium">Website:</span>
              <a
                className="text-blue-700 underline"
                href="https://www.ndis.gov.au/contact/feedback-and-complaints"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.ndis.gov.au/contact/feedback-and-complaints
              </a>
            </p>
          </div> <br /><br />

          <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify mb-3`}>
            Individuals can make a complaint directly to the following agencies at any time they wish to:
          </p>

          <br /><br /><br />

          {/* Agency Pills - Preserving the visual design */}
          <div className="space-y-1 max-w-[400px]">
            {agencyPills.map((pill, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div style={{ width: 20, height: 20, borderRadius: '9999px', border: `2px solid ${pill.bg}` }} />
                <div
                  style={{ 
                    background: pill.bg, 
                    color: pill.text, 
                    borderRadius: 4, 
                    fontSize: 10, 
                    fontWeight: 600, 
                    padding: '2px 8px', 
                    width: '100%' 
                  }}
                >
                  {pill.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page22;
