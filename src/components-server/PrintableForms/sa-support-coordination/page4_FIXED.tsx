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

const Page4: React.FC<any> = ({ settings, images }) => {
  return (
    <A4PageWrapper>
      <div className="flex flex-col w-full h-full px-6 pt-[1mm] pb-[1mm] font-montserrat justify-between" style={{ minHeight: "100%", height: "100%" }}>
        
        <div className="flex-1">
          <StandardHeader images={images} /> <br /><br />

          {/* Content Area - flows naturally */}
          <div style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
            
            {/* Intro Paragraph */}
            <p className="text-xs font-normal font-montserrat mb-4 leading-relaxed">
              specified in the statement included, under subsection 33(2) of the National Disability Insurance Scheme Act 2013 (NDIS Act), in the Participant's NDIS plan currently in effect under section 37 of the NDIS Act.
            </p>

            {/* Provider Responsibilities Section */}
            <p className="text-xs font-bold font-montserrat mb-2 underline">RESPONSIBILITIES OF INFINITY SUPPORTS WA</p> <br />
            <p className="text-xs font-normal font-montserrat mb-3">
              <span className="text-red-600 font-bold" style={{color: 'red'}}>Infinity Supports WA</span> <span className="font-normal">agrees to:</span>
            </p> <br />

            <ul className="list-disc list-inside text-xs font-normal font-montserrat mb-6 space-y-2 leading-relaxed">
              <li>• Understand and use your NDIS plan to pursue your goals</li> 
              <li>• Review the provision of supports with the Individual in line with the applicable requirements.</li> <br />
              <li>• Connect you with providers, community, mainstream and the government services</li> <br />
              <li>• Source information regarding Allied Health processionals</li> <br />
              <li>• Build your confidence and skills to use and coordinate your supports</li> <br />
              <li>• Communicate openly and honestly in a timely manner</li> <br />
              <li>• Treat the Individual with courtesy and respect</li> <br />
              <li>• Consult the Individual on decisions about how supports are provided</li> <br />
              <li>
                • Give the Individual information about managing any complaints or disagreements and details of{" "}
                <span className="text-red-600 font-bold" style={{color: 'red'}}>Infinity Supports WA</span> cancellation policy (if relevant)
              </li> <br />
              <li>• Listen to the Individual's feedback and resolve problems in a timely manner.</li> <br />
              <li>
                • Give the Individual the required notice if{" "}
                <span className="text-red-600 font-bold" style={{color: 'red'}}>Infinity Supports WA</span> needs to end the Service
                Agreement
              </li> <br />
              <li>• Protect the Individual's privacy and confidential information</li> <br /><br />
              <li>
                • Provide supports in a manner consistent with all relevant laws, including but not limited to, the National
                Disability Insurance Scheme Act 2013 and rules, and the Australian Consumer Law; keep accurate records on the
                supports provided to the Individuals.
              </li> <br />
            </ul>

            {/* Individual Responsibilities Section */}
            <p className="text-xs font-bold font-montserrat mb-2 underline">RESPONSIBILITIES OF INDIVIDUAL / INDIVIDUAL'S REPRESENTATIVE</p> <br />
            <p className="text-xs font-normal font-montserrat mb-3">agrees to:</p> <br />

            <ul className="list-disc list-inside text-xs font-normal font-montserrat space-y-2 leading-relaxed">
              <li>
                • Inform <span className="text-red-600 font-bold" style={{color: 'red'}}>Infinity Supports WA</span> about how they wish the
                services to be delivered to meet the Individual's needs.
              </li>  <br /><br />
              <li>
                • Treat <span className="text-red-600 font-bold" style={{color: 'red'}}>Infinity Supports WA</span> with courtesy and respect.
              </li> <br /><br />
              <li>
                • Talk to <span className="text-red-600 font-bold" style={{color: 'red'}}>Infinity Supports WA</span> if the Individual has any
                concerns about the services being provided.
              </li> <br /><br />
              <li>
                • Give <span className="text-red-600 font-bold" style={{color: 'red'}}>Infinity Supports WA</span> the required notice if the
                Individual needs to end the Service Agreement.
              </li> 
            </ul>
          </div>
        </div>

        {/* Footer - Only this sticks to bottom */}
        <Footer settings={settings} />
      </div>
    </A4PageWrapper>
  );
};

export default Page4;
