const formSchema : any = {
    "formKey": "client_intake_form",
    "title": "Client Intake Form",
    "schema": {
  "clientIntakeSchema": {
    "pageTitle": "Client Intake Form",
    "logo": {
      "src": "/infinity_logo.png",
      "alt": "Infinity Supports WA logo with text below",
      "width": 200,
      "height": 60
    },
    "fields": [
      { "type": "sectionHeader", "label": "Participant Details", "colSpan": 2 },
      { "label": "Date:", "key": "date", "type": "text", "colSpan": 2 },
      { "label": "NDIS Number:", "key": "ndisNumber", "type": "text", "colSpan": 2 },
      { "label": "Given name(s):", "key": "givenName", "type": "text", "width": "50%" },
      { "label": "Surname:", "key": "surname", "type": "text", "width": "25%" },
      {
        "label": "Sex:",
        "key": "sex",
        "type": "checkboxGroup",
        "width": "25%",
        "options": ["Male", "Female", "Prefer not to say"],
        "otherKey": "sexOther"
      },
      { "label": "Pronoun:", "key": "pronoun", "type": "text", "colSpan": 3 },
      {
        "label": "Are you an Aboriginal or Torres Strait Island descent?",
        "key": "aboriginalTorres",
        "type": "checkboxGroup",
        "colSpan": 1,
        "options": ["Yes", "No"],
        "width": "auto"
      },
      { "label": "Preferred name:", "key": "preferredName", "type": "text", "colSpan": 2 },
      { "label": "Date of Birth:", "key": "dateOfBirth", "type": "text", "width": "auto" },
      { "type": "sectionHeader", "label": "Residential Address Details", "colSpan": 3 },
      { "label": "Number / Street:", "key": "addressNumberStreet", "type": "text", "colSpan": 3 },
      { "label": "State:", "key": "state", "type": "text", "width": "50%" },
      { "label": "Postcode:", "key": "postcode", "type": "text", "colSpan": 2, "width": "50%" },
      { "type": "sectionHeader", "label": "Participant Contact Details", "colSpan": 3 },
      { "label": "Email address:", "key": "email", "type": "text", "colSpan": 3 },
      { "label": "Home Phone No:", "key": "homePhone", "type": "text", "width": "50%" },
      { "label": "Mobile No:", "key": "mobile", "type": "text", "colSpan": 2, "width": "50%" },
      { "type": "sectionHeader", "label": "Disability Conditions/Disability type(s)", "colSpan": 3 },
      {
        "label": "",
        "key": "disabilityConditions",
        "type": "textarea",
        "colSpan": 3,
        "height": 150
      }
    ],
    "footer": true
  },
  "gpMedicalSupportSchema": {
    "logo": {
      "src": "/infinity_logo.png",
      "alt": "Infinity Supports WA logo with infinity symbol and text Achieving Goals and Beyond",
      "width": 150,
      "height": 60
    },
    "fields": [
      { "type": "sectionHeader", "label": "GP Medical Contact", "colSpan": 2 },
      { "label": "Medical Centre Name:", "key": "medicalCentreName", "type": "text", "colSpan": 2 },
      { "label": "Phone:", "key": "medicalPhone", "type": "text", "colSpan": 2 },
      { "type": "sectionHeader", "label": "Support Coordinator", "colSpan": 2, "bgColor": "bg-gray-100" },
      { "label": "Name:", "key": "supportCoordinatorName", "type": "text", "width": "50%" },
      { "label": "Email Address:", "key": "supportCoordinatorEmail", "type": "text", "width": "50%" },
      { "label": "Company:", "key": "supportCoordinatorCompany", "type": "text", "width": "50%" },
      { "label": "Contact number:", "key": "supportCoordinatorContact", "type": "text", "width": "50%" },
      {
        "type": "sectionHeader",
        "label": "What other supports including mainstream health services you receive at present",
        "colSpan": 2,
        "bgColor": "bg-gray-300"
      },
      {
        "label": "",
        "key": "otherSupports",
        "type": "textarea",
        "colSpan": 2,
        "height": 256
      }
    ],
    "footer": true
  },
  "allAboutMeSchema": {
    "logo": {
      "src": "/infinity_logo.png",
      "alt": "Infinity Supports WA logo with infinity symbol and text Achieving Goals and Beyond",
      "width": 150,
      "height": 60
    },
    "sections": {
      "allAboutMe": {
        "title": "All About Me"
      },
      "advocateDetails": {
        "title": "Advocate/representative details (if applicable)",
        "fields": {
          "name": "Name:",
          "relationship": "Relationship with the participant:",
          "phone": "Phone No:",
          "mobile": "Mobile No:",
          "email": "Email:",
          "address": "Address Details:",
          "postalAddress": "Postal Address Details:",
          "otherInfo": "Other Information:"
        }
      },
      "personalSituation": {
        "title": "Personal Situation",
        "fields": {
          "barriers": {
            "label": "Are there any cultural, communication barriers or intimacy issues that need to be considered when delivering services?",
            "options": ["Yes", "No"],
            "followUp": "If yes, please indicate below:"
          },
          "interpreter": {
            "label": "Verbal communication or spoken language - Is an interpreter needed?",
            "options": ["Yes", "No"]
          },
          "language": { "label": "Language" },
          "culturalValues": { "label": "Cultural values/ beliefs or assumptions" },
          "culturalBehaviours": { "label": "Cultural behaviours" },
          "writtenCommunication": { "label": "Written communication/literacy" },
          "countryOfBirth": { "label": "Country of birth" }
        }
      }
    }
  },
  "contactsLivingTravelSchema": {
    "pageTitle": "Contacts, Living and Travel",
    "logo": {
      "src": "/infinity_logo.png",
      "alt": "Infinity Supports WA logo with pink infinity symbol and text below",
      "width": 150,
      "height": 70
    },
    "fields": [
      { "type": "contactHeader", "label": "Primary Contact" },
      {
        "type": "contactRow",
        "columns": [
          { "label": "Contact Name:", "key": "primaryContactName" },
          { "label": "Relationship:", "key": "primaryContactRelationship" }
        ]
      },
      {
        "type": "contactRow",
        "columns": [
          { "label": "Home Phone No:", "key": "primaryContactHomePhone" },
          { "label": "Mobile No:", "key": "primaryContactMobile" }
        ]
      },
      { "type": "contactHeader", "label": "Secondary Contact" },
      {
        "type": "contactRow",
        "columns": [
          { "label": "Contact Name:", "key": "secondaryContactName" },
          { "label": "Relationship:", "key": "secondaryContactRelationship" }
        ]
      },
      {
        "type": "contactRow",
        "columns": [
          { "label": "Home Phone No:", "key": "secondaryContactHomePhone" },
          { "label": "Mobile No:", "key": "secondaryContactMobile" }
        ]
      },
      {
        "type": "boxSection",
        "heading": "Living and support arrangements",
        "question": "What is your current living arrangement? (Please tick the appropriate box)",
        "key": "livingArrangements",
        "options": [
          "Live with Parent/Family/Support Person",
          "Live in private rental arrangement with others",
          "Live in private rental arrangement alone",
          "Owns own home.",
          "Aged Care Facility",
          "Mental Health Facility",
          "Lives in public housing",
          "Short Term Crisis/Respite",
          "Staff Supported Group Home",
          "Hostel/SRS Private Accommodation",
          "Other"
        ],
        "otherKey": "livingArrangementsOther"
      },
      {
        "type": "boxSection",
        "heading": "Travel",
        "question": "How do you travel to work or to your day service? (Please tick the appropriate box)",
        "key": "travelArrangements",
        "options": [
          "Taxi",
          "Pick up/ drop off by Parent/Family/Support Person",
          "Transport by a provider",
          "Independently use Public Transport",
          "Walk",
          "Assisted Public Transport",
          "Drive own car.",
          "Other"
        ],
        "otherKey": "travelArrangementsOther"
      }
    ],
    "footer": true
  },
  "medicationInfoSchema": {
    "logo": {
      "src": "/infinity_logo.png",
      "alt": "Infinity Supports WA logo with infinity symbol in red above text",
      "width": 120,
      "height": 50
    },
    "title": "Medication Information/Diagnosis/Health Concerns",
    "fields": [
      {
        "key": "medicationChart",
        "label": "Does the Participant require a Medication Chart?",
        "yesDetail": "If yes, is this medication taken on a regular basis and for what purpose, ensure to complete Medication Chart and Participant risk assessment"
      },
      {
        "key": "mealtimeManagement",
        "label": "Does the Participant require Mealtime Management?",
        "yesDetail": "If yes, refer to Mealtime Management Plan Form"
      },
      {
        "key": "bowelCare",
        "label": "Does the participant require Bowel Care Management?",
        "yesDetail": "If yes, refer to Complex Bowel Care Plan and Monitoring Form and indicate what assistance is required with bowel care."
      },
      {
        "key": "menstrualIssues",
        "label": "Are there any issues with a menstrual cycle or is assistance needed with female hygiene",
        "yesDetail": "If yes, please specify:"
      },
      {
        "key": "epilepsy",
        "label": "Does the Participant have Epilepsy?",
        "yesDetail": "If yes, ensure Participant’s Doctor completes an Epilepsy Plan"
      },
      {
        "key": "asthmatic",
        "label": "Is the Participant an Asthmatic?",
        "yesDetail": "If yes, ensure Participant’s Doctor completes an Asthma Plan"
      },
      {
        "key": "allergies",
        "label": "Does the Participant have any allergies?",
        "yesDetail": "If yes, ensure to have an Allergy Plan from Participant’s Doctor"
      },
      {
        "key": "anaphylactic",
        "label": "Is the Participant anaphylactic?",
        "yesDetail": "If yes, ensure to have an anaphylaxis Plan from the Participant’s Doctor"
      },
      {
        "key": "minorInjury",
        "label": "Do you give permission for our company’s staff to administer band-aids in cases of a minor injury?"
      },
      {
        "key": "training",
        "label": "Does this participant require specific training",
        "yesDetail": "If yes, ensure to provide information such as implementing a positive behaviour support plan."
      },
      {
        "key": "othermedical",
        "label": "Are there any other medication conditions that will be relevant to the care provided to this Participant?",
        "yesDetail": "If yes, Please specify"
      },
      {
        "key": "trigger",
        "label": "Is there any specific trigger for community activities?",
        "yesDetail": "If yes, please specify and complete the Risk assessment for participants."
      }
    ]
  },
  "safetyConsiderationSchema": {
  "title": "Safety Considerations",
  "logo": {
    "src": "/infinity_logo.png",
    "alt": "Infinity Supports WA logo with infinity symbol in red above text",
    "width": 120,
    "height": 50
  },
  "fields": [
    {
      "key": "absconding",
      "label": "Does the Participant show signs or a history of unexpectedly leaving (absconding)?",
      "yesDetail": "If yes, please specify."
    },
    {
      "key": "historyOfFalls",
      "label": "Is this participant prone to falls or have a history of falls?"
    },
    {
      "key": "behaviourConcern",
      "label": "Are there any behaviours of concern? E.g.:.kicking, biting",
      "yesDetail": "If yes, please specify."
    },
    {
      "key": "positiveBehaviour",
      "label": "Is there a current Positive Behaviour Support Plan in place",
      "yesDetail": "If yes, refer to High Risk Participant Register."
    },
    {
      "key": "communicationAssistance",
      "label": "If yes, refer to the mode of communication reflected in Participant Risk Assessment and disaster management plan",
      "yesDetail": "If yes, ensure Participant’s Doctor completes an Epilepsy Plan"
    },
    {
      "key": "physicalAssistance",
      "label": "Is there any physical assistance or physical assistance preference for this Participant?",
      "yesDetail": "If yes, specify"
    },
    {
      "key": "languageConcern",
      "label": "Does the Participant have any expressive language concerns?",
      "yesDetail": "If yes, refer to Participant Risk Assessment and disaster management plan under OH&S Assessments and Mode of Communication"
    },
    {
      "key": "personalGoals",
      "label": "Does this Participant have any personal preferences & personal goals?",
      "yesDetail": "If yes, refer to form Support Plan"
    }
  ]
}
}
}
// ✅ Shared for all pages
const commonFieldMapping: Record<string, string> = {
  givenName: "name",
  dateOfBirth: "dob",
  ndisNumber: "ndis",
  sex: "sex",
  addressNumberStreet: "street",
  state: "state",
  postcode: "postCode",
  homePhone: "phone",
  email: "email",
  disabilityConditions: "disability",
};
// Helper function to check if a field is a common field
const isCommonField = (fieldKey: string): boolean => {
  return Object.keys(commonFieldMapping).includes(fieldKey);
};
// Helper function to get the appropriate value (from commonFields or formData)
// 
const getFieldValue = (
  key: string,
  formData: Record<string, any>,
  commonFields: Record<string, any>
) => {
  return key in commonFieldMapping
    ? commonFields?.[commonFieldMapping[key]] ?? ""
    : formData?.[key] ?? "";
};
const A4Page = ({ children, className = "" }: any) => (
  <div
    className={`bg-white mx-auto shadow-md flex flex-col ${className}`}
    style={{
      width: "794px",  // A4 width in px
      height: "1123px", // A4 height in px
      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      pageBreakAfter: "always",
    }}
  >
    {children}
  </div>
);
  
const Page1 = ({ formSchema, formData = {}, commonFields = {}, images }: any) => {
  const pageSchema = formSchema.schema.clientIntakeSchema;
  const displayCheckboxGroup = (options: any, selected: any[] = [], otherValue: any = "") => (
    <div className="space-y-1 text-xs">
      {options.map((opt: any) => (
        <div key={opt} className="flex  space-x-1">
          <span className="w-4 h-4 border border-black flex justify-center ">
            {selected?.includes(opt) ? "✔" : ""}
          </span>
          <span>{opt}</span>
        </div>
      ))}
      {otherValue && (
        <div className="flex  space-x-1">
          <span className="w-4 h-4 border border-black flex justify-center ">✔</span>
          <span>{otherValue}</span>
        </div>
      )}
    </div>
  );
  return (
    <A4Page>
      <div
        className="w-full h-full flex flex-col justify-between px-6 py-4"
        style={{
          height: "1123px", // exact A4 height @ 96dpi
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div className="flex justify-center mb-4">
          <img
            alt={pageSchema.logo.alt}
            src={images.infinityLogo}
            width={pageSchema.logo.width}
            height={pageSchema.logo.height}
            className="object-contain"
          />
        </div>
        {/* Main content */}
        <div className="flex-1">
          <table className="w-full border-collapse border border-black text-xs">
            <thead>
              <tr>
                <th className="border border-black font-bold text-center py-1" colSpan={3}>
                  {pageSchema.pageTitle}
                </th>
              </tr>
            </thead>
            <tbody>
              {pageSchema.fields.map((field: any, idx: any) => {
                const value = getFieldValue(field.key, formData, commonFields);
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
                        {value}
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
                      <td className="border border-black px-1 py-0.5" colSpan={field.colSpan ? field.colSpan - 1 : 2}>
                        {displayCheckboxGroup(
                          field.options,
                          value,
                          field.otherKey ? getFieldValue(field.otherKey, formData, commonFields) : ""
                        )}
                      </td>
                    </tr>
                  );
                }
                return (
                  <tr key={idx}>
                    <td className="border border-black px-1 py-0.5 font-semibold" style={{ width: field.width || "auto" }}>
                      {field.label}
                    </td>
                    <td className="border border-black px-1 py-0.5" colSpan={field.colSpan || 2}>
                      {value}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Footer pinned at bottom */}
        {pageSchema.footer && (
          <div className="flex justify-between text-[10px] text-gray-600 mt-2">
            <div>Website: infinitysupportswa.org</div>
            <div>CF001</div>
            <div>Review Date: 14/03/2026</div>
          </div>
        )}
      </div>
    </A4Page>
  );
};
const Page2 = ({ formSchema, formData = {}, commonFields = {}, images }: any) => {
  const pageSchema = formSchema.schema.gpMedicalSupportSchema;
  const displayCheckboxGroup = (options: any, selected: any[] = [], otherValue: any = "") => (
    <div className="space-y-1 text-xs">
      {options.map((opt: any) => (
        <div key={opt} className="flex  space-x-1">
          <span className="w-4 h-4 border border-black flex justify-center ">
            {selected?.includes(opt) ? "✔" : ""}
          </span>
          <span>{opt}</span>
        </div>
      ))}
      {otherValue && (
        <div className="flex  space-x-1">
          <span className="w-4 h-4 border border-black flex justify-center ">✔</span>
          <span>{otherValue}</span>
        </div>
      )}
    </div>
  );
  return (
    <A4Page>
    <div className="
    " style={{ height: "1123px", boxSizing: "border-box" }}>
      <div className="flex justify-center py-4">
        <img alt={pageSchema.logo.alt} height={pageSchema.logo.height} src={images.infinityLogo} width={pageSchema.logo.width} className="object-contain" />
      </div>
      <div className="px-6 flex-1 flex flex-col
    ">
        <table className="w-full flex-1 border-collapse border border-black text-[13px]">
          <tbody>
            {pageSchema.fields.map((field: any, idx: any) => {
              const value = getFieldValue(field.key, formData, commonFields);
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
                    <td className="border border-black align-top p-2" colSpan={field.colSpan || 2} style={{ height: field.height || 256 }}>
                      {value}
                    </td>
                  </tr>
                );
              }
              if (field.type === "checkboxGroup") {
                return (
                  <tr key={idx}>
                    <td className="border border-black px-2 py-1 font-semibold" style={{ width: field.width || "auto" }} colSpan={field.colSpan || 1}>
                      {field.label}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {displayCheckboxGroup(field.options, value, field.otherKey ? getFieldValue(field.otherKey, formData, commonFields) : "")}
                    </td>
                  </tr>
                );
              }
              return (
                <tr key={idx}>
                  <td className="border border-black px-2 py-1 font-semibold" style={{ width: field.width || "auto" }}>
                    {field.label}
                  </td>
                  <td className="border border-black px-2 py-1">
                    {value}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {pageSchema.footer && (
          <div className="flex justify-between text-[10px] text-gray-600 mt-4 px-1">
            <div>Website: infinitysupportswa.org</div>
            <div>CF001</div>
            <div>Review Date: 14/03/2026</div>
          </div>
        )}
      </div>
    </div>
    </A4Page>
  );
};
const Page3 = ({ formSchema, formData = {}, commonFields = {}, images }: any) => {
  const pageSchema = formSchema.schema.allAboutMeSchema;
  const renderPersonalSituation = (psSchema: any, psData: any = {}) => (
    <div className="space-y-1 text-[11px]">
      <div>
        <span className="font-bold">{psSchema.barriers.label}</span>
        <span className="ml-1 mr-1 w-4 h-4 border border-black inline-flex  justify-center">
          {psData.barriers === "Yes" ? "✔" : ""}
        </span>
        {psSchema.barriers.options[0]}
        <span className="ml-1 mr-1 w-4 h-4 border border-black inline-flex  justify-center">
          {psData.barriers === "No" ? "✔" : ""}
        </span>
        {psSchema.barriers.options[1]}
        <span className="ml-2">{psSchema.barriers.followUp}</span>
      </div>
      <div>
        {psSchema.interpreter.label}
        <span className="ml-1 mr-1 w-4 h-4 border border-black inline-flex  justify-center">
          {psData.interpreter === "Yes" ? "✔" : ""}
        </span>
        {psSchema.interpreter.options[0]}
        <span className="ml-1 mr-1 w-4 h-4 border border-black inline-flex  justify-center">
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
    <A4Page>
    <div className="
    " style={{ height: "1123px", boxSizing: "border-box" }}>
      <div className="flex justify-center py-4">
        <img alt={pageSchema.logo.alt} height={pageSchema.logo.height} src={images.infinityLogo} width={pageSchema.logo.width} className="object-contain" />
      </div>
      <div className="px-6 flex-1 flex flex-col
    ">
        <table className="w-full border border-black border-collapse text-[11px]" style={{ width: "210mm", tableLayout: "fixed" }}>
          <tbody>
            <tr>
              <th className="border border-black text-left font-bold px-1 py-0.5 bg-gray-300" colSpan={2}>
                {pageSchema.sections.allAboutMe.title}
              </th>
            </tr>
            <tr>
              <td className="border border-black h-[150px] align-top px-1 py-0.5" colSpan={2}>
                {getFieldValue("allAboutMe", formData, commonFields)}
              </td>
            </tr>
            <tr>
              <th className="border border-black text-left font-bold px-1 py-0.5 bg-gray-300" colSpan={2}>
                {pageSchema.sections.advocateDetails.title}
              </th>
            </tr>
            <tr>
              <td className="border border-black px-1 py-0.5">
                {pageSchema.sections.advocateDetails.fields.name} {getFieldValue("advocateName", formData, commonFields)}
              </td>
              <td className="border border-black px-1 py-0.5">
                {pageSchema.sections.advocateDetails.fields.relationship} {getFieldValue("advocateRelationship", formData, commonFields)}
              </td>
            </tr>
            <tr>
              <td className="border border-black px-1 py-0.5">
                {pageSchema.sections.advocateDetails.fields.phone} {getFieldValue("advocatePhone", formData, commonFields)}
              </td>
              <td className="border border-black px-1 py-0.5">
                {pageSchema.sections.advocateDetails.fields.mobile} {getFieldValue("advocateMobile", formData, commonFields)}<br />
                {pageSchema.sections.advocateDetails.fields.email} {getFieldValue("advocateEmail", formData, commonFields)}
              </td>
            </tr>
            <tr>
              <td className="border border-black px-1 py-0.5" colSpan={2}>
                {pageSchema.sections.advocateDetails.fields.address} {getFieldValue("advocateAddress", formData, commonFields)}
              </td>
            </tr>
            <tr>
              <td className="border border-black px-1 py-0.5" colSpan={2}>
                {pageSchema.sections.advocateDetails.fields.postalAddress} {getFieldValue("advocatePostalAddress", formData, commonFields)}
              </td>
            </tr>
            <tr>
              <td className="border border-black px-1 py-0.5" colSpan={2}>
                {pageSchema.sections.advocateDetails.fields.otherInfo} {getFieldValue("advocateOtherInfo", formData, commonFields)}
              </td>
            </tr>
            <tr>
              <th className="border border-black text-left font-bold px-1 py-0.5 bg-gray-300" colSpan={2}>
                {pageSchema.sections.personalSituation.title}
              </th>
            </tr>
            <tr>
              <td className="border border-black px-1 py-0.5" colSpan={2}>
                {renderPersonalSituation(pageSchema.sections.personalSituation.fields, getFieldValue("personalSituation", formData, commonFields) || {})}
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
    </A4Page>
  );
};
const Page4 = ({ formSchema, formData = {}, commonFields = {}, images }: any) => {
  const pageSchema = formSchema.schema.contactsLivingTravelSchema;
  const renderCheckboxList = (options: any, selected: any[] = [], otherValue = "") => (
    <ul className="list-none ml-4 space-y-0.5">
      {options.map((opt: any) => (
        <li key={opt} className="flex  space-x-2">
          <label className="inline-flex  flex-shrink-0 space-x-2">
            <span className="w-4 h-4 border border-black flex  justify-center mr-2">
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
    <A4Page>
      <div
        className="
    "
        style={{ height: "1123px", boxSizing: "border-box" }}
      >
        <div className="flex justify-center py-4">
          <img
            alt={pageSchema.logo?.alt || "Logo"}
            height={pageSchema.logo?.height || 80}
            src={images.infinityLogo}
            width={pageSchema.logo?.width || 200}
            className="object-contain"
          />
        </div>
        <div className="px-6 flex-1 flex flex-col
    ">
          <table className="w-full border border-black border-collapse text-[13px]" style={{ width: "210mm", tableLayout: "fixed" }}>
            <tbody>
              {pageSchema.fields?.map((field: any, idx: number) => {
                if (field.type === "contactHeader") {
                  return (
                    <tr key={idx} className="bg-gray-300 font-bold text-[13px]">
                      <td className="border border-black px-2 py-1" style={{ width: "33.33%" }}>{field.label}</td>
                      <td className="border border-black px-2 py-1"></td>
                      <td className="border border-black px-2 py-1"></td>
                    </tr>
                  );
                }
                if (field.type === "contactRow") {
                  return (
                    <tr key={idx}>
                      <td className="border border-black px-2 py-1">
                        {field.columns[0].label} {getFieldValue(field.columns[0].key, formData, commonFields)}
                      </td>
                      <td className="border border-black px-2 py-1"></td>
                      <td className="border border-black px-2 py-1">
                        {field.columns[1].label} {getFieldValue(field.columns[1].key, formData, commonFields)}
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
                          getFieldValue(field.key, formData, commonFields) || [],
                          getFieldValue(field.otherKey, formData, commonFields) || ""
                        )}
                      </td>
                    </tr>
                  );
                }
                return null;
              })}
            </tbody>
          </table>
          {pageSchema.footer && (
            <div className="flex justify-between text-[10px] text-gray-600 mt-4 px-2">
              <div>Website: infinitysupportswa.org</div>
              <div>CF001</div>
              <div>Review Date: 14/03/2026</div>
            </div>
          )}
        </div>
      </div>
    </A4Page>
  );
};
const Page5 = ({ formSchema, formData = {}, commonFields = {}, images }: any) => {
  const pageSchema = formSchema.schema.medicationInfoSchema;
  return (
    <A4Page>
    <div className="
    " style={{ width: "210mm", height: "1123px",   }}>
      <div className="flex justify-center py-4">
        <img alt={pageSchema.logo.alt} src={images.infinityLogo} width={pageSchema.logo.width} height={pageSchema.logo.height} className="object-contain" />
      </div>
      <div className="px-6 flex-1 flex flex-col
    ">
        <table className="w-full border border-black border-collapse text-[12px]" style={{ width: "210mm", tableLayout: "fixed" }}>
          <thead>
            <tr className="bg-gray-300">
              <th className="border border-black p-1 text-left font-semibold">{pageSchema.title}</th>
              <th className="border border-black p-1 w-[180px] text-left font-semibold"></th>
              <th className="border border-black p-1 w-[60px] text-center font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {pageSchema.fields.map((field: any, idx: number) => {
              const value = getFieldValue(field.key, formData, commonFields);
              return (
                <tr key={idx}>
                  <td className="border border-black p-1 align-top w-[320px]">{field.label}</td>
                  <td className="border border-black p-1 align-top text-[11px]">
                    <div className="inline-flex items-start space-x-1">
                      <span className="w-4 h-4 border border-black flex  justify-center mt-1">
                        {value === "Yes" ? "✔" : ""}
                      </span>
                      <span>Yes</span>
                    </div>
                    {field.yesDetail && <div className="mt-1 leading-tight">{field.yesDetail}</div>}
                  </td>
                  <td className="border border-black p-1 text-center align-top">
                    <span className="w-4 h-4 border border-black flex  justify-center">
                      {value === "No" ? "✔" : ""}
                    </span>
                    <span className="m-1">No</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-between text-[11px] text-gray-600 mt-4 px-1">
          <div>Website: infinitysupportswa.org</div>
          <div>CF001</div>
          <div>Review Date: 14/03/2026</div>
        </div>
      </div>
    </div>
    </A4Page>
  );
};
const Page6 = ({ formSchema, formData = {}, commonFields = {} , images}: any) => {
  const pageSchema = formSchema.schema.safetyConsiderationSchema;
  return (
    <A4Page>
    <div className="
    " style={{ width: "210mm", height: "1123px",   }}>
      <div className="flex justify-center py-4">
        <img alt={pageSchema.logo.alt} src={images.infinityLogo} width={pageSchema.logo.width} height={pageSchema.logo.height} className="object-contain" />
      </div>
      <div className="px-6 flex-1 flex flex-col
    ">
        <table className="w-full flex-1 border border-black border-collapse text-[12px]">
          <thead>
            <tr className="bg-gray-300">
              <th className="border border-black p-1 text-left font-semibold">{pageSchema.title}</th>
              <th className="border border-black p-1 w-[180px] text-left font-semibold"></th>
              <th className="border border-black p-1 w-[60px] text-center font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {pageSchema.fields.map((field: any, idx: number) => {
              const value = getFieldValue(field.key, formData, commonFields);
              return (
                <tr key={idx}>
                  <td className="border border-black p-1 align-top w-[320px]">{field.label}</td>
                  <td className="border border-black p-1 align-top text-[11px]">
                    <div className="inline-flex items-start space-x-1">
                      <span className="w-4 h-4 border border-black flex  justify-center mt-1">
                        {value === "Yes" ? "✔" : ""}
                      </span>
                      <span>Yes</span>
                    </div>
                    {field.yesDetail && <div className="mt-1 leading-tight">{field.yesDetail}</div>}
                  </td>
                  <td className="border border-black p-1 text-center align-top">
                    <span className="w-4 h-4 border border-black flex  justify-center">
                      {value === "No" ? "✔" : ""}
                    </span>
                    <span>No</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-between text-[11px] text-gray-600 mt-4 px-1">
          <div>Website: infinitysupportswa.org</div>
          <div>CF001</div>
          <div>Review Date: 14/03/2026</div>
        </div>
      </div>
    </div>
    </A4Page>
  );
};
const FormRenderer = ({  formData = {}, formKey,  commonFields, images } : any) => {
    return (
      <div className="print:p-0 
     ">
        <Page1
          formSchema={formSchema}
          formData={formData}
          commonFields={commonFields}
          images={images}
        />
        <Page2
          formSchema={formSchema}
          formData={formData}
          commonFields={commonFields}
          images={images}
        />
        <Page3
          formSchema={formSchema}
          formData={formData}
          commonFields={commonFields}
          images={images}
        />
        <Page4
          formSchema={formSchema}
          formData={formData}
          commonFields={commonFields}
          images={images}
        />
        <Page5
          formSchema={formSchema}
          formData={formData}
          commonFields={commonFields}
          images={images}
        />
        <Page6
          formSchema={formSchema}
          formData={formData}
          commonFields={commonFields}
          images={images}
        />
      </div>
    );
};
export default FormRenderer;
