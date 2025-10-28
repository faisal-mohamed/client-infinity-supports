import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { format, parseISO, isValid } from "date-fns";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from './page_FIXED';

interface Page1Props {
  schema: any;
  data: Record<string, any>;
  commonFieldsData: Record<string, any>;
  settings: Record<string, any>;
  images?: Record<string, string>;
}

// --- Standardized Header Component ---
const StandardHeader = ({ images, title }: { images?: any, title?: string }) => (
  <div className="flex flex-col items-center gap-2">
    <img
      src={images?.infinityLogo || "/infinity_logo.png"}
      alt="Logo"
      width={STANDARD_LOGO.width}
      height={STANDARD_LOGO.height}
      className={STANDARD_LOGO.className}
    /> <br /><br />
    {title && (
      <h2 className={`${A4_PDF_TYPOGRAPHY.title} text-center uppercase`}>
        {title}
      </h2>
    )} <br />
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
    <div className={`flex justify-between ${A4_PDF_TYPOGRAPHY.footer} px-1 text-gray-600`}>
      <span>{settings?.company_website || 'https://www.infinitysupportswa.org'}</span>
      <span>Date of Review: {formatDate(settings?.review_date) || 'N/A'}</span>
    </div>
  );
};

const Page1: React.FC<Page1Props> = ({
  schema,
  data,
  commonFieldsData,
  settings,
  images,
}) => {
  const commonFieldMapping: Record<string, string> = {
    personName: 'name',
    address: 'street',
    dob: 'dob',
    disability: 'disability',
    phoneNumber: 'phone',
    ndisNumber: 'ndis',
    state: 'state',
    street: 'street',
    postcode: 'postCode',
    email: 'email',
    homePhone: 'phone',
    sex: 'sex',
  };

  const getValue = (key: string) => {
    const rawValue = commonFieldMapping?.[key]
      ? commonFieldsData?.[commonFieldMapping?.[key]]
      : data?.[key];

    // If value is in YYYY-MM-DD format, convert to DD-MM-YYYY
    if (typeof rawValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
      const parsed = parseISO(rawValue);
      if (isValid(parsed)) {
        return format(parsed, "dd-MM-yyyy");
      }
    }

    return rawValue ?? '';
  };

  const footer = (
    <div className={`flex justify-between ${A4_PDF_TYPOGRAPHY.footer} px-2 text-gray-600`}>
      <span>{settings?.company_website || 'https://www.infinitysupportswa.org'}</span>
      <span>Date of Review: {settings?.review_date && /^\d{4}-\d{2}-\d{2}$/.test(settings.review_date) ? format(parseISO(settings.review_date), 'dd-MM-yyyy') : 'N/A'}</span>
    </div>
  );

  return (
    <A4PageWrapper footer={footer}>
      <div className="flex flex-col h-full font-montserrat">
        
        <StandardHeader 
          images={images} 
          title="Individual Activity Risk Assessment" 
        />

        {/* Content Area */}
        <div className="px-6 pt-6 pb-4 flex flex-col gap-6">
          
          {/* Header Info Fields */}
          <div className="flex justify-between">
            <div className="w-1/2 space-y-3">
              {schema?.headerInfo?.slice?.(0, 3)?.map?.((field: any) => (
                <div key={field?.key} className={A4_PDF_TYPOGRAPHY.body}>
                  <span className="underline font-medium">{field?.label}:</span>{' '}
                  <span>{getValue(field?.key)}</span>
                </div>
              ))}
            </div>
            <div className="w-1/2 text-right space-y-3">
              {schema?.headerInfo?.slice?.(3)?.map?.((field: any) => (
                <div key={field?.key} className={A4_PDF_TYPOGRAPHY.body}>
                  <span className="underline font-medium">{field?.label}:</span>{' '}
                  <span>{getValue(field?.key)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Matrix Image */}
          <div className="overflow-x-auto">
            <img
              src={images?.riskMatrix || '/individual_risk_assessment.png'}
              alt="Risk Matrix Table"
              className="w-full border border-black"
            />
          </div>

          {/* Risk Legend */}
          <div className="space-y-4">
            <div>
              <div className={`${A4_PDF_TYPOGRAPHY.body} mb-2`}>
                <span className="underline font-medium">LOW</span>{' '}
                <span className="text-green-600 font-semibold">GREEN</span>
              </div>
              <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                Visit acceptable. Ensure control options are followed.
              </div>
            </div>
            
            <div>
              <div className={`${A4_PDF_TYPOGRAPHY.body} mb-2`}>
                <span className="underline font-medium">MEDIUM</span>{' '}
                <span style={{ color: '#ca8a04', fontWeight: 'bold' }}>YELLOW</span>
              </div>
              <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose text-justify`}>
                Visit should only proceed after consultation with manager. The risks should be
                reviewed to consider all the hazards involved. The risks must be reduced prior to the
                visit – if in doubt, re-classify as Moderate Risk.
              </div>
            </div>
          </div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page1;
