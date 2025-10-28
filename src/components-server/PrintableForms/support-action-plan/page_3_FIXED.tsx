import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { parseISO, isValid, format } from 'date-fns';
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from './page_FIXED';

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

const Page3: React.FC<Props> = ({ schema, data, settings, commonFieldsData, images }) => {
  const renderField = (field: SchemaField) => {
    const value = data?.[field?.key];

    if (field?.type === 'checkbox-yes-no') {
      return (
        <div className="flex gap-6">
          <label className="flex items-center gap-1">
            <span className={A4_PDF_TYPOGRAPHY.tableCell}>Yes</span>
            <input
              type="checkbox"
              checked={value === 'Yes'}
              readOnly
              className="w-3 h-3 accent-red-600"
            />
          </label>
          <label className="flex items-center gap-1">
            <span className={A4_PDF_TYPOGRAPHY.tableCell}>No</span>
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
              <span className={A4_PDF_TYPOGRAPHY.tableCell}>{option}</span>
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
              <span className={A4_PDF_TYPOGRAPHY.tableCell}>{option}</span>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className={`whitespace-pre-wrap ${A4_PDF_TYPOGRAPHY.tableCell} leading-[2]`}>
        {value || '—'}
      </div>
    );
  };

  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full min-h-full box-border text-gray-800 font-montserrat" style={{ height: '100%', minHeight: '100%', padding: '28px' }}>
        
        <StandardHeader images={images} />

        {/* Main Table */}
        <form className={`flex-1 min-h-0 ${A4_PDF_TYPOGRAPHY.tableCell} leading-[2]`}>
          <table className="w-full border-collapse border border-black">
            <tbody>
              {schema?.sections?.map?.((section, sectionIdx) => (
                <React.Fragment key={sectionIdx}>
                  {section?.title && (
                    <tr className={`${A4_PDF_TYPOGRAPHY.sectionHeader}`}>
                      <td colSpan={2} className="border border-black p-1" style={{backgroundColor: '#a9c1e0'}}>
                        {section?.title}
                      </td>
                    </tr>
                  )}
                  {section?.fields?.map?.((field) => (
                    <tr key={field?.key}>
                      <td className={`border border-black ${A4_PDF_TYPOGRAPHY.label} p-1 align-top w-[150px]`} style={{backgroundColor: '#e8edf8'}}>
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

        <Footer settings={settings} />
      </div>
    </A4PageWrapper>
  );
};

export default Page3;
