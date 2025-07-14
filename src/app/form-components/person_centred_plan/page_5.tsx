import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { formData } from "./page";

interface Page5Props {
  schema: {
    fields: { key: string; label: string; type: string }[];
    informalSupports: {
      type: 'table';
      rows: number;
      columns: { key: string; label: string; type: string }[];
    };
  };
  data: { [key: string]: string };
}

const Page5: React.FC<Page5Props> = ({ schema, data }) => {
  const { fields, informalSupports } = schema;
  const rowIndexes = Array.from({ length: informalSupports.rows }, (_, i) => i + 1);

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

      {/* Content area - takes up remaining space */}
      <div className="flex-1 px-6 py-4 flex flex-col">
        {/* First Table */}
        <div className="mb-6">
          <table className="w-full border border-black border-collapse text-sm">
            <tbody>
              {fields.map((field) => (
                <tr key={field.key}>
                  <td className="border border-black px-3 py-2 bg-gray-50 font-medium" style={{ width: '50%' }}>
                    {field.label}
                  </td>
                  <td className="border border-black px-3 py-2 text-sm">
                    {data[field.key] || ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Informal Supports Section */}
        <div className="mb-6">
          <p className="font-bold mb-3 text-base">My Informal Supports:</p>
          <table className="w-full border border-black border-collapse text-sm">
            <thead>
              <tr className="bg-gray-300 text-center">
                {informalSupports.columns.map((col) => (
                  <th key={col.key} className="border border-black px-3 py-2 font-bold text-sm">
                    {col.label.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rowIndexes.map((rowIndex) => (
                <tr key={rowIndex}>
                  {informalSupports.columns.map((col) => {
                    const dataKey = `${col.key}${rowIndex}`;
                    return (
                      <td key={dataKey} className="border border-black px-3 py-3 text-sm align-top">
                        {data[dataKey] || ''}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Flexible spacer to push bottom text and footer down */}
        <div className="flex-1"></div>

        {/* Bottom Text */}
        <div className="mb-6">
          <p className="text-sm leading-relaxed">
            This plan has been developed during the client intake meeting in conjunction with{' '}
            <span className="inline-block border-b border-black min-w-[150px] text-center px-2">
              {formData.name}
            </span>{' '}
            and people in the family network, supporters and from information gathered on the client intake form.
          </p>
        </div>
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

export default Page5;
