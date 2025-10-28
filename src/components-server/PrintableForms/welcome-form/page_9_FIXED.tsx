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

// Page 9 - Rights and Responsibilities (HAS logo header - Content starts from top)
const Page9 = ({ settings, images }: any) => {
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
          <ul className={`${A4_PDF_TYPOGRAPHY.body} list-disc list-inside mb-3`}>
            <li>● Individual Risk Assessment</li> <br />
            <li>● Home Risk Assessment</li> <br />
          </ul> <br /><br />

          <p className={`${A4_PDF_TYPOGRAPHY.body} mb-3 text-justify leading-relaxed`}>
            We will then discuss with you how you would like your support plan and emergency plan to look. You will be
            given the opportunity to provide information which you would like us to share with your support workers and
            how best they can support you to achieve your goals.
          </p> <br /><br />

          <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-1`} style={{textAlign: 'center'}}>Your Rights and Responsibilities</p> <br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} mb-1`}>Client Charter Policy and Procedure (extract)</p> <br />
          <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-1`}>Full policy available on request and on our website</p> <br />
          <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-1`}>Rights of the Participants</p> <br />

          <p className={`${A4_PDF_TYPOGRAPHY.body} mb-2 text-justify leading-relaxed`}>
            Infinity Supports WA understands the importance of upholding the rights of the participants and intends to do
            so by implementing certain practices to adhere to these rights and responsibilities.
          </p> <br /><br />

          <p className={`${A4_PDF_TYPOGRAPHY.body} mb-2 text-justify leading-relaxed`}>
            The Charter of Human Rights and Responsibilities ACT 2006 and the Disability ACT 2006 set out the rights and
            responsibilities of participants. Infinity Supports WA utilises this piece of legislation as a guideline to
            ensure:
          </p> <br /><br />

          <ul className={`${A4_PDF_TYPOGRAPHY.body} list-disc list-inside mb-5 space-y-1`}>
            <li>● Participants can recognise their specific physical, mental, financial, economic, religious, and cognitive growth capabilities.</li> <br />
            <li>● All participants are valued individually and considered for their uniqueness.</li> <br />
            <li>● Participants are not exposed to any form of violence, misconduct, negligence, or isolation.</li> <br />
            <li>● Participants are informed of personal desires and inclinations.</li> <br />
            <li>● Participants are considerate of issues that impact their livelihood (e.g., choices made regarding wellbeing as well as implementation of our strategies, services, and facilities).</li> <br />
            <li>● Participants are addressed and treated respectfully, with compassion and dignity.</li> 
          </ul>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page9;
