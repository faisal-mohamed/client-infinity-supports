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

// Page 8 - How to Access Services (HAS logo header - Content starts from top)
const Page8 = ({ settings, images }: any) => {
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
        <div className="flex-1 w-full max-w-3xl mx-auto px-6 flex flex-col space-y-5">
          {/* Opening Paragraph */}
          <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify leading-relaxed`}>
            If you are using the National Disability Insurance Agency (NDIA) to manage your funds, our organisation will
            work with the NDIA.
          </p> <br /><br />

          {/* Access Services */}
          <div>
            <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-2`}>How to access our Services</p> <br /><br />
            <ul className={`${A4_PDF_TYPOGRAPHY.body} list-disc list-inside space-y-1`}>
              <li> ● Contact us by phone 0493 282661 or 0493 141 688</li> <br />
              <li>
                 ● Email:{' '}
                <a
                  href="mailto:admin@infinitysupportswa.org"
                  className="text-blue-700 underline"
                  style={{color: 'blue'}}
                >
                  admin@infinitysupportswa.org
                </a>
              </li> <br />
              <li> ● Or via our Referral Form on our website: infinitysupportswa.org</li> 
            </ul>
          </div> <br /><br />

          {/* What's Next */}
          <div>
            <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-2`}>What's next?</p> <br /><br />
            <ul className={`${A4_PDF_TYPOGRAPHY.body} list-disc list-inside space-y-2`}>
              <li>
                 ● Our Service Operations Manager will contact you to arrange a meeting to discuss your support
                requirements.
              </li> <br />
              <li>
                 ● We will complete a Client Intake Form with you and a Client Consent to ensure we have all your most
                current requirements and permission to communicate with other stakeholders involved in your care.
              </li> <br />
              <li>
                 ● You will provide us with a copy of your NDIS Plan and details of any Support Coordinator you have
                engaged.
              </li> <br />
              <li>
                 ● We will then complete a Service Agreement and onboarding documentation which will include: 
                <ul className={`${A4_PDF_TYPOGRAPHY.body} list-disc list-inside ml-5 mt-1 space-y-1`}>
                  <li> ● The services you have asked us to deliver</li> <br />
                  <li> ● The amount of funding you would like us to utilise</li>  <br />
                  <li> ● How your plan funds are managed and your preferred payment</li> <br />
                  <li> ● Your Rights and Responsibilities</li> <br />
                  <li> ● Our Responsibilities</li> <br />
                  <li> ● How to change or amend the Service Agreement</li> <br />
                  <li> ● How to give feedback or make a complaint</li> <br />
                  <li> ● Multimedia form</li>
                </ul>
              </li> 
            </ul>
          </div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page8;
