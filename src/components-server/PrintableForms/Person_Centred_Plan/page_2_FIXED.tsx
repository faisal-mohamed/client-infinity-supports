import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { parseISO, isValid, format } from "date-fns";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from './page_FIXED';

interface PageProps {
  formKey?: string;
  data?: any;
  commonFieldsData?: any;
  settings?: any;
  formSchema: any;
  images?: Record<string, string>;
}

const commonFieldMapping: Record<string, string> = {
  name: 'name',
  address: 'street',
  dob: 'dob',
  disability: 'disability',
  ndisNumber: 'ndis'
};

// --- Standardized Header Component ---
const StandardHeader = ({ images }: { images?: any }) => (
  <div className="flex justify-center">
    <img
      src={images?.infinityLogo || "/infinity_logo.png"}
      alt="Logo"
      width={STANDARD_LOGO.width}
      height={STANDARD_LOGO.height}
      className={STANDARD_LOGO.className}
    />
  </div>
);

// --- Standardized Footer Component ---
const Footer = ({ settings }: { settings: any }) => {
  const formatDate = (value: string) => {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const parsed = parseISO(value);
      if (isValid(parsed)) {
        return format(parsed, "dd-MM-yyyy");
      }
    }
    return value;
  };

  return (
    <div className={`flex justify-between ${A4_PDF_TYPOGRAPHY.footer} px-1 text-gray-600`}>
      <span>{settings?.from_email || ''}</span>
      <span>{settings?.person_centre_plan_form_id || ''}</span>
      <span>Date of Report: {formatDate(settings?.review_date) || ''}</span>
    </div>
  );
};

const Page2: React.FC<PageProps> = ({ formSchema: schema, data, commonFieldsData, settings, images }) => {
  const cellClass = `border border-black px-1 py-0.5 leading-none ${A4_PDF_TYPOGRAPHY.tableCell}`;

  return (
    <A4PageWrapper>
      <div className="flex flex-col w-full h-full px-1 pt-[1mm] pb-[1mm] font-montserrat justify-between" style={{ minHeight: "100%", height: "100%" }}>
        
        <StandardHeader images={images} />

        {/* Table - takes up remaining space */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ maxHeight: "210mm", pageBreakInside: "avoid", breakInside: "avoid" }}>
          <table className={`table-fixed border border-black w-full border-collapse ${A4_PDF_TYPOGRAPHY.tableCell}`} style={{ pageBreakInside: "avoid", breakInside: "avoid", height: "100%" }}>
            <tbody className="h-full">
              {schema.fields.map((field: any, index: number) => {
                const isFromCommon = field.key in commonFieldMapping;
                const valueKey = isFromCommon ? commonFieldMapping[field.key] : field.key;
                const value = isFromCommon
                  ? commonFieldsData?.[valueKey] ?? ''
                  : data?.[valueKey] ?? '';

                return (
                  <tr key={field.key} className="align-top">
                    <td
                      className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-left bg-gray-50 font-medium`}
                      style={{
                        width: '30%',
                        height: field.height || 'auto',
                      }}
                    >
                      {field.label}
                    </td>
                    <td
                      className={`${cellClass} text-left`}
                      style={{
                        height: field.height || 'auto',
                      }}
                    >
                      {field.type === 'textarea' ? (
                        <div className={`whitespace-pre-wrap ${A4_PDF_TYPOGRAPHY.body}`}>
                          {value}
                        </div>
                      ) : (
                        <div className={A4_PDF_TYPOGRAPHY.body}>{value}</div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Footer settings={settings} />
      </div>
    </A4PageWrapper>
  );
};

export default Page2;
