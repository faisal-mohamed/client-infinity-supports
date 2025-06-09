import React from "react";

const ContactsLivingTravelForm = ({ formSchema, formData = {} }) => {
  const renderCheckboxList = (options, selected = [], otherValue = "") => (
    <ul className="list-none ml-4 space-y-0.5">
      {options.map((opt) => (
        <li key={opt} className="flex items-center space-x-2">
          <label className="inline-flex items-center flex-shrink-0 space-x-2">
            <span className="w-4 h-4 border border-black flex items-center justify-center mr-2">
              {selected?.includes(opt) ? "✔" : ""}
            </span>
            <span>{opt === "Other" ? "Other:" : opt}</span>
          </label>
          {opt === "Other" && (
            <span className="border-b border-black flex-grow h-[1px] min-w-[60px] ml-2">
              {otherValue ? <span>{otherValue}</span> : null}
            </span>
          )}
        </li>
      ))}
    </ul>
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
        <table className="w-full flex-1 border border-black border-collapse text-[13px]">
          <tbody>
            {formSchema.fields.map((field, idx) => {
              if (field.type === "contactHeader") {
                return (
                  <tr key={idx} className="bg-gray-300 font-bold text-[13px]">
                    <td className="border border-black px-2 py-1">{field.label}</td>
                    <td className="border border-black px-2 py-1"></td>
                    <td className="border border-black px-2 py-1"></td>
                  </tr>
                );
              }
              if (field.type === "contactRow") {
                return (
                  <tr key={idx}>
                    <td className="border border-black px-2 py-1">
                      {field.columns[0].label} {formData[field.columns[0].key] || ""}
                    </td>
                    <td className="border border-black px-2 py-1"></td>
                    <td className="border border-black px-2 py-1">
                      {field.columns[1].label} {formData[field.columns[1].key] || ""}
                    </td>
                  </tr>
                );
              }
              if (field.type === "boxSection") {
                return (
                  <tr key={idx}>
                    <td className="border border-black mt-6 p-3 text-[13px]" colSpan={3}>
                      <p className="font-bold mb-2">{field.heading}</p>
                      <p className="mb-2">{field.question}</p>
                      {renderCheckboxList(
                        field.options,
                        formData[field.key] || [],
                        formData[field.otherKey] || ""
                      )}
                    </td>
                  </tr>
                );
              }
              return null;
            })}
          </tbody>
        </table>
        {formSchema.footer && (
          <div className="flex justify-between text-[10px] text-gray-600 mt-4 px-2">
            <div>Website: infinitysupportswa.org</div>
            <div>CF001</div>
            <div>Review Date: 14/03/2026</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactsLivingTravelForm;
