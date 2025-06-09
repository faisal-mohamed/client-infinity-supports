"use client";

import React from "react";

const ClientIntakeForm = ({ formSchema, formData = {} }) => {
  const displayCheckboxGroup = (options, selected = [], otherValue = "") => (
    <div className="space-y-1 text-xs">
      {options.map((opt) => (
        <div key={opt} className="flex items-center space-x-1">
          <span className="w-4 h-4 border border-black flex justify-center items-center">
            {selected?.includes(opt) ? "✔" : ""}
          </span>
          <span>{opt}</span>
        </div>
      ))}
      {otherValue && (
        <div className="flex items-center space-x-1">
          <span className="w-4 h-4 border border-black flex justify-center items-center">✔</span>
          <span>{otherValue}</span>
        </div>
      )}
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
        <table className="w-full flex-1 border-collapse border border-black text-xs">
          <thead>
            <tr>
              <th className="border border-black font-bold text-center py-1" colSpan={3}>
                {formSchema.pageTitle}
              </th>
            </tr>
          </thead>
          <tbody>
            {formSchema.fields.map((field, idx) => {
              if (field.type === "sectionHeader") {
                return (
                  <tr key={idx} className="bg-gray-300 font-semibold text-xs">
                    <td className="border border-black px-1 py-0.5" colSpan={field.colSpan || 3}>
                      {field.label}
                    </td>
                  </tr>
                );
              }

              if (field.type === "textarea") {
                return (
                  <tr key={idx}>
                    <td
                      className="border border-black px-1 py-0.5 align-top"
                      colSpan={field.colSpan || 3}
                      style={{ height: field.height || 100 }}
                    >
                      {formData[field.key] || ""}
                    </td>
                  </tr>
                );
              }

              if (field.type === "checkboxGroup") {
                return (
                  <tr key={idx}>
                    <td
                      className="border border-black px-1 py-0.5 font-semibold align-top"
                      style={{ width: field.width || "auto" }}
                      colSpan={field.colSpan || 1}
                    >
                      {field.label}
                    </td>
                    <td className="border border-black px-1 py-0.5">
                      {displayCheckboxGroup(
                        field.options,
                        formData[field.key],
                        field.otherKey ? formData[field.otherKey] : ""
                      )}
                    </td>
                  </tr>
                );
              }

              // Default text field
              return (
                <tr key={idx}>
                  <td
                    className="border border-black px-1 py-0.5 font-semibold"
                    style={{ width: field.width || "auto" }}
                  >
                    {field.label}
                  </td>
                  <td className="border border-black px-1 py-0.5" colSpan={field.colSpan || 2}>
                    {formData[field.key] || ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {formSchema.footer && (
          <div className="flex justify-between text-[10px] text-gray-600 mt-4 px-1">
            <div>Website: infinitysupportswa.org</div>
            <div>CF001</div>
            <div>Review Date: 14/03/2026</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientIntakeForm;
