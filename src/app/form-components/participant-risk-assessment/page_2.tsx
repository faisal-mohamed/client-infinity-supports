import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { format, parseISO, isValid } from "date-fns";


interface Page2Props {
  schema: any;
  data: Record<string, string>;
  commonFieldsData: Record<string, string>;
  settings: any;
}

const Page2: React.FC<Page2Props> = ({ schema, data, commonFieldsData, settings }) => {
  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full text-sm font-sans">
        {/* Logo */}
        <div className="flex justify-center pt-6 pb-4">
          <img
            src='/infinity_logo.png'
            alt="Infinity Supports WA logo"
            className="h-[60px] w-[150px] object-contain"
          />
        </div>

        {/* Risk Assessment Table */}
        <div className="flex-1 flex flex-col px-6">
          <table className="w-full border border-black border-collapse text-sm flex-1">
            <thead>
              <tr>
                <th className="border border-black w-[20%]"></th>
                <th className="border border-black text-center font-bold p-2" colSpan={4}>
                  INDIVIDUAL RISK ASSESSMENTS
                </th>
              </tr>
              <tr className="bg-gray-300 font-semibold">
                <th className="border border-black p-2">No.</th>
                <th className="border border-black p-2">Item</th>
                <th className="border border-black p-2 w-[10%] text-center">Y/N</th>
                <th className="border border-black p-2 w-[7%] text-center">Risk Rating</th>
                <th className="border border-black p-2 w-[20%]">Comments/Controls</th>
              </tr>
            </thead>
            <tbody>
              {schema?.fields?.map?.((field: any, index: number) => {
                const key = `risk${index + 1}`;
                const yesChecked = data?.[key] === 'Yes';
                const noChecked = data?.[key] === 'No';

                return (
                  <tr key={key}>
                    <td className="border border-black p-2 align-top">{index + 1}</td>
                    <td className="border border-black p-2 align-top">{field?.label}</td>
                    <td className="border border-black p-2 align-top text-center">
                      <div className="flex flex-col items-start gap-1">
                        <label className="inline-flex items-center space-x-1">
                          <input
                            type="checkbox"
                            checked={yesChecked}
                            readOnly
                            className="w-3 h-3"
                          />
                          <span>YES</span>
                        </label>
                        <label className="inline-flex items-center space-x-1">
                          <input
                            type="checkbox"
                            checked={noChecked}
                            readOnly
                            className="w-3 h-3"
                          />
                          <span>NO</span>
                        </label>
                      </div>
                    </td>
                    <td className="border border-black p-2 align-top text-center">
                      {data?.[`${key}Rating`] ?? ''}
                    </td>
                    <td className="border border-black p-2 align-top">
                      {field?.commentLabel ? `${field?.commentLabel}: ` : ''}
                      {data?.[`${key}Comment`] ?? ''}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="pt-4">
          <div className="flex justify-between text-xs px-2">
            <div> Website: {settings?.company_website}</div>
            <div>{settings?.participant_risk_assessment}</div>
<div>
  Review Date:{' '}
  {settings?.review_date && /^\d{4}-\d{2}-\d{2}$/.test(settings.review_date)
    ? format(parseISO(settings.review_date), 'dd-MM-yyyy')
    : 'N/A'}
</div>
          </div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page2;
