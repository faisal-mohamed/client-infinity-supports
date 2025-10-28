import React from "react";
import A4PageWrapper from "./A4PageWrapper";
import { parseISO, isValid, format } from "date-fns";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from './page_FIXED';

interface Page11Props {
  schema: any;
  data: any;
  commonFieldsData: Record<string, string>;
  settings: any;
  images?: any;
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
      <span>{settings?.participant_risk_assessment}</span>
      <span>Review Date: {formatDate(settings?.review_date)}</span>
    </div>
  );
};

const Page11: React.FC<Page11Props> = ({ schema, data, commonFieldsData, settings, images }) => {
  const getValue = (key: string) => data?.[key] ?? "";

  const cellClass = `border border-black px-2 py-2 ${A4_PDF_TYPOGRAPHY.tableCell}`;

  return (
    <A4PageWrapper>
      <div className="flex flex-col w-full h-full px-6 pt-[1mm] pb-[1mm] font-montserrat justify-between" style={{ minHeight: "100%", height: "100%" }}>
        
        <StandardHeader images={images} /> <br /><br />

        {/* Content Area */}
        <div className="flex-1 flex flex-col gap-6" style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
          
          {/* Pandemic and Communication Table */}
          <div>
            <table className={`table-auto border border-black w-full border-collapse ${A4_PDF_TYPOGRAPHY.tableCell}`}>
              <tbody>
                <tr>
                  <td className={`${cellClass} w-1/2 ${A4_PDF_TYPOGRAPHY.label} align-top`}>
                    Pandemic
                  </td>
                  <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.body} align-top`}>
                    <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                      Client will reside with family, have essential supports and daily phone check-ins.
                    </div>
                  </td>
                </tr>
                
                <tr className="bg-gray-300">
                  <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader}`} colSpan={2}>
                    Mode of Communication assessment for non-verbal participants (e.g., Sign language, pictures, body movement)
                  </td>
                </tr>
                
                <tr className="bg-gray-100">
                  <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.label}`}>
                    Possible scenarios of concern
                  </td>
                  <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.label}`}>
                    Mode of communication
                  </td>
                </tr>
                
                {[1, 2].map((i) => (
                  <tr key={i}>
                    <td className={`${cellClass} align-top`} style={{ minHeight: "60px" }}>
                      <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                        {getValue(`scenario${i}`)}
                      </div>
                    </td>
                    <td className={`${cellClass} align-top`} style={{ minHeight: "60px" }}>
                      <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                        {getValue(`mode${i}`)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>   <br /><br /><br /><br /><br />

          {/* Emergency Procedures Section */}
          <div>
            <div className={`text-center ${A4_PDF_TYPOGRAPHY.sectionHeader} mb-3`}>
              What to do in an Emergency?
            </div> <br /><br />
            
            <table className={`table-auto border border-black w-full border-collapse ${A4_PDF_TYPOGRAPHY.tableCell}`}>
              <thead>
                <tr className="bg-gray-300">
                  <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-left w-1/2`}>
                    Evacuation Procedures
                  </th>
                  <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-left w-1/2`}>
                    FIRE
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="align-top">
                  <td className={`${cellClass} align-top`}>
                    <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                      <p className="mb-2">
                        ● Upon hearing the alarm or when the situation requires the participant to leave the premises:
                      </p> 
                      <ul className="list-disc list-inside space-y-2">
                        <li>Prepare to evacuate.</li> <br />
                        <li>
                          ● Get your environment ready to be left unattended. Shut down electrical/electronic devices; turn off gas if safe to do so. <br />
                        </li>
                        <li>
                          ● For fire, close the doors as you go – do not lock them. In the case of a bomb threat, leave doors open.
                        </li> <br />
                        <li>● Assist participant in immediate danger.</li> <br />
                      </ul>
                    </div>
                  </td>
                  
                  <td className={`${cellClass} align-top`}>
                    <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                      <ul className="list-disc list-inside space-y-2">
                        <li>
                          ● Ring 000 and provide details of the fire then ring supervisor.
                        </li> <br />
                        <li>
                          ● Assist any person in immediate danger only if safe to do so.
                        </li> <br />
                        <li>
                          ● If safe to do so, close doors to minimise spread of fire.
                        </li> <br />
                        <li>● Attack the fire only if safe to do so.</li> <br />
                        <li> 
                          ● Contact the nearest warden and follow their instructions (if applicable).
                        </li> <br />
                        <li>
                          ● Assist with evacuation of participants with mobility issues.
                        </li> <br />
                      </ul>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <Footer settings={settings} />
      </div>
    </A4PageWrapper>
  );
};

export default Page11;
