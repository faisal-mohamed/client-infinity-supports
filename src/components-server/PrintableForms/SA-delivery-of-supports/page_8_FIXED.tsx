import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { format, parseISO, isValid } from "date-fns";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from './page_FIXED';

interface Page8Props {
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

const Page8: React.FC<Page8Props> = ({ settings, images }) => {
  return (
    <A4PageWrapper>
      <div className="flex flex-col w-full h-full px-6 pt-[1mm] pb-[1mm] font-montserrat justify-between" style={{ minHeight: "100%", height: "100%" }}>
        
        <StandardHeader images={images} /> <br /><br />

        {/* Content Area */}
        <div className="flex-1 flex flex-col" style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
          
          {/* Opening Paragraph */}
          <div className="mb-8">
            <p className={`${A4_PDF_TYPOGRAPHY.body} leading-loose text-justify`}>
              The Individual Disaster Management Plan and Risk Assessment, a copy of the new Individual Disaster Management Plan and Risk Assessment will be provided to the client and a copy will be kept in their folder.
            </p>
            <br />  <br />
          </div>

          {/* First Bullet List */}
          <div className="mb-8">
            <div className="space-y-4">
              <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose flex items-start gap-3`}>
                <span className="mt-1 w-2 h-2 bg-black rounded-full flex-shrink-0"></span>
                <span className="text-justify">
                  It is the provider's responsibility to mention the rights and responsibilities of the participant and the provider on the service agreement.
                </span>
              </div>
              <br /> <br />
              
              <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose flex items-start gap-3`}>
                <span className="mt-1 w-2 h-2 bg-black rounded-full flex-shrink-0"></span>
                <span className="text-justify">
                  Using the Human Resource Management process will assist the provider to ensure that the participant's support worker has been screened.
                </span>
              </div>
              <br /> <br />
              
              <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose flex items-start gap-3`}>
                <span className="mt-1 w-2 h-2 bg-black rounded-full flex-shrink-0"></span>
                <span className="text-justify">
                  Participants who are subject to this requirement will be registered on the High-Risk Participant Register and some specific support workers will be delegated to those who are registered on this form.
                </span>
              </div>
              <br /> <br />
            </div>
          </div>

          {/* Section Title */}
          <div className="mb-8">
            <h3 className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-4`}>Participant Risk Level Communication</h3>
            <br /> <br />
          </div>

          {/* Second Bullet List */}
          <div className="mb-8">
            <div className="space-y-4">
              <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose flex items-start gap-3`}>
                <span className="mt-1 w-2 h-2 bg-black rounded-full flex-shrink-0"></span>
                <span className="text-justify">
                  For participants who are subject to this requirement, the implementation of the services mentioned in their services will be reviewed every three months by the Service Operations and should be by someone other than the support workers.
                </span>
              </div>
              <br /> <br />
              
              <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose flex items-start gap-3`}>
                <span className="mt-1 w-2 h-2 bg-black rounded-full flex-shrink-0"></span>
                <span className="text-justify">
                  The Service Operations will supervise and monitor the performance of the support workers through a face-to-face interview at the participant's home when the support worker is not at home to ensure their performance is consistent with the agreement and the participant's safety and well-being at least every 3 months or when suspicious of any harm to the participant.
                </span>
              </div>
              <br /> <br />
              
              <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose flex items-start gap-3`}>
                <span className="mt-1 w-2 h-2 bg-black rounded-full flex-shrink-0"></span>
                <span className="text-justify">
                  The Service Operations will provide a report to every key personnel regarding the care and skill with which personal support is being provided to the participant by the support worker after every visit to the participant's home or if there is any complication in service provision.
                </span>
              </div>
              <br /> <br />
            </div>
          </div>

          {/* NDIS Audit Notice */}
          <div className="mb-8">
            <p className={`${A4_PDF_TYPOGRAPHY.body} leading-loose text-justify`}>
              <span className="text-red-600 font-semibold"  style={{color: 'red'}}>Infinity Supports WA PTY Ltd</span> will be required to complete an audit with NDIS. As a participant, you may be asked to provide comments and feedback regarding your service. This is an OPT IN or OUT option to be completed on the consent form.
            </p>
            <br /> <br />
          </div>
        </div>

        <Footer settings={settings} />
      </div>
    </A4PageWrapper>
  );
};

export default Page8;
