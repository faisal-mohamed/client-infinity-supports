import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { format, parseISO, isValid } from "date-fns";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from './page_FIXED';

interface Page6Props {
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

const Page6: React.FC<Page6Props> = ({ settings, images }) => {
  return (
    <A4PageWrapper>
      <div className="flex flex-col w-full h-full px-6 pt-[1mm] pb-[1mm] font-montserrat justify-between" style={{ minHeight: "100%", height: "100%" }}>
        
        <StandardHeader images={images} /> <br /><br />

        {/* Content Area */}
        <div className="flex-1 flex flex-col" style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
          
          {/* Plan Continuation */}
          <div className="mb-8">
            <ul className="pl-5">
              <li className={`${A4_PDF_TYPOGRAPHY.body} leading-loose text-justify`}>
                ● The Individual's plan is expected to remain in effect during the period the supports are provided and will immediately notify the{' '}
                <span className="text-red-600 font-semibold" style={{color: 'red'}}>Infinity Supports WA</span> if the Individual's plan is replaced by a new plan or the Individual's funding ceases.
              </li>
            </ul>
            <br /> <br />
          </div>

          {/* Changes to Schedule */}
          <div className="mb-8">
            <h3 className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-4`}>Changes to this Schedule of Supports</h3> <br />
            <p className={`${A4_PDF_TYPOGRAPHY.body} leading-loose text-justify`}>
              If changes to the supports or their delivery are required, the Parties agree to discuss and review the Schedule of Supports. The Parties agree that any changes to the Schedule of Supports will be in writing, signed, and dated by both Parties.
            </p>
            <br /> <br />
          </div>

          {/* Ending Agreement */}
          <div className="mb-8">
            <h3 className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-4`}>Ending this Service Agreement</h3> <br />
            <p className={`${A4_PDF_TYPOGRAPHY.body} leading-loose text-justify mb-3`}>
              Should either Party wishes to end this Service Agreement before the cease date they must give 2 weeks' notice in writing.
            </p>
            <br /> <br />
            <p className={`${A4_PDF_TYPOGRAPHY.body} leading-loose text-justify`}>
              If either Party seriously breaches this Service Agreement the requirement of notice will be waived.
            </p>
            <br /> <br />
          </div>

          {/* Feedback and Complaints */}
          <div className="mb-8">
            <h3 className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-4`}>Feedback, Complaints, and Disputes</h3> <br />
            
            <div className="space-y-6">
              <div>
                <p className={`${A4_PDF_TYPOGRAPHY.body} leading-loose text-justify`}>
                  If the Individual wishes to give <span className="text-red-600 font-semibold" style={{color: 'red'}}>Infinity Supports WA</span> feedback or If the Individual is not happy with the provision of supports and wishes to make a complaint, the Individual can talk to <em>Sharon Mays</em> Director or <em><u>Anand Sekar</u></em> Director 0493282661
                </p>
                <br /> <br />
              </div>
              
              <div>
                <p className={`${A4_PDF_TYPOGRAPHY.body} leading-loose text-justify`}>
                  Email:{' '}
                  <a href="mailto:admin@infinitysupportswa.org" className="text-blue-700 underline">
                    admin@infinitysupportswa.org
                  </a>. Alternatively, the individual can lodge their complaint or feedback on{' '}
                  <a href="http://www.infinitysupportswa.org" className="text-blue-700 underline" target="_blank" rel="noopener noreferrer">
                    www.infinitysupportswa.org
                  </a>.
                </p>
                <br /> <br />
              </div>
              
              <div>
                <p className={`${A4_PDF_TYPOGRAPHY.body} leading-loose text-justify`}>
                  If the Individual is not satisfied or does not want to talk to this person, the Individual can contact the National Disability Insurance Agency by calling 1800 800 110, visiting one of their offices in person, or visiting{' '}
                  <a href="http://www.ndis.gov.au" className="text-blue-700 underline" target="_blank" rel="noopener noreferrer" style={{color: 'blue'}}>
                    www.ndis.gov.au
                  </a>. The Individual can contact Department of Communities, Disability Services on (08) 9426 9200, or visiting one of their offices, or visit{' '}
                  <a href="http://www.disability.wa.gov.au" className="text-blue-700 underline" target="_blank" rel="noopener noreferrer" style={{color: 'blue'}}>
                    www.disability.wa.gov.au
                  </a>.
                </p>
                <br /> <br />
              </div>
            </div>
          </div>
        </div>

        <Footer settings={settings} />
      </div>
    </A4PageWrapper>
  );
};

export default Page6;
