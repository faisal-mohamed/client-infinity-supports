import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { parseISO, isValid, format } from "date-fns";

interface Page2Props {
  schema: any;
  formData: Record<string, any>;
  commonFieldsData: any;
  settings: any;
}

const Page2: React.FC<Page2Props> = ({ schema, formData, settings }) => {
  const isChecked = (key: string) => formData?.[key] === 'Yes';

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
    <A4PageWrapper>
      <div className="flex flex-col h-full px-8 pt-6 pb-4 font-sans text-black leading-7" style={{ fontSize: '12px' }}>
        {/* Logo and Tagline */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/infinity_logo.png"
            alt="Infinity Supports WA Logo"
            className="w-[200px] h-[70px] object-contain"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 leading-relaxed" style={{ fontSize: '12px' }}>
          <p className="font-bold mb-2">
            Transport Payments (not applicable client has own vehicle)
          </p>

          <p className="mb-2">
            <input type="checkbox" className="mr-2 accent-blue-600" checked={isChecked('transportOption1')} readOnly />
            Transport Services provided to the value of <strong>{formData?.transportValue1 || '__________________'}</strong>. Infinity Supports WA will claim payment for those supports from the NDIA using the Transport funding Budget. Anything over this amount will be: <strong>{formData?.transportOver1 || '__________________'}</strong>.
          </p>

          <p className="mb-2">
            <input type="checkbox" className="mr-2 accent-blue-600" checked={isChecked('transportOption2')} readOnly />
            For Transport Services provided to the value of <strong>{formData?.transportValue2 || '____________'}</strong>. Infinity Supports WA will claim payment for those supports from the NDIA using the Core support funding Budget. Anything over this amount will be: <strong>{formData?.transportOver2 || '__________________'}</strong>.
          </p>

          <p className="mb-2">
            <input type="checkbox" className="mr-2 accent-blue-600" checked={isChecked('transportOption3')} readOnly />
            For any transport services provided. Infinity Supports WA will send the Individual/Plan Manager an invoice for those supports for the Individual/Plan Manager to pay. The Individual/Plan Manager will pay the invoice within 14 days.
          </p>

          <p className="font-bold mt-4 mb-1">NDIS Establishment Fee</p>
          <p className="mb-2">
            This fee applies to all New NDIS Participants in their first plan where they receive at least 20 hours of personal care/ community access support per month. This payment is to cover non-ongoing costs for providers establishing arrangements and assisting participants in implementing their plan.
          </p>

          <p className="mb-2">
            <input type="checkbox" className="mr-2 accent-blue-600" checked={isChecked('establishmentFeeAgreement')} readOnly />
            If you are a new participant to NDIS or Infinity Supports WA, you will be charged $702.30 as per the NDIS Price Guide.
          </p>

          <p className="font-bold mt-4 mb-1">Non-Face-to-Face Support Provision</p>
          <p className="mb-2">
            Providers can only claim from a participant’s plan for the Non-Face-to-Face delivery of a support item for example writing reports for co-workers and other providers about your progress, engaging in Multi-Disciplinary Meetings or meetings requested by yourself regarding your supports or engaging in additional tasks as requested by yourself outside of your normal rostered supports.
          </p>

          <p className="mb-2">
            Non-Face-to-Face support cannot be charged for doing general administration i.e., Service Agreements, rostering, Claiming payments, Initial Onboarding meetings.
          </p>

          <p className="mb-2">
            By signing the Schedule of Supports you agree to Infinity Supports claiming the above Non-Face-to-Face charges in line with the NDIS Guidelines.
          </p>

          <p className="mb-6">
            X I agree to Infinity Supports Non-Face-to-Face charges as above.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 text-xs flex justify-between">
          <span>Website: {settings?.company_website || settings?.from_email || ''}</span>
          <span>{settings?.schedule_of_supports}</span>
<span>Review Date: {formatDate(settings?.review_date)}</span>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page2;
