"use client";

import React from "react";

// --- Schema & Response Data ---
const homeVisitSchema = {
  logo: {
    page1: {
      src: "/infinity_logo.png",
      width: 150,
      height: 60
    },
    page2: {
      src: "/infinity_logo.png",
      width: 200,
      height: 80
    },
    page3: {
      src: "/infinity_logo.png",
      width: 250,
      height: 100
    },
  },
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
          title: "SAFETY & ACCESS",
          fields: [
            { label: "If there are any smokers, have they agreed to refrain from smoking during the visit?", key: "smokingAgreement" },
            { label: "Are there smoke detectors present and in working condition?", key: "smokeDetectors" },
            { label: "Any apparent fire hazards?", key: "fireHazards" },
            { label: "Are there any difficulties locating the address/access to the building?", key: "accessDifficulties" },
            { label: "Is there parking available?", key: "parking" },
            {
              label: "Is entry via the front door? If no, which door is used for entry?",
              key: "entryPoint",
              type: "checkboxGroup",
              options: ["Left side", "Right Side", "Rear", "Other"]
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
            }
          ]
        }
      ]
    },
    {
      title: "Page 4",
      type: "table",
      riskLevel: {
        label: "HIGH RED",
        description: "Visit must only proceed with Director approval. The risks associated with the visit must be re-assessed & other options considered."
      },
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
  footer: {
    left: "Document Number: CF012",
    center: "www.infinitysupportwa.org",
    right: "DOR: 14/03/2026"
  }
};

const homeVisitResponse = {
  name: "John Doe",
  ndisNumber: "123456789",
  dob: "01/01/1990",
  address: "123 Main St, Perth, WA",
  completionDate: "2025-07-01",

  visitCompany: "Yes",
  aggressionHistory: "No",
  drugUseHistory: "No",
  careDirective: "Yes",
  petsRestrained: "Yes",
  weaponsInHome: "No",
  smokingAgreement: "Yes",
  smokeDetectors: "Yes",
  fireHazards: "No",
  accessDifficulties: "No",
  parking: "Street parking available",
  entryPoint: ["Left side", "Rear"],
  mobileReception: "Weak signal inside",
  
  issue1: "",
  riskScore1: "",
  control1: "",
  responsible1: "",

  issue2: "",
  riskScore2: "",
  control2: "",
  responsible2: "",

  issue3: "",
  riskScore3: "",
  control3: "",
  responsible3: "",

  designation: "Support Worker",
  signature: "John Smith",
};

// --- A4 Page Wrapper Component ---
const A4Page = ({ children, className = "" }) => (
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

// --- Footer Component ---
const Footer = () => (
  <div className="flex justify-between items-center text-[10px] px-6 py-3 mt-auto border-t border-gray-200">
    <div className="font-medium">{homeVisitSchema.footer.left}</div>
    <div>
      <a
        href={`https://${homeVisitSchema.footer.center}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline hover:text-blue-800"
      >
        {homeVisitSchema.footer.center}
      </a>
    </div>
    <div className="font-medium">{homeVisitSchema.footer.right}</div>
  </div>
);

// --- Page Components ---
const Page1 = () => (
  <A4Page>
    {/* Header with Logo */}
    <div className="flex justify-center pt-6 pb-4">
      <img
        src={homeVisitSchema.logo.page1.src}
        alt="Logo"
        width={homeVisitSchema.logo.page1.width}
        height={homeVisitSchema.logo.page1.height}
        className="object-contain"
      />
    </div>

    {/* Metadata Section */}
    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
        {homeVisitSchema.metadataFields.map((field) => (
          <div key={field.key} className="flex">
            <span className="font-semibold min-w-[120px]">{field.label}:</span>
            <span className="ml-2">{homeVisitResponse[field.key]}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Content Table */}
    <div className="flex-1 px-6 py-4">
      <table className="w-full border-collapse border border-black text-sm">
        <tbody>
          {homeVisitSchema.pages[0].sections.map((section) => (
            <React.Fragment key={section.title}>
              <tr className="bg-gray-300">
                <td className="border border-black p-3 font-bold text-center" colSpan={2}>
                  {section.title}
                </td>
              </tr>
              {section.fields.map((field) => (
                <tr key={field.key}>
                  <td className="border border-black p-3 align-top w-3/5 font-medium">
                    {field.label}
                  </td>
                  <td className="border border-black p-3 align-top w-2/5">
                    {homeVisitResponse[field.key] || ""}
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>

    <Footer />
  </A4Page>
);

const Page2 = () => {
  const section = homeVisitSchema.pages[1].sections[0];

  return (
    <A4Page>
      {/* Header with Logo */}
      <div className="flex justify-center pt-6 pb-4">
        <img
          src={homeVisitSchema.logo.page2.src}
          alt="Logo"
          width={homeVisitSchema.logo.page2.width}
          height={homeVisitSchema.logo.page2.height}
          className="object-contain"
        />
      </div>

      {/* Content Table */}
      <div className="flex-1 px-6 py-4">
        <table className="w-full border-collapse border border-black text-sm">
          <thead>
            <tr className="bg-gray-300">
              <th className="border border-black p-3 font-bold text-center" colSpan={4}>
                {section.title}
              </th>
            </tr>
          </thead>
          <tbody>
            {section.fields.map((field) => {
              const value = homeVisitResponse[field.key];

              if (field.type === "checkboxGroup") {
                return (
                  <tr key={field.key}>
                    <td className="border border-black p-3 align-top font-medium" style={{ width: "50%" }}>
                      {field.label}
                    </td>
                    <td className="border border-black p-1" style={{ width: "15%" }}></td>
                    <td className="border border-black p-1" style={{ width: "15%" }}></td>
                    <td className="border border-black p-3 align-top" style={{ width: "20%" }}>
                      <div className="space-y-1">
                        {field.options.map((opt) => (
                          <label key={opt} className="flex items-center text-xs">
                            <input
                              type="checkbox"
                              checked={Array.isArray(value) && value.includes(opt)}
                              readOnly
                              className="mr-2 h-3 w-3"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={field.key}>
                  <td className="border border-black p-3 align-top font-medium" style={{ width: "50%" }}>
                    {field.label}
                  </td>
                  <td className="border border-black p-1" style={{ width: "15%" }}></td>
                  <td className="border border-black p-1" style={{ width: "15%" }}></td>
                  <td className="border border-black p-3 align-top" style={{ width: "20%" }}>
                    {value || ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Footer />
    </A4Page>
  );
};

const Page3 = () => {
  const page = homeVisitSchema.pages[2];

  return (
    <A4Page>
      {/* Header with Logo */}
      <div className="flex justify-center pt-6 pb-4">
        <img
          src={homeVisitSchema.logo.page3.src}
          alt="Logo"
          width={homeVisitSchema.logo.page3.width}
          height={homeVisitSchema.logo.page3.height}
          className="object-contain"
        />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-4">
        {/* Risk Assessment Image */}
        <div className="mb-6 flex justify-center">
          <img 
            src={page.image} 
            alt="Risk Matrix" 
            className="max-w-full h-auto border border-gray-300 rounded"
          />
        </div>

        {/* Risk Level Descriptions */}
        {page.content.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-base font-semibold underline text-center mb-4">
              {section.heading}
            </h3>
            <div className="space-y-3">
              {section.blocks.map((block, i) => (
                <div key={i} className="border-l-4 border-gray-300 pl-4">
                  <h4 className="font-bold text-sm mb-2">
                    <span>{block.title.split(" ")[0]} </span>
                    <span className={`
                      ${block.color === 'green' ? 'text-green-600' : ''}
                      ${block.color === 'yellow' ? 'text-yellow-600' : ''}
                      ${block.color === 'orange' ? 'text-orange-600' : ''}
                    `}>
                      {block.title.split(" ")[1]}
                    </span>
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-700">
                    {block.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </A4Page>
  );
};

const Page4 = () => {
  const page = homeVisitSchema.pages[3];
  
  return (
    <A4Page>
      {/* Header with Logo */}
      <div className="flex justify-center pt-6 pb-4">
        <img
          src="/infinity_logo.png"
          alt="Infinity Supports WA logo"
          width={250}
          height={100}
          className="object-contain"
        />
      </div>

      {/* Risk Level Header */}
      <div className="px-6 py-4 bg-red-50 border-b border-red-200">
        <div className="text-lg font-bold mb-2">
          <span>{page.riskLevel.label.split(" ")[0]} </span>
          <span className="text-red-600">{page.riskLevel.label.split(" ")[1]}</span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          {page.riskLevel.description}
        </p>
      </div>

      {/* Risk Assessment Table */}
      <div className="flex-1 px-6 py-4">
        <table className="w-full border-collapse border border-black text-xs">
          <thead>
            <tr className="bg-gray-400">
              <th className="border border-black px-3 py-2 text-left font-bold text-black" style={{ width: "40%" }}>
                Issue/Task
              </th>
              <th className="border border-black px-3 py-2 text-left font-bold text-black" style={{ width: "15%" }}>
                Risk Score
              </th>
              <th className="border border-black px-3 py-2 text-left font-bold text-black" style={{ width: "30%" }}>
                Control Measure
              </th>
              <th className="border border-black px-3 py-2 text-left font-bold text-black" style={{ width: "15%" }}>
                Person Responsible
              </th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((row) => (
              <tr key={row} className="h-20">
                <td className="border border-black p-2 align-top">
                  {homeVisitResponse[`issue${row}`] || ""}
                </td>
                <td className="border border-black p-2 align-top">
                  {homeVisitResponse[`riskScore${row}`] || ""}
                </td>
                <td className="border border-black p-2 align-top">
                  {homeVisitResponse[`control${row}`] || ""}
                </td>
                <td className="border border-black p-2 align-top">
                  {homeVisitResponse[`responsible${row}`] || ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Footer />
    </A4Page>
  );
};

const Page5 = () => (
  <A4Page>
    {/* Header with Logo */}
    <div className="flex justify-center pt-8 pb-6">
      <img
        alt="Infinity Supports WA logo"
        src="/infinity_logo.png"
        width={200}
        height={100}
        className="object-contain"
      />
    </div>

    {/* Signature Section */}
    <div className="flex-1 px-6 py-8">
      <div className="grid grid-cols-3 gap-8 text-sm">
        <div className="text-center">
          <div className="font-semibold mb-2">Name:</div>
          <div className="border-b-2 border-black pb-1 min-h-[24px] font-bold">
            {homeVisitResponse.name}
          </div>
        </div>
        <div className="text-center">
          <div className="font-semibold mb-2">Signature:</div>
          <div className="border-b-2 border-black pb-1 min-h-[24px] font-bold">
            {homeVisitResponse.signature}
          </div>
        </div>
        <div className="text-center">
          <div className="font-semibold mb-2">Designation:</div>
          <div className="border-b-2 border-black pb-1 min-h-[24px] font-bold">
            {homeVisitResponse.designation}
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </A4Page>
);

// --- Main Component ---
const HomeVisitRiskAssessment = () => (
  <div className="bg-gray-100 min-h-screen py-8">
    <Page1 />
    <Page2 />
    <Page3 />
    <Page4 />
    <Page5 />
  </div>
);

export default HomeVisitRiskAssessment;
