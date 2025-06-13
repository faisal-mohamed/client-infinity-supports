"use client";

import React from "react";

const GpMedicalSupportForm = ({ formSchema, formData = {} }: any) => {
  const displayCheckboxGroup = (options: any, selected : any[] = [], otherValue : any = "") => (
    <div className="space-y-1 text-xs">
      {options.map((opt: any) => (
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
        <table className="w-full flex-1 border-collapse border border-black text-[13px]">
          <tbody>
            {formSchema.fields.map((field: any, idx: any) => {
              if (field.type === "sectionHeader") {
                return (
                  <tr key={idx} className={`${field.bgColor || "bg-gray-300"} font-bold text-[13px]`}>
                    <td className="border border-black px-2 py-1" colSpan={field.colSpan || 2}>
                      {field.label}
                    </td>
                  </tr>
                );
              }

              if (field.type === "textarea") {
                return (
                  <tr key={idx}>
                    <td
                      className="border border-black align-top p-2"
                      colSpan={field.colSpan || 2}
                      style={{ height: field.height || 256 }}
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
                      className="border border-black px-2 py-1 font-semibold"
                      style={{ width: field.width || "auto" }}
                      colSpan={field.colSpan || 1}
                    >
                      {field.label}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {displayCheckboxGroup(
                        field.options,
                        formData[field.key],
                        field.otherKey ? formData[field.otherKey] : ""
                      )}
                    </td>
                  </tr>
                );
              }

              if (field.type === "field") {
                return (
                  <tr key={idx}>
                    <td className="border border-black px-2 py-1" colSpan={2}>
                      {field.label} {formData[field.key] || ""}
                    </td>
                  </tr>
                );
              }
              
              if (field.type === "text") {
                return (
                  <tr key={idx}>
                    <td className="border border-black px-2 py-1 font-semibold" style={{ width: field.width || "auto" }}>
                      {field.label}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {formData[field.key] || ""}
                    </td>
                  </tr>
                );
              }

              return null;
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

export default GpMedicalSupportForm;
