import React, { useState, useRef, useEffect } from 'react';
import { parseISO, isValid, format } from 'date-fns';
import { homeVisitSchema, HomeVisitSchemaBlock, HOME_VISIT_PAGE_BUDGET, HOME_VISIT_BLOCK_SPACING, HOME_VISIT_SAFETY_BUFFER } from "./schema";

// Dynamic Home Visit Risk Assessment View - Matching original exact design
const HomeVisitDynamic: React.FC<any> = ({ formData, commonFieldsData, settings, images }) => {
  
  const formatDate = (value: string) => {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const parsed = parseISO(value);
      if (isValid(parsed)) {
        return format(parsed, "dd-MM-yyyy");
      }
    }
    return value;
  };

  // Footer values (mirror settings API keys like SA Delivery)
  const footerWebsite = settings?.company_website || settings?.from_email || '';
  const footerId = settings?.home_visit_form_id || '';
  const footerDate = formatDate(settings?.review_date || '');

  const commonFieldMapping: Record<string, string> = {
    name: "name",
    ndisNumber: "ndis", 
    dob: "dob",
    address: "street",
  };

  // Get field value helper function
  const getFieldValue = (key: string): string => {
    let rawValue = commonFieldMapping[key]
      ? commonFieldsData?.[commonFieldMapping[key]]
      : formData?.[key];

    if (typeof rawValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
      const parsed = parseISO(rawValue);
      if (isValid(parsed)) {
        return format(parsed, "dd-MM-yyyy");
      }
    }

    return rawValue ?? "";
  };

  // A4 Page Wrapper Component - Proper A4 dimensions
  const A4Page = ({ children, className = "" }: any) => (
    <div 
      className={`bg-white mx-auto shadow-md flex flex-col ${className}`}
      style={{
        width: "210mm",  // Proper A4 width
        minHeight: "297mm", // Proper A4 height
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        pageBreakAfter: "always",
      }}
    >
      {children}
    </div>
  );

  // Footer Component - Exact match to original
  const Footer = () => (
    <div className="flex justify-between items-center text-[10px] px-6 py-3 mt-auto border-t border-gray-200">
      <div>
        <a
          href={`https://${footerWebsite}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800"
        >
          {footerWebsite}
        </a>
      </div>
      <div className="font-medium">{footerId}</div>
      <div className="font-medium">Review Date: {footerDate}</div>
    </div>
  );

  // Filter filled risk assessment rows
  const filledRiskRows = [1, 2, 3, 4, 5].filter(row => {
    const issue = getFieldValue(`issue${row}`);
    const riskScore = getFieldValue(`riskScore${row}`);
    const control = getFieldValue(`control${row}`);
    const responsible = getFieldValue(`responsible${row}`);
    return issue || riskScore || control || responsible;
  });

  return (
    <A4Page>
      {/* Fixed Header - Like SA Delivery */}
      <div className="flex justify-center pt-6 pb-4">
        <img
          src="/infinity_logo.png"
          alt="Logo"
          width={150}
          height={60}
          className="object-contain"
        />
      </div>

      {/* Title */}
      <h2 className="text-lg font-semibold px-6 py-4 text-center">
        Home & Visit Risk Assessment
      </h2>

      {/* All Content in Single Flow - Like SA Delivery */}
      <div className="px-6 flex-1">
        {/* Metadata Table */}
        <table className="w-full border border-black text-xs sm:text-sm table-fixed mb-4">
          <tbody>
            <tr>
              <td className="border border-black p-1 sm:p-2 w-1/3">
                <span className="font-semibold">Name:</span> {getFieldValue('name')}
              </td>
              <td className="border border-black p-2 w-1/3">
                <span className="font-semibold">NDIS Number:</span> {getFieldValue('ndisNumber')}
              </td>
              <td className="border border-black p-2 w-1/3">
                <span className="font-semibold">DOB:</span> {getFieldValue('dob')}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2" colSpan={3}>
                <span className="font-semibold">Address:</span> {getFieldValue('address')}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2" colSpan={3}>
                <span className="font-semibold">Date of completion of risk assessment:</span>{" "}
                {getFieldValue('completionDate')}
              </td>
            </tr>
          </tbody>
        </table>
        {/* Main Q&A Table - All sections in one flow */}
        <table className="w-full border-collapse border border-black text-sm mb-4">
          <thead>
            <tr>
              <th className="border border-black w-[40%] p-2"></th>
              <th className="border border-black w-[7%] text-center p-2">YES</th>
              <th className="border border-black w-[7%] text-center p-2">NO</th>
              <th className="border border-black w-[46%] p-2">COMMENTS</th>
            </tr>
          </thead>
          <tbody>
            {/* CLIENT AND FAMILY Section */}
            <tr className="bg-gray-300">
              <td className="border border-black p-3 font-bold text-left" colSpan={4}>
                CLIENT AND FAMILY
              </td>
            </tr>
            <tr className="align-top">
              <td className="border border-black p-3 w-[40%] font-medium">
                Will anyone else be present during the visit?
              </td>
              <td className="border border-black text-center w-[7%]">
                {getFieldValue('visitCompany')?.toLowerCase?.() === "yes" ? "✔️" : ""}
              </td>
              <td className="border border-black text-center w-[7%]">
                {getFieldValue('visitCompany')?.toLowerCase?.() === "no" ? "✔️" : ""}
              </td>
              <td className="border border-black p-3 w-[46%]">
                {getFieldValue('visitCompany_comments') || ""}
              </td>
            </tr>
            <tr className="align-top">
              <td className="border border-black p-3 w-[40%] font-medium">
                Any history of verbal or physical aggression from the client or family?
              </td>
              <td className="border border-black text-center w-[7%]">
                {getFieldValue('aggressionHistory')?.toLowerCase?.() === "yes" ? "✔️" : ""}
              </td>
              <td className="border border-black text-center w-[7%]">
                {getFieldValue('aggressionHistory')?.toLowerCase?.() === "no" ? "✔️" : ""}
              </td>
              <td className="border border-black p-3 w-[46%]">
                {getFieldValue('aggressionHistory_comments') || ""}
              </td>
            </tr>
            <tr className="align-top">
              <td className="border border-black p-3 w-[40%] font-medium">
                Any history of alcohol or drug use? (If yes, there can be no use of alcohol or use of drugs whilst the staff member is in home)
              </td>
              <td className="border border-black text-center w-[7%]">
                {getFieldValue('drugUseHistory')?.toLowerCase?.() === "yes" ? "✔️" : ""}
              </td>
              <td className="border border-black text-center w-[7%]">
                {getFieldValue('drugUseHistory')?.toLowerCase?.() === "no" ? "✔️" : ""}
              </td>
              <td className="border border-black p-3 w-[46%]">
                {getFieldValue('drugUseHistory_comments') || ""}
              </td>
            </tr>
            <tr className="align-top">
              <td className="border border-black p-3 w-[40%] font-medium">
                Is there an advanced care directive? (If yes, please add this information to risk assessment and care plan)
              </td>
              <td className="border border-black text-center w-[7%]">
                {getFieldValue('careDirective')?.toLowerCase?.() === "yes" ? "✔️" : ""}
              </td>
              <td className="border border-black text-center w-[7%]">
                {getFieldValue('careDirective')?.toLowerCase?.() === "no" ? "✔️" : ""}
              </td>
              <td className="border border-black p-3 w-[46%]">
                {getFieldValue('careDirective_comments') || ""}
              </td>
            </tr>

            {/* ENVIRONMENT Section */}
            <tr className="bg-gray-300">
              <td className="border border-black p-3 font-bold text-left" colSpan={4}>
                ENVIRONMENT
              </td>
            </tr>
            <tr className="align-top">
              <td className="border border-black p-3 w-[40%] font-medium">
                If there are any pets, has the client agreed to restrain them during the visit?
              </td>
              <td className="border border-black text-center w-[7%]">
                {getFieldValue('petsRestrained')?.toLowerCase?.() === "yes" ? "✔️" : ""}
              </td>
              <td className="border border-black text-center w-[7%]">
                {getFieldValue('petsRestrained')?.toLowerCase?.() === "no" ? "✔️" : ""}
              </td>
              <td className="border border-black p-3 w-[46%]">
                {getFieldValue('petsRestrained_comments') || ""}
              </td>
            </tr>
            <tr className="align-top">
              <td className="border border-black p-3 w-[40%] font-medium">
                Are there any weapons in the home? (If yes, please make sure they are stored appropriately during the visit.)
              </td>
              <td className="border border-black text-center w-[7%]">
                {getFieldValue('weaponsInHome')?.toLowerCase?.() === "yes" ? "✔️" : ""}
              </td>
              <td className="border border-black text-center w-[7%]">
                {getFieldValue('weaponsInHome')?.toLowerCase?.() === "no" ? "✔️" : ""}
              </td>
              <td className="border border-black p-3 w-[46%]">
                {getFieldValue('weaponsInHome_comments') || ""}
              </td>
            </tr>

            {/* SAFETY/FIRE Section */}
            <tr className="align-top">
              <td className="border border-black p-3 w-[40%] font-medium">
                If there are any smokers, have they agreed to refrain from smoking during the visit?
              </td>
              <td className="border border-black text-center w-[7%]">
                {getFieldValue('smokingAgreement')?.toLowerCase?.() === "yes" ? "✔️" : ""}
              </td>
              <td className="border border-black text-center w-[7%]">
                {getFieldValue('smokingAgreement')?.toLowerCase?.() === "no" ? "✔️" : ""}
              </td>
              <td className="border border-black p-3 w-[46%]">
                {getFieldValue('smokingAgreement_comments') || ""}
              </td>
            </tr>
            <tr className="align-top">
              <td className="border border-black p-3 w-[40%] font-medium">
                Are there smoke detectors present and in working condition?
              </td>
              <td className="border border-black text-center w-[7%]">
                {getFieldValue('smokeDetectors')?.toLowerCase?.() === "yes" ? "✔️" : ""}
              </td>
              <td className="border border-black text-center w-[7%]">
                {getFieldValue('smokeDetectors')?.toLowerCase?.() === "no" ? "✔️" : ""}
              </td>
              <td className="border border-black p-3 w-[46%]">
                {getFieldValue('smokeDetectors_comments') || ""}
              </td>
            </tr>
            <tr className="align-top">
              <td className="border border-black p-3 w-[40%] font-medium">
                Any apparent fire hazards?
              </td>
              <td className="border border-black text-center w-[7%]">
                {getFieldValue('fireHazards')?.toLowerCase?.() === "yes" ? "✔️" : ""}
              </td>
              <td className="border border-black text-center w-[7%]">
                {getFieldValue('fireHazards')?.toLowerCase?.() === "no" ? "✔️" : ""}
              </td>
              <td className="border border-black p-3 w-[46%]">
                {getFieldValue('fireHazards_comments') || ""}
              </td>
            </tr>

            {/* GEOGRAPHICAL LOCATION Section */}
            <tr className="bg-gray-300">
              <td className="border border-black p-3 font-bold text-left" colSpan={4}>
                GEOGRAPHICAL LOCATION
              </td>
            </tr>
            <tr className="align-top">
              <td className="border border-black p-3 w-[40%] font-medium">
                Are there any difficulties locating the address/access to the building?
              </td>
              <td className="border border-black text-center w-[7%]">
                {getFieldValue('accessDifficulties')?.toLowerCase?.() === "yes" ? "✔️" : ""}
              </td>
              <td className="border border-black text-center w-[7%]">
                {getFieldValue('accessDifficulties')?.toLowerCase?.() === "no" ? "✔️" : ""}
              </td>
              <td className="border border-black p-3 w-[46%]">
                {getFieldValue('accessDifficulties_comments') || ""}
              </td>
            </tr>
            <tr className="align-top">
              <td className="border border-black p-3 w-[40%] font-medium">
                Is there parking available?
              </td>
              <td className="border border-black text-center w-[7%]">
                {getFieldValue('parking')?.toLowerCase?.() === "yes" ? "✔️" : ""}
              </td>
              <td className="border border-black text-center w-[7%]">
                {getFieldValue('parking')?.toLowerCase?.() === "no" ? "✔️" : ""}
              </td>
              <td className="border border-black p-3 w-[46%]">
                {getFieldValue('parking_comments') || ""}
              </td>
            </tr>
            <tr className="align-top">
              <td className="border border-black p-3 w-[40%] font-medium">
                Is entry via the front door? If no, which door is used for entry?
              </td>
              <td className="border border-black text-center w-[7%]">
                {getFieldValue('entryPoint')?.toLowerCase?.() === "yes" ? "✔️" : ""}
              </td>
              <td className="border border-black text-center w-[7%]">
                {getFieldValue('entryPoint')?.toLowerCase?.() === "no" ? "✔️" : ""}
              </td>
              <td className="border border-black p-3 w-[46%]">
                {getFieldValue('entryPoint_comments') || ""}
              </td>
            </tr>
            <tr className="align-top">
              <td className="border border-black p-3 w-[40%] font-medium">
                Are there any issues with mobile phone reception?
              </td>
              <td className="border border-black text-center w-[7%]">
                {getFieldValue('mobileReception')?.toLowerCase?.() === "yes" ? "✔️" : ""}
              </td>
              <td className="border border-black text-center w-[7%]">
                {getFieldValue('mobileReception')?.toLowerCase?.() === "no" ? "✔️" : ""}
              </td>
              <td className="border border-black p-3 w-[46%]">
                {getFieldValue('mobileReception_comments') || ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Risk Assessment Matrix */}
        <div className="mb-4">
          <div className="flex justify-center mb-4">
            <img
              src="/home_risk_assessment.png"
              alt="Risk Matrix"
              className="max-w-full h-auto border border-gray-300 rounded"
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold underline text-center mb-3">
              Risk Assessment Outcome – Proceed with Visit as follows:
            </h3>
            <div className="space-y-2">
              <div className="border-l-4 border-gray-300 pl-3">
                <h4 className="font-bold text-xs mb-1">
                  <span>LOW </span>
                  <span className="text-green-600">GREEN</span>
                </h4>
                <p className="text-xs leading-relaxed text-gray-700">
                  Visit acceptable. Ensure control options are followed.
                </p>
              </div>
              <div className="border-l-4 border-gray-300 pl-3">
                <h4 className="font-bold text-xs mb-1">
                  <span>MEDIUM </span>
                  <span className="text-yellow-600">YELLOW</span>
                </h4>
                <p className="text-xs leading-relaxed text-gray-700">
                  Visit should only proceed after consultation with Manager. The risks should be reviewed to consider all the hazards involved. The risks must be reduced prior to the visit – if in doubt, re-classify as Moderate Risk.
                </p>
              </div>
              <div className="border-l-4 border-gray-300 pl-3">
                <h4 className="font-bold text-xs mb-1">
                  <span>MODERATE </span>
                  <span className="text-orange-600">ORANGE</span>
                </h4>
                <p className="text-xs leading-relaxed text-gray-700">
                  Visit should only proceed after consultation with Director. The risks should be reviewed to consider all the hazards involved. The risks must be reduced prior to the visit – if in doubt, re-classify as High Risk.
                </p>
              </div>
              <div className="border-l-4 border-gray-300 pl-3">
                <h4 className="font-bold text-xs mb-1">
                  <span>HIGH </span>
                  <span className="text-red-600">RED</span>
                </h4>
                <p className="text-xs leading-relaxed text-gray-700">
                  Visit must only proceed with Director approval. The risks associated with the visit must be re-assessed & other options considered.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Assessment Table - Only if has data */}
        {filledRiskRows.length > 0 && (
          <table className="w-full border-collapse border border-black text-xs mb-4">
            <thead>
              <tr className="bg-gray-400">
                <th className="border border-black p-2 text-left font-bold text-black">
                  Issue/Task
                </th>
                <th className="border border-black p-2 text-left font-bold text-black">
                  Risk Score
                </th>
                <th className="border border-black p-2 text-left font-bold text-black">
                  Control Measure
                </th>
                <th className="border border-black p-2 text-left font-bold text-black">
                  Person Responsible
                </th>
              </tr>
            </thead>
            <tbody>
              {filledRiskRows.map((row) => (
                <tr key={row}>
                  <td className="border border-black p-2 align-top">
                    {getFieldValue(`issue${row}`) || ""}
                  </td>
                  <td className="border border-black p-2 align-top">
                    {getFieldValue(`riskScore${row}`) || ""}
                  </td>
                  <td className="border border-black p-2 align-top">
                    {getFieldValue(`control${row}`) || ""}
                  </td>
                  <td className="border border-black p-2 align-top">
                    {getFieldValue(`responsible${row}`) || ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Fixed Footer - Like SA Delivery */}
      <Footer />
    </A4Page>
  );
};

export default HomeVisitDynamic;
