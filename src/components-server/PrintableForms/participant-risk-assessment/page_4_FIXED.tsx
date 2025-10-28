import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { parseISO, isValid, format } from "date-fns";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from './page_FIXED';

interface Page4Props {
  schema: any;
  data: Record<string, string>;
  commonFieldsData: Record<string, string>;
  settings: any;
  images?: any;
}

// --- Standardized Header Component ---
const StandardHeader = ({ images }: { images?: any }) => (
  <div className="flex flex-col gap-[2px]">
    <div className="flex justify-center">
      <img
        src={images?.infinityLogo || "/infinity_logo.png"}
        alt="Logo"
        width={STANDARD_LOGO.width}
        height={STANDARD_LOGO.height}
        className={STANDARD_LOGO.className}
      />
    </div>  <br /><br />
    <div className={`text-center ${A4_PDF_TYPOGRAPHY.sectionHeader} mt-2`}>
      MEDICATION
    </div>
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

const Page4: React.FC<Page4Props> = ({
  data,
  schema,
  settings,
  commonFieldsData,
  images
}) => {
  const fields = schema?.fields || [];

  const getCheckboxValue = (key: string) => {
    return data?.[key]?.toLowerCase?.() === 'yes';
  };

  const getNoCheckboxValue = (key: string) => {
    return data?.[key]?.toLowerCase?.() === 'no';
  };

  const cellClass = `border border-black px-2 py-1 ${A4_PDF_TYPOGRAPHY.tableCell}`;

  return (
    <A4PageWrapper>
      <div className="flex flex-col w-full h-full px-6 pt-[1mm] pb-[1mm] font-montserrat justify-between" style={{ minHeight: "100%", height: "100%" }}>
        
        <StandardHeader images={images} />

        {/* Content Area - Divided into Table (1/3) and Instructions (2/3) */}
        <div className="flex-1 flex flex-col" style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
          
          {/* Medication Table - Takes 1/3 of available space */}
          <div className="flex-1" style={{ maxHeight: "33%" }}>
            <table className={`table-fixed border border-black w-full border-collapse ${A4_PDF_TYPOGRAPHY.tableCell}`}>
              <thead>
                <tr className="bg-[#a9b9d9]">
                  <th className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-left`} style={{backgroundColor: 'cyan'}}>
                    Management of Medication
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={`${cellClass} text-left align-top`}>
                    <p className={`mb-4 ${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                      Should any of the below be marked as <strong>YES</strong>, refer to
                      <strong> Form 24. Management of Medication</strong>
                    </p>

                    <div className="space-y-3">
                      {fields?.map?.((field: any) => (
                        <div key={field?.key}>
                          <p className={`mb-2 ${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                            {field?.label}
                          </p>
                          <div className="flex gap-6">
                            <label className="inline-flex items-center gap-2">
                              <input
                                type="checkbox"
                                className="w-3 h-3"
                                checked={getCheckboxValue(field?.key)}
                                readOnly
                              />
                              <span className={`${A4_PDF_TYPOGRAPHY.body}`}>YES</span>
                            </label>
                            <label className="inline-flex items-center gap-2">
                              <input
                                type="checkbox"
                                className="w-3 h-3"
                                checked={getNoCheckboxValue(field?.key)}
                                readOnly
                              />
                              <span className={`${A4_PDF_TYPOGRAPHY.body}`}>NO</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Instructions Section - Takes remaining 2/3 of available space */}
          <div className="flex-2 pt-6" style={{ minHeight: "67%" }}>
            <h3 className={`text-center ${A4_PDF_TYPOGRAPHY.sectionHeader} mb-4`}>
              Participant Dependency and Health-Safety Risk Assessment Table
            </h3>

            <p className={`mb-4 ${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
              Steps to Use the Extended Table:
            </p>

            <ol className="list-decimal list-inside space-y-4">
              <li className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                <span className="font-semibold">Assessment:</span> Evaluate both the level of reliance on your services and the potential impact on health and safety for each participant. <br /><br />
              </li>
              
              <li className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                <span className="font-semibold">Categorisation:</span> Assign the appropriate risk level based on the combined assessment of reliance and health-safety impact.<br /><br />
              </li>
              
              <li className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                <span className="font-semibold">Mitigation:</span> Develop strategies and contingency plans that address not only the level of reliance but also the specific health and safety concerns identified for each risk level.<br /><br />
              </li>
              
              <li className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                <span className="font-semibold">Regular Review:</span> Continuously review and update the risk assessment and mitigation strategies, considering any changes in participants' needs and potential risks.<br /><br />
              </li>
            </ol>
          </div>
        </div>

        <Footer settings={settings} />
      </div>
    </A4PageWrapper>
  );
};

export default Page4;
