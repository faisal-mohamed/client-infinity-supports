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
} from "react-icons/fa";
import { useToast } from "@/components/ui/Toast";

import SignatureCanvas, { SignatureCanvasRef } from '@/components/ui/SignatureCanvas';

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
  onCommonFieldsUpdated?: () => void;
}

const FORM_SECTIONS = [
  {
    id: "metadata",
    title: "Basic Information",
    icon: FaUser,
    description: "Client details and assessment information",
    fields: [
      "name", "ndisNumber", "dob", "address", "completionDate"
    ],
    requiredFields: ["name", "ndisNumber", "dob", "address", "completionDate"],
  },
  {
    id: "clientFamily",
    title: "Client and Family",
    icon: FaHome,
    description: "Information about client and family circumstances",
    fields: [
      "visitCompany", "aggressionHistory", "drugUseHistory", "careDirective"
    ],
    requiredFields: ["visitCompany", "aggressionHistory", "drugUseHistory", "careDirective"],
  },
  {
    id: "environment",
    title: "Environment",
    icon: FaShieldAlt,
    description: "Environmental safety considerations",
    fields: [
      "petsRestrained", "weaponsInHome"
    ],
    requiredFields: ["petsRestrained", "weaponsInHome"],
  },
  {
    id: "safety",
    title: "Safety Considerations",
    icon: FaShieldAlt,
    description: "Fire safety and smoking considerations",
    fields: [
      "smokingAgreement", "smokeDetectors", "fireHazards"
    ],
    requiredFields: ["smokingAgreement", "smokeDetectors", "fireHazards"],
  },
  {
    id: "location",
    title: "Geographical Location",
    icon: FaMapMarkerAlt,
    description: "Access and location considerations",
    fields: [
      "accessDifficulties", "parking", "entryPoint", "mobileReception"
    ],
    requiredFields: ["accessDifficulties", "parking", "entryPoint", "mobileReception"],
  },
  {
    id: "riskAssessment",
    title: "Risk Assessment Table",
    icon: FaClipboardList,
    description: "Detailed risk assessment and control measures",
    fields: [
      "issue1", "riskScore1", "control1", "responsible1",
      "issue2", "riskScore2", "control2", "responsible2",
      "issue3", "riskScore3", "control3", "responsible3"
    ],
    requiredFields: [],
  },
  {
    id: "signature",
    title: "Signature",
    icon: FaSignature,
    description: "Completion and signature details",
    fields: [
      "designation", "signature"
    ],
    requiredFields: ["designation", "signature"],
  },
];

const commonFieldsMapping: Record<string, string> = {
  name: "name",
  ndisNumber: "ndis",
  dob: "dob", 
  address: "address",
};

// Helper function to check if a field is a common field
const isCommonField = (fieldName: string): boolean => {
  return Object.keys(commonFieldsMapping).includes(fieldName);
};



const yesNoOptions = ["Yes", "No"];
const entryPointOptions = ["Left side", "Right Side", "Rear", "Other"];

const HomeVisitRiskAssessmentEdit: React.FC<FormProps> = ({
  formData,
  commonFieldsData,
  onChange,
  onSubmit,
  readOnly = false,
  fieldErrors = {},
  handleSave, // Legacy function
  handleSaveProgress, // New: separate save function
  handleSubmitForm, // New: separate submit function
  onCommonFieldsUpdated,
}: any ) => {

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
  
  // Signature canvas ref
  const sigCanvasRef = useRef<SignatureCanvasRef | null>(null);

  const initialValues = {
    // Metadata fields - these will be overridden by common fields if available
    name: commonFieldsData?.name || "",
    ndisNumber: commonFieldsData?.ndis || "",
    dob: commonFieldsData?.dob || "",
    address: commonFieldsData?.address || "",
    completionDate: new Date().toISOString().split("T")[0],
    
    // Client and Family
    visitCompany: "",
    visitCompany_comments: "",
    aggressionHistory: "",
    aggressionHistory_comments: "",
    drugUseHistory: "",
    drugUseHistory_comments: "",
    careDirective: "",
    careDirective_comments: "",
    
    // Environment
    petsRestrained: "",
    petsRestrained_comments: "",
    weaponsInHome: "",
    weaponsInHome_comments: "",
    
    // Safety
    smokingAgreement: "",
    smokingAgreement_comments: "",
    smokeDetectors: "",
    smokeDetectors_comments: "",
    fireHazards: "",
    fireHazards_comments: "",
    
    // Location
    accessDifficulties: "",
    accessDifficulties_comments: "",
    parking: "",
    parking_comments: "",
    entryPoint: [],
    entryPoint_comments: "",
    mobileReception: "",
    mobileReception_comments: "",
    
    // Risk Assessment Table
    issue1: "",
    riskScore1: "",
    control1: "",
    responsible1: "",
    issue2: "",
    riskScore2: "",
    control2: "",
    responsible2: "",
    issue3: "",
    riskScore3: "",
    control3: "",
    responsible3: "",
    
    // Signature
    designation: "",
    signature: "",
    
    ...formData,
  };

  // Initialize local values with form data, but common fields will be displayed from commonFieldsData
  const [localValues, setLocalValues] = useState<any>(initialValues);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { showToast } = useToast();

  // 🎯 SEPARATE LOADING STATES
  const [saving, setSaving] = useState(false); // For save progress
  const [submitting, setSubmitting] = useState(false); // For form submission

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

  const handleNextSequential = async () => {
    // Save progress before moving to next section
    await handleSaveProgress();
    handleNext();
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
    showComments?: boolean,
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
          fieldErrors[name] ? "text-red-500" : "text-gray-700"
        }`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex flex-col gap-2 w-full">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer w-full"
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
              className="accent-accent h-4 w-4 rounded border-gray-300 focus:ring-accent"
            />
            <span className="text-sm text-gray-700">{option}</span>
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
      <label className="text-xs font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
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

  // Field metadata for dynamic rendering
  const FIELD_METADATA: Record<string, any> = {
    // Metadata fields
    name: { label: "Name", type: "text", placeholder: "Enter client name" },
    ndisNumber: { label: "NDIS Number", type: "text", placeholder: "Enter NDIS number" },
    dob: { label: "Date of Birth", type: "date", placeholder: "Select date of birth" },
    address: { label: "Address", type: "textarea", placeholder: "Enter full address", rows: 2 },
    completionDate: { label: "Date of Completion of Risk Assessment", type: "date", placeholder: "Select completion date" },
    
    // Client and Family
    visitCompany: { label: "Will anyone else be present during the visit?", type: "dropdown", options: yesNoOptions, showComments: true },
    aggressionHistory: { label: "Any history of verbal or physical aggression from the client or family?", type: "dropdown", options: yesNoOptions, showComments: true },
    drugUseHistory: { label: "Any history of alcohol or drug use?", type: "dropdown", options: yesNoOptions, showComments: true },
    careDirective: { label: "Is there an advanced care directive?", type: "dropdown", options: yesNoOptions, showComments: true },
    
    // Environment
    petsRestrained: { label: "If there are any pets, has the client agreed to restrain them during the visit?", type: "dropdown", options: yesNoOptions, showComments: true },
    weaponsInHome: { label: "Are there any weapons in the home?", type: "dropdown", options: yesNoOptions, showComments: true },
    
    // Safety
    smokingAgreement: { label: "If there are any smokers, have they agreed to refrain from smoking during the visit?", type: "dropdown", options: yesNoOptions, showComments: true },
    smokeDetectors: { label: "Are there smoke detectors present and in working condition?", type: "dropdown", options: yesNoOptions, showComments: true },
    fireHazards: { label: "Any apparent fire hazards?", type: "dropdown", options: yesNoOptions, showComments: true },
    
    // Location
    accessDifficulties: { label: "Are there any difficulties locating the address/access to the building?", type: "dropdown", options: yesNoOptions, showComments: true },
    parking: { label: "Is there parking available?", type: "dropdown", options: yesNoOptions, showComments: true },
    entryPoint: { label: "Is entry via the front door? If no, which door is used for entry?", type: "checkbox", options: entryPointOptions, showComments: true },
    mobileReception: { label: "Are there any issues with mobile phone reception?", type: "dropdown", options: yesNoOptions, showComments: true },
    
    // Risk Assessment Table
    issue1: { label: "Issue/Task 1", type: "textarea", placeholder: "Describe the issue or task", rows: 2 },
    riskScore1: { label: "Risk Score 1", type: "text", placeholder: "Enter risk score" },
    control1: { label: "Control Measure 1", type: "textarea", placeholder: "Describe control measures", rows: 2 },
    responsible1: { label: "Person Responsible 1", type: "text", placeholder: "Enter responsible person" },
    
    issue2: { label: "Issue/Task 2", type: "textarea", placeholder: "Describe the issue or task", rows: 2 },
    riskScore2: { label: "Risk Score 2", type: "text", placeholder: "Enter risk score" },
    control2: { label: "Control Measure 2", type: "textarea", placeholder: "Describe control measures", rows: 2 },
    responsible2: { label: "Person Responsible 2", type: "text", placeholder: "Enter responsible person" },
    
    issue3: { label: "Issue/Task 3", type: "textarea", placeholder: "Describe the issue or task", rows: 2 },
    riskScore3: { label: "Risk Score 3", type: "text", placeholder: "Enter risk score" },
    control3: { label: "Control Measure 3", type: "textarea", placeholder: "Describe control measures", rows: 2 },
    responsible3: { label: "Person Responsible 3", type: "text", placeholder: "Enter responsible person" },
    
    // Signature
    designation: { label: "Designation", type: "text", placeholder: "Enter your designation/title" },
    signature: { label: "Signature", type: "signature", placeholder: "Draw your signature in the box above" },
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

  // // 🎯 SAVE PROGRESS FUNCTION
  // const handleSaveProgress = async () => {
  //   if (handleSaveProgress && typeof handleSaveProgress === 'function') {
  //     // Use new separate save function if provided
  //     setSaving(true);
  //     try {
  //       await handleSaveProgress();
  //     } finally {
  //       setSaving(false);
  //     }
  //   } else {
  //     // Fallback to legacy function
  //     handleSave(false);
  //   }
  // };

  // // 🎯 SUBMIT FORM FUNCTION
  // const handleSubmitForm = async () => {
  //   // Validate required fields before submission
  //   const validation = validateRequiredFields();
  //   if (!validation.isValid) {
  //     showToast({
  //       type: "error",
  //       title: "Required Fields Missing",
  //       message: `Please fill in all required fields before submitting. Missing: ${validation.missingFields.slice(0, 3).join(', ')}${validation.missingFields.length > 3 ? '...' : ''}`,
  //       duration: 5000,
  //     });
  //     return;
  //   }

  //   if (handleSubmitForm && typeof handleSubmitForm === 'function') {
  //     // Use new separate submit function if provided
  //     setSubmitting(true);
  //     try {
  //       await handleSubmitForm();
  //     } finally {
  //       setSubmitting(false);
  //     }
  //   } else {
  //     // Fallback to legacy function
  //     handleSave(true);
  //   }
  // };


  const handleFormSubmitCheckValidation = async () => {
  try {
    console.log("form submitted")
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
    const newValues = { ...localValues, signature: dataUrl };
    setLocalValues(newValues);
    onChange(newValues, "signature", false);
  };

  // Handle signature clear
  const handleSignatureClear = () => {
    const newValues = { ...localValues, signature: "" };
    setLocalValues(newValues);
    onChange(newValues, "signature", false);
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
          {FORM_SECTIONS.map((section, idx) => {
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
              {FORM_SECTIONS[currentStep].title}
            </h2>
            <p className="text-sm text-gray-500 font-medium mt-1">{FORM_SECTIONS[currentStep].description}</p>
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
                // Special layout for risk assessment table
                <div className="space-y-6">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">Risk Assessment Entry {num}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[`issue${num}`, `riskScore${num}`, `control${num}`, `responsible${num}`].map((field) => {
                          const meta = FIELD_METADATA[field] || { label: field, type: "text" };
                          const required = isFieldRequired(field);
                          
                          if (meta.type === "textarea") {
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
              ) : (
                // Standard grid layout for other sections
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {FORM_SECTIONS[currentStep].fields.map((field) => {
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
                          {renderSignatureField(meta.label, field, meta.placeholder, required)}
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
              onClick={() => handleSaveProgress()}
              disabled={saving || submitting}
              className="flex items-center justify-center gap-1 px-5 py-2 rounded-full font-semibold text-sm bg-gray-600 hover:bg-gray-700 text-white shadow border border-gray-700 transition-all duration-200 w-full md:w-1/3 disabled:opacity-50"
            >
              <FaSave className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Progress'}
            </button>
          </div>

          {currentStep === FORM_SECTIONS.length - 1 && (
            <button
              className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 rounded-full font-semibold text-sm bg-gradient-to-r from-blue-600 to-green-400 text-white hover:from-blue-700 hover:to-green-500 shadow transition"
              onClick={(e) => {
                e.preventDefault();
                handleFormSubmitCheckValidation();
              }}
              disabled={saving || submitting}
            >
              <FaCheck className="w-4 h-4" />
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

export default HomeVisitRiskAssessmentEdit;
