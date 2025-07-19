import React from 'react';
import A4PageWrapper from './A4PageWrapper';

interface SchemaField {
  key: string;
  label: string;
  type: string;
  options?: string[];
}

interface Section {
  title?: string;
  fields: SchemaField[];
}

interface Props {
  schema: { title: string; sections: Section[] };
  data: Record<string, any>;
}

const Page3: React.FC<Props> = ({ schema, data }) => {
  const renderField = (field: SchemaField) => {
    const value = data?.[field?.key];

    if (field?.type === 'checkbox-group') {
      return (
        <div className="flex items-center gap-3 flex-wrap leading-[2]">
          {field?.options?.map?.((option) => (
            <div key={option} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={value === option}
                readOnly
                className="w-3 h-3 accent-red-600"
              />
              <span className="text-[11px]">{option}</span>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="whitespace-pre-wrap text-[11px] leading-[2]">
        {value || '—'}
      </div>
    );
  };

  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full text-[11px] text-gray-800 font-sans p-7">
        {/* Logo and Title */}
        <div className="flex justify-center mb-2">
          <img
            src="https://storage.googleapis.com/a1aa/image/2af8a3a8-cf34-44da-3c35-1f5f4a53c6ec.jpg"
            alt="Infinity Supports WA Logo"
            className="h-[50px] w-[150px] object-contain"
          />
        </div>
        <p className="text-center text-gray-600 text-xs font-semibold mb-4 ">
          {schema?.title}
        </p>

        {/* Main Table */}
        <form className="text-[10px] leading-[2] flex-1">
          <table className="w-full border-collapse border border-black">
            <tbody>
              {schema?.sections?.map?.((section, sectionIdx) => (
                <React.Fragment key={sectionIdx}>
                  {section?.title && (
                    <tr className="bg-blue-300 font-bold text-[9px] ">
                      <td colSpan={2} className="border border-black p-1 bg-[#a9c1e0]">
                        {section?.title}
                      </td>
                    </tr>
                  )}
                  {section?.fields?.map?.((field) => (
                    <tr key={field?.key}>
                      <td className="border border-black font-bold p-1 align-top w-[150px] bg-[#e8edf8]">
                        {field?.label}
                      </td>
                      <td className="border border-black p-1">
                        {renderField(field)}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </form>

        {/* Footer */}
        <div className="flex justify-between text-[9px] text-gray-600 mt-4 px-1">
          <div>Website: infinitysupportswa.org</div>
          <div>CF006</div>
          <div>Review Date: 14/03/2026</div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page3;
