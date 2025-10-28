import React from "react";
import A4PageWrapper from "./A4PageWrapper";
import { parseISO, isValid, format } from "date-fns";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from "./page_FIXED";

interface Page12Props {
  data: any;
  commonFieldsData: Record<string, string>;
  settings: any;
  schema: any;
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
    <div
      className={`flex justify-between ${A4_PDF_TYPOGRAPHY.footer} px-1 text-gray-600`}
    >
      <span>Website: {settings?.company_website}</span>
      <span>{settings?.participant_risk_assessment}</span>
      <span>Review Date: {formatDate(settings?.review_date)}</span>
    </div>
  );
};

const Page12: React.FC<Page12Props> = ({
  data,
  commonFieldsData,
  settings,
  schema,
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
          {/* Emergency Procedures Section */}
          <div className="flex-1">
            <table
              className={`table-auto border border-black w-full border-collapse ${A4_PDF_TYPOGRAPHY.tableCell}`}
            >
              <tbody>
                {/* Evacuation Instructions Row */}
                <tr>
                  <td
                    className={`border border-black px-3 py-3 w-1/2 align-top`}
                  >
                    <ul
                      className={`list-disc list-inside space-y-2 ${A4_PDF_TYPOGRAPHY.body} leading-loose`}
                    >
                      <li>● Leave the building via the nearest safe route.</li> <br />
                      <li>● Obey all directions from emergency services.</li> <br />
                      <li>● Move calmly to assembly point</li> <br />
                      <li>
                        ● Follow closely the instructions of emergency services
                        personnel and campus wardens.
                      </li> <br />
                      <li>● Wait for the OK to re-enter the building.</li> <br />
                    </ul>
                  </td>
                  <td
                    className={`border border-black px-3 py-3 w-1/2 align-top`}
                  >
                    <ul
                      className={`list-disc list-inside space-y-2 ${A4_PDF_TYPOGRAPHY.body} leading-loose`}
                    >
                      <li>
                        ● Move to the evacuation location in plan and stay there
                        until all clear has been given.
                      </li> <br />
                      <li>
                        ● Follow closely the instructions of emergency services
                        personnel and campus warden.
                      </li> <br />
                    </ul>
                  </td>
                </tr>

                {/* Section Headers Row */}
                <tr className="bg-gray-200">
                  <td
                    className={`border border-black px-3 py-2 ${A4_PDF_TYPOGRAPHY.label} text-center`}
                  >
                    Medical Emergency
                  </td>
                  <td
                    className={`border border-black px-3 py-2 ${A4_PDF_TYPOGRAPHY.label} text-center`}
                  >
                    Civil Disturbance
                  </td>
                </tr>

                {/* Medical Emergency & Civil Disturbance Row */}
                <tr>
                  <td className={`border border-black px-3 py-3 align-top`}>
                    <p
                      className={`mb-2 ${A4_PDF_TYPOGRAPHY.body} leading-loose`}
                    >
                      Assess the situation:
                    </p>
                    <ul
                      className={`list-disc list-inside space-y-2 ${A4_PDF_TYPOGRAPHY.body} leading-loose`}
                    >
                      <li>
                        ● Do not move a participant unless they are exposed to a
                        life-threatening situation.
                      </li> <br />
                      <li>
                        ● In emergency situations contact the ambulance service by
                        dialling 000 then ring supervisor.
                      </li> <br />
                      <li>● Arrange for the ambulance to be met. </li> <br />
                      <li>
                        ● Remain with the participant and administer first aid as
                        appropriate until assistance arrives.{" "}
                      </li> <br />
                      <li>
                        ● Follow closely the instructions of emergency services
                        personnel.
                      </li> <br />
                    </ul>
                  </td>
                  <td className={`border border-black px-3 py-3 align-top`}>
                    <ul
                      className={`list-disc list-inside space-y-2 ${A4_PDF_TYPOGRAPHY.body} leading-loose`}
                    >
                      <li>
                        ● Keep well clear of the disturbance and do not say or do
                        anything that may encourage irrational behaviour.{" "}
                      </li> <br />
                      <li>
                        ● Consider locking down the building to prevent
                        unauthorised entry.
                      </li> <br />
                      <li>
                        ● Follow closely the instructions of emergency services
                        personnel and campus wardens.
                      </li> <br />
                      <li>
                        ● Evacuate the building only if instructed to do so by
                        emergency services personnel or campus warden.
                      </li> <br />
                    </ul>
                  </td>
                </tr>

                {/* Section Headers Row */}
                <tr className="bg-gray-200">
                  <td
                    className={`border border-black px-3 py-2 ${A4_PDF_TYPOGRAPHY.label} text-center`}
                  >
                    Extreme Weather
                  </td>
                  <td
                    className={`border border-black px-3 py-2 ${A4_PDF_TYPOGRAPHY.label} text-center`}
                  >
                    Personal Preparation
                  </td>
                </tr>

                {/* Extreme Weather & Personal Preparation Row */}
                <tr>
                  <td className={`border border-black px-3 py-3 align-top`}>
                    <ul
                      className={`list-disc list-inside space-y-2 ${A4_PDF_TYPOGRAPHY.body} leading-loose`}
                    >
                      <li>● Keep participant informed of Situation.</li> <br />
                      <li>
                        ● Move around premises and turn off electrical appliances
                        to ensure safety.{" "}
                      </li> <br />
                      <li>
                        ● Follow closely the instructions of emergency services
                        personnel.
                      </li> <br />
                      <li>
                        ● Evacuate the building only if instructed to do so by
                        emergency personnel.
                      </li> <br />
                      <li>
                        ● Keep in contact with supervisor and follow their
                        instructions. <br/>
                      </li> <br />
                    </ul>
                  </td>
                  <td className={`border border-black px-3 py-3 align-top`}>
                    <ul
                      className={`list-disc list-inside space-y-2 ${A4_PDF_TYPOGRAPHY.body} leading-loose`}
                    >
                      <li>
                        ● Know the location of emergency exits in your building.
                      </li> <br/>
                      <li>
                        ● Plan an escape route from the premises to safe
                        environment.
                      </li> <br/>
                      <li>
                        ● Identify and familiarise yourself evacuation point or a
                        safe location.
                      </li> <br/>
                      <li>
                        ● Familiarise yourself with location of any break glass
                        fire alarms.
                      </li> <br/>
                      <li>●  Note location of fire extinguishers.</li> <br/>
                      <li>
                        ● Familiarise yourself with the identity and location of
                        the first aid kits.{" "}
                      </li> <br/>
                    </ul>
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

export default Page12;
