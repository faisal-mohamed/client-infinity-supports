import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { format, parseISO, isValid } from "date-fns";

interface Page5Props {
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

const Page5: React.FC<Page5Props> = ({ formSchema: schema, data, commonFieldsData, settings }) => {
  const { fields, informalSupports } = schema;
  const rowIndexes = Array.from({ length: informalSupports.rows }, (_, i) => i + 1);

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

      {/* Content area - Fixed desktop layout */}
      <div className="flex-1 px-6 py-4 flex flex-col">
        {/* First Table - Fixed desktop sizing */}
        <div className="mb-6">
          <table className="w-full border border-black border-collapse" style={{ fontSize: '14px' }}>
            <tbody>
              {fields.map((field: any) => {
                const isFromCommon = field.key in commonFieldMapping;
                const valueKey = isFromCommon ? commonFieldMapping[field.key] : field.key;
                const value = isFromCommon
                  ? commonFieldsData?.[valueKey] ?? ''
                  : data?.[valueKey] ?? '';

                return (
                  <tr key={field.key}>
                    <td
                      className="border border-black px-3 py-2 bg-gray-50 font-medium"
                      style={{ 
                        width: '50%',
                        fontSize: '14px',
                        lineHeight: '1.4'
                      }}
                    >
                      {field.label}
                    </td>
                    <td 
                      className="border border-black px-3 py-2"
                      style={{ 
                        fontSize: '14px',
                        lineHeight: '1.4'
                      }}
                    >
                      {value}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Informal Supports Section - Fixed desktop sizing */}
        <div className="mb-6">
          <p className="font-bold mb-3" style={{ fontSize: '16px' }}>
            My Informal Supports:
          </p>
          <table className="w-full border border-black border-collapse" style={{ fontSize: '14px' }}>
            <thead>
              <tr className="bg-gray-300 text-center">
                {informalSupports.columns.map((col: any) => (
                  <th
                    key={col.key}
                    className="border border-black px-3 py-2 font-bold"
                    style={{ 
                      fontSize: '14px',
                      lineHeight: '1.4'
                    }}
                  >
                    {col.label.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rowIndexes.map((rowIndex) => (
                <tr key={rowIndex}>
                  {informalSupports.columns.map((col: any) => {
                    const dataKey = `${col.key}${rowIndex}`;
                    return (
                      <td
                        key={dataKey}
                        className="border border-black px-3 py-3 align-top"
                        style={{ 
                          fontSize: '14px',
                          lineHeight: '1.4'
                        }}
                      >
                        {data?.[dataKey] ?? ''}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Flexible spacer */}
        <div className="flex-1"></div>

        {/* Bottom Text - Fixed desktop sizing */}
        <div className="mb-6">
          <p className="leading-relaxed" style={{ fontSize: '14px', lineHeight: '1.5' }}>
            This plan has been developed during the client intake meeting in conjunction with{' '}
            <span className="inline-block border-b border-black text-center px-2" style={{ minWidth: '150px' }}>
              {
                commonFieldMapping['name']
                  ? commonFieldsData?.[commonFieldMapping['name']] ?? ''
                  : data?.name ?? ''
              }
            </span>{' '}
            and people in the family network, supporters and from information gathered on the
            client intake form.
          </p>
        </div>
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

export default Page5;
