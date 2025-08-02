import React from "react";
import A4PageWrapper from "./A4PageWrapper";
import { parseISO, isValid, format } from "date-fns";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from './page_FIXED';

interface Page8Props {
  schema: any;
  data: any;
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

const Page8: React.FC<Page8Props> = ({ schema, data, commonFieldsData, settings, images }) => {
  const rows = schema?.riskRows?.slice?.(4) || []; // Rows 5 to 10

  const cellClass = `border border-black px-2 py-2 ${A4_PDF_TYPOGRAPHY.tableCell}`;

  return (
    <A4PageWrapper>
      <div className="flex flex-col w-full h-full px-6 pt-[1mm] pb-[1mm] font-montserrat justify-between" style={{ minHeight: "100%", height: "100%" }}>
        
        <StandardHeader images={images} /> <br /><br />

        {/* Content Area */}
        <div className="flex-1 flex flex-col" style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
          
          {/* Risk Assessment Table - Continuation (Rows 5-10) */}
          <div className="flex-1">
            <table className={`table-fixed border border-black w-full border-collapse ${A4_PDF_TYPOGRAPHY.tableCell}`} style={{ height: "100%" }}>
              <thead>
                <tr className="bg-gray-300">
                  <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-left w-1/4`}>
                    Issue/Task
                  </th>
                  <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-left w-1/6`}>
                    Risk Score
                  </th>
                  <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-left w-1/3`}>
                    Control Measure
                  </th>
                  <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-left w-1/4`}>
                    Person Responsible
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows?.map?.((row: any, i: number) => (
                  <tr key={i} className="align-top" style={{ height: "80px" }}>
                    <td className={`${cellClass} align-top`} style={{ minHeight: "80px" }}>
                      <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                        {data?.[row?.issue] ?? ""}
                      </div>
                    </td>
                    <td className={`${cellClass} align-top`} style={{ minHeight: "80px" }}>
                      <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                        {data?.[row?.score] ?? ""}
                      </div>
                    </td>
                    <td className={`${cellClass} align-top`} style={{ minHeight: "80px" }}>
                      <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                        {data?.[row?.control] ?? ""}
                      </div>
                    </td>
                    <td className={`${cellClass} align-top`} style={{ minHeight: "80px" }}>
                      <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                        {data?.[row?.person] ?? ""}
                      </div>
                    </td>
                  </tr>
                ))}
                
                {/* Fill remaining rows if less than 6 (to make total 10 rows across pages 7-8) */}
                {Array.from({ length: Math.max(0, 6 - rows.length) }).map((_, i) => (
                  <tr key={`empty-${i}`} className="align-top" style={{ height: "80px" }}>
                    <td className={`${cellClass} align-top`} style={{ minHeight: "80px" }}>
                      <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}></div>
                    </td>
                    <td className={`${cellClass} align-top`} style={{ minHeight: "80px" }}>
                      <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}></div>
                    </td>
                    <td className={`${cellClass} align-top`} style={{ minHeight: "80px" }}>
                      <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}></div>
                    </td>
                    <td className={`${cellClass} align-top`} style={{ minHeight: "80px" }}>
                      <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Footer settings={settings} />
      </div>
    </A4PageWrapper>
  );
};

export default Page8;
