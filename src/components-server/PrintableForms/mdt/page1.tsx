// import React from "react";
// import A4PageWrapper from "./A4PageWrapper";

// interface Field {
//   key: string;
//   label: string;
// }

// interface Props {
//   schema: { title: string; fields: Field[] };
//   data: Record<string, any>;
//   commonFieldsData: Record<string, any>;
//   settings: {
//     company_website: string;
//     multi_disciplinary_meeting: string;
//     review_date: string;
//   };
//   images: any;
// }

// const Page1: React.FC<Props> = ({
//   schema,
//   data,
//   settings,
//   commonFieldsData,
//   images,
// }) => {
//   const commonFieldMapping: Record<string, string> = {
//     clientName: "name",
//     address: "street",
//     dob: "dob",
//     disability: "disability",
//     phoneNumber: "phone",
//     ndisNumber: "ndis",
//     state: "state",
//     street: "street",
//     postcode: "postCode",
//     email: "email",
//     homePhone: "phone",
//     sex: "sex",
//   };

//   const getValue = (key: string): string => {
//     if (commonFieldMapping[key]) {
//       return commonFieldsData?.[commonFieldMapping[key]] ?? "";
//     }
//     return data?.[key] ?? "";
//   };

//   return (
//     <A4PageWrapper>
//       <div
//         className="flex flex-col h-full min-h-full box-border text-[11px] text-black font-sans"
//         style={{
//           height: "100%",
//           minHeight: "100%",
//           paddingTop: "24px",
//           paddingBottom: "24px",
//           paddingLeft: "36px",
//           paddingRight: "24px",
//         }}
//       >
//         {/* Logo */}
//         <div className="flex justify-center mb-6">
//           <img
//             src={images?.infinityLogo}
//             alt="Infinity Supports WA logo"
//             className="w-[150px] h-[70px] object-contain"
//           />
//         </div>

//         {/* Title */}
//         <h2 className="text-center font-bold text-[14px] mb-6 leading-tight">
//           {schema?.title}
//         </h2>

//         {/* Content */}
//         <div className="flex-1 min-h-0 w-full text-[13px] leading-[2.1] space-y-6">
//           {schema?.fields?.map((field: Field, index: number) => (
//             <p key={index}>
//               <span className="font-bold">{field.label}:</span>{" "}
//               <span className="whitespace-pre-wrap">{getValue(field.key)}</span>
//             </p>
//           ))}
//         </div>

//         {/* Sticky Footer */}
//         <footer className="flex-shrink-0 mt-auto pt-6 border-t border-gray-300 text-[10px] text-gray-500 flex justify-between">
//           <div>Website: {settings?.company_website}</div>
//           <div>{settings?.multi_disciplinary_meeting}</div>
//           <div>Review Date: {settings?.review_date}</div>
//         </footer>
//       </div>
//     </A4PageWrapper>
//   );
// };

// export default Page1;


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
    if (commonFieldMapping[key]) {
      return commonFieldsData?.[commonFieldMapping[key]] ?? "";
    }
    return data?.[key] ?? "";
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
            <span>Review Date: {settings?.review_date}</span>
          </div>
        </footer>
      </div>
    </A4PageWrapper>
  );
};

export default Page1;
