import React from "react";
import { format, parseISO, isValid } from "date-fns";

interface PRAFooterProps {
  settings: any;
}

const PRAFooter: React.FC<PRAFooterProps> = ({ settings }) => {
  const formatDate = (value: string) => {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const parsed = parseISO(value);
      if (isValid(parsed)) {
        return format(parsed, "dd-MM-yyyy");
      }
    }
    return value || "N/A";
  };

  return (
    <div className="pt-4">
      <div className="flex justify-between text-xs px-2">
        <div>Website: {settings?.company_website}</div>
        <div>{settings?.participant_risk_assessment}</div>
        <div>Review Date: {formatDate(settings?.review_date)}</div>
      </div>
    </div>
  );
};

export default PRAFooter;


