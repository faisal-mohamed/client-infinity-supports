import React from "react";
import A4PageWrapper from "./A4PageWrapper";
import { parseISO, isValid, format } from "date-fns";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from './page_FIXED';

interface Page10Props {
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

const Page10: React.FC<Page10Props> = ({
  data,
  commonFieldsData,
  settings,
  schema,
  images,
}) => {
  const cellClass = `border border-black px-2 py-4 ${A4_PDF_TYPOGRAPHY.tableCell}`;

  // Contact data arrays for better organization
  const utilityContacts = [
    { label: "Gas Authority", provider: "Gas Corp", phone: "13 13 52" },
    { label: "State Emergency", provider: "SES", phone: "13 25 00" }
  ];

  const keyContacts = [
    { label: "Health Direct", phone: "1800 022 222" },
    { label: "Poisons Line", phone: "13 11 26" },
    { label: "Lifeline (24 hours crisis counselling)", phone: "13 11 14" },
    { label: "Beyond Blue", phone: "1300 22 4636" },
    { label: "Crisis Care", phone: "1800 199 008" },
    { label: "NDIS", phone: "1800 800 110" }
  ];

  const emergencySupport = [
    {
      scenario: "Infinity is unable to support for extended period",
      support: "Infinity will assist the client/family to source alternative providers"
    },
    {
      scenario: "Client taken ill during support",
      support: "Call 000, Call family, take to nearest ED"
    },
    {
      scenario: "Closure of business",
      support: "Infinity will assist the client/family to source alternative providers"
    }
  ];

  return (
    <A4PageWrapper>
      <div className="flex flex-col w-full h-full px-6 pt-[1mm] pb-[1mm] font-montserrat justify-between" style={{ minHeight: "100%", height: "100%" }}>
        
        <StandardHeader images={images} /> <br /><br />

        {/* Content Area */}
        <div className="flex-1 flex flex-col" style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
          
          {/* Contacts Table */}
          <div className="flex-1">
            <table className={`table-fixed border border-black w-full border-collapse ${A4_PDF_TYPOGRAPHY.tableCell}`}>
              <tbody>
                {/* Utility Contacts */}
                {utilityContacts.map((contact, index) => (
                  <tr key={index}>
                    <td className={`${cellClass} w-1/3 ${A4_PDF_TYPOGRAPHY.label}`}>
                      {contact.label}
                    </td>
                    <td className={`${cellClass} w-1/3 ${A4_PDF_TYPOGRAPHY.body}`}>
                      {contact.provider}
                    </td>
                    <td className={`${cellClass} w-1/3 ${A4_PDF_TYPOGRAPHY.body}`}>
                      {contact.phone}
                    </td>
                  </tr>
                ))}

                {/* Other Key Contacts Section Header */}
                <tr className="bg-gray-300">
                  <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader}`} colSpan={3}>
                    Other Key Contacts
                  </td>
                </tr>

                {/* Key Contacts */}
                {keyContacts.map((contact, index) => (
                  <tr key={index}>
                    <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.label}`}>
                      {contact.label}
                    </td>
                    <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.body}`} colSpan={2}>
                      {contact.phone}
                    </td>
                  </tr>
                ))}

                {/* Mental Health Emergency Contact */}
                <tr>
                  <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.label}`}>
                    Mental Health Emergency Response Line
                  </td>
                  <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.body}`} colSpan={2}>
                    <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                      1300 555 788 (Perth)<br />
                      1300 676 822 (Peel)
                    </div>
                  </td>
                </tr>

                {/* Emergency Support Section Header */}
                <tr className="bg-gray-300">
                  <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.tableHeader}`} colSpan={3}>
                    Type of support to be put in place in the event of an emergency or disaster and how
                    we will support the participant (based on the Service agreement)
                  </td>
                </tr>

                {/* Emergency Support Header Row */}
                <tr className="bg-gray-100">
                  <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.label}`}>
                    Emergency
                  </td>
                  <td className={`${cellClass} ${A4_PDF_TYPOGRAPHY.label}`} colSpan={2}>
                    Support provided to the participants in the event of an emergency
                  </td>
                </tr>

                {/* Emergency Support Items */}
                {emergencySupport.map((item, index) => (
                  <tr key={index} className="align-top">
                    <td className={`${cellClass} align-top ${A4_PDF_TYPOGRAPHY.body}`} style={{ minHeight: "60px" }}>
                      <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                        {item.scenario}
                      </div>
                    </td>
                    <td className={`${cellClass} align-top ${A4_PDF_TYPOGRAPHY.body}`} colSpan={2} style={{ minHeight: "60px" }}>
                      <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                        {item.support}
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Additional Emergency Scenarios from form data */}
                {data?.additionalEmergencyScenarios && (
                  <tr className="align-top">
                    <td className={`${cellClass} align-top ${A4_PDF_TYPOGRAPHY.body}`} style={{ minHeight: "60px" }}>
                      <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                        Additional Scenarios
                      </div>
                    </td>
                    <td className={`${cellClass} align-top ${A4_PDF_TYPOGRAPHY.body}`} colSpan={2} style={{ minHeight: "60px" }}>
                      <div className={`${A4_PDF_TYPOGRAPHY.body} leading-loose`}>
                        {data.additionalEmergencyScenarios}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Footer settings={settings} />
      </div>
    </A4PageWrapper>
  );
};

export default Page10;
