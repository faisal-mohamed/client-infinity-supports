import React from "react";
import A4PageWrapper from "./A4PageWrapper";
import { format, parseISO, isValid } from "date-fns";

interface Page7Props {
    data?: any,
  commonFieldsData?: any,
  settings?: any
}

const Page7: React.FC<Page7Props> = ({ data, commonFieldsData, settings }) => {
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
      <div className="h-full flex flex-col p-6">
        {/* Header with Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={"/infinity_logo.png"}
            alt="Infinity Supports WA Logo"
            className="object-contain"
            style={{ height: '64px' }} // Fixed height for consistency
          />
        </div>


        {/* Content */}
        <div className="flex-1 flex flex-col">
          {/* Consent Table */}
          <div className="mb-6">
            <table className="w-full border border-black text-sm">
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
                      <label className="flex items-center text-sm">
                        <input
                          type="radio"
                          checked={getValue("consentMedia") === "Yes"}
                          readOnly
                          className="mr-2 scale-75"
                        />
                        Yes
                      </label>
                      <label className="flex items-center text-sm">
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
                    Hereby give consent to Infinity Supports WA to obtain and use my photograph for the purpose of creating a client profile (and other internal documents).
                  </td>
                  <td className="border border-black p-3 align-top">
                    <div className="space-y-2">
                      <label className="flex items-center text-sm">
                        <input
                          type="radio"
                          checked={getValue("consentProfile") === "Yes"}
                          readOnly
                          className="mr-2 scale-75"
                        />
                        Yes
                      </label>
                      <label className="flex items-center text-sm">
                        <input
                          type="radio"
                          checked={getValue("consentProfile") === "No"}
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
                      <ul className="list-disc ml-4 mt-2 text-sm leading-loose">
                        <li>Legal Guardian / Next of Kin</li>
                        <li>GP / Healthcare Professional</li>
                        <li>Therapy Providers</li>
                        <li>Plan Managers</li>
                        <li>Others: {getValue("consentInfoShareOthers") || '________________________'}</li>
                      </ul>
                    </div>
                  </td>
                  <td className="border border-black p-3 align-top">
                    <div className="space-y-2">
                      <label className="flex items-center text-sm">
                        <input
                          type="radio"
                          checked={getValue("consentInfoShare") === "Yes"}
                          readOnly
                          className="mr-2 scale-75"
                        />
                        Yes
                      </label>
                      <label className="flex items-center text-sm">
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
                      <label className="flex items-center text-sm">
                        <input
                          type="radio"
                          checked={getValue("consentAudit") === "Yes"}
                          readOnly
                          className="mr-2 scale-75"
                        />
                        Yes
                      </label>
                      <label className="flex items-center text-sm">
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
          <div className="space-y-4 flex-1">
            <table className="w-full border border-black text-sm">
              <tbody>
                <tr>
                  <td className="border border-black p-4 leading-loose">
                    <div className="flex">
                      <div className="w-1/3">
                        <strong>Signature of participant</strong>:<br />
                        {renderSignature("participantSignature")}
                      </div>
                      <div className="w-1/3">
                        <strong>Date</strong>:<br />
                        {getValue("participantSignatureDate") || "___/___/____"}
                      </div>
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
                      </div>
                      <div className="w-1/3">
                        <strong>Date</strong>:<br />
                        {getValue("nomineeSignatureDate") || "___/___/____"}
                      </div>
                      <div className="w-1/3">
                        <strong>Name</strong>:<br />
                        {getValue("nomineeName") || "____________________"}
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <table className="w-full border border-black text-sm">
              <tbody>
                <tr>
                  <td className="border border-black p-4 leading-loose">
                    <div className="flex">
                      <div className="w-1/3">
                        <strong>Signature on behalf of Infinity Supports WA</strong>:<br />
                        {renderSignature("providerSignature")}
                      </div>
                      <div className="w-1/3">
                        <strong>Date</strong>:<br />
                        {getValue("providerSignatureDate") || "___/___/____"}
                      </div>
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

        {/* Footer */}
        <div className="flex justify-between items-center text-xs font-bold mt-4 pt-3 border-t border-gray-200">
           <div>Website: {settings?.company_website}</div>
                                <div>{settings?.participant_risk_assessment}</div>
                                <div>
                                  Review Date:{" "}
                                  {settings?.review_date &&
                                  /^\d{4}-\d{2}-\d{2}$/.test(settings.review_date)
                                    ? format(parseISO(settings.review_date), "dd-MM-yyyy")
                                    : "N/A"}
                                </div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page7;
