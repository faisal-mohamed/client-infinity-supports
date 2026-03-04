

import React from "react";
import A4PageWrapper from "./A4PageWrapper";
import { parseISO, isValid, format } from "date-fns";

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

  const formatDate = (value: string) => {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const parsed = parseISO(value);
      if (isValid(parsed)) {
        return format(parsed, "dd-MM-yyyy");
      }
    }
    return value;
  };

  const cellClass = "border border-black px-1 py-0.5 leading-none text-[10px]";

  return (
    <A4PageWrapper>
      <div
        className="flex flex-col w-full h-full px-1 pt-[1mm] pb-[1mm] text-[10px] font-sans justify-between"
        style={{ minHeight: "100%", height: "100%" }}
      >
        {/* Header */}
        <div className="flex flex-col gap-[2px]">
          {/* Logo */}
          <div className="flex justify-center">
            <img
              src={images?.infinityLogo}
              alt="Infinity Supports WA Logo"
              className="w-[100px] h-[35px] object-contain"
            />
          </div>

          {/* Title */}
          <div className="text-center font-semibold text-[11px]">
            Schedule of Support for: {[commonFieldsData?.name, commonFieldsData?.surname].filter(Boolean).join(' ') || "________________"}
          </div>

          {/* NDIS and Plan Dates */}
          <div className="flex justify-between text-[9px] px-1">
            <span>NDIS number: {commonFieldsData?.ndis || ""}</span>
            <span>
              Plan dates from: {formatDate(formData?.planDatesFrom)} - {formatDate(formData?.planDatesTo)}
            </span>
          </div>
        </div>

        {/* Table */}
        <div
          className="flex-1 flex flex-col overflow-hidden"
          style={{
            maxHeight: "210mm",
            pageBreakInside: "avoid",
            breakInside: "avoid",
          }}
        >
          <table
            className="table-fixed border border-black w-full border-collapse text-[10px]"
            style={{
              pageBreakInside: "avoid",
              breakInside: "avoid",
              height: "100%",
            }}
          >
            <thead>
              <tr>
                <th className={`${cellClass} text-left w-[40%]`}>Support Item</th>
                <th className={`${cellClass} text-center w-[10%]`}>Weeks</th>
                <th className={`${cellClass} text-center w-[15%]`}>Total Hours</th>
                <th className={`${cellClass} text-center w-[15%]`}>Cost/hour</th>
                <th className={`${cellClass} text-center w-[20%]`}>Total Cost</th>
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

        {/* Footer */}
        <div className="flex justify-between text-[9px] px-1 text-gray-600">
          <span>Website: {settings?.company_website}</span>
          <span>{settings?.schedule_of_supports}</span>
          <span>Review Date: {formatDate(settings?.review_date)}</span>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page1;
