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

// Compact Header Component
const CompactHeader = ({ images, commonFieldsData, formData }: { 
  images?: any, 
  commonFieldsData?: any,
  formData?: any
}) => {
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
    <div className="flex flex-col" style={{ height: "35mm" }}>
      {/* Logo - Smaller */}
      <div className="flex justify-center">
        <img
          src={images?.infinityLogo || "/infinity_logo.png"}
          alt="Logo"
          width={140} // Reduced from 180
          height={56}  // Reduced from 72
          className="object-contain"
        />
      </div> 

      {/* Title */}
      <div className={`text-center ${COMPACT_TYPOGRAPHY.sectionHeader}`}>
        Schedule of Support for: {[commonFieldsData?.name, commonFieldsData?.surname].filter(Boolean).join(' ') || "________________"}
      </div>

      {/* NDIS and Plan Dates */}
      <div className={`flex justify-between ${COMPACT_TYPOGRAPHY.small} px-1`}>
        <span>NDIS number: {commonFieldsData?.ndis || ""}</span>
        <span>
          Plan dates from: {formatDate(formData?.planDatesFrom)} - {formatDate(formData?.planDatesTo)}
        </span>
      </div>
    </div>
  );
};

// Compact Footer Component
const CompactFooter = ({ settings }: { settings: any }) => {
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
    <div className={`flex justify-between ${COMPACT_TYPOGRAPHY.small} px-1 text-gray-600`} 
         style={{ height: "8mm" }}>
      <span>Website: {settings?.company_website}</span>
      <span>{settings?.schedule_of_supports}</span>
      <span>Review Date: {formatDate(settings?.review_date)}</span>
    </div>
  );
};

const Page1Compact: React.FC<Page1Props> = ({
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

  // Ultra-compact cell styling
  const cellClass = `border border-black px-0.5 py-0 leading-none ${COMPACT_TYPOGRAPHY.tableCell}`;
  const headerClass = `border border-black px-0.5 py-0 leading-none ${COMPACT_TYPOGRAPHY.tableHeader}`;

  // Calculate exact row height to fit all 18 rows
  // A4 = 297mm, padding = 4mm (2mm top + 2mm bottom), so usable = 289mm
  const totalUsableHeight = 289; // 297mm - 4mm padding
  const headerHeight = 35; // mm (logo + title + ndis info)
  const footerHeight = 8; // mm
  const tableHeaderHeight = 8; // mm
  
  const availableTableHeight = totalUsableHeight - headerHeight - footerHeight; // 246mm
  const bodyHeight = availableTableHeight - tableHeaderHeight; // 238mm
  const rowHeight = bodyHeight / MAX_ROWS; // ~13.22mm per row

  return (
    <A4PageWrapper>
      <div className="flex flex-col w-full h-full font-montserrat" 
           style={{ height: "297mm", padding: "2mm" }}>
        
        <CompactHeader 
          images={images} 
          commonFieldsData={commonFieldsData} 
          formData={formData} 
        />

        {/* Ultra-Compact Table */}
        <div className="flex-1" style={{ height: `${availableTableHeight}mm` }}>
          <table className="table-fixed border border-black w-full border-collapse" 
                 style={{ height: "100%", tableLayout: "fixed" }}>
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
                          fontSize: "9px",
                          lineHeight: "1.1"
                        }}>
                      {item?.description}
                    </td>
                    <td className={`${cellClass} text-center align-middle`}>{weeks}</td>
                    <td className={`${cellClass} text-center align-middle`}>{totalHours}</td>
                    <td className={`${cellClass} text-right align-middle`} 
                        style={{ fontSize: "9px" }}>
                      {item?.cost}
                    </td>
                    <td className={`${cellClass} text-right align-middle`} 
                        style={{ fontSize: "9px" }}>
                      {totalCost}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* <CompactFooter settings={settings} /> */}
      </div>
    </A4PageWrapper>
  );
};

export default Page1Compact;
