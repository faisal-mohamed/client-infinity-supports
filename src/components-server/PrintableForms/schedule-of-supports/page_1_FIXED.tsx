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

const MAX_ROWS = 16;

// --- Standardized Header Component ---
const StandardHeader = ({ images, title, commonFieldsData, formData }: { 
  images?: any, 
  title?: string,
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
    <div className="flex flex-col gap-[2px]">
      {/* Logo */}
      <div className="flex justify-center">
        <img
          src={images?.infinityLogo || "/infinity_logo.png"}
          alt="Logo"
          width={STANDARD_LOGO.width}
          height={STANDARD_LOGO.height}
          className={STANDARD_LOGO.className}
        />
      </div>  <br /><br />

      {/* Title */}
      <div className={`text-center ${A4_PDF_TYPOGRAPHY.sectionHeader}`}>
        Schedule of Support for: {commonFieldsData?.name || "________________"}
      </div>

      {/* NDIS and Plan Dates */}
      <div className={`flex justify-between ${A4_PDF_TYPOGRAPHY.small} px-1`}>
        <span>NDIS number: {commonFieldsData?.ndis || ""}</span>
        <span>
          Plan dates from: {formatDate(formData?.planDatesFrom)} - {formatDate(formData?.planDatesTo)}
        </span>
      </div>
    </div>
  );
};

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
      <span>{settings?.schedule_of_supports}</span>
      <span>Review Date: {formatDate(settings?.review_date)}</span>
    </div>
  );
};

const Page1: React.FC<Page1Props> = ({
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

  const cellClass = `border border-black px-1 py-0.5 leading-none ${A4_PDF_TYPOGRAPHY.tableCell}`;

  return (
    <A4PageWrapper>
      <div className="flex flex-col w-full h-full px-1 pt-[1mm] pb-[1mm] font-montserrat justify-between" style={{ minHeight: "100%", height: "100%" }}>
        
        <StandardHeader 
          images={images} 
          commonFieldsData={commonFieldsData} 
          formData={formData} 
        />

        {/* Table */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ maxHeight: "210mm", pageBreakInside: "avoid", breakInside: "avoid" }}>
          <table className={`table-fixed border border-black w-full border-collapse ${A4_PDF_TYPOGRAPHY.tableCell}`} style={{ pageBreakInside: "avoid", breakInside: "avoid", height: "100%" }}>
            <thead>
              <tr>
                <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-left w-[40%]`}>Support Item</th>
                <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-center w-[10%]`}>Weeks</th>
                <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-center w-[15%]`}>Total Hours</th>
                <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-center w-[15%]`}>Cost per hr</th>
                <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-center w-[20%]`}>Total Cost</th>
              </tr>
            </thead>
            <tbody style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
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
                  <tr key={key}>
                    <td className={`${cellClass} text-left`}>{item?.description}</td>
                    <td className={`${cellClass} text-center`}>{weeks}</td>
                    <td className={`${cellClass} text-center`}>{totalHours}</td>
                    <td className={`${cellClass} text-right`}>{item?.cost}</td>
                    <td className={`${cellClass} text-right`}>{totalCost}</td>
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

export default Page1;
