


import React from 'react';
import A4PageWrapper from './A4PageWrapper';

import { format, parseISO, isValid } from "date-fns";


interface Page3Props {
  schema: any;
  data: Record<string, any>;
  commonFieldsData: Record<string, any>;
  settings: Record<string, any>;
  images?: Record<string, string>;
}

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

  // Define sticky footer content
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
        {/* Top Content */}
        <div className="px-6 pt-6 pb-4 flex flex-col items-center flex-grow">
          <div className="max-w-3xl w-full">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img
                src={images?.infinityLogo || '/infinity_logo.png'}
                alt="Infinity Supports WA logo"
                className="w-[250px] h-[100px] object-contain"
              />
            </div>

            {/* Empty 3-column grid placeholder */}
            <div className="w-full border border-black grid grid-cols-[1fr_1fr_4fr] mb-8">
              <div className="border-r border-black h-10"></div>
              <div className="border-r border-black h-10"></div>
              <div className="h-10"></div>
            </div>

            {/* Form Content */}
            <form className="w-full">
              <div className="mb-10">
                <label className="block font-bold mb-2">Additional Support Requirements:</label>
                <div className="whitespace-pre-wrap border-b border-transparent-400 min-h-[120px] pb-2">
                  {getValue?.('additionalSupport')}
                </div>
              </div>

              <br /><br /><br /><br />

              {/* Assessment Review Date */}
                {/* Assessment Review Date */}
<div className="mb-6">
  <label className="font-bold block mb-1">Assessment Review Date:</label>
  <div className="pl-1">{getValue('reviewDate')}</div>
</div>
<br /><br /><br /><br />
{/* Assessor's Signature */}
<div className="mb-10" style={{width: '100px', height: '50px'}}>
  <label className="font-bold block mb-1">Assessor's Signature:</label>
  {getValue('assessorSignature') && (
    <img
      src={getValue('assessorSignature')}
      alt="Assessor Signature"
      className="w-[100px] h-[45px] object-contain"
    />
  )}
</div>




            </form>
          </div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page3;
