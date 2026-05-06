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
  isSignatureLink?: boolean; // If true, apply signature link access restrictions
  filledByClient?: boolean; // NEW: If true, form was filled via signature link (admin reviewing)
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
      "numberStreet",
      "state",
      "pincode",
      "supportWorkers",
      "supervisorNotified"
    ],
    icon: FaHome,
    requiredFields: ["drillDate", "drillTime", "clientName", "numberStreet", "state", "pincode", "supportWorkers", "supervisorNotified"] // All fields required
  },
  {
    id: "drillTypes",
    title: "Type of Drill Conducted",
    description: "Select ONE drill type that was conducted",
    fields: [
      "selectedDrillType",
      "otherDrill"
    ],
    icon: FaHome,
    requiredFields: ["selectedDrillType"] // Single drill type selection required (otherDrill is conditionally required when "Other" is selected)
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
    requiredFields: ["planFollowed", "safetyProtocols", "servicesContacted", "clientResponse", "supportAction"] // All fields required
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
    requiredFields: ["whatWentWell", "challenges", "unexpectedIssues"] // All fields required
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
    requiredFields: ["procedureChanges", "additionalTrainingRequired", "planUpdateNeeded"] // All fields required (trainingDetails/planUpdateDetails are conditionally required when "Yes" is selected)
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
    requiredFields: ["debriefConducted", "supervisorComments", "nextDrillDate"] // All fields required
  },
  {
    id: "signatures",
    title: "Signatures",
    description: "Acknowledgements",
    fields: [
      "supportWorkerSignature",
      "supportWorkerSignatureDate",
      "supervisorSignature",
      "supervisorSignatureDate"
    ],
    icon: FaHome,
    requiredFields: ["supportWorkerSignature", "supportWorkerSignatureDate", "supervisorSignature", "supervisorSignatureDate"] // All fields required
  }
];

// Helper function to count words in text
const countWords = (text: string): number => {
  if (!text || text.trim() === '') return 0;
  return text.trim().split(/\s+/).length;
};

// Helper function to check if text exceeds word limit
const exceedsWordLimit = (text: string, limit: number = 200): boolean => {
  return countWords(text) > limit;
};

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
  isSignatureLink = false, // Default to admin view
  filledByClient = false, // NEW: If true, admin is reviewing client-submitted form
  onCommonFieldsUpdated,
}: any ) => {

// Helper function to get common field value
const getCommonFieldValue = (fieldName: string): string => {
  // For clientName field, combine first name and surname to show full name
  if (fieldName === 'clientName') {
    const firstName = commonFieldsData?.name || '';
    const surname = commonFieldsData?.surname || '';
    const fullName = [firstName, surname].filter(Boolean).join(' ').trim();
    if (fullName) {
      return fullName;
    }
    // Fallback to formData.clientName if it exists
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
  
  // DEBUG: Log access control props
  useEffect(() => {
    console.log('=== Emergency Drill Access Control ===');
    console.log('isSignatureLink:', isSignatureLink);
    console.log('filledByClient:', filledByClient);
    console.log('readOnly:', readOnly);
    console.log('currentStep:', currentStep);
  }, [isSignatureLink, filledByClient, readOnly, currentStep]);
  
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
  numberStreet: formData?.numberStreet || "",
  state: formData?.state || "",
  pincode: formData?.pincode || "",
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
  supportWorkerSignatureDate: "",
  supervisorSignature: "",
  supervisorSignatureDate: "",

  // Incoming data from DB should override defaults, but filter out signature dates without signatures
  ...formData,
  
  // Clear signature dates if there's no corresponding signature
  ...(formData?.supportWorkerSignature ? {} : { supportWorkerSignatureDate: "" }),
  ...(formData?.supervisorSignature ? {} : { supervisorSignatureDate: "" }),


};


  // Initialize local values with form data, but common fields will be displayed from commonFieldsData
  const [localValues, setLocalValues] = useState<any>(initialValues);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { showToast } = useToast();

  // Clean up signature dates on component mount if they don't have corresponding signatures
  useEffect(() => {
    const cleanedValues = { ...localValues };
    let hasChanges = false;

    // Clear support worker signature date if no signature
    if (cleanedValues.supportWorkerSignatureDate && !cleanedValues.supportWorkerSignature) {
      cleanedValues.supportWorkerSignatureDate = "";
      hasChanges = true;
    }

    // Clear supervisor signature date if no signature
    if (cleanedValues.supervisorSignatureDate && !cleanedValues.supervisorSignature) {
      cleanedValues.supervisorSignatureDate = "";
      hasChanges = true;
    }

    if (hasChanges) {
      setLocalValues(cleanedValues);
      onChange(cleanedValues);
    }
  }, []); // Run only once on mount

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

  // 🎯 NEW: Helper to get the selected drill type
  const getSelectedDrillType = () => {
    return localValues['selectedDrillType'];
  };

  // 🎯 NEW: Helper to check if a drill type field should be disabled
  const isDrillTypeDisabled = (fieldName: string) => {
    // With the new single dropdown approach, only otherDrill can be conditionally disabled
    if (fieldName === 'otherDrill') {
      const selectedDrillType = getSelectedDrillType();
      // otherDrill is only enabled when "Other (specify)" is selected
      return selectedDrillType !== 'Other (specify)';
    }
    
    // All other fields are not disabled
      return false;
  };

  // Helper function to check if conditional "If yes, specify" fields should be disabled
  const isConditionalFieldDisabled = (fieldName: string): boolean => {
    // Check for training details field
    if (fieldName === 'trainingDetails') {
      const trainingRequired = localValues['additionalTrainingRequired'];
      return trainingRequired !== 'Yes';
    }
    
    // Check for plan update details field
    if (fieldName === 'planUpdateDetails') {
      const planUpdateNeeded = localValues['planUpdateNeeded'];
      return planUpdateNeeded !== 'Yes';
    }
    
    return false;
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

  // Auto-resize textareas on mount and when values change
  useEffect(() => {
    const autoResizeTextareas = () => {
      const textareas = document.querySelectorAll('textarea[data-auto-resize="true"]');
      textareas.forEach((textarea) => {
        const element = textarea as HTMLTextAreaElement;
        const rows = parseInt(element.getAttribute('data-rows') || '3');
        
        // Smooth resize with minimum height
        element.style.height = 'auto';
        const newHeight = Math.max(element.scrollHeight, rows * 24 + 16) + 'px';
        element.style.height = newHeight;
        element.style.overflow = 'hidden';
        element.style.resize = 'none';
        element.style.transition = 'height 0.1s ease-out';
      });
    };

    // Debounced auto-resize to prevent excessive calls
    const debouncedResize = setTimeout(autoResizeTextareas, 100);
    
    return () => clearTimeout(debouncedResize);
  }, [localValues, currentStep]);

  // Additional useEffect to run on component mount
  useEffect(() => {
    const autoResizeTextareas = () => {
      const textareas = document.querySelectorAll('textarea[data-auto-resize="true"]');
      textareas.forEach((textarea) => {
        const element = textarea as HTMLTextAreaElement;
        const rows = parseInt(element.getAttribute('data-rows') || '3');
        
        // Smooth resize with minimum height
        element.style.height = 'auto';
        const newHeight = Math.max(element.scrollHeight, rows * 24 + 16) + 'px';
        element.style.height = newHeight;
        element.style.overflow = 'hidden';
        element.style.resize = 'none';
        element.style.transition = 'height 0.1s ease-out';
      });
    };

    // Run on mount with delay to ensure DOM is ready
    const timeoutId = setTimeout(autoResizeTextareas, 150);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

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

 
  let newValues = { ...localValues, [name]: formattedValue };
  
  // 🎯 NEW: Clear conditional "If yes, specify" fields when parent dropdown changes to "No"
  if (name === 'additionalTrainingRequired' && value === 'No') {
    newValues = { ...newValues, trainingDetails: '' };
  }
  if (name === 'planUpdateNeeded' && value === 'No') {
    newValues = { ...newValues, planUpdateDetails: '' };
  }
  
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


  const handleNextSequential = async () => {
    // Check if current section is complete before allowing navigation
    if (!isCurrentSectionComplete()) {
      const currentSection = FORM_SECTIONS[currentStep];
      const missingFields: string[] = [];
      
      // Get missing required fields for current section
      if (filledByClient && !isSignatureLink) {
        // Admin review mode
        if (currentStep === 5) {
          const required = ['debriefConducted', 'supervisorComments', 'nextDrillDate'];
          required.forEach(field => {
            const value = localValues[field];
            if (!value || (typeof value === 'string' && value.trim() === '')) {
              missingFields.push(field);
            }
          });
        } else if (currentStep === 6) {
          const supervisorSignature = localValues['supervisorSignature'];
          const supervisorSignatureDate = localValues['supervisorSignatureDate'];
          if (!supervisorSignature || supervisorSignature.trim() === '') {
            missingFields.push('supervisorSignature');
          }
          if (!supervisorSignatureDate || supervisorSignatureDate.trim() === '') {
            missingFields.push('supervisorSignatureDate');
          }
        }
      } else if (isSignatureLink) {
        // Signature link mode
        if (currentStep === 5) {
          // Section 6 is view-only for client, no validation needed
          return;
        }
        
        if (currentStep === 1) {
          // Check if a drill type is selected
          const selectedDrillType = localValues['selectedDrillType'];
          if (!selectedDrillType || selectedDrillType === '') {
            missingFields.push('Please select a drill type');
          }
          
          // If "Other" is selected, check if otherDrill field is filled
          if (selectedDrillType === 'Other (specify)') {
            const otherDrillText = localValues['otherDrill'];
            if (!otherDrillText || otherDrillText.trim() === '') {
              missingFields.push('Please specify the other drill type');
            }
          }
        } else if (currentStep === 6) {
          // Section 7 (Signatures) - Client/Staff only needs their own signature
          const clientSignatureRequired = ['supportWorkerSignature', 'supportWorkerSignatureDate'];
          clientSignatureRequired.forEach((fieldName: string) => {
            const value = localValues[fieldName];
            if (!value || (typeof value === 'string' && value.trim() === '')) {
              missingFields.push(fieldName);
            }
          });
        } else {
          currentSection.requiredFields.forEach((fieldName: any) => {
            let value;
            if (isCommonField(fieldName)) {
              value = getCommonFieldValue(fieldName);
            } else {
              value = localValues[fieldName];
            }
            if (!value || (typeof value === 'string' && value.trim() === '')) {
              missingFields.push(fieldName);
            }
          });
        }
      } else {
        // Normal admin mode
        if (currentStep === 1) {
          // Check if a drill type is selected
          const selectedDrillType = localValues['selectedDrillType'];
          if (!selectedDrillType || selectedDrillType === '') {
            missingFields.push('Please select a drill type');
          }
          
          // If "Other" is selected, check if otherDrill field is filled
          if (selectedDrillType === 'Other (specify)') {
            const otherDrillText = localValues['otherDrill'];
            if (!otherDrillText || otherDrillText.trim() === '') {
              missingFields.push('Please specify the other drill type');
            }
          }
        } else if (currentStep === 4) { // Section 5 (Recommendations) - check specify fields
          // Check base required fields
          currentSection.requiredFields.forEach((fieldName: any) => {
            let value;
            if (isCommonField(fieldName)) {
              value = getCommonFieldValue(fieldName);
            } else {
              value = localValues[fieldName];
            }
            if (!value || (typeof value === 'string' && value.trim() === '')) {
              missingFields.push(fieldName);
            }
          });
          
          // Check required dropdown questions
          if (!localValues['additionalTrainingRequired'] || localValues['additionalTrainingRequired'] === 'Select an option') {
            missingFields.push('additionalTrainingRequired (required)');
          }
          if (!localValues['planUpdateNeeded'] || localValues['planUpdateNeeded'] === 'Select an option') {
            missingFields.push('planUpdateNeeded (required)');
          }
          
          // Check specify fields based on dropdown selections
          if (localValues['additionalTrainingRequired'] === 'Yes' && 
              (!localValues['trainingDetails'] || localValues['trainingDetails'].trim() === '')) {
            missingFields.push('trainingDetails (required when "Additional training required" is Yes)');
          }
          if (localValues['planUpdateNeeded'] === 'Yes' && 
              (!localValues['planUpdateDetails'] || localValues['planUpdateDetails'].trim() === '')) {
            missingFields.push('planUpdateDetails (required when "Updates needed for emergency plan" is Yes)');
          }
        } else if (currentStep === 4) { // Section 5 (Recommendations) - check specify fields
          // Check base required fields
          currentSection.requiredFields.forEach((fieldName: any) => {
            let value;
            if (isCommonField(fieldName)) {
              value = getCommonFieldValue(fieldName);
            } else {
              value = localValues[fieldName];
            }
            if (!value || (typeof value === 'string' && value.trim() === '')) {
              missingFields.push(fieldName);
            }
          });
          
          // Check required dropdown questions
          if (!localValues['additionalTrainingRequired'] || localValues['additionalTrainingRequired'] === 'Select an option') {
            missingFields.push('additionalTrainingRequired (required)');
          }
          if (!localValues['planUpdateNeeded'] || localValues['planUpdateNeeded'] === 'Select an option') {
            missingFields.push('planUpdateNeeded (required)');
          }
          
          // Check specify fields based on dropdown selections
          if (localValues['additionalTrainingRequired'] === 'Yes' && 
              (!localValues['trainingDetails'] || localValues['trainingDetails'].trim() === '')) {
            missingFields.push('trainingDetails (required when "Additional training required" is Yes)');
          }
          if (localValues['planUpdateNeeded'] === 'Yes' && 
              (!localValues['planUpdateDetails'] || localValues['planUpdateDetails'].trim() === '')) {
            missingFields.push('planUpdateDetails (required when "Updates needed for emergency plan" is Yes)');
          }
        } else {
          currentSection.requiredFields.forEach((fieldName: any) => {
            let value;
            if (isCommonField(fieldName)) {
              value = getCommonFieldValue(fieldName);
            } else {
              value = localValues[fieldName];
            }
            if (!value || (typeof value === 'string' && value.trim() === '')) {
              missingFields.push(fieldName);
            }
          });
        }
      }
      
      showToast({
        type: 'error',
        title: 'Required Fields Missing',
        message: `Please fill in the following required fields: ${missingFields.join(', ')}`,
        duration: 5000,
      });
      return;
    }
    
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
    const drillTypeDisabled = isDrillTypeDisabled(name); // 🎯 Check if drill type is disabled
    const conditionalDisabled = isConditionalFieldDisabled(name); // 🎯 Check if conditional field is disabled
    const fieldIsReadOnly = isFieldReadOnly(name) || isCommon || drillTypeDisabled || conditionalDisabled; // Use all helper functions
    
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-azure-600 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {fieldIsReadOnly && isSignatureLink && !isCommon && !drillTypeDisabled && currentStep === 5 && (
            <span className="ml-2 text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              View Only
            </span>
          )}
          {/* 🎯 Show badge when "Other" field is disabled due to another selection */}
          {drillTypeDisabled && name === 'otherDrill' && currentStep === 1 && (
            <span className="ml-2 text-xs text-azure-500 font-semibold bg-azure-100 px-2 py-0.5 rounded-full border border-azure-200">
              Already Selected Another Drill
            </span>
          )}
        </label>
        <input
          type={type}
          name={name}
          value={type === "date" && displayValue ? formatDateForStorage(displayValue) : (displayValue || "")}
          onChange={isCommon ? undefined : handleChange}
          placeholder={isCommon ? "Value from common fields" : (type === "date" ? "Select date" : placeholder)}
          disabled={fieldIsReadOnly}
          className={`w-full rounded-lg border border-azure-100 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder-azure-300 ${
            fieldErrors[name]
              ? "border-red-300 bg-red-50"
              : isCommon 
                ? "bg-blue-50 border-blue-200 text-blue-800"
                : drillTypeDisabled
                ? "bg-azure-100 border-azure-200 opacity-60 cursor-not-allowed"
                : conditionalDisabled
                ? "bg-azure-50 border-azure-100 opacity-50 cursor-not-allowed text-azure-300"
                : fieldIsReadOnly && isSignatureLink
                ? "bg-azure-50 border-azure-200"
                : "hover:border-accent/40"
          } ${fieldIsReadOnly ? "cursor-not-allowed" : ""}`}
        />
       
        {fieldErrors[name] && (
          <p className="text-xs text-red-500 mt-1">{fieldErrors[name]}</p>
        )}
        {/* Show helper text for "Other" field */}
        {name === 'otherDrill' && currentStep === 1 && (
          <p className="text-xs text-azure-400 mt-1">
            ℹ️ This field is only available when "Other (specify)" is selected above.
          </p>
        )}
      </div>
    );
  };

  const renderTextArea = (
    label: string,
    name: string,
    rows: number = 3,
    placeholder?: string,
    required?: boolean,
    autoResize?: boolean
  ) => {
    const isCommon = isCommonField(name);
    const displayValue = isCommon ? getCommonFieldValue(name) : (localValues[name] || "");
    const drillTypeDisabled = isDrillTypeDisabled(name); // 🎯 Check if drill type is disabled
    const conditionalDisabled = isConditionalFieldDisabled(name); // 🎯 NEW: Check if conditional field is disabled
    const fieldIsReadOnly = isFieldReadOnly(name) || isCommon || drillTypeDisabled || conditionalDisabled; // Use all helper functions
    
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-azure-600 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {fieldIsReadOnly && isSignatureLink && !isCommon && !drillTypeDisabled && currentStep === 5 && (
            <span className="ml-2 text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              View Only
            </span>
          )}
          {fieldIsReadOnly && filledByClient && !isCommon && !drillTypeDisabled && currentStep >= 0 && currentStep <= 4 && (
            <span className="ml-2 text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              Client Submitted
            </span>
          )}
          {/* 🎯 Show badge when "Other" textarea is disabled due to another selection */}
          {drillTypeDisabled && name === 'otherDrill' && currentStep === 1 && (
            <span className="ml-2 text-xs text-azure-500 font-semibold bg-azure-100 px-2 py-0.5 rounded-full border border-azure-200">
              Already Selected Another Drill
            </span>
          )}
        </label>
        <textarea
          name={name}
          value={displayValue}
          onChange={(e) => {
            if (!isCommon && !drillTypeDisabled && !conditionalDisabled) {
              const newValue = e.target.value;
              
              // Check word limit (200 words)
              if (exceedsWordLimit(newValue, 200)) {
                const wordCount = countWords(newValue);
                showToast({
                  type: 'warning',
                  title: 'Word Limit Exceeded',
                  message: `This field is limited to 200 words. You have entered ${wordCount} words. Please shorten your text.`,
                  duration: 5000
                });
                return; // Don't update the value
              }
              
              handleChange(e);
              // Smooth auto-resize functionality
              if (autoResize) {
                const textarea = e.target;
                
                // Store current scroll position to prevent jumping
                const scrollTop = textarea.scrollTop;
                
                // Reset height to auto to get accurate scrollHeight
                textarea.style.height = 'auto';
                
                // Calculate new height with padding
                const newHeight = Math.max(textarea.scrollHeight, rows * 24 + 16) + 'px';
                
                // Only update if height actually changed significantly
                const currentHeight = textarea.style.height;
                if (currentHeight !== newHeight) {
                  textarea.style.height = newHeight;
                  textarea.style.overflow = 'hidden';
                  textarea.style.resize = 'none';
                  textarea.style.transition = 'height 0.1s ease-out';
                  
                  // Restore scroll position to prevent jumping
                  textarea.scrollTop = scrollTop;
                }
              }
            }
          }}
          placeholder={isCommon ? "Value from common fields" : placeholder}
          rows={rows}
          disabled={fieldIsReadOnly}
          data-auto-resize={autoResize ? "true" : "false"}
          data-rows={rows}
          className={`w-full rounded-lg border border-azure-100 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder-azure-300 ${
            autoResize ? "resize-none overflow-hidden" : "resize-none"
          } ${
            fieldErrors[name]
              ? "border-red-300 bg-red-50"
              : isCommon 
                ? "bg-blue-50 border-blue-200 text-blue-800"
                : drillTypeDisabled
                ? "bg-azure-100 border-azure-200 opacity-60 cursor-not-allowed"
                : conditionalDisabled
                ? "bg-azure-50 border-azure-100 opacity-50 cursor-not-allowed text-azure-300"
                : fieldIsReadOnly && isSignatureLink
                ? "bg-azure-50 border-azure-200"
                : "hover:border-accent/40"
          } ${fieldIsReadOnly ? "cursor-not-allowed" : ""}`}
        />
        
        {fieldErrors[name] && (
          <p className="text-xs text-red-500 mt-1">{fieldErrors[name]}</p>
        )}
        
        {/* Show helper text for "Other" field */}
        {name === 'otherDrill' && currentStep === 1 && (
          <p className="text-xs text-azure-400 mt-1">
            ℹ️ This field is only available when "Other (specify)" is selected above.
          </p>
        )}
        
        
        {/* Word count display */}
        {!isCommon && !fieldIsReadOnly && (
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-azure-400">
              {countWords(displayValue)} / 200 words
            </p>
            {countWords(displayValue) > 180 && (
              <p className="text-xs text-amber-600">
                ⚠️ Approaching limit
              </p>
            )}
          </div>
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
    const drillTypeDisabled = isDrillTypeDisabled(name); // 🎯 NEW: Check if drill type is disabled
    const isDisabled = fieldIsReadOnly || drillTypeDisabled; // Combine both conditions
    
    return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-azure-600 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
          {fieldIsReadOnly && isSignatureLink && currentStep === 5 && (
            <span className="ml-2 text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              View Only
            </span>
          )}
          {fieldIsReadOnly && filledByClient && currentStep >= 0 && currentStep <= 4 && (
            <span className="ml-2 text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              Client Submitted
            </span>
          )}
          {/* 🎯 NEW: Show badge when drill type is disabled due to another selection */}
          {drillTypeDisabled && !fieldIsReadOnly && currentStep === 1 && (
            <span className="ml-2 text-xs text-azure-500 font-semibold bg-azure-100 px-2 py-0.5 rounded-full border border-azure-200">
              Already Selected Another Drill
            </span>
          )}
      </label>
      <select
        name={name}
        value={localValues[name] || ""}
        onChange={handleChange}
          disabled={isDisabled}
          aria-label={label}
        className={`w-full rounded-lg border border-azure-100 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all ${
          fieldErrors[name]
            ? "border-red-300 bg-red-50"
              : isDisabled
              ? "bg-azure-50 border-azure-200 cursor-not-allowed"
            : "hover:border-accent/40"
          } ${isDisabled ? "bg-azure-100 text-azure-400 opacity-60" : ""}`}
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
      {/* Show helper text for drill type selection */}
      {!fieldIsReadOnly && currentStep === 1 && name === 'selectedDrillType' && (
        <p className="text-xs text-azure-400 mt-1">
          ℹ️ Please select the type of emergency drill that was conducted.
        </p>
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
        signatureRef: any,

    placeholder?: string,
    required?: boolean,

  ) => {
    const fieldReadOnly = isFieldReadOnly(name); // Use the new helper
    
    return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-azure-600 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
          {fieldReadOnly && isSignatureLink && (
            <span className="ml-2 text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              View Only
            </span>
          )}
          {fieldReadOnly && filledByClient && name === 'supportWorkerSignature' && (
            <span className="ml-2 text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
              Staff Signed
            </span>
          )}
      </label>
        <div className={`w-full rounded-lg border ${fieldReadOnly ? 'border-azure-200 bg-azure-50' : 'border-azure-100 bg-white'} p-4 shadow-sm`}>
        <SignatureCanvas
          ref={signatureRef}
          onSignatureEnd={(dataUrl: string) => handleSignatureEnd(name, dataUrl)}
          onSignatureClear={() => handleSignatureClear(name)}
          existingSignature={localValues[name]}
          width={400}
          height={150}
            disabled={fieldReadOnly}
            placeholder={
              fieldReadOnly && isSignatureLink 
                ? "View only - signature will be added by supervisor"
                : fieldReadOnly && filledByClient && name === 'supportWorkerSignature'
                ? "Staff has already signed - view only"
                : (placeholder || "Draw your signature in the box above")
            }
        />
      </div>
      {fieldErrors[name] && (
        <p className="text-xs text-red-500 mt-1">{fieldErrors[name]}</p>
      )}
    </div>
  );
  };

  // Helper to check if "Other" field is required (when "Other (specify)" is selected)
  const isOtherDrillRequired = () => {
    if (currentStep !== 1) return false;
    const selectedDrillType = getSelectedDrillType();
    return selectedDrillType === 'Other (specify)';
  };

  // Helper to check if specify fields are required based on dropdown selections
  const isSpecifyFieldRequired = (fieldName: string) => {
    if (currentStep !== 4) return false; // Section 5 (Recommendations)
    
    // trainingDetails is required if additionalTrainingRequired is "Yes"
    if (fieldName === 'trainingDetails') {
      return localValues['additionalTrainingRequired'] === 'Yes';
    }
    
    // planUpdateDetails is required if planUpdateNeeded is "Yes"
    if (fieldName === 'planUpdateDetails') {
      return localValues['planUpdateNeeded'] === 'Yes';
    }
    
    return false;
  };

  // Helper to check if a field is required in the current section
  const isFieldRequired = (fieldName: string) => {
    const baseRequired = FORM_SECTIONS[currentStep].requiredFields || [];
    
    // Special case: selectedDrillType is required when on step 1
    if (currentStep === 1 && fieldName === 'selectedDrillType') {
      return true;
    }
    
    // Special case: "Other" field is required when all drill types are "No"
    if (fieldName === 'otherDrill' && currentStep === 1) {
      return isOtherDrillRequired();
    }
    
    // Special case: Specify fields are required when corresponding dropdown is "Yes"
    if (isSpecifyFieldRequired(fieldName)) {
      return true;
    }
    
    // Special case: Dropdown questions in Section 5 are required
    if (currentStep === 4 && ['additionalTrainingRequired', 'planUpdateNeeded'].includes(fieldName)) {
      return true;
    }
    
    // SIGNATURE LINK MODE: Client/Staff only needs their own signature fields
    if (isSignatureLink && currentStep === 6) {
      const clientSignatureRequired = ['supportWorkerSignature', 'supportWorkerSignatureDate'];
      return clientSignatureRequired.includes(fieldName);
    }
    
    // ADMIN REVIEW MODE: Override required fields for admin sections
    if (filledByClient && !isSignatureLink) {
      // Section 5 (Follow-up) - all fields required for admin
      if (currentStep === 5) {
        const adminFollowupRequired = ['debriefConducted', 'supervisorComments', 'nextDrillDate'];
        return adminFollowupRequired.includes(fieldName);
      }
      
      // Section 6 (Signatures) - supervisor signature fields required for admin
      if (currentStep === 6) {
        const adminRequiredFields = ['supervisorSignature', 'supervisorSignatureDate'];
        return adminRequiredFields.includes(fieldName);
      }
    }
    
    return baseRequired.includes(fieldName);
  };

  // NEW: Helper to check if a field should be read-only based on access mode
  const isFieldReadOnly = (fieldName: string) => {
    console.log(`=== isFieldReadOnly DEBUG for field: ${fieldName} ===`);
    console.log('isSignatureLink:', isSignatureLink);
    console.log('filledByClient:', filledByClient);
    console.log('readOnly:', readOnly);
    console.log('currentStep:', currentStep);
    
    // SIGNATURE LINK MODE (Client/Staff filling form)
    if (isSignatureLink) {
      // Section 5 (Follow-up) - ALL fields read-only (admin will complete)
      if (currentStep === 5) {
        console.log('SIGNATURE LINK: Section 5 - returning true (read-only)');
        return true;
      }
      
      // Section 6 (Signatures) - Only supervisor fields are read-only
      if (currentStep === 6 && (fieldName === 'supervisorSignature' || fieldName === 'supervisorSignatureDate')) {
        console.log('SIGNATURE LINK: Section 6 supervisor field - returning true (read-only)');
        return true;
      }
      
      // Sections 0-4: Fully editable
      // Section 6: supportWorkerSignature and supportWorkerSignatureDate editable
      console.log('SIGNATURE LINK: returning readOnly prop:', readOnly);
      return readOnly;
    }
    
    // ADMIN REVIEW MODE (Admin reviewing client-submitted form)
    if (filledByClient && !isSignatureLink) {
      console.log('ADMIN REVIEW MODE detected');
      // Sections 0-4 (1-5): Read-only (client/staff already filled)
      if (currentStep >= 0 && currentStep <= 4) {
        console.log(`ADMIN REVIEW: Section ${currentStep + 1} - returning true (read-only)`);
        return true;
      }
      
      // Section 5 (Follow-up): Editable (admin completes this)
      if (currentStep === 5) {
        console.log('ADMIN REVIEW: Section 6 (Follow-up) - returning false (editable)');
        return false;
      }
      
      // Section 6 (Signatures):
      if (currentStep === 6) {
        // supportWorkerSignature and supportWorkerSignatureDate: Read-only (staff already signed)
        if (fieldName === 'supportWorkerSignature' || fieldName === 'supportWorkerSignatureDate') {
          console.log('ADMIN REVIEW: Client signature field - returning true (read-only)');
          return true;
        }
        // supervisorSignature and supervisorSignatureDate: Editable (admin signs)
        console.log('ADMIN REVIEW: Supervisor signature field - returning false (editable)');
        return false;
      }
    }
    
    // NORMAL ADMIN MODE (Admin creating new form or form not filled by client)
    return readOnly;
  };

   const FIELD_METADATA: any  = {
  drillDate: { label: "Date of Drill", type: "date" },
  drillTime: { label: "Time of Drill", type: "time" },
  clientName: { label: "Client's Name", type: "text", placeholder: "Enter client's name" },
  numberStreet: { label: "Number/Street", type: "textarea", placeholder: "Street address", rows: 2, autoResize: true },
  state: { label: "State", type: "text", placeholder: "Enter state" },
  pincode: { label: "Pincode", type: "number", placeholder: "Enter pincode" },
  supportWorkers: { label: "Support Worker(s) Involved", type: "text" },
  supervisorNotified: { label: "Supervisor/Manager Notified", type: "dropdown", options: ["Yes", "No"] },

  selectedDrillType: { 
    label: "Type of Emergency Drill Conducted", 
    type: "dropdown", 
    options: [
      "Fire or smoke emergency",
      "Medical emergency (e.g., client collapse, choking, seizure)",
      "Gas leak or carbon monoxide alert",
      "Power outage",
      "Natural disaster (e.g., flood, earthquake)",
      "Security threat (e.g., unauthorized visitor, break-in)",
      "Other (specify)"
    ], 
    required: true 
  },
  otherDrill: { label: "Please specify other drill type", type: "textarea", rows: 3, autoResize: true, placeholder: "Please describe the type of drill conducted...", required: false },

  planFollowed: { label: "Was the emergency plan followed?", type: "dropdown", options: ["Yes", "No"] },
  safetyProtocols: { label: "Were all safety measures and protocols implemented?", type: "dropdown", options: ["Yes", "No"] },
  servicesContacted: { label: "Emergency services contacted? (if applicable)", type: "dropdown", options: ["Yes", "No"] },
  clientResponse: { label: "Client response and involvement", type: "textarea", rows: 3, autoResize: true, placeholder: "Describe how the client responded during the drill..." },
  supportAction: { label: "Support worker actions", type: "textarea", rows: 3, autoResize: true, placeholder: "Describe the actions taken by support workers..." },

  whatWentWell: { label: "What went well?", type: "textarea", rows: 3, autoResize: true, placeholder: "Describe what went well during the drill..." },
  challenges: { label: "What difficulties or challenges were encountered?", type: "textarea", rows: 3, autoResize: true, placeholder: "Describe any difficulties or challenges encountered..." },
  unexpectedIssues: { label: "Any unexpected issues?", type: "textarea", rows: 3, autoResize: true, placeholder: "Describe any unexpected issues that occurred..." },

  procedureChanges: { label: "Suggested changes to procedures", type: "textarea", rows: 3, autoResize: true, placeholder: "Describe suggested changes to procedures..." },
  additionalTrainingRequired: { label: "Additional training or support required?", type: "dropdown", options: ["Yes", "No"], required: true },
  trainingDetails: { label: "If yes, specify", type: "textarea", rows: 3, autoResize: true, placeholder: "Specify additional training or support needed..." },
  planUpdateNeeded: { label: "Updates needed for the client's emergency plan?", type: "dropdown", options: ["Yes", "No"], required: true },
  planUpdateDetails: { label: "If yes, specify", type: "textarea", rows: 3, autoResize: true, placeholder: "Specify updates needed for the emergency plan..." },

  debriefConducted: { label: "Debrief conducted?", type: "dropdown", options: ["Yes", "No"] },
  address: { label: "Address", type: "textarea", placeholder: "Enter full address", rows: 2 },
  supervisorComments: { label: "Supervisor/Manager Comments", type: "textarea", rows: 3, autoResize: true, placeholder: "Add supervisor/manager comments..." },
  nextDrillDate: { label: "Date of Next Scheduled Drill", type: "date" },

  supportWorkerSignature: { label: "Support Worker", type: "supportWorkerSignature" },
  supportWorkerSignatureDate: { label: "Support Worker Signature Date", type: "date" },
  supervisorSignature: { label: "Supervisor/Manager", type: "supervisorSignature" },
  supervisorSignatureDate: { label: "Supervisor Signature Date", type: "date" }
};


  // Check if current section is complete (for Next button validation)
  const isCurrentSectionComplete = () => {
    const currentSection = FORM_SECTIONS[currentStep];
    if (!currentSection) return true;

    // SIGNATURE LINK MODE (Client/Staff): Section 6 is view-only, always allow proceeding
    if (isSignatureLink) {
      if (currentStep === 5) { // Section 6 (Follow-up) - view-only for client, always complete
        return true;
      }
      
      if (currentStep === 1) { // Section 2: Drill type validation (ONE drill type only)
        const selectedDrillType = localValues['selectedDrillType'];
        
        // Must have a drill type selected
        if (!selectedDrillType || selectedDrillType === '') {
          return false;
        }
        
        // If "Other" is selected, check if otherDrill field is filled
        if (selectedDrillType === 'Other (specify)') {
          const otherDrillText = localValues['otherDrill'];
          return otherDrillText && otherDrillText.trim() !== '';
        }
        
        // Any other selection is valid
          return true;
      }
      
      // For other sections, check required fields
      if (currentStep === 4) { // Section 5 (Recommendations) - check specify fields
        const baseRequired = currentSection.requiredFields.every((fieldName: any) => {
          let value;
          if (isCommonField(fieldName)) {
            value = getCommonFieldValue(fieldName);
          } else {
            value = localValues[fieldName];
          }
          return value && (typeof value !== 'string' || value.trim() !== '');
        });
        
        // Check required dropdown questions
        const dropdownRequired = localValues['additionalTrainingRequired'] && localValues['additionalTrainingRequired'] !== 'Select an option' &&
                                localValues['planUpdateNeeded'] && localValues['planUpdateNeeded'] !== 'Select an option';
        
        // Check specify fields based on dropdown selections
        const trainingRequired = localValues['additionalTrainingRequired'] === 'Yes' ? 
          (localValues['trainingDetails'] && localValues['trainingDetails'].trim() !== '') : true;
        const planUpdateRequired = localValues['planUpdateNeeded'] === 'Yes' ? 
          (localValues['planUpdateDetails'] && localValues['planUpdateDetails'].trim() !== '') : true;
        
        return baseRequired && dropdownRequired && trainingRequired && planUpdateRequired;
      }
      
      // Section 7 (Signatures) - Client/Staff only needs to fill their own signature fields
      if (currentStep === 6) {
        const clientSignatureRequired = ['supportWorkerSignature', 'supportWorkerSignatureDate'];
        return clientSignatureRequired.every((fieldName: string) => {
          const value = localValues[fieldName];
          return value && (typeof value !== 'string' || value.trim() !== '');
        });
      }
      
      return currentSection.requiredFields.every((fieldName: any) => {
        let value;
        if (isCommonField(fieldName)) {
          value = getCommonFieldValue(fieldName);
        } else {
          value = localValues[fieldName];
        }
        return value && (typeof value !== 'string' || value.trim() !== '');
      });
    }

    // ADMIN REVIEW MODE: Only validate sections 5 & 6
    if (filledByClient && !isSignatureLink) {
      // Sections 0-4 (1-5): Always complete (read-only, client already filled)
      if (currentStep >= 0 && currentStep <= 4) return true;
      
      if (currentStep === 5) { // Follow-up section - ALL fields required for admin
        const required = ['debriefConducted', 'supervisorComments', 'nextDrillDate'];
        return required.every(field => {
          const value = localValues[field];
          return value && (typeof value !== 'string' || value.trim() !== '');
        });
      }
      if (currentStep === 6) { // Signatures section - BOTH supervisor signature AND date required
        const supervisorSignature = localValues['supervisorSignature'];
        const supervisorSignatureDate = localValues['supervisorSignatureDate'];
        return supervisorSignature && supervisorSignature.trim() !== '' && 
               supervisorSignatureDate && supervisorSignatureDate.trim() !== '';
      }
      return true;
    }

    // NORMAL ADMIN MODE: Check all required fields for current section
    if (currentStep === 1) { // Section 2: Drill type validation (ONE drill type only)
      const selectedDrillType = localValues['selectedDrillType'];
      
      // Must have a drill type selected
      if (!selectedDrillType || selectedDrillType === 'Select an option') {
        return false;
      }
      
      // If "Other" is selected, check if otherDrill field is filled
      if (selectedDrillType === 'Other (specify)') {
        const otherDrillText = localValues['otherDrill'];
        return otherDrillText && otherDrillText.trim() !== '';
      }
      
      // Any other selection is valid
        return true;
    }
    
    if (currentStep === 4) { // Section 5 (Recommendations) - check specify fields
      const baseRequired = currentSection.requiredFields.every((fieldName: any) => {
        let value;
        if (isCommonField(fieldName)) {
          value = getCommonFieldValue(fieldName);
        } else {
          value = localValues[fieldName];
        }
        return value && (typeof value !== 'string' || value.trim() !== '');
      });
      
      // Check required dropdown questions
      const dropdownRequired = localValues['additionalTrainingRequired'] && localValues['additionalTrainingRequired'] !== 'Select an option' &&
                              localValues['planUpdateNeeded'] && localValues['planUpdateNeeded'] !== 'Select an option';
      
      // Check specify fields based on dropdown selections
      const trainingRequired = localValues['additionalTrainingRequired'] === 'Yes' ? 
        (localValues['trainingDetails'] && localValues['trainingDetails'].trim() !== '') : true;
      const planUpdateRequired = localValues['planUpdateNeeded'] === 'Yes' ? 
        (localValues['planUpdateDetails'] && localValues['planUpdateDetails'].trim() !== '') : true;
      
      return baseRequired && dropdownRequired && trainingRequired && planUpdateRequired;
    }
    
    return currentSection.requiredFields.every((fieldName: any) => {
      let value;
        if (isCommonField(fieldName)) {
          value = getCommonFieldValue(fieldName);
        } else {
          value = localValues[fieldName];
        }
      return value && (typeof value !== 'string' || value.trim() !== '');
    });
  };

  // Validation function to check if all required fields are filled (for form submission)
  const validateRequiredFields = () => {
    const missingFields: string[] = [];
    
    // ADMIN REVIEW MODE: Only validate supervisor sections (5 & 6)
    if (filledByClient && !isSignatureLink) {
      // Section 5 (Follow-up) - all fields required
      const followupRequired = ['debriefConducted', 'supervisorComments', 'nextDrillDate'];
      followupRequired.forEach((fieldName: any) => {
        const value = localValues[fieldName];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          missingFields.push(`Follow-up: ${fieldName}`);
        }
      });
      
      // Section 6 (Signatures) - supervisor signature and date required
      const signatureRequired = ['supervisorSignature', 'supervisorSignatureDate'];
      signatureRequired.forEach((fieldName: any) => {
        const value = localValues[fieldName];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          missingFields.push(`Signature: ${fieldName}`);
        }
      });
    } else if (isSignatureLink) {
      // SIGNATURE LINK MODE: Validate sections 1-5 and 7 (client/staff sections)
      FORM_SECTIONS.forEach((section: any, index: number) => {
        // Skip Follow-up section (index 5) - admin completes it
        if (index === 5) return;
        
        if (index === 1) { // Section 2: Drill type validation (ONE drill type only)
          // Check if a drill type is selected
          const selectedDrillType = localValues['selectedDrillType'];
          if (!selectedDrillType || selectedDrillType === 'Select an option') {
            missingFields.push(`${section.title}: Please select a drill type`);
          }
          
          // If "Other" is selected, check if otherDrill field is filled
          if (selectedDrillType === 'Other (specify)') {
            const otherDrillText = localValues['otherDrill'];
            if (!otherDrillText || otherDrillText.trim() === '') {
              missingFields.push(`${section.title}: Please specify the other drill type`);
            }
          }
        } else if (index === 4) { // Section 5 (Recommendations) - check specify fields
          // Check base required fields
          section.requiredFields.forEach((fieldName: any) => {
            let value;
            if (isCommonField(fieldName)) {
              value = getCommonFieldValue(fieldName);
            } else {
              value = localValues[fieldName];
            }
            if (!value || (typeof value === 'string' && value.trim() === '')) {
              missingFields.push(`${section.title}: ${fieldName}`);
            }
          });
          
          // Check required dropdown questions
          if (!localValues['additionalTrainingRequired'] || localValues['additionalTrainingRequired'] === 'Select an option') {
            missingFields.push(`${section.title}: additionalTrainingRequired (required)`);
          }
          if (!localValues['planUpdateNeeded'] || localValues['planUpdateNeeded'] === 'Select an option') {
            missingFields.push(`${section.title}: planUpdateNeeded (required)`);
          }
          
          // Check specify fields based on dropdown selections
          if (localValues['additionalTrainingRequired'] === 'Yes' && 
              (!localValues['trainingDetails'] || localValues['trainingDetails'].trim() === '')) {
            missingFields.push(`${section.title}: trainingDetails (required when "Additional training required" is Yes)`);
          }
          if (localValues['planUpdateNeeded'] === 'Yes' && 
              (!localValues['planUpdateDetails'] || localValues['planUpdateDetails'].trim() === '')) {
            missingFields.push(`${section.title}: planUpdateDetails (required when "Updates needed for emergency plan" is Yes)`);
          }
        } else if (index === 6) { // Section 7 (Signatures) - Client/Staff only needs their own signature
          const clientSignatureRequired = ['supportWorkerSignature', 'supportWorkerSignatureDate'];
          clientSignatureRequired.forEach((fieldName: string) => {
            const value = localValues[fieldName];
            if (!value || (typeof value === 'string' && value.trim() === '')) {
              missingFields.push(`${section.title}: ${fieldName}`);
            }
          });
        } else {
          section.requiredFields.forEach((fieldName: any) => {
            let value;
        if (isCommonField(fieldName)) {
          value = getCommonFieldValue(fieldName);
        } else {
          value = localValues[fieldName];
        }
            if (!value || (typeof value === 'string' && value.trim() === '')) {
              missingFields.push(`${section.title}: ${fieldName}`);
            }
          });
        }
      });
    } else {
      // NORMAL ADMIN MODE: Check all sections
      FORM_SECTIONS.forEach((section: any, index: number) => {
        if (index === 1) { // Section 2: Drill type validation (ONE drill type only)
          // Check if a drill type is selected
          const selectedDrillType = localValues['selectedDrillType'];
          if (!selectedDrillType || selectedDrillType === 'Select an option') {
            missingFields.push(`${section.title}: Please select a drill type`);
          }
          
          // If "Other" is selected, check if otherDrill field is filled
          if (selectedDrillType === 'Other (specify)') {
            const otherDrillText = localValues['otherDrill'];
            if (!otherDrillText || otherDrillText.trim() === '') {
              missingFields.push(`${section.title}: Please specify the other drill type`);
            }
          }
        } else if (index === 4) { // Section 5 (Recommendations) - check specify fields
          // Check base required fields
          section.requiredFields.forEach((fieldName: any) => {
            let value;
            if (isCommonField(fieldName)) {
              value = getCommonFieldValue(fieldName);
            } else {
              value = localValues[fieldName];
            }
            if (!value || (typeof value === 'string' && value.trim() === '')) {
              missingFields.push(`${section.title}: ${fieldName}`);
            }
          });
          
          // Check required dropdown questions
          if (!localValues['additionalTrainingRequired'] || localValues['additionalTrainingRequired'] === 'Select an option') {
            missingFields.push(`${section.title}: additionalTrainingRequired (required)`);
          }
          if (!localValues['planUpdateNeeded'] || localValues['planUpdateNeeded'] === 'Select an option') {
            missingFields.push(`${section.title}: planUpdateNeeded (required)`);
          }
          
          // Check specify fields based on dropdown selections
          if (localValues['additionalTrainingRequired'] === 'Yes' && 
              (!localValues['trainingDetails'] || localValues['trainingDetails'].trim() === '')) {
            missingFields.push(`${section.title}: trainingDetails (required when "Additional training required" is Yes)`);
          }
          if (localValues['planUpdateNeeded'] === 'Yes' && 
              (!localValues['planUpdateDetails'] || localValues['planUpdateDetails'].trim() === '')) {
            missingFields.push(`${section.title}: planUpdateDetails (required when "Updates needed for emergency plan" is Yes)`);
          }
        } else {
          section.requiredFields.forEach((fieldName: any) => {
            let value;
            if (isCommonField(fieldName)) {
              value = getCommonFieldValue(fieldName);
            } else {
              value = localValues[fieldName];
            }
            if (!value || (typeof value === 'string' && value.trim() === '')) {
              missingFields.push(`${section.title}: ${fieldName}`);
            }
          });
        }
    });
    }
    
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
    const now = new Date();
    const formattedDate = formatDateForDisplay(now.toISOString().split("T")[0]);
    
    const newValues = { 
      ...localValues, 
      [fieldName]: dataUrl,
      // Automatically set the corresponding date when signature is provided
      ...(fieldName === 'supportWorkerSignature' && { supportWorkerSignatureDate: formattedDate }),
      ...(fieldName === 'supervisorSignature' && { supervisorSignatureDate: formattedDate })
    };
    setLocalValues(newValues);
    onChange(newValues, fieldName, false);
  };

  // Handle signature clear
  const handleSignatureClear = (fieldName: string) => {
    const newValues = { 
      ...localValues, 
      [fieldName]: "",
      // Clear the corresponding date when signature is cleared
      ...(fieldName === 'supportWorkerSignature' && { supportWorkerSignatureDate: "" }),
      ...(fieldName === 'supervisorSignature' && { supervisorSignatureDate: "" })
    };
    setLocalValues(newValues);
    onChange(newValues, fieldName, false);
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
          {FORM_SECTIONS.map((section: any , idx: any ) => {
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

            {/* Notice for Admin Review Mode - Client Submitted Sections */}
            {filledByClient && !isSignatureLink && currentStep >= 0 && currentStep <= 4 && (
              <div className="mt-3 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-blue-800 mb-1">
                      Client/Staff Submitted Data - View Only
                    </h3>
                    <p className="text-xs text-blue-700">
                      This section was completed by the client and support worker. You can review the information but cannot edit it. Please proceed to the Follow-up section to complete your part.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Notice for Admin Review Mode - Follow-up Section */}
            {filledByClient && !isSignatureLink && currentStep === 5 && (
              <div className="mt-3 p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-green-800 mb-1">
                      Supervisor Section - Your Input Required
                    </h3>
                    <p className="text-xs text-green-700">
                      Please complete this Follow-up section. Review the drill details from previous sections and provide your supervisor feedback and next scheduled drill date.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Notice for Admin Review Mode - Signatures Section */}
            {filledByClient && !isSignatureLink && currentStep === 6 && (
              <div className="mt-3 p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <FaSignature className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-green-800 mb-1">
                      Supervisor Signature Required
                    </h3>
                    <p className="text-xs text-green-700">
                      The support worker has already signed this form. Please add your supervisor signature and verify the date to complete the approval process.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 🎯 NEW: Notice for Section 2 - One Drill Type Only (Only show for staff filling via signature link) */}
            {currentStep === 1 && isSignatureLink && (
              <div className="mt-3 p-4 bg-azure-50 border-l-4 border-azure-500 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="h-5 w-5 text-azure-700" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-azure-800 mb-1">
                      Select ONE Drill Type Only
                    </h3>
                    <p className="text-xs text-azure-700">
                      This form documents a single emergency drill. Please select the drill type that was conducted from the dropdown below. If "Other (specify)" is selected, you can provide a custom description.
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
                    
                    // Conditional rendering for otherDrill field - only show when "Other (specify)" is selected
                    if (field === 'otherDrill') {
                      const selectedDrillType = localValues['selectedDrillType'];
                      if (selectedDrillType !== 'Other (specify)') {
                        return null; // Don't render the field
                      }
                    }
                    
                    if (meta.type === "textarea") {
                      return (
                        <div key={field} className="md:col-span-2">
                          {renderTextArea(meta.label, field, meta.rows || 3, meta.placeholder, required, meta.autoResize)}
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
        <footer className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-lg border-t border-azure-50 px-4 md:px-10 py-5 flex flex-col items-center gap-4 shadow-2xl rounded-b-3xl animate-fade-in mt-2">
          {/* Stepper */}
          <div className="flex flex-row justify-center items-center space-x-2 mb-2">
            {FORM_SECTIONS.map((_: any , index: any ) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full border duration-200 ${index === currentStep ? "bg-blue-600 border-blue-600 shadow" : index < currentStep ? "bg-green-500 border-green-500" : "bg-azure-200 border-azure-200"}`}
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
              className={`flex items-center justify-center space-x-1 px-5 py-2 rounded-full font-semibold transition-all text-sm shadow border duration-200 w-full md:w-1/3 ${(currentStep === FORM_SECTIONS.length - 1 || !isCurrentSectionComplete() || navigatingNext) ? "bg-azure-100 text-azure-300 cursor-not-allowed border-azure-100" : "bg-gradient-to-r from-azure-700 to-green-400 text-white border-azure-700 hover:from-azure-800 hover:to-green-500"}`}
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

