import React from 'react';
import A4PageWrapper from './A4PageWrapper';

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

const Page2: React.FC<PageProps> = ({ formSchema: schema, data, commonFieldsData, settings }) => {


  return (
    <A4PageWrapper>
      {/* Header with Logo */}
      <div className="flex justify-center pt-6 pb-4">
        <img
          src="/infinity_logo.png"
          alt="Infinity Supports WA logo"
          className="object-contain h-16"
        />
      </div>

      {/* Table - takes up remaining space */}
      <div className="flex-1 px-6 py-4 flex flex-col">
        <table className="w-full border border-black border-collapse text-sm flex-1">
          <tbody className="h-full">
            {schema.fields.map((field: any, index: number) => {
              const isFromCommon = field.key in commonFieldMapping;
              const valueKey = isFromCommon ? commonFieldMapping[field.key] : field.key;
              const value = isFromCommon
                ? commonFieldsData?.[valueKey] ?? ''
                : data?.[valueKey] ?? '';

              return (
                <tr key={field.key} className="align-top">
                  <td
                    className="border border-black px-3 py-2 bg-gray-50 font-medium align-top"
                    style={{
                      width: '30%',
                      height: field.height || 'auto',
                    }}
                  >
                    {field.label}
                  </td>
                  <td
                    className="border border-black px-3 py-2 align-top"
                    style={{
                      height: field.height || 'auto',
                    }}
                  >
                    {field.type === 'textarea' ? (
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {value}
                      </div>
                    ) : (
                      <div className="text-sm leading-relaxed">{value}</div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer - sticks to bottom */}
      <div className="flex justify-between items-center text-xs font-bold px-6 py-3 mt-auto border-t border-gray-200">
          <div>Website: {settings?.company_website}</div>
        <div>{settings?.person_centre_plan_form_id}</div>
        <div>Review Date: {settings?.review_date}</div>
      </div>
    </A4PageWrapper>
  );
};

export default Page2;
