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

const Page6: React.FC<any> = ({ settings, images }) => {
  return (
    <A4PageWrapper>
      <div className="flex flex-col w-full h-full px-6 pt-[1mm] pb-[1mm] font-montserrat justify-between" style={{ minHeight: "100%", height: "100%" }}>
        
        <div className="flex-1">
          <StandardHeader images={images} /> <br /><br />

          {/* Content Area - flows naturally */}
          <div style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
            
            {/* Intro Paragraph */}
            <p className="text-xs font-normal font-montserrat mb-6 leading-relaxed">
              Related to participants Individual Disaster Management Plan and Risk Assessment is subject to 73G requirements.</p>
              <br />
              <p>
              It is the provider's responsibility to document the assessment of the participant's risk factors using Intake Form, Support Plan, and Participant, Home, and Community Risk Assessment forms.
            </p>
            <br /><br />

            {/* Responsibilities List */}
            <ul className="list-disc list-inside text-xs font-normal font-montserrat mb-6 space-y-3 leading-relaxed">
              <li>
                • A copy of the Individual Disaster Management Plan and Risk Assessment will be provided to the participant and another copy should be kept in their file.
              </li> <br /><br />
              <li>
                • The Individual Disaster Management Plan and Risk Assessment will be reviewed every year or when the participant's circumstances change. If there is any update, a new copy will be provided to the client and filed.
              </li> <br /><br />
              <li>
                • It is the provider's responsibility to mention the rights and responsibilities of the participant and the provider on the service agreement.
              </li> <br /><br />
              <li>
                • Using the Human Resource Management process will assist the provider to ensure that the participant's support worker has been screened.
              </li> <br /><br />
              <li>
                • Participants who are subject to this requirement will be registered on the High-Risk Participant Register and specific support workers will be delegated accordingly.
              </li>
            </ul>
            <br /><br />

            {/* Audit Opt-in/Out Note */}
            <p className="text-xs font-normal font-montserrat mb-6 leading-relaxed">
              <span className="text-red-600 font-semibold" style={{color: 'red'}}>Infinity Supports WA PTY Ltd</span>{" "}
              will be required to complete an audit with NDIS, as a participant you may be asked to provide comments and feedback regarding your service.  This is an OPT IN or OUT option to be completed in the following section.            </p>
          </div>
        </div>

        {/* Footer - Only this sticks to bottom */}
        <Footer settings={settings} />
      </div>
    </A4PageWrapper>
  );
};

export default Page6;
