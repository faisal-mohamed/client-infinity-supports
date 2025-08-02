import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { parseISO, isValid, format } from "date-fns";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from './page_FIXED';

interface Page5Props {
  formKey?: string;
  data?: any;
  commonFieldsData?: any;
  settings?: any;
  formSchema: any;
  images?: any;
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
      <span>Website: {settings?.company_website}</span>
      <span>{settings?.person_centre_plan_form_id}</span>
      <span>Review Date: {formatDate(settings?.review_date)}</span>
    </div>
  );
};

const Page5: React.FC<Page5Props> = ({ formSchema: schema, data, commonFieldsData, settings, images }) => {
  const { fields, informalSupports } = schema;
  const rowIndexes = Array.from({ length: informalSupports.rows }, (_, i) => i + 1);

  const cellClass = `border border-black px-1 py-0.5 leading-none ${A4_PDF_TYPOGRAPHY.tableCell}`;

  return (
    <A4PageWrapper>
      <div className="flex flex-col w-full h-full px-1 pt-[1mm] pb-[1mm] font-montserrat justify-between" style={{ minHeight: "100%", height: "100%" }}>
        
        <StandardHeader images={images} />

        {/* Content area */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ maxHeight: "210mm", pageBreakInside: "avoid", breakInside: "avoid" }}>
          
          {/* First Table */}
          <div className="mb-2">
            <table className={`table-fixed border border-black w-full border-collapse ${A4_PDF_TYPOGRAPHY.tableCell}`}>
              <tbody>
                {fields.map((field: any) => {
                  const isFromCommon = field.key in commonFieldMapping;
                  const valueKey = isFromCommon ? commonFieldMapping[field.key] : field.key;
                  const value = isFromCommon
                    ? commonFieldsData?.[valueKey] ?? ''
                    : data?.[valueKey] ?? '';

                  return (
                    <tr key={field.key}>
                      <td
                        className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-left bg-gray-50 font-medium`}
                        style={{ width: '50%' }}
                      >
                        {field.label}
                      </td>
                      <td className={`${cellClass} text-left`}>
                        <div className={A4_PDF_TYPOGRAPHY.body}>{value}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Informal Supports Section */}
          <div className="mb-3">
            <p className={`${A4_PDF_TYPOGRAPHY.subHeader} mb-2 font-bold`}>My Informal Supports:</p>
            <table className={`table-fixed border border-black w-full border-collapse ${A4_PDF_TYPOGRAPHY.tableCell}`} style={{ tableLayout: 'fixed' }}>
              <thead>
                <tr className="bg-gray-300 text-center">
                  {informalSupports.columns.map((col: any) => (
                    <th
                      key={col.key}
                      className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-center`}
                      style={{ height: '40px' }}
                    >
                      {col.label.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rowIndexes.map((rowIndex) => (
                  <tr key={rowIndex} className="align-top" style={{ minHeight: '60px' }}>
                    {informalSupports.columns.map((col: any) => {
                      const dataKey = `${col.key}${rowIndex}`;
                      return (
                        <td
                          key={dataKey}
                          className={`${cellClass} text-left align-top`}
                          style={{ minHeight: '60px', height: '60px', verticalAlign: 'top' }}
                        >
                          <div className={`min-h-[60px] ${A4_PDF_TYPOGRAPHY.body} p-1`} style={{ minHeight: '60px', lineHeight: '1.4' }}>
                            {data?.[dataKey] ?? ''}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Text */}
          <div className="mt-2">
            <p className={A4_PDF_TYPOGRAPHY.body}>
              This plan has been developed during the client intake meeting in conjunction with{' '}
              <span className="inline-block border-b border-black min-w-[100px] text-center px-1">
                {
                  commonFieldMapping['name']
                    ? commonFieldsData?.[commonFieldMapping['name']] ?? ''
                    : data?.name ?? ''
                }
              </span>{' '}
              and people in the family network, supporters and from information gathered on the
              client intake form.
            </p>
          </div>
        </div>

        <Footer settings={settings} />
      </div>
    </A4PageWrapper>
  );
};

export default Page5;
