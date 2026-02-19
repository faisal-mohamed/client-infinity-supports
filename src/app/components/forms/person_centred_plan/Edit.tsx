"use client";

import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from "react";
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
  FaPlus,
  FaTimes,
} from "react-icons/fa";
import { useToast } from "@/components/ui/Toast";

// Match Client Intake form's custom spinner (hourglass emoji)
const FaSpinner = ({ className }: { className?: string }) => <span className={className}>⏳</span>;

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
    const adjustHeight = useCallback(() => {
      const textarea = textAreaRef.current;
      if (textarea) {
        textarea.style.height = 'auto'; // Reset height to recalculate
        textarea.style.height = `${Math.max(textarea.scrollHeight, rows * 24)}px`; // Set to scrollHeight but respect min rows
      }
    }, [rows]);

    // Adjust height on value change (initial load + dynamic updates)
    useLayoutEffect(() => {
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
  onChange: (values: any, field?: string, isCommon?: boolean, fullReplace?: boolean) => void;
  onSubmit?: (values: any) => void;
  readOnly?: boolean;
  fieldErrors?: Record<string, string>;
  handleSave: (submit: boolean) => void;
  handleSaveProgress?: () => Promise<void>;
  handleSaveForNext?: () => Promise<void>;
  handleSaveForPrev?: () => Promise<void>;
  handleSubmitForm?: () => Promise<void>;
  saving?: boolean;
  navigatingNext?: boolean;
  navigatingPrev?: boolean;
  onCommonFieldsUpdated?: () => void;
}

const FORM_SECTIONS = [
  {
    id: "personalInfo",
    title: "Personal Information",
    icon: FaUser,
    description: "Basic personal details and identification",
    fields: [
      "name", "address", "dob", "guardian", "guardianAddress",
      "contactNumber", "disability", "ndisNumber"
    ],
    requiredFields: ["name", "dob", "ndisNumber"],
  },
  {
    id: "personalStory",
    title: "Personal Story & Strengths",
    icon: FaHeart,
    description: "Personal background, strengths and challenges",
    fields: [
      "myStory", "strengths", "challenges", "allergies"
    ],
    requiredFields: ["myStory", "strengths"],
  },
  {
    id: "healthInfo",
    title: "Health Information",
    icon: FaHeart,
    description: "Health conditions and medical information",
    fields: [
      "respiratoryHistory", "precautions", "healthConditions",
      "companionCard", "ambulanceCover", "healthcarePrompt"
    ],
    requiredFields: ["healthConditions"],
  },
  {
    id: "goals",
    title: "Goals & Outcomes",
    icon: FaBullseye,
    description: "Personal goals and achievement tracking",
    fields: [
      "goal1", "rating1", "actions1", "byWhom1", "byWhen1", "reviewDate1",
      "goal2", "rating2", "actions2", "byWhom2", "byWhen2", "reviewDate2",
      "goal3", "rating3", "actions3", "byWhom3", "byWhen3", "reviewDate3"
    ],
    requiredFields: ["goal1"],
  },
  {
    id: "supportInfo",
    title: "Support Information",
    icon: FaUsers,
    description: "Support services and informal supports",
    fields: [
      "pbsSupportPlanIncluded", "restrictivePractices", "organizationName",
      "contactPersonOrg", "contactNumberOrg",
      "support1", "role1", "frequency1",
      "support2", "role2", "frequency2",
      "support3", "role3", "frequency3",
      "support4", "role4", "frequency4"
    ],
    requiredFields: ["organizationName", "contactPersonOrg"],
  },
];

const commonFieldsMapping: Record<string, string> = {
  name: "name",
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

const PersonCentredPlanEdit: React.FC<FormProps> = ({
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
  saving = false,
  navigatingNext = false,
  navigatingPrev = false,
  onCommonFieldsUpdated,
}: any) => {

  // Helper function to get common field value
  const getCommonFieldValue = (fieldName: string): string => {
    // For name field, combine first name and surname to show full name
    if (fieldName === 'name') {
      const firstName = commonFieldsData?.name || '';
      const surname = commonFieldsData?.surname || '';
      const fullName = [firstName, surname].filter(Boolean).join(' ').trim();
      if (fullName) {
        return fullName;
      }
      // Fallback to formData.name if it exists
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
  const [numberOfGoals, setNumberOfGoals] = useState(1); // Start with 1 goal by default
  const hasInitializedGoals = useRef(false);

  // Detect existing goals when form loads (only once on mount)
  useEffect(() => {
    if (formData && !hasInitializedGoals.current) {
      let maxGoalNum = 0;
      // Check up to 20 goals to find the highest goal number with data
      for (let i = 1; i <= 20; i++) {
        const hasGoal =
          formData[`goal${i}`] ||
          formData[`rating${i}`] ||
          formData[`actions${i}`] ||
          formData[`byWhom${i}`] ||
          formData[`byWhen${i}`] ||
          formData[`reviewDate${i}`];
        if (hasGoal) {
          maxGoalNum = i;
        }
      }
      // Set numberOfGoals to at least 1, or the number of goals found
      if (maxGoalNum > 0) {
        setNumberOfGoals(maxGoalNum);
      }
      hasInitializedGoals.current = true;
    }
  }, [formData]); // Run when formData changes

  const initialValues = {
    // Personal Information - these will be overridden by common fields if available
    name: commonFieldsData?.name || "",
    address: commonFieldsData?.street || "",
    dob: commonFieldsData?.dob || "",
    guardian: "",
    guardianAddress: "",
    contactNumber: "",
    disability: commonFieldsData?.disability || "",
    ndisNumber: commonFieldsData?.ndis || "",

    // Personal Story & Strengths
    myStory: "",
    strengths: "",
    challenges: "",
    allergies: "",

    // Health Information
    respiratoryHistory: "",
    precautions: "",
    healthConditions: "",
    companionCard: "",
    ambulanceCover: "",
    healthcarePrompt: "",

    // Goals (3 goals with 6 fields each)
    goal1: "",
    rating1: "",
    actions1: "",
    byWhom1: "",
    byWhen1: "",
    reviewDate1: "",

    goal2: "",
    rating2: "",
    actions2: "",
    byWhom2: "",
    byWhen2: "",
    reviewDate2: "",

    goal3: "",
    rating3: "",
    actions3: "",
    byWhom3: "",
    byWhen3: "",
    reviewDate3: "",

    // Support Information
    pbsSupportPlanIncluded: "",
    restrictivePractices: "",
    organizationName: "",
    contactPersonOrg: "",
    contactNumberOrg: "",

    // Informal Supports (4 rows)
    support1: "",
    role1: "",
    frequency1: "",

    support2: "",
    role2: "",
    frequency2: "",

    support3: "",
    role3: "",
    frequency3: "",

    support4: "",
    role4: "",
    frequency4: "",

    ...formData,
  };

  // Initialize local values with form data
  const [localValues, setLocalValues] = useState<any>(initialValues);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { showToast } = useToast();

  // Loading states
  const [submitting, setSubmitting] = useState(false);
  // Note: 'saving' and 'navigatingNext' states come from parent component via props

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

  const handleRemoveGoal = (goalNumToRemove: number) => {
    // Prevent removing the last remaining goal
    if (numberOfGoals <= 1) {
      showToast({
        type: "warning",
        title: "Cannot Remove Goal",
        message: "At least one goal is required. You cannot remove the last goal.",
        duration: 3000,
      });
      return;
    }

    // Check if goal has any data
    const hasData =
      localValues[`goal${goalNumToRemove}`] ||
      localValues[`rating${goalNumToRemove}`] ||
      localValues[`actions${goalNumToRemove}`] ||
      localValues[`byWhom${goalNumToRemove}`] ||
      localValues[`byWhen${goalNumToRemove}`] ||
      localValues[`reviewDate${goalNumToRemove}`];

    if (hasData) {
      // Show confirmation dialog
      const confirmRemove = window.confirm(
        `Are you sure you want to remove Goal ${goalNumToRemove}? This will permanently delete all data for this goal.\n\nThis action cannot be undone.`
      );

      if (!confirmRemove) {
        return; // User cancelled
      }
    }

    // Proceed with removal
    const newValues = { ...localValues };

    // Delete the selected goal's fields
    const fieldsToRemove = [
      `goal${goalNumToRemove}`,
      `rating${goalNumToRemove}`,
      `actions${goalNumToRemove}`,
      `byWhom${goalNumToRemove}`,
      `byWhen${goalNumToRemove}`,
      `reviewDate${goalNumToRemove}`
    ];

    // Remove these fields from newValues
    fieldsToRemove.forEach(field => {
      delete newValues[field];
    });

    // Rename goals after the removed one
    // If we removed goal 2, then goal3→goal2, goal4→goal3, etc.
    for (let i = goalNumToRemove + 1; i <= numberOfGoals; i++) {
      const fieldsToRename = [
        { old: `goal${i}`, new: `goal${i - 1}` },
        { old: `rating${i}`, new: `rating${i - 1}` },
        { old: `actions${i}`, new: `actions${i - 1}` },
        { old: `byWhom${i}`, new: `byWhom${i - 1}` },
        { old: `byWhen${i}`, new: `byWhen${i - 1}` },
        { old: `reviewDate${i}`, new: `reviewDate${i - 1}` }
      ];

      fieldsToRename.forEach(({ old, new: newName }) => {
        if (newValues[old] !== undefined) {
          newValues[newName] = newValues[old];
          delete newValues[old];
        }
      });
    }

    // Update local state (already has deleted fields removed)
    setLocalValues(newValues);

    // Update parent state - force full replacement to remove deleted fields
    // Pass newValues directly as full replacement (not merged)
    onChange(newValues, undefined, false, true);

    // Show success message
    showToast({
      type: "success",
      title: "Goal Removed",
      message: "The goal has been removed from the form.",
      duration: 3000,
    });

    // Decrease the number of goals
    setNumberOfGoals(numberOfGoals - 1);
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
    try {
      // Use handleSaveForNext if available (parent manages loading state)
      if (handleSaveForNext) {
        await handleSaveForNext();
      } else if (handleSaveProgress) {
        await handleSaveProgress();
      }
      handleNext();
    } catch (error) {
      console.error("Error saving progress:", error);
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to save progress. Please try again.",
        duration: 3000,
      });
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
          className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder-gray-400 ${fieldErrors[name]
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
    const mergedError = (fieldErrors as any)?.[name];

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
    required?: boolean
  ) => (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-xs font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={localValues[name] || ""}
        onChange={handleChange}
        disabled={readOnly}
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
    </div>
  );

  // Helper to check if a field is required in the current section
  const isFieldRequired = (fieldName: string) => {
    return FORM_SECTIONS[currentStep].requiredFields?.includes(fieldName);
  };

  // Field metadata for dynamic rendering
  const FIELD_METADATA: Record<string, any> = {
    // Personal Information
    name: { label: "Name", type: "text", placeholder: "Enter client name" },
    address: { label: "Address", type: "textarea", placeholder: "Enter full address", rows: 2 },
    dob: { label: "Date of Birth", type: "text", placeholder: "Select date of birth" },
    guardian: { label: "Parent/Guardian", type: "text", placeholder: "Enter parent/guardian name" },
    guardianAddress: { label: "Guardian Address", type: "textarea", placeholder: "Enter guardian address", rows: 2 },
    contactNumber: { label: "Contact Number", type: "text", placeholder: "Enter contact number" },
    disability: { label: "Disability", type: "text", placeholder: "Enter disability information" },
    ndisNumber: { label: "NDIS Number", type: "text", placeholder: "Enter NDIS number" },

    // Personal Story & Strengths
    myStory: { label: "My Story", type: "textarea", placeholder: "Tell us about yourself...", rows: 4 },
    strengths: { label: "Strengths", type: "textarea", placeholder: "What are your strengths?", rows: 3 },
    challenges: { label: "Challenges", type: "textarea", placeholder: "What challenges do you face?", rows: 3 },
    allergies: { label: "Allergies", type: "textarea", placeholder: "List any allergies", rows: 3 },

    // Health Information
    respiratoryHistory: { label: "History of Respiratory Depression", type: "textarea", placeholder: "Describe any respiratory history", rows: 3 },
    precautions: { label: "Precautions", type: "textarea", placeholder: "List any precautions needed", rows: 3 },
    healthConditions: { label: "Health Conditions", type: "textarea", placeholder: "Describe health conditions", rows: 3 },
    companionCard: { label: "Companion Card", type: "textarea", placeholder: "Enter companion card details", rows: 2 },
    ambulanceCover: { label: "Ambulance Cover", type: "textarea", placeholder: "Enter ambulance cover details", rows: 2 },
    healthcarePrompt: { label: "Does the participant require support to organize regular medical & dental check ups? (If yes, coordinator to set annual reminders to prompt and assist participant to organize annual health checks)", type: "dropdown", options: yesNoOptions, placeholder: "Select option" },

    // Goals (3 sets)
    goal1: { label: "Goal 1", type: "textarea", placeholder: "Describe your first goal", rows: 3 },
    rating1: { label: "Outcome Rating 1", type: "dropdown", options: outcomeRatingOptions },
    actions1: { label: "Actions & Resources 1", type: "textarea", placeholder: "What actions are needed?", rows: 3 },
    byWhom1: { label: "By Whom 1", type: "text", placeholder: "Who is responsible?" },
    byWhen1: { label: "By When 1", type: "date" },
    reviewDate1: { label: "Review Date 1", type: "date" },

    goal2: { label: "Goal 2", type: "textarea", placeholder: "Describe your second goal", rows: 3 },
    rating2: { label: "Outcome Rating 2", type: "dropdown", options: outcomeRatingOptions },
    actions2: { label: "Actions & Resources 2", type: "textarea", placeholder: "What actions are needed?", rows: 3 },
    byWhom2: { label: "By Whom 2", type: "text", placeholder: "Who is responsible?" },
    byWhen2: { label: "By When 2", type: "date" },
    reviewDate2: { label: "Review Date 2", type: "date" },

    goal3: { label: "Goal 3", type: "textarea", placeholder: "Describe your third goal", rows: 3 },
    rating3: { label: "Outcome Rating 3", type: "dropdown", options: outcomeRatingOptions },
    actions3: { label: "Actions & Resources 3", type: "textarea", placeholder: "What actions are needed?", rows: 3 },
    byWhom3: { label: "By Whom 3", type: "text", placeholder: "Who is responsible?" },
    byWhen3: { label: "By When 3", type: "date" },
    reviewDate3: { label: "Review Date 3", type: "date" },

    // Support Information
    pbsSupportPlanIncluded: { label: "PBS Support Plan included?", type: "dropdown", options: yesNoOptions },
    restrictivePractices: { label: "Any Restrictive Practices?", type: "dropdown", options: yesNoOptions },
    organizationName: { label: "Name of organization", type: "text", placeholder: "Enter organization name" },
    contactPersonOrg: { label: "Contact person", type: "text", placeholder: "Enter contact person name" },
    contactNumberOrg: { label: "Contact number", type: "text", placeholder: "Enter contact number" },

    // Informal Supports (4 rows)
    support1: { label: "Informal Support 1", type: "text", placeholder: "e.g., Mother, Friend" },
    role1: { label: "Role 1", type: "text", placeholder: "What role do they play?" },
    frequency1: { label: "Frequency 1", type: "text", placeholder: "How often? e.g., Daily, Weekly" },

    support2: { label: "Informal Support 2", type: "text", placeholder: "e.g., Brother, Neighbor" },
    role2: { label: "Role 2", type: "text", placeholder: "What role do they play?" },
    frequency2: { label: "Frequency 2", type: "text", placeholder: "How often? e.g., Daily, Weekly" },

    support3: { label: "Informal Support 3", type: "text", placeholder: "e.g., Friend, Cousin" },
    role3: { label: "Role 3", type: "text", placeholder: "What role do they play?" },
    frequency3: { label: "Frequency 3", type: "text", placeholder: "How often? e.g., Daily, Weekly" },

    support4: { label: "Informal Support 4", type: "text", placeholder: "e.g., Neighbor, Colleague" },
    role4: { label: "Role 4", type: "text", placeholder: "What role do they play?" },
    frequency4: { label: "Frequency 4", type: "text", placeholder: "How often? e.g., Daily, Weekly" },
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
      console.log("form submitted")
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
              if (onSubmit) onSubmit(localValues);
            }}
            className="flex flex-col gap-6"
          >
            <div className="space-y-4 md:space-y-8">
              {/* Dynamic Section Rendering */}
              {FORM_SECTIONS[currentStep].id === "goals" ? (
                // Special layout for goals section
                <div className="space-y-6">
                  {Array.from({ length: numberOfGoals }, (_, i) => i + 1).map((num) => (
                    <div key={`goal-${num}`} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Goal {num}</h3>
                        {/* Only show remove button if there's more than 1 goal */}
                        {numberOfGoals > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveGoal(num)}
                            className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1 rounded hover:bg-red-50"
                            title="Remove this goal"
                          >
                            <FaTimes className="text-lg" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { key: `goal${num}`, label: `Goal ${num}`, type: "textarea", rows: 3, placeholder: "Describe your goal", span: 2 },
                          { key: `rating${num}`, label: `Outcome Rating ${num}`, type: "dropdown", options: outcomeRatingOptions, span: 1 },
                          { key: `actions${num}`, label: `Actions & Resources ${num}`, type: "textarea", rows: 3, placeholder: "What actions are needed?", span: 2 },
                          { key: `byWhom${num}`, label: `By Whom ${num}`, type: "text", placeholder: "Who is responsible?", span: 1 },
                          { key: `byWhen${num}`, label: `By When ${num}`, type: "date", span: 1 },
                          { key: `reviewDate${num}`, label: `Review Date ${num}`, type: "date", span: 2 }
                        ].map((field) => {
                          const meta = FIELD_METADATA[field.key] || {};
                          const required = isFieldRequired(field.key);
                          const spanClass = field.span === 2 ? "md:col-span-2" : "";

                          // Use field properties with meta as fallback
                          const label = field.label;
                          const fieldType = field.type || meta.type || "text";
                          const options = field.options || meta.options || [];
                          const rows = field.rows || meta.rows || 3;
                          const placeholder = field.placeholder || meta.placeholder;

                          if (fieldType === "textarea") {
                            return (
                              <div key={field.key} className={spanClass}>
                                {renderTextArea(label, field.key, rows, placeholder, required)}
                              </div>
                            );
                          }
                          if (fieldType === "dropdown") {
                            return (
                              <div key={field.key} className={spanClass}>
                                {renderDropdown(label, field.key, options, required)}
                              </div>
                            );
                          }
                          return (
                            <div key={field.key} className={spanClass}>
                              {renderInput(label, field.key, fieldType, placeholder, required)}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Add Goal Button */}
                  <div className="flex justify-center mt-4">
                    <button
                      type="button"
                      onClick={() => setNumberOfGoals(numberOfGoals + 1)}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
                    >
                      <FaPlus className="text-sm" />
                      Add Goal {numberOfGoals + 1}
                    </button>
                  </div>
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
              disabled={currentStep === FORM_SECTIONS.length - 1 || !isCurrentSectionComplete() || navigatingNext}
              className={`flex items-center justify-center space-x-1 px-5 py-2 rounded-full font-semibold transition-all text-sm shadow border duration-200 w-full md:w-1/3 ${(currentStep === FORM_SECTIONS.length - 1 || !isCurrentSectionComplete() || navigatingNext) ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200" : "bg-gradient-to-r from-indigo-600 to-green-400 text-white border-indigo-600 hover:from-indigo-700 hover:to-green-500"}`}
            >
              <span>Next</span>
              {navigatingNext ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaChevronRight className="w-4 h-4" />}
            </button>

            <button
              onClick={() => handleSaveProgress && handleSaveProgress()}
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
              {submitting ? <FaSpinner className="w-4 h-4 animate-spin" /> : "Submit Form"}
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

export default PersonCentredPlanEdit;
