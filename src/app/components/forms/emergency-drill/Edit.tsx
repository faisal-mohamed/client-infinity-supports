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
  FaSpinner,
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
  handleSaveProgress?: () => Promise<void>; // New: separate save function for Save Progress button
  handleSaveForNext?: () => Promise<void>; // New: separate save for Next button
  handleSaveForPrev?: () => Promise<void>; // New: separate save for Previous button
  handleSubmitForm?: () => Promise<void>; // New: separate submit function
  saving?: boolean; // Loading state for Save Progress button
  navigatingNext?: boolean; // Loading state for Next button only
  navigatingPrev?: boolean; // Loading state for Previous button only
  isSignatureLink?: boolean; // NEW: If true, apply signature link access restrictions
  onCommonFieldsUpdated?: () => void;
}

export const FORM_SECTIONS : any = [
  {
    id: "generalInfo",
    title: "General Information",
    description: "Basic details about the emergency drill",
    fields: [
      "drillDate",
      "drillTime",
      "clientName",
      "supportWorkers",
      "supervisorNotified"
    ],
    icon: FaHome,
    requiredFields: []
  },
  {
    id: "drillTypes",
    title: "Type of Drill Conducted",
    description: "Select applicable emergency types",
    fields: [
      "fire",
      "medical",
      "gas",
      "power",
      "natural",
      "security",
      "otherDrill"
    ],
    icon: FaHome,
        requiredFields: []


  },
  {
    id: "executionDetails",
    title: "Drill Execution Details",
    description: "Details of how the drill was executed",
    fields: [
      "planFollowed",
      "safetyProtocols",
      "servicesContacted",
      "clientResponse",
      "supportAction"
    ],
    icon: FaHome,
        requiredFields: []

  },
  {
    id: "observations",
    title: "Observations and Challenges",
    description: "Assessment and findings",
    fields: [
      "whatWentWell",
      "challenges",
      "unexpectedIssues"
    ],
    icon: FaHome,    
    requiredFields: []

  },
  {
    id: "recommendations",
    title: "Recommendations & Improvements",
    description: "Post-drill suggestions",
    fields: [
      "procedureChanges",
      "additionalTrainingRequired",
      "trainingDetails",
      "planUpdateNeeded",
      "planUpdateDetails"
    ],
    icon: FaHome,
        requiredFields: []


  },
  {
    id: "followup",
    title: "Follow-up",
    description: "Debrief and scheduling",
    fields: [
      "debriefConducted",
      "supervisorComments",
      "nextDrillDate"
    ],
    icon: FaHome,
        requiredFields: []

  },
  {
    id: "signatures",
    title: "Signatures",
    description: "Acknowledgements",
    fields: [
      "supportWorkerSignature",
      "supervisorSignature",
      "signatureDate"
    ],
    icon: FaHome,
        requiredFields: []

  }
];


const commonFieldsMapping: Record<string, string> = {
  name: "name",
  ndisNumber: "ndis",
  dob: "dob", 
  address: "street",
  clientName: 'name',
  
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
  handleSaveProgress, // New: separate save function for Save Progress button
  handleSaveForNext, // New: separate save for Next button
  handleSaveForPrev, // New: separate save for Previous button
  handleSubmitForm, // New: separate submit function
  saving = false, // Loading state for Save Progress button
  navigatingNext = false, // Loading state for Next button only
  navigatingPrev = false, // Loading state for Previous button only
  isSignatureLink = false, // NEW: Default to admin view
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
  const stepStorageKeyRef = useRef<string>("");
  // Determine initial step synchronously to avoid flashing back to section 1
  const initialStep = (() => {
    if (typeof window === 'undefined') return 0;
    const key = `emergency_drill_step:${window.location.pathname}`;
    stepStorageKeyRef.current = key;
    try {
      const saved = parseInt(localStorage.getItem(key) || "", 10);
      if (!isNaN(saved) && saved >= 0 && saved < FORM_SECTIONS.length) return saved;
    } catch {}
    return 0;
  })();
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [maxStep, setMaxStep] = useState(initialStep);
  // Ensure key is set if constructed before window existed
  useEffect(() => {
    if (!stepStorageKeyRef.current && typeof window !== 'undefined') {
      stepStorageKeyRef.current = `emergency_drill_step:${window.location.pathname}`;
    }
  }, []);

  // Persist step on change
  useEffect(() => {
    if (!stepStorageKeyRef.current) return;
    try {
      localStorage.setItem(stepStorageKeyRef.current, String(currentStep));
    } catch {}
  }, [currentStep]);
  
  // Signature canvas ref
  const sigCanvasRef = useRef<SignatureCanvasRef | null>(null);
  const sigCanvasRefManager = useRef<SignatureCanvasRef | null>(null);

   const initialValues = {
  // General Information
  drillDate: "",
  drillTime: "",
  clientName: "",
  supportWorkers: "",
  supervisorNotified: "",

  // Drill Types
  fire: false,
  medical: false,
  gas: false,
  power: false,
  natural: false,
  security: false,
  otherDrill: "",

  // Execution Details
  planFollowed: "",
  safetyProtocols: "",
  servicesContacted: "",
  clientResponse: "",
  supportAction: "",

  // Observations
  whatWentWell: "",
  challenges: "",
  unexpectedIssues: "",

  // Recommendations
  procedureChanges: "",
  additionalTrainingRequired: "",
  trainingDetails: "",
  planUpdateNeeded: "",
  planUpdateDetails: "",

  // Follow-up
  debriefConducted: "",
  supervisorComments: "",
  nextDrillDate: "",

  // Signatures (defaults)
  supportWorkerSignature: "",
  supervisorSignature: "",
  signatureDate: formatDateForDisplay(new Date().toISOString().split("T")[0]),

  // Incoming data from DB should override defaults, including signatures/date
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
   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
 ) => {
   const { name, value, type } = e.target;
 
   if (isCommonField(name)) {
     showToast({
       type: "info",
       title: "Common Field",
       message: "This field can only be updated from the client's common details section.",
       duration: 3000,
     });
     return;
   }
 
   const formattedValue =
  type === "date" && value ? formatDateForDisplay(value) : value;

 
   const newValues = { ...localValues, [name]: formattedValue };
   setLocalValues(newValues);
   onChange(newValues, name, isCommonField(name));
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
    // Save progress before moving to next section
    if (handleSaveForNext) {
      await handleSaveForNext();
    }
    handleNext();
  };

  const handlePreviousSequential = async () => {
    // Save progress before moving to previous section
    if (currentStep > 0) {
      if (handleSaveForPrev) {
        await handleSaveForPrev();
      }
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
    const fieldIsReadOnly = isFieldReadOnly(name) || isCommon; // Use the new helper
    
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {fieldIsReadOnly && isSignatureLink && !isCommon && currentStep === 5 && (
            <span className="ml-2 text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              View Only
            </span>
          )}
        </label>
        <input
          type={type}
          name={name}
value={type === "date" && displayValue ? formatDateForStorage(displayValue) : displayValue}
          onChange={isCommon ? undefined : handleChange}
          placeholder={isCommon ? "Value from common fields" : placeholder}
          disabled={fieldIsReadOnly}
          className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder-gray-400 ${
            fieldErrors[name]
              ? "border-red-300 bg-red-50"
              : isCommon 
                ? "bg-blue-50 border-blue-200 text-blue-800"
                : fieldIsReadOnly && isSignatureLink
                ? "bg-gray-50 border-gray-300"
                : "hover:border-accent/40"
          } ${fieldIsReadOnly ? "cursor-not-allowed" : ""}`}
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
    const fieldIsReadOnly = isFieldReadOnly(name) || isCommon; // Use the new helper
    
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {fieldIsReadOnly && isSignatureLink && !isCommon && currentStep === 5 && (
            <span className="ml-2 text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              View Only
            </span>
          )}
        </label>
        <textarea
          name={name}
          value={displayValue}
          onChange={isCommon ? undefined : handleChange}
          placeholder={isCommon ? "Value from common fields" : placeholder}
          rows={rows}
          disabled={fieldIsReadOnly}
          className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder-gray-400 resize-none ${
            fieldErrors[name]
              ? "border-red-300 bg-red-50"
              : isCommon 
                ? "bg-blue-50 border-blue-200 text-blue-800"
                : fieldIsReadOnly && isSignatureLink
                ? "bg-gray-50 border-gray-300"
                : "hover:border-accent/40"
          } ${fieldIsReadOnly ? "cursor-not-allowed" : ""}`}
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
  ) => {
    const fieldIsReadOnly = isFieldReadOnly(name);
    
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {fieldIsReadOnly && isSignatureLink && currentStep === 5 && (
            <span className="ml-2 text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              View Only
            </span>
          )}
        </label>
        <select
          name={name}
          value={localValues[name] || ""}
          onChange={handleChange}
          disabled={fieldIsReadOnly}
          className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all ${
            fieldErrors[name]
              ? "border-red-300 bg-red-50"
              : fieldIsReadOnly && isSignatureLink
              ? "bg-gray-50 border-gray-300"
              : "hover:border-accent/40"
          } ${fieldIsReadOnly ? "bg-gray-50 text-gray-400" : ""}`}
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
  };

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
        signatureRef: any,

    placeholder?: string,
    required?: boolean,

  ) => {
    const fieldReadOnly = isFieldReadOnly(name); // Use the new helper
    
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {fieldReadOnly && isSignatureLink && (
            <span className="ml-2 text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              View Only
            </span>
          )}
        </label>
        <div className={`w-full rounded-lg border ${fieldReadOnly ? 'border-gray-300 bg-gray-50' : 'border-gray-200 bg-white'} p-4 shadow-sm`}>
          <SignatureCanvas
            ref={signatureRef}
            onSignatureEnd={(dataUrl: string) => handleSignatureEnd(name, dataUrl)}
            onSignatureClear={() => handleSignatureClear(name)}
            existingSignature={localValues[name]}
            width={400}
            height={150}
            disabled={fieldReadOnly}
            placeholder={fieldReadOnly ? "View only - signature will be added by supervisor" : (placeholder || "Draw your signature in the box above")}
          />
        </div>
        {fieldErrors[name] && (
          <p className="text-xs text-red-500 mt-1">{fieldErrors[name]}</p>
        )}
      </div>
    );
  };

  // Helper to check if a field is required in the current section
  const isFieldRequired = (fieldName: string) => {
    return FORM_SECTIONS[currentStep].requiredFields?.includes(fieldName);
  };

  // NEW: Helper to check if a field should be read-only based on signature link restrictions
  const isFieldReadOnly = (fieldName: string) => {
    if (!isSignatureLink) return readOnly; // Admin view - use default readOnly prop
    
    // Signature link restrictions:
    // Section 5 (Follow-up) - ALL fields read-only
    if (currentStep === 5) return true;
    
    // Section 6 (Signatures) - Only supervisorSignature is read-only
    if (currentStep === 6 && fieldName === 'supervisorSignature') return true;
    
    // Sections 0-4: Fully editable
    // Section 6: supportWorkerSignature and signatureDate editable
    return readOnly;
  };

   const FIELD_METADATA: any  = {
  drillDate: { label: "Date of Drill", type: "date" },
  drillTime: { label: "Time of Drill", type: "time" },
  clientName: { label: "Client’s Name  (if applicable)", type: "text" },
  supportWorkers: { label: "Support Worker(s) Involved", type: "text" },
  supervisorNotified: { label: "Supervisor/Manager Notified", type: "dropdown", options: ["Yes", "No"] },

  fire: { label: "Fire or smoke emergency", type: "dropdown", options: ["Yes", "No"] },
  medical: { label: "Medical emergency (e.g., client collapse, choking, seizure)", type: "dropdown", options: ["Yes", "No"] },
  gas: { label: "Gas leak or carbon monoxide alert", type: "dropdown", options: ["Yes", "No"] },
  power: { label: "Power outage", type: "dropdown", options: ["Yes", "No"] },
  natural: { label: "Natural disaster (e.g., flood, earthquake)", type: "dropdown", options: ["Yes", "No"] },
  security: { label: "Security threat (e.g., unauthorized visitor, break-in)", type: "dropdown", options: ["Yes", "No"] },
  otherDrill: { label: "If Other (specify)", type: "text" },

  planFollowed: { label: "Was the emergency plan followed?", type: "dropdown", options: ["Yes", "No"] },
  safetyProtocols: { label: "Were all safety measures and protocols implemented?", type: "dropdown", options: ["Yes", "No"] },
  servicesContacted: { label: "Emergency services contacted? (if applicable)", type: "dropdown", options: ["Yes", "No"] },
  clientResponse: { label: "Client response and involvement", type: "text" },
  supportAction: { label: "Support worker actions", type: "text" },

  whatWentWell: { label: "What went well?", type: "text" },
  challenges: { label: "What difficulties or challenges were encountered?", type: "text" },
  unexpectedIssues: { label: "Any unexpected issues?", type: "text" },

  procedureChanges: { label: "Suggested changes to procedures", type: "text" },
  additionalTrainingRequired: { label: "Additional training or support required?", type: "dropdown", options: ["Yes", "No"] },
  trainingDetails: { label: "If yes, specify", type: "text" },
  planUpdateNeeded: { label: "Updates needed for the client’s emergency plan?", type: "dropdown", options: ["Yes", "No"] },
  planUpdateDetails: { label: "If yes, specify", type: "text" },

  debriefConducted: { label: "Debrief conducted?", type: "dropdown", options: ["Yes", "No"] },
  supervisorComments: { label: "Supervisor/Manager Comments", type: "text" },
  nextDrillDate: { label: "Date of Next Scheduled Drill", type: "text" },

  supportWorkerSignature: { label: "Support Worker", type: "supportWorkerSignature" },
  supervisorSignature: { label: "Supervisor/Manager", type: "supervisorSignature" },
  signatureDate: { label: "Date", type: "date" }
};


  // Validation function to check if all required fields are filled
  const validateRequiredFields = () => {
    const missingFields: string[] = [];
    
    FORM_SECTIONS.forEach((section: any ) => {
      section.requiredFields.forEach((fieldName: any ) => {
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
  }
  finally {
    setSubmitting(false);
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

  const handleSignatureEnd = (fieldName: string, dataUrl: string) => {
    const newValues = { ...localValues, [fieldName]: dataUrl };
    setLocalValues(newValues);
    onChange(newValues, fieldName, false);
  };

  // Handle signature clear
  const handleSignatureClear = (fieldName: string) => {
    const newValues = { ...localValues, [fieldName]: "" };
    setLocalValues(newValues);
    onChange(newValues, fieldName, false);
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
          {FORM_SECTIONS.map((section: any , idx: any ) => {
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
            
            {/* Notice for Follow-up Section in Signature Link */}
            {isSignatureLink && currentStep === 5 && (
              <div className="mt-3 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="h-5 w-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-amber-800 mb-1">
                      Admin/Supervisor Section - View Only
                    </h3>
                    <p className="text-xs text-amber-700">
                      This section is reserved for supervisors and managers. You can view the information but cannot edit it. Your supervisor will complete this section after reviewing the drill.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Notice for Signatures Section in Signature Link */}
            {isSignatureLink && currentStep === 6 && (
              <div className="mt-3 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <FaSignature className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-blue-800 mb-1">
                      Signature Instructions
                    </h3>
                    <p className="text-xs text-blue-700">
                      <strong>Support Worker:</strong> Please sign in the first signature field and enter the date.<br />
                      <strong>Supervisor Signature:</strong> This will be completed by your supervisor/manager in the office.
                    </p>
                  </div>
                </div>
              </div>
            )}
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
             
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {FORM_SECTIONS[currentStep].fields.map((field: any ) => {
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
                    if (meta.type === "supportWorkerSignature") {
                      return (
                        <div key={field} className="md:col-span-2">
              {renderSignatureField(meta.label, "supportWorkerSignature", sigCanvasRef, meta.placeholder, true)}
                        </div>
                      );
                    }

                     if (meta.type === "supervisorSignature") {
                      return (
                        <div key={field} className="md:col-span-2">
              {renderSignatureField(meta.label, "supervisorSignature", sigCanvasRefManager, meta.placeholder, true)}
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
          </form>
        </section>

        {/* Navigation Buttons */}
        <footer className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-lg border-t border-gray-100 px-4 md:px-10 py-5 flex flex-col items-center gap-4 shadow-2xl rounded-b-3xl animate-fade-in mt-2">
          {/* Stepper */}
          <div className="flex flex-row justify-center items-center space-x-2 mb-2">
            {FORM_SECTIONS.map((_: any , index: any ) => (
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
              disabled={currentStep === 0 || navigatingPrev}
              className={`flex items-center justify-center space-x-1 px-5 py-2 rounded-full font-semibold transition-all text-sm shadow border duration-200 w-full md:w-1/3 ${currentStep === 0 || navigatingPrev ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200" : "bg-gradient-to-r from-gray-700 to-gray-900 text-white border-gray-700 hover:from-gray-800 hover:to-black"}`}
            >
              {navigatingPrev ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaChevronLeft className="w-4 h-4" />}
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
              onClick={() => handleSaveProgress()}
              disabled={saving || submitting}
              className="flex items-center justify-center gap-1 px-5 py-2 rounded-full font-semibold text-sm bg-gray-600 hover:bg-gray-700 text-white shadow border border-gray-700 transition-all duration-200 w-full md:w-1/3 disabled:opacity-50"
            >
              {saving ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaSave className="w-4 h-4" />}
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
    </div>
  );
};

export default HomeVisitRiskAssessmentEdit;
export function formatDateForStorage(ddmmyyyy: string): string {
  const [dd, mm, yyyy] = ddmmyyyy.split("-");
  return `${yyyy}-${mm}-${dd}`; // to YYYY-MM-DD
}

export function formatDateForDisplay(yyyymmdd: string): string {
  const [yyyy, mm, dd] = yyyymmdd.split("-");
  return `${dd}-${mm}-${yyyy}`; // to DD-MM-YYYY
}

