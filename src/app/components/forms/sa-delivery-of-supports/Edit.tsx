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
  FaHourglassHalf,
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
  handleSave: (submit: boolean) => void;
  handleSaveProgress?: () => Promise<void>;
  handleSubmitForm?: () => Promise<void>;
  saving?: boolean;
  onCommonFieldsUpdated?: () => void;
}

const FORM_SECTIONS = [
  {
    id: "participantDetails",
    title: "Participant Details",
    icon: FaUser,
    description: "Personal information and contact details",
    fields: [
      "agreementDate", "ndisNumber", "surname", "givenNames", "sex", 
      "pronoun", "indigenousStatus", "preferredName", "dob", "street", 
      "state", "postcode", "email", "homePhone", "mobilePhone"
    ],
    requiredFields: ["agreementDate", "ndisNumber", "surname", "givenNames", "dob"],
  },
  {
    id: "agreementTerms",
    title: "Agreement Terms",
    icon: FaFileContract,
    description: "Service agreement terms and conditions",
    fields: [
      "subjectToSection73G", "isNonVerbal", "noCopyRequested", 
      "planAttached", "planNotAttached"
    ],
    requiredFields: [],
  },
  {
    id: "paymentManagement",
    title: "Payment Management",
    icon: FaDollarSign,
    description: "Funding and payment arrangements",
    fields: [
      "selfManaged", "nomineeManaged", "ndiaManaged", "planManagerManaged",
      "planManagerName", "fundingSource"
    ],
    requiredFields: [],
  },
  {
    id: "consents",
    title: "Consents & Permissions",
    icon: FaClipboardList,
    description: "Media, information sharing and other consents",
    fields: [
      "mediaConsent", "mediaProfile","infoSharingConsent", "othersInfoSharingConsent",
      "moneyHandlingConsent", "ndisAuditConsent"
    ],
    requiredFields: ["mediaConsent", "mediaProfile", "infoSharingConsent", "moneyHandlingConsent", "ndisAuditConsent"],
  },
  {
    id: "signatures",
    title: "Signatures",
    icon: FaSignature,
    description: "Participant, nominee and provider signatures",
    fields: [
      "signatureRole",
      "participantSignature", "participantSignatureDate", "participantName",
      "nomineeSignature", "nomineeSignatureDate", "nomineeName",
      "providerSignature", "providerSignatureDate", "providerName"
    ],
    requiredFields: [],
  },
];

const commonFieldsMapping: Record<string, string> = {
  ndisNumber: "ndis",
  sex: 'sex',
  givenNames: 'name',
  surname: 'surname',
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
  handleSubmitForm,
  saving = false,
  onCommonFieldsUpdated,
}: any) => {

  // Helper function to get common field value
  const getCommonFieldValue = (fieldName: string): string => {
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

  // Signature canvas refs
  const participantSigCanvasRef : any = useRef<SignatureCanvasRef | null>(null);
  const nomineeSigCanvasRef  : any = useRef<SignatureCanvasRef | null>(null);
  const providerSigCanvasRef : any = useRef<SignatureCanvasRef | null>(null);

  const initialValues = {
    // Participant Details
    agreementDate: new Date().toISOString().split("T")[0],
    ndisNumber: commonFieldsData?.ndis || "",
    surname: commonFieldsData?.surname || "",
    givenNames: commonFieldsData?.name || "",
    sex: "",
    pronoun: "",
    indigenousStatus: "",
    preferredName: "",
    dob: commonFieldsData?.dob || "",
    street: commonFieldsData?.street || "",
    state: commonFieldsData?.state || "",
    postcode: commonFieldsData?.postcode || "",
    email: commonFieldsData?.email || "",
    homePhone: commonFieldsData?.home_phone || "",
    mobilePhone: commonFieldsData?.mobile_phone || "",
    
    // Agreement Terms
    subjectToSection73G: false,
    isNonVerbal: false,
    noCopyRequested: false,
    planAttached: false,
    planNotAttached: false,
    
    // Payment Management
    selfManaged: false,
    nomineeManaged: false,
    ndiaManaged: false,
    planManagerManaged: false,
    planManagerName: "",
    fundingSource: "",
    
    // Consents
    mediaConsent: "",
    mediaProfile: "",
    infoSharingConsent: "",
    othersInfoSharingConsent: "",
    moneyHandlingConsent: "",
    ndisAuditConsent: "",

    signatureRole: "",
    
    // Signatures
    
    
    ...formData,
    participantSignature: "",
    participantSignatureDate: "",
    participantName: "",
    nomineeSignature: "",
    nomineeSignatureDate: "",
    nomineeName: "",
    providerSignature: "",
    providerSignatureDate: new Date().toISOString().split("T")[0],
    providerName: "",
  };

  const [localValues, setLocalValues] = useState<any>(initialValues);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { showToast } = useToast();

  // Loading states
  const [submitting, setSubmitting] = useState(false);
  const [loadingButton, setLoadingButton] = useState<null | 'next' | 'save'>(null);
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const getError = (name: string) => localErrors[name] || fieldErrors[name];
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
    
    let newValue : any = value;
    if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked;
    }
    // Phone sanitization
    if (name === 'homePhone' || name === 'mobilePhone') {
      const digits = String(newValue).replace(/\D/g, '');
      newValue = digits;
      if (digits && digits.length < 6) {
        setLocalErrors((prev) => ({ ...prev, [name]: 'Please enter a valid phone number' }));
      } else {
        setLocalErrors((prev) => { const { [name]: _, ...rest } = prev; return rest; });
      }
    }
    // Email validation for provider email
    if (name === 'fundingSource') {
      const email = String(newValue).trim();
      const ok = email === '' ? true : /^(?:[A-Z0-9._%+-]+)@(?:[A-Z0-9-]+\.)+[A-Z]{2,}$/i.test(email);
      if (!ok) setLocalErrors((prev) => ({ ...prev, [name]: 'Enter a valid email address' }));
      else setLocalErrors((prev) => { const { [name]: _, ...rest } = prev; return rest; });
    }
    // Signature role switch clears the other role's signature and metadata
    if (name === 'signatureRole') {
      const role = String(newValue);
      const cleared: Record<string, any> = {};
      if (role === 'Participant') {
        cleared['nomineeSignature'] = '';
        cleared['nomineeSignatureDate'] = '';
        cleared['nomineeName'] = '';
      } else if (role === 'Nominee') {
        cleared['participantSignature'] = '';
        cleared['participantSignatureDate'] = '';
        cleared['participantName'] = '';
      }
      const merged = { ...localValues, [name]: newValue, ...cleared };
      setLocalValues(merged);
      onChange(merged, name, false);
      Object.keys(cleared).forEach((k) => onChange(merged, k, false));
      return;
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
    return required.every((key) => {
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
      setLoadingButton('next');
      if (handleSaveProgress) {
        await handleSaveProgress();
      }
      handleNext();
    } finally {
      setLoadingButton(null);
    }
  };

  const handlePreviousSequential = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };


  useEffect(() => {
    // When plan manager option is turned off, clear its details
    if (!localValues.planManagerManaged) {
      const cleared = { ...localValues, planManagerName: "", fundingSource: "" };
      setLocalValues(cleared);
      onChange(cleared);
    }
  }, [localValues.planManagerManaged])
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
            getError(name)
              ? "border-red-300 bg-red-50"
              : isCommon 
                ? "bg-blue-50 border-blue-200 text-blue-800"
                : "hover:border-accent/40"
          } ${isFieldReadOnly ? "cursor-not-allowed" : ""}`}
        />
        {getError(name) && (
          <p className="text-xs text-red-500 mt-1">{getError(name)}</p>
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
        {getError(name) && (
          <p className="text-xs text-red-500 mt-1">{getError(name)}</p>
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
      {getError(name) && (
        <p className="text-xs text-red-500 mt-1">{getError(name)}</p>
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
    const displayValue = isCommon ? getCommonFieldValue(name) : (localValues[name] || "");
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
      __html: label.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-800 font-semibold">$1</strong>')
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
            getError(name)
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
        {getError(name) && (
          <p className="text-xs text-red-500 mt-1">{getError(name)}</p>
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
          onSignatureEnd={(dataUrl: string) => handleSignatureEnd(name, dataUrl)}
          onSignatureClear={() => handleSignatureClear(name)}
          existingSignature={localValues[name]}
          width={400}
          height={150}
          disabled={readOnly}
          placeholder={placeholder || "Draw your signature in the box above"}
        />
      </div>
      {getError(name) && (
        <p className="text-xs text-red-500 mt-1">{getError(name)}</p>
      )}
    </div>
  );

  // Helper to check if a field is required in the current section
  const isFieldRequired = (fieldName: string) => {
    return FORM_SECTIONS[currentStep].requiredFields?.includes(fieldName);
  };

  // Field metadata for dynamic rendering
  const FIELD_METADATA: Record<string, any> = {
    // Participant Details
    agreementDate: { label: "Date", type: "date", placeholder: "Select agreement date" },
    ndisNumber: { label: "NDIS Number", type: "text", placeholder: "Enter NDIS number" },
    surname: { label: "Surname", type: "text", placeholder: "Enter surname" },
    givenNames: { label: "Given name(s)", type: "text", placeholder: "Enter given names" },
    sex: { label: "Sex", type: "dropdown", options: sexOptions },
    pronoun: { label: "Pronoun", type: "text", placeholder: "Enter preferred pronoun" },
    indigenousStatus: { label: "Aboriginal or Torres Strait Islander?", type: "dropdown", options: indigenousOptions },
    preferredName: { label: "Preferred name", type: "text", placeholder: "Enter preferred name" },
    dob: { label: "Date of Birth", type: "text", placeholder: "Select date of birth" },
    street: { label: "Number / Street", type: "text", placeholder: "Enter street address" },
    state: { label: "State", type: "text", placeholder: "Enter state" },
    postcode: { label: "Postcode", type: "text", placeholder: "Enter postcode" },
    email: { label: "Email address", type: "email", placeholder: "Enter email address" },
    homePhone: { label: "Home Phone No", type: "tel", placeholder: "Enter home phone" },
    mobilePhone: { label: "Mobile No", type: "tel", placeholder: "Enter mobile number" },
    
    // Agreement Terms
    subjectToSection73G: { 
      label: "Is this participant subject to Section 73 G of the NDIS Act? (If yes please refer to the Provider responsibility section for further information)", 
      type: "checkbox" 
    },
    isNonVerbal: { 
      label: "Is this participant non-verbal? (If yes refer complete the mode of communication section of the participant risk assessment)", 
      type: "checkbox" 
    },
    noCopyRequested: { 
      label: "Participant may wish not to receive a copy of this agreement. In this case, they shall tick the dedicated tick box at the end of the service agreement and sign the document.", 
      type: "checkbox" 
    },
    planAttached: { 
      label: "A copy of the Individual's plan is attached to this Service Agreement.", 
      type: "checkbox" 
    },
    planNotAttached: { 
      label: "Individual chooses not to attach their plan.", 
      type: "checkbox" 
    },
    
    // Payment Management
    selfManaged: { 
      label: "The Individual has chosen to self-manage the funding for NDIS supports provided under this Service Agreement. After providing those supports, Infinity Supports WA will send the Individual an invoice for those supports for the Individual to pay. The Individual will pay the invoice within 7 days.", 
      type: "checkbox" 
    },
    nomineeManaged: { 
      label: "The Individual's Nominee manages the funding for supports provided under this Service Agreement. After providing those supports, Infinity Support WA will send the Individual's Nominee an invoice for those supports for the Individual's Nominee to pay. The Individual's Nominee will pay the invoice within 7 days.", 
      type: "checkbox" 
    },
    ndiaManaged: { 
      label: "The Individual has nominated the NDIA to manage the funding for supports provided under this Service Agreement. After providing those supports, Infinity Supports WA will claim payment for those supports from the NDIA.", 
      type: "checkbox" 
    },
    planManagerManaged: { 
      label: "The Individual has nominated the Plan Management Provider to manage the funding for NDIS supports provided under this Service Agreement.", 
      type: "checkbox" 
    },
    planManagerName: { label: "Provider Name", type: "text", placeholder: "Enter Name" },
    fundingSource: { label: "Provider Email", type: "text", placeholder: "Enter Email" },
    
    // Consents
    mediaConsent: { 
      label: "Hereby give consent to Infinity Supports WA to obtain and images and likeness of myself. I give permission for Infinity Supports WA to use such images on media releases including social media and branding & promotion", 
      type: "dropdown", 
      options: yesNoOptions 
    },
    mediaProfile: { 
      label: "Hereby give consent to Infinity Supports WA to obtain and use my photograph for the purpose of creating a client profile (and other internal documents).",
      type: "dropdown", 
      options: yesNoOptions 
    },
   infoSharingConsent: { 
  label: "Hereby give consent to Infinity Supports WA to obtain & share relevant documented information regarding my service. This may include but not limited to: **Legal Guardian/Next of Kin**, **GP/health care professional**, **Therapy providers**, **Plan Managers**, **Others**", 
  type: "dropdown", 
  options: yesNoOptions 
},

    othersInfoSharingConsent: { label: "If Others, specify", type: "text", placeholder: "Specify others for information sharing" },
    moneyHandlingConsent: { 
      label: "I consent for staff to assist me (the participant) with handling my money (e.g. Buying Lunch) and assisting with my personal property, receipts will be provided for all purchases", 
      type: "dropdown", 
      options: yesNoOptions 
    },
    ndisAuditConsent: { 
      label: "I consent to take part in a NDIS audit and my documents be reviewed as required.", 
      type: "dropdown", 
      options: yesNoOptions 
    },
    
    // Signatures
    participantSignature: { label: "Signature of participant", type: "signature", placeholder: "Draw participant signature" },
    participantSignatureDate: { label: "Date of participant signature", type: "date" },
    participantName: { label: "Name of participant", type: "text", placeholder: "Enter participant name" },
    nomineeSignature: { label: "Signature of nominee", type: "signature", placeholder: "Draw nominee signature" },
    nomineeSignatureDate: { label: "Date of nominee signature", type: "date" },
    nomineeName: { label: "Name of nominee", type: "text", placeholder: "Enter nominee name" },
    providerSignature: { label: "Signature on behalf of Infinity Supports WA", type: "signature", placeholder: "Draw provider signature" },
    providerSignatureDate: { label: "Date of provider signature", type: "date" },
    providerName: { label: "Name of provider representative", type: "text", placeholder: "Enter provider name" },
  };

  // Validation function to check if all required fields are filled
 const validateRequiredFields = () => {
  const missingFields: string[] = [];

  // Validate required fields defined per section
  FORM_SECTIONS.forEach(section => {
    section.requiredFields.forEach(fieldName => {
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
  ["providerSignature", "providerSignatureDate", "providerName"].forEach(field => {
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
                      {renderSignatureField("Signature on behalf of Infinity Supports WA", "providerSignature", providerSigCanvasRef, "Draw provider signature")}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderInput("Date of provider signature", "providerSignatureDate", "date")}
                        {renderInput("Name of provider representative", "providerName", "text", "Enter provider name")}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Standard grid layout for other sections
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {FORM_SECTIONS[currentStep].fields.map((field) => {
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
              disabled={loadingButton === 'next' || currentStep === FORM_SECTIONS.length - 1 || !isCurrentSectionComplete()}
              className={`flex items-center justify-center space-x-1 px-5 py-2 rounded-full font-semibold transition-all text-sm shadow border duration-200 w-full md:w-1/3 ${(loadingButton === 'next' || currentStep === FORM_SECTIONS.length - 1 || !isCurrentSectionComplete()) ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200" : "bg-gradient-to-r from-indigo-600 to-green-400 text-white border-indigo-600 hover:from-indigo-700 hover:to-green-500"}`}
            >
              {loadingButton === 'next' ? (
                <>
                  <FaHourglassHalf className="w-4 h-4 animate-spin" />
                  <span>Saving…</span>
                </>
              ) : (
                <>
                  <span>Next</span>
                  <FaChevronRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              onClick={async () => {
                if (!handleSaveProgress) return;
                try {
                  setLoadingButton('save');
                  await handleSaveProgress();
                } finally {
                  setLoadingButton(null);
                }
              }}
              disabled={loadingButton === 'save' || saving || submitting}
              className="flex items-center justify-center gap-1 px-5 py-2 rounded-full font-semibold text-sm bg-gray-600 hover:bg-gray-700 text-white shadow border border-gray-700 transition-all duration-200 w-full md:w-1/3 disabled:opacity-50"
            >
              {loadingButton === 'save' ? <FaHourglassHalf className="w-4 h-4 animate-spin" /> : <FaSave className="w-4 h-4" />}
              {loadingButton === 'save' ? 'Saving…' : 'Save Progress'}
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

export default SADeliveryOfSupportsEdit;
