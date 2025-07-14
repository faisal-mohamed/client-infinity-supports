import React from 'react';
import A4PageWrapper from './A4PageWrapper';

interface Page4Props {
  schema: {
    goals: {
      type: 'table';
      columns: { key: string; label: string; type: string }[];
      rows: number;
    };
  };
  data: { [key: string]: string };
}

const Page4: React.FC<Page4Props> = ({ schema, data }) => {
  const { columns } = schema.goals;

  // Auto-detect row count from formData
  const rowCount = Object.keys(data).filter((key) => /^goal\d+$/.test(key)).length;
  const rowIndexes = Array.from({ length: rowCount }, (_, i) => i + 1);

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
      
      {/* Title */}
      <h2 className="text-center font-extrabold text-lg mb-4 px-6">MY GOALS</h2>

      {/* Table - takes up remaining space */}
      <div className="flex-1 px-6 py-4 flex flex-col">
        <table className="w-full border border-black border-collapse text-sm flex-1">
          <thead>
            <tr className="bg-gray-200">
              {columns.map((col) => (
                <th key={col.key} className="border border-black px-2 py-3 text-left align-top font-bold text-sm leading-tight">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="h-full">
            {rowIndexes.map((rowIndex) => (
              <tr key={rowIndex} className="align-top">
                {columns.map((col) => {
                  const dataKey = `${col.key}${rowIndex}`;
                  return (
                    <td key={dataKey} className="border border-black px-2 py-3 align-top text-sm leading-relaxed">
                      <div className="whitespace-pre-wrap min-h-[60px]">
                        {data[dataKey] || ''}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer - sticks to bottom */}
      <div className="flex justify-between items-center text-xs font-bold px-6 py-3 mt-auto border-t border-gray-200">
        <div>Website: infinitysupportswa.org</div>
        <div>CF014</div>
        <div>Review Date: 14/03/2026</div>
      </div>
    </A4PageWrapper>
  );
};

export default Page4;
