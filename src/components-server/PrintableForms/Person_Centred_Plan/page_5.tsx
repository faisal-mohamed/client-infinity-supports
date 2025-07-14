import React from 'react';
import A4PageWrapper from './A4PageWrapper';

interface Page5Props {
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

const Page5: React.FC<Page5Props> = ({ formSchema: schema, data, commonFieldsData, settings, images }) => {
  const { fields, informalSupports } = schema;
  const rowIndexes = Array.from({ length: informalSupports.rows }, (_, i) => i + 1);

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

      {/* Content area */}
      <div className="flex-1 px-6 py-4 flex flex-col">
        {/* First Table */}
        <div className="mb-6">
          <table className="w-full border border-black border-collapse text-sm">
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
                      style={{ width: '50%' }}
                    >
                      {field.label}
                    </td>
                    <td className="border border-black px-3 py-2 text-sm">{value}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Informal Supports Section */}
        <div className="mb-6">
          <p className="font-bold mb-3 text-base">My Informal Supports:</p>
          <table className="w-full border border-black border-collapse text-sm">
            <thead>
              <tr className="bg-gray-300 text-center">
                {informalSupports.columns.map((col: any) => (
                  <th
                    key={col.key}
                    className="border border-black px-3 py-2 font-bold text-sm"
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
                        className="border border-black px-3 py-3 text-sm align-top"
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

        {/* Bottom Text */}
        <div className="mb-6">
          <p className="text-sm leading-relaxed">
            This plan has been developed during the client intake meeting in conjunction with{' '}
            <span className="inline-block border-b border-black min-w-[150px] text-center px-2">
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

      {/* Footer */}
      <div className="flex justify-between items-center text-xs font-bold px-6 py-3 mt-auto border-t border-gray-200">
  <div>Website: {settings?.company_website}</div>
        <div>{settings?.person_centre_plan_form_id}</div>
        <div>Review Date: {settings?.review_date}</div>
      </div>
    </A4PageWrapper>
  );
};

export default Page5;
