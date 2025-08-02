import React from "react";
import A4PageWrapper from "./A4PageWrapper";
import { parseISO, isValid, format } from "date-fns";

interface SupportItem {
  description: string;
  cost: string;
  isSpecial?: boolean;
  key: string;
}

interface Page1Props {
  formData: Record<string, any>;
  schema: {
    tableRows: SupportItem[];
  };
  commonFieldsData: any;
  settings: any;
}

const Page1: React.FC<Page1Props> = ({ formData, schema, commonFieldsData, settings } : any) => {
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


  const cellClass = "border border-black px-1 py-2 leading-relaxed text-xs";

  return (
    <A4PageWrapper>
      <div className="w-full h-full flex flex-col px-6 pt-6 pb-2 text-xs font-sans">
        {/* Logo */}
        <div className="flex justify-center mb-2">
          <img
            src="/infinity_logo.png"
            alt="Infinity Supports WA Logo"
            className="w-[200px] h-[70px] object-contain"
          />
        </div>

        {/* Title */}
        <div className="text-center font-semibold text-xs mb-4">
          Schedule of Support for: {commonFieldsData?.name || "________________"}
        </div>

        {/* NDIS & Plan Dates */}
        <div className="flex justify-between text-xs mb-2 px-2">
          <span>NDIS number: {commonFieldsData?.ndis || ""}</span>
          <span>
  Plan dates from: {formatDate(formData?.planDatesFrom)} - {formatDate(formData?.planDatesTo)}
</span>

        </div>

        {/* Table container - fills remaining height */}
        <div className="flex-1 flex flex-col">
          <table className="table-fixed border border-black w-full text-xs border-collapse">
            <thead>
              <tr>
                <th className={`${cellClass} text-left w-[40%]`}>
                  Support Item
                </th>
                <th className={`${cellClass} text-center w-[10%]`}>Weeks</th>
                <th className={`${cellClass} text-center w-[15%]`}>
                  Total Hours
                </th>
                <th className={`${cellClass} text-center w-[15%]`}>
                  Cost per hr
                </th>
                <th className={`${cellClass} text-center w-[20%]`}>
                  Total Cost
                </th>
              </tr>
            </thead>
            <tbody className="align-top">
              {schema?.tableRows?.map((item: any, index : any ) => {
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
                    <td className={`${cellClass} text-left`}>
                      {item?.description}
                    </td>
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

        {/* Footer - always sticks to bottom */}
        <div className="flex justify-between text-xs px-2 text-gray-600">
          <span>Website: {settings?.company_website}</span>
          <span>{settings?.schedule_of_supports}</span>
<span>Review Date: {formatDate(settings?.review_date)}</span>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page1;
