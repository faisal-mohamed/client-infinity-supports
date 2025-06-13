"use client";
import React from "react";
import { useToast } from "@/components/ui/Toast";


const handleDownload = async () => {
    const {showToast} = useToast();
  try {
    const response = await fetch("/api/generate-pdf", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to generate PDF");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "form.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading PDF:", error);
    showToast({
      type: 'error',
      title: `Error`,
      message: `Error Downloading the PDF`,
      duration: 3000,
    });
  }
};

function getTodayDateFormatted() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0"); // Ensure 2-digit day
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Month is 0-based
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
}

const ClientIntakeForm = ({ formSchema, formData }: any) => {

  


  const displayCheckboxGroup = (
    options: any,
    selected: any[] = [],
    otherValue: any = ""
  ) => (
    <div className="space-y-1 text-xs">
      {options.map((opt: any) => (
        <div key={opt} className="flex items-center space-x-1 m-4">
          <span className="w-4 h-4 border border-black flex justify-center items-center">
            {selected.includes(opt) ? "✔" : ""}
          </span>
          <span className="m-1">{opt}</span>
        </div>
      ))}
      {otherValue && (
        <div className="flex items-center space-x-1">
          <span className="w-4 h-4 border border-black flex justify-center items-center">
            ✔
          </span>
          <span>{otherValue}</span>
        </div>
      )}
    </div>
  );

  return (
    <div
      className="bg-white mx-auto shadow-md flex flex-col"
      style={{
        width: "794px", // A4 width in px
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
              <th
                className="border border-black font-bold text-center py-1"
                colSpan={3}
              >
                {formSchema.pageTitle}
              </th>
            </tr>
          </thead>
          <tbody>
            {formSchema.fields.map((field: any, idx: any) => {
              if (field.type === "sectionHeader") {
                return (
                  <tr key={idx} className="bg-gray-300 font-semibold text-xs">
                    <td
                      className="border border-black px-1 py-0.5"
                      colSpan={field.colSpan || 3}
                    >
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
                      {formData[field.key] || "N/A"}
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
                  <td
                    className="border border-black px-1 py-0.5"
                    colSpan={field.colSpan || 2}
                  >
                    {formData[field.key] || "N/A"}
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
            <div>Review Date: {getTodayDateFormatted()}</div>
          </div>
        )}
      </div>
    </div>
  );
};

const GpMedicalSupportForm = ({ formSchema, formData }: any) => {
  const displayCheckboxGroup = (
    options: any,
    selected: any[] = [],
    otherValue = ""
  ) => (
    <div className="space-y-1 text-xs">
      {options.map((opt: any) => (
        <div key={opt} className="flex items-center space-x-1">
          <span className="w-4 h-4 border border-black flex justify-center items-center">
            {selected.includes(opt) ? "✔" : ""}
          </span>
          <span>{opt}</span>
        </div>
      ))}
      {otherValue && (
        <div className="flex items-center space-x-1">
          <span className="w-4 h-4 border border-black flex justify-center items-center">
            ✔
          </span>
          <span>{otherValue}</span>
        </div>
      )}
    </div>
  );

  return (
    <div
      className="bg-white mx-auto shadow-md flex flex-col"
      style={{
        width: "794px", // A4 width in px
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
          <thead>
            {/* <tr className="bg-gray-300 font-bold text-[13px]">
              <th className="border border-black text-left px-2 py-1" colSpan={2}>
                {formSchema.pageTitle}
              </th>
            </tr> */}
          </thead>
          <tbody>
            {formSchema.fields.map((field: any, idx: any) => {
              if (field.type === "sectionHeader") {
                return (
                  <tr
                    key={idx}
                    className={`${
                      field.bgColor || "bg-gray-300"
                    } font-bold text-[13px]`}
                  >
                    <td
                      className="border border-black px-2 py-1"
                      colSpan={field.colSpan || 2}
                    >
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
                      {formData[field.key] || "N/A"}
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
                      {field.label} {formData[field.key] || "N/A"}
                    </td>
                  </tr>
                );
              }
              if (field.type === "text") {
                return (
                  <tr key={idx}>
                    <td
                      className="border border-black px-2 py-1 font-semibold"
                      style={{ width: field.width || "auto" }}
                    >
                      {field.label}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {formData[field.key] || "N/A"}
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
            <div>Review Date: {getTodayDateFormatted()}</div>
          </div>
        )}
      </div>
    </div>
  );
};

const AllAboutMeForm = ({ formSchema, formData }: any) => {
  const renderPersonalSituation = (psSchema: any, flatData: any) => (
    <div className="space-y-1 text-[11px]">
      <div>
        <span className="font-bold">{psSchema.barriers.label}</span>
        <span className="ml-1 mr-1 w-4 h-4 border border-black inline-flex items-center justify-center">
          {flatData.barriers === "Yes" ? "✔" : ""}
        </span>
        {psSchema.barriers.options[0]}
        <span className="ml-1 mr-1 w-4 h-4 border border-black inline-flex items-center justify-center">
          {flatData.barriers === "No" ? "✔" : ""}
        </span>
        {psSchema.barriers.options[1]}
        <span className="ml-2">{psSchema.barriers.followUp}</span>
      </div>

      <div>
        {psSchema.interpreter.label}
        <span className="ml-1 mr-1 w-4 h-4 border border-black inline-flex items-center justify-center">
          {flatData.interpreter === "Yes" ? "✔" : ""}
        </span>
        {psSchema.interpreter.options[0]}
        <span className="ml-1 mr-1 w-4 h-4 border border-black inline-flex items-center justify-center">
          {flatData.interpreter === "No" ? "✔" : ""}
        </span>
        {psSchema.interpreter.options[1]}
      </div>

      <div>
        {psSchema.language.label} {flatData.language || ""}
      </div>
      <div>
        {psSchema.culturalValues.label} {flatData.culturalValues || ""}
      </div>
      <div>
        {psSchema.culturalBehaviours.label} {flatData.culturalBehaviours || ""}
      </div>
      <div>
        {psSchema.writtenCommunication.label}{" "}
        {flatData.writtenCommunication || ""}
      </div>
      <div>
        {psSchema.countryOfBirth.label} {flatData.countryOfBirth || ""}
      </div>
    </div>
  );

  return (
    <div
      className="bg-white mx-auto shadow-md flex flex-col"
      style={{
        width: "794px", // A4 width in px
        height: "1123px", // A4 height in px
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        pageBreakAfter: "always",
        margin: 0, // Ensure no extra margin
        padding: 0, // Ensure no extra padding
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
              <th
                className="border border-black text-left font-bold text-[11px] px-1 py-0.5 bg-gray-300"
                colSpan={2}
              >
                {formSchema.sections.allAboutMe.title}
              </th>
            </tr>
            <tr>
              <td
                className="border border-black h-[150px] align-top px-1 py-0.5"
                colSpan={2}
              >
                {formData.allAboutMe}
              </td>
            </tr>
            <tr>
              <th
                className="border border-black text-left font-bold text-[11px] px-1 py-0.5 bg-gray-300"
                colSpan={2}
              >
                {formSchema.sections.advocateDetails.title}
              </th>
            </tr>
            <tr>
              <td className="border border-black text-[11px] px-1 py-0.5">
                {formSchema.sections.advocateDetails.fields.name}{" "}
                {formData.advocateName}
              </td>
              <td className="border border-black text-[11px] px-1 py-0.5">
                {formSchema.sections.advocateDetails.fields.relationship}{" "}
                {formData.advocateRelationship}
              </td>
            </tr>
            <tr>
              <td className="border border-black text-[11px] px-1 py-0.5">
                {formSchema.sections.advocateDetails.fields.phone}{" "}
                {formData.advocatePhone}
              </td>
              <td className="border border-black text-[11px] px-1 py-0.5">
                {formSchema.sections.advocateDetails.fields.mobile}{" "}
                {formData.advocateMobile}
                <br />
                {formSchema.sections.advocateDetails.fields.email}{" "}
                {formData.advocateEmail}
              </td>
            </tr>
            <tr>
              <td
                className="border border-black text-[11px] px-1 py-0.5"
                colSpan={2}
              >
                {formSchema.sections.advocateDetails.fields.address}{" "}
                {formData.advocateAddress}
              </td>
            </tr>
            <tr>
              <td
                className="border border-black text-[11px] px-1 py-0.5"
                colSpan={2}
              >
                {formSchema.sections.advocateDetails.fields.postalAddress}{" "}
                {formData.advocatePostalAddress}
              </td>
            </tr>
            <tr>
              <td
                className="border border-black text-[11px] px-1 py-0.5"
                colSpan={2}
              >
                {formSchema.sections.advocateDetails.fields.otherInfo}{" "}
                {formData.advocateOtherInfo}
              </td>
            </tr>
            <tr>
              <th
                className="border border-black text-left font-bold text-[11px] px-1 py-0.5 bg-gray-300"
                colSpan={2}
                style={{ marginBottom: "0", paddingBottom: "0" }}
              >
                {formSchema.sections.personalSituation.title}
              </th>
            </tr>
            <tr>
              <td
                className="border border-black text-[11px] px-1 py-0.5"
                style={{ paddingTop: "0", paddingBottom: "0", margin: "0" }}
                colSpan={2}
              >
                {renderPersonalSituation(
                  formSchema.sections.personalSituation.fields,
                  formData
                )}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-between text-[11px] text-gray-600 mt-4 px-2">
          <div>Website: infinitysupportswa.org</div>
          <div>CF001</div>
          <div>Review Date: {getTodayDateFormatted()}</div>
        </div>
      </div>
    </div>
  );
};
const ContactsLivingTravelForm = ({ formSchema, formData }: any) => {
  const renderCheckboxList = (options: any, selected: any, otherValue: any) => (
    <ul className="list-none ml-4 space-y-0.5">
      {options.map((opt: any) => (
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
        width: "794px", // A4 width in px
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
            {formSchema.fields.map((field: any, idx: any) => {
              if (field.type === "contactHeader") {
                return (
                  <tr key={idx} className="bg-gray-300 font-bold text-[13px]">
                    <td className="border border-black px-2 py-1">
                      {field.label}
                    </td>
                    <td className="border border-black px-2 py-1"></td>
                    <td className="border border-black px-2 py-1"></td>
                  </tr>
                );
              }
              if (field.type === "contactRow") {
                return (
                  <tr key={idx}>
                    <td className="border border-black px-2 py-1">
                      {field.columns[0].label}{" "}
                      {formData[field.columns[0].key] || ""}
                    </td>
                    <td className="border border-black px-2 py-1"></td>
                    <td className="border border-black px-2 py-1">
                      {field.columns[1].label}{" "}
                      {formData[field.columns[1].key] || ""}
                    </td>
                  </tr>
                );
              }
              if (field.type === "boxSection") {
                return (
                  <tr key={idx}>
                    <td
                      className="border border-black mt-6 p-3 text-[13px]"
                      colSpan={3}
                    >
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
            <div>Review Date: {getTodayDateFormatted()}</div>
          </div>
        )}
      </div>
    </div>
  );
};

const MedicationInfoForm = ({ formSchema, formData }: any) => {
  return (
    <div
      className="bg-white mx-auto shadow-md flex flex-col"
      style={{
        width: "794px", // A4 width in px
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
            {formSchema.fields.map((field: any, idx: any) => (
              <tr key={idx}>
                <td className="border border-black p-1 align-top w-[320px]">
                  {field.label}
                </td>
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
          <div>Review Date: {getTodayDateFormatted()}</div>
        </div>
      </div>
    </div>
  );
};

const SafetyConsiderationForm = ({ formSchema, formData }: any) => {
  return (
    <div
      className="bg-white mx-auto shadow-md flex flex-col"
      style={{
        width: "794px", // A4 width in px
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
            {formSchema.fields.map((field: any, idx: any) => (
              <tr key={idx}>
                <td className="border border-black p-1 align-top w-[320px]">
                  {field.label}
                </td>
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
          <div>Review Date: {getTodayDateFormatted()}</div>
        </div>
      </div>
    </div>
  );
};

// ====== Sample usage in one file ======
// const formSchemas = {
//   clientIntakeSchema: {
//     pageTitle: "Client Intake Form",
//     logo: {
//       src: "/infinity_logo.png",
//       alt: "Infinity Supports WA logo with text below",
//       width: 200,
//       height: 60,
//     },
//     fields: [
//       { type: "sectionHeader", label: "Participant Details", colSpan: 2 },
//       { label: "Date:", key: "date", type: "text", colSpan: 2 },
//       { label: "NDIS Number:", key: "ndisNumber", type: "text", colSpan: 2 },
//       { label: "Given name(s):", key: "givenName", type: "text", width: "50%" },
//       { label: "Surname:", key: "surname", type: "text", width: "25%" },
//       {
//         label: "Sex:",
//         key: "sex",
//         type: "checkboxGroup",
//         width: "25%",
//         options: ["Male", "Female", "Prefer not to say"],
//         otherKey: "sexOther",
//       },
//       { label: "Pronoun:", key: "pronoun", type: "text", colSpan: 3 },
//       {
//         label: "Are you an Aboriginal or Torres Strait Island descent?",
//         key: "aboriginalTorres",
//         type: "checkboxGroup",
//         colSpan: 1,
//         options: ["Yes", "No"],
//         width: "auto",
//       },
//       { label: "Preferred name:", key: "preferredName", type: "text", colSpan: 2 },
//       { label: "Date of Birth:", key: "dateOfBirth", type: "text", width: "auto" },

//       { type: "sectionHeader", label: "Residential Address Details", colSpan: 3 },
//       { label: "Number / Street:", key: "addressNumberStreet", type: "text", colSpan: 3 },
//       { label: "State:", key: "state", type: "text", width: "50%" },
//       { label: "Postcode:", key: "postcode", type: "text", colSpan: 2, width: "50%" },

//       { type: "sectionHeader", label: "Participant Contact Details", colSpan: 3 },
//       { label: "Email address:", key: "email", type: "text", colSpan: 3 },
//       { label: "Home Phone No:", key: "homePhone", type: "text", width: "50%" },
//       { label: "Mobile No:", key: "mobile", type: "text", colSpan: 2, width: "50%" },

//       { type: "sectionHeader", label: "Disability Conditions/Disability type(s)", colSpan: 3 },
//       {
//         label: "",
//         key: "disabilityConditions",
//         type: "textarea",
//         colSpan: 3,
//         height: 150,
//       },
//     ],
//     footer: true,
//   },

//   gpMedicalSupportSchema: {
//     logo: {
//       src: "/infinity_logo.png",
//       alt: "Infinity Supports WA logo with infinity symbol and text Achieving Goals and Beyond",
//       width: 150,
//       height: 60,
//     },
//     fields: [
//       { type: "sectionHeader", label: "GP Medical Contact", colSpan: 2 },
//       { label: "Medical Centre Name:", key: "medicalCentreName", type: "text", colSpan: 2 },
//       { label: "Phone:", key: "medicalPhone", type: "text", colSpan: 2 },

//       { type: "sectionHeader", label: "Support Coordinator", colSpan: 2, bgColor: "bg-gray-100" },
//       { label: "Name:", key: "supportCoordinatorName", type: "text", width: "50%" },
//       { label: "Email Address:", key: "supportCoordinatorEmail", type: "text", width: "50%" },
//       { label: "Company:", key: "supportCoordinatorCompany", type: "text", width: "50%" },
//       { label: "Contact number:", key: "supportCoordinatorContact", type: "text", width: "50%" },

//       {
//         type: "sectionHeader",
//         label: "What other supports including mainstream health services you receive at present",
//         colSpan: 2,
//         bgColor: "bg-gray-300",
//       },
//       {
//         label: "",
//         key: "otherSupports",
//         type: "textarea",
//         colSpan: 2,
//         height: 256,
//       },
//     ],
//     footer: true,
//   },

//    allAboutMeSchema :  {
//   logo: {
//     src: "/infinity_logo.png",
//     alt: "Infinity Supports WA logo with infinity symbol and text Achieving Goals and Beyond",
//     width: 150,
//     height: 60,
//   },
//   sections: {
//     allAboutMe: {
//       title: "All About Me",
//     },
//     advocateDetails: {
//       title: "Advocate/representative details (if applicable)",
//       fields: {
//         name: "Name:",
//         relationship: "Relationship with the participant:",
//         phone: "Phone No:",
//         mobile: "Mobile No:",
//         email: "Email:",
//         address: "Address Details:",
//         postalAddress: "Postal Address Details:",
//         otherInfo: "Other Information:",
//       },
//     },
//     personalSituation: {
//       title: "Personal Situation",
//       fields: {
//         barriers: {
//           label:
//             "Are there any cultural, communication barriers or intimacy issues that need to be considered when delivering services?",
//           options: ["Yes", "No"],
//           followUp: "If yes, please indicate below:",
//         },
//         interpreter: {
//           label: "Verbal communication or spoken language - Is an interpreter needed?",
//           options: ["Yes", "No"],
//         },
//         language: { label: "Language" },
//         culturalValues: { label: "Cultural values/ beliefs or assumptions" },
//         culturalBehaviours: { label: "Cultural behaviours" },
//         writtenCommunication: { label: "Written communication/literacy" },
//         countryOfBirth: { label: "Country of birth" },
//       },
//     },
//   },
// },

//   contactsLivingTravelSchema: {
//     pageTitle: "Contacts, Living and Travel",
//     logo: {
//       src: "/infinity_logo.png",
//       alt: "Infinity Supports WA logo with pink infinity symbol and text below",
//       width: 150,
//       height: 70,
//     },
//     fields: [
//       { type: "contactHeader", label: "Primary Contact" },
//       {
//         type: "contactRow",
//         columns: [
//           { label: "Contact Name:", key: "primaryContactName" },
//           { label: "Relationship:", key: "primaryContactRelationship" },
//         ],
//       },
//       {
//         type: "contactRow",
//         columns: [
//           { label: "Home Phone No:", key: "primaryContactHomePhone" },
//           { label: "Mobile No:", key: "primaryContactMobile" },
//         ],
//       },
//       { type: "contactHeader", label: "Secondary Contact" },
//       {
//         type: "contactRow",
//         columns: [
//           { label: "Contact Name:", key: "secondaryContactName" },
//           { label: "Relationship:", key: "secondaryContactRelationship" },
//         ],
//       },
//       {
//         type: "contactRow",
//         columns: [
//           { label: "Home Phone No:", key: "secondaryContactHomePhone" },
//           { label: "Mobile No:", key: "secondaryContactMobile" },
//         ],
//       },
//       {
//         type: "boxSection",
//         heading: "Living and support arrangements",
//         question: "What is your current living arrangement? (Please tick the appropriate box)",
//         key: "livingArrangements",
//         options: [
//           "Live with Parent/Family/Support Person",
//           "Live in private rental arrangement with others",
//           "Live in private rental arrangement alone",
//           "Owns own home.",
//           "Aged Care Facility",
//           "Mental Health Facility",
//           "Lives in public housing",
//           "Short Term Crisis/Respite",
//           "Staff Supported Group Home",
//           "Hostel/SRS Private Accommodation",
//           "Other",
//         ],
//         otherKey: "livingArrangementsOther",
//       },
//       {
//         type: "boxSection",
//         heading: "Travel",
//         question: "How do you travel to work or to your day service? (Please tick the appropriate box)",
//         key: "travelArrangements",
//         options: [
//           "Taxi",
//           "Pick up/ drop off by Parent/Family/Support Person",
//           "Transport by a provider",
//           "Independently use Public Transport",
//           "Walk",
//           "Assisted Public Transport",
//           "Drive own car.",
//           "Other",
//         ],
//         otherKey: "travelArrangementsOther",
//       },
//     ],
//     footer: true,
//   },
//  medicationInfoSchema : {
//   logo: {
//     src: "/infinity_logo.png",
//     alt: "Infinity Supports WA logo with infinity symbol in red above text",
//     width: 120,
//     height: 50,
//   },
//   title: "Medication Information/Diagnosis/Health Concerns",
//   fields: [
//     {
//       key: "medicationChart",
//       label: "Does the Participant require a Medication Chart?",
//       yesDetail:
//         "(If yes, is this medication taken on a regular basis and for what purpose, ensure to complete Medication Chart and Participant risk assessment)",
//     },
//     {
//       key: "mealtimeManagement",
//       label: "Does the Participant require Mealtime Management?",
//       yesDetail: "If yes, refer to Mealtime Management Plan Form",
//     },
//     {
//       key: "bowelCare",
//       label: "Does the participant require Bowel Care Management?",
//       yesDetail:
//         "If yes, refer to Complex Bowel Care Plan and Monitoring Form and indicate what assistance is required with bowel care.",
//     },
//     {
//       key: "menstrualIssues",
//       label:
//         "Are there any issues with a menstrual cycle or is assistance needed with female hygiene",
//       yesDetail: "If yes, please specify:",
//     },
//     {
//       key: "epilepsy",
//       label: "Does the Participant have Epilepsy?",
//       yesDetail: "If yes, ensure Participant’s Doctor completes an Epilepsy Plan",
//     },
//     {
//       key: "asthmatic",
//       label: "Is the Participant an Asthmatic?",
//       yesDetail: "If yes, ensure Participant’s Doctor completes an Asthma Plan",
//     },
//     {
//       key: "allergies",
//       label: "Does the Participant have any allergies?",
//       yesDetail: "If yes, ensure to have an Allergy Plan from Participant’s Doctor",
//     },
//     {
//       key: "anaphylactic",
//       label: "Is the Participant anaphylactic?",
//       yesDetail: "If yes, ensure to have an anaphylaxis Plan from the Participant’s Doctor",
//     },
//      {
//       key: "minorInjury",
//       label: "Do you give permission for our company’s staff to administer band-aids in cases of a minor injury?",
//       //yesDetail: "If yes, ensure Participant’s Doctor completes an Asthma Plan",
//     },
//     {
//       key: "training",
//       label: "Does this participant require specific training",
//       yesDetail: "If yes, ensure to provide information such as implementing a positive behaviour support plan.",
//     },
//     {
//       key: "othermedical",
//       label: "Are there any other medication conditions that will be relevant to the care provided to this Participant?",
//       yesDetail: "If yes, Please specify",
//     },
//     {
//       key: "trigger",
//       label: "Is there any specific trigger for community activities?",
//       yesDetail: "If yes, please specify and complete the Risk assessment for participants. ",
//     },
//   ],
// },
// safetyConsiderationSchema : {
//   logo: {
//     src: "/infinity_logo.png",
//     alt: "Infinity Supports WA logo with infinity symbol in red above text",
//     width: 120,
//     height: 50,
//   },
//   title: "Safety Considerations",
//   fields: [
//     {
//       key: "absconding",
//       label: "Does the Participant show signs or a history of unexpectedly leaving (absconding)?",
//       yesDetail:
//         "If yes, please specify.",
//     },
//     {
//       key: "historyOfFalls",
//       label: "Is this participant prone to falls or have a history of falls? ",
//       //: "If yes, refer to Mealtime Management Plan Form",
//     },
//     {
//       key: "behaviourConcern",
//       label: "Are there any behaviours of concern? E.g.:.kicking, biting",
//       yesDetail:
//         "If yes, please specify.",
//     },
//     {
//       key: "positiveBehaviour",
//       label:
//         "Is there a current Positive Behaviour Support Plan in place",
//       yesDetail: "If yes, refer to High Risk Participant Register.",
//     },
//     {
//       key: "communicationAssistance",
//       label: "If yes, refer to the mode of communication reflected in Participant Risk Assessment and disaster management plan",
//       yesDetail: "If yes, ensure Participant’s Doctor completes an Epilepsy Plan",
//     },
//     {
//       key: "physicalAssistance",
//       label: "Is there any physical assistance or physical assistance preference for this Participant?",
//       yesDetail: "If yes, specify",
//     },
//     {
//       key: "languageConcern",
//       label: "Does the Participant have any expressive language concerns?",
//       yesDetail: "If yes, refer to Participant Risk Assessment and disaster management plan under OH&S Assessments and Mode of Communication",
//     },
//     {
//       key: "personalGoals",
//       label: "Does this Participant have any personal preferences & personal goals?",
//       yesDetail: "If yes, refer to form Support Plan",
//     },
//   ],
// }

// };

// const formData = {
//   date: "2025-06-08",
//   ndisNumber: "123456789",
//   givenName: "John",
//   surname: "Doe",
//   sex: ["Male"],
//   sexOther: "",
//   pronoun: "He/Him",
//   aboriginalTorres: ["No"],
//   preferredName: "Johnny",
//   dateOfBirth: "1990-01-01",
//   addressNumberStreet: "123 Main St",
//   state: "WA",
//   postcode: "6000",
//   email: "john.doe@example.com",
//   homePhone: "08 1234 5678",
//   mobile: "0412 345 678",
//   disabilityConditions: "None",

//   medicalCentreName: "Health Clinic WA",
//   medicalPhone: "08 9876 5432",
//   supportCoordinatorName: "Jane Smith",
//   supportCoordinatorEmail: "jane.smith@example.com",
//   supportCoordinatorCompany: "Support Co.",
//   supportCoordinatorContact: "0411 222 333",
//   otherSupports: "Physiotherapy, Occupational Therapy",

//    allAboutMe: "I love reading and music.",
//   advocateName: "Jane Doe",
//   advocateRelationship: "Mother",
//   advocatePhone: "08 1234 5678",
//   advocateMobile: "0412 345 678",
//   advocateEmail: "jane.doe@example.com",
//   advocateAddress: "123 Main St, Perth",
//   advocatePostalAddress: "PO Box 123, Perth",
//   advocateOtherInfo: "N/A",
//   personalSituation: {
//     barriers: "No",
//     interpreter: "No",
//     language: "English",
//     culturalValues: "None",
//     culturalBehaviours: "None",
//     writtenCommunication: "No issues",
//     countryOfBirth: "Australia",
//   },

//   primaryContactName: "Michael Brown",
//   primaryContactRelationship: "Brother",
//   primaryContactHomePhone: "08 3333 4444",
//   primaryContactMobile: "0412 333 444",
//   secondaryContactName: "Emma Brown",
//   secondaryContactRelationship: "Sister",
//   secondaryContactHomePhone: "08 5555 6666",
//   secondaryContactMobile: "0412 555 666",
//   livingArrangements: ["Live with Parent/Family/Support Person", "Owns own home."],
//   livingArrangementsOther: "",
//   travelArrangements: ["Taxi", "Drive own car."],
//   travelArrangementsOther: "Occasionally carpool",

//   medicationChart: "Yes",
//   mealtimeManagement: "No",
//   bowelCare: "No",
//   menstrualIssues: "No",
//   epilepsy: "No",
//   asthmatic: "No",
//   allergies: "Yes",
//   anaphylactic: "No",
//   minorInjury: "No",
//   training: "No",
//   othermedical: "Yes",
//   trigger: "Yes",

//   absconding: "Yes",
//   historyOfFalls: "No",
//   behaviourConcern: "Yes",
//   positiveBehaviour: "No",
//   communicationAssistance: "No",
//   physicalAssistance: "No",
//   languageConcern: "No",
//   personalGoals: "Yes"

// };

// ====== Main container rendering all forms ======
const CombinedForms = ({ formSchemas, formData }: any) => (
  <div className="space-y-12 bg-gray-100 py-8 flex flex-col items-center">
    <ClientIntakeForm
      formSchema={formSchemas.clientIntakeSchema}
      formData={formData}
    />
    <GpMedicalSupportForm
      formSchema={formSchemas.gpMedicalSupportSchema}
      formData={formData}
    />
    <AllAboutMeForm
      formSchema={formSchemas.allAboutMeSchema}
      formData={formData}
    />
    <ContactsLivingTravelForm
      formSchema={formSchemas.contactsLivingTravelSchema}
      formData={formData}
    />

    <MedicationInfoForm
      formSchema={formSchemas.medicationInfoSchema}
      formData={formData}
    />

    <SafetyConsiderationForm
      formSchema={formSchemas.safetyConsiderationSchema}
      formData={formData}
    />

    <button onClick={handleDownload}>Download</button>
  </div>
);

export default CombinedForms;
