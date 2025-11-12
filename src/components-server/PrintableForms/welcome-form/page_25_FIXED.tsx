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

const Page25 = ({ settings, images }: any) => {
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
          <div>
            <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-2`}>Important Contacts</p> <br /><br />
            <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify`}>
              Infinity Supports WA is not an emergency service. We are unable to answer phone calls outside of our normal working hours (8.30 am to 4.30 pm Monday to Friday).
            </p>
          </div> <br /><br />

          <div>
            <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-1`}>NDIS</p> <br /><br />
            <p className={A4_PDF_TYPOGRAPHY.body}>
              Phone: 1800 800 110<br />
              Email: enquiries@ndis.gov.au
            </p> <br /><br />
          </div>

          <div>
            <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-1`}>Emergency</p><br /><br />
            <p className={A4_PDF_TYPOGRAPHY.body}>Dial 000</p>
          </div><br /><br />

          <div>
            <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-1`}>Crisis and Mental Health Support</p><br /><br />
            <p className={A4_PDF_TYPOGRAPHY.body}>
              Beyond Blue: 1300 224 636<br />
              Lifeline Australia: 13 11 14<br />
              Suicide Call Back Service: 1300 659 467<br />
              Mental Health Emergency Response Line: 1300 555 788 (Metro) / 1800 676 822 (Peel)<br />
              Kids Helpline: 1800 55 1800<br />
              Mensline Australia: 130 78 99 78<br />
              Sexual Assault, Family and Domestic Violence Line: 1800 424 017
            </p>
          </div><br /><br />

          <div>
            <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-1`}>Medical</p><br /><br />
            <p className={A4_PDF_TYPOGRAPHY.body}>
              Health Direct (24 hours health advice): 1800 022 222<br />
              Poisons Information Line: 131 126
            </p>
          </div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page25;
