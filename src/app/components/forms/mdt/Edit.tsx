"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FaUser,
  FaHome,
  FaHeart,
  FaBullseye,
  FaUsers,
  FaChevronLeft,
  FaChevronRight,
  FaCheck,
  FaSave,
  FaCalendarAlt,
  FaComments,
  FaSpinner,
  FaClipboardCheck,
} from "react-icons/fa";
import { useToast } from "@/components/ui/Toast";

interface FormProps {
  formData: any;
  commonFieldsData: any;
  onChange: (values: any, field?: string, isCommon?: boolean) => void;
  onSubmit?: (values: any) => void;
  readOnly?: boolean;
  fieldErrors?: Record<string, string>;
  handleSave: (submit: boolean) => void;
  handleSaveProgress?: () => Promise<void>;
  handleSubmitForm?: () => Promise<void>;
  saving?: boolean;
  onCommonFieldsUpdated?: () => void;
}

export const FORM_SECTIONS : any = [
  {
    id: "meetingDetails",
    title: "1. Meeting Details",
    fields: ["clientName", "date", "inAttendance", "apologies"],
    icon: FaCalendarAlt,
    requiredFields: ["clientName", "date"]
  },
  {
    id: "discussion",
    title: "2. Discussion Points",
    fields: ["introduction", "physiotherapy", "ot", "speech", "pbs", "serviceDelivery", "family"],
    icon: FaComments,
    requiredFields: []
  },
  {
    id: "summary",
    title: "3. Summary & Recommendations",
    fields: ["recommendations", "nextMeetingNote"],
    icon: FaClipboardCheck,
    requiredFields: []
  }
];


const commonFieldsMapping: Record<string, string> = {
  clientName: "name",
  ndisNumber: "ndis",
  dob: "dob", 
  address: "street",
  disability: "disability",
};

// Helper function to check if a field is a common field
const isCommonField = (fieldName: string): boolean => {
  return Object.keys(commonFieldsMapping).includes(fieldName);
};

const yesNoOptions = ["Yes", "No"];
const outcomeRatingOptions = ["New Goal", "Partly achieved", "Completely achieved", "Not Achieved", "Withdrawn"];

const MDTEdit: React.FC<FormProps> = ({
  formData,
  commonFieldsData,
  onChange,
  onSubmit,
  readOnly = false,
  fieldErrors = {},
  handleSave,
  handleSaveProgress,
  handleSubmitForm,
  saving = false,
  onCommonFieldsUpdated,
}: any) => {

  // Helper function to get common field value
  const getCommonFieldValue = (fieldName: string): string => {
    const commonKey = commonFieldsMapping[fieldName];
    return commonFieldsData?.[commonKey] || '';
  };

  useEffect(() => {
    console.log("Common fields data updated:", commonFieldsData);
  }, [commonFieldsData]);

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [maxStep, setMaxStep] = useState(0);

   const initialValues = {
  clientName: "",
  date: "",
  inAttendance: "",
  apologies: "",
  introduction: "",
  physiotherapy: "",
  ot: "",
  speech: "",
  pbs: "",
  serviceDelivery: "",
  family: "",
  recommendations: "",
  nextMeetingNote: "",


  ...formData,
};


  // Initialize local values with form data
  const [localValues, setLocalValues] = useState<any>(initialValues);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { showToast } = useToast();

  // Loading states
  const [submitting, setSubmitting] = useState(false);
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [navigatingNext, setNavigatingNext] = useState(false);
  // Note: 'saving' state comes from parent component via props

  // Track pending changes to common fields
  const [pendingCommonFieldChanges, setPendingCommonFieldChanges] = useState<Record<string, any>>({});

  // Track changes to common fields
  const trackCommonFieldChange = (name: string, value: any) => {
    return;
  };

  // Update display when commonFieldsData changes
  useEffect(() => {
    if (!commonFieldsData) return;
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
      setMaxStep(Math.max(maxStep, currentStep + 1));
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= maxStep) {
      setCurrentStep(stepIndex);
    }
  };

  const isStepCompleted = (stepIndex: number) => {
    return completedSteps.has(stepIndex);
  };

  const getProgressPercentage = () => {
    return ((currentStep + 1) / FORM_SECTIONS.length) * 100;
  };

  const isCurrentSectionComplete = () => {
    const required = FORM_SECTIONS[currentStep].requiredFields || [];
    return required.every((key : any ) => {
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

  const handleNextSequential = async () => {
    // Validate current section before moving
    if (!isCurrentSectionComplete()) {
      showToast({
        type: "error",
        title: "Incomplete Section",
        message: "Please complete all required fields in this section before continuing."
      });
      return;
    }
    
    setNavigatingNext(true);
    try {
      // Save progress before moving to next section
      if (handleSaveProgress) {
        await handleSaveProgress();
      }
      handleNext();
    } finally {
      setNavigatingNext(false);
    }
  };

  const handlePreviousSequential = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // --- Input rendering utilities ---
  const renderInput = (
    label: string,
    name: string,
    type: string = "text",
    placeholder?: string,
    required?: boolean
  ) => {
    const isCommon = isCommonField(name);
    const displayValue = isCommon ? getCommonFieldValue(name) : (localValues[name] || "");
    const isFieldReadOnly = readOnly || isCommon;
    
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-700 mb-1">
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
          className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder-gray-400 ${
            fieldErrors[name]
              ? "border-red-300 bg-red-50"
              : isCommon 
                ? "bg-blue-50 border-blue-200 text-blue-800"
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
        <label className="text-xs font-medium text-gray-700 mb-1">
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
          className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder-gray-400 resize-none ${
            fieldErrors[name]
              ? "border-red-300 bg-red-50"
              : isCommon 
                ? "bg-blue-50 border-blue-200 text-blue-800"
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
        aria-label={label}
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
    </div>
  );

  // Helper to check if a field is required in the current section
  const isFieldRequired = (fieldName: string) => {
    return FORM_SECTIONS[currentStep].requiredFields?.includes(fieldName);
  };

  // Field metadata for dynamic rendering
   const FIELD_METADATA : any = {
  clientName: { label: "Client Name", type: "text" },
  date: { label: "Date", type: "date" },
  inAttendance: { label: "In Attendance", type: "textarea" },
  apologies: { label: "Apologies", type: "textarea" },
  introduction: { label: "Introduction", type: "textarea" },
  physiotherapy: { label: "Physiotherapy", type: "textarea" },
  ot: { label: "OT", type: "textarea" },
  speech: { label: "Speech", type: "textarea" },
  pbs: { label: "PBS", type: "textarea" },
  serviceDelivery: { label: "Service Delivery", type: "textarea" },
  family: { label: "Family", type: "textarea" },
  recommendations: { label: "Recommendations", type: "textarea" },
  nextMeetingNote: { label: "I will schedule next meeting on ", type: "date" }
};


  // Validation function to check if all required fields are filled
  const validateRequiredFields = () => {
    const missingFields: string[] = [];
    
    FORM_SECTIONS.forEach((section : any ) => {
      section.requiredFields.forEach((fieldName : any ) => {
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
      console.log("form submitted"
      )
      setSubmitting(true);
      const validationResult = validateRequiredFields();

      if (validationResult.isValid) {
        if (handleSubmitForm) {
          await handleSubmitForm();
        }
      } else {
        showToast({
          type: 'error',
          title: "Missing Required Fields",
          message: validationResult.missingFields.join(', ')
        });
      }
    } catch (error) {
      console.error("Validation or save failed:", error);
      showToast({
        type: 'error',
        title: "Error",
        message: "Something went wrong during validation or saving."
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="">
      {/* Progress Bar */}
      <div className="w-full max-w-2xl mx-auto pt-2 md:pt-6 px-2">
        <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
          <div className="h-2 bg-gradient-to-r from-indigo-500 to-green-400 rounded-full transition-all" style={{ width: `${getProgressPercentage()}%` }} />
        </div>
        {/* Horizontal Stepper */}
        <nav className="flex items-center justify-between gap-2 overflow-visible pb-2 relative">
          {FORM_SECTIONS.map((section : any , idx : any ) => {
            const active = idx === currentStep;
            const unlocked = idx <= maxStep;
            return (
              <div key={section.id} className="relative flex flex-col items-center group">
                <button
                  type="button"
                  onClick={() => handleStepClick(idx)}
                  className={`flex flex-col items-center min-w-[60px] px-2 focus:outline-none transition-all duration-200 ${active ? 'text-indigo-700' : unlocked ? 'text-green-600' : 'text-gray-400 opacity-50 cursor-not-allowed'}`}
                  aria-current={active ? 'step' : undefined}
                  aria-label={section.title}
                  disabled={!unlocked}
                  tabIndex={unlocked ? 0 : -1}
                >
                  <span className={`flex items-center justify-center w-8 h-8 rounded-full border-2 mb-1 ${active ? 'bg-indigo-700 border-indigo-500 text-white scale-110' : unlocked ? 'bg-green-500 border-green-500 text-white' : 'bg-gray-200 border-gray-300 text-gray-400'}`}>
                    {completedSteps.has(idx)
                      ? <FaCheck className="w-4 h-4" />
                      : React.createElement(section.icon, { className: "w-4 h-4" })}
                  </span>
                  <span className="text-[10px] font-medium">{idx + 1}</span>
                  {!unlocked && <span className="text-[10px] text-gray-400 mt-1">Locked</span>}
                </button>
                {/* Tooltip */}
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
        <section className="w-full max-w-2xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100 p-4 md:p-8 flex flex-col mt-2 md:mt-4 animate-fade-in gap-4 md:gap-8">
          {/* Section Header */}
          <div className="mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-3">
              {React.createElement(FORM_SECTIONS[currentStep].icon, { className: "w-6 h-6 text-indigo-600" })}
              {FORM_SECTIONS[currentStep]?.title}
            </h2>
            <p className="text-sm text-gray-500 font-medium mt-1">{FORM_SECTIONS[currentStep]?.description}</p>
          </div>

          <form
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              if(onSubmit) onSubmit(localValues);
            }}
            className="flex flex-col gap-6"
          >
            <div className="space-y-4 md:space-y-8">
              {/* Dynamic Section Rendering */}
              {FORM_SECTIONS[currentStep].id === "goals" ? (
                // Special layout for goals section
                <div className="space-y-6">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">Goal {num}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[`goal${num}`, `rating${num}`, `actions${num}`, `byWhom${num}`, `byWhen${num}`, `reviewDate${num}`].map((field) => {
                          const meta = FIELD_METADATA[field] || { label: field, type: "text" };
                          const required = isFieldRequired(field);
                          
                          if (meta.type === "textarea") {
                            return (
                              <div key={field} className="md:col-span-2">
                                {renderTextArea(meta.label, field, meta.rows || 3, meta.placeholder, required)}
                              </div>
                            );
                          }
                          if (meta.type === "dropdown") {
                            return (
                              <div key={field}>
                                {renderDropdown(meta.label, field, meta.options || [], required)}
                              </div>
                            );
                          }
                          return (
                            <div key={field}>
                              {renderInput(meta.label, field, meta.type || "text", meta.placeholder, required)}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : FORM_SECTIONS[currentStep].id === "supportInfo" ? (
                // Special layout for support info section
                <div className="space-y-6">
                  {/* Organization Info */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Organization Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {["pbsSupportPlanIncluded", "restrictivePractices", "organizationName", "contactPersonOrg", "contactNumberOrg"].map((field) => {
                        const meta = FIELD_METADATA[field] || { label: field, type: "text" };
                        const required = isFieldRequired(field);
                        
                        if (meta.type === "dropdown") {
                          return (
                            <div key={field} className="md:col-span-2">
                              {renderDropdown(meta.label, field, meta.options || [], required)}
                            </div>
                          );
                        }
                        return (
                          <div key={field}>
                            {renderInput(meta.label, field, meta.type || "text", meta.placeholder, required)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Informal Supports */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Informal Supports</h3>
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((num) => (
                        <div key={num} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-white rounded border">
                          <h4 className="md:col-span-3 text-sm font-medium text-gray-600 mb-2">Support Person {num}</h4>
                          {[`support${num}`, `role${num}`, `frequency${num}`].map((field) => {
                            const meta = FIELD_METADATA[field] || { label: field, type: "text" };
                            const required = isFieldRequired(field);
                            
                            return (
                              <div key={field}>
                                {renderInput(meta.label, field, meta.type || "text", meta.placeholder, required)}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // Standard grid layout for other sections
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {FORM_SECTIONS[currentStep].fields.map((field : any ) => {
                    const meta = FIELD_METADATA[field] || { label: field, type: "text" };
                    const required = isFieldRequired(field);
                    
                    if (meta.type === "textarea") {
                      return (
                        <div key={field} className="md:col-span-2">
                          {renderTextArea(meta.label, field, meta.rows || 3, meta.placeholder, required)}
                        </div>
                      );
                    }
                    if (meta.type === "dropdown") {
                      return (
                        <div key={field} className="md:col-span-2">
                          {renderDropdown(meta.label, field, meta.options || [], required)}
                        </div>
                      );
                    }
                    return (
                      <div key={field}>
                        {renderInput(meta.label, field, meta.type || "text", meta.placeholder, required)}
                      </div>
                    );
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
            {FORM_SECTIONS.map((_ : any , index : any ) => (
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
              disabled={currentStep === FORM_SECTIONS.length - 1 || !isCurrentSectionComplete() || navigatingNext}
              className={`flex items-center justify-center space-x-1 px-5 py-2 rounded-full font-semibold transition-all text-sm shadow border duration-200 w-full md:w-1/3 ${(currentStep === FORM_SECTIONS.length - 1 || !isCurrentSectionComplete() || navigatingNext) ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200" : "bg-gradient-to-r from-indigo-600 to-green-400 text-white border-indigo-600 hover:from-indigo-700 hover:to-green-500"}`}
            >
              <span>Next</span>
              {navigatingNext ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaChevronRight className="w-4 h-4" />}
            </button>

            <button
              onClick={async () => {
                if (handleSaveProgress) {
                  setIsSavingProgress(true);
                  try {
                    await handleSaveProgress();
                  } finally {
                    setIsSavingProgress(false);
                  }
                }
              }}
              disabled={isSavingProgress || submitting}
              className="flex items-center justify-center gap-1 px-5 py-2 rounded-full font-semibold text-sm bg-gray-600 hover:bg-gray-700 text-white shadow border border-gray-700 transition-all duration-200 w-full md:w-1/3 disabled:opacity-50"
            >
              {isSavingProgress ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaSave className="w-4 h-4" />}
              {isSavingProgress ? 'Saving...' : 'Save Progress'}
            </button>
          </div>

          {currentStep === FORM_SECTIONS.length - 1 && (
            <button
              className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 rounded-full font-semibold text-sm bg-gradient-to-r from-blue-600 to-green-400 text-white hover:from-blue-700 hover:to-green-500 shadow transition"
              onClick={(e) => {
                e.preventDefault();
                handleFormSubmitCheckValidation();
              }}
              disabled={isSavingProgress || submitting}
            >
              {submitting ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaCheck className="w-4 h-4" />}
              {submitting ? 'Submitting...' : 'Submit Form'}
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

export default MDTEdit;
