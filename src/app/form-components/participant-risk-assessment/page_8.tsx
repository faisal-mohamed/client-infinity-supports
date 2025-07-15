import React from "react";
import A4PageWrapper from "./A4PageWrapper";

interface Page8Props {
  schema: any;
  data: Record<string, any>;
}

const Page8: React.FC<Page8Props> = ({ schema, data }) => {
  const rows = schema.riskRows.slice(4); // Rows 5 to 10

  return (
    <A4PageWrapper>
      <div className="p-6 text-[13px]">
        <div className="flex justify-center mb-6">
          <img
            src="https://storage.googleapis.com/a1aa/image/13ce229d-d8bf-44f5-b00e-f24ebe104089.jpg"
            alt="Infinity Logo"
            className="h-16 object-contain"
          />
        </div>

        {/* Risk Table - Rows 5 to 10 */}
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
              <tr key={i} className="h-24">
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
        <div className="flex justify-between text-[10px] mt-10">
          <div>Website: infinitysupportswa.org</div>
          <div>CF013</div>
          <div>Review Date:13/02/2025</div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page8;
