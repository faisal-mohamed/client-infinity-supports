import React from "react";
import A4PageWrapper from "./A4PageWrapper";

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
}

const Page1: React.FC<Props> = ({ schema, data, settings, commonFieldsData }) => {
  const commonFieldMapping: Record<string, string> = {
    clientName: 'name',
    address: 'street',
    dob: 'dob',
    disability: 'disability',
    phoneNumber: 'phone',
    ndisNumber: 'ndis',
    state: 'state',
    street: 'street',
    postcode: 'postCode',
    email: 'email',
    homePhone: 'phone',
    sex: 'sex'
  };

  const getValue = (key: string): string => {
    if (commonFieldMapping[key]) {
      return commonFieldsData?.[commonFieldMapping[key]] ?? '';
    }
    return data?.[key] ?? '';
  };

  return (
    <A4PageWrapper>
      <div
        className="flex flex-col h-full text-[11px] text-black font-sans"
        style={{
          paddingTop: "24px",
          paddingBottom: "24px",
          paddingLeft: "36px",
          paddingRight: "24px",
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6 pr-10">
          <img
            src="/infinity_logo.png"
            alt="Infinity Supports WA logo"
            className="w-[150px] h-[70px] object-contain"
          />
        </div>

        {/* Title */}
        <h2 className="text-center font-bold text-[14px] mb-6 leading-tight">
          {schema?.title}
        </h2>

        {/* Content */}
        <div className="flex-grow w-full text-[13px] leading-[2] space-y-4 pr-10">
          {schema?.fields?.map((field: Field, index: number) => (
            <p key={index}>
              <span className="font-bold">{field.label}:</span>{" "}
              <span className="whitespace-pre-wrap">{getValue(field.key)}</span>
            </p>
          ))}
        </div>

        {/* Sticky Footer */}
        <div className="mt-auto pt-10 text-[10px] text-gray-500 flex justify-between pr-10">
          <div>Website: {settings?.company_website}</div>
          <div>{settings?.multi_disciplinary_meeting}</div>
          <div>Review Date: {settings?.review_date}</div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page1;
