
import React from "react";

const FieldRenderer = ({ field, value }: any) => {
  if (field.type === "title") {
    return (
      <div className="col-span-3 text-center font-bold border border-black py-1 bg-gray-200 break-inside-avoid">
        {field.label}
      </div>
    );
  }
  if (field.type === "field") {
    return (
      <div className="border border-black px-2 py-1 text-xs break-inside-avoid">
        <span className="font-semibold mr-1">{field.label}</span>{value || ""}
      </div>
    );
  }
  if (field.type === "textarea") {
    return (
      <div className="col-span-3 border border-black px-2 py-1 text-xs h-24 whitespace-pre-wrap break-inside-avoid">
        <span className="font-semibold block mb-1">{field.label}</span>
        {value || ""}
      </div>
    );
  }
  if (field.type === "checkbox-group") {
    return (
      <div className="col-span-3 border border-black px-2 py-1 text-xs break-inside-avoid">
        <span className="font-semibold block mb-1">{field.label}</span>
        <div className="flex flex-col gap-1">
          {field.options.map((opt: string, i: number) => (
            <label key={i} className="inline-flex items-center">
              <input type="checkbox" className="mr-1 w-3 h-3" checked={value?.includes(opt)} readOnly />
              {opt}
            </label>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function PrintableForm({ formData, uiSchema }: any) {
  return (
    <div className="text-xs max-w-[700px] mx-auto p-4">
      <div className="grid grid-cols-3 gap-px border border-black">
        {uiSchema.map((field: any, idx: number) => (
          <div
            key={idx}
            className={
              field.type === "textarea" || field.type === "title" || field.type === "checkbox-group"
                ? "col-span-3"
                : ""
            }
          >
            <FieldRenderer field={field} value={formData[field.key]} />
          </div>
        ))}
      </div>
    </div>
  );
}
