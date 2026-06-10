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
  FaSpinner,
} from "react-icons/fa";
import { useToast } from "@/components/ui/Toast";
import { formatDateForInput, formatDateForStorage } from "@/lib/dateFormatHelper";

interface FormProps {
  formData: any;
  commonFieldsData: any;
  onChange: (values: any, field?: string, isCommon?: boolean) => void;
  onSubmit?: (values: any) => void;
  readOnly?: boolean;
  fieldErrors?: Record<string, string>;
  handleSave: (submit: boolean) => void; // Keep for backward compatibility
  handleSaveProgress?: () => Promise<void>; // New: separate save function for Save Progress button
  handleSaveForNext?: () => Promise<void>; // New: separate save for Next button
  handleSaveForPrev?: () => Promise<void>; // New: separate save for Previous button
  handleSubmitForm?: () => Promise<void>; // New: separate submit function
  saving?: boolean; // Loading state for Save Progress button
  navigatingNext?: boolean; // Loading state for Next button only
  navigatingPrev?: boolean; // Loading state for Previous button only
  onCommonFieldsUpdated?: () => void;
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
    fields: ["barriers", "language", "countryOfBirth", "culturalValues", "culturalBehaviours", "writtenCommunication", "interpreter"]
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
  mobile: "phone",
  disabilityConditions: "disability",
  surname: "surname",
};

// Helper function to check if a field is a common field
const isCommonField = (fieldName: string): boolean => {
  return Object.keys(commonFieldsMapping).includes(fieldName);
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

const ClientIntakeFormEnhanced: React.FC<FormProps> = ({
  formData,
  commonFieldsData,
  onChange,
  onSubmit,
  readOnly = false,
  fieldErrors = {},
  handleSave, // Legacy function
  handleSaveProgress, // New: separate save function for Save Progress button
  handleSaveForNext, // New: separate save for Next button
  handleSaveForPrev, // New: separate save for Previous button
  handleSubmitForm, // New: separate submit function
  saving = false, // Loading state for Save Progress button
  navigatingNext = false, // Loading state for Next button only
  navigatingPrev = false, // Loading state for Previous button only
  onCommonFieldsUpdated,
} : any) => {

  // Helper function to get common field value
const getCommonFieldValue = (fieldName: string): string => {
  const commonKey = commonFieldsMapping[fieldName];
  return commonFieldsData?.[commonKey] || '';
};

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [maxStep, setMaxStep] = useState(0); // highest unlocked step

  const initialValues = {
    date: formatDateForStorage(new Date().toISOString().split("T")[0]),
    // Common fields - these will be displayed from commonFieldsData
    ndisNumber: commonFieldsData?.ndis || "",
    givenName: commonFieldsData?.name || "",
    sex: commonFieldsData?.sex || "",
    dateOfBirth: commonFieldsData?.dob || "",
    addressNumberStreet: commonFieldsData?.street || "",
    state: commonFieldsData?.state || "",
    postcode: commonFieldsData?.postCode || "",
    email: commonFieldsData?.email || "",
    homePhone: "",
    disabilityConditions: commonFieldsData?.disability || "",

    // Form-specific fields
    surname: commonFieldsData?.surname || "",
    pronoun: "",
    aboriginalTorres: "",
    preferredName: "",
  
    mobile: commonFieldsData?.phone || "",
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

  // Initialize local values with form data, but common fields will be displayed from commonFieldsData
  const [localValues, setLocalValues] = useState<any>(initialValues);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { showToast } = useToast();

  // 🎯 LOADING STATE FOR FORM SUBMISSION
  const [submitting, setSubmitting] = useState(false); // For form submission
  // Note: 'saving' state comes from parent component via props

  // Track pending changes to common fields (simplified since common fields are now read-only)
  const [pendingCommonFieldChanges, setPendingCommonFieldChanges] = useState<Record<string, any>>({});

  // Track changes to common fields (no longer needed since fields are read-only, but kept for compatibility)
  const trackCommonFieldChange = (name: string, value: any) => {
    // Common fields are now read-only, so this function does nothing
    // Kept for compatibility with existing code structure
    return;
  };

  // Update display when commonFieldsData changes (but don't modify localValues for common fields)
  useEffect(() => {
  console.log("commonFieldsData", commonFieldsData);
    if (!commonFieldsData) return;
    // We don't need to update localValues for common fields since we display them directly from commonFieldsData
    // This effect is kept for any future logic that might depend on commonFieldsData changes
  }, [commonFieldsData]);

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
    
    // Prevent changes to common fields
    if (isCommonField(name)) {
      showToast({
        type: "info",
        title: "Common Field",
        message: "This field can only be updated from the client's common details section.",
        duration: 3000,
      });
      return;
    }
    
    const newValues = { ...localValues, [name]: value };
    setLocalValues(newValues);

    const isCommon = !!commonFieldsMapping[name];
    if (isCommon) trackCommonFieldChange(name, value);
    onChange(newValues, name, isCommon);
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
      let value;
      
      // For common fields, get value from commonFieldsData
      if (isCommonField(key)) {
        value = getCommonFieldValue(key);
      } else {
        value = localValues[key];
      }
      
      return value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && value.length === 0);
    });
  };

  // Only allow navigation to unlocked steps
  const handleStepClickSequential = (stepIndex: number) => {
    if (stepIndex <= maxStep) {
      setCurrentStep(stepIndex);
    }
  };

  const handleNextSequential = async () => {
  // Save before progressing
  if (handleSaveForNext) {
    await handleSaveForNext();
  }

  if (currentStep < FORM_SECTIONS.length - 1) {
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    setMaxStep((prev) => Math.max(prev, nextStep)); // <- This is crucial
  }
};


  // On Previous
  const handlePreviousSequential = async () => {
    if (currentStep > 0) {
      // Save before going back
      if (handleSaveForPrev) {
        await handleSaveForPrev();
      }
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
  ) => {
    const isCommon = isCommonField(name);
      let displayValue = isCommon
        ? getCommonFieldValue(name)
        : localValues[name] || "";
    
      const isFieldReadOnly = readOnly || isCommon;
    
      if (type === 'date' && displayValue) {
        displayValue = formatDateForInput(displayValue);
      }
    
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-azure-600 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          
        </label>
        <input
          type={type}
          name={name}
          value={displayValue}
          onChange={isCommon ? undefined : handleChange}
          placeholder={isCommon ? "Value from common fields" : placeholder}
          disabled={isFieldReadOnly}
          className={`w-full rounded-lg border border-azure-100 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder-azure-300 ${
            fieldErrors[name]
              ? "border-red-300 bg-red-50"
              : isCommon 
                ? "bg-azure-50 border-azure-100 text-azure-700"
                : "hover:border-accent/40"
          } ${isFieldReadOnly ? "cursor-not-allowed" : ""}`}
        />
       
        {fieldErrors[name] && (
          <p className="text-xs text-red-500 mt-1">{fieldErrors[name]}</p>
        )}
      </div>
    );
  };

  const renderTextArea = (
    label: string,
    name: string,
    rows: number = 3,
    placeholder?: string,
    required?: boolean
  ) => {
    const isCommon = isCommonField(name);
    const displayValue = isCommon ? getCommonFieldValue(name) : (localValues[name] || "");
    const isFieldReadOnly = readOnly || isCommon;
    
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-azure-600 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
         
        </label>
        <textarea
          name={name}
          value={displayValue}
          onChange={isCommon ? undefined : handleChange}
          placeholder={isCommon ? "Value from common fields" : placeholder}
          rows={rows}
          disabled={isFieldReadOnly}
          className={`w-full rounded-lg border border-azure-100 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder-azure-300 resize-none ${
            fieldErrors[name]
              ? "border-red-300 bg-red-50"
              : isCommon 
                ? "bg-azure-50 border-azure-100 text-azure-700"
                : "hover:border-accent/40"
          } ${isFieldReadOnly ? "cursor-not-allowed" : ""}`}
        />
        
        {fieldErrors[name] && (
          <p className="text-xs text-red-500 mt-1">{fieldErrors[name]}</p>
        )}
      </div>
    );
  };

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
      <label className="text-xs font-medium text-azure-600 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        name={name}
        value={localValues[name] || ""}
        onChange={handleChange}
        disabled={readOnly}
        className={`w-full rounded-lg border border-azure-100 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all ${
          fieldErrors[name]
            ? "border-red-300 bg-red-50"
            : "hover:border-accent/40"
        } ${readOnly ? "bg-azure-50 text-azure-300" : ""}`}
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
                className={`w-full rounded-xl border border-azure-100 bg-white px-3 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder-azure-300 ${
                  fieldErrors[showIfYes.inputName]
                    ? "border-red-300 bg-red-50"
                    : "hover:border-accent/40"
                } ${readOnly ? "bg-azure-50 text-azure-300" : ""}`}
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
          fieldErrors[name] ? "text-red-500" : "text-azure-600"
        }`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className={`flex flex-col gap-2 w-full`}>
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-azure-100 shadow-sm hover:shadow-md transition-all cursor-pointer w-full"
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
              className="accent-accent h-4 w-4 rounded border-azure-200 focus:ring-accent"
            />
            <span className="text-sm text-azure-600">{option}</span>
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
    sex: { label: "Sex", type: "text", placeholder: "Enter your sex" },
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
    otherSupports: { label: "What other supports including mainstream health services you receive at present", type: "textarea", placeholder: "Describe any other support services you receive", rows: 4 },
    aboutMe: { label: "", type: "textarea", placeholder: "Tell us about yourself", rows: 4 },
    advocateName: { label: "Advocate Name", type: "text", placeholder: "Advocate's full name" },
    advocateEmail: { label: "Advocate Email", type: "email", placeholder: "Advocate's email" },
    advocatePhone: { label: "Advocate Phone", type: "tel", placeholder: "Advocate's phone" },
    advocateMobile: { label: "Advocate Mobile", type: "tel", placeholder: "Advocate's mobile" },
    advocateAddress: { label: "Advocate Address", type: "text", placeholder: "Advocate's address" },
    advocatePostalAddress: { label: "Advocate Postal Address", type: "text", placeholder: "Advocate's postal address" },
    advocateOtherInfo: { label: "Additional Information", type: "textarea", placeholder: "Any additional information about your advocate", rows: 3 },
    advocateRelationship: { label: "Relationship with Participant", type: "text", placeholder: "Relationship" },
    barriers: { label: "Are there any cultural, communication barriers or intimacy issues that need to be considered when delivering services", type: "dropdown", options: yesNoOptions },
    language: { label: "Language", type: "text", placeholder: "Primary language spoken" },
    interpreter: { label: "Verbal communication or spoken language - Is an interpreter needed?", type: "dropdown", options: yesNoOptions },
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
    livingArrangements: { label: "What is your current living arrangement? ", type: "checkbox", options: livingArrangementsOptions },
    livingArrangementsOther: { label: "Please specify other living arrangement", type: "text", placeholder: "Specify other..." },
    travelArrangements: { label: "Travel Arrangements", type: "checkbox", options: travelArrangementsOptions },
    travelArrangementsOther: { label: "Please specify other travel arrangement", type: "text", placeholder: "Specify other..." },
    medicationChart: { label: "Does the Participant require a Medication Chart?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, is this medication taken on a regular basis and for what purpose, ensure to complete Medication Chart and Participant risk assessment", inputName: "medicationChartOthers" } },
    mealtimeManagement: { label: "Does the Participant require Mealtime Management?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, refer to Mealtime Management Plan Form" } },
    bowelCare: { label: "Does the participant require Bowel Care Management?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, refer to Complex Bowel Care Plan and Monitoring Form and indicate what assistance is required with bowel care.", inputName: "bowelCareOthers" } },
    menstrualIssues: { label: "Are there any issues with a menstrual cycle or is assistance needed with female hygiene ", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, Please specify", inputName: "menstrualIssuesOthers" } },
    epilepsy: { label: "Does the Participant have Epilepsy?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, ensure Participant's Doctor completes an Epilepsy Plan", inputName: "epilepsyOthers" } },
    asthmatic: { label: "Is the Participant an Asthmatic?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, ensure Participant's Doctor completes an Asthma Plan", inputName: "asthmaticOthers" } },
    allergies: { label: "Does the Participant have any allergies?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, ensure to have an Allergy Plan from Participant's Doctor", inputName: "allergiesOthers" } },
    anaphylactic: { label: "Is the Participant anaphylactic?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, ensure to have an anaphylaxis Plan from the Participant's Doctor", inputName: "anaphylacticOthers" } },
    minorInjury: { label: "Do you give permission for our company’s staff to administer band-aids in cases of a minor injury?", type: "dropdown", options: yesNoOptions },
    training: { label: "Does this participant require specific training?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, ensure to provide information such as implementing a positive behaviour support plan.", inputName: "trainingOthers" } },
    othermedical: { label: "Are there any other medication conditions that will be relevant to the care provided to this Participant?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, please specify.", inputName: "othermedicalOthers" } },
    trigger: { label: "Is there any specific trigger for community activities?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, please specify and complete the Risk assessment for participants.", inputName: "triggerOthers" } },
    absconding: { label: "Does the Participant show signs or a history of unexpectedly leaving (absconding)?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, please specify.", inputName: "abscondingOthers" } },
    historyOfFalls: { label: "Is this participant prone to falls or have a history of falls?", type: "dropdown", options: yesNoOptions },
    behaviourConcern: { label: "Are there any Behaviours of Concern? Eg: Kicking, biting", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, please specify.", inputName: "behaviourConcernOthers" } },
    positiveBehaviour: { label: "Is there a current Positive Behaviour Support Plan in place?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, refer to High Risk Participant Register.", inputName: "positiveBehaviourOthers" } },
    communicationAssistance: { label: "Does the participant require communication assistance?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, refer to the mode of communication reflected in Participant Risk Assessment and disaster management plan.", inputName: "communicationAssistanceOthers" } },
    physicalAssistance: { label: "Is there any physical assistance or physical assistance preference for this Participant?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, specify.", inputName: "physicalAssistanceOthers" } },
    languageConcern: { label: "Does the Participant have any expressive language concerns?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, refer to Participant Risk Assessment and disaster management plan under OH&S Assessments and Mode of Communication.", inputName: "languageConcernOthers" } },
    personalGoals: { label: "Does this Participant have any personal preferences & personal goals?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, refer to form Support Plan" } },
  };

  // Validation function to check if all required fields are filled
  const validateRequiredFields = () => {
    const missingFields: string[] = [];
    
    FORM_SECTIONS.forEach(section => {
      section.requiredFields.forEach(fieldName => {
        let value;
        
        // For common fields, get value from commonFieldsData
        if (isCommonField(fieldName)) {
          value = getCommonFieldValue(fieldName);
        } else {
          value = localValues[fieldName];
        }
        
        // Check if field is empty, null, undefined, or empty string
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          missingFields.push(`${fieldName}`);
        }
      });
    });
    
    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  };

 

  const handleFormSubmitCheckValidation = async () => {
    try {
    const validationResult = validateRequiredFields();

    if (validationResult.isValid) {
      await handleSaveProgress(); // Awaiting if handleSaveProgress is async
    } else {
      showToast({
        type: 'error',
        title: "Missing Required Fields",
        message: validationResult.missingFields.join(', ') // Formats the missing fields as a readable list
      });
    }
  } catch (error) {
    console.error("Validation or save failed:", error);
    showToast({
      type: 'error',
      title: "Error",
      message: "Something went wrong during validation or saving."
    });
  }
  }

  // 🎯 LEGACY WRAPPER FUNCTION (for backward compatibility)
  const handleSaveWithConfirm = async (submit: boolean) => {

    if (submit) {
      setSubmitting(true);
      await handleSubmitForm();
      setSubmitting(false);
    } else {
      await handleSaveProgress();
    }
  };


  const getFieldValue = (name: string) => {
    const parts = name.split('.');
    let value = localValues;
    for (const part of parts) {
      value = value[part];
    }
    return value;
  };


  

  return (
    <div className="">
      {/* Progress Bar */}
      <div className="w-full max-w-2xl mx-auto pt-2 md:pt-6 px-2">
        <div className="w-full h-2 bg-azure-200 rounded-full mb-4">
          <div className="h-2 bg-gradient-to-r from-azure-600 to-emerald-400 rounded-full transition-all" style={{ width: `${getProgressPercentage()}%` }} />
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
                  className={`flex flex-col items-center min-w-[60px] px-2 focus:outline-none transition-all duration-200 ${active ? 'text-azure-700' : unlocked ? 'text-emerald-600' : 'text-azure-300 opacity-50 cursor-not-allowed'}`}
                  aria-current={active ? 'step' : undefined}
                  aria-label={section.title}
                  disabled={!unlocked}
                  tabIndex={unlocked ? 0 : -1}
                  onFocus={e => e.currentTarget.classList.add('ring-2', 'ring-azure-400')}
                  onBlur={e => e.currentTarget.classList.remove('ring-2', 'ring-azure-400')}
                >
                  <span className={`flex items-center justify-center w-8 h-8 rounded-full border-2 mb-1 ${active ? 'bg-azure-800 border-azure-600 text-white scale-110' : unlocked ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-azure-200 border-azure-200 text-azure-300'}`}>
                    {completedSteps.has(idx)
                      ? <FaCheck className="w-4 h-4" />
                      : React.createElement(section.icon, { className: "w-4 h-4" })}
                  </span>
                  <span className="text-[10px] font-medium">{idx + 1}</span>
                  {!unlocked && <span className="text-[10px] text-azure-300 mt-1">Locked</span>}
                </button>
                {/* Tooltip for full section title */}
                <div className="absolute left-1/2 -translate-x-1/2 top-12 z-20 hidden group-hover:flex group-focus-within:flex flex-col items-center pointer-events-none">
                  <span className="bg-azure-700 text-white text-xs rounded px-3 py-1 shadow-lg whitespace-nowrap max-w-xs text-center">
                    {section.title}
                  </span>
                  <span className="w-2 h-2 bg-azure-700 rotate-45 mt-[-4px]"></span>
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Form Card */}
      <main className="w-full flex flex-col items-center justify-center flex-1">
        
        <section
          className={`w-full max-w-2xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-azure-50 p-4 md:p-8 flex flex-col mt-2 md:mt-4 animate-fade-in ${FORM_SECTIONS[currentStep].fields.length === 1 ? 'gap-2' : 'gap-4 md:gap-8'}`}
        >
          {/* Section Header */}
          <div className="mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-azure-700 flex items-center gap-3">
              {React.createElement(FORM_SECTIONS[currentStep].icon, { className: "w-6 h-6 text-azure-700" })}
              {FORM_SECTIONS[currentStep].title}
            </h2>
            <p className="text-sm text-azure-400 font-medium mt-1">{FORM_SECTIONS[currentStep].description}</p>
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
                      return <React.Fragment key={field}>{renderTextArea(meta.label, field, meta.rows || 3, meta.placeholder, required)}</React.Fragment>;
                    }
                    if (meta.type === "dropdown") {
                      return <React.Fragment key={field}>{renderDropdown(meta.label, field, meta.options || [], meta.showIfYes, required)}</React.Fragment>;
                    }
                    if (meta.type === "checkbox") {
                      return <React.Fragment key={field}>{renderMultiSelectCheckbox(meta.label, field, meta.options || [], required)}</React.Fragment>;
                    }
                    return <React.Fragment key={field}>{renderInput(meta.label, field, meta.type || "text", meta.placeholder, required)}</React.Fragment>;
                  })}
                </div>
              )}
            </div>
          </form>
        </section>
        {/* Navigation Buttons */}
        <footer className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-lg border-t border-azure-50 px-4 md:px-10 py-5 flex flex-col items-center gap-4 shadow-2xl rounded-b-3xl animate-fade-in mt-2">
          {/* Stepper */}
          <div className="flex flex-row justify-center items-center space-x-2 mb-2">
  {FORM_SECTIONS.map((_, index) => (
    <div
      key={index}
      className={`w-3 h-3 rounded-full border duration-200 ${index === currentStep ? "bg-azure-600 border-azure-600 shadow" : index < currentStep ? "bg-emerald-500 border-emerald-500" : "bg-azure-200 border-azure-200"}`}
    />
  ))}
</div>

<div className="flex flex-col w-full gap-2 md:flex-row md:gap-3 md:justify-between">
  <button
    type="button"
    onClick={handlePreviousSequential}
    disabled={currentStep === 0 || navigatingPrev}
    className={`flex items-center justify-center space-x-1 px-5 py-2 rounded-full font-semibold transition-all text-sm shadow border duration-200 w-full md:w-1/3 ${currentStep === 0 || navigatingPrev ? "bg-azure-100 text-azure-300 cursor-not-allowed border-azure-100" : "bg-gradient-to-r from-azure-600 to-azure-800 text-white border-azure-600 hover:from-azure-700 hover:to-black"}`}
  >
    {navigatingPrev ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaChevronLeft className="w-4 h-4" />}
    <span>Previous</span>
  </button>

  <button
    type="button"
    onClick={handleNextSequential}
    disabled={currentStep === FORM_SECTIONS.length - 1 || !isCurrentSectionComplete() || navigatingNext}
    className={`flex items-center justify-center space-x-1 px-5 py-2 rounded-full font-semibold transition-all text-sm shadow border duration-200 w-full md:w-1/3 ${(currentStep === FORM_SECTIONS.length - 1 || !isCurrentSectionComplete() || navigatingNext) ? "bg-azure-100 text-azure-300 cursor-not-allowed border-azure-100" : "bg-gradient-to-r from-azure-700 to-emerald-400 text-white border-azure-700 hover:from-azure-800 hover:to-emerald-500"}`}
  >
    <span>Next</span>
    {navigatingNext ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaChevronRight className="w-4 h-4" />}
  </button>

  <button
    onClick={() => handleSaveProgress()}
    disabled={saving || submitting}
    className="flex items-center justify-center gap-1 px-5 py-2 rounded-full font-semibold text-sm bg-azure-500 hover:bg-azure-600 text-white shadow border border-azure-600 transition-all duration-200 w-full md:w-1/3 disabled:opacity-50"
  >
    {saving ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaSave className="w-4 h-4" />}
    {saving ? 'Saving...' : 'Save Progress'}
  </button>
</div>

{currentStep === FORM_SECTIONS.length - 1 && (
  <button
    className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 rounded-full font-semibold text-sm bg-gradient-to-r from-azure-600 to-emerald-400 text-white hover:from-azure-700 hover:to-emerald-500 shadow transition"
    onClick={(e) => {
      e.preventDefault();
      handleSaveWithConfirm(true); // Submit with validation
    }}
    disabled={saving || submitting}
  >
    <FaCheck className="w-4 h-4" />
              {submitting ?   <FaSpinner className="w-4 h-4 animate-spin" /> : "Submit Form"}
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
