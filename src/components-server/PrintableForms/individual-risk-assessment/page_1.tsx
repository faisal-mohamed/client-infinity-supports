


import React, { useEffect } from 'react';
import A4PageWrapper from './A4PageWrapper';

import { format, parseISO, isValid } from "date-fns";



interface Page1Props {
  schema: any;
  data: Record<string, any>;
  commonFieldsData: Record<string, any>;
  settings: Record<string, any>;
  images?: Record<string, string>;
}

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



console.log('Page1 component rendered with data:', data, 'commonFieldsData:', commonFieldsData);

  // const getValue = (key: string) => {
  //   if (commonFieldMapping?.[key]) {
  //     return commonFieldsData?.[commonFieldMapping?.[key]] ?? '';
  //   }
  //   return data?.[key] ?? '';
  // };
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
    <div className="flex justify-between text-sm px-2">
      <div>{settings?.company_website || ''}</div>
      <div>
  Date of Review:{' '}
  {settings?.review_date && /^\d{4}-\d{2}-\d{2}$/.test(settings.review_date)
    ? format(parseISO(settings.review_date), 'dd-MM-yyyy')
    : 'N/A'}
</div>

    </div>
  );

  return (
    <A4PageWrapper footer={footer}>
      <div className="flex flex-col h-full text-[16px] font-sans leading-snug">
        {/* Top Section */}
        <div className="px-6 pt-6 pb-4 flex flex-col gap-6">
          {/* Logo */}
          <div className="flex justify-center">
            <img
              src={images?.infinityLogo || '/infinity_logo.png'}
              alt="Infinity Supports WA logo"
              className="w-[250px] h-[100px] object-contain"
            />
          </div>

          {/* Title */}
          <div className="text-center font-bold text-[18px] uppercase">
            Individual Activity Risk Assessment
          </div>

          {/* Header Info Fields */}
          <div className="flex justify-between max-w-3xl mx-auto">
            <div className="w-1/2 space-y-2">
              {schema?.headerInfo?.slice?.(0, 3)?.map?.((field: any) => (
                <div key={field?.key}>
                  <span className="underline">{field?.label}:</span>{' '}
                  <span>{getValue(field?.key)}</span>
                </div>
              ))}
            </div>
            <div className="w-1/2 text-right space-y-2">
              {schema?.headerInfo?.slice?.(3)?.map?.((field: any) => (
                <div key={field?.key}>
                  <span className="underline">{field?.label}:</span>{' '}
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

          {/* Risk Legend - Page 1 shows only LOW and MEDIUM */}
          <div className="max-w-3xl mx-auto text-[15px] space-y-4">
            <div>
              <span className="underline">LOW</span>{' '}
              <span className="text-green-600 font-semibold">GREEN</span>
              <div>Visit acceptable. Ensure control options are followed.</div>
            </div>
            <div>
              <span className="underline">MEDIUM</span>{' '}
              <span style={{ color: '#ca8a04', fontWeight: 'bold' }}>YELLOW</span>
              <div>
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
