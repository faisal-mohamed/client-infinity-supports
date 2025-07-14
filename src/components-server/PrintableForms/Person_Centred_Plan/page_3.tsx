import React from 'react';
import A4PageWrapper from './A4PageWrapper';

interface PageProps {
  formKey?: string;
  data?: any;
  commonFieldsData?: any;
  settings?: any;
  formSchema: any;
  images?: any;
}

const commonFieldMapping: Record<string, string> = {
  name: 'name',
  address: 'street',
  dob: 'dob',
  disability: 'disability',
  ndisNumber: 'ndis'
};

const Page3: React.FC<PageProps> = ({ formSchema: schema, data, commonFieldsData, settings, images }) => {
  return (
    <A4PageWrapper>
      {/* Header with Logo */}
     <div className="flex justify-center pt-8 pb-6">
        <img 
          src={images?.infinityLogo || '/infinity-logo.png'} 
          alt="Infinity Supports WA Logo" 
          className="h-20 object-contain" 
        />
      </div>

      {/* Table */}
      <div className="flex-1 px-6 py-4 flex flex-col">
        <table className="w-full border border-black border-collapse text-sm flex-1">
          <tbody className="h-full">
            {schema.fields.map((field: any) => {
              const isFromCommon = field.key in commonFieldMapping;
              const valueKey = isFromCommon ? commonFieldMapping[field.key] : field.key;
              const value = isFromCommon
                ? commonFieldsData?.[valueKey] ?? ''
                : data?.[valueKey] ?? '';

              return (
                <tr key={field.key} className="align-top">
                  <td
                    className="border border-black px-3 py-2 bg-gray-50 font-medium align-top leading-tight"
                    style={{ width: '35%' }}
                  >
                    {field.label}
                  </td>
                  <td className="border border-black px-3 py-2 text-sm leading-tight align-top">
                    {field.type === 'checkbox' ? (
                      <div className="space-y-2">
                        <p className="mb-2 text-sm leading-tight">{field.description}</p>
                        <div className="flex gap-4 mb-2">
                          {field.options.map((option: string) => (
                            <label
                              key={option}
                              className={`inline-flex items-center text-sm ${
                                value === option ? 'font-bold' : ''
                              }`}
                            >
                              <input
                                type="checkbox"
                                className="mr-2 scale-75"
                                checked={value === option}
                                readOnly
                              />
                              {option}
                            </label>
                          ))}
                        </div>
                        <p className="font-bold text-sm leading-tight">{field.note}</p>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">{value}</div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-xs font-bold px-6 py-3 mt-auto border-t border-gray-200">
      <div>Website: {settings?.company_website}</div>
        <div>CF014</div>
        <div>Review Date: {settings?.review_date}</div>
      </div>
    </A4PageWrapper>
  );
};

export default Page3;
