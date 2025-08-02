import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { format, parseISO, isValid } from "date-fns";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from './page_FIXED';

interface Page3Props {
  schema: any;
  data: Record<string, any>;
  commonFieldsData: Record<string, any>;
  settings: Record<string, any>;
  images?: Record<string, string>;
}

// --- Standardized Header Component ---
const StandardHeader = ({ images }: { images?: any }) => (
  <div className="flex justify-center">
    <img
      src={images?.infinityLogo || "/infinity_logo.png"}
      alt="Logo"
      width={STANDARD_LOGO.width}
      height={STANDARD_LOGO.height}
      className={STANDARD_LOGO.className}
    />
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

const Page3: React.FC<Page3Props> = ({
  schema,
  data,
  commonFieldsData,
  settings,
  images = {},
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

  const renderSignature = (signatureData: string, altText: string) => {
    if (!signatureData) return '';
    
    if (signatureData.startsWith('data:image')) {
      return (
        <img 
          src={signatureData} 
          alt={altText} 
          className="max-w-[100px] max-h-[45px] object-contain" 
        />
      );
    }
    
    return <div className={A4_PDF_TYPOGRAPHY.body}>{signatureData}</div>;
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
        
        <StandardHeader images={images} /> <br /><br />

        {/* Content Area */}
        <div className="px-6 pt-6 pb-4 flex flex-col items-center flex-grow">
          <div className="max-w-3xl w-full">
            
            {/* Empty 3-column grid placeholder */}
            <div className="w-full border border-black grid grid-cols-[1fr_1fr_4fr] mb-8">
              <div className="border-r border-black h-10"></div>
              <div className="border-r border-black h-10"></div>
              <div className="h-10"></div>
            </div>

            {/* Form Content */}
            <form className="w-full">
              <div className="mb-10">
                <label className={`${A4_PDF_TYPOGRAPHY.label} block mb-2`}>Additional Support Requirements:</label>
                <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose whitespace-pre-wrap border-b border-gray-300 min-h-[120px] pb-2`}>
                  {getValue('additionalSupport')}
                </div>
              </div>

              <br /><br /><br /><br />

              {/* Assessment Review Date */}
              <div className="mb-6">
                <label className={`${A4_PDF_TYPOGRAPHY.label} block mb-1`}>Assessment Review Date:</label>
                <div className={`${A4_PDF_TYPOGRAPHY.body} pl-1`}>{getValue('reviewDate')}</div>
              </div>
              
              <br /><br /><br /><br />
              
              {/* Assessor's Signature */}
              <div className="mb-10" style={{width: '100px', height: '50px'}}>
                <label className={`${A4_PDF_TYPOGRAPHY.label} block mb-1`}>Assessor's Signature:</label>
                <div className="min-h-[45px]">
                  {renderSignature(getValue('assessorSignature'), 'Assessor Signature')}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page3;
