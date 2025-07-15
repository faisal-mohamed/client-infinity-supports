import React from "react";
import A4PageWrapper from "./A4PageWrapper";

interface Page7Props {
  schema: any;
  data: Record<string, any>;
}

const Page7: React.FC<Page7Props> = ({ schema, data }) => {
  const rows = schema.riskRows.slice(0, 4); // First 4 rows

  return (
    <A4PageWrapper>
      <div className="p-6 text-[13px]">
        <div className="flex justify-center mb-4">
          <img
            src="https://storage.googleapis.com/a1aa/image/1caec2fd-8fca-4a92-7f71-47bbb630af77.jpg"
            alt="Infinity Logo"
            className="h-16 object-contain"
          />
        </div>

        {/* Household Safe Meeting Point */}
        <table className="w-full border border-black border-collapse mb-4 text-[13px]">
          <thead>
            <tr className="bg-gray-400 font-semibold">
              <th className="border border-black px-2 py-1 text-left">
                Participant household safe meeting point
              </th>
              <th className="border border-black w-[70%]"></th>
            </tr>
          </thead>
          <tbody>
            {schema.householdMeetingPoint.map((field: any) => (
              <tr key={field.key}>
                <td className="border border-black px-2 py-1 font-semibold">
                  {field.label}
                </td>
                <td className="border border-black px-2 py-1">
                  {data[field.key] || ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-[10px] font-bold text-center mb-2 uppercase">
          IF RISK IS IDENTIFIED, PLEASE DISCUSS WITH THE MANAGER
        </p>

        {/* Risk Table - Rows 1 to 4 */}
        <table className="w-full border border-black border-collapse text-[13px]">
          <thead className="bg-gray-400 font-semibold">
            <tr>
              <th className="border border-black px-2 py-1 text-left">Issue/Task</th>
              <th className="border border-black px-2 py-1 text-left">Risk Score</th>
              <th className="border border-black px-2 py-1 text-left">Control Measure</th>
              <th className="border border-black px-2 py-1 text-left">Person Responsible</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row: any, i: number) => (
              <tr key={i} className="h-20">
                <td className="border border-black px-2 py-1 align-top">
                  {data[row.issue] || ""}
                </td>
                <td className="border border-black px-2 py-1 align-top">
                  {data[row.score] || ""}
                </td>
                <td className="border border-black px-2 py-1 align-top">
                  {data[row.control] || ""}
                </td>
                <td className="border border-black px-2 py-1 align-top">
                  {data[row.person] || ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="flex justify-between text-[10px] mt-12">
          <div>Website: infinitysupportswa.org</div>
          <div>CF013</div>
          <div>Review Date:13/02/2025</div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page7;
