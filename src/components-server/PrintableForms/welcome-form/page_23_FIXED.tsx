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

const Page23 = ({ settings, images }: any) => {
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
          <h1 className={`${A4_PDF_TYPOGRAPHY.title} leading-tight`}>
            Elimination Of Restrictive Practices
          </h1> <br /><br /><br />
          
          <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify`}>
            Infinity Supports WA is dedicated to actively working towards reducing and ultimately
            eliminating the use of restrictive practices.
          </p> <br /><br /><br />
          
          <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify`}>
            Infinity Supports WA pledges to ensure that restrictive practices are employed only
            under extremely limited and specific circumstances, as a final resort, utilizing the
            least intrusive methods and for the shortest duration necessary. Such practices should
            be proportionate and justified, serving to safeguard the rights and safety of the
            individual or others.
          </p> <br /><br /><br />
          
          <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify`}>
            Infinity Supports WA is committed to providing suitable support and monitoring in an
            environment tailored to the unique needs of participants exhibiting cognitive or
            intellectual disabilities or behaviours that pose, or have the potential to pose, harm.
          </p> <br /><br /><br />
          
          <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify`}>
            Infinity Supports WA is dedicated to upholding the rights, safety, and well-being of
            individuals within our Organisation. We firmly believe in recognizing the purpose behind
            every behaviour and responding appropriately to resolve issues, including those
            exhibited by individuals posing potential harm and those diagnosed with mental illnesses.
          </p> <br /><br /><br />
          
          <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify`}>
            Infinity Supports WA will adhere to the regulations outlined in the National Disability
            Insurance Scheme (Restrictive Practices and Behaviour Support) Rules 2018, and the
            Disability (NDIS Transition) Amendment Act 2019.
          </p> <br /><br /><br />
          
          <p className={`${A4_PDF_TYPOGRAPHY.body} text-justify`}>
            Infinity Supports WA is committed to ensuring that our services consistently meet
            established standards, with a primary focus on safeguarding and advancing the human
            rights of all participants.
          </p> <br /><br /><br />
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page23;
