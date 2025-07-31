
import { format, parseISO, isValid } from "date-fns";


import React from "react";
import A4PageWrapper from "./A4PageWrapper";

interface Field {
  key: string;
  label: string;
  type: string;
  options?: string[];
  subItems?: string[];
}

interface Page9Props {
  schema?: any;
  data: any;
  settings: any;
  commonFieldsData: any;
  images: any;
}

const Page9: React.FC<Page9Props> = ({
  data,
  schema,
  settings,
  commonFieldsData,
  images,
}) => {
  const fields = schema.fields;

  const commonFieldMapping: Record<string, string> = {
    givenNames: "name",
    address: "street",
    dob: "dob",
    disability: "disability",
    ndisNumber: "ndis",
    state: "state",
    street: "street",
    postcode: "postCode",
    email: "email",
    homePhone: "phone",
    sex: "sex",
  };

  const getValue = (key: string): string => {
      const rawValue = commonFieldMapping[key]
        ? commonFieldsData?.[commonFieldMapping[key]]
        : data?.[key];
    
      // ✅ Convert YYYY-MM-DD to DD-MM-YYYY if valid
      if (typeof rawValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
        const parsed = parseISO(rawValue);
        if (isValid(parsed)) {
          return format(parsed, 'dd-MM-yyyy');
        }
      }
    
      return rawValue ?? '';
    };

  return (
    <A4PageWrapper>
<div className="flex flex-col justify-between flex-1 h-full px-6 pt-6 pb-3 text-base text-justify" style={{ lineHeight: "2.5" }}>
        {/* Header */}
        <div className="flex justify-center mb-6 shrink-0">
          <img
            src={images?.infinityLogo}
            alt="Infinity Supports WA Logo"
            className="h-16 object-contain"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col space-y-6">
          {/* Consent Table */}
          <div>
            <table className="w-full border border-black text-xs">
              <thead>
                <tr>
                  <th className="border border-black text-left p-3 font-semibold leading-loose">Consent</th>
                  <th className="border border-black w-32 p-3 font-semibold leading-loose"></th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field: any) => {
                  if (field.type === "radio") {
                    return (
                      <tr key={field.key}>
                        <td className="border border-black p-3 align-top leading-loose">
                          <div>
                            {field.label}
                            {field.subItems && (
                              <ul className="list-disc ml-4 mt-2 text-xs leading-loose">
                                {field.subItems.map((item: any, idx: number) => {
                                  if (item.startsWith("Others")) {
                                    const othersValue = getValue("othersInfoSharingConsent");
                                    return (
                                      <li key={idx}>
                                        Others: {othersValue || "__________________________"}
                                      </li>
                                    );
                                  }
                                  return <li key={idx}>{item}</li>;
                                })}
                              </ul>
                            )}
                          </div>
                        </td>
                        <td className="border border-black p-3 align-top">
                          <div className="space-y-2">
                            {field.options?.map((opt: any) => (
                              <label key={opt} className="flex items-center text-xs">
                                <input
                                  type="radio"
                                  checked={getValue(field.key) === opt}
                                  readOnly
                                  className="mr-2 scale-75"
                                />
                                {opt}
                              </label>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  }
                  return null;
                })}
              </tbody>
            </table>
          </div>

          {/* Signature Section */}
          <div className="space-y-4 text-xs">
            {/* Participant */}
            <table className="w-full border border-black">
              <tbody>
                <tr className="align-top">
                  <td className="border border-black p-2 w-1/3">
                    <strong>Signature of participant:</strong><br />
                    {data?.participantSignature ? (
                      <img
                        src={data.participantSignature}
                        alt="Participant Signature"
                        className="h-8 mt-1 object-contain"
                      />
                    ) : (
                      <span className="inline-block mt-2">__________________</span>
                    )}
                  </td>
                  <td className="border border-black p-2 w-1/3">
                    <strong>Date:</strong><br />
                    {getValue("participantSignatureDate") || "___/___/____"}
                  </td>
                  <td className="border border-black p-2 w-1/3">
                    <strong>Name:</strong><br />
                    {getValue("participantName") || "____________________"}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Nominee */}
            <table className="w-full border border-black">
              <tbody>
                <tr className="align-top">
                  <td className="border border-black p-2 w-1/3">
                    <strong>Signature of Nominee:</strong><br />
                    {data?.nomineeSignature ? (
                      <img
                        src={data.nomineeSignature}
                        alt="Nominee Signature"
                        className="h-8 mt-1 object-contain"
                      />
                    ) : (
                      <span className="inline-block mt-2">__________________</span>
                    )}
                  </td>
                  <td className="border border-black p-2 w-1/3">
                    <strong>Date:</strong><br />
                    {getValue("nomineeSignatureDate") || "___/___/____"}
                  </td>
                  <td className="border border-black p-2 w-1/3">
                    <strong>Name:</strong><br />
                    {getValue("nomineeName") || "____________________"}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Provider */}
            <table className="w-full border border-black">
              <tbody>
                <tr className="align-top">
                  <td className="border border-black p-2 w-1/3">
                    <strong>Signature of Provider:</strong><br />
                    {data?.providerSignature ? (
                      <img
                        src={data.providerSignature}
                        alt="Provider Signature"
                        className="h-8 mt-1 object-contain"
                      />
                    ) : (
                      <span className="inline-block mt-2">__________________</span>
                    )}
                  </td>
                  <td className="border border-black p-2 w-1/3">
                    <strong>Date:</strong><br />
                    {getValue("providerSignatureDate") || "___/___/____"}
                  </td>
                  <td className="border border-black p-2 w-1/3">
                    <strong>Name:</strong><br />
                    {getValue("providerName") || "____________________"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-gray-200 text-xs font-bold flex justify-between items-center">
          <div>Website: {settings?.company_website}</div>
          <div>{settings?.sa_delivery_of_supports}</div>
 <div>
            Review Date:{" "}
            {settings?.review_date &&
            /^\d{4}-\d{2}-\d{2}$/.test(settings.review_date)
              ? format(parseISO(settings.review_date), "dd-MM-yyyy")
              : "N/A"}
          </div>{" "}        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page9;
