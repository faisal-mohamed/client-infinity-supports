import React from "react";
import A4PageWrapper from "./A4PageWrapper";
import { format, parseISO, isValid } from "date-fns";


interface Page3Props {
    data?: any,
  commonFieldsData?: any,
  settings?: any
}

const Page3: React.FC<Page3Props> = ({ data, commonFieldsData, settings }) => {
  const getValue = (key: string): string => {
    const rawValue = data?.[key as keyof NonNullable<typeof data>];

    // Convert YYYY-MM-DD to DD-MM-YYYY if valid
    if (typeof rawValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
      const parsed = parseISO(rawValue);
      if (isValid(parsed)) {
        return format(parsed, "dd-MM-yyyy");
      }
    }

    return rawValue?.toString() ?? "";
  };

  return (
    <A4PageWrapper>
      <div className="h-full flex flex-col p-6">
        {/* Header with Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={"/infinity_logo.png"}
            alt="Infinity Supports WA Logo"
            className="h-16 object-contain"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {/* Intro */}
          <p className="text-center text-sm mb-4 leading-relaxed">
            I request that <span className="text-red-600 font-semibold">Infinity Supports WA</span> manage my Support Coordination as well as my Service Delivery.
          </p>
          <p className="text-center text-sm mb-6 leading-relaxed">
            My choice will be recorded on the Conflict-of-Interest Register.
          </p>

          {/* Signature */}
         <div className="flex items-center gap-6 text-sm mb-6 leading-relaxed">
  <div className="flex items-center gap-2">
    <span className="font-semibold">Signed</span>
    <u>
      <img
        src={getValue("signature")}
        alt="Signature"
        style={{ width: 200, height: 80 }}
      />
    </u>
  </div>

  <div className="flex items-center gap-2">
    <span className="font-semibold">Print Name</span>
    <u>{getValue("printName")}</u>
  </div>

  <div className="flex items-center gap-2">
    <span className="font-semibold">Date</span>
    <u>{getValue("signDate")}</u>
  </div>
</div>


          {/* Ending Agreement */}
          <div className="text-sm font-bold mb-2 underline">ENDING THIS SERVICE AGREEMENT</div>
          <p className="text-sm mb-3 leading-relaxed">
            Should either Party wishes to end this Service Agreement before the cease date they must give 2 weeks' notice in writing.
          </p>
          <p className="text-sm mb-6 leading-relaxed">
            If either Party seriously breaches this Service Agreement the requirement of notice will be waived.
          </p>

          {/* Service Payments */}
          <div className="text-sm font-bold mb-3 underline">SERVICE PAYMENTS (NDIS)</div>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-start text-sm">
              <input
                type="checkbox"
                readOnly
                checked={data?.selfManaged || false}
                className="mr-2 mt-1 scale-75"
              />
              <p className="leading-relaxed">
                The Individual has chosen to self-manage the funding for NDIS supports provided under this Service Agreement. After providing those supports,
                <span className="text-red-600 font-semibold"> Infinity Supports WA </span>
                will send the Individual an invoice for those supports for the Individual to pay. The Individual will pay the invoice within 7 days.
              </p>
            </div>
            
            <div className="flex items-start text-sm">
              <input
                type="checkbox"
                readOnly
                checked={data?.nomineeManaged || false}
                className="mr-2 mt-1 scale-75"
              />
              <p className="leading-relaxed">
                The Individual's Nominee manages the funding for supports provided under this Service Agreement. After providing those supports,
                <span className="text-red-600 font-semibold"> Infinity Supports WA </span>
                will send the Individual's Nominee an invoice for those supports for the Individual's Nominee to pay. The Individual's Nominee will pay the invoice within 7 days.
              </p>
            </div>
            
            <div className="flex items-start text-sm">
              <input
                type="checkbox"
                readOnly
                checked={data?.ndiaManaged || false}
                className="mr-2 mt-1 scale-75"
              />
              <p className="leading-relaxed">
                The Individual has nominated the NDIA to manage the funding for supports provided under this Service Agreement. After providing those supports,
                <span className="text-red-600 font-semibold"> Infinity Supports WA </span>
                will claim payment for those supports from the NDIA.
              </p>
            </div>
            
            <div className="flex items-start text-sm">
              <input
                type="checkbox"
                readOnly
                checked={data?.planManagerManaged || false}
                className="mr-2 mt-1 scale-75"
              />
              <p className="leading-relaxed">
                The Individual has nominated the Plan Management Provider to manage the funding for NDIS supports provided under this Service Agreement. After providing those services,
                <span className="text-red-600 font-semibold"> Infinity Supports WA </span>
                will claim payment for those services from Registered Plan Management Provider.
              </p>
            </div>
          </div>

          {/* Plan Manager Details */}
          <div className="text-sm mb-6 leading-relaxed">
            <p className="mb-2">
              Plan Manager Name: <u>{getValue("planManagerName")}</u>
            </p>
            <p>
              Email: <u>{getValue("planManagerEmail")}</u>
            </p>
          </div>

          {/* GST */}
          <div className="text-sm font-bold mb-2 underline">GOODS AND SERVICES TAX (GST) / NDIS</div>
          <p className="text-sm mb-6 leading-relaxed flex-1">
            For the purposes of GST legislation, the Parties confirm that a supply of supports under this Service Agreement is a supply of one or more of the reasonable and necessary supports
          </p>
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

export default Page3;
