import { parseISO, isValid, format } from 'date-fns';
import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from './page_FIXED';

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
  commonFieldsData: any;
  images: any;
}

const commonFieldMapping: Record<string, string> = {
  ndisNumber: 'ndis',
  gender: 'sex',
  participantName: 'name',
  dob: 'dob',
  address: 'street',
  state: 'state',
  postcode: 'postCode',
  email: 'email',
  phone: 'phone',
};

// --- Standardized Header Component ---
const StandardHeader = ({ images, title }: { images?: any, title?: string }) => (
  <div className="flex flex-col items-center pt-6 pb-4">
    <img
      src={images?.infinityLogo || "/infinity_logo.png"}
      alt="Logo"
      width={STANDARD_LOGO.width}
      height={STANDARD_LOGO.height}
      className={STANDARD_LOGO.className}
    /> <br /><br />
    {title && (
      <h2 className={`${A4_PDF_TYPOGRAPHY.title} text-center mt-2`}>
        {title}
      </h2>
    )}
  </div>
);

// --- Standardized Footer Component ---
const Footer = ({ settings }: { settings: any }) => {
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
    <footer className={`flex-shrink-0 mt-auto flex justify-between ${A4_PDF_TYPOGRAPHY.footer} text-gray-500 pt-4 border-t border-gray-300`}>
      <div>Website: {settings?.company_website}</div>
      <div>{settings?.support_action_plan}</div>
      <div>Review Date: {formatDate(settings?.review_date)}</div>
    </footer>
  );
};

const Page1: React.FC<Props> = ({
  schema,
  data,
  settings,
  commonFieldsData,
  images,
}) => {
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
    // For participantName field, combine first name and surname to show full name
    if (key === 'participantName') {
      const firstName = commonFieldsData?.name || '';
      const surname = commonFieldsData?.surname || '';
      const fullName = [firstName, surname].filter(Boolean).join(' ').trim();
      if (fullName) {
        return fullName;
      }
      // Fallback to form data if commonFieldsData doesn't have name
      return data?.[key] || '';
    }
    
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
              <span className={A4_PDF_TYPOGRAPHY.tableCell}>
                {option}
                {option === 'Other' && showOther && otherValue && (
                  <>: <strong>{otherValue}</strong></>
                )}
              </span> &nbsp; &nbsp;
            </div>
          ))}
        </div>
      );
    }

    if (field?.type === 'textarea') {
      return (
        <pre className={`whitespace-pre-wrap ${A4_PDF_TYPOGRAPHY.tableCell} leading-relaxed`}>
          {value}
        </pre>
      );
    }

    return (
      <span className={`${A4_PDF_TYPOGRAPHY.tableCell} leading-relaxed`}>
        {value || '—'}
      </span>
    );
  };

  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full min-h-full box-border text-gray-800 font-montserrat" style={{ height: '100%', minHeight: '100%', padding: '24px' }}>
        
        <StandardHeader images={images} />

        {/* Content - made flex-1 so it takes all available space */}
        <div className="flex-1 min-h-0">
          <table className={`w-full border border-black border-collapse ${A4_PDF_TYPOGRAPHY.tableCell} leading-relaxed`}>
            {schema?.sections?.map((section, idx) => (
              <React.Fragment key={idx}>
                <thead>
                  <tr className={`${A4_PDF_TYPOGRAPHY.sectionHeader} border border-black`} style={{backgroundColor: '#a9c0e6'}}>
                    <th colSpan={2} className="text-left px-3 py-1 border border-black" style={{backgroundColor: '#a9c0e6'}}>
                      {section?.title}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {section?.fields?.map((field) => (
                    <tr key={field?.key} className="border border-black">
                      <td className={`w-[180px] ${A4_PDF_TYPOGRAPHY.label} px-3 py-1 border border-black`} style={{backgroundColor: '#e8edf8'}}>
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

        <Footer settings={settings} />
      </div>
    </A4PageWrapper>
  );
};

export default Page1;
