import React from "react";
import A4PageWrapper from "./A4PageWrapper";
import { parseISO, isValid, format } from "date-fns";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from "./page_FIXED";

interface Page4Props {
  formKey?: string;
  data?: any;
  commonFieldsData?: any;
  settings?: any;
  formSchema: any;
  images?: any;
}

const commonFieldMapping: Record<string, string> = {
  name: "name",
  address: "street",
  dob: "dob",
  disability: "disability",
  ndisNumber: "ndis",
};

// --- Standardized Header Component ---
const StandardHeader = ({ images }: { images?: any }) => (
  <div className="flex flex-col gap-[2px]">
    <div className="flex justify-center">
      <img
        src={images?.infinityLogo || "/infinity_logo.png"}
        alt="Logo"
        width={STANDARD_LOGO.width}
        height={STANDARD_LOGO.height}
        className={STANDARD_LOGO.className}
      />
    </div>
    <div className={`text-center ${A4_PDF_TYPOGRAPHY.sectionHeader} mt-1`}>
      MY GOALS
    </div>
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
    <div
      className={`flex justify-between ${A4_PDF_TYPOGRAPHY.footer} px-1 text-gray-600`}
    >
      <span>{settings?.from_email || ''}</span>
      <span>{settings?.person_centre_plan_form_id || ''}</span>
      <span>Date of Report: {formatDate(settings?.review_date) || ''}</span>
    </div>
  );
};

const Page4: React.FC<Page4Props> = ({
  formSchema: schema,
  data,
  commonFieldsData,
  settings,
  images,
}) => {
  const { columns } = schema.goals;

   const formatDate = (value: string): string => {
  if (!value || typeof value !== 'string') return '';

  try {
    const parsed = parseISO(value);
    if (isValid(parsed)) {
      return format(parsed, 'dd-MM-yyyy');
    }
  } catch (e) {
    // fallback
  }

  return value; // fallback
};

  // Fixed to exactly 3 rows for goals table
  const rowCount = 3; // Always show 3 rows regardless of data
  const rowIndexes = Array.from({ length: rowCount }, (_, i) => i + 1);

  const cellClass = `border border-black px-1 py-0.5 leading-none ${A4_PDF_TYPOGRAPHY.tableCell}`;

  return (
    <A4PageWrapper>
      <div
        className="flex flex-col w-full h-full px-1 pt-[1mm] pb-[1mm] font-montserrat justify-between"
        style={{ minHeight: "100%", height: "100%" }}
      >
        <StandardHeader images={images} />

        {/* Goals Table */}
        <div
          className="flex-1 flex flex-col overflow-hidden"
          style={{
            maxHeight: "210mm",
            pageBreakInside: "avoid",
            breakInside: "avoid",
          }}
        >
          <table
            className={`table-fixed border border-black w-full border-collapse ${A4_PDF_TYPOGRAPHY.tableCell}`}
            style={{
              pageBreakInside: "avoid",
              breakInside: "avoid",
              height: "100%",
              tableLayout: "fixed",
            }}
          >
            <thead>
              <tr className="bg-gray-200">
                {columns.map((col: any, index: number) => {
                  // Define column widths for better distribution
                  let width = "16.66%"; // Default equal width
                  if (col.key === "goal") width = "25%";
                  if (col.key === "actions") width = "25%";
                  if (col.key === "rating") width = "15%";
                  if (col.key === "byWhom") width = "15%";
                  if (col.key === "byWhen") width = "10%";
                  if (col.key === "reviewDate") width = "10%";

                  return (
                    <th
                      key={col.key}
                      className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-left align-top`}
                      style={{ width, height: "40px", verticalAlign: "top" }}
                    >
                      <strong>{col.label}</strong> <br />
                      <span style={{ fontStyle: "italic" }}>
                        {col?.subLabel}
                      </span>{" "}
                      <br /> <br />
                      <span style={{ fontStyle: "italic" }}>
                        {col?.subRating?.map((r: any, index: number) => (
                          <div key={index}>
                            - {r} <br />
                          </div>
                        ))}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="h-full">
              {rowIndexes.map((rowIndex) => {
                // Calculate equal height for each row (subtract header height from available space)
                const availableHeight = "calc((100% - 40px) / 3)"; // 3 rows, minus header height

                return (
                  <tr
                    key={rowIndex}
                    className="align-top"
                    style={{ height: availableHeight }}
                  >
                    {columns.map((col: any) => {
                      const dataKey = `${col.key}${rowIndex}`;

                      const isFromCommon = dataKey in commonFieldMapping;
                      const mappedKey = isFromCommon
                        ? commonFieldMapping[dataKey]
                        : dataKey;

                      const value = isFromCommon
                        ? commonFieldsData?.[mappedKey] ?? ""
                        : data?.[mappedKey] ?? "";

                      return (
                        <td
                          key={dataKey}
                          className={`${cellClass} text-left align-top`}
                          style={{
                            height: availableHeight,
                            verticalAlign: "top",
                          }}
                        >
                          <div
                            className={`h-full ${A4_PDF_TYPOGRAPHY.body} p-1`}
                            style={{
                              minHeight: "80px",
                              lineHeight: "1.4",
                              height: "100%",
                            }}
                          >
                            {typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
  ? formatDate(value)
  : value || "\u00A0"}

                          </div>
                        </td>
                      );
                    })}
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

export default Page4;
