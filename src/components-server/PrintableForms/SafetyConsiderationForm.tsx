import React from "react";

const SafetyConsiderationForm = ({ formSchema, formData = {} }) => {
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
          src={formSchema.logo.src}
          width={formSchema.logo.width}
          height={formSchema.logo.height}
          className="object-contain"
        />
      </div>
      <div className="px-6 flex-1 flex flex-col">
        <table className="w-full flex-1 border border-black border-collapse text-[12px]">
          <thead>
            <tr className="bg-gray-300">
              <th className="border border-black p-1 text-left font-semibold">
                {formSchema.title}
              </th>
              <th className="border border-black p-1 w-[180px] text-left font-semibold"></th>
              <th className="border border-black p-1 w-[60px] text-center font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {formSchema.fields.map((field, idx) => (
              <tr key={idx}>
                <td className="border border-black p-1 align-top w-[320px]">{field.label}</td>
                <td className="border border-black p-1 align-top text-[11px]">
                  <label className="inline-flex items-start space-x-1">
                    <input
                      className="mt-1"
                      type="checkbox"
                      checked={formData[field.key] === "Yes"}
                      readOnly
                    />
                    <span>Yes</span>
                  </label>
                  <div className="mt-1 leading-tight">{field.yesDetail}</div>
                </td>
                <td className="border border-black p-1 text-center align-top">
                  <input
                    type="checkbox"
                    checked={formData[field.key] === "No"}
                    readOnly
                  />
                  <span>No</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between text-[11px] text-gray-600 mt-4 px-1">
          <div>Website: infinitysupportswa.org</div>
          <div>CF001</div>
          <div>Review Date: 14/03/2026</div>
        </div>
      </div>
    </div>
  );
};

export default SafetyConsiderationForm;
