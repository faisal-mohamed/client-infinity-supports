


import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { parseISO, isValid, format } from 'date-fns';
 const formatDate = (value: string): string => {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const parsed = parseISO(value);
    if (isValid(parsed)) {
      return format(parsed, 'dd-MM-yyyy');
    }
  }
  return value;
};
const Page26 = ({ schema, data, settings, commonFieldsData, images }: any) => {
  const commonFieldMapping: Record<string, string> = {
    name: 'name',
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
            className="h-[80px] mt-2 border border-gray-300 rounded"
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

  return (
    <A4PageWrapper>
      <div className="a4-inner text-sm text-black font-[Times_New_Roman]">
        {/* Content */}
        <div className="flex-1 max-w-3xl mx-auto px-6 pt-6 flex flex-col">
          {/* Logo */}
          <div className="flex justify-center pb-2">
            <img
              src={images?.infinityLogo}
              alt="Infinity Supports WA logo"
              className="mb-4 w-[140px] h-[56px] object-contain"
            />
          </div>

          {/* Title */}
          <h2 className="text-center font-bold text-sm mb-5">
            {schema?.title}
          </h2>

          {/* Static Content */}
          <div className="mb-2">{schema?.fields?.[0]?.content}</div>
          <div className="mb-4">{schema?.fields?.[1]?.content}</div>

          {/* Read-only Inputs */}
          <div className="space-y-2">
            {schema?.fields?.slice(2).map((field: any) => (
              <div key={field?.key} className="mb-1">
                <p className="font-medium">{field?.label}:</p>
                <div>{getDisplayValue(field?.key)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full border-t border-gray-300 py-3">
          <div className="max-w-3xl mx-auto px-6 flex justify-between text-xs text-gray-500">
            <span>Website: {settings?.company_website}</span>
            <span>{settings?.welcome_form}</span>
<div>Review Date: {formatDate(settings?.review_date)}</div>
          </div>
        </footer>
      </div>
    </A4PageWrapper>
  );
};

export default Page26;
