"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FaUser,
  FaStethoscope,
  FaRegSmile,
  FaGavel,
  FaInfoCircle,
  FaPhoneAlt,
  FaHome,
  FaNotesMedical,
  FaShieldAlt,
  FaChevronLeft,
  FaChevronRight,
  FaCheck,
  FaSave,
} from "react-icons/fa";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/Confirm";
import { updateCommonFields } from "@/lib/api";
import { useSearchParams } from "next/navigation";

interface FormProps {
  formData: any;
  commonFieldsData: any;
  onChange: (values: any) => void;
  onSubmit?: (values: any) => void;
  readOnly?: boolean;
  fieldErrors?: Record<string, string>;
  handleSave: (submit: boolean) => void;
}




const FORM_SECTIONS = [
  {
    id: "personal",
    title: "Personal Information",
    icon: FaUser,
    description: "Basic personal details and identification",
    fields: [
      "ndisNumber", "givenName", "surname", "dateOfBirth", "sex", "addressNumberStreet", "state", "postcode", "email","pronoun","aboriginalTorres","preferredName","homePhone","mobile","disabilityConditions"
    ],
    requiredFields: ["givenName", "surname", "dateOfBirth", "sex", "addressNumberStreet", "state", "postcode", "email"],
  },
  {
    id: "medicalContact",
    title: "Medical Contact",
    icon: FaStethoscope,
    description: "GP Medical Contact & Support Coordinator",
    fields: [
      "medicalCentreName", "medicalPhone", "supportCoordinatorName", "supportCoordinatorEmail", "supportCoordinatorCompany", "supportCoordinatorContact","otherSupports"
    ],
    requiredFields: ["medicalCentreName", "supportCoordinatorName"],
  },
  {
    id: "aboutMe",
    title: "All About Me",
    icon: FaRegSmile,
    description: "About me",
    requiredFields: ["aboutMe"],
    fields: ["aboutMe"],  
  },
  {
    id: "advocate",
    title: "Advocate Details",
    icon: FaGavel,
    description: "Advocate/representative details (if applicable)",
    requiredFields: ["medicalCentreName"],
    fields: ["advocateName", "advocateEmail", "advocatePhone", "advocateMobile", "advocateAddress", "advocatePostalAddress", "advocateOtherInfo", "advocateRelationship"],
  },
  {
    id: "personalSituation",
    title: "Personal Situation",
    icon: FaInfoCircle,
    description: "Personal situation",
    requiredFields: ["barriers"],
    fields: ["barriers", "language", "countryOfBirth", "culturalValues", "culturalBehaviours", "writtenCommunication"]
  },
  {
    id: "contactDetails",
    title: "Contact Details",
    icon: FaPhoneAlt,
    description: "Primary and secondary emergency contacts",
    requiredFields: ["primaryContactName", "primaryContactRelationship"],
    fields: ["primaryContactName", "primaryContactRelationship", "primaryContactHomePhone", "primaryContactMobile", "secondaryContactName", "secondaryContactRelationship", "secondaryContactHomePhone", "secondaryContactMobile"],
  },
  {
    id: "livingArrangements",
    title: "Arrangements",
    icon: FaHome,
    description: "Living Arrangements & Travel Arrangements",
    requiredFields: [],
    fields: ["livingArrangements", "travelArrangements"],
  },
  {
    id: "medicalInfo",
    title: "Medical Information",
    icon: FaNotesMedical,
    description: "Medication Information/Diagnosis/Health Concerns",
    requiredFields: [],
    fields: ["medicationChart", "mealtimeManagement", "bowelCare", "menstrualIssues", "epilepsy", "asthmatic", "allergies", "anaphylactic", "minorInjury", "training", "othermedical", "trigger"] 
  },
  {
    id: "safety",
    title: "Safety Considerations",
    icon: FaShieldAlt,
    description: "Safety Considerations",
    requiredFields: [],
    fields: ["absconding", "historyOfFalls", "behaviourConcern", "positiveBehaviour", "communicationAssistance", "physicalAssistance", "languageConcern", "personalGoals"],
  },
];





const commonFieldsMapping: Record<string, string> = {
  ndisNumber: "ndis",
  givenName: "name",
  sex: "sex",
  dateOfBirth: "dob",
  addressNumberStreet: "street",
  state: "state",
  postcode: "postCode",
  email: "email",
  homePhone: "phone",
  disabilityConditions: "disability",
};

const yesNoOptions = ["Yes", "No"];

const livingArrangementsOptions = [
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
  "Other:",
];

const travelArrangementsOptions = [
  "Taxi",
  "Pick up/ drop off by Parent/Family/Support Person",
  "Transport by a provider",
  "Independently use Public Transport",
  "Walk",
  "Assisted Public Transport",
  "Drive own car.",
  "Other, please specify: ",
];

const ClientIntakeFormEnhanced: React.FC<FormProps & { token?: string }> = ({
  formData,
  commonFieldsData,
  onChange,
  onSubmit,
  readOnly = false,
  fieldErrors = {},
  handleSave,
  token // <-- batch token, optional for backward compatibility
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [maxStep, setMaxStep] = useState(0); // highest unlocked step

  const initialValues = {
    date: new Date().toISOString().split("T")[0],
    ndisNumber: "",
    givenName: "",
    surname: "",
    sex: "",
    pronoun: "",
    aboriginalTorres: "",
    preferredName: "",
    dateOfBirth: "",
    addressNumberStreet: "",
    state: "",
    postcode: "",
    email: "",
    homePhone: "",
    mobile: "",
    disabilityConditions: "",
    livingArrangements: [],
    travelArrangements: [],
    livingArrangementsOther: "",
    travelArrangementsOther: "",
    medicalCentreName: "",
    medicalPhone: "",
    supportCoordinatorName: "",
    supportCoordinatorEmail: "",
    supportCoordinatorCompany: "",
    supportCoordinatorContact: "",
    otherSupports: "",
    advocateName: "",
    advocateEmail: "",
    advocatePhone: "",
    advocateMobile: "",
    advocateAddress: "",
    advocatePostalAddress: "",
    advocateOtherInfo: "",
    advocateRelationship: "",
    barriers: "",
    language: "",
    interpreter: "",
    countryOfBirth: "",
    culturalValues: "",
    culturalBehaviours: "",
    writtenCommunication: "",
    primaryContactName: "",
    primaryContactRelationship: "",
    primaryContactHomePhone: "",
    primaryContactMobile: "",
    secondaryContactName: "",
    secondaryContactRelationship: "",
    secondaryContactHomePhone: "",
    secondaryContactMobile: "",
    medicationChart: "",
    mealtimeManagement: "",
    bowelCare: "",
    menstrualIssues: "",
    epilepsy: "",
    asthmatic: "",
    allergies: "",
    anaphylactic: "",
    minorInjury: "",
    training: "",
    othermedical: "",
    trigger: "",
    absconding: "",
    historyOfFalls: "",
    behaviourConcern: "",
    positiveBehaviour: "",
    communicationAssistance: "",
    physicalAssistance: "",
    languageConcern: "",
    personalGoals: "",
    ...formData,
  };

  // Pre-populate with common fields
  for (const [formKey, commonKey] of Object.entries(commonFieldsMapping)) {
    if (commonFieldsData?.[commonKey] && !initialValues[formKey]) {
      initialValues[formKey] = commonFieldsData[commonKey];
    }
  }

  const [localValues, setLocalValues] = useState<any>(initialValues);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { showToast } = useToast();
  const confirm = useConfirm();
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const passcode = searchParams ? searchParams.get("passcode") : undefined;

  // Track pending changes to common fields
  const [pendingCommonFieldChanges, setPendingCommonFieldChanges] = useState<Record<string, any>>({});

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onChange(localValues);
    }, 300);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [localValues, onChange]);

  // Update handleChange to track changes but not confirm immediately
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    console.log("name", name);
    console.log("value", value);

    // Track pending changes for common fields
    const commonKey = commonFieldsMapping[name];

    console.log("commonKey", commonKey);
    console.log("token: ", token);
    if (commonKey && token) {
      if (commonFieldsData?.[commonKey] !== value) {
        setPendingCommonFieldChanges((prev) => ({ ...prev, [commonKey]: value }));
        
      } else {
        
        setPendingCommonFieldChanges((prev) => {
          const updated = { ...prev };
          delete updated[commonKey];
          return updated;
        });
      }
    }
    setLocalValues((prev: any) => ({ ...prev, [name]: value }));
  };

  // Helper to confirm and update common fields if needed
  const confirmAndUpdateCommonFields = async () => {
    console.log("pendingCommonFieldChanges", pendingCommonFieldChanges);
    const changedKeys = Object.keys(pendingCommonFieldChanges);
    if (changedKeys.length === 0) return true; // No changes, proceed
    // Build a list of changed fields and their new values
    const fieldList = changedKeys.map(
      (key) => `- ${key}: ${pendingCommonFieldChanges[key]}`
    ).join("\n");
    const confirmed = await confirm.confirm({
      title: "Update Common Fields?",
      message:
        `You have changed the following common fields. This will update the value across all forms.\n\n${fieldList}`,
      confirmText: "Update",
      cancelText: "Cancel",
      type: "info",
    });
    if (confirmed) {
      try {
        const updatePayload = { ...commonFieldsData, ...pendingCommonFieldChanges };

        console.log("UPDATE PAYLOAD", updatePayload);
        console.log("token", token);
        console.log("passcode", passcode);

        await updateCommonFields(token || '', updatePayload, String(passcode || ''));
        showToast({
          type: "success",
          title: "Fields Updated",
          message: `The values for these fields have been updated across all forms.`,
          duration: 4000,
        });
        setPendingCommonFieldChanges({});
        return true;
      } catch (err: any) {
        showToast({
          type: "error",
          title: "Update Failed",
          message: err.message || "Failed to update common fields.",
          duration: 4000,
        });
        return false;
      }
    }
    return false;
  };

  const handleNext = () => {
    if (currentStep < FORM_SECTIONS.length - 1) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const isStepCompleted = (stepIndex: number) => {
    return completedSteps.has(stepIndex);
  };

  const getProgressPercentage = () => {
    return ((currentStep + 1) / FORM_SECTIONS.length) * 100;
  };

  // Sequential step logic
  const isCurrentSectionComplete = () => {
    const required = FORM_SECTIONS[currentStep].requiredFields || [];
    return required.every((key) => {
      const value = localValues[key];
      return value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && value.length === 0);
    });
  };

  // Only allow navigation to unlocked steps
  const handleStepClickSequential = (stepIndex: number) => {
    if (stepIndex <= maxStep) {
      setCurrentStep(stepIndex);
    }
  };

  // Update Next and Save handlers to use confirmation
  const handleNextSequential = async () => {
    if (currentStep < FORM_SECTIONS.length - 1 && isCurrentSectionComplete()) {
      const ok = await confirmAndUpdateCommonFields();
      if (!ok) return;
      setMaxStep((prev) => Math.max(prev, currentStep + 1));
      setCurrentStep(currentStep + 1);
    }
  };

  // On Previous
  const handlePreviousSequential = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Responsive sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // --- Updated input rendering utilities for minimal, modern, clean UI ---
  const renderInput = (
    label: string,
    name: string,
    type: string = "text",
    placeholder?: string,
    required?: boolean
  ) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={localValues[name] || ""}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder-gray-400 ${
          fieldErrors[name]
            ? "border-red-300 bg-red-50"
            : "hover:border-accent/40"
        } ${readOnly ? "bg-gray-50 text-gray-400" : ""}`}
      />
      {fieldErrors[name] && (
        <p className="text-xs text-red-500 mt-1">{fieldErrors[name]}</p>
      )}
    </div>
  );

  const renderTextArea = (
    label: string,
    name: string,
    rows: number = 3,
    placeholder?: string,
    required?: boolean
  ) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        name={name}
        value={localValues[name] || ""}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        disabled={readOnly}
        className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder-gray-400 resize-none ${
          fieldErrors[name]
            ? "border-red-300 bg-red-50"
            : "hover:border-accent/40"
        } ${readOnly ? "bg-gray-50 text-gray-400" : ""}`}
      />
      {fieldErrors[name] && (
        <p className="text-xs text-red-500 mt-1">{fieldErrors[name]}</p>
      )}
    </div>
  );

  const renderDropdown = (
    label: string,
    name: string,
    options: string[],
    showIfYes?: {
      label: string;
      inputName?: string;
    },
    required?: boolean
  ) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        name={name}
        value={localValues[name] || ""}
        onChange={handleChange}
        disabled={readOnly}
        className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all ${
          fieldErrors[name]
            ? "border-red-300 bg-red-50"
            : "hover:border-accent/40"
        } ${readOnly ? "bg-gray-50 text-gray-400" : ""}`}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {fieldErrors[name] && (
        <p className="text-xs text-red-500 mt-1">{fieldErrors[name]}</p>
      )}
      {showIfYes && localValues[name] === "Yes" && (
        <div className="mt-3 pl-4 border-l-4 border-accent/30 bg-accent/5 rounded-xl py-2">
          <label className="block text-xs font-medium text-accent mb-1">
            {showIfYes.label}
          </label>
          {showIfYes.inputName && (
            <>
              <input
                type="text"
                name={showIfYes.inputName}
                value={localValues[showIfYes.inputName] || ""}
                onChange={handleChange}
                disabled={readOnly}
                className={`w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder-gray-400 ${
                  fieldErrors[showIfYes.inputName]
                    ? "border-red-300 bg-red-50"
                    : "hover:border-accent/40"
                } ${readOnly ? "bg-gray-50 text-gray-400" : ""}`}
              />
              {fieldErrors[showIfYes.inputName] && (
                <p className="text-xs text-red-500 mt-1">
                  {fieldErrors[showIfYes.inputName]}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );

  const renderMultiSelectCheckbox = (
    label: string,
    name: string,
    options: string[],
    required?: boolean
  ) => (
    <div className="flex flex-col gap-1">
      <label
        className={`text-xs font-medium mb-1 ${
          fieldErrors[name] ? "text-red-500" : "text-gray-700"
        }`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className={`flex flex-col gap-2 w-full`}>
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer w-full"
            style={{ width: '100%' }}
          >
            <input
              type="checkbox"
              value={option}
              checked={
                Array.isArray(localValues[name]) &&
                localValues[name].includes(option)
              }
              onChange={(e) => {
                const checked = e.target.checked;
                setLocalValues((prev: any) => {
                  const current = Array.isArray(prev[name]) ? prev[name] : [];
                  return {
                    ...prev,
                    [name]: checked
                      ? [...current, option]
                      : current.filter((val: string) => val !== option),
                  };
                });
              }}
              className="accent-accent h-4 w-4 rounded border-gray-300 focus:ring-accent"
            />
            <span className="text-sm text-gray-700">{option}</span>
          </label>
        ))}
      </div>
      {fieldErrors[name] && (
        <p className="text-xs text-red-500 mt-1">{fieldErrors[name]}</p>
      )}
    </div>
  );

  // Helper to check if a field is required in the current section
  const isFieldRequired = (fieldName: string) => {
    return FORM_SECTIONS[currentStep].requiredFields?.includes(fieldName);
  };

  // Field metadata for dynamic rendering
  const FIELD_METADATA: Record<string, any> = {
    ndisNumber: { label: "NDIS Number", type: "text", placeholder: "Enter your NDIS number" },
    givenName: { label: "Given Name", type: "text", placeholder: "Enter your first name" },
    surname: { label: "Surname", type: "text", placeholder: "Enter your last name" },
    preferredName: { label: "Preferred Name", type: "text", placeholder: "How would you like to be called?" },
    dateOfBirth: { label: "Date of Birth", type: "date", placeholder: "Enter your date of birth" },
    sex: { label: "Sex", type: "dropdown", options: ["Male", "Female", "Other"] },
    pronoun: { label: "Pronoun", type: "text", placeholder: "e.g., he/him, she/her, they/them" },
    aboriginalTorres: { label: "Aboriginal or Torres Strait Islander?", type: "dropdown", options: yesNoOptions },
    addressNumberStreet: { label: "Address (Number/Street)", type: "text", placeholder: "Enter your street address" },
    state: { label: "State", type: "text", placeholder: "Enter your state" },
    postcode: { label: "Postcode", type: "text", placeholder: "Enter your postcode" },
    email: { label: "Email", type: "email", placeholder: "Enter your email address" },
    homePhone: { label: "Home Phone", type: "tel", placeholder: "Enter your home phone number" },
    mobile: { label: "Mobile", type: "tel", placeholder: "Enter your mobile number" },
    disabilityConditions: { label: "Disability Conditions/Disability type(s)", type: "textarea", placeholder: "Please describe your disability conditions or types", rows: 3 },
    medicalCentreName: { label: "Medical Centre Name", type: "text", placeholder: "Name of your medical centre" },
    medicalPhone: { label: "Medical Centre Phone", type: "tel", placeholder: "Medical centre phone number" },
    supportCoordinatorName: { label: "Support Coordinator Name", type: "text", placeholder: "Coordinator's name" },
    supportCoordinatorEmail: { label: "Support Coordinator Email", type: "email", placeholder: "Coordinator's email" },
    supportCoordinatorCompany: { label: "Support Coordinator Company", type: "text", placeholder: "Company name" },
    supportCoordinatorContact: { label: "Support Coordinator Contact", type: "tel", placeholder: "Contact number" },
    otherSupports: { label: "Other Supports", type: "textarea", placeholder: "Describe any other support services you receive", rows: 4 },
    aboutMe: { label: "About Me", type: "textarea", placeholder: "Tell us about yourself", rows: 4 },
    advocateName: { label: "Advocate Name", type: "text", placeholder: "Advocate's full name" },
    advocateEmail: { label: "Advocate Email", type: "email", placeholder: "Advocate's email" },
    advocatePhone: { label: "Advocate Phone", type: "tel", placeholder: "Advocate's phone" },
    advocateMobile: { label: "Advocate Mobile", type: "tel", placeholder: "Advocate's mobile" },
    advocateAddress: { label: "Advocate Address", type: "text", placeholder: "Advocate's address" },
    advocatePostalAddress: { label: "Advocate Postal Address", type: "text", placeholder: "Advocate's postal address" },
    advocateOtherInfo: { label: "Additional Information", type: "textarea", placeholder: "Any additional information about your advocate", rows: 3 },
    advocateRelationship: { label: "Relationship with Participant", type: "text", placeholder: "Relationship to you" },
    barriers: { label: "Cultural, Communication Barriers or Intimacy Issues", type: "dropdown", options: yesNoOptions },
    language: { label: "Language", type: "text", placeholder: "Primary language spoken" },
    interpreter: { label: "Interpreter Needed?", type: "dropdown", options: yesNoOptions },
    countryOfBirth: { label: "Country of Birth", type: "text", placeholder: "Enter your country of birth" },
    culturalValues: { label: "Cultural Values", type: "text", placeholder: "Important cultural values" },
    culturalBehaviours: { label: "Cultural Behaviours", type: "text", placeholder: "Important cultural behaviours" },
    writtenCommunication: { label: "Written Communication / Literacy", type: "text", placeholder: "Communication preferences" },
    primaryContactName: { label: "Primary Contact Name", type: "text", placeholder: "Primary contact's full name" },
    primaryContactRelationship: { label: "Primary Contact Relationship", type: "text", placeholder: "Relationship to you" },
    primaryContactHomePhone: { label: "Primary Contact Home Phone", type: "tel", placeholder: "Home phone number" },
    primaryContactMobile: { label: "Primary Contact Mobile", type: "tel", placeholder: "Mobile phone number" },
    secondaryContactName: { label: "Secondary Contact Name", type: "text", placeholder: "Secondary contact's full name" },
    secondaryContactRelationship: { label: "Secondary Contact Relationship", type: "text", placeholder: "Relationship to you" },
    secondaryContactHomePhone: { label: "Secondary Contact Home Phone", type: "tel", placeholder: "Home phone number" },
    secondaryContactMobile: { label: "Secondary Contact Mobile", type: "tel", placeholder: "Mobile phone number" },
    livingArrangements: { label: "Living Arrangements", type: "checkbox", options: livingArrangementsOptions },
    livingArrangementsOther: { label: "Please specify other living arrangement", type: "text", placeholder: "Specify other..." },
    travelArrangements: { label: "Travel Arrangements", type: "checkbox", options: travelArrangementsOptions },
    travelArrangementsOther: { label: "Please specify other travel arrangement", type: "text", placeholder: "Specify other..." },
    medicationChart: { label: "Requires Medication Chart?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, is this medication taken on a regular basis and for what purpose, ensure to complete Medication Chart and Participant risk assessment", inputName: "medicationChartOthers" } },
    mealtimeManagement: { label: "Requires Mealtime Management?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, refer to Mealtime Management Plan Form" } },
    bowelCare: { label: "Requires Bowel Care Management?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, refer to Complex Bowel Care Plan and Monitoring Form and indicate what assistance is required with bowel care.", inputName: "bowelCareOthers" } },
    menstrualIssues: { label: "Menstrual Cycle Issues / Female Hygiene Help", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, Please specify", inputName: "menstrualIssuesOthers" } },
    epilepsy: { label: "Has Epilepsy?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, ensure Participant's Doctor completes an Epilepsy Plan", inputName: "epilepsyOthers" } },
    asthmatic: { label: "Is Asthmatic?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, ensure Participant's Doctor completes an Asthma Plan", inputName: "asthmaticOthers" } },
    allergies: { label: "Has Allergies?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, ensure to have an Allergy Plan from Participant's Doctor", inputName: "allergiesOthers" } },
    anaphylactic: { label: "Is Anaphylactic?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, ensure to have an anaphylaxis Plan from the Participant's Doctor", inputName: "anaphylacticOthers" } },
    minorInjury: { label: "Do you give permission for our company's staff to administer band-aids in cases of a minor injury?", type: "dropdown", options: yesNoOptions },
    training: { label: "Requires Specific Training?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, ensure to provide information such as implementing a positive behaviour support plan.", inputName: "trainingOthers" } },
    othermedical: { label: "Other Relevant Medication Conditions?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, please specify.", inputName: "othermedicalOthers" } },
    trigger: { label: "Triggers for Community Activities?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, please specify and complete the Risk assessment for participants.", inputName: "triggerOthers" } },
    absconding: { label: "Does the Participant show signs or a history of unexpectedly leaving (absconding)?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, please specify.", inputName: "abscondingOthers" } },
    historyOfFalls: { label: "Prone to Falls?", type: "dropdown", options: yesNoOptions },
    behaviourConcern: { label: "Behaviours of Concern?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, please specify.", inputName: "behaviourConcernOthers" } },
    positiveBehaviour: { label: "Positive Behaviour Plan In Place?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, refer to High Risk Participant Register.", inputName: "positiveBehaviourOthers" } },
    communicationAssistance: { label: "Does the participant require communication assistance?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, refer to the mode of communication reflected in Participant Risk Assessment and disaster management plan.", inputName: "communicationAssistanceOthers" } },
    physicalAssistance: { label: "Requires Physical Assistance?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, specify.", inputName: "physicalAssistanceOthers" } },
    languageConcern: { label: "Expressive Language Concerns?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, refer to Participant Risk Assessment and disaster management plan under OH&S Assessments and Mode of Communication.", inputName: "languageConcernOthers" } },
    personalGoals: { label: "Personal Preferences & Personal Goals", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, refer to form Support Plan" } },
  };

  const handleSaveWithConfirm = async (submit: boolean) => {
    const ok = await confirmAndUpdateCommonFields();
    if (!ok) return;
    handleSave(submit);
  };

  return (
    <div className="">
      {/* Progress Bar */}
      <div className="w-full max-w-2xl mx-auto pt-2 md:pt-6 px-2">
        <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
          <div className="h-2 bg-gradient-to-r from-indigo-500 to-green-400 rounded-full transition-all" style={{ width: `${getProgressPercentage()}%` }} />
        </div>
        {/* Horizontal Stepper (sequential, locked steps) with Tooltips */}
        <nav className="flex items-center justify-between gap-2 overflow-visible pb-2 relative">
          {FORM_SECTIONS.map((section, idx) => {
            const active = idx === currentStep;
            const unlocked = idx <= maxStep;
            return (
              <div key={section.id} className="relative flex flex-col items-center group">
                <button
                  type="button"
                  onClick={() => handleStepClickSequential(idx)}
                  className={`flex flex-col items-center min-w-[60px] px-2 focus:outline-none transition-all duration-200 ${active ? 'text-indigo-700' : unlocked ? 'text-green-600' : 'text-gray-400 opacity-50 cursor-not-allowed'}`}
                  aria-current={active ? 'step' : undefined}
                  aria-label={section.title}
                  disabled={!unlocked}
                  tabIndex={unlocked ? 0 : -1}
                  onFocus={e => e.currentTarget.classList.add('ring-2', 'ring-indigo-400')}
                  onBlur={e => e.currentTarget.classList.remove('ring-2', 'ring-indigo-400')}
                >
                  <span className={`flex items-center justify-center w-8 h-8 rounded-full border-2 mb-1 ${active ? 'bg-indigo-700 border-indigo-500 text-white scale-110' : unlocked ? 'bg-green-500 border-green-500 text-white' : 'bg-gray-200 border-gray-300 text-gray-400'}`}>
                    {completedSteps.has(idx)
                      ? <FaCheck className="w-4 h-4" />
                      : React.createElement(section.icon, { className: "w-4 h-4" })}
                  </span>
                  <span className="text-[10px] font-medium">{idx + 1}</span>
                  {!unlocked && <span className="text-[10px] text-gray-400 mt-1">Locked</span>}
                </button>
                {/* Tooltip for full section title */}
                <div className="absolute left-1/2 -translate-x-1/2 top-12 z-20 hidden group-hover:flex group-focus-within:flex flex-col items-center pointer-events-none">
                  <span className="bg-gray-900 text-white text-xs rounded px-3 py-1 shadow-lg whitespace-nowrap max-w-xs text-center">
                    {section.title}
                  </span>
                  <span className="w-2 h-2 bg-gray-900 rotate-45 mt-[-4px]"></span>
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Form Card */}
      <main className="w-full flex flex-col items-center justify-center flex-1">
        
        <section
          className={`w-full max-w-2xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100 p-4 md:p-8 flex flex-col mt-2 md:mt-4 animate-fade-in ${FORM_SECTIONS[currentStep].fields.length === 1 ? 'gap-2' : 'gap-4 md:gap-8'}`}
        >
          {/* Section Header */}
          <div className="mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-3">
              {React.createElement(FORM_SECTIONS[currentStep].icon, { className: "w-6 h-6 text-indigo-600" })}
              {FORM_SECTIONS[currentStep].title}
            </h2>
            <p className="text-sm text-gray-500 font-medium mt-1">{FORM_SECTIONS[currentStep].description}</p>
          </div>
          <form
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              if(onSubmit)  onSubmit(localValues);
            }}
            className="flex flex-col gap-6"
          >
            <div className={`${FORM_SECTIONS[currentStep].fields.length === 1 ? 'space-y-2' : 'space-y-4 md:space-y-8'}`}>
              {/* Dynamic Section Rendering */}
              {FORM_SECTIONS[currentStep].id === "livingArrangements" ? (
                <div className="flex flex-col gap-8 w-full">
                  {/* Living Arrangements */}
                  {(() => {
                    const meta = FIELD_METADATA["livingArrangements"];
                    const required = isFieldRequired("livingArrangements");
                    const showOther = Array.isArray(localValues.livingArrangements) && localValues.livingArrangements.some((opt: string) => opt.toLowerCase().includes('other'));
                    return <React.Fragment key="livingArrangements">
                      {renderMultiSelectCheckbox(meta.label, "livingArrangements", meta.options || [], required)}
                      {showOther && (
                        <div className="mt-2 w-full">
                          {renderInput(FIELD_METADATA.livingArrangementsOther.label, "livingArrangementsOther", "text", FIELD_METADATA.livingArrangementsOther.placeholder, isFieldRequired("livingArrangementsOther"))}
                        </div>
                      )}
                    </React.Fragment>;
                  })()}
                  {/* Travel Arrangements */}
                  {(() => {
                    const meta = FIELD_METADATA["travelArrangements"];
                    const required = isFieldRequired("travelArrangements");
                    const showOther = Array.isArray(localValues.travelArrangements) && localValues.travelArrangements.some((opt: string) => opt.toLowerCase().includes('other'));
                    return <React.Fragment key="travelArrangements">
                      {renderMultiSelectCheckbox(meta.label, "travelArrangements", meta.options || [], required)}
                      {showOther && (
                        <div className="mt-2 w-full">
                          {renderInput(FIELD_METADATA.travelArrangementsOther.label, "travelArrangementsOther", "text", FIELD_METADATA.travelArrangementsOther.placeholder, isFieldRequired("travelArrangementsOther"))}
                        </div>
                      )}
                    </React.Fragment>;
                  })()}
                </div>
              ) : FORM_SECTIONS[currentStep].id === "aboutMe" ? (
                <div className="w-full">
                  {(() => {
                    const meta = FIELD_METADATA["aboutMe"];
                    const required = isFieldRequired("aboutMe");
                    return renderTextArea(meta.label, "aboutMe", meta.rows || 4, meta.placeholder, required);
                  })()}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {FORM_SECTIONS[currentStep].fields.map((field) => {
                    const meta = FIELD_METADATA[field] || { label: field, type: "text" };
                    const required = isFieldRequired(field);
                    if (meta.type === "textarea") {
                      return renderTextArea(meta.label, field, meta.rows || 3, meta.placeholder, required);
                    }
                    if (meta.type === "dropdown") {
                      return renderDropdown(meta.label, field, meta.options || [], meta.showIfYes, required);
                    }
                    if (meta.type === "checkbox") {
                      return renderMultiSelectCheckbox(meta.label, field, meta.options || [], required);
                    }
                    return renderInput(meta.label, field, meta.type || "text", meta.placeholder, required);
                  })}
                </div>
              )}
            </div>
          </form>
        </section>
        {/* Navigation Buttons */}
        <footer className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-lg border-t border-gray-100 px-4 md:px-10 py-5 flex flex-col items-center gap-4 shadow-2xl rounded-b-3xl animate-fade-in mt-2">
          {/* Stepper */}
          <div className="flex flex-row justify-center items-center space-x-2 mb-2">
  {FORM_SECTIONS.map((_, index) => (
    <div
      key={index}
      className={`w-3 h-3 rounded-full border duration-200 ${index === currentStep ? "bg-blue-600 border-blue-600 shadow" : index < currentStep ? "bg-green-500 border-green-500" : "bg-gray-200 border-gray-300"}`}
    />
  ))}
</div>

<div className="flex flex-col w-full gap-2 md:flex-row md:gap-3 md:justify-between">
  <button
    type="button"
    onClick={handlePreviousSequential}
    disabled={currentStep === 0}
    className={`flex items-center justify-center space-x-1 px-5 py-2 rounded-full font-semibold transition-all text-sm shadow border duration-200 w-full md:w-1/3 ${currentStep === 0 ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200" : "bg-gradient-to-r from-gray-700 to-gray-900 text-white border-gray-700 hover:from-gray-800 hover:to-black"}`}
  >
    <FaChevronLeft className="w-4 h-4" />
    <span>Previous</span>
  </button>

  <button
    type="button"
    onClick={handleNextSequential}
    disabled={currentStep === FORM_SECTIONS.length - 1 || !isCurrentSectionComplete()}
    className={`flex items-center justify-center space-x-1 px-5 py-2 rounded-full font-semibold transition-all text-sm shadow border duration-200 w-full md:w-1/3 ${(currentStep === FORM_SECTIONS.length - 1 || !isCurrentSectionComplete()) ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200" : "bg-gradient-to-r from-indigo-600 to-green-400 text-white border-indigo-600 hover:from-indigo-700 hover:to-green-500"}`}
  >
    <span>Next</span>
    <FaChevronRight className="w-4 h-4" />
  </button>

  <button
    onClick={() => handleSaveWithConfirm(false)}
    className="flex items-center justify-center gap-1 px-5 py-2 rounded-full font-semibold text-sm bg-gray-600 hover:bg-gray-700 text-white shadow border border-gray-700 transition-all duration-200 w-full md:w-1/3 disabled:opacity-50"
  >
    <FaSave className="w-4 h-4" />
    Save
  </button>
</div>

{currentStep === FORM_SECTIONS.length - 1 && (
  <button
    className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 rounded-full font-semibold text-sm bg-gradient-to-r from-blue-600 to-green-400 text-white hover:from-blue-700 hover:to-green-500 shadow transition"
    onClick={onSubmit}
  >
    <FaCheck className="w-4 h-4" />
    Submit
  </button>
)}

        </footer>


        
      </main>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
      `}</style>

      {/* Prevent scrollbars on progress bar/stepper area */}
      <style jsx>{`
        nav::-webkit-scrollbar, nav::-webkit-scrollbar-thumb {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default ClientIntakeFormEnhanced;
