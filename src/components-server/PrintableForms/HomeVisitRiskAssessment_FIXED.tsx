import React from "react";
import { parseISO, isValid, format } from 'date-fns';

// ===== A4 PDF TYPOGRAPHY STANDARDS WITH MONTSERRAT =====
const A4_PDF_TYPOGRAPHY = {
  // Main content hierarchy
  title: 'text-base font-bold font-montserrat',           // 16px - Form titles
  sectionHeader: 'text-sm font-semibold font-montserrat', // 14px - Section headers
  subHeader: 'text-xs font-semibold font-montserrat',     // 12px - Subsection headers
  body: 'text-xs font-normal font-montserrat',            // 12px - Main content
  label: 'text-xs font-medium font-montserrat',           // 12px - Field labels
  input: 'text-xs font-normal font-montserrat',           // 12px - Input content
  small: 'text-xs font-normal font-montserrat',           // 10px - Fine print
  footer: 'text-xs font-normal font-montserrat',          // 10px - Footer content
  
  // Table specific
  tableHeader: 'text-xs font-bold font-montserrat',       // 12px - Table headers
  tableCell: 'text-xs font-normal font-montserrat',       // 12px - Table content
  
  // Signature section
  signatureLabel: 'text-xs font-semibold font-montserrat', // 12px - Signature labels
  signatureContent: 'text-xs font-bold font-montserrat',   // 12px - Signature content
} as const;

// ===== PDF-SPECIFIC FONT STYLES =====
const PDF_FONT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
  
  * {
    font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  }
  
  .font-montserrat {
    font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  }
  
  /* Ensure consistent rendering across different environments */
  .pdf-container {
    font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
` as const;

// ===== STANDARDIZED LOGO CONFIGURATION =====
const STANDARD_LOGO = {
  width: 180,
  height: 72,
  className: "object-contain"
} as const;

const formatDate = (value: string | undefined | null): string => {
  if (!value || typeof value !== 'string') return '';

  console.log("🧪 Raw review_date value:", value);

  try {
    const parsed = parseISO(value);
    if (isValid(parsed)) {
      return format(parsed, 'dd-MM-yyyy');
    }
  } catch (e) {}

  // Handle YYYY-MM-DD manually (with or without time)
  const matchISO = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (matchISO) {
    const [, yyyy, mm, dd] = matchISO;
    return `${dd}-${mm}-${yyyy}`;
  }

  // Handle DD/MM/YYYY -> just return it if valid-looking
  const matchDMY = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (matchDMY) {
    return value;
  }

  return value;
};

// --- Schema & Response Data ---
const homeVisitSchema: any = {
  metadataFields: [
    { label: "Name", key: "name" },
    { label: "NDIS Number", key: "ndisNumber" },
    { label: "DOB", key: "dob" },
    { label: "Address", key: "address" },
    { label: "Date of completion of risk assessment", key: "completionDate" }
  ],
  pages: [
    {
      title: "Page 1",
      sections: [
        {
          title: "CLIENT AND FAMILY",
          fields: [
            { label: "Will anyone else be present during the visit?", key: "visitCompany" },
            { label: "Any history of verbal or physical aggression from the client or family?", key: "aggressionHistory" },
            { label: "Any history of alcohol or drug use?", key: "drugUseHistory" },
            { label: "Is there an advanced care directive?", key: "careDirective" }
          ]
        },
        {
          title: "ENVIRONMENT",
          fields: [
            { label: "If there are any pets, has the client agreed to restrain them during the visit?", key: "petsRestrained" },
            { label: "Are there any weapons in the home?", key: "weaponsInHome" }
          ]
        }
      ]
    },
    {
      title: "Page 2",
      sections: [
        {
          fields: [
            { label: "If there are any smokers, have they agreed to refrain from smoking during the visit?", key: "smokingAgreement" },
            { label: "Are there smoke detectors present and in working condition?", key: "smokeDetectors" },
            { label: "Any apparent fire hazards?", key: "fireHazards" },
          ]
        },
        {
          title: "GEOGRAPHICAL LOCATION",
          fields: [
            { label: "Are there any difficulties locating the address/access to the building?", key: "accessDifficulties" },
            { label: "Is there parking available?", key: "parking" },
            {
              label: "Is entry via the front door? If no, which door is used for entry?",
              key: "entryPoint",
              type: "checkboxGroup",
              options: ["Left side", "Right Side", "Rear", "Front Door", "Other"]
            },
            { label: "Are there any issues with mobile phone reception?", key: "mobileReception" }
          ]
        }
      ]
    },
    {
      title: "Page 3",
      type: "static",
      image: "/home_risk_assessment.png",
      content: [
        {
          heading: "Risk Assessment Outcome – Proceed with Visit as follows:",
          blocks: [
            {
              title: "LOW GREEN",
              color: "green",
              text: "Visit acceptable. Ensure control options are followed."
            },
            {
              title: "MEDIUM YELLOW",
              color: "yellow",
              text: "Visit should only proceed after consultation with Manager. The risks should be reviewed to consider all the hazards involved. The risks must be reduced prior to the visit – if in doubt, re-classify as Moderate Risk."
            },
            {
              title: "MODERATE ORANGE",
              color: "orange",
              text: "Visit should only proceed after consultation with Director. The risks should be reviewed to consider all the hazards involved. The risks must be reduced prior to the visit – if in doubt, re-classify as High Risk."
            },
            {
              title: "HIGH RED",
              color: 'red',
              text: 'Visit must only proceed with Director approval. The risks associated with the visit must be re-assessed & other options considered.'
            }
          ]
        }
      ]
    },
    {
      title: "Page 4",
      type: "table",
      // riskLevel: {
      //   label: "HIGH RED",
      //   description: "Visit must only proceed with Director approval. The risks associated with the visit must be re-assessed & other options considered."
      // },
      fields: [
        { label: "Issue/Task", key: "issue1" },
        { label: "Risk Score", key: "riskScore1" },
        { label: "Control Measure", key: "control1" },
        { label: "Person Responsible", key: "responsible1" },
        { label: "Issue/Task", key: "issue2" },
        { label: "Risk Score", key: "riskScore2" },
        { label: "Control Measure", key: "control2" },
        { label: "Person Responsible", key: "responsible2" },
        { label: "Issue/Task", key: "issue3" },
        { label: "Risk Score", key: "riskScore3" },
        { label: "Control Measure", key: "control3" },
        { label: "Person Responsible", key: "responsible3" }
      ]
    },
  ],
};

// --- A4 Page Wrapper Component ---
const A4Page = ({ children, className = "" }: any) => (
  <div className={`
    a4-page
    w-[210mm] h-[297mm] 
    mx-auto mb-8 
    bg-white 
    shadow-lg 
    border border-gray-300
    flex flex-col
    ${className}
  `}>
    {children}
  </div>
);

// --- Standardized Header Component ---
const StandardHeader = ({ images, title }: { images?: any, title?: string }) => (
  <div className="flex flex-col items-center pt-6 pb-4">
    <img
      src={images?.infinityLogo || "/infinity_logo.png"}
      alt="Logo"
      width={STANDARD_LOGO.width}
      height={STANDARD_LOGO.height}
      className={STANDARD_LOGO.className}
    /> <br /><br />
    {title && (
      <h2 className={`${A4_PDF_TYPOGRAPHY.title} text-center mt-2`}>
        {title}
      </h2>
    )}
  </div>
);

// --- Standardized Footer Component ---
const Footer = ({ settings }: { settings: any }) => (
  <div className={`flex justify-between items-center ${A4_PDF_TYPOGRAPHY.footer} px-6 py-3 mt-auto border-t border-gray-200`}>
    <div>
      <a
        href={`https://${settings?.company_website}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline hover:text-blue-800"
      >
        {settings?.company_website}
      </a>
    </div>
    <div className="font-medium">{settings?.home_visit_form_id}</div>
    <div className="font-medium">Review Date: {formatDate(settings?.review_date)}</div>
  </div>
);

// --- Page Components ---
const Page1 = ({ homeVisitResponse, images, commonFields, settings }: any) => (
  <A4Page>
    <StandardHeader images={images} title="Home & Visit Risk Assessment" />

    {/* Metadata Section */}
    <div className="px-6">
      <table className={`w-full border border-black ${A4_PDF_TYPOGRAPHY.tableCell} table-fixed`}>
        <tbody>
          <tr>
            <td className="border border-black p-2 w-1/3">
              <span className={A4_PDF_TYPOGRAPHY.label}>Name:</span> {commonFields?.name || homeVisitResponse.name || ''}
            </td>
            <td className="border border-black p-2 w-1/3">
              <span className={A4_PDF_TYPOGRAPHY.label}>NDIS Number:</span> {commonFields?.ndis || homeVisitResponse.ndisNumber || ''}
            </td>
            <td className="border border-black p-2 w-1/3">
              <span className={A4_PDF_TYPOGRAPHY.label}>DOB:</span> {commonFields?.dob || homeVisitResponse.dob || ''}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2" colSpan={3}>
              <span className={A4_PDF_TYPOGRAPHY.label}>Address:</span> {commonFields?.street || homeVisitResponse.address || ''}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2" colSpan={3}>
              <span className={A4_PDF_TYPOGRAPHY.label}>Date of completion of risk assessment:</span> {formatDate(homeVisitResponse.completionDate)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    {/* Main Table */}
    <div className="flex-1 px-6 py-4 flex flex-col">
      <table className={`w-full border-collapse border border-black ${A4_PDF_TYPOGRAPHY.tableCell} flex-1`}>
        <thead>
          <tr>
            <th className={`border border-black w-[40%] p-2 ${A4_PDF_TYPOGRAPHY.tableHeader}`}></th>
            <th className={`border border-black w-[7%] text-center p-2 ${A4_PDF_TYPOGRAPHY.tableHeader}`}>YES</th>
            <th className={`border border-black w-[7%] text-center p-2 ${A4_PDF_TYPOGRAPHY.tableHeader}`}>NO</th>
            <th className={`border border-black w-[46%] p-2 ${A4_PDF_TYPOGRAPHY.tableHeader}`}>COMMENTS</th>
          </tr>
        </thead>
        <tbody className="h-full">
          {homeVisitSchema.pages[0].sections.map((section: any) => (
            <React.Fragment key={section.title}>
              <tr className="bg-gray-300">
                <td className={`border border-black p-3 ${A4_PDF_TYPOGRAPHY.sectionHeader} text-left`} colSpan={4}>
                  {section.title}
                </td>
              </tr>
              {section.fields.map((field: any) => (
                <tr key={field.key} className="align-top">
                  <td className={`border border-black p-3 w-[40%] ${A4_PDF_TYPOGRAPHY.label}`}>
                    {field.label}
                  </td>
                  <td className="border border-black text-center w-[7%]">
                    {homeVisitResponse[field.key]?.toLowerCase() === "yes" ? (<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="12"
    height="12"
    fill="none"
    stroke="black"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="inline-block"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>) : ""}
                  </td>
                  <td className="border border-black text-center w-[7%]">
                    {homeVisitResponse[field.key]?.toLowerCase() === "no" ? (<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="12"
    height="12"
    fill="none"
    stroke="black"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="inline-block"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>) : ""}
                  </td>
                  <td className={`border border-black p-3 w-[46%] ${A4_PDF_TYPOGRAPHY.tableCell}`}>
                    {homeVisitResponse[field.key + "_comments"] || ""}
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>

    <Footer settings={settings} />
  </A4Page>
);

const Page2 = ({ homeVisitResponse, images, commonFields, settings }: any) => {
  const page = homeVisitSchema.pages[1];

  return (
    <A4Page>
      <StandardHeader images={images} />

      {/* Table */}
      <div className="flex-1 px-6 py-4 flex flex-col">
        <table className={`w-full border-collapse border border-black ${A4_PDF_TYPOGRAPHY.tableCell} flex-1`}>
          <thead>
            <tr>
              <th className={`border border-black w-[40%] p-2 ${A4_PDF_TYPOGRAPHY.tableHeader}`}>Question</th>
              <th className={`border border-black w-[7%] text-center p-2 ${A4_PDF_TYPOGRAPHY.tableHeader}`}>YES</th>
              <th className={`border border-black w-[7%] text-center p-2 ${A4_PDF_TYPOGRAPHY.tableHeader}`}>NO</th>
              <th className={`border border-black w-[46%] p-2 ${A4_PDF_TYPOGRAPHY.tableHeader}`}>COMMENTS</th>
            </tr>
          </thead>
          <tbody className="h-full">
            {page.sections.map((section: any, sectionIndex: number) => (
              <React.Fragment key={sectionIndex}>
                {section.title && (
                  <tr className="bg-gray-300">
                    <td colSpan={4} className={`border border-black p-3 ${A4_PDF_TYPOGRAPHY.sectionHeader}`}>
                      {section.title}
                    </td>
                  </tr>
                )}
                {section.fields.map((field: any) => {
                  const value = homeVisitResponse[field.key];
                  const comments = homeVisitResponse[field.key + "_comments"] || "";

                  if (field.type === "checkboxGroup") {
                    return (
                      <tr key={field.key}>
                        <td className={`border border-black p-3 align-top ${A4_PDF_TYPOGRAPHY.label}`}>
                          {field.label}
                        </td>
                        <td className="border border-black text-center align-top"></td>
                        <td className="border border-black text-center align-top"></td>
                        <td className={`border border-black p-3 align-top ${A4_PDF_TYPOGRAPHY.tableCell}`}>
                          <div className="space-y-1">
                            {field.options.map((opt: any) => (
                              <label key={opt} className={`flex items-center ${A4_PDF_TYPOGRAPHY.small}`}>
                                <input
                                  type="checkbox"
                                  checked={Array.isArray(value) && value.includes(opt)}
                                  readOnly
                                  className="mr-2 h-3 w-3"
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                            {comments && <div className={`${A4_PDF_TYPOGRAPHY.small} mt-1 italic`}>{comments}</div>}
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={field.key}>
                      <td className={`border border-black p-3 align-top ${A4_PDF_TYPOGRAPHY.label}`}>
                        {field.label}
                      </td>
                      <td className="border border-black text-center align-top">
                        {value?.toLowerCase() === "yes" ? (<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="12"
    height="12"
    fill="none"
    stroke="black"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="inline-block"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>) : ""}
                      </td>
                      <td className="border border-black text-center align-top">
                        {value?.toLowerCase() === "no" ? (<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="12"
    height="12"
    fill="none"
    stroke="black"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="inline-block"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>) : ""}
                      </td>
                      <td className={`border border-black p-3 align-top ${A4_PDF_TYPOGRAPHY.tableCell}`}>
                        {comments}
                      </td>
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <Footer settings={settings} />
    </A4Page>
  );
};

const Page3 = ({ homeVisitResponse, images, commonFields, settings }: any) => {
  const page = homeVisitSchema.pages[2];

  console.log("page-----------: ", page.content)

  return (
    <A4Page>
      <StandardHeader images={images} />

      {/* Content */}
      <div className="flex-1 px-6 py-4">
        {/* Risk Assessment Image */}
        <div className="mb-6 flex justify-center">
          <img 
            src={images?.riskMatrix || page.image} 
            alt="Risk Matrix" 
            className="max-w-full h-auto border border-gray-300 rounded"
          />
        </div>

        {/* Risk Level Descriptions */}
        {page.content.map((section: any, idx: number) => (
          <div key={idx} className="space-y-4">
            <h3 className={`${A4_PDF_TYPOGRAPHY.sectionHeader} underline text-center mb-4`}>
              {section.heading}
            </h3>
            <div className="space-y-3">
              {section.blocks.map((block: any, i: number) => (
                <div key={i} className="border-l-4 border-gray-300 pl-4">
                  <h4 className={`${A4_PDF_TYPOGRAPHY.subHeader} mb-2`}>
                    <span>{block.title.split(" ")[0]} </span>
                    <span className={`
                      ${block.color === 'green' ? 'text-green-600' : ''}
                      ${block.color === 'yellow' ? 'text-yellow-600' : ''}
                      ${block.color === 'orange' ? 'text-orange-600' : ''}
                      ${block.color === 'red' ? 'text-red-600' : ''}

                    `}>
                      {block.title.split(" ")[1]}
                    </span>
                  </h4>
                  <p className={`${A4_PDF_TYPOGRAPHY.body} leading-relaxed text-gray-700`}>
                    {block.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Footer settings={settings} />
    </A4Page>
  );
};

const Page4 = ({ homeVisitResponse, images, commonFields, settings }: any) => {
  const page = homeVisitSchema.pages[3];

  return (
    <A4Page>
      <StandardHeader images={images} />

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col">
        {/* Risk Level Header */}
        {/* <div className="px-6 py-4 bg-red-50 border-b border-red-200">
          <div className={`${A4_PDF_TYPOGRAPHY.sectionHeader} mb-2`}>
            <span>{page.riskLevel.label.split(" ")[0]} </span>
            <span className="text-red-600">{page.riskLevel.label.split(" ")[1]}</span>
          </div>
          <p className={`${A4_PDF_TYPOGRAPHY.body} text-gray-700 leading-relaxed`}>
            {page.riskLevel.description}
          </p>
        </div> */}

        {/* Risk Assessment Table */}
        <div className="flex-1 px-6 pb-4 overflow-hidden flex flex-col">
          <div className="overflow-auto flex-1">
            <table className={`w-full border-collapse border border-black ${A4_PDF_TYPOGRAPHY.tableCell}`}>
              <thead>
                <tr className="bg-gray-400">
                  <th className={`border border-black px-4 py-3 text-left ${A4_PDF_TYPOGRAPHY.tableHeader} text-black`}>
                    Issue/Task
                  </th>
                  <th className={`border border-black px-4 py-3 text-left ${A4_PDF_TYPOGRAPHY.tableHeader} text-black`}>
                    Risk Score
                  </th>
                  <th className={`border border-black px-4 py-3 text-left ${A4_PDF_TYPOGRAPHY.tableHeader} text-black`}>
                    Control Measure
                  </th>
                  <th className={`border border-black px-4 py-3 text-left ${A4_PDF_TYPOGRAPHY.tableHeader} text-black`}>
                    Person Responsible
                  </th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((row) => (
                  <tr key={row} className="min-h-[80px]">
                    <td className={`border border-black px-4 py-6 align-top ${A4_PDF_TYPOGRAPHY.tableCell}`}>
                      {homeVisitResponse[`issue${row}`] || ""}
                    </td>
                    <td className={`border border-black px-4 py-6 align-top ${A4_PDF_TYPOGRAPHY.tableCell}`}>
                      {homeVisitResponse[`riskScore${row}`] || ""}
                    </td>
                    <td className={`border border-black px-4 py-6 align-top ${A4_PDF_TYPOGRAPHY.tableCell}`}>
                      {homeVisitResponse[`control${row}`] || ""}
                    </td>
                    <td className={`border border-black px-4 py-6 align-top ${A4_PDF_TYPOGRAPHY.tableCell}`}>
                      {homeVisitResponse[`responsible${row}`] || ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer settings={settings} />
    </A4Page>
  );
};

const Page5 = ({ homeVisitResponse, images, commonFields, settings }: any) => (
  <A4Page>
    <StandardHeader images={images} />

    {/* Signature Section */}
    <div className="flex-1 px-12 pt-6 pb-8">
      <div className={`grid grid-cols-3 gap-12 ${A4_PDF_TYPOGRAPHY.body}`}>
        {/* Name */}
        <div className="text-center">
          <div className={`${A4_PDF_TYPOGRAPHY.signatureLabel} mb-2`}>Name:</div>
          <div className={`border-b-2 border-black pb-1 min-h-[24px] ${A4_PDF_TYPOGRAPHY.signatureContent}`}>
            {homeVisitResponse?.authorName}
          </div>
        </div>

        {/* Signature */}
        <div className="text-center">
          <div className={`${A4_PDF_TYPOGRAPHY.signatureLabel} mb-2`}>Signature:</div>
          <div className="border-b-2 border-black pb-1 min-h-[50px] flex justify-center items-center">
            {homeVisitResponse?.signature ? (
              <img
                src={homeVisitResponse?.signature}
                alt="Signature"
                className="max-h-[40px] object-contain"
                style={{ maxWidth: "120px" }}
              />
            ) : (
              <span className={`text-gray-400 italic ${A4_PDF_TYPOGRAPHY.small}`}>No signature</span>
            )}
          </div>
        </div>

        {/* Designation */}
        <div className="text-center">
          <div className={`${A4_PDF_TYPOGRAPHY.signatureLabel} mb-2`}>Designation:</div>
          <div className={`border-b-2 border-black pb-1 min-h-[24px] ${A4_PDF_TYPOGRAPHY.signatureContent}`}>
            {homeVisitResponse?.designation}
          </div>
        </div>
      </div>
    </div>

    <Footer settings={settings} />
  </A4Page>
);

// --- Main Component ---
const HomeVisitRiskAssessment = ({ formData, images, commonFields, settings }: any) => (
  <div className="pdf-container bg-gray-100 min-h-screen py-8 font-montserrat">
    <style dangerouslySetInnerHTML={{ __html: PDF_FONT_STYLES }} />
    <Page1 homeVisitResponse={formData} images={images} commonFields={commonFields} settings={settings} />
    <Page2 homeVisitResponse={formData} images={images} commonFields={commonFields} settings={settings} />
    <Page3 homeVisitResponse={formData} images={images} commonFields={commonFields} settings={settings} />
    <Page4 homeVisitResponse={formData} images={images} commonFields={commonFields} settings={settings} />
    <Page5 homeVisitResponse={formData} images={images} commonFields={commonFields} settings={settings} />
  </div>
);

export default HomeVisitRiskAssessment;
