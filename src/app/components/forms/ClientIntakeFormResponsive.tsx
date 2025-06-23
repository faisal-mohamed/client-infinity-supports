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
  FaBars,
  FaTimes,
} from "react-icons/fa";

interface FormProps {
  formData: any;
  commonFieldsData: any;
  onChange: (values: any) => void;
  onSubmit?: (values: any) => void;
  readOnly?: boolean;
  fieldErrors?: Record<string, string>;
}
// Form sections configuration with mandatory fields
const FORM_SECTIONS = [
  {
    id: "personal",
    title: "Personal Information",
    icon: FaUser,
    description: "Basic personal details and identification",
    mandatoryFields: [
      "ndisNumber",
      "givenName",
      "dateOfBirth",
      "sex",
      "disabilityConditions",
      "addressNumberStreet"
    ],
  },
  {
    id: "contact",
    title: "Contact & Address",
    icon: FaHome,
    description: "Contact information and residential details",
    mandatoryFields: [
      "addressNumberStreet",
      "state",
      "postcode",
      "email",
      "homePhone",
      "livingArrangements",
      "travelArrangements",
      "mobile"
    ],
  },
  {
    id: "emergency",
    title: "Emergency Contacts",
    icon: FaPhone,
    description: "Primary and secondary emergency contacts",
    mandatoryFields: [
      "primaryContactName",
      "primaryContactRelationship",
      "primaryContactMobile",
    ],
  },
  {
    id: "medical",
    title: "Medical Information",
    icon: FaUserMd,
    description: "Medical conditions and healthcare providers",
    mandatoryFields: ["medicalCentreName", "barriers"],
  },
  {
    id: "support",
    title: "Support Services",
    icon: FaShieldAlt,
    description: "Support coordinators and advocacy services",
    mandatoryFields: ["supportCoordinatorName", "supportCoordinatorEmail"],
  },
  {
    id: "health",
    title: "Health & Safety",
    icon: FaHeart,
    description: "Health conditions and safety considerations",
    mandatoryFields: ["medicationChart", "mealtimeManagement", "minorInjury"],
  },
  {
    id: "goals",
    title: "Goals & Preferences",
    icon: FaBullseye,
    description: "Personal goals and preferences",
    mandatoryFields: ["personalGoals", "behaviourConcern"],
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
  "Other, please specify",
];

const ClientIntakeFormResponsive: React.FC<FormProps> = ({
  formData,
  commonFieldsData,
  onChange,
  onSubmit,
  readOnly = false,
  fieldErrors = {},
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      // Only mark as completed if all mandatory fields are filled
      if (isSectionComplete(currentStep)) {
        setCompletedSteps((prev) => new Set([...prev, currentStep]));
      }
      setCurrentStep(currentStep + 1);
      setSidebarOpen(false); // Close sidebar on mobile after navigation
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setSidebarOpen(false); // Close sidebar on mobile after navigation
    }
  };

  const handleStepClick = (stepIndex: number) => {
    // Only allow navigation to:
    // 1. Previous completed sections
    // 2. Current section
    // 3. Next section if current section is complete
    if (
      stepIndex <= currentStep ||
      (stepIndex === currentStep + 1 && isSectionComplete(currentStep))
    ) {
      setCurrentStep(stepIndex);
      setSidebarOpen(false);
    }
  };

  const isSectionComplete = (stepIndex: number) => {
    const section = FORM_SECTIONS[stepIndex];
    if (!section.mandatoryFields) return true;

    return section.mandatoryFields.every((fieldName) => {
      const value = localValues[fieldName];
      if (Array.isArray(value)) {
        return value.length > 0; // For arrays (like livingArrangements), check if at least one item is selected
      }
      return value && value.toString().trim() !== ""; // For strings, check if not empty
    });
  };

  const isStepCompleted = (stepIndex: number) => {
    return completedSteps.has(stepIndex);
  };

  const isSectionAccessible = (stepIndex: number) => {
    // Section 0 is always accessible
    if (stepIndex === 0) return true;

    // Current section is always accessible
    if (stepIndex === currentStep) return true;

    // Previous sections are accessible if they were completed
    if (stepIndex < currentStep) return true;

    // Next section is only accessible if current section is complete
    if (stepIndex === currentStep + 1) {
      return isSectionComplete(currentStep);
    }

    // All other sections are locked
    return false;
  };

  const getHighestAccessibleSection = () => {
    for (let i = 0; i < FORM_SECTIONS.length; i++) {
      if (!isSectionComplete(i)) {
        return i;
      }
    }
    return FORM_SECTIONS.length - 1; // All sections complete
  };

  const getProgressPercentage = () => {
    let completedSections = 0;

    // Count actually completed sections based on mandatory fields
    for (let i = 0; i < FORM_SECTIONS.length; i++) {
      if (isSectionComplete(i)) {
        completedSections++;
      }
    }

    return (completedSections / FORM_SECTIONS.length) * 100;
  };

  const canProceedToNext = () => {
    return isSectionComplete(currentStep);
  };

  // Helper function to check if a field is mandatory in current section
  const isMandatoryField = (fieldName: string) => {
    const currentSection = FORM_SECTIONS[currentStep];
    return currentSection.mandatoryFields?.includes(fieldName) || false;
  };

  // Responsive input rendering utilities with mandatory field indicators
  const renderInput = (
    label: string,
    name: string,
    type: string = "text",
    placeholder?: string
  ) => (
    <div className="flex flex-col space-y-2 lg:space-y-3">
      <label className="block text-sm lg:text-base font-semibold text-gray-700 mb-1">
        {label}
        {isMandatoryField(name) && (
          <span className="text-red-500 ml-1" title="Required field">
            *
          </span>
        )}
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
        className={`w-full px-3 py-3 lg:px-4 lg:py-4 xl:px-4 xl:py-3 text-sm lg:text-base border-2 rounded-lg transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          fieldErrors[name]
            ? "border-red-300 bg-red-50"
            : isMandatoryField(name) &&
              (!localValues[name] || localValues[name].toString().trim() === "")
            ? "border-orange-300 bg-orange-50"
            : "border-gray-200 hover:border-gray-300 focus:border-blue-500"
        } ${readOnly ? "bg-gray-50" : "bg-white"}`}
      />
      {fieldErrors[name] && (
        <p className="text-xs lg:text-sm text-red-600 flex items-center space-x-1 mt-1">
          <span>⚠️</span>
          <span>{fieldErrors[name]}</span>
        </p>
      )}
      {isMandatoryField(name) &&
        (!localValues[name] || localValues[name].toString().trim() === "") &&
        !fieldErrors[name] && (
          <p className="text-xs lg:text-sm text-orange-600 flex items-center space-x-1 mt-1">
            <span>📝</span>
            <span>This field is required</span>
          </p>
        )}
    </div>
  );

  const renderTextArea = (
    label: string,
    name: string,
    rows: number = 3,
    placeholder?: string
  ) => (
    <div className="flex flex-col space-y-2 lg:space-y-3">
      <label className="block text-sm lg:text-base font-semibold text-gray-700 mb-1">
        {label}
        {isMandatoryField(name) && (
          <span className="text-red-500 ml-1" title="Required field">
            *
          </span>
        )}
      </label>
      <textarea
        name={name}
        value={localValues[name] || ""}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        disabled={readOnly}
        className={`w-full px-3 py-3 lg:px-4 lg:py-4 xl:px-4 xl:py-3 text-sm lg:text-base border-2 rounded-lg transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
          fieldErrors[name]
            ? "border-red-300 bg-red-50"
            : isMandatoryField(name) &&
              (!localValues[name] || localValues[name].toString().trim() === "")
            ? "border-orange-300 bg-orange-50"
            : "border-gray-200 hover:border-gray-300 focus:border-blue-500"
        } ${readOnly ? "bg-gray-50" : "bg-white"}`}
      />
      {fieldErrors[name] && (
        <p className="text-xs lg:text-sm text-red-600 flex items-center space-x-1 mt-1">
          <span>⚠️</span>
          <span>{fieldErrors[name]}</span>
        </p>
      )}
      {isMandatoryField(name) &&
        (!localValues[name] || localValues[name].toString().trim() === "") &&
        !fieldErrors[name] && (
          <p className="text-xs lg:text-sm text-orange-600 flex items-center space-x-1 mt-1">
            <span>📝</span>
            <span>This field is required</span>
          </p>
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
    }
  ) => (
    <div className="flex flex-col space-y-3 lg:space-y-4">
      <div className="flex flex-col space-y-2 lg:space-y-3">
        <label className="block text-sm lg:text-base font-semibold text-gray-700 mb-1">
          {label}
          {isMandatoryField(name) && (
            <span className="text-red-500 ml-1" title="Required field">
              *
            </span>
          )}
        </label>
        <select
          name={name}
          value={localValues[name] || ""}
          onChange={handleChange}
          disabled={readOnly}
          className={`w-full px-3 py-3 lg:px-4 lg:py-4 xl:px-4 xl:py-3 text-sm lg:text-base border-2 rounded-lg transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            fieldErrors[name]
              ? "border-red-300 bg-red-50"
              : isMandatoryField(name) &&
                (!localValues[name] ||
                  localValues[name].toString().trim() === "")
              ? "border-orange-300 bg-orange-50"
              : "border-gray-200 hover:border-gray-300 focus:border-blue-500"
          } ${readOnly ? "bg-gray-50" : "bg-white"}`}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {fieldErrors[name] && (
          <p className="text-xs lg:text-sm text-red-600 flex items-center space-x-1 mt-1">
            <span>⚠️</span>
            <span>{fieldErrors[name]}</span>
          </p>
        )}
        {isMandatoryField(name) &&
          (!localValues[name] || localValues[name].toString().trim() === "") &&
          !fieldErrors[name] && (
            <p className="text-xs lg:text-sm text-orange-600 flex items-center space-x-1 mt-1">
              <span>📝</span>
              <span>This field is required</span>
            </p>
          )}
      </div>

      {showIfYes && localValues[name] === "Yes" && (
        <div className="ml-2 lg:ml-4 p-3 lg:p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
          <label className="block text-sm lg:text-base font-semibold text-blue-800 mb-2">
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
                className={`w-full px-3 py-2 text-sm lg:text-base border rounded-lg ${
                  fieldErrors[showIfYes.inputName]
                    ? "border-red-300 bg-red-50"
                    : "border-blue-200 focus:border-blue-500"
                }`}
              />
              {fieldErrors[showIfYes.inputName] && (
                <p className="mt-1 text-xs lg:text-sm text-red-600">
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
    otherFieldName?: string
  ) => (
    <div className="space-y-3 lg:space-y-4">
      <label
        className={`block text-sm lg:text-base font-semibold ${
          fieldErrors[name] ? "text-red-600" : "text-gray-700"
        }`}
      >
        {label}
        {isMandatoryField(name) && (
          <span className="text-red-500 ml-1" title="Required field">
            *
          </span>
        )}
      </label>
      <div className="space-y-3">
        {options.map((option) => {
          const isOtherOption = option.toLowerCase().includes("other");
          const isSelected =
            Array.isArray(localValues[name]) &&
            localValues[name].includes(option);

          return (
            <div key={option} className="space-y-2">
              <label className="flex items-start space-x-3 p-3 lg:p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  value={option}
                  checked={isSelected}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setLocalValues((prev: any) => {
                      const current = Array.isArray(prev[name])
                        ? prev[name]
                        : [];
                      const newValue = checked
                        ? [...current, option]
                        : current.filter((val: string) => val !== option);

                      // If unchecking "Other" option, clear the other field
                      if (!checked && isOtherOption && otherFieldName) {
                        return {
                          ...prev,
                          [name]: newValue,
                          [otherFieldName]: "",
                        };
                      }

                      return {
                        ...prev,
                        [name]: newValue,
                      };
                    });
                  }}
                  className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded flex-shrink-0"
                />
                <span className="text-sm lg:text-base text-gray-700 flex-1 leading-relaxed">
                  {option}
                </span>
              </label>

              {/* Dynamic input field for "Other" options */}
              {isOtherOption && isSelected && otherFieldName && (
                <div className="ml-7 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Please specify:
                  </label>
                  <input
                    type="text"
                    name={otherFieldName}
                    value={localValues[otherFieldName] || ""}
                    onChange={handleChange}
                    placeholder="Enter details..."
                    disabled={readOnly}
                    className={`w-full px-3 py-2 text-sm lg:text-base border rounded-lg transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      fieldErrors[otherFieldName]
                        ? "border-red-300 bg-red-50"
                        : "border-blue-200 focus:border-blue-500 bg-white"
                    }`}
                  />
                  {fieldErrors[otherFieldName] && (
                    <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                      <span>⚠️</span>
                      <span>{fieldErrors[otherFieldName]}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {fieldErrors[name] && (
        <p className="text-xs lg:text-sm text-red-600 flex items-center space-x-1 mt-2">
          <span>⚠️</span>
          <span>{fieldErrors[name]}</span>
        </p>
      )}
      {isMandatoryField(name) &&
        (!Array.isArray(localValues[name]) || localValues[name].length === 0) &&
        !fieldErrors[name] && (
          <p className="text-xs lg:text-sm text-orange-600 flex items-center space-x-1 mt-2">
            <span>📝</span>
            <span>Please select at least one option</span>
          </p>
        )}
    </div>
  );

  const StepIcon = ({
    icon,
    active,
    completed,
  }: {
    icon: React.ReactNode;
    active: boolean;
    completed: boolean;
  }) => (
    <div
      className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-300 shadow-md ${
        completed
          ? "bg-gradient-to-br from-blue-600 to-green-400 border-green-400 text-white"
          : active
          ? "bg-white border-blue-600 text-blue-600"
          : "bg-gray-100 border-gray-200 text-gray-400"
      }`}
    >
      {completed ? <FaCheck className="w-5 h-5" /> : icon}
    </div>
  );

  const StepConnector = ({ completed }: { completed: boolean }) => (
    <div
      className={`flex-1 h-1 transition-all duration-300 rounded-full mx-1 ${
        completed ? "bg-gradient-to-r from-blue-500 to-green-400" : "bg-gray-200"
      }`}
    />
  );

  const ModernProgressBar = ({ currentStep }: { currentStep: number }) => (
    <div className="w-full flex items-center justify-between py-6 px-2 md:px-6">
      {FORM_SECTIONS.map((section, idx) => {
        const active = idx === currentStep;
        const completed = idx < currentStep;
        return (
          <React.Fragment key={section.id}>
            <div className="flex flex-col items-center min-w-[60px]">
              <StepIcon
                icon={React.createElement(section.icon, { className: "w-5 h-5" })}
                active={active}
                completed={completed}
              />
              <span
                className={`mt-2 text-xs font-medium transition-colors ${
                  active
                    ? "text-blue-700"
                    : completed
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                {section.title.split(" ")[0]}
              </span>
            </div>
            {idx < FORM_SECTIONS.length - 1 && (
              <StepConnector completed={completed} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  const SectionCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 px-6 py-8 md:px-12 md:py-10 flex flex-col gap-8 transition-all duration-300">
      {children}
    </div>
  );

  const SectionDivider = () => (
    <div className="border-t border-dashed border-gray-200 my-8" />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center py-4 px-1">
      {/* Header & Progress Bar */}
      <div className="w-full max-w-xl mx-auto mb-6 px-2 sm:px-4 md:px-0">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-2xl font-extrabold text-blue-800 tracking-tight leading-tight">
              Client Intake Form
            </h1>
            <p className="text-sm text-blue-400 font-medium mt-0.5">
              Step {currentStep + 1} of {FORM_SECTIONS.length}
            </p>
          </div>
          <button
            className="md:hidden p-2 rounded-lg text-blue-600 hover:bg-blue-100 transition"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Open navigation"
          >
            {sidebarOpen ? (
              <FaTimes className="w-6 h-6" />
            ) : (
              <FaBars className="w-6 h-6" />
            )}
          </button>
        </div>
        <ModernProgressBar currentStep={currentStep} />
      </div>

      {/* Main Form Card */}
      <div className="w-full max-w-xl mx-auto">
        <SectionCard>
          {/* Section Header */}
          <div className="flex items-center gap-4 mb-1">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 text-blue-600 text-2xl shadow-lg">
              {React.createElement(FORM_SECTIONS[currentStep].icon)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight mb-0.5">
                {FORM_SECTIONS[currentStep].title}
              </h2>
              <p className="text-gray-500 text-sm font-medium">
                {FORM_SECTIONS[currentStep].description}
              </p>
            </div>
          </div>
          {/* Section Progress */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  isSectionComplete(currentStep)
                    ? "bg-gradient-to-r from-green-400 to-blue-500"
                    : "bg-blue-400"
                }`}
                style={{
                  width: `${
                    FORM_SECTIONS[currentStep].mandatoryFields
                      ? (FORM_SECTIONS[currentStep].mandatoryFields.filter((field) => {
                          const value = localValues[field];
                          if (Array.isArray(value)) return value.length > 0;
                          return value && value.toString().trim() !== "";
                        }).length /
                        FORM_SECTIONS[currentStep].mandatoryFields.length) *
                        100
                      : 100
                  }%`,
                }}
              />
            </div>
            <span className="text-xs text-gray-500 min-w-fit font-semibold">
              {FORM_SECTIONS[currentStep].mandatoryFields
                ? `${FORM_SECTIONS[currentStep].mandatoryFields.filter(
                    (field) => {
                      const value = localValues[field];
                      if (Array.isArray(value)) return value.length > 0;
                      return value && value.toString().trim() !== "";
                    }
                  ).length} / ${FORM_SECTIONS[currentStep].mandatoryFields.length} required`
                : "No required fields"}
            </span>
          </div>
          <SectionDivider />
          {/* Section Content */}
          <div className="space-y-8">
            {/* Personal Information Section */}
            {currentStep === 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
                <div>{renderInput("NDIS Number", "ndisNumber", "text", "Enter your NDIS number")}</div>
                <div>{renderInput("Given Name", "givenName", "text", "Enter your first name")}</div>
                <div>{renderInput("Surname", "surname", "text", "Enter your last name")}</div>
                <div>{renderInput("Preferred Name", "preferredName", "text", "How would you like to be called?")}</div>
                <div>{renderInput("Date of Birth", "dateOfBirth", "date")}</div>
                <div>{renderDropdown("Sex", "sex", ["Male", "Female", "Other"])}</div>
                <div>{renderInput("Pronoun", "pronoun", "text", "e.g., he/him, she/her, they/them")}</div>
                <div>{renderDropdown("Aboriginal or Torres Strait Islander?", "aboriginalTorres", yesNoOptions)}</div>
                <div className="sm:col-span-2">{renderTextArea("Disability Conditions/Disability type(s)", "disabilityConditions", 3, "Please describe your disability conditions or types")}</div>
              </div>
            )}

            {/* Contact & Address Section */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
                <div>{renderInput("Address (Number/Street)", "addressNumberStreet", "text", "Enter your street address")}</div>
                <div>{renderInput("State", "state", "text", "Enter your state")}</div>
                <div>{renderInput("Postcode", "postcode", "text", "Enter your postcode")}</div>
                <div>{renderInput("Email", "email", "email", "Enter your email address")}</div>
                <div>{renderInput("Home Phone", "homePhone", "tel", "Enter your home phone number")}</div>
                <div>{renderInput("Mobile", "mobile", "tel", "Enter your mobile number")}</div>
                <div>{renderInput("Language", "language", "text", "Primary language spoken")}</div>
                <div>{renderDropdown("Interpreter Needed?", "interpreter", yesNoOptions)}</div>
                <div>{renderInput("Country of Birth", "countryOfBirth", "text", "Enter your country of birth")}</div>

                <div className="sm:col-span-2 bg-gray-50 p-4 rounded-lg space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    Living & Travel Arrangements
                  </h4>
                  {renderMultiSelectCheckbox(
                    "Living Arrangements",
                    "livingArrangements",
                    livingArrangementsOptions,
                    "livingArrangementsOther"
                  )}
                  {renderMultiSelectCheckbox(
                    "Travel Arrangements",
                    "travelArrangements",
                    travelArrangementsOptions,
                    "travelArrangementsOther"
                  )}
                </div>
              </div>
            )}

            {/* Emergency Contacts Section */}
            {currentStep === 2 && (
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-blue-50 p-4 lg:p-6 rounded-xl border border-blue-200">
                  <h3 className="text-lg lg:text-xl font-semibold text-blue-800 mb-4">
                    Primary Contact
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {renderInput(
                      "Name",
                      "primaryContactName",
                      "text",
                      "Primary contact's full name"
                    )}
                    {renderInput(
                      "Relationship",
                      "primaryContactRelationship",
                      "text",
                      "Relationship to you"
                    )}
                    {renderInput(
                      "Home Phone",
                      "primaryContactHomePhone",
                      "tel",
                      "Home phone number"
                    )}
                    {renderInput(
                      "Mobile",
                      "primaryContactMobile",
                      "tel",
                      "Mobile phone number"
                    )}
                  </div>
                </div>

                <div className="bg-green-50 p-4 lg:p-6 rounded-xl border border-green-200">
                  <h3 className="text-lg lg:text-xl font-semibold text-green-800 mb-4">
                    Secondary Contact
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {renderInput(
                      "Name",
                      "secondaryContactName",
                      "text",
                      "Secondary contact's full name"
                    )}
                    {renderInput(
                      "Relationship",
                      "secondaryContactRelationship",
                      "text",
                      "Relationship to you"
                    )}
                    {renderInput(
                      "Home Phone",
                      "secondaryContactHomePhone",
                      "tel",
                      "Home phone number"
                    )}
                    {renderInput(
                      "Mobile",
                      "secondaryContactMobile",
                      "tel",
                      "Mobile phone number"
                    )}
                  </div>
                </div>

                <div className="bg-purple-50 p-4 lg:p-6 rounded-xl border border-purple-200">
                  <h3 className="text-lg lg:text-xl font-semibold text-purple-800 mb-4">
                    Advocate Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {renderInput(
                      "Advocate Name",
                      "advocateName",
                      "text",
                      "Advocate's full name"
                    )}
                    {renderInput(
                      "Advocate Email",
                      "advocateEmail",
                      "email",
                      "Advocate's email"
                    )}
                    {renderInput(
                      "Advocate Phone",
                      "advocatePhone",
                      "tel",
                      "Advocate's phone"
                    )}
                    {renderInput(
                      "Advocate Mobile",
                      "advocateMobile",
                      "tel",
                      "Advocate's mobile"
                    )}
                    {renderInput(
                      "Relationship with Participant",
                      "advocateRelationship",
                      "text",
                      "Relationship to you"
                    )}
                    {renderInput(
                      "Advocate Address",
                      "advocateAddress",
                      "text",
                      "Advocate's address"
                    )}
                    {renderTextArea(
                      "Additional Information",
                      "advocateOtherInfo",
                      4,
                      "Any additional information about your advocate"
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Medical Information Section */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="bg-red-50 p-4 lg:p-6 rounded-xl border border-red-200">
                  <h3 className="text-lg lg:text-xl font-semibold text-red-800 mb-4">
                    Medical Centre Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {renderInput(
                      "Medical Centre Name",
                      "medicalCentreName",
                      "text",
                      "Name of your medical centre"
                    )}
                    {renderInput(
                      "Medical Centre Phone",
                      "medicalPhone",
                      "tel",
                      "Medical centre phone number"
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderDropdown(
                    "Cultural, Communication Barriers or Intimacy Issues",
                    "barriers",
                    yesNoOptions
                  )}
                  {renderInput(
                    "Cultural Values",
                    "culturalValues",
                    "text",
                    "Important cultural values"
                  )}
                  {renderInput(
                    "Cultural Behaviours",
                    "culturalBehaviours",
                    "text",
                    "Important cultural behaviours"
                  )}
                  {renderInput(
                    "Written Communication / Literacy",
                    "writtenCommunication",
                    "text",
                    "Communication preferences"
                  )}
                </div>
              </div>
            )}

            {/* Support Services Section */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <div className="bg-indigo-50 p-4 lg:p-6 rounded-xl border border-indigo-200">
                  <h3 className="text-lg lg:text-xl font-semibold text-indigo-800 mb-4">
                    Support Coordinator
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {renderInput(
                      "Support Coordinator Name",
                      "supportCoordinatorName",
                      "text",
                      "Coordinator's name"
                    )}
                    {renderInput(
                      "Support Coordinator Email",
                      "supportCoordinatorEmail",
                      "email",
                      "Coordinator's email"
                    )}
                    {renderInput(
                      "Support Coordinator Company",
                      "supportCoordinatorCompany",
                      "text",
                      "Company name"
                    )}
                    {renderInput(
                      "Support Coordinator Contact",
                      "supportCoordinatorContact",
                      "tel",
                      "Contact number"
                    )}
                  </div>
                </div>
                {renderTextArea(
                  "Other Supports",
                  "otherSupports",
                  5,
                  "Describe any other support services you receive"
                )}
              </div>
            )}

            {/* Health & Safety Section */}
            {currentStep === 5 && (
              <div className="grid grid-cols-1 gap-6">
                {renderDropdown(
                  "Requires Medication Chart?",
                  "medicationChart",
                  yesNoOptions,
                  {
                    label:
                      "If yes, is this medication taken on a regular basis and for what purpose, ensure to complete Medication Chart and Participant risk assessment",
                    inputName: "medicationChartOthers",
                  }
                )}
                {renderDropdown(
                  "Requires Mealtime Management?",
                  "mealtimeManagement",
                  yesNoOptions,
                  {
                    label:
                      "If yes, refer to Mealtime Management Plan Form",
                  }
                )}
                {renderDropdown(
                  "Requires Bowel Care Management?",
                  "bowelCare",
                  yesNoOptions,
                  {
                    label:
                      "If yes, refer to Complex Bowel Care Plan and Monitoring Form and indicate what assistance is required with bowel care.",
                    inputName: "bowelCareOthers",
                  }
                )}
                {renderDropdown(
                  "Menstrual Cycle Issues / Female Hygiene Help",
                  "menstrualIssues",
                  yesNoOptions,
                  {
                    label: "If yes, Please specify",
                    inputName: "menstrualIssuesOthers",
                  }
                )}
                {renderDropdown(
                  "Has Epilepsy?",
                  "epilepsy",
                  yesNoOptions,
                  {
                    label:
                      "If yes, ensure Participant's Doctor completes an Epilepsy Plan",
                    inputName: "epilepsyOthers",
                  }
                )}
                {renderDropdown(
                  "Is Asthmatic?",
                  "asthmatic",
                  yesNoOptions,
                  {
                    label:
                      "If yes, ensure Participant's Doctor completes an Asthma Plan",
                    inputName: "asthmaticOthers",
                  }
                )}
                {renderDropdown(
                  "Has Allergies?",
                  "allergies",
                  yesNoOptions,
                  {
                    label:
                      "If yes, ensure to have an Allergy Plan from Participant's Doctor",
                    inputName: "allergiesOthers",
                  }
                )}
                {renderDropdown(
                  "Is Anaphylactic?",
                  "anaphylactic",
                  yesNoOptions,
                  {
                    label:
                      "If yes, ensure to have an anaphylaxis Plan from the Participant's Doctor",
                    inputName: "anaphylacticOthers",
                  }
                )}
                {renderDropdown(
                  "Do you give permission for our company's staff to administer band-aids in cases of a minor injury?",
                  "minorInjury",
                  yesNoOptions
                )}
                {renderDropdown(
                  "Requires Specific Training?",
                  "training",
                  yesNoOptions,
                  {
                    label:
                      "If yes, ensure to provide information such as implementing a positive behaviour support plan.",
                    inputName: "trainingOthers",
                  }
                )}
              </div>
            )}

            {/* Goals & Preferences Section */}
            {currentStep === 6 && (
              <div className="grid grid-cols-1 gap-6">
                {renderDropdown(
                  "Other Relevant Medication Conditions?",
                  "othermedical",
                  yesNoOptions,
                  {
                    label: "If yes, please specify.",
                    inputName: "othermedicalOthers",
                  }
                )}
                {renderDropdown(
                  "Triggers for Community Activities?",
                  "trigger",
                  yesNoOptions,
                  {
                    label:
                      "If yes, please specify and complete the Risk assessment for participants.",
                    inputName: "triggerOthers",
                  }
                )}
                {renderDropdown(
                  "Does the Participant show signs or a history of unexpectedly leaving (absconding)?",
                  "absconding",
                  yesNoOptions,
                  {
                    label: "If yes, please specify.",
                    inputName: "abscondingOthers",
                  }
                )}
                {renderDropdown(
                  "Prone to Falls?",
                  "historyOfFalls",
                  yesNoOptions
                )}
                {renderDropdown(
                  "Behaviours of Concern?",
                  "behaviourConcern",
                  yesNoOptions,
                  {
                    label: "If yes, please specify.",
                    inputName: "behaviourConcernOthers",
                  }
                )}
                {renderDropdown(
                  "Positive Behaviour Plan In Place?",
                  "positiveBehaviour",
                  yesNoOptions,
                  {
                    label:
                      "If yes, refer to High Risk Participant Register.",
                    inputName: "positiveBehaviourOthers",
                  }
                )}
                {renderDropdown(
                  "Does the participant require communication assistance?",
                  "communicationAssistance",
                  yesNoOptions,
                  {
                    label:
                      "If yes, refer to the mode of communication reflected in Participant Risk Assessment and disaster management plan.",
                    inputName: "communicationAssistanceOthers",
                  }
                )}
                {renderDropdown(
                  "Requires Physical Assistance?",
                  "physicalAssistance",
                  yesNoOptions,
                  {
                    label: "If yes, specify.",
                    inputName: "physicalAssistanceOthers",
                  }
                )}
                {renderDropdown(
                  "Expressive Language Concerns?",
                  "languageConcern",
                  yesNoOptions,
                  {
                    label:
                      "If yes, refer to Participant Risk Assessment and disaster management plan under OH&S Assessments and Mode of Communication.",
                    inputName: "languageConcernOthers",
                  }
                )}
                {renderDropdown(
                  "Personal Preferences & Personal Goals",
                  "personalGoals",
                  yesNoOptions,
                  {
                    label: "If yes, refer to form Support Plan",
                  }
                )}
              </div>
            )}
          </div>
          <SectionDivider />
          {/* Navigation */}
          <div className="flex flex-col sm:flex-row sm:justify-between items-stretch gap-3 mt-2">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-semibold text-base transition
                ${
                  currentStep === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                }`}
            >
              <FaChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={
                currentStep === FORM_SECTIONS.length - 1 || !canProceedToNext()
              }
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-semibold text-base transition
                ${
                  currentStep === FORM_SECTIONS.length - 1 || !canProceedToNext()
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                }`}
              title={!canProceedToNext() ? "Please complete all required fields" : ""}
            >
              Next
              <FaChevronRight className="w-4 h-4" />
            </button>
          </div>
          {/* Submit Button */}
          {currentStep === FORM_SECTIONS.length - 1 && (
            <button
              className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-semibold text-base bg-gradient-to-r from-blue-600 to-green-400 text-white hover:from-blue-700 hover:to-green-500 shadow-xl transition"
              onClick={onSubmit}
            >
              <FaCheck className="w-5 h-5" />
              Submit
            </button>
          )}
        </SectionCard>
      </div>
    </div>
  );
};

export default ClientIntakeFormResponsive;
