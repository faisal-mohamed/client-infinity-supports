"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FaUser,
  FaHome,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaClipboardList,
  FaSignature,
  FaChevronLeft,
  FaChevronRight,
  FaCheck,
  FaSave,
  FaInfoCircle,
  FaExclamationTriangle,
  FaClipboardCheck,
} from "react-icons/fa";
import { useToast } from "@/components/ui/Toast";

import SignatureCanvas, { SignatureCanvasRef } from '@/components/ui/SignatureCanvas';

// Match Client Intake form's custom spinner (hourglass emoji) so it always renders
const FaSpinner = ({ className }: { className?: string }) => <span className={className}>⏳</span>;

interface FormProps {
  formData: any;
  commonFieldsData: any;
  onChange: (values: any, field?: string, isCommon?: boolean) => void;
  onSubmit?: (values: any) => void;
  readOnly?: boolean;
  fieldErrors?: Record<string, string>;
  handleSave: (submit: boolean) => void; // Keep for backward compatibility
  handleSaveProgress?: () => Promise<void>; // New: separate save function
  handleSubmitForm?: () => Promise<void>; // New: separate submit function
  saving?: boolean; // Loading state from parent
  onCommonFieldsUpdated?: () => void;
}

export const FORM_SECTIONS : any = [
  {
    id: "headerInfo",
    title: "General Information",
    icon: FaInfoCircle,
    description: "Basic details about the person and activity",
    fields: [
      "personName",
      "activity",
      "assessorName",
      "date",
      "location"
    ],
    requiredFields: [],
  },
  {
    id: "riskAssessment",
    title: "POTENTIAL RISK & CONTROL MEASURES",
    icon: FaExclamationTriangle,
    description: "Risk identification and controls",
    fields: [
      ...Array.from({ length: 6 }, (_, i) => [
        `riskIdentified_${i + 1}`,
        `likelihood_${i + 1}`,
        `severity_${i + 1}`,
        `controls_${i + 1}`
      ]).flat()
    ],
        requiredFields: [],
        image: {
      src: "/individual-risk-assessment.png",
      alt: "Individual Activity Risk Assessment Guide"
    }

  },
  {
    id: "additionalSupportReview",
    title: "Additional Support & Review",
    icon: FaClipboardCheck,
    description: "Further support requirements and sign-off",
    fields: [
      "additionalSupport",
      "reviewDate",
      "assessorSignature"
    ],
        requiredFields: [],

  }
];


const commonFieldsMapping: Record<string, string> = {
  personName: "name",
  ndisNumber: "ndis",
  dob: "dob", 
  address: "street",
  
};

// Helper function to check if a field is a common field
const isCommonField = (fieldName: string): boolean => {
  return Object.keys(commonFieldsMapping).includes(fieldName);
};



const yesNoOptions = ["Yes", "No"];
const entryPointOptions = ["Left side", "Right Side", "Rear", "Other"];

const IndividualRiskAssessmentEdit: React.FC<FormProps> = ({
  formData,
  commonFieldsData,
  onChange,
  onSubmit,
  readOnly = false,
  fieldErrors = {},
  handleSave, // Legacy function
  handleSaveProgress, // New: separate save function
  handleSubmitForm, // New: separate submit function
  saving = false,
  onCommonFieldsUpdated,
}: any ) => {

// Helper function to get common field value
const getCommonFieldValue = (fieldName: string): string => {
  // For personName field, combine first name and surname to show full name
  if (fieldName === 'personName') {
    const firstName = commonFieldsData?.name || '';
    const surname = commonFieldsData?.surname || '';
    const fullName = [firstName, surname].filter(Boolean).join(' ').trim();
    if (fullName) {
      return fullName;
    }
    // Fallback to formData.personName if it exists
    if (formData?.[fieldName]) {
      return String(formData[fieldName]);
    }
    // Last fallback: try to get just the first name from commonFieldsData
    if (firstName) {
      return firstName;
    }
    return '';
  }
  
  const commonKey = commonFieldsMapping[fieldName];
  // Always prioritize current client details from database
    if (commonKey && commonFieldsData?.[commonKey]) {
      return String(commonFieldsData[commonKey]);
    }
    
    // Only fallback to saved form data if DB doesn't have the value
    return formData?.[fieldName] ? String(formData[fieldName]) : '';
};
  useEffect(() => {
    console.log("Common fields data updated:", commonFieldsData);
  }, [commonFieldsData]);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [maxStep, setMaxStep] = useState(0);
  
  // Signature canvas ref
  const sigCanvasRef = useRef<SignatureCanvasRef | null>(null);

   const initialValues = {
  // Page 1
  personName: "",
  activity: "",
  assessorName: "",
  date: "",
  location: "",

  // Page 2 - Risk Table
  ...Object.fromEntries(
    Array.from({ length: 6 }, (_, i) => {
      const index = i + 1;
      return [
        [`riskIdentified_${index}`, ""],
        [`likelihood_${index}`, ""],
        [`severity_${index}`, ""],
        [`controls_${index}`, ""]
      ];
    }).flat()
  ),

  // Page 3
  additionalSupport: "",
  reviewDate: "",

  ...formData,
  assessorSignature: "",
  assessorSignatureDate: "",
};



const getInitialRiskRows = (formValues: Record<string, any>) => {
  const rows: number[] = [];
  for (let i = 1; i <= 6; i++) {
    const hasValue =
      formValues[`riskIdentified_${i}`] ||
      formValues[`likelihood_${i}`] ||
      formValues[`severity_${i}`] ||
      formValues[`controls_${i}`];
    if (hasValue) rows.push(i);
  }
  return rows.length > 0 ? rows : [1];
};

const [activeRiskRows, setActiveRiskRows] = useState<number[]>(
  getInitialRiskRows(initialValues)
);



  // Initialize local values with form data, but common fields will be displayed from commonFieldsData
  const [localValues, setLocalValues] = useState<any>(initialValues);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { showToast } = useToast();

  // 🎯 LOADING STATE FOR FORM SUBMISSION
  const [submitting, setSubmitting] = useState(false); // For form submission
  // Local action lock to mirror Client Intake UX (prevents double-clicks and shows per-button spinner)
  const [uiBusyAction, setUiBusyAction] = useState<null | 'save' | 'next' | 'submit'>(null);
  const buttonsLocked = submitting || saving || uiBusyAction !== null;

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
    if (buttonsLocked) return;
    setUiBusyAction('next');
    try {
      // Save progress before moving to next section
      await handleSaveProgress();
      handleNext();
    } finally {
      setUiBusyAction(null);
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
    showComments?: boolean,
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
        aria-label={label}
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
      {showComments && (
        <div className="mt-3">
          {renderTextArea("Comments", `${name}_comments`, 2, "Add any additional comments...")}
        </div>
      )}
    </div>
  );

  const renderMultiSelectCheckbox = (
    label: string,
    name: string,
    options: string[],
    showComments?: boolean,
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
      <div className="flex flex-col gap-2 w-full">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-azure-100 shadow-sm hover:shadow-md transition-all cursor-pointer w-full"
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
              disabled={readOnly}
              className="accent-accent h-4 w-4 rounded border-azure-200 focus:ring-accent"
            />
            <span className="text-sm text-azure-600">{option}</span>
          </label>
        ))}
      </div>
      {fieldErrors[name] && (
        <p className="text-xs text-red-500 mt-1">{fieldErrors[name]}</p>
      )}
      {showComments && (
        <div className="mt-3">
          {renderTextArea("Comments", `${name}_comments`, 2, "Add any additional comments...")}
        </div>
      )}
    </div>
  );

  const renderSignatureField = (
    label: string,
    name: string,
    placeholder?: string,
    required?: boolean
  ) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-azure-600 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="w-full rounded-lg border border-azure-100 bg-white p-4 shadow-sm">
        <SignatureCanvas
          ref={sigCanvasRef}
          onSignatureEnd={handleSignatureEnd}
          onSignatureClear={handleSignatureClear}
          existingSignature={localValues[name]}
          width={400}
          height={150}
          disabled={readOnly}
          placeholder={placeholder || "Draw your signature in the box above"}
        />
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

  const FIELD_METADATA = {
  personName: { label: "Person's Name", type: "text" },
  activity: { label: "Activity", type: "text" },
  assessorName: { label: "Assessor's Name", type: "text" },
  date: { label: "Date", type: "date" },
  location: { label: "Location", type: "text" },

 ...Object.fromEntries(
  Array.from({ length: 6 }, (_, i) => {
    const index = i + 1;
    return [
      [`riskIdentified_${index}`, { label: `Risk Identified ${index}`, type: "text" }],
      [`likelihood_${index}`, { label: `Likelihood ${index}`, type: "text" }],
      [`severity_${index}`, { label: `Severity ${index}`, type: "text" }],
      [`controls_${index}`, { label: `Control Measures ${index}`, type: "text" }],
    ];
  }).flat()
),


  additionalSupport: {
    label: "Additional Support Requirements",
    type: "textarea",
    rows: 3
  },
  reviewDate: { label: "Assessment Review Date", type: "date" },
  assessorSignature: { label: "Assessor's Signature", type: "signature" }
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
    console.log("form submitted")
    if (buttonsLocked) return;
    setUiBusyAction('submit');
    setSubmitting(true);
    const validationResult = validateRequiredFields();

    if (validationResult.isValid) {
      await handleSubmitForm(); // Awaiting if handleSaveProgress is async
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
  } finally {
    setSubmitting(false);
    setUiBusyAction(null);
  }
};


  // 🎯 LEGACY WRAPPER FUNCTION (for backward compatibility)
  const handleSaveWithConfirm = async (submit: boolean) => {
    if (submit) {
      await handleSubmitForm();
    } else {
      await handleSaveProgress();
    }
  };

  // Handle signature end (when user finishes drawing)
  const handleSignatureEnd = (dataUrl: string) => {
    // Update local values with signature
    const newValues = { ...localValues, assessorSignature: dataUrl };
    setLocalValues(newValues);
    onChange(newValues, "assessorSignature", false);
  };

  // Handle signature clear
  const handleSignatureClear = () => {
    const newValues = { ...localValues, assessorSignature: "" };
    setLocalValues(newValues);
    onChange(newValues, "assessorSignature", false);
  };



  return (
    <div className="">
      {/* Progress Bar */}
      <div className="w-full max-w-2xl mx-auto pt-2 md:pt-6 px-2">
        <div className="w-full h-2 bg-azure-200 rounded-full mb-4">
          <div className="h-2 bg-gradient-to-r from-azure-600 to-green-400 rounded-full transition-all" style={{ width: `${getProgressPercentage()}%` }} />
        </div>
        {/* Horizontal Stepper */}
        <nav className="flex items-center justify-between gap-2 overflow-visible pb-2 relative">
          {FORM_SECTIONS.map((section  : any , idx : any ) => {
            const active = idx === currentStep;
            const unlocked = idx <= maxStep;
            return (
              <div key={section.id} className="relative flex flex-col items-center group">
                <button
                  type="button"
                  onClick={() => handleStepClick(idx)}
                  className={`flex flex-col items-center min-w-[60px] px-2 focus:outline-none transition-all duration-200 ${active ? 'text-azure-700' : unlocked ? 'text-green-600' : 'text-azure-300 opacity-50 cursor-not-allowed'}`}
                  aria-current={active ? 'step' : undefined}
                  aria-label={section.title}
                  disabled={!unlocked}
                  tabIndex={unlocked ? 0 : -1}
                >
                  <span className={`flex items-center justify-center w-8 h-8 rounded-full border-2 mb-1 ${active ? 'bg-azure-800 border-azure-600 text-white scale-110' : unlocked ? 'bg-green-500 border-green-500 text-white' : 'bg-azure-200 border-azure-200 text-azure-300'}`}>
                    {completedSteps.has(idx)
                      ? <FaCheck className="w-4 h-4" />
                      : React.createElement(section.icon, { className: "w-4 h-4" })}
                  </span>
                  <span className="text-[10px] font-medium">{idx + 1}</span>
                  {!unlocked && <span className="text-[10px] text-azure-300 mt-1">Locked</span>}
                </button>
                {/* Tooltip */}
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
        <section className="w-full max-w-2xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-azure-50 p-4 md:p-8 flex flex-col mt-2 md:mt-4 animate-fade-in gap-4 md:gap-8">
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
              if(onSubmit) onSubmit(localValues);
            }}
            className="flex flex-col gap-6"
          >
            <div className="space-y-4 md:space-y-8">
              {/* Dynamic Section Rendering */}
              {FORM_SECTIONS[currentStep].id === "riskAssessment" ? (
  <>
  {FORM_SECTIONS[currentStep].image && (
    <div className="w-full flex justify-center mb-4">
      <img
        src={FORM_SECTIONS[currentStep].image.src}
        alt={FORM_SECTIONS[currentStep].image.alt || "Section Image"}
        className="max-w-full h-auto rounded-lg border border-azure-100 shadow"
      />
    </div>
  )}
    <div className="space-y-6">
      {activeRiskRows.map((num) => (
        <div
          key={num}
          className="border border-azure-100 rounded-lg p-4 bg-azure-50"
        >
          <h3 className="text-lg font-semibold mb-4 text-azure-700">
            Risk Assessment Entry {num}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              [`riskIdentified_${num}`, FIELD_METADATA[`riskIdentified_${num}`]],
              [`likelihood_${num}`, FIELD_METADATA[`likelihood_${num}`]],
              [`severity_${num}`, FIELD_METADATA[`severity_${num}`]],
              [`controls_${num}`, FIELD_METADATA[`controls_${num}`]],
            ].map(([field, meta]) => {
              const required = isFieldRequired(field);

              if (meta?.type === "textarea") {
                return (
                  <div key={field} className="md:col-span-2">
                    {renderTextArea(meta.label, field, meta.rows || 3, meta.placeholder, required)}
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

    {activeRiskRows.length < 6 && (
      <button
        type="button"
        onClick={() =>
          setActiveRiskRows((prev) =>
            prev.length < 6 ? [...prev, prev.length + 1] : prev
          )
        }
        className="mt-4 px-4 py-2 rounded-full bg-azure-700 hover:bg-azure-800 text-white text-sm font-medium shadow"
      >
        + Add Risk Entry
      </button>
    )}
  </>
) : (
  // Standard grid layout for other sections
  
  <>
  {FORM_SECTIONS[currentStep].image && (
    <div className="w-full flex justify-center mb-4">
      <img
        src={FORM_SECTIONS[currentStep].image.src}
        alt={FORM_SECTIONS[currentStep].image.alt || "Section Image"}
        className="max-w-full h-auto rounded-lg border border-azure-100 shadow"
      />
    </div>
  )}
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
            {renderDropdown(meta.label, field, meta.options || [], meta.showComments, required)}
          </div>
        );
      }
      if (meta.type === "checkbox") {
        return (
          <div key={field} className="md:col-span-2">
            {renderMultiSelectCheckbox(meta.label, field, meta.options || [], meta.showComments, required)}
          </div>
        );
      }
      if (meta.type === "signature") {
        return (
          <div key={field} className="md:col-span-2">
            {renderSignatureField(meta.label, "assessorSignature", meta.placeholder, required)}
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
  </>
)}

            </div>
          </form>
        </section>

        {/* Navigation Buttons */}
        <footer className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-lg border-t border-azure-50 px-4 md:px-10 py-5 flex flex-col items-center gap-4 shadow-2xl rounded-b-3xl animate-fade-in mt-2">
          {/* Stepper */}
          <div className="flex flex-row justify-center items-center space-x-2 mb-2">
            {FORM_SECTIONS.map((_ : any , index : any ) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full border duration-200 ${index === currentStep ? "bg-azure-600 border-azure-600 shadow" : index < currentStep ? "bg-green-500 border-green-500" : "bg-azure-200 border-azure-200"}`}
              />
            ))}
          </div>

          <div className="flex flex-col w-full gap-2 md:flex-row md:gap-3 md:justify-between">
            <button
              type="button"
              onClick={handlePreviousSequential}
              disabled={currentStep === 0 || buttonsLocked}
              className={`flex items-center justify-center space-x-1 px-5 py-2 rounded-full font-semibold transition-all text-sm shadow border duration-200 w-full md:w-1/3 ${currentStep === 0 ? "bg-azure-100 text-azure-300 cursor-not-allowed border-azure-100" : "bg-gradient-to-r from-azure-600 to-azure-800 text-white border-azure-600 hover:from-azure-700 hover:to-black"}`}
            >
              <FaChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={handleNextSequential}
              disabled={currentStep === FORM_SECTIONS.length - 1 || !isCurrentSectionComplete() || buttonsLocked}
              className={`flex items-center justify-center space-x-1 px-5 py-2 rounded-full font-semibold transition-all text-sm shadow border duration-200 w-full md:w-1/3 ${(currentStep === FORM_SECTIONS.length - 1 || !isCurrentSectionComplete() || buttonsLocked) ? "bg-azure-100 text-azure-300 cursor-not-allowed border-azure-100" : "bg-gradient-to-r from-azure-700 to-green-400 text-white border-azure-700 hover:from-azure-800 hover:to-green-500"}`}
            >
              {uiBusyAction === 'next' ? <FaSpinner className="w-4 h-4 animate-spin" /> : <span>Next</span>}
              {uiBusyAction === 'next' ? null : <FaChevronRight className="w-4 h-4" />}
            </button>

            <button
              onClick={async () => {
                if (buttonsLocked) return;
                setUiBusyAction('save');
                try { await handleSaveProgress(); } finally { setUiBusyAction(null); }
              }}
              disabled={buttonsLocked}
              className="flex items-center justify-center gap-1 px-5 py-2 rounded-full font-semibold text-sm bg-azure-500 hover:bg-azure-600 text-white shadow border border-azure-600 transition-all duration-200 w-full md:w-1/3 disabled:opacity-50"
            >
              {(uiBusyAction === 'save') || (saving && uiBusyAction === null) ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaSave className="w-4 h-4" />}
              {(uiBusyAction === 'save') || (saving && uiBusyAction === null) ? 'Saving...' : 'Save Progress'}
            </button>
          </div>

          {currentStep === FORM_SECTIONS.length - 1 && (
            <button
              className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 rounded-full font-semibold text-sm bg-gradient-to-r from-azure-600 to-green-400 text-white hover:from-azure-700 hover:to-green-500 shadow transition"
              onClick={(e) => {
                e.preventDefault();
                handleFormSubmitCheckValidation();
              }}
              disabled={buttonsLocked}
            >
              {uiBusyAction === 'submit' || submitting ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaCheck className="w-4 h-4" />}
              {uiBusyAction === 'submit' || submitting ? 'Submitting...' : 'Submit Form'}
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

export default IndividualRiskAssessmentEdit;
