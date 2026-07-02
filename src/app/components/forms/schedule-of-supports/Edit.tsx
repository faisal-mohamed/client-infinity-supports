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
  FaPlus,
  FaTimes,
} from "react-icons/fa";
import { useToast } from "@/components/ui/Toast";
import SignatureCanvas, { SignatureCanvasRef } from '@/components/ui/SignatureCanvas';

// Hourglass spinner to match Client Intake form
const FaSpinner = ({ className }: { className?: string }) => (
  <span className={className}>⏳</span>
);

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

export const FORM_SECTIONS: any = [

  {
    id: "generalInfo",
    title: "1. General Info",
    fields: ["supportFor", "ndisNumber", "planDatesFrom", "planDatesTo"],
    icon: FaUser,
    requiredFields: []
  },
  {
    id: "scheduleTable",
    title: "2. Schedule of Supports",
    fields: [
      "row0_weeks", "row0_totalHours",
      "row1_weeks", "row1_totalHours",
      "row2_weeks", "row2_totalHours",
      "row3_weeks", "row3_totalHours",
      "row4_weeks", "row4_totalHours",
      "row5_weeks", "row5_totalHours",
      "row6_weeks", "row6_totalHours",
      "row7_weeks", "row7_totalHours",
      "row8_weeks", "row8_totalHours",
      "row9_weeks", "row9_totalHours",
      "row10_weeks", "row10_totalHours",
      "row11_weeks", "row11_totalHours",
      "row12_totalKms",
      "row13_weeks", "row13_totalHours",
      "row14_weeks", "row14_totalHours",
      "row15_weeks", "row15_totalHours",
      "row16_weeks", "row16_totalHours",
      "row17_weeks", "row17_totalHours",
      "row18_weeks", "row18_totalHours",
    ],
    icon: FaUser,
    requiredFields: [],
  },

  {
    id: "transportAgreements",
    title: "3. Transport & Fee Agreements",
    fields: [
      "transportOption1", "transportValue1", "transportOver1",
      "transportOption2", "transportValue2", "transportOver2",
      "transportOption3",
      "establishmentFeeAgreement",
      //   "agreeNonFaceToFace",
      "providerTravelAgreement",

    ],
    icon: FaUser,
    requiredFields: []
  },
  {
    id: "signatures",
    title: "4. Agreement Signatures",
    fields: [
      "signatureRole",
      "participantSignature", "participantSignatureDate", "participantName",
      "nomineeSignature", "nomineeSignatureDate", "nomineeName",
      "representativeSignature", "representativeSignatureDate", "representativeName"
    ],
    icon: FaUser,
    requiredFields: []
  }
];


const commonFieldsMapping: Record<string, string> = {
  ndisNumber: "ndis",
  sex: 'sex',
  supportFor: 'name',
  dob: "dob",
  street: "street",
  state: "state",
  postcode: "postCode",
  email: "email",
  mobilePhone: "phone",
};

// Helper function to check if a field is a common field
const isCommonField = (fieldName: string): boolean => {
  return Object.keys(commonFieldsMapping).includes(fieldName);
};

const yesNoOptions = ["Yes", "No"];
const sexOptions = ["Male", "Female", "Prefer not to say", "Others"];
const indigenousOptions = ["Yes", "No"];

const SADeliveryOfSupportsEdit: React.FC<FormProps> = ({
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
    const commonKey = commonFieldsMapping[fieldName];
    return commonFieldsData?.[commonKey] || '';
  };

  useEffect(() => {
    console.log("Common fields data updated:", commonFieldsData);
  }, [commonFieldsData]);

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [maxStep, setMaxStep] = useState(0);

  // Signature canvas refs
  const participantSigCanvasRef: any = useRef<SignatureCanvasRef | null>(null);
  const nomineeSigCanvasRef: any = useRef<SignatureCanvasRef | null>(null);
  const providerSigCanvasRef: any = useRef<SignatureCanvasRef | null>(null);
  const prevSignatureRoleRef = useRef<string>("");

  // Combine first name and surname for full name
  const fullName = [commonFieldsData?.name, commonFieldsData?.surname].filter(Boolean).join(' ').trim();

  const initialValues: Record<string, any> = {
    ...formData,
    supportFor: formData?.supportFor || fullName || commonFieldsData?.name || '',
    ndisNumber: formData?.ndisNumber || commonFieldsData?.ndis || '',

    signatureRole: formData?.signatureRole || "",
    participantSignature: formData?.participantSignature || "",
    participantSignatureDate: formData?.participantSignatureDate || "",
    participantName: formData?.participantName || "",

    nomineeSignature: formData?.nomineeSignature || "",
    nomineeSignatureDate: formData?.nomineeSignatureDate || "",
    nomineeName: formData?.nomineeName || "",

    representativeSignature: formData?.representativeSignature || "",
    representativeSignatureDate: formData?.representativeSignatureDate || new Date().toISOString().split("T")[0],
    representativeName: formData?.representativeName || "",
    customSupportItems: formData?.customSupportItems || []
  };


  const [localValues, setLocalValues] = useState<any>(initialValues);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { showToast } = useToast();

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
        message: "This field can only be updated from the client's common details section.",
        duration: 3000,
      });
      return;
    }

    // Validate plan dates - end date must be after start date
    if (name === 'planDatesTo' && value) {
      const fromDate = localValues.planDatesFrom;
      if (fromDate && value < fromDate) {
        showToast({
          type: "error",
          title: "Invalid Date Range",
          message: "Plan end date cannot be before the start date.",
          duration: 4000,
        });
        return;
      }
    }

    if (name === 'planDatesFrom' && value) {
      const toDate = localValues.planDatesTo;
      if (toDate && value > toDate) {
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
    if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked;
    }

    const newValues = { ...localValues, [name]: newValue };
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

      return value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && value.length === 0);
    });
  };

  const handleNextSequential = async () => {
    try {
      if (handleSaveForNext) {
        await handleSaveForNext();
      } else if (handleSaveProgress) {
        await handleSaveProgress();
      }
      handleNext();
    } catch (error) {
      console.error('Error in handleNextSequential:', error);
    }
  };

  const handlePreviousSequential = async () => {
    if (currentStep > 0) {
      try {
        if (handleSaveForPrev) {
          await handleSaveForPrev();
        }
        setCurrentStep(currentStep - 1);
      } catch (error) {
        console.error('Error in handlePreviousSequential:', error);
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
    const displayValue = isCommon ? getCommonFieldValue(name) : (localValues[name] || "");
    const isFieldReadOnly = readOnly || isCommon;

    // Add min date constraint for planDatesTo based on planDatesFrom
    const minDate = (type === 'date' && name === 'planDatesTo' && localValues.planDatesFrom)
      ? localValues.planDatesFrom
      : undefined;

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
          min={minDate}
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

  const renderCheckbox = (
    label: string,
    name: string,
    required?: boolean
  ) => {
    const isCommon = isCommonField(name);
    const displayValue = isCommon ? getCommonFieldValue(name) : localValues[name];
    const isFieldReadOnly = readOnly || isCommon;

    return (
      <div className="flex flex-col gap-1">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name={name}
            checked={!!displayValue}
            onChange={isCommon ? undefined : handleChange}
            disabled={isFieldReadOnly}
            className={`mt-1 scale-100 accent-accent ${isFieldReadOnly ? "cursor-not-allowed" : "cursor-pointer"}`}
          />
          <span className={`text-sm leading-relaxed ${isCommon ? "text-blue-800" : "text-gray-700"}`}>
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
          <label key={option} className="flex items-center gap-2 cursor-pointer">
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
    const rawValue = isCommon ? getCommonFieldValue(name) : (localValues[name] || "");
    // Ensure value is always a string (handle arrays, objects, null, undefined)
    const displayValue = typeof rawValue === 'string'
      ? rawValue
      : Array.isArray(rawValue)
        ? rawValue[0] || ""
        : rawValue != null
          ? String(rawValue)
          : "";
    const isFieldReadOnly = readOnly || isCommon;

    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
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


  // Clear transport fields when transportOption changes
  useEffect(() => {
    if (localValues["transportOption1"] !== "Yes") {
      const updated = { ...localValues, transportValue1: "", transportOver1: "" };
      setLocalValues(updated);
    }
  }, [localValues["transportOption1"]]);

  useEffect(() => {
    if (localValues["transportOption2"] !== "Yes") {
      const updated = { ...localValues, transportValue2: "", transportOver2: "" };
      setLocalValues(updated);
    }
  }, [localValues["transportOption2"]]);

  // Clear signature fields when signatureRole changes
  useEffect(() => {
    const currentRole = localValues["signatureRole"];
    const prevRole = prevSignatureRoleRef.current;

    // Only proceed if role actually changed
    if (currentRole !== prevRole) {
      const today = new Date().toISOString().split('T')[0];
      let updated = { ...localValues };
      let hasChanges = false;

      // 1. Always default the date if role is selected and date is currently empty
      if (currentRole === "Participant") {
        if (!localValues["participantSignatureDate"]) {
          updated = { ...updated, participantSignatureDate: today };
          hasChanges = true;
        }
      } else if (currentRole === "Nominee") {
        if (!localValues["nomineeSignatureDate"]) {
          updated = { ...updated, nomineeSignatureDate: today };
          hasChanges = true;
        }
      }

      // 2. ONLY clear fields if shifting FROM a different role (prevRole was not empty)
      if (prevRole !== "" && prevRole !== currentRole) {
        if (currentRole === "Participant") {
          // Clear Nominee fields
          if (localValues["nomineeSignature"] || localValues["nomineeSignatureDate"] || localValues["nomineeName"]) {
            updated = { ...updated, nomineeSignature: "", nomineeSignatureDate: "", nomineeName: "" };
            hasChanges = true;
          }
          if (nomineeSigCanvasRef.current) nomineeSigCanvasRef.current.clear();
        } else if (currentRole === "Nominee") {
          // Clear Participant fields
          if (localValues["participantSignature"] || localValues["participantSignatureDate"] || localValues["participantName"]) {
            updated = { ...updated, participantSignature: "", participantSignatureDate: "", participantName: "" };
            hasChanges = true;
          }
          if (participantSigCanvasRef.current) participantSigCanvasRef.current.clear();
        }
      }

      if (hasChanges) {
        setLocalValues(updated);
      }
    }

    // Update the ref for next comparison
    prevSignatureRoleRef.current = currentRole;
  }, [localValues["signatureRole"]]);

  // Effect to default provider signature date if empty
  useEffect(() => {
    if (!localValues["representativeSignatureDate"]) {
      const today = new Date().toISOString().split('T')[0];
      setLocalValues((prev: any) => ({
        ...prev,
        representativeSignatureDate: today
      }));
    }
  }, []);


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
    // Page 1 – Table row fields (explicitly defined)
    supportFor: { label: "Schedule of Support for ", type: "text", placeholder: "Enter the Participant Name" },
    ndisNumber: { label: "NDIS Number", type: "text", placeholder: "Enter NDIS number" },
    planDatesFrom: { label: "Plan of Date from", type: "date", placeholder: "Select Plan of Date from" },
    planDatesTo: { label: "Plan of Date Till", type: "date", placeholder: "Select Plan of Date till" },



    row0_weeks: {
      label: "Total weeks for 01_049_0107_1_1 Establishment Fee ($735.80/hr)",
      type: "text",
    },
    row0_totalHours: {
      label: "Total Hours for 01_049_0107_1_1 Establishment Fee ($735.80/hr)",
      type: "text",
    },

    row1_weeks: {
      label: "Weeks for 01_011_0107_1_1 Assistance with Self-care weekday daytime ($73.58/hr)",
      type: "text",
    },
    row1_totalHours: {
      label: "Total Hours for 01_011_0107_1_1 Assistance with Self-care weekday daytime ($73.58/hr)",
      type: "text",
    },

    row2_weeks: {
      label: "Weeks for 01_015_0107_1_1 Assistance with Self-care weekday Evening ($81.07/hr)",
      type: "text",
    },
    row2_totalHours: {
      label: "Total Hours for 01_015_0107_1_1 Assistance with Self-care weekday Evening ($81.07/hr)",
      type: "text",
    },

    row3_weeks: {
      label: "Weeks for 01_013_0107_1_1 Assistance with Self-care Saturday ($103.54/hr)",
      type: "text",
    },
    row3_totalHours: {
      label: "Total Hours for 01_013_0107_1_1 Assistance with Self-care Saturday ($103.54/hr)",
      type: "text",
    },

    row4_weeks: {
      label: "Weeks for 01_014_0107_1_1 Assistance with Self-care Sunday ($133.50/hr)",
      type: "text",
    },
    row4_totalHours: {
      label: "Total Hours for 01_014_0107_1_1 Assistance with Self-care Sunday ($133.50/hr)",
      type: "text",
    },

    row5_weeks: {
      label: "Weeks for 01_012_0107_1_1 Assistance with Self-care Public Holiday ($163.46/hr)",
      type: "text",
    },
    row5_totalHours: {
      label: "Total Hours for 01_012_0107_1_1 Assistance with Self-care Public Holiday ($163.46/hr)",
      type: "text",
    },

    row6_weeks: {
      label: "Weeks for 01_016_0104_1_1 Specialised Home-based care for a child ($59.06/hr)",
      type: "text",
    },
    row6_totalHours: {
      label: "Total Hours for 01_016_0104_1_1 Specialised Home-based care for a child ($59.06/hr)",
      type: "text",
    },

    row7_weeks: {
      label: "Weeks for 01_400_0104_1_1 Assistance with Self-Care Activities - High Intensity - Weekday Daytime ($79.60/hr)",
      type: "text",
    },
    row7_totalHours: {
      label: "Total Hours for 01_400_0104_1_1 Assistance with Self-Care Activities - High Intensity - Weekday Daytime ($79.60/hr)",
      type: "text",
    },

    row8_weeks: {
      label: "Weeks for 04_104_0125_6_1 Access Community Social and Rec Activ - Standard - Weekday Daytime ($73.58/hr)",
      type: "text",
    },
    row8_totalHours: {
      label: "Total Hours for 04_104_0125_6_1 Access Community Social and Rec Activ - Standard - Weekday Daytime ($73.58/hr)",
      type: "text",
    },

    row9_weeks: {
      label: "Weeks for 04_103_0125_6_1 Access Community Social and Rec Activ - Standard - Weekday Evening ($81.07/hr)",
      type: "text",
    },
    row9_totalHours: {
      label: "Total Hours for 04_103_0125_6_1 Access Community Social and Rec Activ - Standard - Weekday Evening ($81.07/hr)",
      type: "text",
    },

    row10_weeks: {
      label: "Weeks for 04_105_0125_6_1 Access community and Rec Saturday ($103.54/hr)",
      type: "text",
    },
    row10_totalHours: {
      label: "Total Hours for 04_105_0125_6_1 Access community and Rec Saturday ($103.54/hr)",
      type: "text",
    },

    row11_weeks: {
      label: "Weeks for 04_106_0125_6_1 Access Community and Rec Sunday ($133.50/hr)",
      type: "text",
    },
    row11_totalHours: {
      label: "Total Hours for 04_106_0125_6_1 Access Community and Rec Sunday ($133.50/hr)",
      type: "text",
    },

    row12_weeks: {
      label: "Weeks for 04_102_0125_6_1 Access Community and Rec Public Holiday ($163.46/hr)",
      type: "text",
    },
    row12_totalHours: {
      label: "Total Hours for 04_102_0125_6_1 Access Community and Rec Public Holiday ($163.46/hr)",
      type: "text",
    },

    row13_weeks: {
      label: "Weeks for 09_009_0117_6_3 Skill Development and Training ($83.87/hr)",
      type: "text",
    },
    row13_totalHours: {
      label: "Total Hours for 09_009_0117_6_3 Skill Development and Training ($83.87/hr)",
      type: "text",
    },

    row14_weeks: {
      label: "Weeks for 15_037_0117_1_3 Skill Development and Training including Public Transport training ($73.58/hr)",
      type: "text",
    },
    row14_totalHours: {
      label: "Total Hours for 15_037_0117_1_3 Skill Development and Training including Public Transport training ($73.58/hr)",
      type: "text",
    },

    row15_totalKms: {
      label: "Total Kilometers for 04_590_0125_6_1 Activity based Transport ($1.02 per km)",
      type: "text",
    },

    row16_weeks: {
      label: "Weeks for 01_011_0107_1_1 Provider Travel ($18.39/hr)",
      type: "text",
    },
    row16_totalHours: {
      label: "Total Hours for 01_011_0107_1_1 Provider Travel ($18.39/hr)",
      type: "text",
    },

    row17_weeks: {
      label: "Weeks for 04_104_0125_6_1 Provider Travel ($18.39/hr)",
      type: "text",
    },
    row17_totalHours: {
      label: "Total Hours for 04_104_0125_6_1 Provider Travel ($18.39/hr)",
      type: "text",
    },

    row18_weeks: {
      label: "Weeks for 01_016_0104_1_1 Specialised Home-based care for a child ($61.16/hr)",
      type: "text",
    },
    row18_totalHours: {
      label: "Total Hours for 01_016_0104_1_1 Specialised Home-based care for a child ($61.16/hr)",
      type: "text",
    },

    //page2
    transportOption1: { label: "Infinity Supports WA will claim payment for those supports from the NDIA using the Transport funding Budget", type: "dropdown", options: yesNoOptions },
    transportValue1: { label: "Transport Services provided to the value of _", type: "text" },
    transportOver1: { label: "Anything over this amount will be", type: "text" },

    transportOption2: { label: " Infinity Supports WA will claim payment for those supports from the NDIA using the Core support funding Budget.", type: "dropdown", options: yesNoOptions },
    transportValue2: { label: "For Transport Services provided to the value of", type: "text" },
    transportOver2: { label: "Anything over this amount will be", type: "text" },

    transportOption3: { label: "For any transport services provided. Infinity Supports WA will send the Individual/Plan Manager an invoice for those supports for the Individual/Plan Manager to pay. The Individual/Plan Manager will pay the invoice within 14 days.", type: "dropdown", options: yesNoOptions },

    establishmentFeeAgreement: {
      label: " If you are a new participant to NDIS or Infinity Supports WA, you will be charged $654.70 as per the NDIS Price Guide. ",
      type: "dropdown",
      options: yesNoOptions,
    },
    providerTravelAgreement: {
      label: "I agree to Infinity Supports WA charging 15 minutes Provider Travel per day.",
      type: "dropdown",
      options: yesNoOptions,
    },

    //   agreeNonFaceToFace: {
    //     label: "Agreement to Non-Face-to-Face Charges",
    //     type: "dropdown",
    //     options: yesNoOptions,
    //   },

    // Page 3 – Signatures & Agreements

    participantSignature: {
      label: "Participant Signature",
      type: "signature",
    },
    participantSignatureDate: {
      label: "Participant Signature Date",
      type: "date",
    },
    participantName: {
      label: "Participant Name",
      type: "text",
    },
    nomineeSignature: {
      label: "Nominee Signature",
      type: "signature",
    },
    nomineeSignatureDate: {
      label: "Nominee Signature Date",
      type: "date",
    },
    nomineeName: {
      label: "Nominee Name",
      type: "text",
    },
    representativeSignature: {
      label: "Representative Signature",
      type: "signature",
    },
    representativeSignatureDate: {
      label: "Representative Signature Date",
      type: "date",
    },
    representativeName: {
      label: "Representative Name",
      type: 'text'
    }
  };




  // Validation function to check if all required fields are filled
  // const validateRequiredFields = () => {
  //   const missingFields: string[] = [];

  //   FORM_SECTIONS.forEach((section: any ) => {
  //     section.requiredFields.forEach((fieldName: any ) => {
  //       let value;

  //       // For common fields, get value from commonFieldsData
  //       if (isCommonField(fieldName)) {
  //         value = getCommonFieldValue(fieldName);
  //       } else {
  //         value = localValues[fieldName];
  //       }

  //       // Check if field is empty, null, undefined, or empty string
  //       if (!value || (typeof value === 'string' && value.trim() === '')) {
  //         missingFields.push(`${fieldName}`);
  //       }
  //     });

  //   });

  //   return {
  //     isValid: missingFields.length === 0,
  //     missingFields
  //   };
  // };


  const validateRequiredFields = () => {
    const missingFields: string[] = [];

    // Validate required fields defined per section
    FORM_SECTIONS.forEach((section: any) => {
      section.requiredFields.forEach((fieldName: any) => {
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
    });

    // Conditional signature validation
    if (localValues.signatureRole === "Participant") {
      ["participantSignature", "participantSignatureDate", "participantName"].forEach(field => {
        if (!localValues[field] || (typeof localValues[field] === 'string' && localValues[field].trim() === '')) {
          missingFields.push(field);
        }
      });
    } else if (localValues.signatureRole === "Nominee") {
      ["nomineeSignature", "nomineeSignatureDate", "nomineeName"].forEach(field => {
        if (!localValues[field] || (typeof localValues[field] === 'string' && localValues[field].trim() === '')) {
          missingFields.push(field);
        }
      });
    } else {
      // signatureRole not selected
      missingFields.push("signatureRole");
    }

    // Always required provider fields
    ["representativeSignature", "representativeSignatureDate", "representativeName"].forEach(field => {
      if (!localValues[field] || (typeof localValues[field] === 'string' && localValues[field].trim() === '')) {
        missingFields.push(field);
      }
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

  const supportLineItems = [
    { code: "row0", label: "01_049_0107_1_1 Establishment Fee", rate: 735.80 },
    { code: "row1", label: "01_011_0107_1_1 Assistance with Self-care weekday daytime", rate: 73.58 },
    { code: "row2", label: "01_015_0107_1_1 Assistance with Self-care weekday Evening", rate: 81.07 },
    { code: "row3", label: "01_013_0107_1_1 Assistance with Self-care Saturday", rate: 103.54 },
    { code: "row4", label: "01_014_0107_1_1 Assistance with Self-care Sunday", rate: 133.50 },
    { code: "row5", label: "01_012_0107_1_1 Assistance with Self-care Public Holiday", rate: 163.46 },
    { code: "row6", label: "01_016_0104_1_1 Specialised Home-based care for a child", rate: 59.06 },
    { code: "row7", label: "01_400_0104_1_1 Assistance with Self-Care Activities - High Intensity - Weekday Daytime", rate: 79.60 },
    { code: "row8", label: "04_104_0125_6_1 Access Community Social and Rec Activ - Standard - Weekday Daytime", rate: 73.58 },
    { code: "row9", label: "04_103_0125_6_1 Access Community Social and Rec Activ - Standard - Weekday Evening", rate: 81.07 },
    { code: "row10", label: "04_105_0125_6_1 Access community and Rec Saturday", rate: 103.54 },
    { code: "row11", label: "04_106_0125_6_1 Access Community and Rec Sunday", rate: 133.50 },
    { code: "row12", label: "04_102_0125_6_1 Access Community and Rec Public Holiday", rate: 163.46 },
    { code: "row13", label: "09_009_0117_6_3 Skill Development and Training", rate: 83.87 },
    { code: "row14", label: "15_037_0117_1_3 Skill Development and Training including Public Transport training", rate: 73.58 },
    { code: "row15", label: "04_590_0125_6_1 Activity based Transport", rate: 1.02 }, // Assuming this is per km
    { code: "row16", label: "01_011_0107_1_1 Provider Travel", rate: 18.39 },
    { code: "row17", label: "04_104_0125_6_1 Provider Travel", rate: 18.39 },
    { code: "row18", label: "01_016_0104_1_1 Specialised Home-based care for a child", rate: 61.16 },
  ];





  return (
    <div className="">
      {/* Progress Bar */}
      <div className="w-full max-w-2xl mx-auto pt-2 md:pt-6 px-2">
        <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
          <div className="h-2 bg-gradient-to-r from-indigo-500 to-green-400 rounded-full transition-all" style={{ width: `${getProgressPercentage()}%` }} />
        </div>
        {/* Horizontal Stepper */}
        <nav className="flex items-center justify-between gap-2 overflow-visible pb-2 relative">
          {FORM_SECTIONS.map((section: any, idx: any) => {
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
              {FORM_SECTIONS[currentStep].id === "paymentManagement" ? (
                // Special layout for payment management section
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Payment Management Options</h3>
                    <div className="space-y-4">
                      {["selfManaged", "nomineeManaged", "ndiaManaged", "planManagerManaged"].map((field) => {
                        const meta = FIELD_METADATA[field] || { label: field, type: "checkbox" };
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
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">Plan Manager Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {["planManagerName", "fundingSource"].map((field) => {
                          const meta = FIELD_METADATA[field] || { label: field, type: "text" };
                          const required = isFieldRequired(field);

                          return (
                            <div key={field}>
                              {renderInput(meta.label, field, meta.type || "text", meta.placeholder, required)}
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
                  {renderDropdown(
                    "Who is signing this agreement?",
                    "signatureRole",
                    ["Participant", "Nominee"],
                    true
                  )}

                  {/* Participant Signature */}
                  {localValues.signatureRole === "Participant" && (
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">Participant Signature</h3>
                      <div className="space-y-4">
                        {renderSignatureField("Signature of participant", "participantSignature", participantSigCanvasRef, "Draw participant signature")}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {renderInput("Date of participant signature", "participantSignatureDate", "date")}
                          {renderInput("Name of participant", "participantName", "text", "Enter participant name")}
                        </div>
                      </div>
                    </div>
                  )}

                  {localValues.signatureRole === "Nominee" && (
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">Nominee Signature</h3>
                      <div className="space-y-4">
                        {renderSignatureField("Signature of nominee", "nomineeSignature", nomineeSigCanvasRef, "Draw nominee signature")}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {renderInput("Date of nominee signature", "nomineeSignatureDate", "date")}
                          {renderInput("Name of nominee", "nomineeName", "text", "Enter nominee name")}
                        </div>
                      </div>
                    </div>
                  )}


                  {/* Provider Signature */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Provider Signature</h3>
                    <div className="space-y-4">
                      {renderSignatureField("Signature on behalf of Infinity Supports WA", "representativeSignature", providerSigCanvasRef, "Draw provider signature")}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderInput("Date of provider signature", "representativeSignatureDate", "date")}
                        {renderInput("Name of provider representative", "representativeName", "text", "Enter provider name")}
                      </div>
                    </div>
                  </div>
                </div>
              ) :


                FORM_SECTIONS[currentStep].id === "scheduleTable" ? (
                  <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                    <table className="w-full text-sm text-left text-gray-700">
                      <thead className="bg-gray-100 text-xs font-semibold text-gray-600 uppercase">
                        <tr>
                          <th className="px-4 py-2">Support Item</th>
                          <th className="px-4 py-2">Weeks / KMs</th>
                          <th className="px-4 py-2">Total Hours</th>
                          <th className="px-4 py-2">Cost/hour</th>
                          <th className="px-4 py-2 text-right">Total Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {supportLineItems.map((item) => {
                          const isKmBased = item.code === "row15";
                          const weeksOrKms = parseFloat(localValues[`${item.code}_${isKmBased ? "totalKms" : "weeks"}`] || "0");
                          const hours = isKmBased ? 0 : parseFloat(localValues[`${item.code}_totalHours`] || "0");
                          const total = isKmBased ? weeksOrKms * item.rate : hours * item.rate;

                          return (
                            <tr key={item.code} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-2 text-gray-800">{item.label}</td>
                              <td className="px-4 py-2">
                                <input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  name={`${item.code}_${isKmBased ? "totalKms" : "weeks"}`}
                                  value={localValues[`${item.code}_${isKmBased ? "totalKms" : "weeks"}`] || ""}
                                  onChange={handleChange}
                                  placeholder={isKmBased ? "KMs" : "Weeks"}
                                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                                />
                              </td>
                              <td className="px-4 py-2">
                                {isKmBased ? (
                                  <div className="text-center text-gray-400">-</div>
                                ) : (
                                  <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    name={`${item.code}_totalHours`}
                                    value={localValues[`${item.code}_totalHours`] || ""}
                                    onChange={handleChange}
                                    placeholder="Hours"
                                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                                  />
                                )}
                              </td>
                              <td className="px-4 py-2 text-right text-gray-600">${item.rate.toFixed(2)}</td>
                              <td className="px-4 py-2 text-right font-semibold text-gray-900">${total.toFixed(2)}</td>
                            </tr>
                          );
                        })}

                        {/* Dynamic Custom Rows */}
                        {localValues.customSupportItems?.map((item: any, index: number) => {
                          const total = (parseFloat(item.weeks || "0") || parseFloat(item.totalKms || "0")) * (parseFloat(item.rate || "0"));
                          return (
                            <tr key={`custom-${index}`} className="border-t border-gray-200 bg-blue-50/30 hover:bg-blue-50/50 transition-colors">
                              <td className="px-4 py-2">
                                <input
                                  type="text"
                                  placeholder="Custom Support Description"
                                  value={item.label || ""}
                                  onChange={(e) => {
                                    const newCustom = [...localValues.customSupportItems];
                                    newCustom[index].label = e.target.value;
                                    setLocalValues({ ...localValues, customSupportItems: newCustom });
                                  }}
                                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                                />
                              </td>
                              <td className="px-4 py-2">
                                <input
                                  type="number"
                                  step="0.1"
                                  placeholder="Wk/KM"
                                  value={item.weeks || item.totalKms || ""}
                                  onChange={(e) => {
                                    const newCustom = [...localValues.customSupportItems];
                                    newCustom[index].weeks = e.target.value;
                                    setLocalValues({ ...localValues, customSupportItems: newCustom });
                                  }}
                                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                                />
                              </td>
                              <td className="px-4 py-2">
                                <input
                                  type="number"
                                  step="0.1"
                                  placeholder="Hours"
                                  value={item.totalHours || ""}
                                  onChange={(e) => {
                                    const newCustom = [...localValues.customSupportItems];
                                    newCustom[index].totalHours = e.target.value;
                                    setLocalValues({ ...localValues, customSupportItems: newCustom });
                                  }}
                                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                                />
                              </td>
                              <td className="px-4 py-2">
                                <input
                                  type="number"
                                  step="0.01"
                                  placeholder="Rate"
                                  value={item.rate || ""}
                                  onChange={(e) => {
                                    const newCustom = [...localValues.customSupportItems];
                                    newCustom[index].rate = e.target.value;
                                    setLocalValues({ ...localValues, customSupportItems: newCustom });
                                  }}
                                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                                />
                              </td>
                              <td className="px-4 py-2 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <span className="font-semibold text-gray-900">${total.toFixed(2)}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newCustom = localValues.customSupportItems.filter((_: any, i: number) => i !== index);
                                      setLocalValues({ ...localValues, customSupportItems: newCustom });
                                    }}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                                    title="Remove item"
                                  >
                                    <FaTimes className="w-3 h-3" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          const newCustom = [...(localValues.customSupportItems || []), { label: "", weeks: "", totalHours: "", rate: "" }];
                          setLocalValues({ ...localValues, customSupportItems: newCustom });
                        }}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all shadow-md text-sm font-semibold active:scale-95"
                      >
                        <FaPlus className="w-4 h-4" />
                        <span>Add Custom Support Item</span>
                      </button>
                    </div>
                  </div>
                ) :

                  (FORM_SECTIONS[currentStep].id === "transportAgreements") ?
                    <div className="space-y-6">
                      <div className="space-y-4">
                        {/* Transport Option 1 */}
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          {renderDropdown(
                            "Infinity Supports WA will claim payment for those supports from the NDIA using the Transport funding Budget",
                            "transportOption1",
                            yesNoOptions
                          )}

                          {localValues.transportOption1 === "Yes" && (
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                              {renderInput(
                                "Transport Services provided to the value of",
                                "transportValue1",
                                "text",
                                "$ amount"
                              )}
                              {renderInput(
                                "Anything over this amount will be",
                                "transportOver1",
                                "text",
                                "Excess policy"
                              )}
                            </div>
                          )}
                        </div>

                        {/* Transport Option 2 */}
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          {renderDropdown(
                            "Infinity Supports WA will claim payment for those supports from the NDIA using the Core support funding Budget",
                            "transportOption2",
                            yesNoOptions
                          )}

                          {localValues.transportOption2 === "Yes" && (
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                              {renderInput(
                                "For Transport Services provided to the value of",
                                "transportValue2",
                                "text",
                                "$ amount"
                              )}
                              {renderInput(
                                "Anything over this amount will be",
                                "transportOver2",
                                "text",
                                "Excess policy"
                              )}
                            </div>
                          )}
                        </div>

                        {/* Transport Option 3 */}
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          {renderDropdown(
                            "Infinity Supports WA will send the Individual/Plan Manager an invoice for those supports for the Individual/Plan Manager to pay. The Individual/Plan Manager will pay the invoice within 14 days.",
                            "transportOption3",
                            yesNoOptions
                          )}
                        </div>

                        {/* Establishment Fee & Travel */}
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          {renderDropdown(
                            "If you are a new participant to NDIS or Infinity Supports WA, you will be charged $735.80 as per the NDIS Price Guide.",
                            "establishmentFeeAgreement",
                            yesNoOptions
                          )}
                          {renderDropdown(
                            "I agree to Infinity Supports WA charging 15 minutes Provider Travel per day.",
                            "providerTravelAgreement",
                            yesNoOptions
                          )}
                        </div>
                      </div>
                    </div>



                    : (
                      // Standard grid layout for other sections
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {FORM_SECTIONS[currentStep].fields.map((field: any) => {
                          const meta = FIELD_METADATA[field] || { label: field, type: "text" };
                          const required = isFieldRequired(field);

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
                                {renderRadioGroup(meta.label, field, meta.options || [], required)}
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
            {FORM_SECTIONS.map((_: any, index: any) => (
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

export default SADeliveryOfSupportsEdit;
