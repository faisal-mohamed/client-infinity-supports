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
  settings: any;
  commonFieldsData: any;
  images: any;
}

const Page3: React.FC<Props> = ({ schema, data, settings, commonFieldsData, images }) => {
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
      <div
        className="flex flex-col h-full min-h-full box-border text-[11px] text-gray-800 font-sans"
        style={{
          height: '100%',
          minHeight: '100%',
          padding: '28px', /* ~p-7 fallback */
        }}
      >
        {/* Logo and Title */}
        <div className="flex justify-center mb-2">
          <img
            src={images?.infinityLogo}
            alt="Infinity Supports WA Logo"
            className="h-[50px] w-[150px] object-contain"
          />
        </div>
        {/* <p className="text-center text-gray-600 text-xs font-semibold mb-4 ">
          {schema?.title}
        </p> */}

        {/* Main Table */}
        <form className="flex-1 min-h-0 text-[10px] leading-[2]">
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
                      <td className="border border-black font-bold p-3 align-top w-[150px] bg-[#e8edf8]">
                        {field?.label}
                      </td>
                      <td className="border border-black p-3">
                        {renderField(field)}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </form>

        {/* Sticky Footer */}
        <footer className="flex-shrink-0 mt-auto flex justify-between text-[10px] text-gray-500 pt-4 border-t border-gray-300">
          <div>Website: {settings?.company_website}</div>
          <div>{settings?.schedule_for_support}</div>
          <div>Review Date: {settings?.review_date}</div>
        </footer>
      </div>
    </A4PageWrapper>
  );
};

export default Page3;
