import React from "react";
import A4PageWrapper from "./A4PageWrapper";
import { format, parseISO, isValid } from "date-fns";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from "./page_FIXED";

interface Page2Props {
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
    <div
      className={`flex justify-between ${A4_PDF_TYPOGRAPHY.footer} px-1 text-gray-600`}
    >
      <span>Website: {settings?.company_website}</span>
      <span>{settings?.sa_delivery_of_supports}</span>
      <span>Review Date: {formatDate(settings?.review_date)}</span>
    </div>
  );
};

const Page2: React.FC<Page2Props> = ({
  schema,
  data,
  settings,
  commonFieldsData,
  images,
}) => {
  const getValue = (key: string) => {
    return data?.[key] ?? "";
  };

  return (
    <A4PageWrapper>
      <div
        className="flex flex-col w-full h-full px-6 pt-[1mm] pb-[1mm] font-montserrat justify-between"
        style={{ minHeight: "100%", height: "100%" }}
      >
        <StandardHeader images={images} /> <br />
        <br />
        {/* Content Area */}
        <div
          className="flex-1 flex flex-col"
          style={{ pageBreakInside: "avoid", breakInside: "avoid" }}
        >
          {/* Opening Text */}
          <div className="mb-6">
            <p
              className={`${A4_PDF_TYPOGRAPHY.body} leading-loose text-justify mb-4`}
            >
              Individuals. This agreement is of ongoing nature and will remain
              in place unless either party chooses to terminate by giving
              appropriate notice as mentioned in the "ending this service
              agreement" section.
            </p>

            <p
              className={`${A4_PDF_TYPOGRAPHY.body} leading-loose text-justify`}
            >
              This Service Agreement establishes the framework for professional
              service delivery and ensures both parties understand their rights,
              responsibilities, and obligations under the NDIS framework.
            </p>
          </div>

          {/* Agreement Conditions Section */}
          <div className="mb-6">
            {" "}
            <br />
            <h3 className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-4`}>
              Agreement Conditions
            </h3>
            <div className="space-y-3">
              {schema?.fields?.map((field: any) => (
                <div
                  key={field.key}
                  className={`flex items-start gap-3 ${A4_PDF_TYPOGRAPHY.body} leading-relaxed`}
                >
                  <input
                    type="checkbox"
                    className="mt-1 w-3 h-3 flex-shrink-0"
                    readOnly
                    checked={!!getValue(field.key)}
                  />
                  <label className="text-justify">{field.label}</label>
                </div>
              ))}
            </div>
          </div>

          {/* NDIS Framework Text */}
          <div className="mb-6">
            <p
              className={`${A4_PDF_TYPOGRAPHY.body} leading-loose text-justify mb-4`}
            >
              The Parties agree that this Service Agreement is made in line with
              the funding body which provides the Individual's funding, which
              aims to:
            </p>

            <ol
              className={`list-decimal list-inside ml-4 space-y-3 ${A4_PDF_TYPOGRAPHY.body} leading-loose`}
            >
              <li className="text-justify">
                Support the independence and social and economic participation
                of people with disability, and
              </li>
              <li className="text-justify">
                Enable people with a disability to exercise choice and control
                in the pursuit of their goals and the planning and delivery of
                their supports.
              </li>
            </ol>
          </div>

          {/* Schedule of Supports Section */}
          <div className="mb-6">
            {" "}
            <br />
            <h3 className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-4`}>
              Schedule of Supports
            </h3>
            <p
              className={`${A4_PDF_TYPOGRAPHY.body} leading-loose text-justify mb-4`}
            >
              <span className="text-red-600 font-semibold">
                Infinity Supports WA
              </span>{" "}
              agrees to provide the Individual named in Section 1 the support as
              per the Schedule of Support and duration of the support.
            </p>
            <p
              className={`${A4_PDF_TYPOGRAPHY.body} leading-loose text-justify mb-4`}
            >
              The supports and their prices are set out in the Schedule of
              Supports. All supports are as per the NDIS Price Guide and are GST
              inclusive (if applicable) and include the cost of providing the
              supports. All figures quoted below are based on NDIS pricing and
              the individual's NDIS plan at the time of agreement.
            </p>
            <p
              className={`${A4_PDF_TYPOGRAPHY.body} leading-loose text-justify mb-4`}
            >
              Prices, funding totals and hours will be adjusted periodically to
              reflect changes to NDIS pricing and the individual's NDIS plan.
              Any changes will be communicated in writing with appropriate
              notice.
            </p>
            <p
              className={`${A4_PDF_TYPOGRAPHY.body} leading-loose text-justify mb-4`}
            >
              This agreement ensures compliance with all relevant legislation,
              NDIS standards, and quality frameworks to deliver person-centered,
              high-quality disability support services.
            </p>
            <p
              className={`${A4_PDF_TYPOGRAPHY.body} leading-loose text-justify`}
            >
              Both parties acknowledge their commitment to working
              collaboratively to achieve the participant's goals and outcomes as
              outlined in their NDIS plan, while maintaining the highest
              standards of professional service delivery.
            </p>
          </div>

          {/* Bottom Text */}
          <div className="mt-auto">
            <p
              className={`${A4_PDF_TYPOGRAPHY.body} leading-loose text-justify`}
            >
              Additional Agreed information in the provision of support by{" "}
              <span className="text-red-600 font-semibold" style={{color: 'red'}}>
                Infinity Supports WA
              </span>{" "}
              PTY Ltd
            </p>
          </div>
        </div>
        <Footer settings={settings} />
      </div>
    </A4PageWrapper>
  );
};

export default Page2;
