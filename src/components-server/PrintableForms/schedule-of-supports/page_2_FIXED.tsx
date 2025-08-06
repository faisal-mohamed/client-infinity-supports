import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { parseISO, isValid, format } from "date-fns";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from './page_FIXED';

interface Page2Props {
  schema: any;
  formData: Record<string, any>;
  commonFieldsData: any;
  settings: any;
  images: any;
}

// --- Standardized Header Component ---
const StandardHeader = ({ images, title }: { images?: any, title?: string }) => (
  <div className="flex flex-col items-center pt-6 pb-4">
    <img
      src={images?.infinityLogo || "/infinity_logo.png"}
      alt="Logo"
      width={STANDARD_LOGO.width}
      height={STANDARD_LOGO.height}
      className={STANDARD_LOGO.className}
    />
    <br /><br />
    {title && (
      <h2 className={`${A4_PDF_TYPOGRAPHY.title} text-center mt-2`}>
        {title}
      </h2>
    )}
  </div>
);

// --- Standardized Footer Component ---
const Footer = ({ settings }: { settings: any }) => {
  const formatDate = (value: string) => {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const parsed = parseISO(value);
      if (isValid(parsed)) {
        return format(parsed, "dd-MM-yyyy");
      }
    }
    return value;
  };

  return (
    <div className={`pt-2 ${A4_PDF_TYPOGRAPHY.footer} flex justify-between text-gray-600`}>
      <span>Website: {settings?.company_website}</span>
      <span>{settings?.schedule_of_supports}</span>
      <span>Review Date: {formatDate(settings?.review_date)}</span>
    </div>
  );
};

const Page2: React.FC<Page2Props> = ({ schema, formData, settings, images }) => {
  const isChecked = (key: string) => formData?.[key] === 'Yes';

  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full w-full px-6 pt-[1mm] pb-[1mm] font-montserrat text-black leading-6 justify-between" style={{ height: '100%' }}>
        
        {/* Top Section */}
        <div className="flex flex-col">
          <StandardHeader images={images} />

          {/* Optional Top Table Grid (empty structure) */}
          <div className="border border-black w-full mb-4 grid grid-cols-6">
            <div className="col-span-3 border-r border-black h-8" />
            <div className="border-r border-black h-8" />
            <div className="border-r border-black h-8" />
            <div className="h-8" />
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 ${A4_PDF_TYPOGRAPHY.body} leading-loose space-y-6`}>
          <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-4 leading-relaxed`}>
            Transport Payments (not applicable client has own vehicle)
          </p>

          <p className={`mb-4 ${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
            <input type="checkbox" className="mr-2" checked={isChecked('transportOption1')} readOnly />
            Transport Services provided to the value of <strong>{formData?.transportValue1 || '__________________'}</strong>. Infinity Supports WA will claim payment for those supports from the NDIA using the Transport funding Budget. Anything over this amount will be: <strong>{formData?.transportOver1 || '__________________'}</strong>.
          </p>

          <p className={`mb-4 ${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
            <input type="checkbox" className="mr-2" checked={isChecked('transportOption2')} readOnly />
            For Transport Services provided to the value of <strong>{formData?.transportValue2 || '____________'}</strong>. Infinity Supports WA will claim payment for those supports from the NDIA using the Core support funding Budget. Anything over this amount will be: <strong>{formData?.transportOver2 || '__________________'}</strong>.
          </p>

          <p className={`mb-6 ${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
            <input type="checkbox" className="mr-2" checked={isChecked('transportOption3')} readOnly />
            For any transport services provided. Infinity Supports WA will send the Individual/Plan Manager an invoice for those supports for the Individual/Plan Manager to pay. The Individual/Plan Manager will pay the invoice within 14 days.
          </p>

          <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mt-8 mb-3 leading-relaxed`}>NDIS Establishment Fee</p>
          <p className={`mb-4 ${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
            This fee applies to all New NDIS Participants in their first plan where they receive at least 20 hours of personal care/ community access support per month. This payment is to cover non-ongoing costs for providers establishing arrangements and assisting participants in implementing their plan.
          </p>

          <p className={`mb-6 ${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
            <input type="checkbox" className="mr-2" checked={isChecked('establishmentFeeAgreement')} readOnly />
            If you are a new participant to NDIS or Infinity Supports WA, you will be charged $702.30 as per the NDIS Price Guide.
          </p>

          <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mt-8 mb-3 leading-relaxed`}>Non-Face-to-Face Support Provision</p>
          <p className={`mb-4 ${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
            Providers can only claim from a participant's plan for the Non-Face-to-Face delivery of a support item for example writing reports for co-workers and other providers about your progress, engaging in Multi-Disciplinary Meetings or meetings requested by yourself regarding your supports or engaging in additional tasks as requested by yourself outside of your normal rostered supports.
          </p>

          <p className={`mb-4 ${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
            Non-Face-to-Face support cannot be charged for doing general administration i.e., Service Agreements, rostering, Claiming payments, Initial Onboarding meetings.
          </p>

          <p className={`mb-4 ${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
            By signing the Schedule of Supports you agree to Infinity Supports claiming the above Non-Face-to-Face charges in line with the NDIS Guidelines.
          </p>

          <p className={`mb-0 ${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
            X I agree to Infinity Supports Non-Face-to-Face charges as above.
          </p>
        </div>

        <Footer settings={settings} />
      </div>
    </A4PageWrapper>
  );
};

export default Page2;
