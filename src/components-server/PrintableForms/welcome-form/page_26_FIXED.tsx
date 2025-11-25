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

const Page26 = ({ schema, data, settings, commonFieldsData, images }: any) => {
  const commonFieldMapping: Record<string, string> = {
    ndisNumber: 'ndis',
    dob: 'dob',
    address: 'street',
  };

  const getDisplayValue = (key: string): React.ReactNode => {
    // Signature field rendering
    if (key === 'signature') {
      const signatureBase64 = data?.[key];
      if (signatureBase64?.startsWith('data:image')) {
        return (
          <img
            src={signatureBase64}
            alt="Signature"
            className="h-[35px] max-w-[150px] mt-1 border border-gray-300 rounded object-contain"
          />
        );
      } else {
        return '__________________________';
      }
    }

    // Value resolution from common fields or data
    const value = commonFieldMapping[key]
      ? commonFieldsData?.[commonFieldMapping[key]]
      : data?.[key];

    // Format if value is a valid ISO date
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      const parsed = parseISO(value);
      if (isValid(parsed)) {
        return format(parsed, 'dd-MM-yyyy');
      }
    }

    // Default text fallback
    return value || '__________________________';
  };

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
          {/* Title */}
          <h2 className={`text-center ${A4_PDF_TYPOGRAPHY.title} mb-5`}>
            {schema?.title}
          </h2>
          <br /><br />
          {/* Static Content */}
          <div className={`${A4_PDF_TYPOGRAPHY.body} text-justify mb-2`}>
            {schema?.fields?.[0]?.content}
          </div><br /><br />
          <div className={`${A4_PDF_TYPOGRAPHY.body} text-justify mb-4`}>
            {schema?.fields?.[1]?.content}
          </div><br /><br />

          {/* Form Fields */}
          <div className="space-y-3">
            {schema?.fields?.slice(2).map((field: any) => (
              <div key={field?.key} className="mb-2">
                <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-1`}>{field?.label}:</p>
                <div className={A4_PDF_TYPOGRAPHY.body}>
                  {getDisplayValue(field?.key)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page26;
