import React from "react";
import A4PageWrapper from "./A4PageWrapper";

interface Field {
  key: string;
  type: string;
  label: string;
}

interface Page3Props {
  schema: { fields: Field[] };
  data: Record<string, any>;
}

const Page3: React.FC<Page3Props> = ({ schema, data }) => {
  const getValue = (key: string) => data?.[key] ?? "";

  const isChecked = (key: string) =>
    getValue(key)?.toString().toLowerCase() === "yes";

  return (
    <A4PageWrapper>
      <div className="h-full flex flex-col px-6 py-10 text-sm font-sans">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <img
            src="/infinity_logo.png"
            alt="Infinity Supports WA Logo"
            className="w-[200px] h-[70px] object-contain"
          />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {/* Provider Travel */}
          <div>
            <p className="font-bold mb-1">Provider Travel</p>
            <p>
              <input
                type="checkbox"
                className="mr-2"
                checked={isChecked("providerTravelAgreement")}
                readOnly
              />
              I agree to Infinity Supports WA charging 15 minutes Provider Travel per day.
            </p>
          </div>

          {/* Short Notice Cancellation */}
          <div>
            <p className="font-bold mb-1">Short Notice Cancelation Charges</p>
            <p className="text-[13px] leading-relaxed">
              A short notice cancellation is defined by the NDIS Pricing
              Arrangements and Price Limits as: Has given less than seven (7)
              clear days’ notice for a support. When claiming a cancellation,
              providers can request a claim of up to 100 per cent of the price.
            </p>
          </div>

          {/* Schedule of Support Price */}
          <div>
            <p className="font-bold mb-1">Schedule of Support price structure</p>
            <p className="text-[13px] leading-relaxed">
              The prices for Service Delivery are set in accordance with NDIS
              pricing guide and can change in response to the Annual Price Review
              conducted by NDIS with the new prices outlined by NDIA, effective 1
              July every year. NDIA Increases the participants funding supports to
              accommodate for this price change and hence should not impact on the
              level support received.
            </p>
          </div>

          {/* Signature Boxes */}
          <div className="border border-black p-4 space-y-4">
            <div>
              <div className="flex justify-between items-center">
                <p>
                  Signature of participant: {getValue("participantSignature")}
                </p>
                <p>Date: {getValue("participantSignatureDate")}</p>
              </div>
              <p>Name: {getValue("participantName")}</p>
            </div>

            <p>
              I confirm that this agreement has been explained to the person
              receiving the services (participant) and that they agree to this:
              [If signed by a Nominee:]
            </p>

            <div>
              <div className="flex justify-between items-center">
                <p>Signature of Nominee: {getValue("nomineeSignature")}</p>
                <p>Date: {getValue("nomineeSignatureDate")}</p>
              </div>
              <p>Name: {getValue("nomineeName")}</p>
            </div>
          </div>

          <div className="border border-black p-4">
            <div className="flex justify-between items-center">
              <p>
                Signature on behalf of Infinity Support WA:{" "}
                {getValue("representativeSignature")}
              </p>
              <p>Date: {getValue("representativeSignatureDate")}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex justify-between text-[10px] mt-auto px-1 pt-6">
          <span>Website: infinitysupportswa.org</span>
          <span>CF008A1</span>
          <span>Review Date: 14/03/2026</span>
        </footer>
      </div>
    </A4PageWrapper>
  );
};

export default Page3;
