import React from 'react';
import A4PageWrapper from './A4PageWrapper';

const Page1: React.FC<any> = ({ schema, data, commonFieldsData, settings, images }) => {
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

  const isChecked = (key: string) => data?.[key] === 'Yes';

  const renderRadioGroup = (key: string, options: string[]) => (
    <div className="flex gap-4 flex-wrap ml-2">
      {options?.map((opt) => (
        <label key={opt} className="inline-flex items-center">
          <input type="checkbox" checked={getValue(key) === opt} readOnly className="mr-1" />
          {opt}
        </label>
      ))}
    </div>
  );

  return (
    <A4PageWrapper>
      <div
        className="print-page flex flex-col justify-between w-full h-[1122px] overflow-hidden text-black text-xs font-sans"
        style={{ breakAfter: 'page', fontSize: '12px', lineHeight: '2.4' }}
      >
        {/* Header */}
        <div>
          <div className="flex justify-center mb-4">
            <img
              src={`${images?.infinityLogo || '/infinity_logo.png'}`}
              alt="Infinity Supports WA logo"
              className="object-contain h-[60px] w-[150px]"
            />
          </div>

          <div className="text-center mb-1 font-semibold text-sm">
            Emergency Drill Reporting Form
          </div>
          <div className="text-center mb-6 italic text-xs">
            (For Disability Support Workers in a Client’s Home)
          </div>

          <hr className="border-gray-400 mb-6" />
        </div>

        {/* Main Content */}
        <div className="flex-grow">
          {/* Section 1 */}
          <div className="mb-4 font-semibold">1. General Information:</div>
          <div className="space-y-4 mb-6">
            {schema?.generalInfo?.map((field: any) => (
              <div key={field?.key} className="flex items-start">
                <span className="min-w-[220px] font-medium">
                  <strong>● {field?.label}:</strong>
                </span>
                {field?.type === 'radio' ? (
                  renderRadioGroup(field?.key, field?.options ?? [])
                ) : (
                  <span className="flex-1 ml-2 min-w-[150px]">
                    {getValue(field?.key)}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Section 2 */}
          <div className="mb-4 font-semibold">2. Type of Emergency Drill Conducted:</div>
          <div className="space-y-4 mb-6">
            {schema?.drillTypes?.map((field: any) => (
              <div key={field?.key} className="flex items-start">
                {field?.type === 'checkbox' ? (
                  <>
                    <input type="checkbox" checked={isChecked(field?.key)} readOnly className="mr-2 mt-1" />
                    <span>{field?.label}</span>
                  </>
                ) : (
                  <>
                    <span className="min-w-[220px] font-medium">
                      <strong>● {field?.label}:</strong>
                    </span>
                    <span className="flex-1 ml-2 min-w-[150px]">
                      {getValue(field?.key)}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Section 3 */}
          <div className="mb-4 font-semibold">3. Drill Execution Details:</div>
          <div className="space-y-4 mb-6">
            {schema?.executionDetails?.map((field: any) => (
              <div key={field?.key} className="flex items-start">
                <span className="min-w-[220px] font-medium">
                  <strong>● {field?.label}:</strong>
                </span>
                {field?.type === 'radio' ? (
                  renderRadioGroup(field?.key, field?.options ?? [])
                ) : (
                  <span className="flex-1 ml-2 min-w-[150px]">
                     {getValue(field?.key)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-300 flex justify-between text-xs text-blue-700 font-normal">
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

export default Page1;
