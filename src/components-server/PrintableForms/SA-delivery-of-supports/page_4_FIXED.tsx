import React from "react";
import A4PageWrapper from "./A4PageWrapper";
import { format, parseISO, isValid } from "date-fns";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from "./page_FIXED";

interface Page4Props {
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

const Page4: React.FC<Page4Props> = ({
  schema,
  data,
  commonFieldsData,
  settings,
  images,
}) => {
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
          {/* Provider Responsibilities */}
          <div className="mb-8">
            <div className="space-y-4">
              <div className="mb-8">
  {schema?.sections?.providerResponsibilities?.map((item: string, index: number) => {
    const [before, after] = item.split("Infinity Supports WA");

    return (
      <p
        key={index}
        className={`${A4_PDF_TYPOGRAPHY.body} leading-loose text-justify`}
      >
        ● {" "}
        {item.includes("Infinity Supports WA") ? (
          <>
            {before}
            <span className="font-semibold text-red-600" style={{color: 'red'}}>Infinity Supports WA</span>
            {after}
          </>
        ) : (
          item
        )}
        <br /> <br /><br /><br />
      </p>
    );
  })}
</div>

            </div>
          </div>

          {/* Responsibilities of Individual */}
          <div>
            <h3 className={`${A4_PDF_TYPOGRAPHY.sectionHeader} underline mb-3`}>
              {schema?.sections?.individualResponsibilitiesHeading}
            </h3>
            <br />
            <p
              className={`${A4_PDF_TYPOGRAPHY.body} leading-loose text-justify`}
            >
              agrees to:
            </p>
          </div>
        </div>
        <Footer settings={settings} />
      </div>
    </A4PageWrapper>
  );
};

export default Page4;
