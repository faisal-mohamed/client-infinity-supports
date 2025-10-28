import React from "react";
import A4PageWrapper from "./A4PageWrapper";
import { parseISO, isValid, format } from "date-fns";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from "./page_FIXED";

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

// --- Standardized Header Component ---
const StandardHeader = ({
  images,
  title,
}: {
  images?: any;
  title?: string;
}) => (
  <div className="flex flex-col items-center pt-6 pb-4">
    <img
      src={images?.infinityLogo || "/infinity_logo.png"}
      alt="Logo"
      width={STANDARD_LOGO.width}
      height={STANDARD_LOGO.height}
      className={STANDARD_LOGO.className}
    />
    <br />
    <br />
    {title && (
      <h2 className={`${A4_PDF_TYPOGRAPHY.title} text-center mt-2`}>{title}</h2>
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
    <div
      className={`pt-2 ${A4_PDF_TYPOGRAPHY.footer} flex justify-between text-gray-600`}
    >
      <span>Website: {settings?.company_website}</span>
      <span>{settings?.schedule_of_supports}</span>
      <span>Review Date: {formatDate(settings?.review_date)}</span>
    </div>
  );
};

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

  return (
    <A4PageWrapper>
      <div
        className="flex flex-col h-full w-full px-6 pt-[1mm] pb-[1mm] font-montserrat justify-between"
        style={{ height: "100%" }}
      >
        <StandardHeader images={images} />

        {/* Main Content */}
        <div
          className={`flex-1 space-y-6 ${A4_PDF_TYPOGRAPHY.body} leading-loose`}
        >
          {/* Provider Travel */}
          <div className="space-y-3">
            <p
              className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-3 leading-relaxed`}
            >
              Provider Travel
            </p>
            <p className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
              <input
                type="checkbox"
                className="mr-2"
                checked={isChecked("providerTravelAgreement")}
                readOnly
                style={{ verticalAlign: "middle" }}
              />
              I agree to Infinity Supports WA charging 15 minutes Provider
              Travel per day.
            </p>
          </div>

          {/* Short Notice Cancellation */}
          <div className="space-y-3">
            <p
              className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-3 leading-relaxed`}
            >
              Short Notice Cancellation Charges
            </p>
            <p className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
              A short notice cancellation is defined by the NDIS Pricing
              Arrangements and Price Limits as: Has given less than seven (7)
              clear days' notice for a support. When claiming a cancellation,
              providers can request a claim of up to 100 per cent of the price.
            </p>
          </div>

          {/* Support Price Structure */}
          <div className="space-y-3">
            <p
              className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-3 leading-relaxed`}
            >
              Schedule of Support price structure
            </p>
            <p className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
              The prices for Service Delivery are set in accordance with NDIS
              pricing guide and can change in response to the Annual Price
              Review conducted by NDIS with the new prices outlined by NDIA,
              effective 1 July every year. NDIA Increases the participants
              funding supports to accommodate for this price change and hence
              should not impact on the level support received.{" "}
            </p>
          </div>

          {/* Signature Boxes */}
          <div
            className={`border border-black p-4 space-y-5 ${A4_PDF_TYPOGRAPHY.body} leading-loose mt-8`}
          >
            {/* Participant */}
            <div className="flex justify-between items-start gap-4">
              <div className="flex flex-col">
                <p
                  className={`mb-3 ${A4_PDF_TYPOGRAPHY.signatureLabel} leading-relaxed`}
                >
                  Signature of participant:
                </p>
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
                <p
                  className={`mb-2 ${A4_PDF_TYPOGRAPHY.signatureLabel} leading-relaxed`}
                >
                  Date:
                </p>
                <p
                  className={`${A4_PDF_TYPOGRAPHY.signatureContent} leading-loose`}
                >
                  {getValue("participantSignatureDate")}
                </p>
              </div>
            </div>
            <p
              className={`mt-3 ${A4_PDF_TYPOGRAPHY.signatureLabel} leading-loose`}
            >
              Name:{" "}
              <span className={A4_PDF_TYPOGRAPHY.signatureContent}>
                {getValue("participantName")}
              </span>
            </p>

            <p className={`${A4_PDF_TYPOGRAPHY.body} leading-loose mt-5 mb-5`}>
              I confirm that this agreement has been explained to the person
              receiving the services (participant) and that they agree to this:
              [If signed by a Nominee:]
            </p>

            {/* Nominee */}
            <div className="flex justify-between items-start gap-4">
              <div className="flex flex-col">
                <p
                  className={`mb-3 ${A4_PDF_TYPOGRAPHY.signatureLabel} leading-relaxed`}
                >
                  Signature of Nominee:
                </p>
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
                <p
                  className={`mb-2 ${A4_PDF_TYPOGRAPHY.signatureLabel} leading-relaxed`}
                >
                  Date:
                </p>
                <p
                  className={`${A4_PDF_TYPOGRAPHY.signatureContent} leading-loose`}
                >
                  {getValue("nomineeSignatureDate")}
                </p>
              </div>
            </div>
            <p
              className={`mt-3 ${A4_PDF_TYPOGRAPHY.signatureLabel} leading-loose`}
            >
              Name:{" "}
              <span className={A4_PDF_TYPOGRAPHY.signatureContent}>
                {getValue("nomineeName")}
              </span>
            </p>

            {/* Representative */}
            <div className="border border-black p-4 mt-8">
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col">
                  <p
                    className={`mb-3 ${A4_PDF_TYPOGRAPHY.signatureLabel} leading-relaxed`}
                  >
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
                  <p
                    className={`mb-2 ${A4_PDF_TYPOGRAPHY.signatureLabel} leading-relaxed`}
                  >
                    Date:
                  </p>
                  <p
                    className={`${A4_PDF_TYPOGRAPHY.signatureContent} leading-loose`}
                  >
                    {getValue("representativeSignatureDate")}
                  </p>
                </div>
              </div>
              <p
                className={`mt-4 ${A4_PDF_TYPOGRAPHY.signatureLabel} leading-loose`}
              >
                Name:{" "}
                <span className={A4_PDF_TYPOGRAPHY.signatureContent}>
                  {getValue("represenativeName")}
                </span>
              </p>
            </div>
          </div>
        </div>

        <Footer settings={settings} />
      </div>
    </A4PageWrapper>
  );
};

export default Page3;
