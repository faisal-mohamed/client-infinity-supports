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
  FaSpinner,
} from "react-icons/fa";
import { useToast } from "@/components/ui/Toast";
import SignatureCanvas, {
  SignatureCanvasRef,
} from "@/components/ui/SignatureCanvas";

import {
  selfManaged,
  ndiaManaged,
  nomineeManaged,
  planManagerManaged,
} from "@/app/admin/clients/[id]/forms/helper";

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
  onCommonFieldsUpdated?: () => void;
}

const FORM_SECTIONS : any = [
  {
    id: "page1",
    title: "Service Agreement Support Coordination - Section 1",
    description: "",
    icon: "FaClipboardList",
    fields: [
      "date",
      "surname",
      "givenNames",
      "sex",
      "pronoun",
      "indigenousDescent",
      "preferredName",
      "dob",
      "address",
      "state",
      "postcode",
      "email",
      "homePhone",
      "mobile",
      "noCopyRequested",
      "planAttached",
      "planNotAttached",
    ],
    requiredFields: [],
  },
  {
    id: "page2",
    title: "Schedule of Support",
    description: "",
    icon: "FaClipboardList",
    fields: ["scheduleTable", "conflictDeclaration"],
    requiredFields: [],
  },
  {
    id: "page3",
    title: "Infinity Supports WA Service Agreement - Page 3",
    description: "",
    icon: "FaClipboardList",
    fields: [
      "signature",
      "printName",
      "signDate",
      "selfManaged",
      "nomineeManaged",
      "ndiaManaged",
      "planManagerManaged",
      "planManagerName",
      "planManagerEmail",
    ],
    requiredFields: [],
  },
  {
    id: "page7",
    title: "Consent Form",
    description: "",
    icon: "FaClipboardList",
    fields: [
      "consentMedia",
      "consentInfoShare",
      "consentInfoShareOthers",
      "consentAudit",
    ],
    requiredFields: [],
  },
  {
    id: "signatures",
    title: "Consent Form",
    description: "",
    icon: "FaClipboardList",
    fields: [
      "participantSignature",
      "participantDate",
      "participantName",
      "nomineeSignature",
      "nomineeDate",
      "nomineeName",
      "staffSignature",
      "staffDate",
      "staffName",
    ],
    requiredFields: [],
  },
];

const commonFieldsMapping: Record<string, string> = {
  ndisNumber: "ndis",
  sex: "sex",
  givenNames: "name",
  dob: "dob",
  address: "street",
  state: "state",
  postcode: "postCode",
  email: "email",
  mobilePhone: "phone",
  surname: "surname",
  mobile: "phone",
};

// Helper function to check if a field is a common field
const isCommonField = (fieldName: string): boolean => {
  return Object.keys(commonFieldsMapping).includes(fieldName);
};

const yesNoOptions = ["Yes", "No"];
const sexOptions = ["Male", "Female", "Prefer not to say", "Others"];
const indigenousOptions = ["Yes", "No"];

const SASupportCoordinationEdit: React.FC<FormProps> = ({
  formData,
  commonFieldsData,
  onChange,
  onSubmit,
  readOnly = false,
  fieldErrors = {},
  handleSave,
  handleSaveProgress,
  handleSubmitForm,
  onCommonFieldsUpdated,
}: any) => {
  // Helper function to get common field value
  const getCommonFieldValue = (fieldName: string): string => {
    const commonKey = commonFieldsMapping[fieldName];
    return commonFieldsData?.[commonKey] || "";
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

  const generalSignatureRef: any = useRef<SignatureCanvasRef | null>(null); //page 3 signature requirement

  const initialValues = {
    // Page 1: Participant Details
    date: "",
    surname: "",
    givenNames: "",
    sex: "",
    pronoun: "",
    indigenousDescent: "",
    preferredName: "",
    dob: "",
    address: "",
    state: "",
    postcode: "",
    email: "",
    homePhone: "",
    mobile: "",
    noCopyRequested: false,
    planAttached: false,
    planNotAttached: false,

    // Page 2: Schedule of Support (flat format)
    supportCategory1: "",
    weeks1: "",
    totalHours1: "",
    costPerHour1: "",
    totalCost1: "",

    supportCategory2: "",
    weeks2: "",
    totalHours2: "",
    costPerHour2: "",
    totalCost2: "",

    supportCategory3: "",
    weeks3: "",
    totalHours3: "",
    costPerHour3: "",
    totalCost3: "",

    conflictDeclaration: "",
    conflictOption1: "",
    conflictOption2: "",
    conflictOption3: "",

    // Page 3: Signature & Funding

    selfManaged: false,
    nomineeManaged: false,
    ndiaManaged: false,
    planManagerManaged: false,

    planManagerName: "",
    planManagerEmail: "",

    // Page 7: Consent Form
    consentMedia: "",
    consentInfoShare: "",
    consentInfoShareOthers: "",
    consentAudit: "",

    signature: "",
    printName: "",
    signDate: "",

    ...formData,

    participantSignature: "",
    participantDate: "",
    participantName: "",

    nomineeSignature: "",
    nomineeDate: "",
    nomineeName: "",

    providerSignature: "",
    providerSignatureDate: "",
    providerName: "",
  };

  const renderFlatScheduleTable = () => {
    const supportItems = [
      {
        code: "07_001_0106_8_3 Level 1 Support Connection",
        costPerHour: 74.63,
        codeKey: "row1",
      },
      {
        code: "07_002_0106_8_3 Level 2 Support Coordination",
        costPerHour: 100.14,
        codeKey: "row2",
      },
      {
        code: "07_101_0106_6_3 Psychosocial Recovery Coaching",
        costPerHour: 98.3,
        codeKey: "row3",
      },
    ];

    const handleChange = (
      rowKey: string,
      field: "weeks" | "totalHours",
      value: string
    ) => {
      const newValues = { ...localValues };
      newValues[`${rowKey}_${field}`] = value;

      const hours = parseFloat(newValues[`${rowKey}_totalHours`] || "0");
      const rate =
        supportItems.find((item) => item.codeKey === rowKey)?.costPerHour || 0;

      if (!isNaN(hours) && !isNaN(rate)) {
        newValues[`${rowKey}_totalCost`] = (hours * rate).toFixed(2);
      }

      setLocalValues(newValues);
      onChange(newValues);
    };

    return (
      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs font-semibold text-gray-600 uppercase">
            <tr>
              <th className="px-4 py-2">Support Category</th>
              <th className="px-4 py-2">Weeks</th>
              <th className="px-4 py-2">Total Hours</th>
              <th className="px-4 py-2">Cost per hr</th>
              <th className="px-4 py-2 text-right">Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {supportItems.map((item) => {
              const weeks = localValues[`${item.codeKey}_weeks`] || "";
              const totalHours =
                localValues[`${item.codeKey}_totalHours`] || "";
              const totalCost = localValues[`${item.codeKey}_totalCost`] || "";

              return (
                <tr key={item.codeKey} className="border-t">
                  <td className="px-4 py-2">{item.code}</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={weeks}
                      onChange={(e) =>
                        handleChange(item.codeKey, "weeks", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={totalHours}
                      onChange={(e) =>
                        handleChange(item.codeKey, "totalHours", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="px-4 py-2">${item.costPerHour.toFixed(2)}</td>
                  <td className="px-4 py-2 text-right">
                    ${totalCost ? Number(totalCost).toFixed(2) : "0.00"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const [localValues, setLocalValues] = useState<any>(initialValues);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { showToast } = useToast();

  // Loading states
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

    let newValue: any = value;
    if (type === "checkbox") {
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
    return required.every((key : any ) => {
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
    if (handleSaveProgress) {
      await handleSaveProgress();
    }
    handleNext();
  };

  const handlePreviousSequential = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(() => {
    localValues["planManagerName"] = "";
    localValues["fundingSource"] = "";
  }, [localValues["planManagerManaged"]]);
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

    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {type === "textarea" ? (
          <textarea
            name={name}
            value={displayValue}
            onChange={isCommon ? undefined : handleChange}
            placeholder={placeholder}
            disabled={isFieldReadOnly}
            rows={4}
            className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder-gray-400 resize-y ${
              fieldErrors[name]
                ? "border-red-300 bg-red-50"
                : isCommon
                ? "bg-blue-50 border-blue-200 text-blue-800"
                : "hover:border-accent/40"
            } ${isFieldReadOnly ? "cursor-not-allowed" : ""}`}
          />
        ) : (
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
        )}

        {fieldErrors[name] && (
          <p className="text-xs text-red-500 mt-1">{fieldErrors[name]}</p>
        )}
      </div>
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
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name={name}
            checked={!!displayValue}
            onChange={isCommon ? undefined : handleChange}
            disabled={isFieldReadOnly}
            className={`mt-1 scale-100 accent-accent ${
              isFieldReadOnly ? "cursor-not-allowed" : "cursor-pointer"
            }`}
          />
          <span
            className={`text-sm leading-relaxed ${
              isCommon ? "text-blue-800" : "text-gray-700"
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
    const displayValue = isCommon
      ? getCommonFieldValue(name)
      : localValues[name] || "";
    const isFieldReadOnly = readOnly || isCommon;

    return (
      <div className="flex flex-col gap-1">
        {/* <label className="text-xs font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label> */}
        <label className="text-xs font-medium text-gray-700 mb-1 flex flex-wrap gap-1">
          <span
            dangerouslySetInnerHTML={{
              __html: label.replace(
                /\*\*(.*?)\*\*/g,
                '<strong class="text-gray-800 font-semibold">$1</strong>'
              ),
            }}
          />
          {required && <span className="text-red-500">*</span>}
        </label>

        <select
          name={name}
          value={displayValue}
          onChange={isCommon ? undefined : handleChange}
          disabled={isFieldReadOnly}
          className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all ${
            fieldErrors[name]
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
  const isFieldRequired = (fieldName: any) => {
    return FORM_SECTIONS[currentStep].requiredFields?.includes(fieldName);
  };

  // Field metadata for dynamic rendering
  const FIELD_METADATA : any = {
    date: { label: "Date", type: "date" },
    surname: { label: "Surname", type: "text" },
    givenNames: { label: "Given name(s)", type: "text" },
    sex: {
      label: "Sex",
      type: "dopdown",
      options: ["Male", "Female", "Prefer not to say", "Others"],
    },
    pronoun: { label: "Pronoun", type: "text" },
    indigenousDescent: {
      label: "Are you of Aboriginal or Torres Strait Islander descent?",
      type: "dropdown",
      options: ["Yes", "No"],
    },
    preferredName: { label: "Preferred name", type: "text" },
    dob: { label: "Date of Birth", type: "text" },
    address: { label: "Number / Street", type: "text" },
    state: { label: "State", type: "text" },
    postcode: { label: "Postcode", type: "text" },
    email: { label: "Email address", type: "email" },
    homePhone: { label: "Home Phone No", type: "text" },
    mobile: { label: "Mobile No", type: "text" },
    noCopyRequested: {
      label: "Participant may wish not to receive a copy of this agreement",
      type: "checkbox",
    },
    planAttached: {
      label: "A copy of the Individual’s plan is attached",
      type: "checkbox",
    },
    planNotAttached: {
      label: "Individual chooses not to attach their plan",
      type: "checkbox",
    },

    scheduleTable: { label: "Schedule of Supports", type: "table" },
    conflictDeclaration: {
      label:
        "CI ____________________ have discussed my Support Coordination requirements and have been given options and full choice and control over the provider I have chosen.",
      type: "text",
    },
    conflictOption1: {
      label: "Conflict of Interest - Providers Considered (Option 1)",
      type: "textarea",
    },
    conflictOption2: {
      label: "Conflict of Interest - Providers Considered (Option 2)",
      type: "textarea",
    },
    conflictOption3: {
      label: "Conflict of Interest - Providers Considered (Option 3)",
      type: "textarea",
    },

    signature: { label: "Signed", type: "signature" },
    printName: { label: "Print Name", type: "text" },
    signDate: { label: "Date", type: "date" },
    selfManaged: { label: "Self-managed funding", type: "checkbox" },
    nomineeManaged: { label: "Nominee managed funding", type: "checkbox" },
    ndiaManaged: { label: "NDIA managed funding", type: "checkbox" },
    planManagerManaged: {
      label: "Plan Manager managed funding",
      type: "checkbox",
    },
    planManagerName: { label: "Plan Manager Name", type: "text" },
    planManagerEmail: { label: "Email", type: "email" },

    consentMedia: {
      label:
        "Hereby give consent to Infinity Supports WA to obtain and images and likeness of myself. I give permission for Infinity Supports WA to use such images on media releases including social media and branding & promotion ",
      type: "dropdown",
      options: ["Yes", "No"],
    },
    consentInfoShare: {
      label: `Hereby give consent to Infinity Supports WA to obtain & share relevant documented information regarding my service. This may include but not limited to:<br/>
<strong>• Legal Guardian/Next of Kin</strong><br/>
<strong>• GP/health care professional</strong><br/>
<strong>• Therapy providers</strong><br/>
<strong>• Plan Managers</strong> <br/>
<strong> If Others pls specify</strong>
`,
      type: "dropdown",
      options: ["Yes", "No"],
    },

    consentInfoShareOthers: {
      label: "If Others",
      type: "text",
    },
    consentAudit: {
      label:
        "I consent to take part in a NDIS audit and my documents be reviewed as required.",
      type: "dropdown",
      options: ["Yes", "No"],
    },

    participantSignature: { label: "Signature of participant", type: "text" },
    participantDate: { label: "Participant Date", type: "date" },
    participantName: { label: "Participant Name", type: "text" },
    nomineeSignature: { label: "Signature of Nominee", type: "text" },
    nomineeDate: { label: "Nominee Date", type: "date" },
    nomineeName: { label: "Nominee Name", type: "text" },
    providerSignature: {
      label: "Signature on behalf of Infinity Supports WA",
      type: "text",
    },
    providerSignatureDate: { label: "Staff Date", type: "date" },
    providerName: { label: "Staff Name", type: "text" },
  };

  // Validation function to check if all required fields are filled
  const validateRequiredFields = () => {
    const missingFields: string[] = [];

    // Validate required fields defined per section
    FORM_SECTIONS.forEach((section : any ) => {
      section.requiredFields.forEach((fieldName : any ) => {
        let value;

        if (isCommonField(fieldName)) {
          value = getCommonFieldValue(fieldName);
        } else {
          value = localValues[fieldName];
        }

        if (!value || (typeof value === "string" && value.trim() === "")) {
          missingFields.push(fieldName);
        }
      });
    });

    // Conditional signature validation
    if (localValues.signatureRole === "Participant") {
      [
        "participantSignature",
        "participantSignatureDate",
        "participantName",
      ].forEach((field) => {
        if (
          !localValues[field] ||
          (typeof localValues[field] === "string" &&
            localValues[field].trim() === "")
        ) {
          missingFields.push(field);
        }
      });
    } else if (localValues.signatureRole === "Nominee") {
      ["nomineeSignature", "nomineeSignatureDate", "nomineeName"].forEach(
        (field) => {
          if (
            !localValues[field] ||
            (typeof localValues[field] === "string" &&
              localValues[field].trim() === "")
          ) {
            missingFields.push(field);
          }
        }
      );
    } else {
      // signatureRole not selected
      missingFields.push("signatureRole");
    }

    // Always required provider fields
    ["providerSignature", "providerSignatureDate", "providerName"].forEach(
      (field) => {
        if (
          !localValues[field] ||
          (typeof localValues[field] === "string" &&
            localValues[field].trim() === "")
        ) {
          missingFields.push(field);
        }
      }
    );

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
          {FORM_SECTIONS.map((section : any , idx : any) => {
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
                  className={`flex flex-col items-center min-w-[60px] px-2 focus:outline-none transition-all duration-200 ${
                    active
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
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 mb-1 ${
                      active
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
              {FORM_SECTIONS[currentStep].id === "signatures" ? (
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
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">
                        Participant Signature
                      </h3>
                      <div className="space-y-4">
                        {renderSignatureField(
                          "Signature of participant",
                          "participantSignature",
                          participantSigCanvasRef,
                          "Draw participant signature"
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {renderInput(
                            "Date of participant signature",
                            "participantSignatureDate",
                            "date"
                          )}
                          {renderInput(
                            "Name of participant",
                            "participantName",
                            "text",
                            "Enter participant name"
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {localValues.signatureRole === "Nominee" && (
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">
                        Nominee Signature
                      </h3>
                      <div className="space-y-4">
                        {renderSignatureField(
                          "Signature of nominee",
                          "nomineeSignature",
                          nomineeSigCanvasRef,
                          "Draw nominee signature"
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {renderInput(
                            "Date of nominee signature",
                            "nomineeSignatureDate",
                            "date"
                          )}
                          {renderInput(
                            "Name of nominee",
                            "nomineeName",
                            "text",
                            "Enter nominee name"
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Provider Signature */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
                      Provider Signature
                    </h3>
                    <div className="space-y-4">
                      {renderSignatureField(
                        "Signature on behalf of Infinity Supports WA",
                        "providerSignature",
                        providerSigCanvasRef,
                        "Draw provider signature"
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderInput(
                          "Date of provider signature",
                          "providerSignatureDate",
                          "date"
                        )}
                        {renderInput(
                          "Name of provider representative",
                          "providerName",
                          "text",
                          "Enter provider name"
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : FORM_SECTIONS[currentStep].id === "page2" ? (
                <div className="space-y-6">
                  {renderFlatScheduleTable()}
                  {renderInput(
                    "I ____________________ have discussed my Support Coordination requirements and have been given options and full choice and control over the provider I have chosen.",
                    "conflictDeclaration",
                    "text"
                  )}
                  <p>
                    I have been given information on the following companies.
                  </p>
                  {renderInput(
                    "Providers Considered",
                    "conflictOption1",
                    "textarea"
                  )}
                  {renderInput(
                    "Providers Considered",
                    "conflictOption2",
                    "textarea"
                  )}
                  {renderInput(
                    "Providers Considered",
                    "conflictOption3",
                    "textarea"
                  )}
                </div>
              ) : FORM_SECTIONS[currentStep].id === "page3" ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderCheckbox(selfManaged, "selfManaged")}
                    {renderCheckbox(nomineeManaged, "nomineeManaged")}
                    {renderCheckbox(ndiaManaged, "ndiaManaged")}
                    {renderCheckbox(planManagerManaged, "planManagerManaged")}
                  </div>

                  {localValues.planManagerManaged && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {renderInput(
                        "Plan Manager Name",
                        "planManagerName",
                        "text"
                      )}
                      {renderInput("Email", "planManagerEmail", "email")}
                    </div>
                  )}

                  {renderSignatureField(
                    "Signed",
                    "signature",
                    generalSignatureRef,
                    "Draw your signature here"
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderInput("Print Name", "printName", "text")}
                    {renderInput("Date", "signDate", "date")}
                  </div>
                </div>
              ) : (
                // Standard grid layout for other sections
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {FORM_SECTIONS[currentStep].fields.map((field : any) => {
                    const meta = FIELD_METADATA[field] || {
                      label: field,
                      type: "text",
                    };
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
            {FORM_SECTIONS.map((_ : any , index : any) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full border duration-200 ${
                  index === currentStep
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
              disabled={currentStep === 0}
              className={`flex items-center justify-center space-x-1 px-5 py-2 rounded-full font-semibold transition-all text-sm shadow border duration-200 w-full md:w-1/3 ${
                currentStep === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                  : "bg-gradient-to-r from-gray-700 to-gray-900 text-white border-gray-700 hover:from-gray-800 hover:to-black"
              }`}
            >
              <FaChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={handleNextSequential}
              disabled={
                currentStep === FORM_SECTIONS.length - 1 ||
                !isCurrentSectionComplete()
              }
              className={`flex items-center justify-center space-x-1 px-5 py-2 rounded-full font-semibold transition-all text-sm shadow border duration-200 w-full md:w-1/3 ${
                currentStep === FORM_SECTIONS.length - 1 ||
                !isCurrentSectionComplete()
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                  : "bg-gradient-to-r from-indigo-600 to-green-400 text-white border-indigo-600 hover:from-indigo-700 hover:to-green-500"
              }`}
            >
              <span>Next</span>
              <FaChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleSaveProgress && handleSaveProgress()}
              disabled={saving || submitting}
              className="flex items-center justify-center gap-1 px-5 py-2 rounded-full font-semibold text-sm bg-gray-600 hover:bg-gray-700 text-white shadow border border-gray-700 transition-all duration-200 w-full md:w-1/3 disabled:opacity-50"
            >
              <FaSave className="w-4 h-4" />
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

export default SASupportCoordinationEdit;
