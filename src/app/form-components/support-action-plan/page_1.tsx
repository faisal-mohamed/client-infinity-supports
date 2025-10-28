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
  title: string;
  fields: SchemaField[];
}

interface Props {
  schema: { title: string; sections: Section[] };
  data: Record<string, any>;
  settings: any;
  commonFieldsData: any 
}

const commonFieldMapping: Record<string, string> = {
  ndisNumber: "ndis",
  gender: 'sex',
  participantName: 'name',
  dob: "dob",
  address: "street",
  state: "state",
  postcode: "postCode",
  email: "email",
  phone: "phone",
};


const Page1: React.FC<Props> = ({ schema, data, settings , commonFieldsData }) => {

  const formatDate = (value: string): string => {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const parsed = parseISO(value);
    if (isValid(parsed)) {
      return format(parsed, 'dd-MM-yyyy');
    }
  }
  return value;
};

  
const getValue = (key: string): string => {
  const raw = commonFieldMapping[key]
    ? commonFieldsData?.[commonFieldMapping[key]]
    : data?.[key];

  return formatDate(raw ?? '');
};



  const renderField = (field: SchemaField) => {
  const value = getValue(field.key);

  if (field?.type === 'multi-checkbox') {
    const showOther = value?.includes('Other');
    const otherKey = `${field.key}Other`;
    const otherValue = getValue(otherKey);

    return (
      <div className="flex gap-3 flex-wrap">
        {field?.options?.map((option) => (
          <div key={option} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={value?.includes(option)}
              readOnly
              className="w-3 h-3 accent-red-600"
            />
            <span className="text-[11px]">
              {option}
              {option === 'Other' && showOther && otherValue && (
                <>: <strong>{otherValue}</strong></>
              )}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (field?.type === 'textarea') {
    return (
      <pre className="whitespace-pre-wrap text-[11px] leading-relaxed">
        {value}
      </pre>
    );
  }

  return (
    <span className="text-[11px] leading-relaxed">
      {value || '—'}
    </span>
  );
};


  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full text-gray-800 font-sans py-6 px-6" style={{ fontSize: '11px' }}>
        {/* Logo and Title */}
        <div className="flex justify-center">
          <img
            src="/infinity_logo.png"
            alt="Infinity Supports WA Logo"
            className="h-[50px] w-[150px] object-contain"
          />
        </div>
        {/* <div className="text-center font-semibold mt-2 mb-4">
          {schema?.title}
        </div> */}

        {/* Main Table Section */}
        <div className="flex-1">
          <table className="w-full border border-black border-collapse leading-relaxed" style={{ fontSize: '11px' }}>
            {schema?.sections?.map((section, idx) => (
              <React.Fragment key={idx}>
                <thead>
                  <tr className="bg-[#a9c0e6] font-bold border border-black">
                    <th colSpan={2} className="text-left px-3 py-1 border border-black">
                      {section?.title}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {section?.fields?.map((field) => (
                    <tr key={field?.key} className="border border-black">
                      <td className="font-semibold px-3 py-1 border border-black bg-[#e8edf8]" style={{ width: '180px' }}>
                        {field?.label}
                      </td>
                      <td className="px-3 py-1 border border-black">
                        {renderField(field)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </React.Fragment>
            ))}
          </table>
        </div>

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

export default Page1;
