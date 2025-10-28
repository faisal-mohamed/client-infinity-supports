import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { parseISO, isValid, format } from "date-fns";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from './page_FIXED';

interface Page1Props {
  formSchema: any;
  images: any;
  settings: any;
  data?: any;
  commonFieldsData?: any;
}

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
      <span>{settings?.person_centre_plan_form_id}</span>
      <span>Review Date: {formatDate(settings?.review_date)}</span>
    </div>
  );
};

const Page1: React.FC<Page1Props> = ({ formSchema, images, settings }) => {
  return (
    <A4PageWrapper>
      <div className="flex flex-col w-full h-full px-1 pt-[1mm] pb-[1mm] font-montserrat justify-between" style={{ minHeight: "100%", height: "100%" }}>
        
        {/* Logo */}
        <div className="flex justify-center pt-2">
          <img
            src={images?.infinityLogo || "/infinity_logo.png"}
            alt="Logo"
            width={STANDARD_LOGO.width}
            height={STANDARD_LOGO.height}
            className={STANDARD_LOGO.className}
          />
        </div>

        {/* Central Visual - takes up most of the space */}
        <div className="flex-1 flex justify-center items-center px-2">
          <img
            src={images?.mainImage || "/person_centred_plan_cover_image.png"}
            alt="Person Centred Plan Circles"
            className="max-w-full max-h-full object-contain"
          />
        </div>

        <Footer settings={settings} />
      </div>
    </A4PageWrapper>
  );
};

export default Page1;
