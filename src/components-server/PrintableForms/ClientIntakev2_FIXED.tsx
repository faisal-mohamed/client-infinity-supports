import React from "react";
import { format, parseISO, isValid } from "date-fns";

// ===== A4 PDF TYPOGRAPHY STANDARDS WITH MONTSERRAT =====
export const A4_PDF_TYPOGRAPHY = {
  // Main content hierarchy with improved line spacing
  title: 'text-base font-bold font-montserrat leading-relaxed',           // 16px - Form titles
  sectionHeader: 'text-sm font-semibold font-montserrat leading-relaxed', // 14px - Section headers
  subHeader: 'text-xs font-semibold font-montserrat leading-relaxed',     // 12px - Subsection headers
  body: 'text-xs font-normal font-montserrat leading-relaxed',            // 12px - Main content
  label: 'text-xs font-medium font-montserrat leading-relaxed',           // 12px - Field labels
  input: 'text-xs font-normal font-montserrat leading-relaxed',           // 12px - Input content
  small: 'text-xs font-normal font-montserrat leading-relaxed',           // 10px - Fine print
  footer: 'text-xs font-normal font-montserrat leading-normal',           // 10px - Footer content

  // Table specific
  tableHeader: 'text-xs font-bold font-montserrat leading-tight',         // 12px - Table headers
  tableCell: 'text-xs font-normal font-montserrat leading-relaxed',       // 12px - Table content

  // Signature section
  signatureLabel: 'text-xs font-semibold font-montserrat leading-relaxed', // 12px - Signature labels
  signatureContent: 'text-xs font-bold font-montserrat leading-relaxed',   // 12px - Signature content
} as const;

// ===== PDF-SPECIFIC FONT STYLES =====
export const PDF_FONT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
  
  * {
    font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  }
  
  .font-montserrat {
    font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  }
  
  /* Ensure consistent rendering across different environments */
  .pdf-container {
    font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
` as const;

// ===== STANDARDIZED LOGO CONFIGURATION =====
export const STANDARD_LOGO = {
  width: 180,
  height: 72,
  className: "object-contain"
} as const;

// ===== STANDARDIZED A4 PAGE WRAPPER =====
const A4Page = ({ children, footer, className = "" }: { children: React.ReactNode, footer?: React.ReactNode, className?: string }) => (
  <div
    className={`bg-white mx-auto shadow-md flex flex-col font-montserrat ${className}`}
    style={{
      width: "794px",  // A4 width in px (matches original)
      height: "1123px", // A4 height in px (matches original)
      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      pageBreakAfter: "always",
      boxSizing: 'border-box',
    }}
  >
    <div className="flex-1 flex flex-col">
      {children}
    </div>
    {footer && (
      <div className="mt-auto pt-4 border-t border-gray-200">
        {footer}
      </div>
    )}
  </div>
);

// --- Standardized Header Component ---
const StandardHeader = ({ images, title }: { images?: any, title?: string }) => (
  <div className="flex flex-col items-center gap-2 mb-4">
    <img
      src={images?.infinityLogo || "/infinity_logo.png"}
      alt="Logo"
      width={STANDARD_LOGO.width}
      height={STANDARD_LOGO.height}
      className={STANDARD_LOGO.className}
    />
    {title && (
      <h2 className={`${A4_PDF_TYPOGRAPHY.title} text-center uppercase`}>
        {title}
      </h2>
    )}
  </div>
);

// --- Standardized Footer Component ---
const StandardFooter = ({ settings }: { settings: any }) => {
  const formatDate = (value: string) => {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const parsed = parseISO(value);
      if (isValid(parsed)) {
        return format(parsed, "dd-MM-yyyy");
      }
    }
    return value || 'N/A';
  };

  return (
    <div className={`flex justify-between ${A4_PDF_TYPOGRAPHY.footer} px-1 text-gray-600`}>
      <span>Website: {settings?.company_website || ''}</span>
      <span>{settings?.client_intake_form_id || ''}</span>
      <span>Review Date: {formatDate(settings?.review_date)}</span>
    </div>
  );
};

// ===== FORM SCHEMA =====
const formSchema: any = {
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
              "followUp": "If yes, please indicate below:",
              "key": "barriers"
            },
            "interpreter": {
              "label": "Verbal communication or spoken language - Is an interpreter needed?",
              "options": ["Yes", "No"],
              "key": "interpreter"
            },
            "language": { "label": "Language", "key": "language" },
            "culturalValues": { "label": "Cultural values/ beliefs or assumptions", "key": "culturalValues" },
            "culturalBehaviours": { "label": "Cultural behaviours", "key": "culturalBehaviours" },
            "writtenCommunication": { "label": "Written communication/literacy", "key": "writtenCommunication" },
            "countryOfBirth": { "label": "Country of birth", "key": "countryOfBirth" }
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
          "yesDetail": "If yes, ensure Participant's Doctor completes an Epilepsy Plan"
        },
        {
          "key": "asthmatic",
          "label": "Is the Participant an Asthmatic?",
          "yesDetail": "If yes, ensure Participant's Doctor completes an Asthma Plan"
        },
        {
          "key": "allergies",
          "label": "Does the Participant have any allergies?",
          "yesDetail": "If yes, ensure to have an Allergy Plan from Participant's Doctor"
        },
        {
          "key": "anaphylactic",
          "label": "Is the Participant anaphylactic?",
          "yesDetail": "If yes, ensure to have an anaphylaxis Plan from the Participant's Doctor"
        },
        {
          "key": "minorInjury",
          "label": "Do you give permission for our company's staff to administer band-aids in cases of a minor injury?"
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
          "yesDetail": "If yes, ensure Participant's Doctor completes an Epilepsy Plan"
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
};

// ===== HELPER FUNCTIONS =====
const commonFieldMapping: Record<string, string> = {
  givenName: "name",
  dateOfBirth: "dob",
  ndisNumber: "ndis",
  sex: "sex",
  addressNumberStreet: "street",
  state: "state",
  postcode: "postCode",
  mobile: "phone",
  email: "email",
  disabilityConditions: "disability",
  surname: 'surname',
};

// Helper function to get the appropriate value (from commonFields or formData)
const getFieldValue = (
  key: string,
  formData: Record<string, any>,
  commonFields: Record<string, any>
) => {
  const rawValue = key in commonFieldMapping
    ? commonFields?.[commonFieldMapping[key]] ?? ""
    : formData?.[key] ?? "";

  if (typeof rawValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
    const parsed = parseISO(rawValue);
    if (isValid(parsed)) {
      return format(parsed, "dd-MM-yyyy");
    }
  }

  return rawValue;
};

// Standardized checkbox display component
const displayCheckboxGroup = (options: any, selected: any[] = [], otherValue: any = "") => (
  <div className="space-y-1">
    {options.map((opt: any) => (
      <div key={opt} className="flex items-center space-x-1">
        <span className={`w-4 h-4 border border-black flex justify-center items-center ${A4_PDF_TYPOGRAPHY.small}`}>
          {selected?.includes(opt) ? (<svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="none"
            stroke="black"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="inline-block"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>) : ""}
        </span>
        <span className={A4_PDF_TYPOGRAPHY.body}>{opt}</span>
      </div>
    ))}
    {otherValue && (
      <div className="flex items-center space-x-1">
        <span className={`w-4 h-4 border border-black flex justify-center items-center ${A4_PDF_TYPOGRAPHY.small}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="none"
            stroke="black"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="inline-block"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        <span className={A4_PDF_TYPOGRAPHY.body}>{otherValue}</span>
      </div>
    )}
  </div>
);

// ===== PAGE COMPONENTS =====
const Page1 = ({ formSchema, formData = {}, commonFields = {}, images, settings }: any) => {
  const pageSchema = formSchema.schema.clientIntakeSchema;

  const footer = pageSchema.footer ? <StandardFooter settings={settings} /> : null;

  return (
    <A4Page footer={footer}>
      <div
        className="w-full h-full flex flex-col"
        style={{
          height: "100%",
          boxSizing: "border-box",
          padding: "24px 16px", // px-6 py-4 in px (matches original)
        }}
      >
        {/* Header */}
        <div className="flex justify-center mb-4 shrink-0">
          <img
            alt={pageSchema.logo.alt}
            src={images.infinityLogo}
            width={pageSchema.logo.width}
            height={pageSchema.logo.height}
            className="object-contain"
          />
        </div> <br /><br />

        {/* Main content table */}
        <div className="flex-1 flex flex-col justify-stretch">
          <table className="w-full h-full border-collapse border border-black" style={{ tableLayout: "fixed", height: "100%" }}>
            <tbody style={{ height: "100%" }}>
              {pageSchema.fields.map((field: any, idx: any) => {
                const value = getFieldValue(field.key, formData, commonFields);

                if (field.type === "sectionHeader") {
                  return (
                    <tr key={idx} className="bg-gray-300 font-semibold">
                      <td className={`border border-black px-1 py-0.5 ${A4_PDF_TYPOGRAPHY.sectionHeader}`} colSpan={2}>
                        {field.label}
                      </td>
                    </tr>
                  );
                }

                if (field.type === "textarea") {
                  return (
                    <tr key={idx}>
                      <td
                        className={`border border-black px-1 py-0.5 align-top ${A4_PDF_TYPOGRAPHY.body}`}
                        colSpan={2}
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
                        className={`border border-black px-1 py-0.5 font-semibold align-top ${A4_PDF_TYPOGRAPHY.label}`}
                        style={{ width: field.width || "auto" }}
                      >
                        {field.label}
                      </td>
                      <td className="border border-black px-1 py-0.5">
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
                    <td
                      className={`border border-black px-1 py-0.5 font-semibold ${A4_PDF_TYPOGRAPHY.label}`}
                      style={{ width: field.width || "auto" }}
                    >
                      {field.label}
                    </td>
                    <td className={`border border-black px-1 py-0.5 ${A4_PDF_TYPOGRAPHY.body}`}>
                      {value}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </A4Page>
  );
};

const Page2 = ({ formSchema, formData = {}, commonFields = {}, images, settings }: any) => {
  const pageSchema = formSchema.schema.gpMedicalSupportSchema;

  const footer = pageSchema.footer ? <StandardFooter settings={settings} /> : null;

  return (
    <A4Page footer={footer}>
      <div
        className="w-full h-full flex flex-col"
        style={{
          height: "100%",
          boxSizing: "border-box",
          padding: "24px 16px",
        }}
      >
        <div className="flex justify-center py-4 shrink-0">
          <img
            alt={pageSchema.logo.alt}
            height={pageSchema.logo.height}
            src={images.infinityLogo}
            width={pageSchema.logo.width}
            className="object-contain"
          />
        </div><br /><br />
        <div className="px-0 flex-1 flex flex-col">
          <table className="w-full h-full flex-1 border-collapse border border-black">
            <tbody>
              {pageSchema.fields.map((field: any, idx: any) => {
                const value = getFieldValue(field.key, formData, commonFields);

                if (field.type === "sectionHeader") {
                  return (
                    <tr key={idx} className={`${field.bgColor || "bg-gray-300"} font-bold`}>
                      <td
                        className={`border border-black px-2 py-1 ${A4_PDF_TYPOGRAPHY.sectionHeader}`}
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
                        className={`border border-black align-top p-2 ${A4_PDF_TYPOGRAPHY.body}`}
                        colSpan={field.colSpan || 2}
                        style={{ height: field.height || 256 }}
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
                        className={`border border-black px-2 py-1 font-semibold ${A4_PDF_TYPOGRAPHY.label}`}
                        style={{ width: field.width || "auto" }}
                        colSpan={field.colSpan || 1}
                      >
                        {field.label}
                      </td>
                      <td className="border border-black px-2 py-1">
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
                    <td
                      className={`border border-black px-2 py-1 font-semibold ${A4_PDF_TYPOGRAPHY.label}`}
                      style={{ width: field.width || "auto" }}
                    >
                      {field.label}
                    </td>
                    <td className={`border border-black px-2 py-1 ${A4_PDF_TYPOGRAPHY.body}`}>
                      {value}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </A4Page>
  );
};
// Helper function for extracting personal situation data
const extractPersonalSituationData = (fields: any, formData: any) => {
  const result: Record<string, any> = {};
  for (const key in fields) {
    const fieldKey = fields[key].key;
    result[fieldKey] = formData[fieldKey] ?? "";
  }
  return result;
};

const Page3 = ({ formSchema, formData = {}, commonFields = {}, images, settings }: any) => {
  const pageSchema = formSchema.schema.allAboutMeSchema;

  const footer = <StandardFooter settings={settings} />;

  const renderPersonalSituation = (psSchema: any, psData: any = {}) => (
    <div className="space-y-1">
      <div className={A4_PDF_TYPOGRAPHY.body}>
        <span className={`${A4_PDF_TYPOGRAPHY.label} font-bold`}>{psSchema.barriers.label}</span>
        <span className="ml-1 mr-1 w-4 h-4 border border-black inline-flex justify-center">
          {psData.barriers === "Yes" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="12"
              height="12"
              fill="none"
              stroke="black"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="inline-block"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : ""}
        </span>
        {psSchema.barriers.options[0]}
        <span className="ml-1 mr-1 w-4 h-4 border border-black inline-flex justify-center">
          {psData.barriers === "No" ? (<svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="none"
            stroke="black"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="inline-block"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>) : ""}
        </span>
        {psSchema.barriers.options[1]}
        <span className="ml-2">{psSchema.barriers.followUp}</span>
      </div>

      <div className={A4_PDF_TYPOGRAPHY.body}>
        {psSchema.interpreter.label}
        <span className="ml-1 mr-1 w-4 h-4 border border-black inline-flex justify-center">
          {psData.interpreter === "Yes" ? (<svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="none"
            stroke="black"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="inline-block"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>) : ""}
        </span>
        {psSchema.interpreter.options[0]}
        <span className="ml-1 mr-1 w-4 h-4 border border-black inline-flex justify-center">
          {psData.interpreter === "No" ? (<svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="none"
            stroke="black"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="inline-block"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>) : ""}
        </span>
        {psSchema.interpreter.options[1]}
      </div>

      <div className={A4_PDF_TYPOGRAPHY.body}>
        <strong>{psSchema.language.label}:</strong> {psData.language || ""}
      </div>
      <div className={A4_PDF_TYPOGRAPHY.body}>
        <strong>{psSchema.culturalValues.label}:</strong> {psData.culturalValues || ""}
      </div>
      <div className={A4_PDF_TYPOGRAPHY.body}>
        <strong>{psSchema.culturalBehaviours.label}:</strong> {psData.culturalBehaviours || ""}
      </div>
      <div className={A4_PDF_TYPOGRAPHY.body}>
        <strong>{psSchema.writtenCommunication.label}:</strong> {psData.writtenCommunication || ""}
      </div>
      <div className={A4_PDF_TYPOGRAPHY.body}>
        <strong>{psSchema.countryOfBirth.label}:</strong> {psData.countryOfBirth || ""}
      </div>
    </div>
  );

  return (
    <A4Page footer={footer}>
      <div
        className="w-full h-full flex flex-col"
        style={{
          height: "100%",
          boxSizing: "border-box",
          padding: "24px 16px",
        }}
      >
        {/* Header */}
        <div className="flex justify-center py-4 shrink-0">
          <img
            alt={pageSchema.logo.alt}
            height={pageSchema.logo.height}
            src={images.infinityLogo}
            width={pageSchema.logo.width}
            className="object-contain"
          />
        </div> <br /><br />

        {/* Main content */}
        <div className="flex-1 min-h-0 flex flex-col">
          <table className="w-full h-full border border-black border-collapse" style={{ width: "210mm", tableLayout: "fixed", height: "100%" }}>
            <tbody style={{ height: "100%" }}>
              <tr style={{ height: "7%" }}>
                <th className={`border border-black text-left font-bold px-1 py-0.5 bg-gray-300 ${A4_PDF_TYPOGRAPHY.sectionHeader}`} colSpan={2}>
                  {pageSchema.sections.allAboutMe.title}
                </th>
              </tr>
              <tr style={{ height: "18%" }}>
                <td className={`border border-black align-top px-1 py-0.5 ${A4_PDF_TYPOGRAPHY.body}`} colSpan={2}>
                  {getFieldValue("aboutMe", formData, commonFields)}
                </td>
              </tr>
              <tr style={{ height: "7%" }}>
                <th className={`border border-black text-left font-bold px-1 py-0.5 bg-gray-300 ${A4_PDF_TYPOGRAPHY.sectionHeader}`} colSpan={2}>
                  {pageSchema.sections.advocateDetails.title}
                </th>
              </tr>
              <tr style={{ height: "7%" }}>
                <td className={`border border-black px-1 py-0.5 ${A4_PDF_TYPOGRAPHY.body}`}>
                  {pageSchema.sections.advocateDetails.fields.name} {getFieldValue("advocateName", formData, commonFields)}
                </td>
                <td className={`border border-black px-1 py-0.5 ${A4_PDF_TYPOGRAPHY.body}`}>
                  {pageSchema.sections.advocateDetails.fields.relationship} {getFieldValue("advocateRelationship", formData, commonFields)}
                </td>
              </tr>
              <tr style={{ height: "7%" }}>
                <td className={`border border-black px-1 py-0.5 ${A4_PDF_TYPOGRAPHY.body}`}>
                  {pageSchema.sections.advocateDetails.fields.phone} {getFieldValue("advocatePhone", formData, commonFields)}
                </td>
                <td className={`border border-black px-1 py-0.5 ${A4_PDF_TYPOGRAPHY.body}`}>
                  {pageSchema.sections.advocateDetails.fields.mobile} {getFieldValue("advocateMobile", formData, commonFields)}<br />
                  {pageSchema.sections.advocateDetails.fields.email} {getFieldValue("advocateEmail", formData, commonFields)}
                </td>
              </tr>
              <tr style={{ height: "7%" }}>
                <td className={`border border-black px-1 py-0.5 ${A4_PDF_TYPOGRAPHY.body}`} colSpan={2}>
                  {pageSchema.sections.advocateDetails.fields.address} {getFieldValue("advocateAddress", formData, commonFields)}
                </td>
              </tr>
              <tr style={{ height: "7%" }}>
                <td className={`border border-black px-1 py-0.5 ${A4_PDF_TYPOGRAPHY.body}`} colSpan={2}>
                  {pageSchema.sections.advocateDetails.fields.postalAddress} {getFieldValue("advocatePostalAddress", formData, commonFields)}
                </td>
              </tr>
              <tr style={{ height: "7%" }}>
                <td className={`border border-black px-1 py-0.5 ${A4_PDF_TYPOGRAPHY.body}`} colSpan={2}>
                  {pageSchema.sections.advocateDetails.fields.otherInfo} {getFieldValue("advocateOtherInfo", formData, commonFields)}
                </td>
              </tr>
              <tr style={{ height: "7%" }}>
                <th className={`border border-black text-left font-bold px-1 py-0.5 bg-gray-300 ${A4_PDF_TYPOGRAPHY.sectionHeader}`} colSpan={2}>
                  {pageSchema.sections.personalSituation.title}
                </th>
              </tr>
              <tr style={{ height: "26%" }}>
                <td className={`border border-black px-1 py-0.5 ${A4_PDF_TYPOGRAPHY.body}`} colSpan={2}>
                  {renderPersonalSituation(
                    pageSchema.sections.personalSituation.fields,
                    extractPersonalSituationData(pageSchema.sections.personalSituation.fields, formData)
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </A4Page>
  );
};

// Checkbox list renderer for Page4
const renderCheckboxList = (options: any, selected: any[] = [], otherValue = "") => (
  <ul className="list-none ml-4 space-y-1">
    {options.map((opt: any) => (
      <li key={opt} className="flex items-center space-x-2">
        <label className="inline-flex items-center space-x-2">
          <span className={`w-4 h-4 border border-black flex justify-center items-center mr-2 ${A4_PDF_TYPOGRAPHY.small}`}>
            {selected?.includes(opt) ? (<svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="12"
              height="12"
              fill="none"
              stroke="black"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="inline-block"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>) : ""}
          </span>
          <span className={A4_PDF_TYPOGRAPHY.body}>{opt === "Other" ? "Other:" : opt}</span>
        </label>
        {opt === "Other" && (
          <span className="border-b border-black flex-grow h-[1px] min-w-[60px] ml-2">
            {otherValue ? <span className={A4_PDF_TYPOGRAPHY.body}>{otherValue}</span> : null}
          </span>
        )}
      </li>
    ))}
  </ul>
);

const Page4 = ({ formSchema, formData = {}, commonFields = {}, images, settings }: any) => {
  const pageSchema = formSchema.schema.contactsLivingTravelSchema;

  const footer = pageSchema.footer ? <StandardFooter settings={settings} /> : null;

  return (
    <A4Page footer={footer}>
      <div
        className="w-full h-full flex flex-col"
        style={{
          height: "100%",
          boxSizing: "border-box",
          padding: "24px 16px",
        }}
      >
        <div className="flex justify-center py-4 shrink-0">
          <img
            alt={pageSchema.logo?.alt || "Logo"}
            height={pageSchema.logo?.height || 80}
            src={images.infinityLogo}
            width={pageSchema.logo?.width || 200}
            className="object-contain"
          />
        </div> <br /><br />
        <div className="px-0 flex-1 flex flex-col">
          <table className="w-full h-full border border-black border-collapse" style={{ width: "210mm", tableLayout: "fixed", height: "100%" }}>
            <tbody style={{ height: "100%" }}>
              {/* Primary Contact Header */}
              <tr style={{ height: "8%" }}>
                <td className={`border border-black px-2 py-1 bg-gray-300 font-bold ${A4_PDF_TYPOGRAPHY.sectionHeader}`} colSpan={2}>
                  Primary Contact
                </td>
              </tr>
              {/* Primary Contact Rows */}
              <tr style={{ height: "8%" }}>
                <td className={`border border-black px-2 py-1 ${A4_PDF_TYPOGRAPHY.body}`}>
                  Contact Name: {getFieldValue("primaryContactName", formData, commonFields)}
                </td>
                <td className={`border border-black px-2 py-1 ${A4_PDF_TYPOGRAPHY.body}`}>
                  Relationship: {getFieldValue("primaryContactRelationship", formData, commonFields)}
                </td>
              </tr>
              <tr style={{ height: "8%" }}>
                <td className={`border border-black px-2 py-1 ${A4_PDF_TYPOGRAPHY.body}`}>
                  Home Phone No: {getFieldValue("primaryContactHomePhone", formData, commonFields)}
                </td>
                <td className={`border border-black px-2 py-1 ${A4_PDF_TYPOGRAPHY.body}`}>
                  Mobile No: {getFieldValue("primaryContactMobile", formData, commonFields)}
                </td>
              </tr>
              {/* Secondary Contact Header */}
              <tr style={{ height: "8%" }}>
                <td className={`border border-black px-2 py-1 bg-gray-300 font-bold ${A4_PDF_TYPOGRAPHY.sectionHeader}`} colSpan={2}>
                  Secondary Contact
                </td>
              </tr>
              {/* Secondary Contact Rows */}
              <tr style={{ height: "8%" }}>
                <td className={`border border-black px-2 py-1 ${A4_PDF_TYPOGRAPHY.body}`}>
                  Contact Name: {getFieldValue("secondaryContactName", formData, commonFields)}
                </td>
                <td className={`border border-black px-2 py-1 ${A4_PDF_TYPOGRAPHY.body}`}>
                  Relationship: {getFieldValue("secondaryContactRelationship", formData, commonFields)}
                </td>
              </tr>
              <tr style={{ height: "8%" }}>
                <td className={`border border-black px-2 py-1 ${A4_PDF_TYPOGRAPHY.body}`}>
                  Home Phone No: {getFieldValue("secondaryContactHomePhone", formData, commonFields)}
                </td>
                <td className={`border border-black px-2 py-1 ${A4_PDF_TYPOGRAPHY.body}`}>
                  Mobile No: {getFieldValue("secondaryContactMobile", formData, commonFields)}
                </td>
              </tr>
              {/* Living and support arrangements */}
              <tr style={{ height: "25%" }}>
                <td className={`border border-black mt-6 p-3 ${A4_PDF_TYPOGRAPHY.body}`} colSpan={2}>
                  <p className={`font-bold mb-2 ${A4_PDF_TYPOGRAPHY.label}`}>Living and support arrangements</p>
                  <p className={`mb-2 ${A4_PDF_TYPOGRAPHY.body}`}>What is your current living arrangement? (Please tick the appropriate box)</p>
                  {renderCheckboxList(
                    pageSchema.fields.find((f: any) => f.key === "livingArrangements").options,
                    getFieldValue("livingArrangements", formData, commonFields) || [],
                    getFieldValue("livingArrangementsOther", formData, commonFields) || ""
                  )}
                </td>
              </tr>
              {/* Travel */}
              <tr style={{ height: "25%" }}>
                <td className={`border border-black mt-6 p-3 ${A4_PDF_TYPOGRAPHY.body}`} colSpan={2}>
                  <p className={`font-bold mb-2 ${A4_PDF_TYPOGRAPHY.label}`}>Travel</p>
                  <p className={`mb-2 ${A4_PDF_TYPOGRAPHY.body}`}>How do you travel to work or to your day service? (Please tick the appropriate box)</p>
                  {renderCheckboxList(
                    pageSchema.fields.find((f: any) => f.key === "travelArrangements").options,
                    getFieldValue("travelArrangements", formData, commonFields) || [],
                    getFieldValue("travelArrangementsOther", formData, commonFields) || ""
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </A4Page>
  );
};

const Page5 = ({ formSchema, formData = {}, commonFields = {}, images, settings }: any) => {
  const pageSchema = formSchema.schema.medicationInfoSchema;

  const footer = <StandardFooter settings={settings} />;

  return (
    <A4Page footer={footer}>
      <div
        className="w-full h-full flex flex-col"
        style={{
          height: "100%",
          boxSizing: "border-box",
          padding: "24px 16px",
        }}
      >
        {/* Logo */}
        <div className="flex justify-center py-4 shrink-0">
          <img
            alt={pageSchema.logo.alt}
            src={images.infinityLogo}
            width={pageSchema.logo.width}
            height={pageSchema.logo.height}
            className="object-contain"
          />
        </div> <br /><br />

        {/* Table */}
        <div className="px-0 flex-1 flex flex-col">
          <table
            className="w-full h-full border border-black border-collapse"
            style={{ width: "210mm", tableLayout: "fixed", height: "100%" }}
          >
            <thead>
              <tr className="bg-gray-300">
                <th
                  className={`border border-black p-1 text-left font-semibold ${A4_PDF_TYPOGRAPHY.sectionHeader}`}
                  colSpan={3}
                >
                  {pageSchema.title}
                </th>
              </tr>
            </thead>
            <tbody style={{ height: "100%" }}>
              {pageSchema.fields.map((field: any, idx: number) => {
                const value = getFieldValue(field.key, formData, commonFields);
                const otherValue = getFieldValue(`${field.key}Others`, formData, commonFields);

                return (
                  <tr key={idx}>
                    <td className={`border border-black p-1 align-top w-[320px] font-medium ${A4_PDF_TYPOGRAPHY.label}`}>
                      {field.label}
                    </td>

                    <td className={`border border-black p-1 align-top w-[180px] ${A4_PDF_TYPOGRAPHY.body}`}>
                      <div className="inline-flex items-start space-x-1">
                        <span className="w-4 h-4 border border-black flex justify-center mt-1">
                          {value === "Yes" ? (<svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="12"
                            height="12"
                            fill="none"
                            stroke="black"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="inline-block"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>) : ""}
                        </span>
                        <span>Yes</span>
                      </div>

                      {value === "Yes" && (
                        <>
                          {field.yesDetail && (
                            <div className={`mt-1 leading-tight ${A4_PDF_TYPOGRAPHY.small}`}>{field.yesDetail}</div>
                          )}
                          {otherValue && (
                            <div className={`mt-1 ${A4_PDF_TYPOGRAPHY.small}`}>
                              <span className="font-semibold">Details:</span> {otherValue}
                            </div>
                          )}
                        </>
                      )}
                    </td>

                    <td className={`border border-black p-1 text-center align-top w-[60px] ${A4_PDF_TYPOGRAPHY.body}`}>
                      <span className="w-4 h-4 border border-black flex justify-center">
                        {value === "No" ? (<svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="12"
                          height="12"
                          fill="none"
                          stroke="black"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="inline-block"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>) : ""}
                      </span>
                      <span className="m-1">No</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </A4Page>
  );
};

const Page6 = ({ formSchema, formData = {}, commonFields = {}, images, settings }: any) => {
  const pageSchema = formSchema.schema.safetyConsiderationSchema;

  const footer = <StandardFooter settings={settings} />;

  return (
    <A4Page footer={footer}>
      <div
        className="w-full h-full flex flex-col"
        style={{
          height: "100%",
          boxSizing: "border-box",
          padding: "24px 16px",
        }}
      >
        {/* Logo */}
        <div className="flex justify-center py-4 shrink-0">
          <img
            alt={pageSchema.logo.alt}
            src={images.infinityLogo}
            width={pageSchema.logo.width}
            height={pageSchema.logo.height}
            className="object-contain"
          />
        </div> <br /><br />

        {/* Table */}
        <div className="px-0 flex-1 flex flex-col">
          <table
            className="w-full h-full border border-black border-collapse"
            style={{ width: "210mm", tableLayout: "fixed", height: "100%" }}
          >
            <thead>
              <tr className="bg-gray-300">
                <th
                  className={`border border-black p-1 text-left font-semibold ${A4_PDF_TYPOGRAPHY.sectionHeader}`}
                  colSpan={3}
                >
                  {pageSchema.title}
                </th>
              </tr>
            </thead>
            <tbody style={{ height: "100%" }}>
              {pageSchema.fields.map((field: any, idx: number) => {
                const value = getFieldValue(field.key, formData, commonFields);
                const otherValue = getFieldValue(`${field.key}Others`, formData, commonFields);

                return (
                  <tr key={idx}>
                    <td className={`border border-black p-1 align-top w-[320px] font-medium ${A4_PDF_TYPOGRAPHY.label}`}>
                      {field.label}
                    </td>
                    <td className={`border border-black p-1 align-top w-[180px] ${A4_PDF_TYPOGRAPHY.body}`}>
                      <div className="inline-flex items-start space-x-1">
                        <span className="w-4 h-4 border border-black flex justify-center mt-1">
                          {value === "Yes" ? (<svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="12"
                            height="12"
                            fill="none"
                            stroke="black"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="inline-block"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>) : ""}
                        </span>
                        <span>Yes</span>
                      </div>
                      {value === "Yes" && (
                        <>
                          {field.yesDetail && (
                            <div className={`mt-1 leading-tight ${A4_PDF_TYPOGRAPHY.small}`}>{field.yesDetail}</div>
                          )}
                          {otherValue && (
                            <div className={`mt-1 ${A4_PDF_TYPOGRAPHY.small}`}>
                              <span className="font-semibold">Details:</span> {otherValue}
                            </div>
                          )}
                        </>
                      )}
                    </td>
                    <td className={`border border-black p-1 text-center align-top w-[60px] ${A4_PDF_TYPOGRAPHY.body}`}>
                      <span className="w-4 h-4 border border-black flex justify-center">
                        {value === "No" ? (<svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="12"
                          height="12"
                          fill="none"
                          stroke="black"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="inline-block"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>) : ""}
                      </span>
                      <span className="m-1">No</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </A4Page>
  );
};

// ===== MAIN FORM RENDERER COMPONENT =====
const FormRenderer = ({ formData = {}, formKey, commonFields, images, settings }: any) => {
  return (
    <div className="pdf-container font-montserrat">
      <style dangerouslySetInnerHTML={{ __html: PDF_FONT_STYLES }} />
      <Page1
        formSchema={formSchema}
        formData={formData}
        commonFields={commonFields}
        images={images}
        settings={settings}
      />
      <Page2
        formSchema={formSchema}
        formData={formData}
        commonFields={commonFields}
        images={images}
        settings={settings}
      />
      <Page3
        formSchema={formSchema}
        formData={formData}
        commonFields={commonFields}
        images={images}
        settings={settings}
      />
      <Page4
        formSchema={formSchema}
        formData={formData}
        commonFields={commonFields}
        images={images}
        settings={settings}
      />
      <Page5
        formSchema={formSchema}
        formData={formData}
        commonFields={commonFields}
        images={images}
        settings={settings}
      />
      <Page6
        formSchema={formSchema}
        formData={formData}
        commonFields={commonFields}
        images={images}
        settings={settings}
      />
    </div>
  );
};

export default FormRenderer;
