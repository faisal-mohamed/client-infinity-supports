import React from 'react';
import A4PageWrapper from "./A4PageWrapper_FIXED";
import { format, parseISO, isValid } from "date-fns";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from './page_FIXED';

// --- Standardized Header Component ---
const StandardHeader = ({ images }: { images?: any }) => (
  <div className="flex flex-col items-center gap-2">
    <img
      src={images?.infinityLogo || "/infinity_logo.png"}
      alt="Logo"
      width={STANDARD_LOGO.width}
      height={STANDARD_LOGO.height}
      className={STANDARD_LOGO.className}
    />
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
    <div className="flex justify-between text-xs font-normal font-montserrat px-1 text-gray-600">
      <span>Website: {settings?.company_website}</span>
      <span>{settings?.sa_support_coordination}</span>
      <span>Review Date: {formatDate(settings?.review_date)}</span>
    </div>
  );
};

const Page7: React.FC<any> = ({
  schema,
  data,
  settings,
  commonFieldsData,
  images,
}) => {
  const getValue = (key: string): string => {
    const rawValue = data?.[key as keyof typeof data];

    // Convert YYYY-MM-DD to DD-MM-YYYY if valid
    if (typeof rawValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
      const parsed = parseISO(rawValue);
      if (isValid(parsed)) {
        return format(parsed, "dd-MM-yyyy");
      }
    }

    return rawValue?.toString() ?? "";
  };

  const renderSignature = (key: string) => {
    const value = getValue(key);
    if (value?.startsWith("data:image")) {
      return <img src={value} alt="Signature" className="h-10" />;
    }
    return value || "__________________";
  };

  return (
    <A4PageWrapper>
      <div className="flex flex-col w-full h-full px-6 pt-[1mm] pb-[1mm] font-montserrat justify-between" style={{ minHeight: "100%", height: "100%" }}>
        
        <div className="flex-1">
          <StandardHeader images={images} /> <br /><br />

          

          {/* Content Area - flows naturally */}
          <div style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
            
            {/* Consent Table */}
            <div className="mb-6">
              <table className="w-full border border-black text-xs font-normal font-montserrat">
                <thead>
                  <tr>
                    <th className="border border-black text-left p-3 font-semibold leading-loose">
                      Consent
                    </th>
                    <th className="border border-black w-32 p-3 font-semibold leading-loose"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black p-3 align-top leading-loose">
                      Hereby give consent to Infinity Supports WA to obtain and use images and likeness of myself on media releases, including social media and promotion.
                    </td>
                    <td className="border border-black p-3 align-top">
                      <div className="space-y-2">
                        <label className="flex items-center text-xs">
                          <input
                            type="radio"
                            checked={getValue("consentMedia") === "Yes"}
                            readOnly
                            className="mr-2 scale-75"
                          />
                          Yes
                        </label>
                        <label className="flex items-center text-xs">
                          <input
                            type="radio"
                            checked={getValue("consentMedia") === "No"}
                            readOnly
                            className="mr-2 scale-75"
                          />
                          No
                        </label>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-black p-3 align-top leading-loose">
                      <div>
                        Hereby give consent to Infinity Supports WA to obtain & share relevant documented information, including:
                        <ul className="list-disc ml-4 mt-2 text-xs leading-loose">
                          <li> •  Legal Guardian / Next of Kin</li>
                          <li> •  GP / Healthcare Professional</li>
                          <li> •  Therapy Providers</li>
                          <li> •  Plan Managers</li>
                          <li> •  Others: {getValue("consentInfoShareOthers") || '________________________'}</li>
                        </ul>
                      </div>
                    </td>
                    <td className="border border-black p-3 align-top">
                      <div className="space-y-2">
                        <label className="flex items-center text-xs">
                          <input
                            type="radio"
                            checked={getValue("consentInfoShare") === "Yes"}
                            readOnly
                            className="mr-2 scale-75"
                          />
                          Yes
                        </label>
                        <label className="flex items-center text-xs">
                          <input
                            type="radio"
                            checked={getValue("consentInfoShare") === "No"}
                            readOnly
                            className="mr-2 scale-75"
                          />
                          No
                        </label>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-black p-3 align-top leading-loose">
                      I consent to take part in a NDIS audit and for my documents to be reviewed as required.
                    </td>
                    <td className="border border-black p-3 align-top">
                      <div className="space-y-2">
                        <label className="flex items-center text-xs">
                          <input
                            type="radio"
                            checked={getValue("consentAudit") === "Yes"}
                            readOnly
                            className="mr-2 scale-75"
                          />
                          Yes
                        </label>
                        <label className="flex items-center text-xs">
                          <input
                            type="radio"
                            checked={getValue("consentAudit") === "No"}
                            readOnly
                            className="mr-2 scale-75"
                          />
                          No
                        </label>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Signatures */}
            <div className="space-y-4">
              <table className="w-full border border-black text-xs font-normal font-montserrat">
                <tbody>
                  <tr>
                    <td className="border border-black p-4 leading-loose">
                      <div className="flex">
                        <div className="w-1/3">
                          <strong>Signature of participant</strong>:<br />
                          {renderSignature("participantSignature")}
                        </div> &nbsp;&nbsp;&nbsp;&nbsp;
                        <div className="w-1/3">
                          <strong>Date</strong>:<br />
                          {getValue("participantSignatureDate") || "___/___/____"}
                        </div>&nbsp;&nbsp;&nbsp;&nbsp;
                        <div className="w-1/3">
                          <strong>Name</strong>:<br />
                          {getValue("participantName") || "____________________"}
                        </div>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-black p-4 leading-loose">
                      I confirm this agreement was explained and accepted by the participant. [If signed by a Nominee:]
                      <div className="flex mt-2">
                        <div className="w-1/3">
                          <strong>Signature of Nominee</strong>:<br />
                          {renderSignature("nomineeSignature")}
                        </div>&nbsp;&nbsp;&nbsp;&nbsp;
                        <div className="w-1/3">
                          <strong>Date</strong>:<br />
                          {getValue("nomineeSignatureDate") || "___/___/____"}
                        </div>&nbsp;&nbsp;&nbsp;&nbsp;
                        <div className="w-1/3">
                          <strong>Name</strong>:<br />
                          {getValue("nomineeName") || "____________________"}
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <table className="w-full border border-black text-xs font-normal font-montserrat">
                <tbody>
                  <tr>
                    <td className="border border-black p-4 leading-loose">
                      <div className="flex">
                        <div className="w-1/3">
                          <strong>Signature on behalf of Infinity Supports WA</strong>:<br />
                          {renderSignature("providerSignature")}
                        </div>&nbsp;&nbsp;&nbsp;&nbsp;
                        <div className="w-1/3">
                          <strong>Date</strong>:<br />
                          {getValue("providerSignatureDate") || "___/___/____"}
                        </div>&nbsp;&nbsp;&nbsp;&nbsp;
                        <div className="w-1/3">
                          <strong>Name</strong>:<br />
                          {getValue("providerName") || "____________________"}
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer - Only this sticks to bottom */}
        <Footer settings={settings} />
      </div>
    </A4PageWrapper>
  );
};

export default Page7;
