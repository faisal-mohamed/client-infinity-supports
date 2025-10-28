import React from 'react';
import EnhancedA4Page from './components/EnhancedA4Page';
import FullContentField from './components/FullContentField';


const Page1Enhanced: React.FC<any> = ({ schema, data, commonFieldsData, settings }) => {
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

  const isChecked = (key: string) => data?.[key] === 'Yes' || data?.[key] === true;

  const renderRadioGroup = (key: string, options: string[]) => (
    <div className="flex gap-4 flex-wrap ml-2 mb-3">
      {options?.map((opt) => (
        <label key={opt} className="inline-flex items-center">
          <input type="checkbox" checked={getValue(key) === opt} readOnly className="mr-1" />
          {opt}
        </label>
      ))}
    </div>
  );

  return (
    <EnhancedA4Page settings={settings} pageNumber={1} totalPages={2} showTitle={true}>
      <div className="space-y-6">
        {/* Section 1: General Information */}
        <div>
          <div className="mb-4 font-semibold text-base">1. General Information:</div>
          <div className="space-y-3">
            {schema?.generalInfo?.map((field: any) => (
              <div key={field?.key} className="flex items-start">
                <span className="min-w-[220px] font-medium text-sm">{field?.label}:</span>
                {field?.type === 'radio' ? (
                  renderRadioGroup(field?.key, field?.options ?? [])
                ) : (
                  <span className="border-b border-black flex-1 ml-2 min-w-[150px] pb-1">
                    {getValue(field?.key)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Type of Emergency Drill Conducted */}
        <div>
          <div className="mb-4 font-semibold text-base">2. Type of Emergency Drill Conducted:</div>
          <div className="space-y-3">
            {schema?.drillTypes?.type === 'select' ? (
              <div>
                {/* Show dropdown with selected value */}
                <div className="flex items-start">
                  <span className="min-w-[220px] font-medium text-sm">{schema?.drillTypes?.label}:</span>
                  <span className="border-b border-black flex-1 ml-2 min-w-[150px] pb-1">
                    {getValue('selectedDrillType') || 'No selection made'}
                  </span>
                </div>
                
                {/* Show "Other" text field if "Other" is selected */}
                {getValue('selectedDrillType') === 'Other (specify)' && (
                  <div className="mt-3">
                    <FullContentField
                      label={schema?.drillTypes?.otherField?.label}
                      value={getValue(schema?.drillTypes?.otherField?.key)}
                    />
                  </div>
                )}
              </div>
            ) : (
              // Fallback for old structure
              schema?.drillTypes?.map((field: any) => (
                <div key={field?.key}>
                  {field?.type === 'checkbox' ? (
                    <div className="flex items-start">
                      <input type="checkbox" checked={isChecked(field?.key)} readOnly className="mr-2 mt-1" />
                      <span className="text-sm">{field?.label}</span>
                    </div>
                  ) : (
                    <FullContentField
                      label={field?.label}
                      value={getValue(field?.key)}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section 3: Drill Execution Details */}
        <div>
          <div className="mb-4 font-semibold text-base">3. Drill Execution Details:</div>
          <div className="space-y-4">
            {schema?.executionDetails?.map((field: any) => (
              <div key={field?.key}>
                {field?.type === 'radio' ? (
                  <div className="flex flex-col">
                    <span className="font-medium mb-1 text-sm">{field?.label}:</span>
                    {renderRadioGroup(field?.key, field?.options ?? [])}
                  </div>
                ) : (
                  <FullContentField
                    label={field?.label}
                    value={getValue(field?.key)}
                    type={field?.type}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </EnhancedA4Page>
  );
};

export default Page1Enhanced;
