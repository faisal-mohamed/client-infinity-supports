import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { format, parseISO, isValid } from "date-fns";

interface PageProps {
  formKey?: string;
  data?: any;
  commonFieldsData?: any;
  settings?: any;
  formSchema: any;
}

const commonFieldMapping: Record<string, string> = {
  name: 'name',
  address: 'street',
  dob: 'dob',
  disability: 'disability',
  ndisNumber: 'ndis'
};

const Page3: React.FC<PageProps> = ({ formSchema: schema, data, commonFieldsData, settings }) => {
  return (
    <A4PageWrapper>
      {/* Header with Logo - Fixed desktop sizing */}
      <div className="flex justify-center pt-6 pb-4">
        <img
          src="/infinity_logo.png"
          alt="Infinity Supports WA logo"
          className="object-contain"
          style={{ height: '64px' }} // Fixed height for consistency
        />
      </div>

      {/* Table - Fixed desktop layout for zoom-out */}
      <div className="flex-1 px-6 py-4 flex flex-col">
        <table className="w-full border border-black border-collapse flex-1" style={{ fontSize: '14px' }}>
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
                    style={{ 
                      width: '35%',
                      fontSize: '14px',
                      lineHeight: '1.4'
                    }}
                  >
                    {field.label}
                  </td>
                  <td 
                    className="border border-black px-3 py-2 leading-tight align-top"
                    style={{ 
                      fontSize: '14px',
                      lineHeight: '1.4'
                    }}
                  >
                    {field.type === 'checkbox' ? (
                      <div className="space-y-2">
                        <p className="mb-2 leading-tight">{field.description}</p>
                        <div className="flex gap-4 mb-2">
                          {field.options.map((option: string) => (
                            <label
                              key={option}
                              className={`inline-flex items-center ${
                                value === option ? 'font-bold' : ''
                              }`}
                              style={{ fontSize: '14px' }}
                            >
                              <input
                                type="checkbox"
                                className="mr-2"
                                style={{ transform: 'scale(0.9)' }}
                                checked={value === option}
                                readOnly
                              />
                              {option}
                            </label>
                          ))}
                        </div>
                        <p className="font-bold leading-tight" style={{ fontSize: '14px' }}>
                          {field.note}
                        </p>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap leading-relaxed">{value}</div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer - Fixed desktop layout */}
      <div className="flex justify-between items-center text-xs font-bold px-6 py-3 mt-auto border-t border-gray-200">
        <div>Website: {settings?.company_website}</div>
        <div>{settings?.person_centre_plan_form_id}</div>
        <div>
          Review Date:{' '}
          {settings?.review_date && /^\d{4}-\d{2}-\d{2}$/.test(settings.review_date)
            ? format(parseISO(settings.review_date), 'dd-MM-yyyy')
            : 'N/A'}
        </div>      
      </div>
    </A4PageWrapper>
  );
};

export default Page3;
