




import React from "react";

const ClientIntakeForm = ({ formSchema, formData }) => {
  const displayCheckboxGroup = (options, selected = [], otherValue = "") => (
    <div className="space-y-1 text-xs">
      {options.map((opt) => (
        <div key={opt} className="flex items-center space-x-1 m-4">
          <span className="w-4 h-4 border border-black flex justify-center items-center">
            {selected.includes(opt) ? "✔" : ""}
          </span>
          <span className="m-1">{opt}</span>
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
                  <td className="border border-black px-1 py-0.5" colSpan={field.colSpan || 2}>
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
            <div>Review Date: 14/03/2026</div>
          </div>
        )}
      </div>
    </div>
  );
};

const GpMedicalSupportForm = ({ formSchema, formData }) => {
  const displayCheckboxGroup = (options, selected = [], otherValue = "") => (
    <div className="space-y-1 text-xs">
      {options.map((opt) => (
        <div key={opt} className="flex items-center space-x-1">
          <span className="w-4 h-4 border border-black flex justify-center items-center">
            {selected.includes(opt) ? "✔" : ""}
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
          <thead>
            {/* <tr className="bg-gray-300 font-bold text-[13px]">
              <th className="border border-black text-left px-2 py-1" colSpan={2}>
                {formSchema.pageTitle}
              </th>
            </tr> */}
          </thead>
          <tbody>
            {formSchema.fields.map((field, idx) => {
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
      <td className="border border-black px-2 py-1 font-semibold" style={{ width: field.width || "auto" }}>
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
            <div>Review Date: 14/03/2026</div>
          </div>
        )}
      </div>
    </div>
  );
};

const AllAboutMeForm = ({ formSchema, formData }) => {
  const renderPersonalSituation = (psSchema, psData) => (
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
                {formData.allAboutMe}
              </td>
            </tr>
            <tr>
              <th className="border border-black text-left font-bold text-[11px] px-1 py-0.5 bg-gray-300" colSpan={2}>
                {formSchema.sections.advocateDetails.title}
              </th>
            </tr>
            <tr>
              <td className="border border-black text-[11px] px-1 py-0.5">
                {formSchema.sections.advocateDetails.fields.name} {formData.advocateName}
              </td>
              <td className="border border-black text-[11px] px-1 py-0.5">
                {formSchema.sections.advocateDetails.fields.relationship} {formData.advocateRelationship}
              </td>
            </tr>
            <tr>
              <td className="border border-black text-[11px] px-1 py-0.5">
                {formSchema.sections.advocateDetails.fields.phone} {formData.advocatePhone}
              </td>
              <td className="border border-black text-[11px] px-1 py-0.5">
                {formSchema.sections.advocateDetails.fields.mobile} {formData.advocateMobile}
                <br />
                {formSchema.sections.advocateDetails.fields.email} {formData.advocateEmail}
              </td>
            </tr>
            <tr>
              <td className="border border-black text-[11px] px-1 py-0.5" colSpan={2}>
                {formSchema.sections.advocateDetails.fields.address} {formData.advocateAddress}
              </td>
            </tr>
            <tr>
              <td className="border border-black text-[11px] px-1 py-0.5" colSpan={2}>
                {formSchema.sections.advocateDetails.fields.postalAddress} {formData.advocatePostalAddress}
              </td>
            </tr>
            <tr>
              <td className="border border-black text-[11px] px-1 py-0.5" colSpan={2}>
                {formSchema.sections.advocateDetails.fields.otherInfo} {formData.advocateOtherInfo}
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
    {renderPersonalSituation(formSchema.sections.personalSituation.fields, formData.personalSituation)}
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

const ContactsLivingTravelForm = ({ formSchema, formData }) => {
  const renderCheckboxList = (options, selected, otherValue) => (
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

const MedicationInfoForm = ({ formSchema, formData }) => {
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
                  <span className="sr-only">No</span>
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

const SafetyConsiderationForm = ({ formSchema, formData }) => {
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
                  <span className="sr-only">No</span>
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

// ====== Sample usage in one file ======


// ====== Main container rendering all forms ======
const CombinedForms = ({formData, formSchemas}) => (
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


  </div>
);

export default CombinedForms;
