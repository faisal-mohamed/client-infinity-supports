import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { parseISO, isValid, format } from "date-fns";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from './page_FIXED';

interface Page2Props {
  schema: any;
  data: Record<string, string>;
  commonFieldsData: Record<string, string>;
  settings: any;
  images?: any;
}

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
      <span>{settings?.participant_risk_assessment}</span>
      <span>Review Date: {formatDate(settings?.review_date)}</span>
    </div>
  );
};

const Page2: React.FC<Page2Props> = ({ schema, data, commonFieldsData, settings, images }) => {
  const cellClass = `border border-black px-1 py-0.5 leading-none ${A4_PDF_TYPOGRAPHY.tableCell}`;

  return (
    <A4PageWrapper>
      <div className="flex flex-col w-full h-full px-1 pt-[1mm] pb-[1mm] font-montserrat justify-between" style={{ minHeight: "100%", height: "100%" }}>
        
        <StandardHeader images={images} />

        {/* Risk Assessment Table */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ maxHeight: "210mm", pageBreakInside: "avoid", breakInside: "avoid" }}>
          <table className={`table-fixed border border-black w-full border-collapse ${A4_PDF_TYPOGRAPHY.tableCell}`} style={{ pageBreakInside: "avoid", breakInside: "avoid", height: "100%" }}>
            <thead>
              <tr>
                <th className={`${cellClass} w-[20%]`}></th>
                <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-center`} colSpan={4}>
                  INDIVIDUAL RISK ASSESSMENTS
                </th>
              </tr>
              <tr className="bg-gray-300">
                <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-center`}>No.</th>
                <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-left`}>Item</th>
                <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-center w-[10%]`}>Y/N</th>
                <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-center w-[7%]`}>Risk Rating</th>
                <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-left w-[20%]`}>Comments/Controls</th>
              </tr>
            </thead>
            <tbody>
              {schema?.fields?.map?.((field: any, index: number) => {
                const key = `risk${index + 1}`;
                const yesChecked = data?.[key] === 'Yes';
                const noChecked = data?.[key] === 'No';

                return (
                  <tr key={key} className="align-top" style={{ minHeight: '50px' }}>
                    <td className={`${cellClass} text-center align-top`} style={{ minHeight: '50px' }}>
                      {index + 1}
                    </td>
                    <td className={`${cellClass} text-left align-top`} style={{ minHeight: '50px' }}>
                      <div className={A4_PDF_TYPOGRAPHY.body}>{field?.label}</div>
                    </td>
                    <td className={`${cellClass} text-center align-top`} style={{ minHeight: '50px' }}>
                      <div className="flex flex-col items-start gap-1">
                        <label className="inline-flex items-center space-x-1">
                          <input
                            type="checkbox"
                            checked={yesChecked}
                            readOnly
                            className="w-3 h-3"
                          />
                          <span className={A4_PDF_TYPOGRAPHY.small}>YES</span>
                        </label>
                        <label className="inline-flex items-center space-x-1">
                          <input
                            type="checkbox"
                            checked={noChecked}
                            readOnly
                            className="w-3 h-3"
                          />
                          <span className={A4_PDF_TYPOGRAPHY.small}>NO</span>
                        </label>
                      </div>
                    </td>
                    <td className={`${cellClass} text-center align-top`} style={{ minHeight: '50px' }}>
                      <div className={A4_PDF_TYPOGRAPHY.body}>
                        {data?.[`${key}Rating`] ?? ''}
                      </div>
                    </td>
                    <td className={`${cellClass} text-left align-top`} style={{ minHeight: '50px' }}>
                      <div className={A4_PDF_TYPOGRAPHY.body}>
                        {field?.commentLabel ? `${field?.commentLabel}: ` : ''}
                        {data?.[`${key}Comment`] ?? ''}
                      </div>
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
