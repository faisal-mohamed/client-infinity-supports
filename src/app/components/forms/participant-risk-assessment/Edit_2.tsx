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
  FaNotesMedical,
  FaPhoneAlt,
  FaUsers,
  FaExclamationTriangle,
  FaWheelchair,
  FaPills,
  FaThermometerHalf,
  FaThermometerFull,
  FaTable,
  FaComments,
  FaPenNib,
  FaListAlt,

} from "react-icons/fa";
import { useToast } from "@/components/ui/Toast";

import SignatureCanvas, {
  SignatureCanvasRef,
} from "@/components/ui/SignatureCanvas";
import { RISK_LEVEL_DETAILS, RISK_TEMPLATES } from "./constants";
import { showAsRequired } from "@jsonforms/core";



// Match Client Intake form's custom spinner (hourglass emoji)
const FaSpinner = ({ className }: { className?: string }) => <span className={className}>⏳</span>;

// Auto-resizing textarea component
const AutoResizeTextArea: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  placeholder?: string;
  required?: boolean;
  maxWords?: number;
  readOnly?: boolean;
  fieldError?: string;
}> = ({
  label,
  name,
  value,
  onChange,
  rows = 3,
  placeholder,
  required,
  maxWords,
  readOnly,
  fieldError
}) => {
    const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

    // Auto-resize logic
    const adjustHeight = React.useCallback(() => {
      const textarea = textAreaRef.current;
      if (textarea) {
        textarea.style.height = 'auto'; // Reset height to recalculate
        textarea.style.height = `${Math.max(textarea.scrollHeight, rows * 24)}px`; // Set to scrollHeight but respect min rows
      }
    }, [rows]);

    // Adjust height on value change (initial load + dynamic updates)
    React.useLayoutEffect(() => {
      adjustHeight();
    }, [value, adjustHeight]);

    // Calculate word count
    const wordCount = value ? value.trim().split(/\s+/).filter((word: string) => word.length > 0).length : 0;
    const isOverLimit = maxWords ? wordCount > maxWords : false;

    return (
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {maxWords && (
            <span className={`text-xs font-medium ${isOverLimit
              ? 'text-red-600'
              : wordCount > maxWords * 0.9
                ? 'text-orange-500'
                : 'text-gray-500'
              }`}>
              {wordCount}/{maxWords} words {isOverLimit && '⚠️'}
            </span>
          )}
        </div>
        <textarea
          ref={textAreaRef}
          name={name}
          value={value}
          onChange={(e) => {
            onChange(e);
            adjustHeight();
          }}
          onInput={adjustHeight}
          placeholder={placeholder}
          rows={rows}
          style={{ transition: 'height 0.2s ease', overflow: 'hidden' }}
          disabled={readOnly}
          className={`w-full rounded-lg border ${isOverLimit ? 'border-red-400' : 'border-gray-200'
            } bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 ${isOverLimit ? 'focus:ring-red-400' : 'focus:ring-indigo-500'
            } focus:border-indigo-500 transition-all placeholder-gray-400 resize-none ${fieldError
              ? "border-red-300 bg-red-50"
              : "hover:border-indigo-400/40"
            } ${readOnly ? "cursor-not-allowed" : ""}`}
        />
        {isOverLimit && maxWords && (
          <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
            <span>⚠️</span>
            <span>Exceeds word limit by {wordCount - maxWords} words. Please reduce content.</span>
          </p>
        )}
        {fieldError && (
          <p className="text-xs text-red-500 mt-1">{fieldError}</p>
        )}
      </div>
    );
  };


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
  saving?: boolean;
  onCommonFieldsUpdated?: () => void;
}

export const FORM_SECTIONS: any = [
  {
    id: "participantDetails",
    title: "Participant Details",
    icon: FaUser,
    description: "Basic details of the participant",
    fields: [
      "ndisNumber",
      "givenNames",
      "familyName",
      "preferredName",
      "dob",
      "address",
      "phoneNumber",
      "preferredContact",
      "email",
    ],

    requiredFields: []
  },
  {
    id: "knownMedicalConditions",
    title: "Medical Conditions",
    icon: FaNotesMedical,
    description: "Medical background of the participant",
    fields: ["medicalSpecify1", "medicalEffect1", "medicalTreatment1", "medicalSpecify2", "medicalEffect2", "medicalTreatment2", "medicalSpecify3", "medicalEffect3", "medicalTreatment3",],
    requiredFields: []

  },
  {
    id: "knownMedicalConditionsEmergency",
    title: "Emergency Contact",
    icon: FaNotesMedical,
    description: "Emergency Contact",
    fields: ["emergencyContactName",
      "emergencyContactPhone",
      "emergencyContactEmail",],
    requiredFields: []

  },


  {
    id: "personsInvolved",
    title: "Persons Involved",
    icon: FaUsers,
    description: "Participants and others involved in the event",
    fields: [
      "participantInvolved",
      "participantInvolvedReason",
      "staffInvolved",
      "othersInvolved",
    ],
    requiredFields: []

  },
  {
    id: "riskGroupQuestions",
    title: "Risk Assessment",
    icon: FaExclamationTriangle,
    description: "Risk-related questions",
    fields: [
      "risk1",
      "risk2",
      "risk3",
      "risk4",
      "risk5",
      "risk6",
      "risk7",
      "risk8",
      "risk9",
    ],
    requiredFields: []

  },
  {
    id: "behavioralAndMobility",
    title: "Behavior & Mobility",
    icon: FaWheelchair,
    description: "Behavioral history and mobility",
    fields: [
      "noiseSensitive",
      "familyBehavioralHistory",
      "behaviorPractitionerInvolved", // Standalone question
      "mobilityIssues",
      "showeringToiletingHazards",
      "medicationRiskDepression",
      "medicationRiskYesNo",
      "medicationRiskComment",
    ],
    requiredFields: []

  },
  {
    id: "medicationSupport",
    title: "Management of Medication",
    icon: FaPills,
    description: "Type of medication support needed",
    fields: [
      "promptMedicationRequired",
      "assistanceMedicationRequired",
      "adminMedicationRequired",
      "noMedicationRequired",
    ],
    requiredFields: []

  },

  {
    id: "riskLevelSummary",
    title: "Risk Level Summary",
    icon: FaListAlt,
    description: "Select the final severity level and view guidance",
    fields: ["selectedRiskLevel"],
    requiredFields: [],

  },
  {
    id: 'participantSafe',
    title: 'Participant Household Safe Meeting Point',
    icon: FaPills,
    description: '',
    fields: ['householdSafeAddress', 'householdSafeDesc'],
    requiredFields: []
  },

  {
    id: "riskAssessmentTable",
    title: "Risk Assessment Table",
    icon: FaTable,
    description: "Hazard control and accountability",
    fields: [
      "safeMeetingAddress",
      "safeMeetingDescription",
      ...Array.from({ length: 10 }, (_, i) => [
        `issue${i + 1}`,
        `score${i + 1}`,
        `control${i + 1}`,
        `person${i + 1}`,
      ]).flat(),
    ],
    requiredFields: []

  },
  {
    id: "communication",
    title: "Pandemic & Communication",
    icon: FaComments,
    description: "Mode of Communication assessment for non-verbal participants (e.g., Sign language, pictures, body movement)",
    fields: ["scenario1", "mode1", "scenario2", "mode2"],
    requiredFields: []

  },
  {
    id: "signatures",
    title: "Signatures and Review",
    icon: FaPenNib,
    description: "Authorizations and reviews",
    fields: [
      "authorisedBy",
      "role",
      "signature",
      "signatureDate",
      "guardianSignature",
      "guardianDate",
      "copySupplied",
      "copyOnFile",
      "reviewDate",
    ],
    requiredFields: ['signatureDate', 'guardianSignature', 'guardianDate', 'signature']

  },
];

const commonFieldsMapping: Record<string, string> = {
  givenNames: "name",
  ndisNumber: "ndis",
  dob: "dob",
  address: "street",
  sex: "sex",
  dateOfBirth: "dob",
  addressNumberStreet: "street",
  state: "state",
  postcode: "postCode",
  email: "email",
  phoneNumber: "phone",
  disabilityConditions: "disability",
  familyName: 'surname',
};

// Helper function to check if a field is a common field
const isCommonField = (fieldName: string): boolean => {
  return Object.keys(commonFieldsMapping).includes(fieldName);
};

const yesNoOptions = ["Yes", "No"];
const ratingOptions = ["1", "2", "3", "4"];

const HomeVisitRiskAssessmentEdit: React.FC<FormProps> = ({
  formData,
  commonFieldsData,
  onChange,
  onSubmit,
  saving = false,
  readOnly = false,
  fieldErrors = {},
  handleSave, // Legacy function
  handleSaveProgress, // New: separate save function
  handleSubmitForm, // New: separate submit function
  onCommonFieldsUpdated,
}: any) => {
  // Helper function to get common field value
  const formatDateForInput = (ddmmyyyy: string): string => {
    if (!ddmmyyyy || typeof ddmmyyyy !== "string") return "";
    const [dd, mm, yyyy] = ddmmyyyy.split("-");
    if (!dd || !mm || !yyyy) return "";
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  };

  const getCommonFieldValue = (fieldName: string): string => {
    const commonKey = commonFieldsMapping[fieldName];
    const rawValue = commonFieldsData?.[commonKey] || "";

    // If it's a date field, convert DD-MM-YYYY to YYYY-MM-DD
    if (["dob", "dateOfBirth", "signatureDate", "guardianDate", "reviewDate"].includes(fieldName)) {
      return formatDateForInput(rawValue);
    }

    return rawValue;
  };


  useEffect(() => {
    console.log("Common fields data updated:", commonFieldsData);
  }, [commonFieldsData]);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [maxStep, setMaxStep] = useState(0);
  const [navigatingNext, setNavigatingNext] = useState(false);
  const [navigatingPrev, setNavigatingPrev] = useState(false);
  const [showSaveSpinner, setShowSaveSpinner] = useState(false);



  const addRiskRow = () => {
    const next = Math.max(...activeRiskRows) + 1;
    if (next <= 10) {
      setActiveRiskRows((prev) => [...prev, next]);
    }
  };

  const getInitialMedicalConditionCount = () => {
    let count = 0;
    for (let i = 1; i <= 3; i++) {
      if (
        formData?.[`medicalSpecify${i}`] ||
        formData?.[`medicalEffect${i}`] ||
        formData?.[`medicalTreatment${i}`]
      ) {
        count = i;
      }
    }
    return count || 1; // Show at least 1 by default
  };

  const [medicalConditionCount, setMedicalConditionCount] = useState(getInitialMedicalConditionCount());
  const handleAddMoreMedicalCondition = () => {
    if (medicalConditionCount < 3) {
      setMedicalConditionCount(medicalConditionCount + 1);
    }
  };




  // Signature canvas ref
  const sigCanvasRef: any = useRef<SignatureCanvasRef | null>(null);
  const sigCanvasRefGuardian: any = useRef<SignatureCanvasRef | null>(null);


  const initialValues = {
    // Page 1: Participant Details
    ndisNumber: "",
    givenNames: "",
    familyName: "",
    preferredName: "",
    dob: "",
    address: "",
    phoneNumber: "",
    preferredContact: "",
    email: "",

    // Known Medical Conditions
    medicalSpecify: "",
    medicalEffect: "",
    medicalTreatment: "",

    // Emergency Contact
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactEmail: "",

    // Persons Involved
    participantInvolved: "",
    participantInvolvedReason: "",
    staffInvolved: "",
    othersInvolved: "",

    // Page 2: Risk Questions
    risk1: "",
    risk1Comment: "",
    risk1Rating: "",
    risk2: "",
    risk2Comment: "",
    risk2Rating: "",
    risk3: "",
    risk3Comment: "",
    risk3Rating: "",
    risk4: "",
    risk4Comment: "",
    risk4Rating: "",
    risk5: "",
    risk5Comment: "",
    risk5Rating: "",
    risk6: "",
    risk6Comment: "",
    risk6Rating: "",
    risk7: "",
    risk7Comment: "",
    risk7Rating: "",
    risk8: "",
    risk8Comment: "",
    risk8Rating: "",
    risk9: "",
    risk9Comment: "",
    risk9Rating: "",

    // Page 3: Behavioral & Mobility
    noiseSensitive: "",
    familyBehavioralHistory: "",
    behaviorPractitionerInvolved: "",
    mobilityIssues: "",
    showeringToiletingHazards: "",
    medicationRespDepression: [],
    medicationRiskYesNo: "",
    medicationRiskComment: "",

    // Page 4: Medication Requirements
    promptMedicationRequired: false,
    assistanceMedicationRequired: false,
    adminMedicationRequired: false,
    noMedicationRequired: false,

    // Page 5: Risk Levels Low/Moderate
    riskLevelLow: false,
    riskLevelModerate: false,

    // Page 6: Risk Levels High/Critical
    riskLevelHigh: false,
    riskLevelCritical: false,

    selectedRiskLevel: "", // New: selected risk level for summary

    // Page 7: Safe Meeting Point
    safeMeetingAddress: "",
    safeMeetingDescription: "",

    // Risk Table (10 rows)
    ...Object.fromEntries(
      Array.from({ length: 10 }, (_, i) => {
        const index = i + 1;
        return [
          [`issue${index}`, ""],
          [`score${index}`, ""],
          [`control${index}`, ""],
          [`person${index}`, ""],
        ];
      }).flat()
    ),

    // Page 11: Communication
    scenario1: "",
    mode1: "",
    scenario2: "",
    mode2: "",

    // Page 13: Signatures and Review


    ...formData,

    authorisedBy: "",
    role: "",
    signature: "",
    signatureDate: "",
    guardianSignature: "",
    guardianDate: "",
    copySupplied: false,
    copyOnFile: false,
    reviewDate: "",
  };


  const getInitialRiskRows = (formValues: Record<string, any>) => {
    const rows: number[] = [];
    for (let i = 1; i <= 10; i++) {
      const hasValue =
        formValues[`issue${i}`] ||
        formValues[`score${i}`] ||
        formValues[`control${i}`] ||
        formValues[`person${i}`];
      if (hasValue) rows.push(i);
    }
    return rows.length > 0 ? rows : [1]; // fallback to 1 row if nothing is filled
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
  // Note: 'saving' state comes from parent component via props
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  // Track pending changes to common fields (simplified since common fields are now read-only)
  const [pendingCommonFieldChanges, setPendingCommonFieldChanges] = useState<
    Record<string, any>
  >({});

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
    const { name } = e.target;
    let { value } = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

    // Prevent changes to common fields
    if (isCommonField(name)) {
      showToast({
        type: "info",
        title: "Common Field",
        message:
          "This field can only be updated from the client's common details section.",
        duration: 3000,
      });
      return;
    }

    // Domain-specific input sanitization and validation
    if (name === "emergencyContactPhone") {
      // Allow digits, spaces, parentheses, dash, and optional leading plus for country codes
      value = value.replace(/[^0-9+()\-\s]/g, "");
      const phone = String(value).trim();
      if (phone.length > 0) {
        const isValidPhone = /^\+?[\d\s()\-]{6,20}$/.test(phone);
        setLocalErrors((prev) => ({
          ...prev,
          emergencyContactPhone: isValidPhone ? "" : "Enter a valid phone number (e.g., +61 401 234 567).",
        }));
      } else {
        setLocalErrors((prev) => ({ ...prev, emergencyContactPhone: "" }));
      }
    }
    if (name === "emergencyContactEmail") {
      const email = String(value).trim();
      if (email.length > 0) {
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        setLocalErrors((prev) => ({
          ...prev,
          emergencyContactEmail: isValidEmail ? "" : "Please enter a valid email address.",
        }));
      } else {
        setLocalErrors((prev) => ({ ...prev, emergencyContactEmail: "" }));
      }
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
    const section = FORM_SECTIONS[currentStep];
    const required = section.requiredFields || [];

    // 1. Check explicitly required fields
    const requiredFilled = required.every((key: any) => {
      let value;
      if (isCommonField(key)) {
        value = getCommonFieldValue(key);
      } else {
        value = localValues[key];
      }

      return (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0)
      );
    });

    if (!requiredFilled) return false;

    // 2. Check conditional "Other" fields: If "Other" is selected, the specific input must be filled
    const fields = section.fields || [];
    return fields.every((key: string) => {
      const meta = FIELD_METADATA[key];
      // If it's a dropdown with showIfOther config AND the current value is "Other"
      if (meta?.type === "dropdown" && meta?.showIfOther && localValues[key] === "Other") {
        const otherValue = localValues[meta.showIfOther.inputName];
        return otherValue !== undefined && otherValue !== null && String(otherValue).trim() !== "";
      }
      return true;
    });
  };

  const handleNextSequential = async () => {
    // Non-blocking: navigate immediately, save in background
    setShowSaveSpinner(false);
    setNavigatingNext(true);
    handleNext();
    try {
      await handleSaveProgress();
    } catch (e) {
      // saving failure is already toasting in parent in most flows; ignore here
    } finally {
      setNavigatingNext(false);
    }
  };

  const handlePreviousSequential = async () => {
    if (currentStep > 0) {
      // Non-blocking: navigate immediately, save in background
      setShowSaveSpinner(false);
      setNavigatingPrev(true);
      setCurrentStep(currentStep - 1);
      try {
        await handleSaveProgress();
      } catch (e) {
        // parent toasts
      } finally {
        setNavigatingPrev(false);
      }
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
    const displayValue = isCommon
      ? getCommonFieldValue(name)
      : localValues[name] || "";
    const isFieldReadOnly = readOnly || isCommon;
    const mergedError = (fieldErrors as any)?.[name] || localErrors[name];

    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          type={name === "emergencyContactPhone" ? "tel" : type}
          name={name}
          value={displayValue}
          onChange={isCommon ? undefined : handleChange}
          placeholder={isCommon ? "Value from common fields" : placeholder}
          disabled={isFieldReadOnly}
          inputMode={name === "emergencyContactPhone" ? "tel" : undefined}
          pattern={name === "emergencyContactPhone" ? "[0-9+()\\-\\s]*" : undefined}
          className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder-gray-400 ${mergedError
            ? "border-red-300 bg-red-50"
            : isCommon
              ? "bg-blue-50 border-blue-200 text-blue-800"
              : "hover:border-accent/40"
            } ${isFieldReadOnly ? "cursor-not-allowed" : ""}`}
        />

        {mergedError && (
          <p className="text-xs text-red-500 mt-1">{mergedError}</p>
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
    const displayValue = isCommon
      ? getCommonFieldValue(name)
      : localValues[name] || "";
    const isFieldReadOnly = readOnly || isCommon;
    const mergedError = (fieldErrors as any)?.[name] || localErrors[name];

    return (
      <AutoResizeTextArea
        label={label}
        name={name}
        value={displayValue}
        onChange={isCommon ? (() => { }) as any : handleChange}
        rows={rows}
        placeholder={placeholder}
        required={required}
        readOnly={isFieldReadOnly}
        fieldError={mergedError}
      />
    );
  };

  const renderDropdown = (
    label: string,
    name: string,
    options: string[],
    showComments?: boolean,
    required?: boolean,
    showIfOther?: { label: string; inputName: string }
  ) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        name={name}
        value={localValues[name] || ""}
        onChange={(e) => {
          handleChange(e);
          if (showIfOther && e.target.value !== "Other") {
            setLocalValues((prev: Record<string, any>) => ({
              ...prev,
              [showIfOther.inputName]: "",
            }));
          }
        }}
        disabled={readOnly}
        aria-label={`Select ${label}`}
        title={`Select ${label}`}
        className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all ${fieldErrors[name]
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

      {/* Conditional input for "Other" option */}
      {showIfOther && localValues[name] === "Other" && (
        <div className="mt-3 pl-4 border-l-4 border-indigo-300 bg-indigo-50 rounded-xl py-2">
          {renderInput(
            showIfOther.label,
            showIfOther.inputName,
            "text",
            "Please specify...",
            localValues[name] === "Other" // Make it required if selected
          )}
        </div>
      )}

      {showComments && (
        <div className="mt-3">
          {renderTextArea(
            "Comments",
            `${name}_comments`,
            2,
            "Add any additional comments..."
          )}
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
        className={`text-xs font-medium mb-1 ${fieldErrors[name] ? "text-red-500" : "text-gray-700"
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
          {renderTextArea(
            "Comments",
            `${name}_comments`,
            2,
            "Add any additional comments..."
          )}
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

  ) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <SignatureCanvas
          ref={signatureRef}
          onSignatureEnd={(dataUrl: string) => handleSignatureEnd(name, dataUrl)}
          onSignatureClear={() => handleSignatureClear(name)}
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

  const FIELD_METADATA: Record<string, any> = {
    // Participant Details
    ndisNumber: {
      label: "NDIS Number",
      type: "text",
      placeholder: "Enter NDIS Number",
    },
    givenNames: {
      label: "Given name/s",
      type: "text",
      placeholder: "Enter given names",
    },
    familyName: {
      label: "Family name",
      type: "text",
      placeholder: "Enter family name",
    },
    preferredName: {
      label: "Preferred name",
      type: "text",
      placeholder: "Enter preferred name",
    },
    dob: {
      label: "Date of Birth",
      type: "date",
      placeholder: "Select date of birth",
    },
    address: { label: "Address", type: "text", placeholder: "Enter address" },
    phoneNumber: {
      label: "Phone Number",
      type: "text",
      placeholder: "Enter phone number",
    },
    preferredContact: {
      label: "Preferred Contact Method",
      type: "text",
      placeholder: "Enter preferred contact method",
    },
    email: { label: "Email", type: "text", placeholder: "Enter email address" },

    // Known Medical Conditions
    medicalSpecify1: {
      label: "Specify",
      type: "text",
      placeholder: "Specify condition 1",
    },
    medicalEffect1: {
      label: "Effect",
      type: "text",
      placeholder: "Effect of condition 1",
    },
    medicalTreatment1: {
      label: "Treatment",
      type: "text",
      placeholder: "Treatment given 1",
    },
    medicalSpecify2: {
      label: "Specify",
      type: "text",
      placeholder: "Specify condition 2",
    },
    medicalEffect2: {
      label: "Effect",
      type: "text",
      placeholder: "Effect of condition 2",
    },
    medicalTreatment2: {
      label: "Treatment",
      type: "text",
      placeholder: "Treatment given 2",
    },
    medicalSpecify3: {
      label: "Specify",
      type: "text",
      placeholder: "Specify condition 3",
    },
    medicalEffect3: {
      label: "Effect",
      type: "text",
      placeholder: "Effect of condition 3",
    },
    medicalTreatment3: {
      label: "Treatment",
      type: "text",
      placeholder: "Treatment given 3",
    },

    // Emergency Contact
    emergencyContactName: {
      label: "Emergency Contact Name",
      type: "text",
      placeholder: "Name of emergency contact",
    },
    emergencyContactPhone: {
      label: "Emergency Contact Phone",
      type: "text",
      placeholder: "Phone number",
    },
    emergencyContactEmail: {
      label: "Emergency Contact Email",
      type: "text",
      placeholder: "Email address",
    },

    // Persons Involved
    participantInvolved: {
      label: "Was participant involved?",
      type: "dropdown",
      options: ["Yes", "No"],
    },
    participantInvolvedReason: {
      label: "If no participant involved , Specify the reason",
      type: "text",
      placeholder: "Reason for not involving participant",
    },
    staffInvolved: {
      label: "Staff involved",
      type: "text",
      placeholder: "Enter staff names",
    },
    othersInvolved: {
      label: "Others involved",
      type: "text",
      placeholder: "Enter other individuals involved",
    },

    // Risk Fields (Yes/No type)
    risk1: {
      label: "Is the client able to open door?",
      type: "dropdown",
      options: yesNoOptions,
      showComments: true,
    },
    risk1Rating: {
      label: "Risk Rating for Q1",
      type: "dropdown",
      options: ratingOptions,
    },
    risk2: {
      label: "Is there a safe evacuation point at your home? If yes comment the location",
      type: "dropdown",
      options: yesNoOptions,
      showComments: true,
    },
    risk2Rating: {
      label: "Risk Rating for Q2",
      type: "dropdown",
      options: ratingOptions,
    },
    risk3: {
      label:
        "Is the service to be provided at night or outside of normal working hours?",
      type: "dropdown",
      options: yesNoOptions,
      showComments: true,
    },
    risk3Rating: {
      label: "Risk Rating for Q3",
      type: "dropdown",
      options: ratingOptions,
    },
    risk4: {
      label: "Are there any expressive language concerns?",
      type: "dropdown",
      options: yesNoOptions,
      showComments: true,
    },
    risk4Rating: {
      label: "Risk Rating for Q4",
      type: "dropdown",
      options: ratingOptions,
    },
    risk5: {
      label:
        "Has relevant medical history been communicated including potential risk situations?",
      type: "dropdown",
      options: yesNoOptions,
      showComments: true,
    },
    risk5Rating: {
      label: "Risk Rating for Q5",
      type: "dropdown",
      options: ratingOptions,
    },
    risk6: {
      label: "Does the Participant have any road safety skills?",
      type: "dropdown",
      options: yesNoOptions,
      showComments: true,
    },
    risk6Rating: {
      label: "Risk Rating for Q6",
      type: "dropdown",
      options: ratingOptions,
    },
    risk7: {
      label: "Can the participant travel in an unmodified vehicle?",
      type: "dropdown",
      options: yesNoOptions,
      showComments: true,
    },
    risk7Rating: {
      label: "Risk Rating for Q7",
      type: "dropdown",
      options: ratingOptions,
    },
    risk8: {
      label: "Can the participant use public transport?",
      type: "dropdown",
      options: yesNoOptions,
      showComments: true,
    },
    risk8Rating: {
      label: "Risk Rating for Q8",
      type: "dropdown",
      options: ratingOptions,
    },
    risk9: {
      label: "Is the client known to be affected by crowds?",
      type: "dropdown",
      options: yesNoOptions,
      showComments: true,
    },
    risk9Rating: {
      label: "Risk Rating for Q9",
      type: "dropdown",
      options: ratingOptions,
    },

    // Behavioral/Mobility
    noiseSensitive: {
      label: "Is the client affected by noises or sudden sounds?",
      type: "dropdown",
      options: yesNoOptions,
    },
    noiseSensitiveComment: {
      label: "Comment",
      type: "text",
      placeholder: "Optional comment",
    },
    noiseSensitiveRating: {
      label: "Risk Rating",
      type: "dropdown",
      options: ratingOptions,
    },

    familyBehavioralHistory: {
      label: "Is there a history of any family members with behavioural issues ",
      type: "dropdown",
      options: yesNoOptions,
    },
    familyBehavioralHistoryComment: {
      label: "Is there a behaviour practitioner involved? ",
      type: "dropdown",
      options: yesNoOptions,
    },
    familyBehavioralHistoryRating: {
      label: "Risk Rating",
      type: "dropdown",
      options: ratingOptions,
    },

    behaviorPractitionerInvolved: {
      label: "Is there a behaviour practitioner involved? ",
      type: "dropdown",
      options: yesNoOptions,
    },

    mobilityIssues: {
      label: " Does the client have mobility issues? e.g., wheelchair or other? ",
      type: "dropdown",
      options: yesNoOptions,
    },
    mobilityIssuesComment: {
      label: "Comment",
      type: "text",
      placeholder: "Optional comment",
    },
    mobilityIssuesRating: {
      label: "Risk Rating",
      type: "dropdown",
      options: ratingOptions,
    },

    showeringToiletingHazards: {
      label: "Have hazards associated with showering, sponging and toileting been considered? e.g., manual handling/ slips trips and falls biological hazards/ humidity, etc.) ",
      type: "dropdown",
      options: yesNoOptions,
    },
    showeringToiletingHazardsComment: {
      label: "Comment",
      type: "text",
      placeholder: "Optional comment",
    },
    showeringToiletingHazardsRating: {
      label: "Risk Rating",
      type: "dropdown",
      options: ratingOptions,
    },

    medicationRiskDepression: {
      label: "Does the participant take any of the following medications that can cause Respiratory Depression? (Benzodiazepines,Opioids, Polypharmacy,Psychotropic polypharmacy,Combination of any of the above medications) ",
      type: "dropdown",
      options: yesNoOptions
    },
    householdSafeAddress: {
      label: 'Address',
      type: 'text',
    },
    householdSafeDesc: {
      label: 'Description',
      type: 'text'
    },

    medicationRiskDepressionRating: {
      label: "Risk Rating for Medication If yes, please specify and capture this in the controls table",
      type: "dropdown",
      options: ratingOptions,
    },

    medicationRiskDepressionYesNo: {
      label: 'Medication Risk ?',
      type: 'dropdown',
      options: yesNoOptions
    },



    medicationRiskDepressionComment: {
      label: "Medication Risk Control Comment",
      type: "text",
      placeholder: "Enter risk controls or notes",
    },

    // Medication Management
    promptMedicationRequired: {
      label: "Prompt Medication Required",
      type: "dropdown",
      options: yesNoOptions

    },
    assistanceMedicationRequired: {
      label: "Assistance of Medication Required",
      type: "dropdown",
      options: yesNoOptions

    },
    adminMedicationRequired: {
      label: "Administration of Medication Required",
      type: "dropdown",
      options: yesNoOptions

    },
    noMedicationRequired: {
      label: "NO – This participant does not require medication management",
      type: "dropdown",
      options: yesNoOptions
    },

    selectedRiskLevel: {
      label: "Select Severity Level",
      type: "dropdown",
      options: ["Low", "Moderate", "High", "Critical"]
    },


    // Household Meeting Point
    safeMeetingAddress: {
      label: "Safe Meeting Address",
      type: "text",
      placeholder: "Enter address",
    },
    safeMeetingDescription: {
      label: "Safe Meeting Point Description",
      type: "text",
      placeholder: "Enter description",
    },

    // Risk Table Rows (10 entries)
    ...Object.fromEntries(
      Array.from({ length: 10 }, (_, i) => {
        const idx = i + 1;
        return [
          [
            `issue${idx}`,
            {
              label: `Issue ${idx}`,
              type: "textarea",
              placeholder: `Describe issue ${idx}`,
              rows: 2,
            },
          ],
          [
            `score${idx}`,
            {
              label: `Risk Score ${idx}`,
              type: "dropdown",
              placeholder: "Select score",
              options: ["1", "2", "3", "4"],
            },
          ],
          [
            `control${idx}`,
            {
              label: `Control Measure ${idx}`,
              type: "textarea",
              placeholder: "Describe control",
              rows: 2,
            },
          ],
          [
            `person${idx}`,
            {
              label: `Responsible Person ${idx}`,
              type: "dropdown",
              placeholder: "Select responsible person",
              options: ["Support Worker", "Other"],
              showIfOther: {
                label: "Please specify",
                inputName: `person${idx}Other`,
              },
            },
          ],
        ];
      }).flat()
    ),

    // Communication Table
    scenario1: {
      label: "Scenario 1",
      type: "text",
      placeholder: "Describe scenario",
    },
    mode1: {
      label: "Mode of Communication 1",
      type: "text",
      placeholder: "Communication method",
    },
    scenario2: {
      label: "Scenario 2",
      type: "text",
      placeholder: "Describe scenario",
    },
    mode2: {
      label: "Mode of Communication 2",
      type: "text",
      placeholder: "Communication method",
    },

    // Signature Section
    authorisedBy: {
      label: "Authorised By",
      type: "text",
      placeholder: "Enter authoriser name",
    },
    role: { label: "Role", type: "text", placeholder: "Enter role" },
    signature: { label: "Signature", type: "signature", placeholder: "Authorized by Signature" },
    signatureDate: {
      label: "Signature Date",
      type: "date",
      placeholder: "Select date",
    },
    guardianSignature: {
      label: "Participant / Guardian Signature",
      type: "signatureGuardian",
      placeholder: "Participant or Guardian Signature",
    },
    guardianDate: {
      label: "Participant / Guardian Signature Date",
      type: "date",
      placeholder: "Select date",
    },
    copySupplied: { label: "Copy supplied to participant?", type: "dropdown", options: yesNoOptions },
    copyOnFile: { label: "Copy placed on file?", type: "dropdown", options: yesNoOptions },
    reviewDate: {
      label: "Review Date",
      type: "date",
      placeholder: "Select review date",
    },
  };


  const handleSeverityChange = (value: string) => {
    setLocalValues((prev: any) => ({
      ...prev,
      selectedRiskLevel: value,
      riskLevelLow: value === "Low",
      riskLevelModerate: value === "Moderate",
      riskLevelHigh: value === "High",
      riskLevelCritical: value === "Critical"
    }));
  };

  const renderDropdownSeverityRisk = (
    label: string,
    field: string,
    options: string[],
    showComments: boolean = false,
    required: boolean = false
  ) => {
    const isSeverityField = field === "selectedRiskLevel";

    return (
      <div>
        <label className="block font-medium mb-1">{label}</label>
        <select
          className="w-full border px-3 py-2 rounded"
          value={localValues[field]}
          onChange={(e) =>
            isSeverityField
              ? handleSeverityChange(e.target.value)
              : setLocalValues({ ...localValues, [field]: e.target.value })
          }
          aria-label={`Select ${label}`}
          title={`Select ${label}`}
        >
          <option value="">-- Select --</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  };


  const handleSaveProgressButton = async () => {
    setShowSaveSpinner(true);
    try {
      await handleSaveProgress();
    } finally {
      setShowSaveSpinner(false);
    }
  };

  const renderRiskQuestionBlock = (index: number) => {
    const yesNoOptions = ["Yes", "No"];
    const ratingOptions = ["1", "2", "3", "4"];
    const riskField = `risk${index}`;
    const ratingField = `risk${index}Rating`;
    const commentField = `risk${index}Comment`;

    const riskMeta = FIELD_METADATA[riskField] || {
      label: `Question ${index}`,
      type: "dropdown",
    };
    const ratingMeta = FIELD_METADATA[ratingField] || {
      label: "Risk Rating",
      type: "dropdown",
    };
    const commentMeta = FIELD_METADATA[commentField] || {
      label: "Comment",
      type: "text",
    };

    // Special handling for Q2: enable comment only if Yes; clear on No
    const isQ2 = index === 2;
    const riskValue = localValues[riskField];
    const isYes = String(riskValue || "").toLowerCase() === "yes";

    const handleRiskChange = (value: string) => {
      const next = { ...localValues, [riskField]: value } as any;
      if (isQ2 && String(value).toLowerCase() === "no") {
        next[commentField] = ""; // clear comment when switching to No
      }
      setLocalValues(next);
    };

    const renderQ2CommentInput = () => (
      <input
        type={commentMeta.type}
        className="w-full border px-3 py-2 rounded disabled:bg-gray-100 disabled:text-gray-500"
        placeholder={commentMeta.placeholder}
        value={localValues[commentField] || ""}
        onChange={(e) => setLocalValues({ ...localValues, [commentField]: e.target.value })}
        disabled={isQ2 && !isYes}
        aria-label={commentMeta.label}
      />
    );

    return (
      <div
        key={index}
        className="border border-gray-200 rounded-lg p-4 bg-gray-50"
      >
        <h3 className="text-base font-semibold text-gray-800 mb-4">
          {riskMeta.label}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Yes/No */}
          <div>
            <label className="block font-medium mb-1">Yes / No</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={localValues[riskField] || ""}
              onChange={(e) => handleRiskChange(e.target.value)}
              aria-label={`Select ${riskMeta.label}`}
              title={`Select ${riskMeta.label}`}
            >
              <option value="">-- Select --</option>
              {yesNoOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Rating */}
          {renderDropdown("Risk Rating", ratingField, ratingOptions, false)}

          {/* Comment (conditional for Q2) */}
          {isQ2 ? (
            <div>
              <label className="block font-medium mb-1">Comment</label>
              {renderQ2CommentInput()}
            </div>
          ) : (
            renderInput(
              "Comment",
              commentField,
              commentMeta.type,
              commentMeta.placeholder,
              false
            )
          )}
        </div>
      </div>
    );
  };

  // const renderBehavioralAndMobilitySection = () => {
  //   const fields = [
  //     "noiseSensitive",
  //     "familyBehavioralHistory",
  //     "behaviorPractitionerInvolved",
  //     "mobilityIssues",
  //     "showeringToiletingHazards",
  //   ];

  //   return (
  //     <div className="space-y-6">
  //       {fields.map((key) => {
  //         const ratingKey = `${key}Rating`;
  //         const commentKey = `${key}Comment`;

  //         return (
  //           <div
  //             key={key}
  //             className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start border border-gray-200 p-4 rounded-md bg-gray-50"
  //           >
  //             {renderDropdown(
  //               FIELD_METADATA[key].label,
  //               key,
  //               yesNoOptions,
  //               false
  //             )}
  //             {renderDropdown(
  //               FIELD_METADATA[ratingKey].label,
  //               ratingKey,
  //               ratingOptions,
  //               false
  //             )}
  //             {renderInput(
  //               FIELD_METADATA[commentKey].label,
  //               commentKey,
  //               "text",
  //               FIELD_METADATA[commentKey].placeholder,
  //               false
  //             )}
  //           </div>
  //         );
  //       })}

  //       {/* medicationRespDepression multi-checkbox */}
  //       <div className="border border-gray-200 p-4 rounded-md bg-gray-50">
  //         {renderMultiSelectCheckbox(
  //           FIELD_METADATA.medicationRespDepression.label,
  //           "medicationRespDepression",
  //           FIELD_METADATA.medicationRespDepression.options,
  //           false
  //         )}
  //       </div>
  //         <div className="border border-gray-200 p-4 rounded-md bg-gray-50">
  //         {renderDropdown(
  //           FIELD_METADATA.medicationRiskYesNo.label,
  //           "medicationRiskYesNo",
  //           yesNoOptions,
  //           false
  //         )}
  //       </div>


  //       {/* medicationRespDepressionRating dropdown */}
  //       <div className="border border-gray-200 p-4 rounded-md bg-gray-50">
  //         {renderDropdown(
  //           FIELD_METADATA.medicationRespDepressionRating.label,
  //           "medicationRespDepressionRating",
  //           ratingOptions,
  //           false
  //         )}
  //       </div>

  //       {/* medicationRiskComment text input */}
  //       <div className="border border-gray-200 p-4 rounded-md bg-gray-50">
  //         {renderInput(
  //           FIELD_METADATA.medicationRiskComment.label,
  //           "medicationRiskComment",
  //           "text",
  //           FIELD_METADATA.medicationRiskComment.placeholder,
  //           false
  //         )}
  //       </div>
  //     </div>
  //   );
  // };

  // Validation function to check if all required fields are filled

  const renderBehavioralAndMobilitySection = () => {
    const fields = [
      "noiseSensitive",
      "familyBehavioralHistory",
      "mobilityIssues",
      "showeringToiletingHazards",
      "medicationRiskDepression"
    ];

    return (
      <div className="space-y-6">
        {fields.map((key) => {
          const ratingKey = `${key}Rating`;
          const commentKey = `${key}Comment`;

          const isBehaviorPractitioner = key === "behaviorPractitionerInvolved";
          const meta = FIELD_METADATA[key];
          const fieldType = meta?.type || "dropdown";

          return (
            <div
              key={key}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start border border-gray-200 p-4 rounded-md bg-gray-50"
            >
              {isBehaviorPractitioner ? (
                // For behaviorPractitionerInvolved: render as text input in first column only
                <>
                  {renderInput(
                    meta.label,
                    key,
                    "text",
                    meta.placeholder,
                    false
                  )}
                  <div></div>
                  <div></div>
                </>
              ) : (
                <>
                  {/* ✅ Always render Yes/No dropdown */}
                  {renderDropdown(
                    FIELD_METADATA[key].label,
                    key,
                    yesNoOptions,
                    false
                  )}

                  {/* ✅ Render rating */}
                  {renderDropdown(
                    FIELD_METADATA[ratingKey].label,
                    ratingKey,
                    ratingOptions,
                    false
                  )}

                  {/* ✅ Render comment */}
                  {(() => {
                    // Special handling for familyBehavioralHistoryComment -> behaviorPractitionerInvolved
                    const actualCommentField = commentKey === "familyBehavioralHistoryComment" ? "behaviorPractitionerInvolved" : commentKey;

                    return FIELD_METADATA[commentKey]?.type === "dropdown" ? (
                      renderDropdown(
                        FIELD_METADATA[commentKey].label,
                        actualCommentField,
                        FIELD_METADATA[commentKey].options || [],
                        false
                      )
                    ) : (
                      renderInput(
                        FIELD_METADATA[commentKey].label,
                        commentKey,
                        "text",
                        FIELD_METADATA[commentKey].placeholder,
                        false
                      )
                    );
                  })()}
                </>
              )}
            </div>
          );
        })}

        {/* medicationRespDepression multi-checkbox */}
        {/* <div className="border border-gray-200 p-4 rounded-md bg-gray-50">
        {renderMultiSelectCheckbox(
          FIELD_METADATA.medicationRespDepression.label,
          "medicationRespDepression",
          FIELD_METADATA.medicationRespDepression.options,
          false
        )}
      </div>

      <div className="border border-gray-200 p-4 rounded-md bg-gray-50">
        {renderDropdown(
          FIELD_METADATA.medicationRiskYesNo.label,
          "medicationRiskYesNo",
          yesNoOptions,
          false
        )}
      </div>

      <div className="border border-gray-200 p-4 rounded-md bg-gray-50">
        {renderDropdown(
          FIELD_METADATA.medicationRespDepressionRating.label,
          "medicationRespDepressionRating",
          ratingOptions,
          false
        )}
      </div>

      <div className="border border-gray-200 p-4 rounded-md bg-gray-50">
        {renderInput(
          FIELD_METADATA.medicationRiskComment.label,
          "medicationRiskComment",
          "text",
          FIELD_METADATA.medicationRiskComment.placeholder,
          false
        )}
      </div> */}
      </div>
    );
  };



  const validateRequiredFields = () => {
    const missingFields: string[] = [];

    FORM_SECTIONS.forEach((section: any) => {
      // 1. Check explicit required fields
      section.requiredFields.forEach((fieldName: any) => {
        let value;

        // For common fields, get value from commonFieldsData
        if (isCommonField(fieldName)) {
          value = getCommonFieldValue(fieldName);
        } else {
          value = localValues[fieldName];
        }

        // Check if field is empty, null, undefined, or empty string
        if (!value || (typeof value === "string" && value.trim() === "")) {
          missingFields.push(`${fieldName}`);
        }
      });

      // 2. Check conditional "Other" requirements
      (section.fields || []).forEach((fieldName: string) => {
        const meta = FIELD_METADATA[fieldName];
        if (meta?.type === "dropdown" && meta?.showIfOther && localValues[fieldName] === "Other") {
          const otherName = meta.showIfOther.inputName;
          const otherValue = localValues[otherName];
          if (!otherValue || (typeof otherValue === "string" && otherValue.trim() === "")) {
            missingFields.push(otherName);
          }
        }
      });
    });

    return {
      isValid: missingFields.length === 0,
      missingFields,
    };
  };

  const handleFormSubmitCheckValidation = async () => {
    try {

      setSubmitting(true);
      console.log("form submitted");
      const validationResult = validateRequiredFields();

      if (validationResult.isValid) {
        await handleSubmitForm(); // Awaiting if handleSaveProgress is async
      } else {
        showToast({
          type: "error",
          title: "Missing Required Fields",
          message: validationResult.missingFields.join(", "), // Formats the missing fields as a readable list
        });
      }
    } catch (error) {
      console.error("Validation or save failed:", error);
      showToast({
        type: "error",
        title: "Error",
        message: "Something went wrong during validation or saving.",
      });
    } finally {
      setSubmitting(false)
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

  const renderRiskLevelInfoTable = (selected: string) => {
    if (!selected || !RISK_LEVEL_DETAILS[selected]) return null;

    const data = RISK_LEVEL_DETAILS[selected];

    return (
      <table className="w-full border border-gray-300 mt-4 text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border p-2">Risk Level</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Criteria</th>
            <th className="border p-2">Impact on Health-Safety</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">{data.level}</td>
            <td className="border p-2">{data.description}</td>
            <td className="border p-2">{data.criteria}</td>
            <td className="border p-2">{data.impact}</td>
          </tr>
        </tbody>
      </table>
    );
  };


  return (
    <div className="">
      {/* Progress Bar */}
      <div className="w-full max-w-2xl mx-auto pt-2 md:pt-6 px-2">
        <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
          <div
            className="h-2 bg-gradient-to-r from-indigo-500 to-green-400 rounded-full transition-all"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
        {/* Horizontal Stepper */}
        <nav className="flex items-center justify-between gap-2 overflow-visible pb-2 relative">
          {FORM_SECTIONS.map((section: any, idx: any) => {
            const active = idx === currentStep;
            const unlocked = idx <= maxStep;
            return (
              <div
                key={section.id}
                className="relative flex flex-col items-center group"
              >
                <button
                  type="button"
                  onClick={() => handleStepClick(idx)}
                  className={`flex flex-col items-center min-w-[60px] px-2 focus:outline-none transition-all duration-200 ${active
                    ? "text-indigo-700"
                    : unlocked
                      ? "text-green-600"
                      : "text-gray-400 opacity-50 cursor-not-allowed"
                    }`}
                  aria-current={active ? "step" : undefined}
                  aria-label={section.title}
                  disabled={!unlocked}
                  tabIndex={unlocked ? 0 : -1}
                >
                  <span
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 mb-1 ${active
                      ? "bg-indigo-700 border-indigo-500 text-white scale-110"
                      : unlocked
                        ? "bg-green-500 border-green-500 text-white"
                        : "bg-gray-200 border-gray-300 text-gray-400"
                      }`}
                  >
                    {completedSteps.has(idx) ? (
                      <FaCheck className="w-4 h-4" />
                    ) : (
                      React.createElement(section.icon, {
                        className: "w-4 h-4",
                      })
                    )}
                  </span>
                  <span className="text-[10px] font-medium">{idx + 1}</span>
                  {!unlocked && (
                    <span className="text-[10px] text-gray-400 mt-1">
                      Locked
                    </span>
                  )}
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
              {React.createElement(FORM_SECTIONS[currentStep].icon, {
                className: "w-6 h-6 text-indigo-600",
              })}
              {FORM_SECTIONS[currentStep].title}
            </h2>
            <p className="text-sm text-gray-500 font-medium mt-1">
              {FORM_SECTIONS[currentStep].description}
            </p>
          </div>

          <form
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              if (onSubmit) onSubmit(localValues);
            }}
            className="flex flex-col gap-6"
          >
            <div className="space-y-4 md:space-y-8">
              {/* Dynamic Section Rendering */}
              {FORM_SECTIONS[currentStep].id === "riskGroupQuestions" ? (
                <div className="space-y-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => renderRiskQuestionBlock(num))}
                </div>
              ) : FORM_SECTIONS[currentStep].id === "behavioralAndMobility" ? (
                renderBehavioralAndMobilitySection()
              ) : FORM_SECTIONS[currentStep].id === "riskLevelSummary" ? (
                <div className="space-y-6">
                  {renderDropdownSeverityRisk(
                    FIELD_METADATA["selectedRiskLevel"].label,
                    "selectedRiskLevel",
                    FIELD_METADATA["selectedRiskLevel"].options,
                    false
                  )}
                  {renderRiskLevelInfoTable(localValues.selectedRiskLevel)}
                </div>
              ) : FORM_SECTIONS[currentStep].id === "riskAssessmentTable" ? (
                <>
                  <div className="space-y-6">
                    {activeRiskRows.map((num) => (
                      <div key={num} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold text-gray-800">Risk Assessment Entry {num}</h3>
                          <div className="w-1/2">
                            <select
                              className="w-full border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              onChange={(e) => {
                                const selectedIssue = e.target.value;
                                if (!selectedIssue) return;

                                const template = RISK_TEMPLATES.find(t => t.issue === selectedIssue);
                                if (template) {
                                  setLocalValues((prev: Record<string, any>) => ({
                                    ...prev,
                                    [`issue${num}`]: template.issue,
                                    [`control${num}`]: template.control
                                  }));
                                }
                              }}
                              value=""
                            >
                              <option value="" disabled>✨ Quick Fill from Template...</option>
                              {RISK_TEMPLATES.map((t, i) => (
                                <option key={i} value={t.issue}>{t.issue}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            [`issue${num}`, FIELD_METADATA[`issue${num}`]],
                            [`score${num}`, FIELD_METADATA[`score${num}`]],
                            [`control${num}`, FIELD_METADATA[`control${num}`]],
                            [`person${num}`, FIELD_METADATA[`person${num}`]],
                          ].map(([key, meta]) =>
                            meta?.type === "textarea" ? (
                              <div key={key} className="md:col-span-2">
                                {renderTextArea(meta.label, key, meta.rows || 3, meta.placeholder)}
                              </div>
                            ) : meta?.type === "dropdown" ? (
                              <div key={key}>
                                {renderDropdown(meta.label, key, meta.options || [], false, false, meta.showIfOther)}
                              </div>
                            ) : (
                              <div key={key}>
                                {renderInput(meta.label, key, meta.type || "text", meta.placeholder)}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {activeRiskRows.length < 10 && (
                    <button
                      type="button"
                      onClick={addRiskRow}
                      className="mt-4 px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow"
                    >
                      + Add Risk Entry
                    </button>
                  )}
                </>
              ) :

                FORM_SECTIONS[currentStep].id === "knownMedicalConditions" ? (
                  <div className="space-y-6">
                    {[...Array(medicalConditionCount)].map((_, i) => {
                      const index = i + 1;
                      return (
                        <div
                          key={index}
                          className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 p-4 rounded-md bg-gray-50"
                        >
                          {renderInput(FIELD_METADATA[`medicalSpecify${index}`].label, `medicalSpecify${index}`, "text", FIELD_METADATA[`medicalSpecify${index}`].placeholder)}
                          {renderInput(FIELD_METADATA[`medicalEffect${index}`].label, `medicalEffect${index}`, "text", FIELD_METADATA[`medicalEffect${index}`].placeholder)}
                          {renderInput(FIELD_METADATA[`medicalTreatment${index}`].label, `medicalTreatment${index}`, "text", FIELD_METADATA[`medicalTreatment${index}`].placeholder)}
                        </div>
                      );
                    })}

                    {medicalConditionCount < 3 && (
                      <button
                        type="button"
                        onClick={handleAddMoreMedicalCondition}
                        className="mt-2 px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow"
                      >
                        + Add Another Medical Condition
                      </button>
                    )}
                  </div>
                ) :


                  (
                    // Default layout
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {FORM_SECTIONS[currentStep].fields.map((field: any) => {
                        // 🧠 Special logic for conditional display of participantInvolvedReason
                        if (
                          field === "participantInvolvedReason" &&
                          localValues["participantInvolved"] !== "No"
                        ) {
                          return null; // Don't render unless participantInvolved === "No"
                        }

                        // Skip the comment and rating fields for behaviorPractitionerInvolved (only render the main question)
                        if (field === "behaviorPractitionerInvolvedComment" || field === "behaviorPractitionerInvolvedRating") {
                          return null;
                        }

                        const meta = FIELD_METADATA[field];
                        if (!meta) {
                          console.warn(`Field metadata not found for: ${field}`);
                          return null;
                        }
                        const required = isFieldRequired(field);

                        // Special handling for behaviorPractitionerInvolved to use the comment field
                        let actualFieldName = field;
                        if (field === "familyBehavioralHistoryComment") {
                          // Use behaviorPractitionerInvolved field to store the data
                          actualFieldName = "behaviorPractitionerInvolved";
                        }

                        if (meta.type === "textarea") {
                          return (
                            <div key={field} className="md:col-span-2">
                              {renderTextArea(meta.label, field, meta.rows || 3, meta.placeholder, required)}
                            </div>
                          );
                        }

                        if (meta.type === "dropdown") {
                          // Use actualFieldName for behaviorPractitionerInvolved mapping
                          const fieldToUse = actualFieldName !== field ? actualFieldName : field;
                          return (
                            <div key={field} className="md:col-span-2">
                              {renderDropdown(meta.label, fieldToUse, meta.options || [], meta.showComments, required)}
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
                              {renderSignatureField(meta.label, "signature", sigCanvasRef, meta.placeholder, true)}
                            </div>
                          );
                        }

                        if (meta.type === "signatureGuardian") {
                          return (
                            <div key={field} className="md:col-span-2">
                              {renderSignatureField(meta.label, "guardianSignature", sigCanvasRefGuardian, meta.placeholder, true)}
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
            {FORM_SECTIONS.map((_: any, index: any) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full border duration-200 ${index === currentStep
                  ? "bg-blue-600 border-blue-600 shadow"
                  : index < currentStep
                    ? "bg-green-500 border-green-500"
                    : "bg-gray-200 border-gray-300"
                  }`}
              />
            ))}
          </div>

          <div className="flex flex-col w-full gap-2 md:flex-row md:gap-3 md:justify-between">
            <button
              type="button"
              onClick={handlePreviousSequential}
              disabled={currentStep === 0 || navigatingPrev}
              className={`flex items-center justify-center space-x-1 px-5 py-2 rounded-full font-semibold transition-all text-sm shadow border duration-200 w-full md:w-1/3 ${currentStep === 0 || navigatingPrev
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                : "bg-gradient-to-r from-gray-700 to-gray-900 text-white border-gray-700 hover:from-gray-800 hover:to-black"
                }`}
            >
              {navigatingPrev ? (
                <FaSpinner className="w-4 h-4 animate-spin" />
              ) : (
                <FaChevronLeft className="w-4 h-4" />
              )}
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={handleNextSequential}
              disabled={
                currentStep === FORM_SECTIONS.length - 1 ||
                !isCurrentSectionComplete() ||
                navigatingNext
              }
              className={`flex items-center justify-center space-x-1 px-5 py-2 rounded-full font-semibold transition-all text-sm shadow border duration-200 w-full md:w-1/3 ${currentStep === FORM_SECTIONS.length - 1 ||
                !isCurrentSectionComplete() ||
                navigatingNext
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                : "bg-gradient-to-r from-indigo-600 to-green-400 text-white border-indigo-600 hover:from-indigo-700 hover:to-green-500"
                }`}
            >
              <span>Next</span>
              {navigatingNext ? (
                <FaSpinner className="w-4 h-4 animate-spin" />
              ) : (
                <FaChevronRight className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={handleSaveProgressButton}
              disabled={saving || submitting || showSaveSpinner}
              className="flex items-center justify-center gap-1 px-5 py-2 rounded-full font-semibold text-sm bg-gray-600 hover:bg-gray-700 text-white shadow border border-gray-700 transition-all duration-200 w-full md:w-1/3 disabled:opacity-50"
            >
              {showSaveSpinner ? <FaSpinner className="w-4 h-4 animate-pulse" /> : <FaSave className="w-4 h-4" />}
              {showSaveSpinner ? "Saving..." : "Save Progress"}
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
              {submitting ? (
                <>
                  <FaSpinner className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <FaCheck className="w-4 h-4" />
                  <span>Submit Form</span>
                </>
              )}
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
