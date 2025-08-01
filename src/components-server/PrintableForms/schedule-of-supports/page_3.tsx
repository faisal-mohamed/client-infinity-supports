import React from "react";
import A4PageWrapper from "./A4PageWrapper";
import { parseISO, isValid, format } from "date-fns";

interface Field {
  key: string;
  type: string;
  label: string;
}

interface Page3Props {
  schema: { fields: Field[] };
  data: Record<string, any>;
  settings: any;
  commonFieldsData: any;
  images: any;
}

const Page3: React.FC<Page3Props> = ({
  schema,
  data,
  settings,
  commonFieldsData,
  images,
}) => {
  const getValue = (key: string): string => {
  const rawValue = data?.[key] ?? "";

  if (typeof rawValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
    const parsed = parseISO(rawValue);
    if (isValid(parsed)) {
      return format(parsed, "dd-MM-yyyy");
    }
  }

  return rawValue;
};

  const isChecked = (key: string) =>
    getValue(key)?.toString().toLowerCase() === "yes";

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
    <A4PageWrapper>
      <div
        className="flex flex-col h-full w-full px-6 pt-[1mm] pb-[1mm] text-sm font-sans justify-between"
        style={{ height: "100%" }}
      >
        {/* Header */}
        <div className="flex justify-center mb-2">
          <img
            src={images?.infinityLogo}
            alt="Infinity Supports WA Logo"
            className="w-[100px] h-[35px] object-contain"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-4 text-[13px] leading-relaxed">
          {/* Provider Travel */}
          <div>
            <p className="font-bold mb-1">Provider Travel</p>
            <p>
              <input
                type="checkbox"
                className="mr-2"
                checked={isChecked("providerTravelAgreement")}
                readOnly
                style={{verticalAlign: 'middle'}}

              />
              I agree to Infinity Supports WA charging 15 minutes Provider
              Travel per day.
            </p>
          </div>

          {/* Short Notice Cancellation */}
          <div>
            <p className="font-bold mb-1">Short Notice Cancellation Charges</p>
            <p>
              A short notice cancellation is defined by the NDIS Pricing
              Arrangements and Price Limits as: Has given less than seven (7)
              clear days’ notice for a support. When claiming a cancellation,
              providers can request a claim of up to 100 per cent of the price.
            </p>
          </div>

          {/* Support Price Structure */}
          <div>
            <p className="font-bold mb-1">
              Schedule of Support price structure
            </p>
            <p>
              The prices for Service Delivery are set in accordance with the
              NDIS pricing guide and can change annually. NDIA increases
              participant funding to account for the price change, so this does
              not affect the level of support.
            </p>
          </div>

          {/* Signature Boxes */}
          <div className="border border-black p-4 space-y-4 text-[13px] leading-relaxed">
            {/* Participant */}
            <div className="flex justify-between items-start gap-4">
              <div className="flex flex-col">
                <p className="mb-1 font-medium">Signature of participant:</p>
                {getValue("participantSignature") && (
                  <div className="w-[120px] h-[40px] flex items-center justify-center border border-gray-300 bg-white">
                    <img
                      src={getValue("participantSignature")}
                      alt="Signature of the Participant"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}
              </div>
              <div>
                <p className="mb-1 font-medium">Date:</p>
                <p>{getValue("participantSignatureDate")}</p>
              </div>
            </div>
            <p className="mt-1 font-medium">
              Name: {getValue("participantName")}
            </p>

            <p>
              I confirm that this agreement has been explained to the person
              receiving the services (participant) and that they agree to this:
              [If signed by a Nominee:]
            </p>

            {/* Nominee */}
            <div className="flex justify-between items-start gap-4">
              <div className="flex flex-col">
                <p className="mb-1 font-medium">Signature of Nominee:</p>
                {getValue("nomineeSignature") && (
                  <div className="w-[120px] h-[40px] flex items-center justify-center border border-gray-300 bg-white">
                    <img
                      src={getValue("nomineeSignature")}
                      alt="Nominee Signature"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}
              </div>
              <div>
                <p className="mb-1 font-medium">Date:</p>
                <p>{getValue("nomineeSignatureDate")}</p>
              </div>
            </div>
            <p className="mt-1 font-medium">Name: {getValue("nomineeName")}</p>

            {/* Representative */}
            <div className="border border-black p-4 mt-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col">
                  <p className="mb-1 font-medium">
                    Signature on behalf of Infinity Support WA:
                  </p>
                  {getValue("representativeSignature") && (
                    <div className="w-[120px] h-[40px] flex items-center justify-center border border-gray-300 bg-white">
                      <img
                        src={getValue("representativeSignature")}
                        alt="Representative Signature"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <p className="mb-1 font-medium">Date:</p>
                  <p>{getValue("representativeSignatureDate")}</p>
                </div>
              </div>
              <p className="mt-2 font-medium">
                Name: {getValue("represenativeName")}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 text-xs flex justify-between text-gray-600">
          <span>Website: {settings?.company_website}</span>
          <span>{settings?.schedule_of_supports}</span>
<span>Review Date: {formatDate(settings?.review_date)}</span>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page3;
