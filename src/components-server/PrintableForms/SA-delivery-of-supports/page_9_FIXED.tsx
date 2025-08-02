import { format, parseISO, isValid } from "date-fns";
import React from "react";
import A4PageWrapper from "./A4PageWrapper";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from './page_FIXED';

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

// --- Standardized Header Component ---
const StandardHeader = ({ images, title }: { images?: any, title?: string }) => (
  <div className="flex flex-col items-center pt-4 pb-6">
    <img
      src={images?.infinityLogo || "/infinity_logo.png"}
      alt="Logo"
      width={STANDARD_LOGO.width}
      height={STANDARD_LOGO.height}
      className={STANDARD_LOGO.className}
    />
    {title && (
      <h2 className={`${A4_PDF_TYPOGRAPHY.title} text-center mt-2`}>
        {title}
      </h2>
    )}
  </div>
);

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
    <div className={`mt-auto pt-3 border-t border-gray-200 ${A4_PDF_TYPOGRAPHY.footer} font-bold flex justify-between items-center`}>
      <div>Website: {settings?.company_website}</div>
      <div>{settings?.sa_delivery_of_supports}</div>
      <div>Review Date: {formatDate(settings?.review_date)}</div>
    </div>
  );
};

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

    // Convert YYYY-MM-DD to DD-MM-YYYY if valid
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
      <div className="flex flex-col h-full flex-1 px-6 pt-6 pb-3 font-montserrat text-justify" style={{ lineHeight: '1.8' }}>
        
        <StandardHeader images={images} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          
          {/* Consent Table */}
          <div className="mb-6">
            <h3 className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-4`}>Participant Consent</h3>
            
            <table className={`w-full border border-black ${A4_PDF_TYPOGRAPHY.tableCell}`}>
              <thead>
                <tr>
                  <th className={`border border-black text-left p-3 ${A4_PDF_TYPOGRAPHY.tableHeader}`}>Consent</th>
                  <th className={`border border-black w-32 p-3 ${A4_PDF_TYPOGRAPHY.tableHeader}`}>Response</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field: any) => {
                  if (field.type === "radio") {
                    return (
                      <tr key={field.key}>
                        <td className={`border border-black p-3 align-top ${A4_PDF_TYPOGRAPHY.body} leading-relaxed`}>
                          <div className="space-y-2">
                            <p>{field.label}</p>
                            {field.subItems && (
                              <ul className={`list-disc ml-4 mt-2 ${A4_PDF_TYPOGRAPHY.body} space-y-1`}>
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
                              <label key={opt} className={`flex items-center ${A4_PDF_TYPOGRAPHY.tableCell}`}>
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
          <div className="mb-6">
            <h3 className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-4`}>Signatures</h3>
            
            {/* Participant Signature */}
            <div className="mb-4">
              <h4 className={`${A4_PDF_TYPOGRAPHY.subHeader} mb-2`}>Participant</h4>
              <table className="w-full border border-black">
                <tbody>
                  <tr className="align-top">
                    <td className="border border-black p-3 w-1/3">
                      <span className={`${A4_PDF_TYPOGRAPHY.signatureLabel} block mb-2`}>Signature of participant:</span>
                      {data?.participantSignature ? (
                        <img
                          src={data.participantSignature}
                          alt="Participant Signature"
                          className="h-10 mt-1 object-contain"
                        />
                      ) : (
                        <div className="h-10 border-b border-gray-400 mt-1"></div>
                      )}
                    </td>
                    <td className="border border-black p-3 w-1/3">
                      <span className={`${A4_PDF_TYPOGRAPHY.signatureLabel} block mb-2`}>Date:</span>
                      <span className={`${A4_PDF_TYPOGRAPHY.signatureContent}`}>
                        {getValue("participantSignatureDate") || "___/___/____"}
                      </span>
                    </td>
                    <td className="border border-black p-3 w-1/3">
                      <span className={`${A4_PDF_TYPOGRAPHY.signatureLabel} block mb-2`}>Name:</span>
                      <span className={`${A4_PDF_TYPOGRAPHY.signatureContent}`}>
                        {getValue("participantName") || "____________________"}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Nominee Signature */}
            <div className="mb-4">
              <h4 className={`${A4_PDF_TYPOGRAPHY.subHeader} mb-2`}>Nominee </h4>
              I confirm that this agreement has been explained to the person receiving the services (participant) and that they agree to this: [If 
signed by a Nominee:]
              <table className="w-full border border-black">
                <tbody>
                  <tr className="align-top">
                    <td className="border border-black p-3 w-1/3">
                      <span className={`${A4_PDF_TYPOGRAPHY.signatureLabel} block mb-2`}>Signature of Nominee:</span>
                      {data?.nomineeSignature ? (
                        <img
                          src={data.nomineeSignature}
                          alt="Nominee Signature"
                          className="h-10 mt-1 object-contain"
                        />
                      ) : (
                        <div className="h-10 border-b border-gray-400 mt-1"></div>
                      )}
                    </td>
                    <td className="border border-black p-3 w-1/3">
                      <span className={`${A4_PDF_TYPOGRAPHY.signatureLabel} block mb-2`}>Date:</span>
                      <span className={`${A4_PDF_TYPOGRAPHY.signatureContent}`}>
                        {getValue("nomineeSignatureDate") || "___/___/____"}
                      </span>
                    </td>
                    <td className="border border-black p-3 w-1/3">
                      <span className={`${A4_PDF_TYPOGRAPHY.signatureLabel} block mb-2`}>Name:</span>
                      <span className={`${A4_PDF_TYPOGRAPHY.signatureContent}`}>
                        {getValue("nomineeName") || "____________________"}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Provider Signature */}
            <div className="mb-4">
              <h4 className={`${A4_PDF_TYPOGRAPHY.subHeader} mb-2`}>Provider</h4>
              <table className="w-full border border-black">
                <tbody>
                  <tr className="align-top">
                    <td className="border border-black p-3 w-1/3">
                      <span className={`${A4_PDF_TYPOGRAPHY.signatureLabel} block mb-2`}>Signature of Provider:</span>
                      {data?.providerSignature ? (
                        <img
                          src={data.providerSignature}
                          alt="Provider Signature"
                          className="h-10 mt-1 object-contain"
                        />
                      ) : (
                        <div className="h-10 border-b border-gray-400 mt-1"></div>
                      )}
                    </td>
                    <td className="border border-black p-3 w-1/3">
                      <span className={`${A4_PDF_TYPOGRAPHY.signatureLabel} block mb-2`}>Date:</span>
                      <span className={`${A4_PDF_TYPOGRAPHY.signatureContent}`}>
                        {getValue("providerSignatureDate") || "___/___/____"}
                      </span>
                    </td>
                    <td className="border border-black p-3 w-1/3">
                      <span className={`${A4_PDF_TYPOGRAPHY.signatureLabel} block mb-2`}>Name:</span>
                      <span className={`${A4_PDF_TYPOGRAPHY.signatureContent}`}>
                        {getValue("providerName") || "____________________"}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom section that pushes footer down */}
          
        </div>

        {/* Footer - Uses mt-auto to stick to bottom */}
        <Footer settings={settings} />
      </div>
    </A4PageWrapper>
  );
};

export default Page9;
