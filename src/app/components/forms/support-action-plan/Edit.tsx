"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FaUser,
  FaFileContract,
  FaDollarSign,
  FaClipboardList,
  FaSignature,
  FaChevronLeft,
  FaChevronRight,
  FaCheck,
  FaSave,
} from "react-icons/fa";
import { useToast } from "@/components/ui/Toast";
import SignatureCanvas, {
  SignatureCanvasRef,
} from "@/components/ui/SignatureCanvas";
import { Label } from "@headlessui/react";

// Hourglass spinner to match Client Intake form
const FaSpinner = ({ className }: { className?: string }) => (
  <span className={className}>⏳</span>
);

// Auto-resizing textarea component
const AutoResizeTextArea: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
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
  onKeyDown,
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
          onKeyDown={onKeyDown}
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
  handleSave: (submit: boolean) => void;
  handleSaveProgress?: () => Promise<void>;
  handleSaveForNext?: () => Promise<void>;
  handleSaveForPrev?: () => Promise<void>;
  handleSubmitForm?: () => Promise<void>;
  saving?: boolean; // Loading state from parent
  navigatingNext?: boolean;
  navigatingPrev?: boolean;
  onCommonFieldsUpdated?: () => void;
}

const FORM_SECTIONS: any = [
  {
    id: "participantDetails",
    title: "1. Participant Details",
    fields: [
      "participantName",
      "ndisNumber",
      "planStartDate",
      "planEndDate",
      "dob",
      "gender",
      "address",
      "email",
      "phone",
      "preferredContactPerson",
      "communicationConsiderations",
    ],
    icon: FaUser,
    requiredFields: [
      "participantName",
      "ndisNumber",
      "dob",
      "gender",
      "address",
      "email",
      "phone",
      "preferredContactPerson",
    ],
  },
  {
    id: "preferredContact",
    title: "2. Preferred Contact (Plan Nominee / Family Member)",
    fields: [
      "contactName",
      "relationship",
      "contactAddress",
      "contactPhone",
      "contactEmail",
      "funding",
      "fundingOther",
    ],
    icon: FaUser,
    requiredFields: [],
  },
  {
    id: "ndisGoals",
    title: "3. NDIS Participant’s Goals",
    fields: ["goal1", "goal2", "goal3", "goal4", "goal5", "goal6", "goal7"],
    icon: FaUser,
    requiredFields: [],
  },
  {
    id: "coreSupports",
    title: "4. Core Supports",
    fields: [
      "coreSupportText",
      "corePreferredProviders",
      "coreAlternativeProviders",
      "coreAgreementSigned",
      "coreSupportsCommenced",
      "coreBudgetApproved",
    ],
    icon: FaUser,
    requiredFields: [],
  },
  {
    id: "capacityBuilding",
    title: "5. Capacity Building",
    fields: [
      "capacitySupportText",
      "capacityPreferredProviders",
      "capacityAlternativeProviders",
      "capacityAgreementSigned",
      "capacitySupportsInPlace",
      "capacityAssessmentRequired",
      "capacityActions",
      "capacityBudgetApproved",
    ],
    icon: FaUser,
    requiredFields: [],
  },
  {
    id: "ndisFundedSupports",
    title: "CAPITAL",
    fields: [
      "supportRequired1",
      "preferredProviders1",
      "alternativeProviders1",
      "serviceAgreement1",
      "additionalAssessment1",
      "assessmentActions1",
      "planManagerDiscussion1",
    ],
    icon: FaUser,
    requiredFields: [],
  },
  {
    id: "mainstreamSupports",
    title: "7. Mainstream Supports & Services",
    fields: [
      "supportRequired2",
      "preferredProviders2",
      "alternativeProviders2",
      "serviceAgreement2",
      "additionalAssessment2",
      "assessmentActions2",
      "budgetApproval",
    ],
    icon: FaUser,
    requiredFields: [],
  },
  {
    id: "nextPlanGoals",
    title: "8. Goals and Funding Required for Next Plan",
    fields: ["goalsText"],
    icon: FaUser,
    requiredFields: [],
  },
  {
    id: "signatures",
    title: "9. Signatures",
    fields: [
      "participantSignature",
      "participantDate",
      "authorSignature",
      "authorDate",
    ],
    icon: FaUser,
    requiredFields: [],
  },
];

const commonFieldsMapping: Record<string, string> = {
  ndisNumber: "ndis",
  gender: "sex",
  participantName: "name",
  dob: "dob",
  address: "street",
  state: "state",
  postcode: "postCode",
  email: "email",
  phone: "phone",
};

// Helper function to check if a field is a common field
const isCommonField = (fieldName: string): boolean => {
  return Object.keys(commonFieldsMapping).includes(fieldName);
};

const yesNoOptions = ["Yes", "No"];
const sexOptions = ["Male", "Female", "Prefer not to say", "Others"];
const indigenousOptions = ["Yes", "No"];

const ScheduleForSupportEdit: React.FC<FormProps> = ({
  formData,
  commonFieldsData,
  onChange,
  onSubmit,
  readOnly = false,
  fieldErrors = {},
  handleSave,
  handleSaveProgress,
  handleSaveForNext,
  handleSaveForPrev,
  handleSubmitForm,
  saving = false, // Loading state from parent
  navigatingNext = false,
  navigatingPrev = false,
  onCommonFieldsUpdated,
}: any) => {
  // Helper function to get common field value
  const getCommonFieldValue = (fieldName: string): string => {
    // For participantName field, combine first name and surname to show full name
    if (fieldName === "participantName") {
      const firstName = commonFieldsData?.name || '';
      const surname = commonFieldsData?.surname || '';
      const fullName = [firstName, surname].filter(Boolean).join(' ').trim();
      return fullName || '';
    }

    const commonKey = commonFieldsMapping[fieldName];
    return commonFieldsData?.[commonKey] || "";
  };

  useEffect(() => {
    console.log("Common fields data updated:", commonFieldsData);
  }, [commonFieldsData]);

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [maxStep, setMaxStep] = useState(0);
  const [nextLocalLoading, setNextLocalLoading] = useState(false);
  const [prevLocalLoading, setPrevLocalLoading] = useState(false);
  const [localEmailErrors, setLocalEmailErrors] = useState<Record<string, string>>({});
  const isNextLoading = !!(navigatingNext || nextLocalLoading);
  const isPrevLoading = !!(navigatingPrev || prevLocalLoading);

  // Signature canvas refs
  const participantSigCanvasRef: any = useRef<SignatureCanvasRef | null>(null);
  const authorSignature: any = useRef<SignatureCanvasRef | null>(null);

  const initialValues: any = {
    // Page 1
    participantName: "",
    ndisNumber: "",
    planStartDate: "",
    planEndDate: "",
    dob: "",
    gender: "",
    address: "",
    email: "",
    phone: "",
    preferredContactPerson: "",
    communicationConsiderations: "",

    // Page 2
    contactName: "",
    relationship: "",
    contactAddress: "",
    contactPhone: "",
    contactEmail: "",
    funding: [],
    fundingOther: "",

    // Page 3 (Updated Goals)
    goal1: "",
    goal2: "",
    goal3: "",
    goal4: "",
    goal5: "",
    goal6: "",
    goal7: "",

    // Page 4
    coreSupportText: "",
    corePreferredProviders: "",
    corePreferredProviders2: "",
    coreAlternativeProviders: "",
    coreAlternativeProviders2: "",
    coreAgreementSigned: "",
    coreSupportsCommenced: "",
    coreBudgetApproved: "",

    // Page 5
    capacitySupportText: "",
    capacityPreferredProviders: "",
    capacityPreferredProviders2: "",
    capacityAlternativeProviders: "",
    capacityAlternativeProviders2: "",
    capacityAgreementSigned: "",
    capacitySupportsInPlace: "",
    capacityAssessmentRequired: "",
    capacityActions: "",
    capacityBudgetApproved: "",

    // Page 6
    supportRequired1: "",
    preferredProviders1: "",
    preferredProvidersCapital2: "",
    alternativeProviders1: "",
    alternativeProvidersCapital2: "",
    serviceAgreement1: "",
    additionalAssessment1: "",
    assessmentActions1: "",
    planManagerDiscussion1: "",

    // Page 7
    supportRequired2: "",
    preferredProviders2: "",
    preferredProvidersMainstream2: "",
    alternativeProviders2: "",
    alternativeProvidersMainstream2: "",
    serviceAgreement2: "",
    additionalAssessment2: "",
    assessmentActions2: "",

    // Page 8
    budgetApproval: "",
    goalsText: "",

    ...formData,
    // Page 9
    participantSignature: formData?.participantSignature || "",
    participantDate: formData?.participantDate || formData?.participantSignatureDate || new Date().toISOString().split('T')[0],
    participantSignatureDate: formData?.participantSignatureDate || formData?.participantDate || new Date().toISOString().split('T')[0],
    authorSignature: formData?.authorSignature || "",
    authorDate: formData?.authorDate || formData?.providerSignatureDate || new Date().toISOString().split('T')[0],
    providerSignatureDate: formData?.providerSignatureDate || formData?.authorDate || new Date().toISOString().split('T')[0],
  };

  const [localValues, setLocalValues] = useState<any>(initialValues);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { showToast } = useToast();

  const [visibleFields, setVisibleFields] = useState(() => ({
    corePreferred2: !!formData.corePreferredProviders2,
    coreAlt2: !!formData.coreAlternativeProviders2,
    capacityPreferred2: !!formData.capacityPreferredProviders2,
    capacityAlt2: !!formData.capacityAlternativeProviders2,
    capitalPreferred2: !!formData.preferredProvidersCapital2,
    capitalAlt2: !!formData.alternativeProvidersCapital2,
    mainstreamPreferred2: !!formData.preferredProvidersMainstream2,
    mainstreamAlt2: !!formData.alternativeProvidersMainstream2,
  }));

  const toggleFieldVisibility = (key: keyof typeof visibleFields) => {
    setVisibleFields((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Loading states
  const [submitting, setSubmitting] = useState(false);
  // Note: 'saving' state comes from parent component via props

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
    const { name, value, type } = e.target;

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

    // Validate plan dates - end date must be after start date
    if (name === 'planEndDate' && value) {
      const startDate = localValues.planStartDate;
      if (startDate && value < startDate) {
        showToast({
          type: "error",
          title: "Invalid Date Range",
          message: "Plan end date cannot be before the start date.",
          duration: 4000,
        });
        return;
      }
    }

    if (name === 'planStartDate' && value) {
      const endDate = localValues.planEndDate;
      if (endDate && value > endDate) {
        showToast({
          type: "error",
          title: "Invalid Date Range",
          message: "Plan start date cannot be after the end date.",
          duration: 4000,
        });
        return;
      }
    }

    let newValue: any = value;
    if (type === "checkbox") {
      newValue = (e.target as HTMLInputElement).checked;
    }

    const newValues = { ...localValues, [name]: newValue };

    // Clear capacityActions if capacityAssessmentRequired is changed to "No"
    if (name === "capacityAssessmentRequired" && value === "No") {
      newValues.capacityActions = "";
    }

    // Clear assessmentActions1 if additionalAssessment1 is changed to "No"
    if (name === "additionalAssessment1" && value === "No") {
      newValues.assessmentActions1 = "";
    }

    // Clear assessmentActions2 if additionalAssessment2 is changed to "No"
    if (name === "additionalAssessment2" && value === "No") {
      newValues.assessmentActions2 = "";
    }

    setLocalValues(newValues);

    const isCommon = !!commonFieldsMapping[name];
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

  const getProgressPercentage = () => {
    return ((currentStep + 1) / FORM_SECTIONS.length) * 100;
  };

  const isCurrentSectionComplete = () => {
    const required = FORM_SECTIONS[currentStep].requiredFields || [];
    return required.every((key: any) => {
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
  };

  const handleNextSequential = async () => {
    try {
      setNextLocalLoading(true);
      if (handleSaveForNext) {
        await handleSaveForNext();
      } else if (handleSaveProgress) {
        await handleSaveProgress();
      }
      handleNext();
    } finally {
      setNextLocalLoading(false);
    }
  };

  const handlePreviousSequential = async () => {
    if (currentStep > 0) {
      try {
        setPrevLocalLoading(true);
        if (handleSaveForPrev) {
          await handleSaveForPrev();
        }
        setCurrentStep(currentStep - 1);
      } finally {
        setPrevLocalLoading(false);
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
    const isPhoneField = /phone|mobile$/i.test(name) || ["phone", "contactPhone"].includes(name);
    const isEmailField = /email$/i.test(name) || ["email", "contactEmail"].includes(name);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    // Add min date constraint for planEndDate based on planStartDate
    const minDate = (type === 'date' && name === 'planEndDate' && localValues.planStartDate)
      ? localValues.planStartDate
      : undefined;

    const handlePhoneBeforeInput = (e: any) => {
      if (isFieldReadOnly) return;
      const data = e.data as string;
      if (!data) return; // non-insert events
      const input = e.target as HTMLInputElement;
      const selStart = input.selectionStart ?? 0;
      const selEnd = input.selectionEnd ?? selStart;
      const current = String(input.value || "");
      const next = current.slice(0, selStart) + data + current.slice(selEnd);
      if (!/^\+?\d*$/.test(next)) {
        e.preventDefault();
      }
    };

    const handlePhoneKeyDown = (e: any) => {
      if (isFieldReadOnly) return;
      const allowedKeys = [
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "Tab",
        "Home",
        "End",
      ];
      if (allowedKeys.includes(e.key)) return;
      if (e.ctrlKey || e.metaKey) return; // allow copy/paste/select all
      if (e.key >= "0" && e.key <= "9") return;
      if (e.key === "+") {
        const input = e.currentTarget as HTMLInputElement;
        const hasPlus = (input.value || "").includes("+");
        const caretAtStart = (input.selectionStart ?? 0) === 0;
        if (!hasPlus && caretAtStart) return;
      }
      e.preventDefault();
    };

    const handlePhonePaste = (e: any) => {
      if (isFieldReadOnly) return;
      const text = (e.clipboardData?.getData("text") || "").trim();
      const sanitized = text.replace(/[^\d+]/g, "");
      // Keep only a single leading +
      const normalized = sanitized.replace(/\+/g, "").replace(/^/, text.startsWith("+") ? "+" : "");
      e.preventDefault();
      const input = e.currentTarget as HTMLInputElement;
      const selStart = input.selectionStart ?? 0;
      const selEnd = input.selectionEnd ?? selStart;
      const current = String(input.value || "");
      const next = current.slice(0, selStart) + normalized + current.slice(selEnd);
      input.value = next;
      const newValues = { ...localValues, [name]: next };
      setLocalValues(newValues);
      const isCommon = !!commonFieldsMapping[name];
      onChange(newValues, name, isCommon);
    };

    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          type={isPhoneField ? "tel" : isEmailField ? "email" : type}
          name={name}
          value={displayValue}
          min={minDate}
          onChange={isCommon ? undefined : (e) => {
            handleChange(e as any);
            if (isEmailField) {
              const v = (e.target as HTMLInputElement).value.trim();
              setLocalEmailErrors((prev) => {
                const next = { ...prev };
                if (v && !emailRegex.test(v)) {
                  next[name] = "Enter a valid email address";
                } else {
                  delete next[name];
                }
                return next;
              });
            }
          }}
          onBlur={isEmailField ? (e) => {
            const v = (e.target as HTMLInputElement).value.trim();
            setLocalEmailErrors((prev) => {
              const next = { ...prev };
              if (v && !emailRegex.test(v)) {
                next[name] = "Enter a valid email address";
              } else {
                delete next[name];
              }
              return next;
            });
          } : undefined}
          onBeforeInput={isPhoneField ? handlePhoneBeforeInput : undefined}
          onKeyDown={isPhoneField ? handlePhoneKeyDown : undefined}
          onPaste={isPhoneField ? handlePhonePaste : undefined}
          inputMode={isPhoneField ? "tel" : isEmailField ? "email" : undefined}
          pattern={isPhoneField ? "^\\+?\\d*$" : undefined}
          placeholder={isCommon ? "Value from common fields" : placeholder}
          disabled={isFieldReadOnly}
          className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder-gray-400 ${fieldErrors[name] || localEmailErrors[name]
            ? "border-red-300 bg-red-50"
            : isCommon
              ? "bg-blue-50 border-blue-200 text-blue-800"
              : "hover:border-accent/40"
            } ${isFieldReadOnly ? "cursor-not-allowed" : ""}`}
          aria-invalid={fieldErrors[name] || localEmailErrors[name] ? true : false}
        />
        {fieldErrors[name] && (
          <p className="text-xs text-red-500 mt-1">{fieldErrors[name]}</p>
        )}
        {!fieldErrors[name] && localEmailErrors[name] && (
          <p className="text-xs text-red-500 mt-1">{localEmailErrors[name]}</p>
        )}
      </div>
    );
  };

  const renderAutoResizeTextArea = (
    label: string,
    name: string,
    placeholder?: string,
    required?: boolean,
    maxWords?: number
  ) => {
    const isCommon = isCommonField(name);
    const displayValue = isCommon
      ? getCommonFieldValue(name)
      : localValues[name] || "";
    const isFieldReadOnly = readOnly || isCommon;

    return (
      <AutoResizeTextArea
        label={label}
        name={name}
        value={displayValue}
        onChange={isCommon ? (undefined as any) : handleChange}
        placeholder={isCommon ? "Value from common fields" : placeholder}
        required={required}
        readOnly={isFieldReadOnly}
        maxWords={maxWords}
        fieldError={fieldErrors[name]}
      />
    );
  };

  const renderCheckbox = (label: string, name: string, required?: boolean) => {
    const isCommon = isCommonField(name);
    const displayValue = isCommon
      ? getCommonFieldValue(name)
      : localValues[name];
    const isFieldReadOnly = readOnly || isCommon;

    return (
      <div className="flex flex-col gap-1">
        <label
          className={`flex items-start gap-3 ${isFieldReadOnly ? "cursor-not-allowed" : "cursor-pointer"}`}
          onClick={() => {
            if (!isFieldReadOnly) {
              const newValue = !displayValue;
              const event = {
                target: { name, value: newValue }
              } as any;
              handleChange(event);
            }
          }}
        >
          <div className={`mt-1 w-5 h-5 border-2 rounded flex-shrink-0 flex items-center justify-center transition-all ${displayValue ? "border-indigo-600 bg-indigo-50" : "border-gray-300"}`}>
            {displayValue && (
              <span className="text-indigo-600 font-bold text-xs">X</span>
            )}
          </div>
          <span
            className={`text-sm leading-relaxed ${isCommon ? "text-blue-800 font-medium" : "text-gray-700"
              }`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </label>
        {fieldErrors[name] && (
          <p className="text-xs text-red-500 mt-1">{fieldErrors[name]}</p>
        )}
      </div>
    );
  };

  const renderRadioGroup = (
    label: string,
    name: string,
    options: string[],
    required?: boolean
  ) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={localValues[name] === option}
              onChange={handleChange}
              disabled={readOnly}
              className="accent-accent cursor-pointer"
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

  const renderDropdown = (
    label: string,
    name: string,
    options: string[],
    required?: boolean
  ) => {
    const isCommon = isCommonField(name);
    const rawValue = isCommon
      ? getCommonFieldValue(name)
      : localValues[name] || "";
    // Ensure value is always a string (handle arrays, objects, null, undefined)
    const displayValue = typeof rawValue === 'string'
      ? rawValue
      : Array.isArray(rawValue)
        ? rawValue[0] || ""
        : rawValue != null
          ? String(rawValue)
          : "";
    const isFieldReadOnly = readOnly || isCommon;
    const selectId = `select-${name}`;

    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={selectId} className="text-xs font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
          id={selectId}
          aria-label={label}
          name={name}
          value={displayValue}
          onChange={isCommon ? undefined : handleChange}
          disabled={isFieldReadOnly}
          className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all ${fieldErrors[name]
            ? "border-red-300 bg-red-50"
            : isCommon
              ? "bg-blue-50 border-blue-200 text-blue-800"
              : "hover:border-accent/40"
            } ${isFieldReadOnly ? "cursor-not-allowed" : ""}`}
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
  };

  const renderSignatureField = (
    label: string,
    name: string,
    canvasRef: React.RefObject<SignatureCanvasRef>,
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
          ref={canvasRef}
          onSignatureEnd={(dataUrl: string) =>
            handleSignatureEnd(name, dataUrl)
          }
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

  const FIELD_METADATA: any = {
    participantName: { label: "Name", type: "text" },
    ndisNumber: { label: "NDIS number", type: "text" },
    planStartDate: { label: "Start Date", type: "date", placeholder: "Select start date" },
    planEndDate: { label: "End Date", type: "date", placeholder: "Select end date" },
    dob: { label: "DOB", type: "text" },
    gender: { label: "Gender", type: "text" },
    address: { label: "Address", type: "text" },
    email: { label: "Email Address", type: "text" },
    phone: { label: "Phone", type: "text" },
    preferredContactPerson: { label: "Preferred Contact Person", type: "text" },
    communicationConsiderations: {
      label: "Communication considerations",
      type: "text",
    },
    contactName: { label: "Name", type: "text" },
    relationship: { label: "Relationship to participant", type: "text" },
    contactAddress: { label: "Address", type: "text" },
    contactPhone: { label: "Contact phone number", type: "text" },
    contactEmail: { label: "Email Address", type: "text" },
    funding: {
      label: "Funding",
      type: "dropdown",
      options: ["Plan managed", "Self-managed", "NDIA managed", "Other"],
    },
    fundingOther: { label: "Other Fundings's: ", type: "text" },
    goal1: { label: "Goal 1", type: "text" },
    goal2: { label: "Goal 2", type: "text" },
    goal3: { label: "Goal 3", type: "text" },
    goal4: { label: "Goal 4", type: "text" },
    goal5: { label: "Goal 5", type: "text" },
    goal6: { label: "Goal 6", type: "text" },
    goal7: { label: "Goal 7", type: "text" },
    coreSupportText: { label: "Support Required: ", type: "textarea" },
    corePreferredProviders: {
      label: "Preferred providers",
      type: "textarea",
    },
    corePreferredProviders2: {
      label: "Preferred providers",
      type: "textarea",
    },

    coreAlternativeProviders: {
      label: "Alternative providers ",
      type: "textarea",
    },
    coreAlternativeProviders2: {
      label: "Alternative providers ",
      type: "textarea",
    },

    coreAgreementSigned: {
      label: "Service Agreement developed/signed?",
      type: "dropdown",
      options: yesNoOptions,
    },
    coreSupportsCommenced: { label: "Supports have commenced", type: "textarea" },
    coreBudgetApproved: {
      label: "Discussion held with Plan Manager and budget approved?",
      type: "dropdown",
      options: yesNoOptions,
    },

    capacitySupportText: { label: "Supports Required: ", type: "textarea" },
    capacityPreferredProviders: {
      label: "Preferred providers",
      type: "textarea",
    },
    capacityPreferredProviders2: {
      label: "Preferred providers ",
      type: "textarea",
    },

    capacityAlternativeProviders: {
      label: "Alternative providers ",
      type: "textarea",
    },
    capacityAlternativeProviders2: {
      label: "Alternative providers ",
      type: "textarea",
    },

    capacityAgreementSigned: {
      label: "Service Agreement developed/signed?",
      type: "dropdown",
      options: yesNoOptions,
    },
    capacitySupportsInPlace: {
      label: "Supports in place at start of plan",
      type: "text",
    },
    capacityAssessmentRequired: {
      label: "Are additional assessments required to access this support type?",
      type: "dropdown",
      options: yesNoOptions,
    },
    capacityActions: { label: "Actions:", type: "text" },
    capacityBudgetApproved: {
      label: "Discussion held with Plan Manager and budget approved?",
      type: "dropdown",
      options: yesNoOptions,
    },

    supportRequired1: { label: "Support Required", type: "textarea" },
    preferredProviders1: { label: "Preferred providers ", type: "textarea" },
    preferredProvidersCapital2: {
      label: "Prefered Providers ",
      type: "textarea",
    },
    alternativeProviders1: {
      label: "Alternative providers ",
      type: "textarea",
    },
    alternativeProvidersCapital2: {
      label: "Alternate Providers ",
      type: "textarea",
    },
    serviceAgreement1: {
      label: "Service Agreement developed/signed?",
      type: "dropdown",
      options: yesNoOptions,
    },
    additionalAssessment1: {
      label: "Are additional assessments required to access this support type?",
      type: "dropdown",
      options: yesNoOptions,
    },
    assessmentActions1: { label: "Actions:", type: "text" },
    planManagerDiscussion1: {
      label: "Discussion held with Plan Manager and budget approved?",
      type: "dropdown",
      options: yesNoOptions,
    },

    supportRequired2: { label: "Support Required", type: "textarea" },
    preferredProviders2: { label: "Preferred providers ", type: "textarea" },
    preferredProvidersMainstream2: {
      label: "Preferred Providers ",
      type: "textarea",
    },
    alternativeProviders2: {
      label: "Alternative providers ",
      type: "textarea",
    },
    alternativeProvidersMainstream2: {
      label: "Alternative Providers ",
      type: "textarea",
    },
    serviceAgreement2: {
      label: "Service Agreement developed/signed?",
      type: "dropdown",
      options: yesNoOptions,
    },
    additionalAssessment2: {
      label: "Are additional assessments required to access this support type?",
      type: "dropdown",
      options: yesNoOptions,
    },
    assessmentActions2: { label: "Actions:", type: "text" },

    budgetApproval: {
      label: "Discussion held with Plan Manager and budget approved?",
      type: "dropdown",
      options: yesNoOptions,
    },
    goalsText: {
      label: "Goals and funding required for next plan",
      type: "textarea",
    },

    participantSignature: {
      label: "Participant’s or Participant’s Representative’s Signature",
      type: "signature",
    },
    participantDate: { label: "Date", type: "text" },
    authorSignature: { label: "Author’s Signature", type: "signature" },
    authorDate: { label: "Date", type: "text" },
  };

  // Validation function to check if all required fields are filled
  const validateRequiredFields = () => {
    const missingFields: string[] = [];

    FORM_SECTIONS.forEach((section: any) => {
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
    });

    return {
      isValid: missingFields.length === 0,
      missingFields,
    };
  };

  const handleFormSubmitCheckValidation = async () => {
    try {
      console.log("form submitted");
      setSubmitting(true);
      const validationResult = validateRequiredFields();

      if (validationResult.isValid) {
        if (handleSubmitForm) {
          await handleSubmitForm();
        }
      } else {
        showToast({
          type: "error",
          title: "Missing Required Fields",
          message: validationResult.missingFields.join(", "),
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
      setSubmitting(false);
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

  useEffect(() => {
    if (localValues.funding !== "Other" && localValues.fundingOther) {
      const updated = { ...localValues, fundingOther: "" };
      setLocalValues(updated);
      onChange(updated, "fundingOther", false);
    }
  }, [localValues.funding]);

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
              {React.createElement(FORM_SECTIONS[currentStep]?.icon, {
                className: "w-6 h-6 text-indigo-600",
              })}
              {FORM_SECTIONS[currentStep]?.title}
            </h2>
            <p className="text-sm text-gray-500 font-medium mt-1">
              {FORM_SECTIONS[currentStep]?.description}
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
              {FORM_SECTIONS[currentStep].id === "paymentManagement" ? (
                // Special layout for payment management section
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
                      Payment Management Options
                    </h3>
                    <div className="space-y-4">
                      {[
                        "selfManaged",
                        "nomineeManaged",
                        "ndiaManaged",
                        "planManagerManaged",
                      ].map((field) => {
                        const meta = FIELD_METADATA[field] || {
                          label: field,
                          type: "checkbox",
                        };
                        const required = isFieldRequired(field);

                        return (
                          <div key={field}>
                            {renderCheckbox(meta.label, field, required)}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Additional fields for plan manager */}
                  {localValues.planManagerManaged && (
                    <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">
                        Plan Manager Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {["planManagerName", "fundingSource"].map((field) => {
                          const meta = FIELD_METADATA[field] || {
                            label: field,
                            type: "text",
                          };
                          const required = isFieldRequired(field);

                          return (
                            <div key={field}>
                              {renderInput(
                                meta.label,
                                field,
                                meta.type || "text",
                                meta.placeholder,
                                required
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : FORM_SECTIONS[currentStep].id === "signatures" ? (
                // Special layout for signatures section
                <div className="space-y-6">
                  {/* Participant Signature */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
                      Participant Signature
                    </h3>
                    <div className="space-y-4">
                      {renderSignatureField(
                        "Signature of participant / Representative Signature",
                        "participantSignature",
                        participantSigCanvasRef,
                        "Draw participant signature",
                        isFieldRequired("participantSignature")
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderInput(
                          "Date of participant / Representative Signature",
                          "participantSignatureDate",
                          "date",
                          "",
                          isFieldRequired("participantSignatureDate")
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Provider Signature */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
                      Authorizer Signature
                    </h3>
                    <div className="space-y-4">
                      {renderSignatureField(
                        "Signature on behalf of Infinity Supports WA",
                        "authorSignature",
                        authorSignature,
                        "Draw provider signature"
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderInput(
                          "Date of provider signature",
                          "providerSignatureDate",
                          "date"
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : FORM_SECTIONS[currentStep].id === "coreSupports" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full width fields */}
                  <div className="md:col-span-2">
                    {renderAutoResizeTextArea(
                      "Support Required",
                      "coreSupportText"
                    )}
                  </div>

                  <div className="md:col-span-2">
                    {renderAutoResizeTextArea(
                      "Preferred Providers ",
                      "corePreferredProviders"
                    )}
                  </div>

                  <div className="md:col-span-2">
                    {renderAutoResizeTextArea(
                      "Alternative Providers ",
                      "coreAlternativeProviders"
                    )}
                  </div>

                  {/* Dropdown - full width */}
                  <div className="md:col-span-2">
                    {renderDropdown(
                      "Service Agreement developed/signed?",
                      "coreAgreementSigned",
                      yesNoOptions
                    )}
                  </div>

                  {/* Side-by-side: Support Co-ordinator Action + Discussion */}
                  <div>
                    {renderAutoResizeTextArea(
                      "Support Co-ordinator Action",
                      "coreSupportsCommenced"
                    )}
                  </div>
                  <div>
                    {renderDropdown(
                      "Discussion held with Plan Manager and budget approved?",
                      "coreBudgetApproved",
                      yesNoOptions
                    )}
                  </div>
                </div>
              ) :

                FORM_SECTIONS[currentStep].id === "capacityBuilding" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      {renderAutoResizeTextArea(
                        "Support Required",
                        "capacitySupportText"
                      )}
                    </div>

                    <div className="md:col-span-2">{renderAutoResizeTextArea("Preferred Providers ", "capacityPreferredProviders")}</div>

                    <div className="md:col-span-2">{renderAutoResizeTextArea("Alternative Providers ", "capacityAlternativeProviders")}</div>

                    {renderDropdown("Service Agreement developed/signed?", "capacityAgreementSigned", yesNoOptions)}
                    {renderInput("Supports in place at start of plan", "capacitySupportsInPlace")}
                    {renderDropdown("Are additional assessments required?", "capacityAssessmentRequired", yesNoOptions)}
                    {localValues.capacityAssessmentRequired === "Yes" && renderAutoResizeTextArea("If Yes - Actions", "capacityActions")}
                    {renderDropdown("Discussion held with Plan Manager and budget approved?", "capacityBudgetApproved", yesNoOptions)}
                  </div>

                ) : FORM_SECTIONS[currentStep].id === "ndisFundedSupports" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      {renderAutoResizeTextArea("Support Required", "supportRequired1")}
                    </div>

                    <div className="md:col-span-2">{renderAutoResizeTextArea("Preferred Providers ", "preferredProviders1")}</div>

                    <div className="md:col-span-2">{renderAutoResizeTextArea("Alternative Providers ", "alternativeProviders1")}</div>
                    {renderDropdown("Service Agreement developed/signed?", "serviceAgreement1", yesNoOptions)}
                    {renderDropdown("Are additional assessments required to access this support type?", "additionalAssessment1", yesNoOptions)}
                    {localValues.additionalAssessment1 === "Yes" && renderAutoResizeTextArea("If Yes - Actions", "assessmentActions1")}
                    {renderDropdown("Discussion held with Plan Manager and budget approved?", "planManagerDiscussion1", yesNoOptions)}
                  </div>

                ) : FORM_SECTIONS[currentStep].id === "mainstreamSupports" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      {renderAutoResizeTextArea("Support Required", "supportRequired2")}
                    </div>

                    <div className="md:col-span-2">{renderAutoResizeTextArea("Preferred Providers ", "preferredProviders2")}</div>

                    <div className="md:col-span-2">{renderAutoResizeTextArea("Alternative Providers ", "alternativeProviders2")}</div>

                    {renderDropdown("Service Agreement developed/signed?", "serviceAgreement2", yesNoOptions)}
                    {renderDropdown("Are additional assessments required to access this support type?", "additionalAssessment2", yesNoOptions)}
                    {localValues.additionalAssessment2 === "Yes" && renderAutoResizeTextArea("If Yes - Actions", "assessmentActions2")}
                    {renderDropdown("Discussion held with Plan Manager and budget approved?", "budgetApproval", yesNoOptions)}
                  </div>)








                  : (
                    // Standard grid layout for other sections
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {FORM_SECTIONS[currentStep].fields.map((field: any) => {
                        const meta = FIELD_METADATA[field] || {
                          label: field,
                          type: "text",
                        };
                        const required = isFieldRequired(field);

                        if (
                          field === "fundingOther" &&
                          localValues.funding !== "Other"
                        ) {
                          return null;
                        }

                        if (meta.type === "checkbox") {
                          return (
                            <div key={field} className="md:col-span-2">
                              {renderCheckbox(meta.label, field, required)}
                            </div>
                          );
                        }
                        if (meta.type === "radio") {
                          return (
                            <div key={field} className="md:col-span-2">
                              {renderRadioGroup(
                                meta.label,
                                field,
                                meta.options || [],
                                required
                              )}
                            </div>
                          );
                        }
                        if (meta.type === "dropdown") {
                          return (
                            <div key={field} className="md:col-span-2">
                              {renderDropdown(
                                meta.label,
                                field,
                                meta.options || [],
                                required
                              )}
                            </div>
                          );
                        }
                        if (
                          field === "contactAddress" ||
                          field === "address" ||
                          field === "communicationConsiderations" ||
                          field.startsWith("goal")
                        ) {
                          return (
                            <div key={field} className="md:col-span-2">
                              {renderAutoResizeTextArea(
                                meta.label,
                                field,
                                meta.placeholder,
                                required
                              )}
                            </div>
                          );
                        }
                        return (
                          <div key={field}>
                            {renderInput(
                              meta.label,
                              field,
                              meta.type || "text",
                              meta.placeholder,
                              required
                            )}
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
              disabled={currentStep === 0 || isPrevLoading}
              className={`flex items-center justify-center space-x-1 px-5 py-2 rounded-full font-semibold transition-all text-sm shadow border duration-200 w-full md:w-1/3 ${currentStep === 0 || navigatingPrev
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                : "bg-gradient-to-r from-gray-700 to-gray-900 text-white border-gray-700 hover:from-gray-800 hover:to-black"
                }`}
            >
              {isPrevLoading ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaChevronLeft className="w-4 h-4" />}
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={handleNextSequential}
              disabled={
                currentStep === FORM_SECTIONS.length - 1 ||
                !isCurrentSectionComplete() ||
                isNextLoading
              }
              className={`flex items-center justify-center space-x-1 px-5 py-2 rounded-full font-semibold transition-all text-sm shadow border duration-200 w-full md:w-1/3 ${currentStep === FORM_SECTIONS.length - 1 ||
                !isCurrentSectionComplete() ||
                isNextLoading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                : "bg-gradient-to-r from-indigo-600 to-green-400 text-white border-indigo-600 hover:from-indigo-700 hover:to-green-500"
                }`}
            >
              <span>Next</span>
              {isNextLoading ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaChevronRight className="w-4 h-4" />}
            </button>

            <button
              onClick={() => handleSaveProgress && handleSaveProgress()}
              disabled={saving || submitting}
              className="flex items-center justify-center gap-1 px-5 py-2 rounded-full font-semibold text-sm bg-gray-600 hover:bg-gray-700 text-white shadow border border-gray-700 transition-all duration-200 w-full md:w-1/3 disabled:opacity-50"
            >
              {saving ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaSave className="w-4 h-4" />}
              {saving ? "Saving..." : "Save Progress"}
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
              {submitting ? (
                <FaSpinner className="w-4 h-4 animate-spin" />
              ) : (
                "Submit Form"
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

export default ScheduleForSupportEdit;
