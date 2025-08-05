import React from "react";
import A4PageWrapper from "./A4PageWrapper";
import { format, parseISO, isValid } from "date-fns";


interface Page8Props {
  schema: any;
  data: any;
  commonFieldsData: Record<string, string>;
  settings: any;
}

const Page8: React.FC<Page8Props> = ({ schema, data, commonFieldsData, settings }) => {
  const rows = schema?.riskRows?.slice?.(4) || []; // Rows 5 to 10

  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full text-xs font-sans">
        {/* Logo */}
        <div className="flex justify-center pt-6 pb-4">
          <img
            src='/infinity_logo.png'
            alt="Infinity Supports WA logo"
            className="h-[60px] w-[150px] object-contain"
          />
        </div>

        {/* Risk Table (Rows 5–10) */}
        <div className="flex-1 flex flex-col px-6">
          <table className="w-full border border-black border-collapse text-xs">
            <thead className="bg-gray-300 font-semibold">
              <tr>
                <th className="border border-black p-2 text-left">Issue/Task</th>
                <th className="border border-black p-2 text-left">Risk Score</th>
                <th className="border border-black p-2 text-left">Control Measure</th>
                <th className="border border-black p-2 text-left">Person Responsible</th>
              </tr>
            </thead>
            <tbody>
              {rows?.map?.((row: any, i: number) => (
                <tr key={i} className="h-24 align-top">
                  <td className="border border-black p-2 align-top">{data?.[row?.issue] ?? ""}</td>
                  <td className="border border-black p-2 align-top">{data?.[row?.score] ?? ""}</td>
                  <td className="border border-black p-2 align-top">{data?.[row?.control] ?? ""}</td>
                  <td className="border border-black p-2 align-top">{data?.[row?.person] ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="pt-4 mt-auto px-6">
          <div className="flex justify-between text-xs px-2">
            <div>Website: {settings?.company_website}</div>
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

export default Page8;
