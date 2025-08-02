import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { parseISO, isValid, format } from 'date-fns';

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
}

const Page3: React.FC<Props> = ({ schema, data, settings, commonFieldsData }) => {
  const renderField = (field: SchemaField) => {
  const value = data?.[field?.key];

  
  

  if (field?.type === 'checkbox-yes-no') {
    return (
      <div className="flex gap-6">
        <label className="flex items-center gap-1">
          <span>Yes</span>
          <input
            type="checkbox"
            checked={value === 'Yes'}
            readOnly
            className="w-3 h-3 accent-red-600"
          />
        </label>
        <label className="flex items-center gap-1">
          <span>No</span>
          <input
            type="checkbox"
            checked={value === 'No'}
            readOnly
            className="w-3 h-3 accent-red-600"
          />
        </label>
      </div>
    );
  }

  if (field?.type === 'checkbox-dual') {
    return (
      <div className="flex gap-6 flex-wrap">
        {field?.options?.map((option) => (
          <label key={option} className="flex items-center gap-1">
            <span>{option}</span>
            <input
              type="checkbox"
              checked={value === option}
              readOnly
              className="w-3 h-3 accent-red-600"
            />
          </label>
        ))}
      </div>
    );
  }

  if (field?.type === 'checkbox-group') {
    return (
      <div className="flex items-center gap-3 flex-wrap leading-[2]">
        {field?.options?.map?.((option) => (
          <div key={option} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={Array.isArray(value) ? value.includes(option) : value === option}
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

const formatDate = (value: string): string => {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const parsed = parseISO(value);
      if (isValid(parsed)) {
        return format(parsed, 'dd-MM-yyyy');
      }
    }
    return value;
  };
  

  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full text-[11px] text-gray-800 font-sans p-7">
        {/* Logo and Title */}
        <div className="flex justify-center mb-2">
           <img
            src="/infinity_logo.png"
            alt="Infinity Supports WA Logo"
            className="h-[50px] w-[150px] object-contain"
          />
        </div>
        {/* <p className="text-center text-gray-600 text-[11px] font-semibold mb-4 ">
          {schema?.title}
        </p> */}

        {/* Main Table */}
        <form className="text-[11px] leading-[2] flex-1">
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

        {/* Footer */}
         <footer className="mt-auto flex justify-between text-[11px] text-gray-500 pt-4">
          <div>Website: {settings?.company_website}</div>
          <div>{settings?.support_action_plan}</div>
<div>Review Date: {formatDate(settings?.review_date)}</div>
        </footer>
      </div>
    </A4PageWrapper>
  );
};

export default Page3;
