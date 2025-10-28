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

// Page 11 - Expectations and Responsibilities (HAS logo header - Content starts from top)
const Page11 = ({ settings, images }: any) => {
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
          {/* Expectations of Participants */}
          <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-2`}>Expectations of Participants</p> <br /><br />
          <p className={`${A4_PDF_TYPOGRAPHY.body} mb-2 text-justify leading-relaxed`}>
            In accordance with the legislation, Infinity Supports WA expects its participants to: <br />
          </p>
          <ul className={`${A4_PDF_TYPOGRAPHY.body} list-disc list-inside space-y-1 mb-4`}>
            <li>● Advise Infinity Supports WA if assistance or support is no longer needed.</li> <br />
            <li>● Notify workers of any developments with the participant's conditions and desires.</li> <br />
            <li>● Be courteous and respectful to workers as well as other participants.</li> <br />
            <li>● Regard others' freedoms like their privacy rights and confidentiality.</li> <br />
            <li>● Value the integrity and human morality of its workers and other participants.</li> <br />
            <li>● Notify workers of any developmental, welfare, or physical condition concerns that may affect assistance provided to you.</li> <br />
            <li>● Engage constructively in the creation, delivery, and analysis of support services targeting people.</li> <br />
            <li>● Take accountability for any selections and the consequences of any choices made.</li> <br />
            <li>● Make any payments and expenses related to the delivery of your service urgently or when requested.</li> 
          </ul>
          <br /><br />
          {/* Worker Responsibilities */}
          <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-2`}>Worker Responsibilities</p> <br /><br />
          <ul className={`${A4_PDF_TYPOGRAPHY.body} list-disc list-inside space-y-1 mb-4`}>
            <li>● To adhere to and enforce the concept of human rights.</li> <br />
            <li>● To support and aid all participants in times of need.</li> <br />
            <li>● To recognise and implement the necessary measures to ensure that all participants are receiving quality care.</li> <br />
            <li>● Ensure that the interests of the participants are considered and upheld.</li> <br />
            <li>● Ensure all rights and responsibilities are effectively enforced within the framework of Infinity Supports WA.</li> <br />
            <li>● Notify Management or the Director of any breaches or violations of human rights—whether of their own or the participant's.</li> 
          </ul>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page11;
