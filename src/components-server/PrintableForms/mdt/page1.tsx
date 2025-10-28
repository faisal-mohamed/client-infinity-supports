
import React from "react";
import A4PageWrapper from "./A4PageWrapper";

import { format, parseISO, isValid } from "date-fns";


interface Field {
  key: string;
  label: string;
}
interface Props {
  schema: { title: string; fields: Field[] };
  data: Record<string, any>;
  commonFieldsData: Record<string, any>;
  settings: {
    company_website: string;
    multi_disciplinary_meeting: string;
    review_date: string;
  };
  images: any;
}

const commonFieldMapping: Record<string, string> = {
  clientName: "name",
  address: "street",
  dob: "dob",
  disability: "disability",
  phoneNumber: "phone",
  ndisNumber: "ndis",
  state: "state",
  street: "street",
  postcode: "postCode",
  email: "email",
  homePhone: "phone",
  sex: "sex",
};

const Page1: React.FC<Props> = ({
  schema,
  data,
  commonFieldsData,
  settings,
  images,
}) => {
   const getValue = (key: string): string => {
    const rawValue = commonFieldMapping[key]
      ? commonFieldsData?.[commonFieldMapping[key]]
      : data?.[key];
  
    // ✅ Format YYYY-MM-DD to DD-MM-YYYY if applicable
    if (typeof rawValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
      const parsed = parseISO(rawValue);
      if (isValid(parsed)) {
        return format(parsed, "dd-MM-yyyy");
      }
    }
  
    return rawValue ?? '';
  };

  return (
    <A4PageWrapper>
      <div className="a4-inner font-sans text-black" style={{ padding: "28px 24px" }}>
        {/* Optional: inline paddings so it matches your design */}
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={images?.infinityLogo}
            alt="Infinity Supports WA logo"
            className="w-[150px] h-[70px] object-contain"
          />
        </div>

        {/* Title */}
        <h2 className="text-center font-bold text-[14px] mb-6 leading-tight">
          {schema?.title}
        </h2>

        {/* Content block - makes up main available space */}
        <div className="flex-1 min-h-0 w-full text-[13px] leading-[2.1] space-y-6">
          {schema?.fields?.map((field: Field, idx: number) => (
            <p key={idx}>
              <span className="font-bold">{field.label}:</span>{" "}
              <span className="whitespace-pre-wrap">{getValue(field.key)}</span>
            </p>
          ))}
        </div>

        {/* Sticky Footer always at bottom */}
        <footer className="w-full border-t border-gray-300 pt-5 text-[10px] text-gray-500">
          <div className="flex justify-between max-w-3xl mx-auto px-4">
            <span>Website: {settings?.company_website}</span>
            <span>{settings?.multi_disciplinary_meeting}</span>
<div>
  Review Date:{' '}
  {settings?.review_date && /^\d{4}-\d{2}-\d{2}$/.test(settings.review_date)
    ? format(parseISO(settings.review_date), 'dd-MM-yyyy')
    : 'N/A'}
</div>
          </div>
        </footer>
      </div>
    </A4PageWrapper>
  );
};

export default Page1;
