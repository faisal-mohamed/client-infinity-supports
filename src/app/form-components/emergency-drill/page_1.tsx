import React from 'react';
import A4PageWrapper from './A4PageWrapper';

const Page1: React.FC<any> = ({ schema, data, commonFieldsData, settings }) => {
  // Debug logging for view form
  console.log('🔍 Emergency Drill Page1 VIEW - Settings received:', settings);
  console.log('🔍 Emergency Drill Page1 VIEW - Email:', settings?.from_email);
  console.log('🔍 Emergency Drill Page1 VIEW - Form ID:', settings?.emergency_drill);
  console.log('🔍 Emergency Drill Page1 VIEW - Date:', settings?.review_date);

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




  const isChecked = (key: string) => data?.[key] === 'Yes' ? true : false;

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
      <div className="flex flex-col flex-grow text-black leading-relaxed font-sans h-full" style={{ fontSize: '12px' }}>
        {/* Header */}
        <div className="flex justify-center mb-4">
          <img
            src="/infinity_logo.png"
            alt="Infinity Supports WA logo"
            className="object-contain"
            style={{ height: '60px', width: '150px' }} // Fixed dimensions for consistency
          />
        </div>

        <div className="text-center mb-1 font-semibold" style={{ fontSize: '14px' }}>
          Emergency Drill Reporting Form
        </div>
        <div className="text-center mb-6 italic" style={{ fontSize: '12px' }}>
          (For Disability Support Workers in a Client’s Home)
        </div>

        <hr className="border-gray-400 mb-6" />

        {/* Section 1 */}
        <div className="mb-4 font-semibold">1. General Information:</div>
        <div className="space-y-3 mb-6">
          {schema?.generalInfo?.map((field: any) => (
            <div key={field?.key} className="flex items-start">
              <span className="min-w-[220px] font-medium">{field?.label}:</span>
              {field?.type === 'radio' ? (
                renderRadioGroup(field?.key, field?.options ?? [])
              ) : (
                <span className="border-b border-black flex-1 ml-2 min-w-[150px]">
                  {getValue(field?.key)}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Section 2 */}
        <div className="mb-4 font-semibold">2. Type of Emergency Drill Conducted:</div>
        <div className="space-y-3 mb-6">
          {schema?.drillTypes?.type === 'select' ? (
            <div>
              {/* Show dropdown with selected value */}
              <div className="flex items-start">
                <span className="min-w-[220px] font-medium">{schema?.drillTypes?.label}:</span>
                <span className="border-b border-black flex-1 ml-2 min-w-[150px]">
                  {schema?.drillTypes?.options?.find((opt: any) => opt.value === getValue('selectedDrillType'))?.label || 'No selection made'}
                </span>
              </div>
              
              {/* Show "Other" text field if "Other" is selected */}
              {getValue('selectedDrillType') === 'Other (specify)' && (
                <div className="mt-3">
                  <div className="flex items-start">
                    <span className="min-w-[220px] font-medium">{schema?.drillTypes?.otherField?.label}:</span>
                    <span className="border-b border-black flex-1 ml-2 min-w-[150px]">
                      {getValue(schema?.drillTypes?.otherField?.key)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Fallback for old structure (should not be used anymore)
            schema?.drillTypes?.map((field: any) => (
              <div key={field?.key} className="flex items-start">
                {field?.type === 'checkbox' ? (
                  <>
                    <input type="checkbox" checked={isChecked(field?.key)} readOnly className="mr-2 mt-1" />
                    <span>{field?.label}</span>
                  </>
                ) : (
                  <>
                    <span className="min-w-[220px] font-medium">{field?.label}:</span>
                    <span className="border-b border-black flex-1 ml-2 min-w-[150px]">
                      {getValue(field?.key)}
                    </span>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Section 3 */}
        <div className="mb-4 font-semibold">3. Drill Execution Details:</div>
        <div className="space-y-3 mb-6">
          {schema?.executionDetails?.map((field: any) => (
            <div key={field?.key} className="flex items-start">
              <span className="min-w-[220px] font-medium">{field?.label}:</span>
              {field?.type === 'radio' ? (
                renderRadioGroup(field?.key, field?.options ?? [])
              ) : (
                <span className="border-b border-black flex-1 ml-2 min-w-[150px]">
                  {getValue(field?.key)}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-gray-300 flex justify-between text-xs text-gray-600">
          <span>{settings?.from_email || ''}</span>
          <span>{settings?.emergency_drill || ''}</span>
          <span>Date of Report: {settings?.review_date || ''}</span>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page1;
