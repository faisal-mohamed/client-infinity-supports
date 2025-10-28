import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { format, parseISO, isValid } from "date-fns";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from './page_FIXED';

interface Page7Props {
  settings?: any;
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

const Page7: React.FC<Page7Props> = ({ settings, images }) => {
  return (
    <A4PageWrapper>
      <div className="flex flex-col w-full h-full px-6 pt-[1mm] pb-[1mm] font-montserrat justify-between" style={{ minHeight: "100%", height: "100%" }}>
        
        <StandardHeader images={images} /> <br /><br />

        {/* Content Area */}
        <div className="flex-1 flex flex-col" style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
          
          {/* Emergency Preparedness Section */}
          <div className="mb-8">
            <h3 className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-4`}>Emergency Preparedness</h3>
            <br />

            <p className={`${A4_PDF_TYPOGRAPHY.body} leading-loose text-justify mb-6`}>
              <span className="text-red-600 font-semibold" style={{color: 'red'}}>Infinity Supports WA</span> will develop a plan to respond to any unplanned event that can cause:
            </p>
            <br />

            {/* First Bullet List */}
            <div className="mb-6">
              <ul className="pl-5 space-y-3">
                <li className={`${A4_PDF_TYPOGRAPHY.body} leading-loose flex items-start gap-2`}>
                  <span className="mt-1 w-2 h-2 bg-black rounded-full flex-shrink-0"></span>
                  <span>● Deaths; or</span> 
                </li> <br /><br />
                <li className={`${A4_PDF_TYPOGRAPHY.body} leading-loose flex items-start gap-2`}>
                  <span className="mt-1 w-2 h-2 bg-black rounded-full flex-shrink-0"></span>
                  <span>● Significant injuries to employees or occupants; and/or</span>
                </li> <br /><br />
                <li className={`${A4_PDF_TYPOGRAPHY.body} leading-loose flex items-start gap-2`}>
                  <span className="mt-1 w-2 h-2 bg-black rounded-full flex-shrink-0"></span>
                  <span>● Shut down the business; and/or</span>
                </li> <br /><br />
                <li className={`${A4_PDF_TYPOGRAPHY.body} leading-loose flex items-start gap-2`}>
                  <span className="mt-1 w-2 h-2 bg-black rounded-full flex-shrink-0"></span>
                  <span>● Disruption to operations; and/or</span>
                </li> <br /><br />
                <li className={`${A4_PDF_TYPOGRAPHY.body} leading-loose flex items-start gap-2`}>
                  <span className="mt-1 w-2 h-2 bg-black rounded-full flex-shrink-0"></span>
                  <span>● Physical or environmental damage</span>
                </li> <br /><br />
              </ul>
            </div>
            <br />

            <p className={`${A4_PDF_TYPOGRAPHY.body} leading-loose text-justify mb-6`}>
              For your peace of mind, all our support workers are trained on how to respond in case of an emergency, and they will receive a copy of your Individual Disaster Management Plan so that they are fully aware of your health condition and the required action plans in case of an emergency.
            </p>
            <br />

            <p className={`${A4_PDF_TYPOGRAPHY.body} leading-loose text-justify mb-6`}>
              Individual Disaster Management Plan and Risk Assessment will be developed and signed by <span className="text-red-600 font-semibold">Infinity Supports WA</span> and the Individual and/or representative. Providers' responsibility related to participants' Individual Disaster Management Plan and Risk Assessment is subject to 73G requirements.
            </p>
            <br />

            <p className={`${A4_PDF_TYPOGRAPHY.body} leading-loose text-justify mb-6`}>
              It is the provider's responsibility to document the assessment of the participant's risk factors using the Intake Form, Support Plan, and Participant, Home, and Community Risk Assessment forms.
            </p>
            <br />

            {/* Second Bullet List */}
            <div className="space-y-4">
              <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose flex items-start gap-2`}>
                <span className="mt-1 w-2 h-2 bg-black rounded-full flex-shrink-0"></span>
                <span className="text-justify">
                  A copy of the Individual Disaster Management Plan and Risk Assessment will be provided to the participant and another copy should be kept in their file.
                </span>
              </div>
              <br />
              
              <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose flex items-start gap-2`}>
                <span className="mt-1 w-2 h-2 bg-black rounded-full flex-shrink-0"></span>
                <span className="text-justify">
                  The Individual Disaster Management Plan and Risk Assessment will be reviewed every year or when the participant's circumstances change. If there is any update on
                </span>
              </div>
              <br />
            </div>
          </div>
        </div>

        <Footer settings={settings} />
      </div>
    </A4PageWrapper>
  );
};

export default Page7;
