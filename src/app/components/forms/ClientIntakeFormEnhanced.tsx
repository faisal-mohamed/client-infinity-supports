"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FaUser,
  FaHome,
  FaPhone,
  FaUserMd,
  FaShieldAlt,
  FaHeart,
  FaBullseye,
  FaChevronLeft,
  FaChevronRight,
  FaCheck,
  FaSave,
} from "react-icons/fa";

interface FormProps {
  formData: any;
  commonFieldsData: any;
  onChange: (values: any) => void;
  onSubmit?: (values: any) => void;
  readOnly?: boolean;
  fieldErrors?: Record<string, string>;
  handleSave: (submit: boolean) => void;
}

// Form sections configuration
const FORM_SECTIONS = [
  {
    id: "personal",
    title: "Personal Information",
    icon: FaUser,
    description: "Basic personal details and identification",
    requiredFields: ["givenName", "surname", "dateOfBirth", "sex"],
  },
  {
    id: "contact",
    title: "Contact & Address",
    icon: FaHome,
    description: "Contact information and residential details",
    requiredFields: ["addressNumberStreet", "state", "postcode", "email"],
  },
  {
    id: "emergency",
    title: "Emergency Contacts",
    icon: FaPhone,
    description: "Primary and secondary emergency contacts",
    requiredFields: ["primaryContactName", "primaryContactRelationship"],
  },
  {
    id: "medical",
    title: "Medical Information",
    icon: FaUserMd,
    description: "Medical conditions and healthcare providers",
    requiredFields: ["medicalCentreName"],
  },
  {
    id: "support",
    title: "Support Services",
    icon: FaShieldAlt,
    description: "Support coordinators and advocacy services",
    requiredFields: [],
  },
  {
    id: "health",
    title: "Health & Safety",
    icon: FaHeart,
    description: "Health conditions and safety considerations",
    requiredFields: [],
  },
  {
    id: "goals",
    title: "Goals & Preferences",
    icon: FaBullseye,
    description: "Personal goals and preferences",
    requiredFields: [],
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

const ClientIntakeFormEnhanced: React.FC<FormProps> = ({
  formData,
  commonFieldsData,
  onChange,
  onSubmit,
  readOnly = false,
  fieldErrors = {},
  handleSave
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

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onChange(localValues);
    }, 300);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [localValues, onChange]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setLocalValues((prev: any) => ({ ...prev, [name]: value }));
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
    return (
      ((completedSteps.size + (currentStep > 0 ? 1 : 0)) /
        FORM_SECTIONS.length) *
      100
    );
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

  // On Next, unlock the next step
  const handleNextSequential = () => {
    if (currentStep < FORM_SECTIONS.length - 1 && isCurrentSectionComplete()) {
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
        disabled={
          readOnly ||
          (commonFieldsMapping[name] &&
            commonFieldsData?.[commonFieldsMapping[name]])
        }
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer"
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

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Progress Bar */}
      <div className="w-full max-w-2xl mx-auto pt-8 px-2">
        <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
          <div className="h-2 bg-gradient-to-r from-indigo-500 to-green-400 rounded-full transition-all" style={{ width: `${getProgressPercentage()}%` }} />
        </div>
        {/* Horizontal Stepper (sequential, locked steps) */}
        <nav className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 pb-2">
          {FORM_SECTIONS.map((section, idx) => {
            const active = idx === currentStep;
            const unlocked = idx <= maxStep;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => handleStepClickSequential(idx)}
                className={`flex flex-col items-center min-w-[60px] px-2 focus:outline-none transition-all duration-200 ${active ? 'text-indigo-700' : unlocked ? 'text-green-600' : 'text-gray-400 opacity-50 cursor-not-allowed'}`}
                aria-current={active ? 'step' : undefined}
                aria-label={section.title}
                disabled={!unlocked}
                tabIndex={unlocked ? 0 : -1}
              >
                <span className={`flex items-center justify-center w-8 h-8 rounded-full border-2 mb-1 ${active ? 'bg-indigo-700 border-indigo-500 text-white scale-110' : unlocked ? 'bg-green-500 border-green-500 text-white' : 'bg-gray-200 border-gray-300 text-gray-400'}`}>
                  {unlocked ? <FaCheck className="w-4 h-4" /> : React.createElement(section.icon, { className: "w-4 h-4" })}
                </span>
                <span className="text-xs font-semibold text-center max-w-[60px] truncate">{section.title.split(' ')[0]}</span>
                <span className="text-[10px] font-medium">{idx + 1}</span>
                {!unlocked && <span className="text-[10px] text-gray-400 mt-1">Locked</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Form Card */}
      <main className="w-full flex flex-col items-center justify-center flex-1">
        <section className="w-full max-w-2xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100 p-4 md:p-8 flex flex-col gap-8 mt-4 animate-fade-in">
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
            <div className="space-y-6 md:space-y-8">
              {/* Personal Information Section */}
              {currentStep === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInput(
                    "NDIS Number",
                    "ndisNumber",
                    "text",
                    "Enter your NDIS number",
                    isFieldRequired("ndisNumber")
                  )}
                  {renderInput(
                    "Given Name",
                    "givenName",
                    "text",
                    "Enter your first name",
                    isFieldRequired("givenName")
                  )}
                  {renderInput(
                    "Surname",
                    "surname",
                    "text",
                    "Enter your last name",
                    isFieldRequired("surname")
                  )}
                  {renderInput(
                    "Preferred Name",
                    "preferredName",
                    "text",
                    "How would you like to be called?",
                    isFieldRequired("preferredName")
                  )}
                  {renderInput("Date of Birth", "dateOfBirth", "date", "Enter your date of birth", isFieldRequired("dateOfBirth"))}
                  {renderDropdown("Sex", "sex", ["Male", "Female", "Other"], undefined, isFieldRequired("sex"))}
                  {renderInput(
                    "Pronoun",
                    "pronoun",
                    "text",
                    "e.g., he/him, she/her, they/them",
                    isFieldRequired("pronoun")
                  )}
                  {renderDropdown(
                    "Aboriginal or Torres Strait Islander?",
                    "aboriginalTorres",
                    yesNoOptions,
                    undefined,
                    isFieldRequired("aboriginalTorres")
                  )}
                  <div className="md:col-span-2">
                    {renderTextArea(
                      "Disability Conditions/Disability type(s)",
                      "disabilityConditions",
                      3,
                      "Please describe your disability conditions or types",
                      isFieldRequired("disabilityConditions")
                    )}
                  </div>
                </div>
              )}

              {/* Contact & Address Section */}
              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    {renderInput(
                      "Address (Number/Street)",
                      "addressNumberStreet",
                      "text",
                      "Enter your street address",
                      isFieldRequired("addressNumberStreet")
                    )}
                  </div>
                  {renderInput("State", "state", "text", "Enter your state", isFieldRequired("state"))}
                  {renderInput(
                    "Postcode",
                    "postcode",
                    "text",
                    "Enter your postcode",
                    isFieldRequired("postcode")
                  )}
                  {renderInput(
                    "Email",
                    "email",
                    "email",
                    "Enter your email address",
                    isFieldRequired("email")
                  )}
                  {renderInput(
                    "Home Phone",
                    "homePhone",
                    "tel",
                    "Enter your home phone number",
                    isFieldRequired("homePhone")
                  )}
                  {renderInput(
                    "Mobile",
                    "mobile",
                    "tel",
                    "Enter your mobile number",
                    isFieldRequired("mobile")
                  )}
                  {renderInput(
                    "Language",
                    "language",
                    "text",
                    "Primary language spoken",
                    isFieldRequired("language")
                  )}
                  {renderDropdown(
                    "Interpreter Needed?",
                    "interpreter",
                    yesNoOptions,
                    undefined,
                    isFieldRequired("interpreter")
                  )}
                  {renderInput(
                    "Country of Birth",
                    "countryOfBirth",
                    "text",
                    "Enter your country of birth",
                    isFieldRequired("countryOfBirth")
                  )}
                  <div className="md:col-span-2">
                    {renderMultiSelectCheckbox(
                      "Living Arrangements",
                      "livingArrangements",
                      livingArrangementsOptions,
                      isFieldRequired("livingArrangements")
                    )}
                  </div>
                  <div className="md:col-span-2">
                    {renderMultiSelectCheckbox(
                      "Travel Arrangements",
                      "travelArrangements",
                      travelArrangementsOptions,
                      isFieldRequired("travelArrangements")
                    )}
                  </div>
                </div>
              )}

              {/* Emergency Contacts Section */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">
                      Primary Contact
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderInput(
                        "Name",
                        "primaryContactName",
                        "text",
                        "Primary contact's full name",
                        isFieldRequired("primaryContactName")
                      )}
                      {renderInput(
                        "Relationship",
                        "primaryContactRelationship",
                        "text",
                        "Relationship to you",
                        isFieldRequired("primaryContactRelationship")
                      )}
                      {renderInput(
                        "Home Phone",
                        "primaryContactHomePhone",
                        "tel",
                        "Home phone number",
                        isFieldRequired("primaryContactHomePhone")
                      )}
                      {renderInput(
                        "Mobile",
                        "primaryContactMobile",
                        "tel",
                        "Mobile phone number",
                        isFieldRequired("primaryContactMobile")
                      )}
                    </div>
                  </div>

                  <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                    <h3 className="text-lg font-semibold text-green-800 mb-4">
                      Secondary Contact
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderInput(
                        "Name",
                        "secondaryContactName",
                        "text",
                        "Secondary contact's full name",
                        isFieldRequired("secondaryContactName")
                      )}
                      {renderInput(
                        "Relationship",
                        "secondaryContactRelationship",
                        "text",
                        "Relationship to you",
                        isFieldRequired("secondaryContactRelationship")
                      )}
                      {renderInput(
                        "Home Phone",
                        "secondaryContactHomePhone",
                        "tel",
                        "Home phone number",
                        isFieldRequired("secondaryContactHomePhone")
                      )}
                      {renderInput(
                        "Mobile",
                        "secondaryContactMobile",
                        "tel",
                        "Mobile phone number",
                        isFieldRequired("secondaryContactMobile")
                      )}
                    </div>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-800 mb-4">
                      Advocate Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderInput(
                        "Advocate Name",
                        "advocateName",
                        "text",
                        "Advocate's full name",
                        isFieldRequired("advocateName")
                      )}
                      {renderInput(
                        "Advocate Email",
                        "advocateEmail",
                        "email",
                        "Advocate's email",
                        isFieldRequired("advocateEmail")
                      )}
                      {renderInput(
                        "Advocate Phone",
                        "advocatePhone",
                        "tel",
                        "Advocate's phone",
                        isFieldRequired("advocatePhone")
                      )}
                      {renderInput(
                        "Advocate Mobile",
                        "advocateMobile",
                        "tel",
                        "Advocate's mobile",
                        isFieldRequired("advocateMobile")
                      )}
                      {renderInput(
                        "Relationship with Participant",
                        "advocateRelationship",
                        "text",
                        "Relationship to you",
                        isFieldRequired("advocateRelationship")
                      )}
                      <div className="md:col-span-2">
                        {renderInput(
                          "Advocate Address",
                          "advocateAddress",
                          "text",
                          "Advocate's address",
                          isFieldRequired("advocateAddress")
                        )}
                      </div>
                      <div className="md:col-span-2">
                        {renderTextArea(
                          "Additional Information",
                          "advocateOtherInfo",
                          3,
                          "Any additional information about your advocate",
                          isFieldRequired("advocateOtherInfo")
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Medical Information Section */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                    <h3 className="text-lg font-semibold text-red-800 mb-4">
                      Medical Centre Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderInput(
                        "Medical Centre Name",
                        "medicalCentreName",
                        "text",
                        "Name of your medical centre",
                        isFieldRequired("medicalCentreName")
                      )}
                      {renderInput(
                        "Medical Centre Phone",
                        "medicalPhone",
                        "tel",
                        "Medical centre phone number",
                        isFieldRequired("medicalPhone")
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {renderDropdown(
                      "Cultural, Communication Barriers or Intimacy Issues",
                      "barriers",
                      yesNoOptions,
                      undefined,
                      isFieldRequired("barriers")
                    )}
                    {renderInput(
                      "Cultural Values",
                      "culturalValues",
                      "text",
                      "Important cultural values",
                      isFieldRequired("culturalValues")
                    )}
                    {renderInput(
                      "Cultural Behaviours",
                      "culturalBehaviours",
                      "text",
                      "Important cultural behaviours",
                      isFieldRequired("culturalBehaviours")
                    )}
                    {renderInput(
                      "Written Communication / Literacy",
                      "writtenCommunication",
                      "text",
                      "Communication preferences",
                      isFieldRequired("writtenCommunication")
                    )}
                  </div>
                </div>
              )}

              {/* Support Services Section */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200">
                    <h3 className="text-lg font-semibold text-indigo-800 mb-4">
                      Support Coordinator
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderInput(
                        "Support Coordinator Name",
                        "supportCoordinatorName",
                        "text",
                        "Coordinator's name",
                        isFieldRequired("supportCoordinatorName")
                      )}
                      {renderInput(
                        "Support Coordinator Email",
                        "supportCoordinatorEmail",
                        "email",
                        "Coordinator's email",
                        isFieldRequired("supportCoordinatorEmail")
                      )}
                      {renderInput(
                        "Support Coordinator Company",
                        "supportCoordinatorCompany",
                        "text",
                        "Company name",
                        isFieldRequired("supportCoordinatorCompany")
                      )}
                      {renderInput(
                        "Support Coordinator Contact",
                        "supportCoordinatorContact",
                        "tel",
                        "Contact number",
                        isFieldRequired("supportCoordinatorContact")
                      )}
                    </div>
                  </div>
                  <div>
                    {renderTextArea(
                      "Other Supports",
                      "otherSupports",
                      4,
                      "Describe any other support services you receive",
                      isFieldRequired("otherSupports")
                    )}
                  </div>
                </div>
              )}

              {/* Health & Safety Section */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    {renderDropdown(
                      "Requires Medication Chart?",
                      "medicationChart",
                      yesNoOptions,
                      {
                        label:
                          "If yes, is this medication taken on a regular basis and for what purpose, ensure to complete Medication Chart and Participant risk assessment",
                        inputName: "medicationChartOthers",
                      },
                      isFieldRequired("medicationChart")
                    )}
                    {renderDropdown(
                      "Requires Mealtime Management?",
                      "mealtimeManagement",
                      yesNoOptions,
                      {
                        label: "If yes, refer to Mealtime Management Plan Form",
                      },
                      isFieldRequired("mealtimeManagement")
                    )}
                    {renderDropdown(
                      "Requires Bowel Care Management?",
                      "bowelCare",
                      yesNoOptions,
                      {
                        label:
                          "If yes, refer to Complex Bowel Care Plan and Monitoring Form and indicate what assistance is required with bowel care.",
                        inputName: "bowelCareOthers",
                      },
                      isFieldRequired("bowelCare")
                    )}
                    {renderDropdown(
                      "Menstrual Cycle Issues / Female Hygiene Help",
                      "menstrualIssues",
                      yesNoOptions,
                      {
                        label: "If yes, Please specify",
                        inputName: "menstrualIssuesOthers",
                      },
                      isFieldRequired("menstrualIssues")
                    )}
                    {renderDropdown("Has Epilepsy?", "epilepsy", yesNoOptions, {
                      label:
                        "If yes, ensure Participant's Doctor completes an Epilepsy Plan",
                      inputName: "epilepsyOthers",
                    }, isFieldRequired("epilepsy"))}
                    {renderDropdown(
                      "Is Asthmatic?",
                      "asthmatic",
                      yesNoOptions,
                      {
                        label:
                          "If yes, ensure Participant's Doctor completes an Asthma Plan",
                        inputName: "asthmaticOthers",
                      },
                      isFieldRequired("asthmatic")
                    )}
                    {renderDropdown(
                      "Has Allergies?",
                      "allergies",
                      yesNoOptions,
                      {
                        label:
                          "If yes, ensure to have an Allergy Plan from Participant's Doctor",
                        inputName: "allergiesOthers",
                      },
                      isFieldRequired("allergies")
                    )}
                    {renderDropdown(
                      "Is Anaphylactic?",
                      "anaphylactic",
                      yesNoOptions,
                      {
                        label:
                          "If yes, ensure to have an anaphylaxis Plan from the Participant's Doctor",
                        inputName: "anaphylacticOthers",
                      },
                      isFieldRequired("anaphylactic")
                    )}
                    {renderDropdown(
                      "Do you give permission for our company's staff to administer band-aids in cases of a minor injury?",
                      "minorInjury",
                      yesNoOptions,
                      undefined,
                      isFieldRequired("minorInjury")
                    )}
                    {renderDropdown(
                      "Requires Specific Training?",
                      "training",
                      yesNoOptions,
                      {
                        label:
                          "If yes, ensure to provide information such as implementing a positive behaviour support plan.",
                        inputName: "trainingOthers",
                      },
                      isFieldRequired("training")
                    )}
                  </div>
                </div>
              )}

              {/* Goals & Preferences Section */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    {renderDropdown(
                      "Other Relevant Medication Conditions?",
                      "othermedical",
                      yesNoOptions,
                      {
                        label: "If yes, please specify.",
                        inputName: "othermedicalOthers",
                      },
                      isFieldRequired("othermedical")
                    )}
                    {renderDropdown(
                      "Triggers for Community Activities?",
                      "trigger",
                      yesNoOptions,
                      {
                        label:
                          "If yes, please specify and complete the Risk assessment for participants.",
                        inputName: "triggerOthers",
                      },
                      isFieldRequired("trigger")
                    )}
                    {renderDropdown(
                      "Does the Participant show signs or a history of unexpectedly leaving (absconding)?",
                      "absconding",
                      yesNoOptions,
                      {
                        label: "If yes, please specify.",
                        inputName: "abscondingOthers",
                      },
                      isFieldRequired("absconding")
                    )}
                    {renderDropdown(
                      "Prone to Falls?",
                      "historyOfFalls",
                      yesNoOptions,
                      undefined,
                      isFieldRequired("historyOfFalls")
                    )}
                    {renderDropdown(
                      "Behaviours of Concern?",
                      "behaviourConcern",
                      yesNoOptions,
                      {
                        label: "If yes, please specify.",
                        inputName: "behaviourConcernOthers",
                      },
                      isFieldRequired("behaviourConcern")
                    )}
                    {renderDropdown(
                      "Positive Behaviour Plan In Place?",
                      "positiveBehaviour",
                      yesNoOptions,
                      {
                        label:
                          "If yes, refer to High Risk Participant Register.",
                        inputName: "positiveBehaviourOthers",
                      },
                      isFieldRequired("positiveBehaviour")
                    )}
                    {renderDropdown(
                      "Does the participant require communication assistance?",
                      "communicationAssistance",
                      yesNoOptions,
                      {
                        label:
                          "If yes, refer to the mode of communication reflected in Participant Risk Assessment and disaster management plan.",
                        inputName: "communicationAssistanceOthers",
                      },
                      isFieldRequired("communicationAssistance")
                    )}
                    {renderDropdown(
                      "Requires Physical Assistance?",
                      "physicalAssistance",
                      yesNoOptions,
                      {
                        label: "If yes, specify.",
                        inputName: "physicalAssistanceOthers",
                      },
                      isFieldRequired("physicalAssistance")
                    )}
                    {renderDropdown(
                      "Expressive Language Concerns?",
                      "languageConcern",
                      yesNoOptions,
                      {
                        label:
                          "If yes, refer to Participant Risk Assessment and disaster management plan under OH&S Assessments and Mode of Communication.",
                        inputName: "languageConcernOthers",
                      },
                      isFieldRequired("languageConcern")
                    )}
                    {renderDropdown(
                      "Personal Preferences & Personal Goals",
                      "personalGoals",
                      yesNoOptions,
                      {
                        label: "If yes, refer to form Support Plan",
                      },
                      isFieldRequired("personalGoals")
                    )}
                  </div>
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
                className={`w-4 h-4 rounded-full border-2 duration-200 ${index === currentStep ? "bg-blue-600 border-blue-600 shadow-lg" : index < currentStep ? "bg-green-500 border-green-500" : "bg-gray-200 border-gray-300"}`}
              />
            ))}
          </div>
          {/* Navigation Buttons - Stacked Vertically on Mobile, Horizontally on md+ */}
          <div className="flex flex-col w-full gap-3 md:flex-row md:gap-4 md:justify-between">
            <button
              type="button"
              onClick={handlePreviousSequential}
              disabled={currentStep === 0}
              className={`flex items-center justify-center space-x-2 px-8 py-3 rounded-full font-bold transition-all text-base shadow-md border-2 duration-200 w-full md:w-1/3 ${currentStep === 0 ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200" : "bg-gradient-to-r from-gray-700 to-gray-900 text-white border-gray-700 hover:from-gray-800 hover:to-black"}`}
            >
              <FaChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>
            <button
              type="button"
              onClick={handleNextSequential}
              disabled={currentStep === FORM_SECTIONS.length - 1 || !isCurrentSectionComplete()}
              className={`flex items-center justify-center space-x-2 px-8 py-3 rounded-full font-bold transition-all text-base shadow-md border-2 duration-200 w-full md:w-1/3 ${(currentStep === FORM_SECTIONS.length - 1 || !isCurrentSectionComplete()) ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200" : "bg-gradient-to-r from-indigo-600 to-green-400 text-white border-indigo-600 hover:from-indigo-700 hover:to-green-500"}`}
            >
              <span>Next</span>
              <FaChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleSave(false)}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-full font-bold text-base bg-gray-600 hover:bg-gray-700 text-white shadow-md border-2 border-gray-700 transition-all duration-200 w-full md:w-1/3 disabled:opacity-50"
            >
              <FaSave className="mr-2" /> Save Progress
            </button>
          </div>
          {/* Submit Button */}
          {currentStep === FORM_SECTIONS.length - 1 && (
            <button
              className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-3 rounded-full font-semibold text-base bg-gradient-to-r from-blue-600 to-green-400 text-white hover:from-blue-700 hover:to-green-500 shadow-xl transition"
              onClick={onSubmit}
            >
              <FaCheck className="w-5 h-5" />
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
    </div>
  );
};

export default ClientIntakeFormEnhanced;
