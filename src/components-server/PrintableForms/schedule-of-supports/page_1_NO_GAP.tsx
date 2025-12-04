import React from "react";
import A4PageWrapper from "./A4PageWrapper";
import { parseISO, isValid, format } from "date-fns";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from './page_FIXED';

interface SupportItem {
  description: string;
  cost: string;
  isSpecial?: boolean;
  isPerKm?: boolean;
  key: string;
}

interface Page1Props {
  formData: Record<string, any>;
  schema: {
    tableRows: SupportItem[];
  };
  commonFieldsData: any;
  settings: any;
  images: any;
}

const MAX_ROWS = 18;

// Ultra-compact typography for maximum space efficiency
const COMPACT_TYPOGRAPHY = {
  tableHeader: 'text-[7px] font-bold font-montserrat leading-none',
  tableCell: 'text-[7px] font-normal font-montserrat leading-none',
  small: 'text-[7px] font-normal font-montserrat leading-none',
  sectionHeader: 'text-[9px] font-semibold font-montserrat leading-none',
};

const Page1NoGap: React.FC<Page1Props> = ({
  formData,
  schema,
  commonFieldsData,
  settings,
  images,
}) => {
  const getCostNumber = (cost: string) => {
    const parsed = parseFloat(cost?.replace(/[^0-9.]/g, "") || "");
    return isNaN(parsed) ? 0 : parsed;
  };

  const formatDate = (value: string) => {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const parsed = parseISO(value);
      if (isValid(parsed)) {
        return format(parsed, "dd-MM-yyyy");
      }
    }
    return value;
  };

  // Ultra-compact cell styling
  const cellClass = `border border-black px-0.5 py-0 leading-none ${COMPACT_TYPOGRAPHY.tableCell}`;
  const headerClass = `border border-black px-0.5 py-0.5 leading-none ${COMPACT_TYPOGRAPHY.tableHeader}`;

  // Calculate exact heights
  const logoHeight = 25; // mm
  const titleHeight = 6; // mm  
  const ndisHeight = 4; // mm
  const footerHeight = 6; // mm
  const totalHeaderHeight = logoHeight + titleHeight + ndisHeight; // 35mm
  
  const availableTableHeight = 297 - 8 - totalHeaderHeight - footerHeight; // 248mm
  const tableHeaderHeight = 8; // mm
  const bodyHeight = availableTableHeight - tableHeaderHeight; // 240mm
  const rowHeight = bodyHeight / MAX_ROWS; // ~13.33mm per row

  return (
    <A4PageWrapper>
      <div className="w-full h-full font-montserrat" 
           style={{ 
             height: "297mm", 
             padding: "4mm 2mm 2mm 2mm",
             display: "block" // Remove flexbox completely
           }}>
        
        {/* Header - No margins/padding between elements */}
        <div style={{ height: `${logoHeight}mm`, marginBottom: "0" }}>
          <div className="flex justify-center">
            <img
              src={images?.infinityLogo || "/infinity_logo.png"}
              alt="Logo"
              width={140}
              height={56}
              className="object-contain"
            />
          </div>
        </div>

        <div style={{ height: `${titleHeight}mm`, marginBottom: "0" }}>
          <div className={`text-center ${COMPACT_TYPOGRAPHY.sectionHeader}`}>
            Schedule of Support for: {[commonFieldsData?.name, commonFieldsData?.surname].filter(Boolean).join(' ') || "________________"}
          </div>
        </div>

        <div style={{ height: `${ndisHeight}mm`, marginBottom: "0" }}>
          <div className={`flex justify-between ${COMPACT_TYPOGRAPHY.small} px-1`}>
            <span>NDIS number: {commonFieldsData?.ndis || ""}</span>
            <span>
              Plan dates from: {formatDate(formData?.planDatesFrom)} - {formatDate(formData?.planDatesTo)}
            </span>
          </div>
        </div>

        {/* Table - Immediately after header with no gap */}
        <div style={{ 
          height: `${availableTableHeight}mm`,
          marginTop: "0",
          paddingTop: "0"
        }}>
          <table className="table-fixed border border-black w-full border-collapse" 
                 style={{ 
                   height: "100%", 
                   tableLayout: "fixed",
                   marginTop: "0",
                   borderSpacing: "0"
                 }}>
            <thead>
              <tr style={{ height: `${tableHeaderHeight}mm` }}>
                <th className={`${headerClass} text-left w-[42%]`}>Support Item</th>
                <th className={`${headerClass} text-center w-[8%]`}>Weeks</th>
                <th className={`${headerClass} text-center w-[12%]`}>Hours</th>
                <th className={`${headerClass} text-center w-[18%]`}>Cost/hr</th>
                <th className={`${headerClass} text-center w-[20%]`}>Total</th>
              </tr>
            </thead>
            <tbody>
              {schema?.tableRows?.slice(0, MAX_ROWS).map((item, index) => {
                const key = item?.key || `row${index}`;
                const weeks = formData?.[`${key}_weeks`] || "";
                const totalHours = formData?.[`${key}_totalHours`] || "";
                const totalKms = formData?.[`${key}_totalKms`] || "";

                let totalCost = "";
                if (item?.isPerKm) {
                  const kms = parseFloat(totalKms);
                  if (!isNaN(kms)) {
                    totalCost = `$${(kms * getCostNumber(item?.cost || "")).toFixed(2)}`;
                  } else {
                    totalCost = "As required";
                  }
                } else {
                  const costPerHour = getCostNumber(item?.cost || "");
                  const hoursNum = parseFloat(totalHours);
                  if (!isNaN(hoursNum)) {
                    totalCost = `$${(hoursNum * costPerHour).toFixed(2)}`;
                  }
                }

                return (
                  <tr key={key} style={{ height: `${rowHeight}mm` }}>
                    <td className={`${cellClass} text-left align-top`} 
                        style={{ 
                          wordBreak: "break-word", 
                          fontSize: "6px",
                          lineHeight: "1.1",
                          verticalAlign: "top"
                        }}>
                      {item?.description}
                    </td>
                    <td className={`${cellClass} text-center align-middle`} 
                        style={{ verticalAlign: "middle" }}>
                      {weeks}
                    </td>
                    <td className={`${cellClass} text-center align-middle`}
                        style={{ verticalAlign: "middle" }}>
                      {totalHours}
                    </td>
                    <td className={`${cellClass} text-right align-middle`} 
                        style={{ fontSize: "6px", verticalAlign: "middle" }}>
                      {item?.cost}
                    </td>
                    <td className={`${cellClass} text-right align-middle`} 
                        style={{ fontSize: "6px", verticalAlign: "middle" }}>
                      {totalCost}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer - Fixed at bottom */}
        <div style={{ 
          height: `${footerHeight}mm`,
          marginTop: "0"
        }}>
          <div className={`flex justify-between ${COMPACT_TYPOGRAPHY.small} px-1 text-gray-600`}>
            <span>Website: {settings?.company_website}</span>
            <span>{settings?.schedule_of_supports}</span>
            <span>Review Date: {formatDate(settings?.review_date)}</span>
          </div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page1NoGap;
