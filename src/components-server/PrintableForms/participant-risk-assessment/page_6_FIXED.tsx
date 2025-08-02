import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { parseISO, isValid, format } from "date-fns";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from './page_FIXED';

interface Page6Props {
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

const Page6: React.FC<Page6Props> = ({ data, schema, commonFieldsData, settings, images }) => {
  const getCheckboxValue = (key: string) => data?.[key] === true;

  const cellClass = `border border-black px-2 py-2 ${A4_PDF_TYPOGRAPHY.tableCell}`;

  return (
    <A4PageWrapper>
      <div className="flex flex-col w-full h-full px-6 pt-[1mm] pb-[1mm] font-montserrat justify-between" style={{ minHeight: "100%", height: "100%" }}>
        
        <StandardHeader images={images} /> <br /><br />

        {/* Content Area */}
        <div className="flex-1 flex flex-col" style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
          
          {/* Risk Level Selection Table - Continuation from Page 5 */}
          <div className="flex-1">
            <table className={`table-fixed border border-black w-full border-collapse ${A4_PDF_TYPOGRAPHY.tableCell}`}>
              <thead>
                <tr className="bg-gray-300">
                  <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-left w-20`}>
                    Risk Level
                  </th>
                  <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-left`}>
                    Description
                  </th>
                  <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-left`}>
                    Criteria
                  </th>
                  <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-left`}>
                    Impact on Health-Safety
                  </th>
                  <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-center w-20`}>
                    Select Risk
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* High Risk */}
                <tr className="align-top bg-gray-100">
                  <td className={`${cellClass} font-semibold`} style={{color: 'yellow'}}>
                    High
                  </td>
                  <td className={`${cellClass} text-left`}>
                    <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                      Participants have a high reliance on provider services to meet essential daily living needs.
                    </div>
                  </td>
                  <td className={`${cellClass} text-left`}>
                    <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                      Participants require significant assistance from the provider for activities of daily living,
                      including personal care, mobility, meal preparation, and medication management. A disruption in
                      services would have a significant impact on their overall well-being and quality of life.
                    </div>
                  </td>
                  <td className={`${cellClass} text-left`}>
                    <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                      Disruptions in services would significantly impact participants' health and safety, as they rely
                      heavily on the provider for essential tasks. There could be risks related to personal care, medical
                      needs, and more.
                    </div>
                  </td>
                  <td className={`${cellClass} text-center`}>
                    <input
                      type="checkbox"
                      className="w-3 h-3"
                      checked={getCheckboxValue('riskLevelHigh')}
                      readOnly
                    />
                  </td>
                </tr>

                {/* Critical Risk */}
                <tr className="align-top">
                  <td className={`${cellClass} font-semibold`} style={{color: 'red'}}>
                    Critical
                  </td>
                  <td className={`${cellClass} text-left`}>
                    <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                      Participants have a critical reliance on provider services for all daily living needs.
                    </div>
                  </td>
                  <td className={`${cellClass} text-left`}>
                    <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                      Participants are entirely dependent on the provider for all activities of daily living, including
                      personal care, mobility, communication, medical support, and more. Any disruption in services would
                      pose a severe and immediate threat to their health and well-being.
                    </div>
                  </td>
                  <td className={`${cellClass} text-left`}>
                    <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                      Disruptions in services would pose a critical threat to participants' health and safety. Their
                      complete dependency on the provider means that any interruption could lead to life-threatening
                      situations.
                    </div>
                  </td>
                  <td className={`${cellClass} text-center`}>
                    <input
                      type="checkbox"
                      className="w-3 h-3"
                      checked={getCheckboxValue('riskLevelCritical')}
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

export default Page6;
