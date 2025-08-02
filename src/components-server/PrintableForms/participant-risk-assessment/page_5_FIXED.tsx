import React from "react";
import A4PageWrapper from "./A4PageWrapper";
import { parseISO, isValid, format } from "date-fns";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from "./page_FIXED";

interface Page5Props {
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
    <div
      className={`flex justify-between ${A4_PDF_TYPOGRAPHY.footer} px-1 text-gray-600`}
    >
      <span>Website: {settings?.company_website}</span>
      <span>{settings?.participant_risk_assessment}</span>
      <span>Review Date: {formatDate(settings?.review_date)}</span>
    </div>
  );
};

const Page5: React.FC<Page5Props> = ({ data, schema, settings, images }) => {
  const getCheckboxValue = (key: string) => data?.[key] === true;

  const cellClass = `border border-black px-2 py-2 ${A4_PDF_TYPOGRAPHY.tableCell}`;

  return (
    <A4PageWrapper>
      <div
        className="flex flex-col w-full h-full px-6 pt-[1mm] pb-[1mm] font-montserrat justify-between"
        style={{ minHeight: "100%", height: "100%" }}
      >
        <StandardHeader images={images} />
        <br /><br />
        {/* Content Area */}

        <div
          className="flex-1 flex flex-col"
          style={{ pageBreakInside: "avoid", breakInside: "avoid" }}
        >
          {/* Introduction Section with proper line spacing */}
          <div className="mb-6">
            <ul className="list-none space-y-4 mb-6">
              <li className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                5. <span className={`${A4_PDF_TYPOGRAPHY.label}`}>
                  Communication:
                </span>{" "}
                Ensure that all stakeholders, including participants, families,
                and your team, understand the dual assessment of reliance and
                health-safety impact, as well as the corresponding mitigation
                plans.
              </li>  <br /><br />
              <li className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                6. <span className={`${A4_PDF_TYPOGRAPHY.label}`}>
                  Emergency Planning:
                </span>{" "}
                For participants with higher risk levels, develop emergency
                plans that outline steps to be taken in case of service
                disruptions or unexpected events.
              </li>
            </ul>

            <p className={`mb-6 ${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
              By considering both the participants' level of reliance on the
              services and the potential consequences for their health and
              safety in case of disruptions, we can create a more comprehensive
              risk assessment framework that prioritises their well-being.
            </p>
          </div>

          {/* Risk Level Selection Table */}
          <div className="flex-1">
            <table
              className={`table-fixed border border-black w-full border-collapse ${A4_PDF_TYPOGRAPHY.tableCell}`}
            >
              <thead>
                <tr className="bg-gray-300">
                  <th
                    className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-left w-20`}
                  >
                    Risk Level
                  </th>
                  <th
                    className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-left`}
                  >
                    Description
                  </th>
                  <th
                    className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-left`}
                  >
                    Criteria
                  </th>
                  <th
                    className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-left`}
                  >
                    Impact on Health-Safety
                  </th>
                  <th
                    className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-center w-20`}
                  >
                    Select Risk
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="align-top">
                  <td className={`${cellClass} text-green-600 font-semibold`}>
                    Low
                  </td>
                  <td className={`${cellClass} text-left`}>
                    <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                      Participants have a low reliance on provider services to
                      meet daily living needs.
                    </div>
                  </td>
                  <td className={`${cellClass} text-left`}>
                    <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                      Participants can independently perform most daily living
                      activities without assistance. Any disruptions in services
                      would have minimal impact on their overall well-being.
                    </div>
                  </td>
                  <td className={`${cellClass} text-left`}>
                    <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                      Disruptions in services would have minimal impact on
                      participants' health and safety, as they can manage most
                      activities independently.
                    </div>
                  </td>
                  <td className={`${cellClass} text-center`}>
                    <input
                      type="checkbox"
                      className="w-3 h-3"
                      checked={getCheckboxValue("riskLevelLow")}
                      readOnly
                    />
                  </td>
                </tr>

                <tr className="align-top">
                  <td className={`${cellClass} font-semibold`} style={{color: 'lightblue'}}>
                    Moderate
                  </td>
                  <td className={`${cellClass} text-left`}>
                    <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                      Participants have a moderate reliance on provider services
                      for certain daily living needs.
                    </div>
                  </td>
                  <td className={`${cellClass} text-left`}>
                    <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                      Participants can perform some daily activities
                      independently but rely on the provider for specific tasks
                      such as transportation, meal preparation, or medication
                      management. A disruption in services could moderately 
affect their overall 
well-being. 
                    </div>
                  </td>
                  <td className={`${cellClass} text-left`}>
                    <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                      Disruptions in services could moderately impact
                      participants' health and safety, particularly for tasks they rely on the 
provider to assist with.
                    </div>
                  </td>
                  <td className={`${cellClass} text-center`}>
                    <input
                      type="checkbox"
                      className="w-3 h-3"
                      checked={getCheckboxValue("riskLevelModerate")}
                      readOnly
                    />
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

export default Page5;
