import React from "react";
import A4PageWrapper from "./A4PageWrapper";
import { format, parseISO, isValid } from "date-fns";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from './page_FIXED';

interface Field {
  key: string;
  label: string;
  type: string;
  additionalFields?: { key: string; label: string; type: string }[];
}

interface Page3Props {
  schema?: any;
  data: any;
  settings: any;
  commonFieldsData: any;
  images: any;
}

// --- Standardized Header Component ---
const StandardHeader = ({ images }: { images?: any }) => (
  <div className="flex justify-center">
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
    <div className={`flex justify-between ${A4_PDF_TYPOGRAPHY.footer} px-1 text-gray-600`}>
      <span>Website: {settings?.company_website}</span>
      <span>{settings?.sa_delivery_of_supports}</span>
      <span>Review Date: {formatDate(settings?.review_date)}</span>
    </div>
  );
};

const Page3: React.FC<Page3Props> = ({
  schema,
  data,
  commonFieldsData,
  settings,
  images,
}) => {
  const getValue = (key: string) => {
    return data?.[key] ?? "";
  };

  return (
    <A4PageWrapper>
      <div className="flex flex-col w-full h-full px-6 pt-[1mm] pb-[1mm] font-montserrat justify-between" style={{ minHeight: "100%", height: "100%" }}>
        
        <StandardHeader images={images} /> <br /><br />

        {/* Content Area */}
        <div className="flex-1 flex flex-col" style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
          
          {/* Service Payments Section */}
          <div className="mb-6">
            <h2 className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-4`}>Service Payments (NDIS)</h2>
            
            <div className="space-y-6">
              {/* First 3 checkboxes */}
              {schema?.fields?.slice(0, 3)?.map((field: Field) => (
                <div key={field.key}>
                  <div className={`flex items-start gap-3 ${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                    <input
                      type="checkbox"
                      checked={!!getValue(field.key)}
                      readOnly
                      className="mt-1 w-3 h-3 flex-shrink-0"
                    />
                    <span className="text-justify">{field.label}</span>
                  </div>
                  <br />
                </div>
              ))}

              {/* Plan Manager Managed - Special handling */}
              <div>
                <div className={`flex items-start gap-3 ${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                  <input
                    type="checkbox"
                    checked={!!getValue("planManagerManaged")}
                    readOnly
                    className="mt-1 w-3 h-3 flex-shrink-0"
                  />
                  <span className="text-justify">
                    The Individual has nominated the Plan Management Provider{" "}
                    <span className="font-semibold underline">
                      {getValue("planManagerName") || "________________________"}
                    </span>{" "}
                    to manage the funding for NDIS supports provided under this
                    Service Agreement. After providing those supports, Infinity
                    Supports WA will claim payment for those supports from{" "}
                    <span className="font-semibold underline">
                      {getValue("fundingSource") || "________________________"}
                    </span>
                    .
                  </span>
                </div>
                <br />
              </div>
            </div>
          </div>

          {/* GST Section */}
          <div className="mb-6">
            <h2 className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-4`}>Goods and Services Tax (GST) / NDIS</h2>
            
            <p className={`${A4_PDF_TYPOGRAPHY.body} leading-loose text-justify mb-6`}>
              For the purposes of GST legislation, the Parties confirm that a
              supply of supports under this Service Agreement is a supply of
              one or more of the reasonable and necessary supports specified
              in the statement included, under subsection 33(2) of the
              National Disability Insurance Scheme Act 2013 (NDIS Act), in the
              Participant's NDIS plan currently in effect under section 37 of
              the NDIS Act.
            </p>
          </div>

          {/* Responsibilities Section */}
          <div>
            <h3 className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-3`}>
              Responsibilities of Infinity Supports WA
            </h3>
            <p className={`${A4_PDF_TYPOGRAPHY.body} leading-loose text-justify`}>
              Infinity Supports WA agrees to:
            </p>
          </div>
        </div>

        <Footer settings={settings} />
      </div>
    </A4PageWrapper>
  );
};

export default Page3;
