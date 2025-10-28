import React from "react";
import A4PageWrapper from "./A4PageWrapper";
import { parseISO, isValid, format } from "date-fns";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from './page_FIXED';

interface Page9Props {
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
    <div className={`flex justify-between ${A4_PDF_TYPOGRAPHY.footer} px-1 text-gray-600`}>
      <span>Website: {settings?.company_website}</span>
      <span>{settings?.participant_risk_assessment}</span>
      <span>Review Date: {formatDate(settings?.review_date)}</span>
    </div>
  );
};

const Page9: React.FC<Page9Props> = ({
  data,
  commonFieldsData,
  settings,
  schema,
  images,
}) => {
  const cellClass = `border border-black px-2 py-1 ${A4_PDF_TYPOGRAPHY.tableCell}`;

  return (
    <A4PageWrapper>
      <div className="flex flex-col w-full h-full px-6 pt-[1mm] pb-[1mm] font-montserrat justify-between" style={{ minHeight: "100%", height: "100%" }}>
        
        <StandardHeader images={images} /> <br /><br />

        {/* Content Area */}
        <div className="flex-1 flex flex-col" style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
          
          {/* Risk Assessment Matrix Section */}
          <div className="mb-4">
            <p className={`${A4_PDF_TYPOGRAPHY.sectionHeader} text-center uppercase tracking-wider mb-3`}>
              Risk Assessment Matrix
            </p>
            <div className="flex justify-center mb-4">
              <img
                src={images?.riskAssessmentMatrix || "/risk-assessment-matrix.png"}
                alt="Risk Assessment Matrix"
                className="max-h-[100px] object-contain"
              />
            </div>
          </div>

          {/* Emergency Contact Numbers Table */}
          <div className="mb-4">
            <table className={`table-fixed border border-black w-full border-collapse ${A4_PDF_TYPOGRAPHY.tableCell}`}>
              <thead>
                <tr>
                  <th
                    colSpan={3}
                    className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-left bg-gray-300`}
                  >
                    Emergency Contact Numbers
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={`${cellClass} w-1/3 ${A4_PDF_TYPOGRAPHY.label}`}>
                    Police
                  </td>
                  <td
                    colSpan={2}
                    className={`${cellClass} text-center`}
                  >
                    <div className="flex justify-center">
                      <img
                        src={images?.emergencyNo || "/emergency-000.png"}
                        alt="000 Emergency"
                        className="max-h-[30px] object-contain"
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.label}`}>Fire</td>
                  <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.body}`}></td>
                  <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.body}`}></td>
                </tr>
                <tr>
                  <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.label}`}>Ambulance</td>
                  <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.body}`}></td>
                  <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.body}`}></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Utilities Table */}
          <div className="flex-1">
            <table className={`table-fixed border border-black w-full border-collapse ${A4_PDF_TYPOGRAPHY.tableCell}`}>
              <thead>
                <tr>
                  <th
                    colSpan={3}
                    className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader} text-left bg-gray-300`}
                  >
                    Utilities
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={`${cellClass} w-1/3 ${A4_PDF_TYPOGRAPHY.label}`}>
                    Electricity Authority
                  </td>
                  <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.body}`}>
                    Western Power
                  </td>
                  <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.body}`}>
                    13 13 51
                  </td>
                </tr>
                <tr>
                  <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.label}`}>
                    Water Authority
                  </td>
                  <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.body}`}>
                    Water Corp
                  </td>
                  <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.body}`}>
                    13 13 75
                  </td>
                </tr>
                <tr>
                  <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.label}`}>
                    Gas Authority
                  </td>
                  <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.body}`}>
                    {data?.gasAuthority || ""}
                  </td>
                  <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.body}`}>
                    {data?.gasAuthorityPhone || ""}
                  </td>
                </tr>
                <tr>
                  <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.label}`}>
                    Internet/Phone
                  </td>
                  <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.body}`}>
                    {data?.internetProvider || ""}
                  </td>
                  <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.body}`}>
                    {data?.internetProviderPhone || ""}
                  </td>
                </tr>
                <tr>
                  <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.label}`}>
                    Other
                  </td>
                  <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.body}`}>
                    {data?.otherUtility || ""}
                  </td>
                  <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.body}`}>
                    {data?.otherUtilityPhone || ""}
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

export default Page9;
