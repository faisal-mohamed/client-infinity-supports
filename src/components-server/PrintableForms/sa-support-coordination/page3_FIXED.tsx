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

const Page3: React.FC<any> = ({
  schema,
  data,
  settings,
  commonFieldsData,
  images,
}) => {
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
      <div className="flex flex-col w-full h-full px-6 pt-[1mm] pb-[1mm] font-montserrat justify-between" style={{ minHeight: "100%", height: "100%" }}>
        
        <div className="flex-1">
          <StandardHeader images={images} /> <br /><br />

          {/* Content Area - flows naturally */}
          <div style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
            
            {/* Intro Text */}
            <p className="text-xs font-normal font-montserrat mb-4 leading-relaxed">
              I request that{" "}
              <span className="text-red-600 font-semibold" style={{color: 'red'}}>
                Infinity Supports WA
              </span>{" "}
              manage my Support Coordination as well as my Service Delivery.
            </p>
            <p className="text-xs font-normal font-montserrat mb-6 leading-relaxed">
              My choice will be recorded on the Conflict-of-Interest Register.
            </p>

            <br /><br />

            {/* Signature Section */}
            <div className="flex items-center gap-6 text-xs font-normal font-montserrat mb-6 leading-relaxed">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Signed</span>
                <u>
                  {getValue("isConflictOfInterest") == 'Yes' ? getValue("signature") != "" ? <img
                    src={getValue("signature")}
                    alt="Signature"
                    style={{ width: 200, height: 80 }}
                  /> : <p style={{ fontStyle: 'italic' }}>Signature required</p> : ""}
                </u>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold">Print Name</span>
                <u>{getValue("isConflictOfInterest") == 'Yes' && getValue("printName")}</u>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold">Date</span>
                <u>{getValue("isConflictOfInterest") == 'Yes' && getValue("signDate")}</u>
              </div>
            </div>

            <br /><br />

            {/* Ending Agreement Section */}
            <div className="text-xs font-bold font-montserrat mb-2 underline">
              ENDING THIS SERVICE AGREEMENT
            </div> <br />
            <p className="text-xs font-normal font-montserrat mb-3 leading-relaxed">
              Should either Party wishes to end this Service Agreement before the
              cease date they must give 2 weeks' notice in writing.
            </p> <br /><br />
            <p className="text-xs font-normal font-montserrat mb-6 leading-relaxed">
              If either Party seriously breaches this Service Agreement the
              requirement of notice will be waived.
            </p> <br /><br />

            {/* Service Payments Section */}
            <div className="text-xs font-bold font-montserrat mb-3 underline">
              SERVICE PAYMENTS (NDIS)
            </div>
            <br />

            <div className="space-y-4 mb-6">
              <div className="flex items-start text-xs font-normal font-montserrat">
                <input
                  type="checkbox"
                  readOnly
                  checked={data?.selfManaged || false}
                  className="mr-2 mt-1 scale-75"
                />
                <p className="leading-relaxed">
                  The Individual has chosen to self-manage the funding for NDIS
                  supports provided under this Service Agreement. After providing
                  those supports,
                  <span className="text-red-600 font-semibold" style={{color: 'red'}}>
                    {" "}
                    Infinity Supports WA{" "}
                  </span>
                  will send the Individual an invoice for those supports for the
                  Individual to pay. The Individual will pay the invoice within 7
                  days.
                </p> 
              </div>
              <br /><br />

              <div className="flex items-start text-xs font-normal font-montserrat">
                <input
                  type="checkbox"
                  readOnly
                  checked={data?.nomineeManaged || false}
                  className="mr-2 mt-1 scale-75"
                />
                <p className="leading-relaxed">
                  The Individual's Nominee manages the funding for supports
                  provided under this Service Agreement. After providing those
                  supports,
                  <span className="text-red-600 font-semibold" style={{color: 'red'}}>
                    {" "}
                    Infinity Supports WA{" "}
                  </span>
                  will send the Individual's Nominee an invoice for those supports
                  for the Individual's Nominee to pay. The Individual's Nominee
                  will pay the invoice within 7 days.
                </p>
              </div>

              <br /><br />

              <div className="flex items-start text-xs font-normal font-montserrat">
                <input
                  type="checkbox"
                  readOnly
                  checked={data?.ndiaManaged || false}
                  className="mr-2 mt-1 scale-75"
                />
                <p className="leading-relaxed">
                  The Individual has nominated the NDIA to manage the funding for
                  supports provided under this Service Agreement. After providing
                  those supports,
                  <span className="text-red-600 font-semibold" style={{color: 'red'}}>
                    {" "}
                    Infinity Supports WA{" "}
                  </span>
                  will claim payment for those supports from the NDIA.
                </p>
              </div>

              <br /><br />

              <div className="flex items-start text-xs font-normal font-montserrat">
                <input
                  type="checkbox"
                  readOnly
                  checked={data?.planManagerManaged || false}
                  className="mr-2 mt-1 scale-75"
                />
                <p className="leading-relaxed">
                  The Individual has nominated the Plan Management Provider to
                  manage the funding for NDIS supports provided under this Service
                  Agreement. After providing those services,
                  <span className="text-red-600 font-semibold" style={{color: 'red'}}>
                    {" "}
                    Infinity Supports WA{" "}
                  </span>
                  will claim payment for those services from Registered Plan
                  Management Provider.
                </p>
              </div>
            </div>

            <br /><br />

            {/* Plan Manager Details */}
            <div className="text-xs font-normal font-montserrat mb-6 leading-relaxed">
              <p className="mb-2">
                Plan Manager Name: <u>{data?.planManagerManaged == true &&  getValue("planManagerName")}</u>
              </p>
              <br />
              <p>
                Email: <u>{data?.planManagerManaged == true && getValue("planManagerEmail")}</u>
              </p>
            </div>
            <br /><br />

            {/* GST Section */}
            <div className="text-xs font-bold font-montserrat mb-2 underline">
              GOODS AND SERVICES TAX (GST) / NDIS
            </div> <br />
            <p className="text-xs font-normal font-montserrat mb-6 leading-relaxed">
              For the purposes of GST legislation, the Parties confirm that a
              supply of supports under this Service Agreement is a supply of one
              or more of the reasonable and necessary supports
            </p>
          </div>
        </div>

        {/* Footer - Only this sticks to bottom */}
        <Footer settings={settings} />
      </div>
    </A4PageWrapper>
  );
};

export default Page3;
