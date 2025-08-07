import React from 'react';
import A4PageWrapper from './A4PageWrapper';

const Page2: React.FC<any> = ({ schema, data, commonFieldsData, settings }) => {



  const commonFieldMapping: Record<string, string> = {
    clientName: 'name',
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
    sex: 'sex'
  };

  const getValue = (key: string) => {
    if (commonFieldMapping?.[key]) {
      return commonFieldsData?.[commonFieldMapping?.[key]] ?? '';
    }
    return data?.[key] ?? '';
  };

  const renderRadio = (key: string, options: string[]) => (
    <div className="flex flex-wrap gap-4 ml-2 mt-1">
      {options?.map?.((opt) => (
        <label key={opt} className="inline-flex items-center">
          <input type="checkbox" readOnly checked={getValue(key) === opt} className="mr-1" />
          {opt}
        </label>
      )) ?? null}
    </div>
  );

  return (
    <A4PageWrapper>
      <div className="flex flex-col flex-grow text-black leading-relaxed font-sans h-full" style={{ fontSize: '12px' }}>
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/infinity_logo.png"
            alt="Infinity Supports WA logo"
            className="object-contain"
            style={{ height: '60px', width: '150px' }} // Fixed dimensions for consistency
          />
        </div>

        {/* Section 4 */}
        <div className="mb-4 font-semibold">4. Observations & Challenges:</div>
        <div className="space-y-3 mb-6">
          {schema?.observations?.map?.((field: any) => (
            <div key={field?.key} className="flex items-start">
              <span className="min-w-[220px] font-medium">{field?.label}:</span>
              <span className="ml-2 border-b border-black flex-1">{getValue(field?.key)}</span>
            </div>
          )) ?? null}
        </div>

        {/* Section 5 */}
        <div className="mb-4 font-semibold">5. Recommendations & Improvements:</div>
        <div className="space-y-3 mb-6">
          {schema?.recommendations?.map?.((field: any) => (
            <div key={field?.key} className="flex flex-col">
              <span className="font-medium">{field?.label}:</span>
              {field?.type === 'radio'
                ? renderRadio(field?.key, field?.options ?? [])
                : <span className="ml-2 border-b border-black">{getValue(field?.key)}</span>}
            </div>
          )) ?? null}
        </div>

        {/* Section 6 */}
        <div className="mb-4 font-semibold">6. Follow-Up Actions:</div>
        <div className="space-y-3 mb-6">
          {schema?.followup?.map?.((field: any) => (
            <div key={field?.key} className="flex flex-col">
              <span className="font-medium">{field?.label}:</span>
              {field?.type === 'radio'
                ? renderRadio(field?.key, field?.options ?? [])
                : <span className="ml-2 border-b border-black">{getValue(field?.key)}</span>}
            </div>
          )) ?? null}
        </div>

        {/* Section 7 */}
        <div className="mb-4 font-semibold">7. Signatures:</div>
        <div className="space-y-3 mb-6">
  {schema?.signatures?.map?.((field: any) => {
    const value = getValue(field?.key);
    const isSignatureImage = ['supportWorkerSignature', 'supervisorSignature'].includes(field?.key);

    return (
      <div key={field?.key} className="flex items-start gap-2">
        <span className="min-w-[220px] font-medium">{field?.label}:</span>
        {isSignatureImage && value ? (
          <img
            src={value}
            alt={`${field?.label} Signature`}
            className="h-16 object-contain border-b border-black"
          />
        ) : (
          <span className="ml-2 border-b border-black flex-1">{value}</span>
        )}
      </div>
    );
  }) ?? null}
</div>


        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-gray-300 flex justify-between text-xs text-blue-800">
           <a
            className="underline"
            href={settings?.company_website || 'https://www.infinitysupportswa.org'}
            target="_blank"
            rel="noopener noreferrer"
          >
            {settings?.company_website || 'www.infinitysupportswa.org'}
          </a>
          <div>{settings?.emergency_drill}</div>
          <div>DOR: {settings?.review_date}</div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page2;
