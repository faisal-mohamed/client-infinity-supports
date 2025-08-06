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

const Page5: React.FC<any> = ({ settings, images }) => {
  return (
    <A4PageWrapper>
      <div className="flex flex-col w-full h-full px-6 pt-[1mm] pb-[1mm] font-montserrat justify-between" style={{ minHeight: "100%", height: "100%" }}>
        
        <div className="flex-1">
          <StandardHeader images={images} /> <br /><br />

          {/* Content Area - flows naturally */}
          <div style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
            
            {/* Participant Notification */}
            <ul className="list-disc list-inside text-xs font-normal font-montserrat space-y-2 mb-6 leading-relaxed">
              <li>
                • Let <span className="text-red-600 font-semibold"  style={{color: 'red'}}>Infinity Supports WA</span> know immediately if the Individual's plan/funding is suspended or replaced by a new plan or the Individual's funding ceases.
              </li> <br />
              <li>
                • Will update <span className="text-red-600 font-semibold"  style={{color: 'red'}}>Infinity Supports WA</span> of any changes in circumstances including any changes to living arrangements including addresses, medication, behaviour, contact details or health of the individual which may affect service provision
              </li>
            </ul>
            <br />

            {/* Plan Note */}
            <p className="text-xs font-normal font-montserrat mb-6 leading-relaxed">
The Individual’s plan is expected to remain in effect during the period the services are provided; and will immediately notify <span className="text-red-600 font-semibold"  style={{color: 'red'}}>Infinity Supports WA</span> if the Individual’s Plan is replaced by a new plan or the Individual’s funding ceases.            </p>

            <br /><br />

            {/* Feedback Section */}
            <p className="text-xs font-bold font-montserrat mb-2 uppercase underline">FEEDBACK, COMPLAINTS AND DISPUTES</p> <br />
            <p className="text-xs font-normal font-montserrat mb-4 leading-relaxed">
              If the Individual wishes to give <span className="text-red-600 font-semibold" style={{color: 'red'}}>Infinity Supports WA</span> feedback OR is not happy with the provision of supports and wishes to make a complaint, they can talk to <em><u>Sharon Mays</u></em> or <em><u>Anand Sekar</u></em> at 0493282661; Email: <a href="mailto:admin@infinitysupportwa.org" className="text-blue-600 underline" style={{color: 'blue'}}>admin@infinitysupportwa.org</a>.
            </p>
            <p className="text-xs font-normal font-montserrat mb-6 leading-relaxed">
If the Individual is not satisfied or does not want to talk to this person, the Individual can contact the National Disability Insurance Agency by calling 1800 800 110, visiting one of their offices in person, or visiting www.ndis.gov.au for further information. The Individual can contact Department of Communities, Disability Services on (08) 9426 9200, or visiting one of their offices, or visit www.disability.wa.gov.au            </p>
            <br /><br />
            {/* Emergency Section */}
            <p className="text-xs font-bold font-montserrat mb-2 uppercase underline">EMERGENCY PREPAREDNESS</p> <br />
            <p className="text-xs font-normal font-montserrat mb-3 leading-relaxed">
              <span className="text-red-600 font-semibold" style={{color: 'red'}}>Infinity Supports WA</span> will develop a plan to respond to any unplanned event that may cause:
            </p> <br />
            <ul className="list-disc list-inside text-xs font-normal font-montserrat space-y-1 mb-6 leading-relaxed">
              <li>• Deaths</li> <br />
              <li>• Significant injuries to employees or occupants</li> <br />
              <li>Shut down the business</li> <br />
              <li>• Disruption to operations</li> <br />
              <li>• Physical or environmental damage</li> 
            </ul> <br /><br />

            <p className="text-xs font-normal font-montserrat mb-6 leading-relaxed">
For your peace of mind, all our support workers are trained on how to respond in case of an emergency, and they will receive a copy of your Individual Disaster Management Plan so that they are fully aware of your health condition and the required action plans in case of an emergency. 
Individual Disaster Management Plan and Risk Assessment will be developed and signed by Infinity Supports WA and the Individual and/or representative. Providers’ Responsibility 
            </p>
          </div>
        </div>

        {/* Footer - Only this sticks to bottom */}
        <Footer settings={settings} />
      </div>
    </A4PageWrapper>
  );
};

export default Page5;
