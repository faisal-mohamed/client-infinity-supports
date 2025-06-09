"use client";

import React from "react";

const AllAboutMeForm = ({ formSchema, formData = {} }) => {
  const renderPersonalSituation = (psSchema, psData = {}) => (
    <div className="space-y-1 text-[11px]">
      <div>
        <span className="font-bold">{psSchema.barriers.label}</span>
        <span className="ml-1 mr-1 w-4 h-4 border border-black inline-flex items-center justify-center">
          {psData.barriers === "Yes" ? "✔" : ""}
        </span>
        {psSchema.barriers.options[0]}
        <span className="ml-1 mr-1 w-4 h-4 border border-black inline-flex items-center justify-center">
          {psData.barriers === "No" ? "✔" : ""}
        </span>
        {psSchema.barriers.options[1]}
        <span className="ml-2">{psSchema.barriers.followUp}</span>
      </div>
      <div>
        {psSchema.interpreter.label}
        <span className="ml-1 mr-1 w-4 h-4 border border-black inline-flex items-center justify-center">
          {psData.interpreter === "Yes" ? "✔" : ""}
        </span>
        {psSchema.interpreter.options[0]}
        <span className="ml-1 mr-1 w-4 h-4 border border-black inline-flex items-center justify-center">
          {psData.interpreter === "No" ? "✔" : ""}
        </span>
        {psSchema.interpreter.options[1]}
      </div>
      <div>{psSchema.language.label} {psData.language || ""}</div>
      <div>{psSchema.culturalValues.label} {psData.culturalValues || ""}</div>
      <div>{psSchema.culturalBehaviours.label} {psData.culturalBehaviours || ""}</div>
      <div>{psSchema.writtenCommunication.label} {psData.writtenCommunication || ""}</div>
      <div>{psSchema.countryOfBirth.label} {psData.countryOfBirth || ""}</div>
    </div>
  );

  return (
    <div
      className="bg-white mx-auto shadow-md flex flex-col"
      style={{
        width: "794px",  // A4 width in px
        height: "1123px", // A4 height in px
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        pageBreakAfter: "always",
        margin: 0,  // Ensure no extra margin
        padding: 0,  // Ensure no extra padding
      }}
    >
      <div className="flex justify-center py-4">
        <img
          alt={formSchema.logo.alt}
          height={formSchema.logo.height}
          src={formSchema.logo.src}
          width={formSchema.logo.width}
          className="object-contain"
        />
      </div>
      <div className="px-6 flex-1 flex flex-col">
        <table className="w-full flex-1 border border-black border-collapse text-[11px]">
          <tbody>
            <tr>
              <th className="border border-black text-left font-bold text-[11px] px-1 py-0.5 bg-gray-300" colSpan={2}>
                {formSchema.sections.allAboutMe.title}
              </th>
            </tr>
            <tr>
              <td className="border border-black h-[150px] align-top px-1 py-0.5" colSpan={2}>
                {formData.allAboutMe || ""}
              </td>
            </tr>
            <tr>
              <th className="border border-black text-left font-bold text-[11px] px-1 py-0.5 bg-gray-300" colSpan={2}>
                {formSchema.sections.advocateDetails.title}
              </th>
            </tr>
            <tr>
              <td className="border border-black text-[11px] px-1 py-0.5">
                {formSchema.sections.advocateDetails.fields.name} {formData.advocateName || ""}
              </td>
              <td className="border border-black text-[11px] px-1 py-0.5">
                {formSchema.sections.advocateDetails.fields.relationship} {formData.advocateRelationship || ""}
              </td>
            </tr>
            <tr>
              <td className="border border-black text-[11px] px-1 py-0.5">
                {formSchema.sections.advocateDetails.fields.phone} {formData.advocatePhone || ""}
              </td>
              <td className="border border-black text-[11px] px-1 py-0.5">
                {formSchema.sections.advocateDetails.fields.mobile} {formData.advocateMobile || ""}
                <br />
                {formSchema.sections.advocateDetails.fields.email} {formData.advocateEmail || ""}
              </td>
            </tr>
            <tr>
              <td className="border border-black text-[11px] px-1 py-0.5" colSpan={2}>
                {formSchema.sections.advocateDetails.fields.address} {formData.advocateAddress || ""}
              </td>
            </tr>
            <tr>
              <td className="border border-black text-[11px] px-1 py-0.5" colSpan={2}>
                {formSchema.sections.advocateDetails.fields.postalAddress} {formData.advocatePostalAddress || ""}
              </td>
            </tr>
            <tr>
              <td className="border border-black text-[11px] px-1 py-0.5" colSpan={2}>
                {formSchema.sections.advocateDetails.fields.otherInfo} {formData.advocateOtherInfo || ""}
              </td>
            </tr>
            <tr>
              <th
                className="border border-black text-left font-bold text-[11px] px-1 py-0.5 bg-gray-300"
                colSpan={2}
                style={{ marginBottom: '0', paddingBottom: '0' }}
              >
                {formSchema.sections.personalSituation.title}
              </th>
            </tr>
            <tr>
              <td
                className="border border-black text-[11px] px-1 py-0.5"
                style={{ paddingTop: '0', paddingBottom: '0', margin: '0' }}
                colSpan={2}
              >
                {renderPersonalSituation(formSchema.sections.personalSituation.fields, formData.personalSituation || {})}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-between text-[11px] text-gray-600 mt-4 px-2">
          <div>Website: infinitysupportswa.org</div>
          <div>CF001</div>
          <div>Review Date: 14/03/2026</div>
        </div>
      </div>
    </div>
  );
};

export default AllAboutMeForm;
