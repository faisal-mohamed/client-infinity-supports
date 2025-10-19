"use client";

import React, { useState, useEffect, useRef } from "react";
// Temporarily commenting out react-icons to resolve build issues
// import {
//   FaUser,
//   FaStethoscope,
//   FaRegSmile,
//   FaGavel,
//   FaInfoCircle,
//   FaPhoneAlt,
//   FaHome,
//   FaNotesMedical,
//   FaShieldAlt,
//   FaChevronLeft,
//   FaChevronRight,
//   FaCheck,
//   FaSave,
//   FaSpinner,
// } from "react-icons/fa";

// Temporary icon replacements
const FaUser = () => <span>👤</span>;
const FaStethoscope = () => <span>🩺</span>;
const FaRegSmile = () => <span>😊</span>;
const FaGavel = () => <span>⚖️</span>;
const FaInfoCircle = () => <span>ℹ️</span>;
const FaPhoneAlt = () => <span>📞</span>;
const FaHome = () => <span>🏠</span>;
const FaNotesMedical = () => <span>📋</span>;
const FaShieldAlt = () => <span>🛡️</span>;
const FaChevronLeft = () => <span>◀</span>;
const FaChevronRight = () => <span>▶</span>;
const FaCheck = () => <span>✓</span>;
const FaSave = () => <span>💾</span>;
const FaSpinner = () => <span>⏳</span>;
import { useToast } from "@/components/ui/Toast";
import { formatDateForInput, formatDateForStorage } from "@/lib/dateFormatHelper";

// Simple date formatting functions to replace date-fns
const format = (date: Date, formatStr: string): string => {
  if (!date || isNaN(date.getTime())) return '';
  if (formatStr === 'dd/MM/yyyy') {
    return date.toLocaleDateString('en-AU', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  }
  return date.toLocaleDateString();
};

const parseISO = (dateString: string): Date => new Date(dateString);
const isValid = (date: Date): boolean => !isNaN(date.getTime());

// ===========================
// INTERFACE DEFINITIONS
// ===========================

interface FormProps {
  formData: any;
  commonFieldsData: any;
  onChange?: (values: any, field?: string, isCommon?: boolean) => void;
  onSubmit?: (values: any) => void;
  readOnly?: boolean;
  fieldErrors?: Record<string, string>;
  handleSave?: (submit: boolean) => void;
  handleSaveProgress?: () => Promise<void>;
  handleSaveForNext?: () => Promise<void>;
  handleSaveForPrev?: () => Promise<void>;
  handleSubmitForm?: () => Promise<void>;
  saving?: boolean;
  navigatingNext?: boolean;
  navigatingPrev?: boolean;
  onCommonFieldsUpdated?: () => void;

  // NEW: Mode selector
  mode?: "interactive" | "pdf";

  // PDF-specific props
  images?: {
    infinityLogo?: string;
  };
  settings?: {
    company_website?: string;
    client_intake_form_id?: string;
    review_date?: string;
  };
}

// ===========================
// SHARED CONFIGURATION
// ===========================

const FORM_SECTIONS = [
  {
    id: "personal",
    title: "Personal Information",
    icon: FaUser,
    description: "Basic personal details and identification",
    fields: [
      "ndisNumber", "givenName", "surname", "dateOfBirth", "sex",
      "addressNumberStreet", "state", "postcode", "email", "pronoun",
      "aboriginalTorres", "preferredName", "homePhone", "mobile", "disabilityConditions"
    ],
    requiredFields: ["givenName", "surname", "dateOfBirth", "sex", "addressNumberStreet", "state", "postcode", "email"],
  },
  {
    id: "medicalContact",
    title: "Medical Contact",
    icon: FaStethoscope,
    description: "GP Medical Contact & Support Coordinator",
    fields: [
      "medicalCentreName", "medicalPhone", "supportCoordinatorName",
      "supportCoordinatorEmail", "supportCoordinatorCompany",
      "supportCoordinatorContact", "otherSupports"
    ],
    requiredFields: ["medicalCentreName", "supportCoordinatorName"],
  },
  {
    id: "aboutMe",
    title: "All About Me",
    icon: FaRegSmile,
    description: "About me",
    requiredFields: ["aboutMe"],
    fields: ["aboutMe"],
  },
  {
    id: "advocate",
    title: "Advocate Details",
    icon: FaGavel,
    description: "Advocate/representative details (if applicable)",
    requiredFields: [],
    fields: [
      "advocateName", "advocateEmail", "advocatePhone", "advocateMobile",
      "advocateAddress", "advocatePostalAddress", "advocateOtherInfo",
      "advocateRelationship"
    ],
  },
  {
    id: "personalSituation",
    title: "Personal Situation",
    icon: FaInfoCircle,
    description: "Personal situation",
    requiredFields: ["barriers"],
    fields: [
      "barriers", "language", "countryOfBirth", "culturalValues",
      "culturalBehaviours", "writtenCommunication", "interpreter"
    ]
  },
  {
    id: "contactDetails",
    title: "Contact Details",
    icon: FaPhoneAlt,
    description: "Primary and secondary emergency contacts",
    requiredFields: ["primaryContactName", "primaryContactRelationship"],
    fields: [
      "primaryContactName", "primaryContactRelationship",
      "primaryContactHomePhone", "primaryContactMobile",
      "secondaryContactName", "secondaryContactRelationship",
      "secondaryContactHomePhone", "secondaryContactMobile"
    ],
  },
  {
    id: "livingArrangements",
    title: "Arrangements",
    icon: FaHome,
    description: "Living Arrangements & Travel Arrangements",
    requiredFields: [],
    fields: ["livingArrangements", "travelArrangements"],
  },
  {
    id: "medicalInfo",
    title: "Medical Information",
    icon: FaNotesMedical,
    description: "Medication Information/Diagnosis/Health Concerns",
    requiredFields: [],
    fields: [
      "medicationChart", "mealtimeManagement", "bowelCare", "menstrualIssues",
      "epilepsy", "asthmatic", "allergies", "anaphylactic", "minorInjury",
      "training", "othermedical", "trigger"
    ]
  },
  {
    id: "safety",
    title: "Safety Considerations",
    icon: FaShieldAlt,
    description: "Safety Considerations",
    requiredFields: [],
    fields: [
      "absconding", "historyOfFalls", "behaviourConcern", "positiveBehaviour",
      "communicationAssistance", "physicalAssistance", "languageConcern",
      "personalGoals"
    ],
  },
];

const commonFieldsMapping: Record<string, string> = {
  ndisNumber: "ndis",
  givenName: "name",
  sex: "sex",
  dateOfBirth: "dob",
  addressNumberStreet: "street",
  state: "state",
  postcode: "postCode",
  email: "email",
  mobile: "phone",
  disabilityConditions: "disability",
  surname: "surname",
};

const isCommonField = (fieldName: string): boolean => {
  return Object.keys(commonFieldsMapping).includes(fieldName);
};

const yesNoOptions = ["Yes", "No"];

const livingArrangementsOptions = [
  "Live with Parent/Family/Support Person",
  "Live in private rental arrangement with others",
  "Live in private rental arrangement alone",
  "Owns own home.",
  "Aged Care Facility",
  "Mental Health Facility",
  "Lives in public housing",
  "Short Term Crisis/Respite",
  "Staff Supported Group Home",
  "Hostel/SRS Private Accommodation",
  "Other:",
];

const travelArrangementsOptions = [
  "Taxi",
  "Pick up/ drop off by Parent/Family/Support Person",
  "Transport by a provider",
  "Independently use Public Transport",
  "Walk",
  "Assisted Public Transport",
  "Drive own car.",
  "Other, please specify: ",
];

// ===========================
// UNIFIED COMPONENT
// ===========================

const ClientIntakeFormUnified: React.FC<FormProps> = ({
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
  mode = "interactive",
  images,
  settings,
}: any) => {

  // ===========================
  // HELPER FUNCTIONS
  // ===========================

  const getCommonFieldValue = (fieldName: string): string => {
    const commonKey = commonFieldsMapping[fieldName];
    return commonFieldsData?.[commonKey] || '';
  };

  const getFieldValue = (key: string) => {
    const rawValue = key in commonFieldsMapping
      ? commonFieldsData?.[commonFieldsMapping[key]] ?? ""
      : formData?.[key] ?? "";

    if (typeof rawValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
      const parsed = parseISO(rawValue);
      if (isValid(parsed)) {
        return format(parsed, "dd-MM-yyyy");
      }
    }

    return rawValue;
  };

  // Helper function to calculate dynamic height based on content length
  const calculateDynamicHeight = (content: string, maxWords: number = 1000): number => {
    if (!content || content.trim() === '') return 100;
    const characterCount = content.length;
    const lineCount = content.split('\n').length;
    const estimatedLines = Math.max(lineCount, Math.ceil(characterCount / 80));
    return Math.max(120, estimatedLines * 20 + 40);
  };

  // Helper function to get content stats
  const getContentStats = (content: string) => {
    if (!content || content.trim() === '') return { words: 0, characters: 0, percentage: 0 };

    const words = content.trim().split(/\s+/).length;
    const characters = content.trim().length;
    const percentage = Math.min((words / 1000) * 100, 100);

    return { words, characters, percentage };
  };

  // Helper function to calculate dynamic height for otherSupports (500 words)
  const calculateOtherSupportsHeight = (content: string, maxWords: number = 500): number => {
    if (!content || content.trim() === '') return 32; // Minimum height with larger padding

    const wordCount = content.trim().split(/\s+/).length;
    const characterCount = content.length;

    // Calculate height based on content length (up to maxWords)
    const contentRatio = Math.min(wordCount / maxWords, 1); // Cap at 1.0 for maxWords
    const maxHeight = 600; // Maximum height for 500 words (600px can hold ~500 words)
    const minHeight = 32;  // Minimum height with larger padding

    // Calculate dynamic height based on both word count and character count
    const wordBasedHeight = minHeight + (contentRatio * (maxHeight - minHeight));
    const characterBasedHeight = Math.max(32, (characterCount / 50) * 20); // ~20px per 50 characters, minimum 32px

    // Use the larger of the two calculations to ensure content fits
    const dynamicHeight = Math.max(wordBasedHeight, characterBasedHeight);

    return dynamicHeight;
  };

  // ===========================
  // RENDER BASED ON MODE
  // ===========================

  if (mode === "pdf") {
    return <PDFView
      formData={formData}
      commonFieldsData={commonFieldsData}
      images={images}
      settings={settings}
      getFieldValue={getFieldValue}
    />;
  }

  // Default: Interactive mode
  return <InteractiveView
    formData={formData}
    commonFieldsData={commonFieldsData}
    onChange={onChange}
    onSubmit={onSubmit}
    readOnly={readOnly}
    fieldErrors={fieldErrors}
    handleSave={handleSave}
    handleSaveProgress={handleSaveProgress}
    handleSaveForNext={handleSaveForNext}
    handleSaveForPrev={handleSaveForPrev}
    handleSubmitForm={handleSubmitForm}
    saving={saving}
    navigatingNext={navigatingNext}
    navigatingPrev={navigatingPrev}
    onCommonFieldsUpdated={onCommonFieldsUpdated}
    getCommonFieldValue={getCommonFieldValue}
  />;
};

// ===========================
// INTERACTIVE VIEW COMPONENT
// ===========================

const InteractiveView: React.FC<any> = ({
  formData,
  commonFieldsData,
  onChange,
  onSubmit,
  readOnly,
  fieldErrors,
  handleSave,
  handleSaveProgress,
  handleSaveForNext,
  handleSaveForPrev,
  handleSubmitForm,
  saving,
  navigatingNext,
  navigatingPrev,
  onCommonFieldsUpdated,
  getCommonFieldValue,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [maxStep, setMaxStep] = useState(0);

  const initialValues = {
    date: formatDateForStorage(new Date().toISOString().split("T")[0]),
    ndisNumber: commonFieldsData?.ndis || "",
    givenName: commonFieldsData?.name || "",
    sex: commonFieldsData?.sex || "",
    dateOfBirth: commonFieldsData?.dob || "",
    addressNumberStreet: commonFieldsData?.street || "",
    state: commonFieldsData?.state || "",
    postcode: commonFieldsData?.postCode || "",
    email: commonFieldsData?.email || "",
    homePhone: "",
    disabilityConditions: commonFieldsData?.disability || "",
    surname: commonFieldsData?.surname || "",
    pronoun: "",
    aboriginalTorres: "",
    preferredName: "",
    mobile: commonFieldsData?.phone || "",
    livingArrangements: [],
    travelArrangements: [],
    livingArrangementsOther: "",
    travelArrangementsOther: "",
    medicalCentreName: "",
    medicalPhone: "",
    supportCoordinatorName: "",
    supportCoordinatorEmail: "",
    supportCoordinatorCompany: "",
    supportCoordinatorContact: "",
    otherSupports: "",
    advocateName: "",
    advocateEmail: "",
    advocatePhone: "",
    advocateMobile: "",
    advocateAddress: "",
    advocatePostalAddress: "",
    advocateOtherInfo: "",
    advocateRelationship: "",
    barriers: "",
    language: "",
    interpreter: "",
    countryOfBirth: "",
    culturalValues: "",
    culturalBehaviours: "",
    writtenCommunication: "",
    primaryContactName: "",
    primaryContactRelationship: "",
    primaryContactHomePhone: "",
    primaryContactMobile: "",
    secondaryContactName: "",
    secondaryContactRelationship: "",
    secondaryContactHomePhone: "",
    secondaryContactMobile: "",
    medicationChart: "",
    mealtimeManagement: "",
    bowelCare: "",
    menstrualIssues: "",
    epilepsy: "",
    asthmatic: "",
    allergies: "",
    anaphylactic: "",
    minorInjury: "",
    training: "",
    othermedical: "",
    trigger: "",
    absconding: "",
    historyOfFalls: "",
    behaviourConcern: "",
    positiveBehaviour: "",
    communicationAssistance: "",
    physicalAssistance: "",
    languageConcern: "",
    personalGoals: "",
    ...formData,
  };

  const [localValues, setLocalValues] = useState<any>(initialValues);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [pendingCommonFieldChanges, setPendingCommonFieldChanges] = useState<Record<string, any>>({});

  const trackCommonFieldChange = (name: string, value: any) => {
    return;
  };

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

    if (isCommonField(name)) {
      showToast({
        type: "info",
        title: "Common Field",
        message: "This field can only be updated from the client's common details section.",
        duration: 3000,
      });
      return;
    }

    // Check word count limit for text inputs
    const meta = FIELD_METADATA[name];
    let maxWords = meta?.maxWords;
    
    // For Yes/No detail fields, check parent's showIfYes config
    if (!maxWords) {
      const parentField = Object.keys(FIELD_METADATA).find(key => {
        const parentMeta = FIELD_METADATA[key];
        return parentMeta?.showIfYes?.inputName === name;
      });
      if (parentField) {
        maxWords = FIELD_METADATA[parentField]?.showIfYes?.maxWords;
      }
    }
    
    if (maxWords && typeof value === 'string') {
      const wordCount = value.trim().split(/\s+/).filter((word: string) => word.length > 0).length;
      
      if (wordCount > maxWords) {
        showToast({
          type: "warning",
          title: "Word Limit Exceeded",
          message: `This field has ${wordCount} words (limit: ${maxWords}). Please reduce content to continue.`,
          duration: 4000,
        });
      }
    }

    const newValues = { ...localValues, [name]: value };
    setLocalValues(newValues);

    const isCommon = !!commonFieldsMapping[name];
    if (isCommon) trackCommonFieldChange(name, value);
    onChange(newValues, name, isCommon);
  };

  const handleNextSequential = async () => {
    if (handleSaveForNext) {
      await handleSaveForNext();
    }

    if (currentStep < FORM_SECTIONS.length - 1) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setMaxStep((prev) => Math.max(prev, nextStep));
    }
  };

  const handlePreviousSequential = async () => {
    if (currentStep > 0) {
      if (handleSaveForPrev) {
        await handleSaveForPrev();
      }
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClickSequential = (stepIndex: number) => {
    if (stepIndex <= maxStep) {
      setCurrentStep(stepIndex);
    }
  };

  const isCurrentSectionComplete = () => {
    const required = FORM_SECTIONS[currentStep].requiredFields || [];
    
    // Check required fields are filled
    const allFilled = required.every((key) => {
      let value;

      if (isCommonField(key)) {
        value = getCommonFieldValue(key);
      } else {
        value = localValues[key];
      }

      return value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && value.length === 0);
    });
    
    // Check no fields are over word limit in current section
    const noOverLimit = FORM_SECTIONS[currentStep].fields.every((key) => {
      const meta = FIELD_METADATA[key];
      if (!meta?.maxWords) return true; // No limit = OK
      
      const value = localValues[key];
      if (!value || typeof value !== 'string') return true;
      
      const wordCount = value.trim().split(/\s+/).filter((word: string) => word.length > 0).length;
      return wordCount <= meta.maxWords;
    });
    
    // Also check Yes/No detail fields in current section
    const noDetailOverLimit = FORM_SECTIONS[currentStep].fields.every((key) => {
      const meta = FIELD_METADATA[key];
      if (!meta?.showIfYes?.inputName || !meta?.showIfYes?.maxWords) return true;
      
      const detailFieldName = meta.showIfYes.inputName;
      const detailValue = localValues[detailFieldName];
      if (!detailValue || typeof detailValue !== 'string') return true;
      
      const wordCount = detailValue.trim().split(/\s+/).filter((word: string) => word.length > 0).length;
      return wordCount <= meta.showIfYes.maxWords;
    });

    return allFilled && noOverLimit && noDetailOverLimit;
  };

  const getProgressPercentage = () => {
    return ((currentStep + 1) / FORM_SECTIONS.length) * 100;
  };

  const validateRequiredFields = () => {
    const missingFields: string[] = [];
    const overLimitFields: string[] = [];

    FORM_SECTIONS.forEach(section => {
      section.requiredFields.forEach(fieldName => {
        let value;

        if (isCommonField(fieldName)) {
          value = getCommonFieldValue(fieldName);
        } else {
          value = localValues[fieldName];
        }

        if (!value || (typeof value === 'string' && value.trim() === '')) {
          missingFields.push(`${fieldName}`);
        }
        
        // Check word count limits
        const meta = FIELD_METADATA[fieldName];
        if (meta?.maxWords && value && typeof value === 'string') {
          const wordCount = value.trim().split(/\s+/).filter((word: string) => word.length > 0).length;
          if (wordCount > meta.maxWords) {
            overLimitFields.push(`${meta.label || fieldName} (${wordCount}/${meta.maxWords} words)`);
          }
        }
      });
      
      // Check word limits for all fields in section (including non-required)
      section.fields.forEach(fieldName => {
        const meta = FIELD_METADATA[fieldName];
        const value = localValues[fieldName];
        
        // Check main field word limit
        if (meta?.maxWords && value && typeof value === 'string') {
          const wordCount = value.trim().split(/\s+/).filter((word: string) => word.length > 0).length;
          if (wordCount > meta.maxWords && !overLimitFields.some(f => f.includes(fieldName))) {
            overLimitFields.push(`${meta.label || fieldName} (${wordCount}/${meta.maxWords} words)`);
          }
        }
        
        // Check Yes/No detail field word limit
        if (meta?.showIfYes?.inputName && meta?.showIfYes?.maxWords) {
          const detailValue = localValues[meta.showIfYes.inputName];
          if (detailValue && typeof detailValue === 'string') {
            const wordCount = detailValue.trim().split(/\s+/).filter((word: string) => word.length > 0).length;
            if (wordCount > meta.showIfYes.maxWords) {
              overLimitFields.push(`${meta.showIfYes.label} (${wordCount}/${meta.showIfYes.maxWords} words)`);
            }
          }
        }
      });
    });

    return {
      isValid: missingFields.length === 0 && overLimitFields.length === 0,
      missingFields,
      overLimitFields
    };
  };

  const handleSaveWithConfirm = async (submit: boolean) => {
    if (submit) {
      // Validate before submission
      const validation = validateRequiredFields();
      
      if (!validation.isValid) {
        let errorMessage = '';
        
        if (validation.missingFields.length > 0) {
          errorMessage += `Missing required fields:\n${validation.missingFields.join(', ')}\n\n`;
        }
        
        if (validation.overLimitFields.length > 0) {
          errorMessage += `Fields exceeding word limit:\n${validation.overLimitFields.join('\n')}`;
        }
        
        showToast({
          type: 'error',
          title: 'Validation Error',
          message: errorMessage,
          duration: 6000,
        });
        
        return; // Prevent submission
      }
      
      setSubmitting(true);
      await handleSubmitForm();
      setSubmitting(false);
    } else {
      await handleSaveProgress();
    }
  };

  const isFieldRequired = (fieldName: string) => {
    return FORM_SECTIONS[currentStep].requiredFields?.includes(fieldName);
  };

  const FIELD_METADATA: Record<string, any> = {
    ndisNumber: { label: "NDIS Number", type: "text", placeholder: "Enter your NDIS number" },
    givenName: { label: "Given Name", type: "text", placeholder: "Enter your first name" },
    surname: { label: "Surname", type: "text", placeholder: "Enter your last name" },
    preferredName: { label: "Preferred Name", type: "text", placeholder: "How would you like to be called?" },
    dateOfBirth: { label: "Date of Birth", type: "date", placeholder: "Enter your date of birth" },
    sex: { label: "Sex", type: "text", placeholder: "Enter your sex" },
    pronoun: { label: "Pronoun", type: "text", placeholder: "e.g., he/him, she/her, they/them" },
    aboriginalTorres: { label: "Aboriginal or Torres Strait Islander?", type: "dropdown", options: yesNoOptions },
    addressNumberStreet: { label: "Address (Number/Street)", type: "text", placeholder: "Enter your street address" },
    state: { label: "State", type: "text", placeholder: "Enter your state" },
    postcode: { label: "Postcode", type: "text", placeholder: "Enter your postcode" },
    email: { label: "Email", type: "email", placeholder: "Enter your email address" },
    homePhone: { label: "Home Phone", type: "tel", placeholder: "Enter your home phone number" },
    mobile: { label: "Mobile", type: "tel", placeholder: "Enter your mobile number" },
    disabilityConditions: { label: "Disability Conditions/Disability type(s)", type: "textarea", placeholder: "Please describe your disability conditions or types", rows: 3, maxWords: 500 },
    medicalCentreName: { label: "Medical Centre Name", type: "text", placeholder: "Name of your medical centre" },
    medicalPhone: { label: "Medical Centre Phone", type: "tel", placeholder: "Medical centre phone number" },
    supportCoordinatorName: { label: "Support Coordinator Name", type: "text", placeholder: "Coordinator's name" },
    supportCoordinatorEmail: { label: "Support Coordinator Email", type: "email", placeholder: "Coordinator's email" },
    supportCoordinatorCompany: { label: "Support Coordinator Company", type: "text", placeholder: "Company name" },
    supportCoordinatorContact: { label: "Support Coordinator Contact", type: "tel", placeholder: "Contact number" },
    otherSupports: { label: "What other supports including mainstream health services you receive at present", type: "textarea", placeholder: "Describe any other support services you receive", rows: 4, maxWords: 500 },
    aboutMe: { label: "", type: "textarea", placeholder: "Tell us about yourself", rows: 4, maxWords: 1000 },
    advocateName: { label: "Advocate Name", type: "text", placeholder: "Advocate's full name" },
    advocateEmail: { label: "Advocate Email", type: "email", placeholder: "Advocate's email" },
    advocatePhone: { label: "Advocate Phone", type: "tel", placeholder: "Advocate's phone" },
    advocateMobile: { label: "Advocate Mobile", type: "tel", placeholder: "Advocate's mobile" },
    advocateAddress: { label: "Advocate Address", type: "text", placeholder: "Advocate's address" },
    advocatePostalAddress: { label: "Advocate Postal Address", type: "text", placeholder: "Advocate's postal address" },
    advocateOtherInfo: { label: "Additional Information", type: "textarea", placeholder: "Any additional information about your advocate", rows: 3, maxWords: 300 },
    advocateRelationship: { label: "Relationship with Participant", type: "text", placeholder: "Relationship" },
    barriers: { label: "Are there any cultural, communication barriers or intimacy issues that need to be considered when delivering services", type: "dropdown", options: yesNoOptions },
    language: { label: "Language", type: "text", placeholder: "Primary language spoken" },
    interpreter: { label: "Verbal communication or spoken language - Is an interpreter needed?", type: "dropdown", options: yesNoOptions },
    countryOfBirth: { label: "Country of Birth", type: "text", placeholder: "Enter your country of birth" },
    culturalValues: { label: "Cultural Values", type: "text", placeholder: "Important cultural values" },
    culturalBehaviours: { label: "Cultural Behaviours", type: "text", placeholder: "Important cultural behaviours" },
    writtenCommunication: { label: "Written Communication / Literacy", type: "text", placeholder: "Communication preferences" },
    primaryContactName: { label: "Primary Contact Name", type: "text", placeholder: "Primary contact's full name" },
    primaryContactRelationship: { label: "Primary Contact Relationship", type: "text", placeholder: "Relationship to you" },
    primaryContactHomePhone: { label: "Primary Contact Home Phone", type: "tel", placeholder: "Home phone number" },
    primaryContactMobile: { label: "Primary Contact Mobile", type: "tel", placeholder: "Mobile phone number" },
    secondaryContactName: { label: "Secondary Contact Name", type: "text", placeholder: "Secondary contact's full name" },
    secondaryContactRelationship: { label: "Secondary Contact Relationship", type: "text", placeholder: "Relationship to you" },
    secondaryContactHomePhone: { label: "Secondary Contact Home Phone", type: "tel", placeholder: "Home phone number" },
    secondaryContactMobile: { label: "Secondary Contact Mobile", type: "tel", placeholder: "Mobile phone number" },
    livingArrangements: { label: "What is your current living arrangement? ", type: "checkbox", options: livingArrangementsOptions },
    livingArrangementsOther: { label: "Please specify other living arrangement", type: "text", placeholder: "Specify other..." },
    travelArrangements: { label: "Travel Arrangements", type: "checkbox", options: travelArrangementsOptions },
    travelArrangementsOther: { label: "Please specify other travel arrangement", type: "text", placeholder: "Specify other..." },
    medicationChart: { label: "Does the Participant require a Medication Chart?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, is this medication taken on a regular basis and for what purpose, ensure to complete Medication Chart and Participant risk assessment", inputName: "medicationChartOthers", maxWords: 200 } },
    mealtimeManagement: { label: "Does the Participant require Mealtime Management?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, refer to Mealtime Management Plan Form" } },
    bowelCare: { label: "Does the participant require Bowel Care Management?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, refer to Complex Bowel Care Plan and Monitoring Form and indicate what assistance is required with bowel care.", inputName: "bowelCareOthers", maxWords: 200 } },
    menstrualIssues: { label: "Are there any issues with a menstrual cycle or is assistance needed with female hygiene ", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, Please specify", inputName: "menstrualIssuesOthers", maxWords: 200 } },
    epilepsy: { label: "Does the Participant have Epilepsy?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, ensure Participant's Doctor completes an Epilepsy Plan", inputName: "epilepsyOthers", maxWords: 200 } },
    asthmatic: { label: "Is the Participant an Asthmatic?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, ensure Participant's Doctor completes an Asthma Plan", inputName: "asthmaticOthers", maxWords: 200 } },
    allergies: { label: "Does the Participant have any allergies?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, ensure to have an Allergy Plan from Participant's Doctor", inputName: "allergiesOthers", maxWords: 200 } },
    anaphylactic: { label: "Is the Participant anaphylactic?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, ensure to have an anaphylaxis Plan from the Participant's Doctor", inputName: "anaphylacticOthers", maxWords: 200 } },
    minorInjury: { label: "Do you give permission for our company's staff to administer band-aids in cases of a minor injury?", type: "dropdown", options: yesNoOptions },
    training: { label: "Does this participant require specific training?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, ensure to provide information such as implementing a positive behaviour support plan.", inputName: "trainingOthers", maxWords: 200 } },
    othermedical: { label: "Are there any other medication conditions that will be relevant to the care provided to this Participant?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, please specify.", inputName: "othermedicalOthers", maxWords: 200 } },
    trigger: { label: "Is there any specific trigger for community activities?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, please specify and complete the Risk assessment for participants.", inputName: "triggerOthers", maxWords: 200 } },
    absconding: { label: "Does the Participant show signs or a history of unexpectedly leaving (absconding)?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, please specify.", inputName: "abscondingOthers", maxWords: 200 } },
    historyOfFalls: { label: "Is this participant prone to falls or have a history of falls?", type: "dropdown", options: yesNoOptions },
    behaviourConcern: { label: "Are there any Behaviours of Concern? Eg: Kicking, biting", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, please specify.", inputName: "behaviourConcernOthers", maxWords: 200 } },
    positiveBehaviour: { label: "Is there a current Positive Behaviour Support Plan in place?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, refer to High Risk Participant Register.", inputName: "positiveBehaviourOthers", maxWords: 200 } },
    communicationAssistance: { label: "Does the participant require communication assistance?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, refer to the mode of communication reflected in Participant Risk Assessment and disaster management plan.", inputName: "communicationAssistanceOthers", maxWords: 200 } },
    physicalAssistance: { label: "Is there any physical assistance or physical assistance preference for this Participant?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, specify.", inputName: "physicalAssistanceOthers", maxWords: 200 } },
    languageConcern: { label: "Does the Participant have any expressive language concerns?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, refer to Participant Risk Assessment and disaster management plan under OH&S Assessments and Mode of Communication.", inputName: "languageConcernOthers", maxWords: 200 } },
    personalGoals: { label: "Does this Participant have any personal preferences & personal goals?", type: "dropdown", options: yesNoOptions, showIfYes: { label: "If yes, refer to form Support Plan" } },
  };

  const renderInput = (
    label: string,
    name: string,
    type: string = "text",
    placeholder?: string,
    required?: boolean
  ) => {
    const isCommon = isCommonField(name);
    let displayValue = isCommon
      ? getCommonFieldValue(name)
      : localValues[name] || "";

    const isFieldReadOnly = readOnly || isCommon;

    if (type === 'date' && displayValue) {
      displayValue = formatDateForInput(displayValue);
    }

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
    required?: boolean,
    maxWords?: number
  ) => {
    const isCommon = isCommonField(name);
    const displayValue = isCommon ? getCommonFieldValue(name) : (localValues[name] || "");
    const isFieldReadOnly = readOnly || isCommon;

    // Calculate word count
    const wordCount = displayValue ? displayValue.trim().split(/\s+/).filter((word: string) => word.length > 0).length : 0;
    const isOverLimit = maxWords ? wordCount > maxWords : false;
    const percentUsed = maxWords ? Math.min((wordCount / maxWords) * 100, 100) : 0;

    return (
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {maxWords && (
            <span className={`text-xs font-medium ${
              isOverLimit 
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
          name={name}
          value={displayValue}
          onChange={isCommon ? undefined : handleChange}
          placeholder={isCommon ? "Value from common fields" : placeholder}
          rows={rows}
          disabled={isFieldReadOnly}
          className={`w-full rounded-lg border ${
            isOverLimit && !isCommon ? 'border-red-400' : 'border-gray-200'
          } bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 ${
            isOverLimit && !isCommon ? 'focus:ring-red-400' : 'focus:ring-accent'
          } focus:border-accent transition-all placeholder-gray-400 resize-none ${
            fieldErrors[name]
              ? "border-red-300 bg-red-50"
              : isCommon
                ? "bg-blue-50 border-blue-200 text-blue-800"
                : "hover:border-accent/40"
          } ${isFieldReadOnly ? "cursor-not-allowed" : ""}`}
        />
        {maxWords && !isCommon && (
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                isOverLimit 
                  ? 'bg-red-500' 
                  : percentUsed > 90 
                    ? 'bg-orange-400' 
                    : percentUsed > 75 
                      ? 'bg-yellow-400' 
                      : 'bg-green-400'
              }`}
              style={{ width: `${Math.min(percentUsed, 100)}%` }}
            />
          </div>
        )}
        {isOverLimit && !isCommon && maxWords && (
          <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
            <span>⚠️</span>
            <span>Exceeds word limit by {wordCount - maxWords} words. Please reduce content.</span>
          </p>
        )}
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
    showIfYes?: {
      label: string;
      inputName?: string;
      maxWords?: number;
    },
    required?: boolean
  ) => {
    // Calculate word count for detail field
    const detailValue = showIfYes?.inputName ? (localValues[showIfYes.inputName] || "") : "";
    const detailWordCount = detailValue ? detailValue.trim().split(/\s+/).filter((word: string) => word.length > 0).length : 0;
    const isDetailOverLimit = showIfYes?.maxWords ? detailWordCount > showIfYes.maxWords : false;
    const detailPercentUsed = showIfYes?.maxWords ? Math.min((detailWordCount / showIfYes.maxWords) * 100, 100) : 0;

    return (
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
        {showIfYes && localValues[name] === "Yes" && (
          <div className="mt-3 pl-4 border-l-4 border-accent/30 bg-accent/5 rounded-xl py-2">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-medium text-accent">
                {showIfYes.label}
              </label>
              {showIfYes.maxWords && showIfYes.inputName && (
                <span className={`text-xs font-medium ${
                  isDetailOverLimit 
                    ? 'text-red-600' 
                    : detailWordCount > showIfYes.maxWords * 0.9 
                      ? 'text-orange-500' 
                      : 'text-gray-500'
                }`}>
                  {detailWordCount}/{showIfYes.maxWords} words {isDetailOverLimit && '⚠️'}
                </span>
              )}
            </div>
            {showIfYes.inputName && (
              <>
                <input
                  type="text"
                  name={showIfYes.inputName}
                  value={localValues[showIfYes.inputName] || ""}
                  onChange={handleChange}
                  disabled={readOnly}
                  className={`w-full rounded-xl border ${
                    isDetailOverLimit ? 'border-red-400' : 'border-gray-200'
                  } bg-white px-3 py-2 text-base shadow-sm focus:outline-none focus:ring-2 ${
                    isDetailOverLimit ? 'focus:ring-red-400' : 'focus:ring-accent'
                  } focus:border-accent transition-all placeholder-gray-400 ${
                    fieldErrors[showIfYes.inputName]
                      ? "border-red-300 bg-red-50"
                      : "hover:border-accent/40"
                  } ${readOnly ? "bg-gray-50 text-gray-400" : ""}`}
                />
                {showIfYes.maxWords && (
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        isDetailOverLimit 
                          ? 'bg-red-500' 
                          : detailPercentUsed > 90 
                            ? 'bg-orange-400' 
                            : detailPercentUsed > 75 
                              ? 'bg-yellow-400' 
                              : 'bg-green-400'
                      }`}
                      style={{ width: `${Math.min(detailPercentUsed, 100)}%` }}
                    />
                  </div>
                )}
                {isDetailOverLimit && showIfYes.maxWords && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <span>⚠️</span>
                    <span>Exceeds word limit by {detailWordCount - showIfYes.maxWords} words. Please reduce content.</span>
                  </p>
                )}
                {fieldErrors[showIfYes.inputName] && (
                  <p className="text-xs text-red-500 mt-1">
                    {fieldErrors[showIfYes.inputName]}
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderMultiSelectCheckbox = (
    label: string,
    name: string,
    options: string[],
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
      <div className={`flex flex-col gap-2 w-full`}>
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer w-full"
            style={{ width: '100%' }}
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
              className="accent-accent h-4 w-4 rounded border-gray-300 focus:ring-accent"
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

  return (
    <div className="">
      {/* Progress Bar */}
      <div className="w-full max-w-2xl mx-auto pt-2 md:pt-6 px-2">
        <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
          <div className="h-2 bg-gradient-to-r from-indigo-500 to-green-400 rounded-full transition-all" style={{ width: `${getProgressPercentage()}%` }} />
        </div>
        <nav className="flex items-center justify-between gap-2 overflow-visible pb-2 relative">
          {FORM_SECTIONS.map((section, idx) => {
            const active = idx === currentStep;
            const unlocked = idx <= maxStep;
            return (
              <div key={section.id} className="relative flex flex-col items-center group">
                <button
                  type="button"
                  onClick={() => handleStepClickSequential(idx)}
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
        <section
          className={`w-full max-w-2xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100 p-4 md:p-8 flex flex-col mt-2 md:mt-4 animate-fade-in ${FORM_SECTIONS[currentStep].fields.length === 1 ? 'gap-2' : 'gap-4 md:gap-8'}`}
        >
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
            <div className={`${FORM_SECTIONS[currentStep].fields.length === 1 ? 'space-y-2' : 'space-y-4 md:space-y-8'}`}>
              {FORM_SECTIONS[currentStep].id === "livingArrangements" ? (
                <div className="flex flex-col gap-8 w-full">
                  {(() => {
                    const meta = FIELD_METADATA["livingArrangements"];
                    const required = isFieldRequired("livingArrangements");
                    const showOther = Array.isArray(localValues.livingArrangements) && localValues.livingArrangements.some((opt: string) => opt.toLowerCase().includes('other'));
                    return <React.Fragment key="livingArrangements">
                      {renderMultiSelectCheckbox(meta.label, "livingArrangements", meta.options || [], required)}
                      {showOther && (
                        <div className="mt-2 w-full">
                          {renderInput(FIELD_METADATA.livingArrangementsOther.label, "livingArrangementsOther", "text", FIELD_METADATA.livingArrangementsOther.placeholder, isFieldRequired("livingArrangementsOther"))}
                        </div>
                      )}
                    </React.Fragment>;
                  })()}
                  {(() => {
                    const meta = FIELD_METADATA["travelArrangements"];
                    const required = isFieldRequired("travelArrangements");
                    const showOther = Array.isArray(localValues.travelArrangements) && localValues.travelArrangements.some((opt: string) => opt.toLowerCase().includes('other'));
                    return <React.Fragment key="travelArrangements">
                      {renderMultiSelectCheckbox(meta.label, "travelArrangements", meta.options || [], required)}
                      {showOther && (
                        <div className="mt-2 w-full">
                          {renderInput(FIELD_METADATA.travelArrangementsOther.label, "travelArrangementsOther", "text", FIELD_METADATA.travelArrangementsOther.placeholder, isFieldRequired("travelArrangementsOther"))}
                        </div>
                      )}
                    </React.Fragment>;
                  })()}
                </div>
              ) : FORM_SECTIONS[currentStep].id === "aboutMe" ? (
                <div className="w-full">
                  {(() => {
                    const meta = FIELD_METADATA["aboutMe"];
                    const required = isFieldRequired("aboutMe");
                    return renderTextArea(meta.label, "aboutMe", meta.rows || 4, meta.placeholder, required, meta.maxWords);
                  })()}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {FORM_SECTIONS[currentStep].fields.map((field) => {
                    const meta = FIELD_METADATA[field] || { label: field, type: "text" };
                    const required = isFieldRequired(field);
                    if (meta.type === "textarea") {
                      return <React.Fragment key={field}>{renderTextArea(meta.label, field, meta.rows || 3, meta.placeholder, required, meta.maxWords)}</React.Fragment>;
                    }
                    if (meta.type === "dropdown") {
                      return <React.Fragment key={field}>{renderDropdown(meta.label, field, meta.options || [], meta.showIfYes, required)}</React.Fragment>;
                    }
                    if (meta.type === "checkbox") {
                      return <React.Fragment key={field}>{renderMultiSelectCheckbox(meta.label, field, meta.options || [], required)}</React.Fragment>;
                    }
                    return <React.Fragment key={field}>{renderInput(meta.label, field, meta.type || "text", meta.placeholder, required)}</React.Fragment>;
                  })}
                </div>
              )}
            </div>
          </form>
        </section>

        {/* Navigation Buttons */}
        <footer className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-lg border-t border-gray-100 px-4 md:px-10 py-5 flex flex-col items-center gap-4 shadow-2xl rounded-b-3xl animate-fade-in mt-2">
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
                handleSaveWithConfirm(true);
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

// ===========================
// PDF VIEW COMPONENT - COMPLETE IMPLEMENTATION
// ===========================

const PDFView: React.FC<any> = ({ formData, commonFieldsData, images, settings, getFieldValue }) => {
  const timestamp = new Date().toISOString();
  console.log(`🔍 PDFView in ClientIntakeFormUnified.tsx is being used for PDF generation - ${timestamp}`);
  console.log('📊 Form data keys:', Object.keys(formData || {}));
  
  // Use the same styling approach as ClientIntakev2Natural
  const cleanText = (text: string) => {
    if (!text) return '';
    return text.replace(/\n\s*\n/g, '\n').trim();
  };

  // Helper function to calculate dynamic height based on content length
  const calculateDynamicHeight = (content: string, maxWords: number = 1000): number => {
    if (!content || content.trim() === '') return 100;
    const characterCount = content.length;
    const lineCount = content.split('\n').length;
    const estimatedLines = Math.max(lineCount, Math.ceil(characterCount / 80));
    return Math.max(120, estimatedLines * 20 + 40);
  };

  // Helper function to calculate dynamic height for otherSupports (500 words)
  const calculateOtherSupportsHeight = (content: string, maxWords: number = 500): number => {
    if (!content || content.trim() === '') return 32; // Minimum height with larger padding

    const wordCount = content.trim().split(/\s+/).length;
    const characterCount = content.length;

    // Calculate height based on content length (up to maxWords)
    const contentRatio = Math.min(wordCount / maxWords, 1); // Cap at 1.0 for maxWords
    const maxHeight = 600; // Maximum height for 500 words (600px can hold ~500 words)
    const minHeight = 32;  // Minimum height with larger padding

    // Calculate dynamic height based on both word count and character count
    const wordBasedHeight = minHeight + (contentRatio * (maxHeight - minHeight));
    const characterBasedHeight = Math.max(32, (characterCount / 50) * 20); // ~20px per 50 characters, minimum 32px

    // Use the larger of the two calculations to ensure content fits
    const dynamicHeight = Math.max(wordBasedHeight, characterBasedHeight);

    return dynamicHeight;
  };

  // Helper function to get content stats
  const getContentStats = (content: string) => {
    if (!content || content.trim() === '') return { words: 0, characters: 0, percentage: 0 };

    const words = content.trim().split(/\s+/).length;
    const characters = content.trim().length;
    const percentage = Math.min((words / 1000) * 100, 100);

    return { words, characters, percentage };
  };

  // Helper function to calculate dynamic height for address fields (extensible)
  const calculateAddressHeight = (content: string): number => {
    if (!content || content.trim() === '') return 32; // Minimum height with larger padding

    const lineCount = content.split('\n').length;
    const characterCount = content.length;

    // Calculate height based on lines and characters
    const baseHeight = 32; // Minimum height
    const lineBasedHeight = baseHeight + (lineCount - 1) * 20; // 20px per additional line
    const characterBasedHeight = Math.max(32, (characterCount / 60) * 20); // ~20px per 60 characters

    // Use the larger of the two calculations
    const dynamicHeight = Math.max(lineBasedHeight, characterBasedHeight);
    const maxHeight = 200; // Maximum height for address fields

    return Math.min(dynamicHeight, maxHeight);
  };

  const A4Page = ({ children, className = "", showFooter = true }: any) => (
    <div
      className={`bg-white mx-auto shadow-md flex flex-col ${className}`}
      style={{
        width: "794px",
        height: "1123px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        pageBreakAfter: "always",
        boxSizing: 'border-box',
        padding: "24px 20px",
        marginBottom: "20px", // Gap between pages
      }}
    >
      {children}
      {showFooter && <StandardFooter />}
    </div>
  );

  const StandardFooter = () => {
    const formatDate = (value: string) => {
      if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const parsed = parseISO(value);
        if (isValid(parsed)) {
          return format(parsed, "dd-MM-yyyy");
        }
      }
      return value || 'N/A';
    };

    return (
      <div className="flex justify-between text-xs px-1 text-gray-600 mt-4">
        <span>Website: {settings?.company_website || 'https://www.infinitysupportswa.org'}</span>
        <span>{settings?.client_intake_form_id || 'CF001'}</span>
        <span>Review Date: {formatDate(settings?.review_date)}</span>
      </div>
    );
  };

  const displayCheckboxGroup = (options: any, selected: any[] = [], otherValue: any = "") => (
    <div className="space-y-1 text-xs">
      {options.map((opt: any) => (
        <div key={opt} className="flex space-x-1">
          <span className="w-4 h-4 border border-black flex justify-center">
            {selected?.includes(opt) ? "✔" : ""}
          </span>
          <span>{opt}</span>
        </div>
      ))}
      {otherValue && (
        <div className="flex space-x-1">
          <span className="w-4 h-4 border border-black flex justify-center">✔</span>
          <span>{otherValue}</span>
        </div>
      )}
    </div>
  );

  // Function to display only selected options (for multi-select fields)
  const displaySelectedOptions = (selected: any[] = [], otherValue: any = "") => {
    if (!selected || selected.length === 0) {
      return <span className="text-xs text-gray-500">No options selected</span>;
    }

    return (
      <div className="space-y-1 text-xs">
        {selected.map((option: any, index: any) => (
          <div key={index} className="flex space-x-1">
            <span className="w-4 h-4 border border-black flex justify-center">✔</span>
            <span>{option}</span>
          </div>
        ))}
        {otherValue && (
          <div className="flex space-x-1">
            <span className="w-4 h-4 border border-black flex justify-center">✔</span>
            <span>Other: {otherValue}</span>
          </div>
        )}
      </div>
    );
  };

  // Helper function to render long text with proper wrapping
  const renderLongText = (value: string, minHeight: number = 100) => {
    const lines = value ? value.split('\n') : [''];
    const estimatedHeight = Math.max(minHeight, lines.length * 12 + 20); // 12px per line + padding

    return (
      <td
        className="border border-black px-1 py-0.5 align-top text-xs"
        colSpan={2}
        style={{
          height: `${estimatedHeight}px`,
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          overflow: 'visible'
        }}
      >
        {value}
      </td>
    );
  };

  // Helper function to render Yes/No with details
  const renderYesNoWithDetails = (fieldKey: string, label: string, detailsField?: string) => {
    const value = getFieldValue(fieldKey);
    const details = detailsField ? getFieldValue(detailsField) : '';

    return (
      <tr>
        <td className="border border-black px-1 py-0.5 font-semibold text-xs">
          {label}
        </td>
        <td className="border border-black px-1 py-0.5">
          <div className="space-y-1">
            <div className="flex space-x-1">
              <span className="w-4 h-4 border border-black flex justify-center">
                {value === "Yes" ? "✔" : ""}
              </span>
              <span className="text-xs">Yes</span>
              <span className="w-4 h-4 border border-black flex justify-center ml-4">
                {value === "No" ? "✔" : ""}
              </span>
              <span className="text-xs">No</span>
            </div>
            {value === "Yes" && details && (
              <div className="mt-2 text-xs">
                <strong>Details:</strong> {details}
              </div>
            )}
          </div>
        </td>
      </tr>
    );
  };

  // Helper function to calculate dynamic height for Yes/No question details
  const calculateYesNoDetailsHeight = (content: string): number => {
    if (!content || content.trim() === '') return 0; // No details, no extra height needed

    const lineCount = content.split('\n').length;
    const characterCount = content.length;

    // Calculate height based on lines and characters
    const baseHeight = 40; // Base height for details box (padding + label)
    const lineBasedHeight = lineCount * 20; // 20px per line
    const characterBasedHeight = Math.max(20, (characterCount / 80) * 20); // ~20px per 80 characters

    // Use the larger of the two calculations
    const dynamicHeight = Math.max(lineBasedHeight, characterBasedHeight);
    const maxHeight = 200; // Maximum height for details

    return Math.min(baseHeight + dynamicHeight, maxHeight);
  };

  // New function to render Yes/No questions in paragraph format (without table)
  const renderYesNoQuestion = (fieldKey: string, label: string, detailsField?: string) => {
    const value = getFieldValue(fieldKey);
    const details = detailsField ? getFieldValue(detailsField) : '';
    const detailsHeight = value === "Yes" && details ? calculateYesNoDetailsHeight(details) : 0;

    return (
      <div
        className="mb-6 p-4 border border-gray-300 rounded-lg"
        style={{
          minHeight: detailsHeight > 0 ? `${detailsHeight + 80}px` : '80px',
          breakInside: 'avoid',
          pageBreakInside: 'avoid'
        }}
      >
        <div className="font-semibold text-sm mb-3 text-gray-800">
          {label}
        </div>
        <div className="flex items-center gap-6 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 border border-black flex justify-center items-center text-xs">
              {value === "Yes" ? "✔" : ""}
            </span>
            <span className="text-sm font-medium">Yes</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 border border-black flex justify-center items-center text-xs">
              {value === "No" ? "✔" : ""}
            </span>
            <span className="text-sm font-medium">No</span>
          </div>
        </div>
        {value === "Yes" && details && (
          <div
            className="mt-4 p-3 bg-blue-50 rounded border-l-4 border-blue-500"
            style={{
              height: `${detailsHeight}px`,
              overflow: 'visible'
            }}
          >
            <div className="text-sm font-medium text-gray-700 mb-2">Details:</div>
            <div
              className="text-sm text-gray-600"
              style={{
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                overflow: 'visible'
              }}
            >
              {details}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="print:p-0">
      {/* PAGE 1: Personal Information */}
      <A4Page>
        <div className="flex justify-center mb-4">
          <img
            alt="Infinity Logo"
            src={images?.infinityLogo || "/infinity_logo.png"}
            width={200}
            height={60}
            className="object-contain"
          />
        </div>
        <div className="flex-1">
          <table className="w-full h-full border-collapse border border-black text-xs">
            <tbody>
              <tr className="bg-gray-300 font-semibold text-white">
                <td className="border border-black px-2 py-1" colSpan={4}>Participant Details</td>
              </tr>
              {/* Date - Single Row */}
              <tr>
                <td className="border border-black px-2 py-1 font-semibold" style={{ width: "25%" }}>Date:</td>
                <td className="border border-black px-2 py-1" colSpan={3} style={{ borderBottom: "1px solid #000" }}>
                  {getFieldValue('date') || ' '}
                </td>
              </tr>
              {/* NDIS Number - Single Row */}
              <tr>
                <td className="border border-black px-2 py-1 font-semibold" style={{ width: "25%" }}>NDIS Number:</td>
                <td className="border border-black px-2 py-1" colSpan={3} style={{ borderBottom: "1px solid #000" }}>
                  {getFieldValue('ndisNumber') || ' '}
                </td>
              </tr>
              {/* Given Names - Single Row */}
              <tr>
                <td className="border border-black px-2 py-1 font-semibold" style={{ width: "25%" }}>Given name(s):</td>
                <td className="border border-black px-2 py-1" colSpan={3} style={{ borderBottom: "1px solid #000" }}>
                  {getFieldValue('givenName') || ' '}
                </td>
              </tr>
              {/* Surname - Single Row */}
              <tr>
                <td className="border border-black px-2 py-1 font-semibold" style={{ width: "25%" }}>Surname:</td>
                <td className="border border-black px-2 py-1" colSpan={3} style={{ borderBottom: "1px solid #000" }}>
                  {getFieldValue('surname') || ' '}
                </td>
              </tr>
              {/* Sex Field - Single Row */}
              <tr>
                <td className="border border-black px-2 py-1 font-semibold" style={{ width: "25%" }}>Sex:</td>
                <td className="border border-black px-2 py-1" colSpan={3}>
                  {displayCheckboxGroup(["Male", "Female", "Prefer not to say"], getFieldValue('sex'))}
                </td>
              </tr>
              {/* Pronoun Field - Single Row */}
              <tr>
                <td className="border border-black px-2 py-1 font-semibold" style={{ width: "25%" }}>Pronoun:</td>
                <td className="border border-black px-2 py-1" colSpan={3} style={{ borderBottom: "1px solid #000" }}>
                  {getFieldValue('pronoun') || ' '}
                </td>
              </tr>
              {/* Aboriginal/Torres Strait Island - Single Box with Horizontal Checkboxes */}
              <tr>
                <td className="border border-black px-2 py-1" colSpan={4}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Are you an Aboriginal or Torres Strait Island descent?</span>
                    <div className="flex flex-row gap-4">
                      {displayCheckboxGroup(["Yes", "No"], getFieldValue('aboriginalTorres'))}
                    </div>
                  </div>
                </td>
              </tr>
              {/* Preferred Name - Single Row */}
              <tr>
                <td className="border border-black px-2 py-1 font-semibold" style={{ width: "25%" }}>Preferred name:</td>
                <td className="border border-black px-2 py-1" colSpan={3} style={{ borderBottom: "1px solid #000" }}>
                  {getFieldValue('preferredName') || ' '}
                </td>
              </tr>
              {/* Date of Birth - Single Row */}
              <tr>
                <td className="border border-black px-2 py-1 font-semibold" style={{ width: "25%" }}>Date of Birth:</td>
                <td className="border border-black px-2 py-1" colSpan={3} style={{ borderBottom: "1px solid #000" }}>
                  {getFieldValue('dateOfBirth') || ' '}
                </td>
              </tr>

              <tr className="bg-gray-300 font-semibold text-white">
                <td className="border border-black px-2 py-1" colSpan={4}>Residential Address Details</td>
              </tr>
              {/* Number / Street - Single Row */}
              <tr>
                <td className="border border-black px-2 py-1 font-semibold" style={{ width: "25%" }}>Number / Street:</td>
                <td className="border border-black px-2 py-1" colSpan={3} style={{ borderBottom: "1px solid #000" }}>
                  {getFieldValue('addressNumberStreet') || ' '}
                </td>
              </tr>
              {/* State - Single Row */}
              <tr>
                <td className="border border-black px-2 py-1 font-semibold" style={{ width: "25%" }}>State:</td>
                <td className="border border-black px-2 py-1" colSpan={3} style={{ borderBottom: "1px solid #000" }}>
                  {getFieldValue('state') || ' '}
                </td>
              </tr>
              {/* Postcode - Single Row */}
              <tr>
                <td className="border border-black px-2 py-1 font-semibold" style={{ width: "25%" }}>Postcode:</td>
                <td className="border border-black px-2 py-1" colSpan={3} style={{ borderBottom: "1px solid #000" }}>
                  {getFieldValue('postcode') || ' '}
                </td>
              </tr>

              <tr className="bg-gray-300 font-semibold text-white">
                <td className="border border-black px-2 py-1" colSpan={4}>Participant Contact Details</td>
              </tr>
              {/* Email Address - Single Row */}
              <tr>
                <td className="border border-black px-2 py-1 font-semibold" style={{ width: "25%" }}>Email address:</td>
                <td className="border border-black px-2 py-1" colSpan={3} style={{ borderBottom: "1px solid #000" }}>
                  {getFieldValue('email') || ' '}
                </td>
              </tr>
              {/* Home Phone No - Single Row */}
              <tr>
                <td className="border border-black px-2 py-1 font-semibold" style={{ width: "25%" }}>Home Phone No:</td>
                <td className="border border-black px-2 py-1" colSpan={3} style={{ borderBottom: "1px solid #000" }}>
                  {getFieldValue('homePhone') || ' '}
                </td>
              </tr>
              {/* Mobile No - Single Row */}
              <tr>
                <td className="border border-black px-2 py-1 font-semibold" style={{ width: "25%" }}>Mobile No:</td>
                <td className="border border-black px-2 py-1" colSpan={3} style={{ borderBottom: "1px solid #000" }}>
                  {getFieldValue('mobile') || ' '}
                </td>
              </tr>

              <tr className="bg-gray-300 font-semibold">
                <td className="border border-black px-1 py-0.5" colSpan={4}>Disability Conditions/Disability type(s)</td>
              </tr>
              <tr>
                <td
                  className="border border-black px-2 py-2 align-top text-xs bg-white"
                  colSpan={4}
                  style={{
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    overflow: 'visible',
                    minHeight: '120px',
                    width: '100%',
                    display: 'block',
                    boxSizing: 'border-box',
                    textOverflow: 'clip',
                    maxHeight: 'none',
                    lineClamp: 'none',
                    WebkitLineClamp: 'none',
                    height: 'auto',
                    breakInside: 'auto',
                    pageBreakInside: 'auto',
                    fontSize: '13px',
                    lineHeight: '1.4'
                  }}
                >
                  {getFieldValue('disabilityConditions') || ' '}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </A4Page>

      {/* PAGE 2: Medical Contact & Support Coordinator */}
      <A4Page>
        <div className="flex justify-center mb-4">
          <img
            alt="Infinity Logo"
            src={images?.infinityLogo || "/infinity_logo.png"}
            width={150}
            height={60}
            className="object-contain"
          />
        </div>
        {/* Medical Contact & Support Coordinator Table */}
        <div className="w-full mb-6">
          <table className="w-full border-collapse border border-black text-sm"
            style={{
              tableLayout: 'fixed',
              width: '100%',
              breakInside: 'auto',
              pageBreakInside: 'auto'
            }}
          >
            <tbody>
              {/* GP Medical Contact Section */}
              <tr className="bg-gray-300 font-semibold">
                <td className="border border-black px-3 py-2" colSpan={4} style={{ fontSize: '14px' }}>GP Medical Contact</td>
              </tr>
              {/* Medical Centre Name - Single Row */}
              <tr>
                <td className="border border-black px-3 py-2 font-semibold" style={{ width: "25%", fontSize: '13px' }}>Medical Centre Name:</td>
                <td className="border border-black px-3 py-2" colSpan={3} style={{ borderBottom: "1px solid #000", fontSize: '13px' }}>
                  {getFieldValue('medicalCentreName') || ' '}
                </td>
              </tr>
              {/* Phone - Single Row */}
              <tr>
                <td className="border border-black px-3 py-2 font-semibold" style={{ width: "25%", fontSize: '13px' }}>Phone:</td>
                <td className="border border-black px-3 py-2" colSpan={3} style={{ borderBottom: "1px solid #000", fontSize: '13px' }}>
                  {getFieldValue('medicalPhone') || ' '}
                </td>
              </tr>

              {/* Support Coordinator Section */}
              <tr className="bg-gray-300 font-semibold">
                <td className="border border-black px-3 py-2" colSpan={4} style={{ fontSize: '14px' }}>Support Coordinator</td>
              </tr>
              {/* Name - Single Row */}
              <tr>
                <td className="border border-black px-3 py-2 font-semibold" style={{ width: "25%", fontSize: '13px' }}>Name:</td>
                <td className="border border-black px-3 py-2" colSpan={3} style={{ borderBottom: "1px solid #000", fontSize: '13px' }}>
                  {getFieldValue('supportCoordinatorName') || ' '}
                </td>
              </tr>
              {/* Email Address - Single Row */}
              <tr>
                <td className="border border-black px-3 py-2 font-semibold" style={{ width: "25%", fontSize: '13px' }}>Email Address:</td>
                <td className="border border-black px-3 py-2" colSpan={3} style={{ borderBottom: "1px solid #000", fontSize: '13px' }}>
                  {getFieldValue('supportCoordinatorEmail') || ' '}
                </td>
              </tr>
              {/* Company - Single Row */}
              <tr>
                <td className="border border-black px-3 py-2 font-semibold" style={{ width: "25%", fontSize: '13px' }}>Company:</td>
                <td className="border border-black px-3 py-2" colSpan={3} style={{ borderBottom: "1px solid #000", fontSize: '13px' }}>
                  {getFieldValue('supportCoordinatorCompany') || ' '}
                </td>
              </tr>
              {/* Contact Number - Single Row */}
              <tr>
                <td className="border border-black px-3 py-2 font-semibold" style={{ width: "25%", fontSize: '13px' }}>Contact number:</td>
                <td className="border border-black px-3 py-2" colSpan={3} style={{ borderBottom: "1px solid #000", fontSize: '13px' }}>
                  {getFieldValue('supportCoordinatorContact') || ' '}
                </td>
              </tr>

              {/* What other supports Section - Move outside table for better flow */}
            </tbody>
          </table>
        </div>

        {/* What other supports Section - Standalone for better text flow */}
        <div className="w-full mt-6 mb-4">
          {/* Header Bar */}
          <div className="bg-gray-300 border border-black px-2 py-1">
            <span className="font-semibold text-black text-xs">What other supports including mainstream health services you receive at present</span>
          </div>

          {/* Content Area - Dynamic Height */}
          <div
            style={{
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              overflow: 'visible',
              minHeight: '120px',
              width: '100%',
              display: 'block',
              boxSizing: 'border-box',
              textOverflow: 'clip',
              maxHeight: 'none',
              lineClamp: 'none',
              WebkitLineClamp: 'none',
              border: '1px solid black',
              borderTop: 'none',
              padding: '12px',
              backgroundColor: 'white',
              fontSize: '12px',
              lineHeight: '1.4',
              height: 'auto',
              breakInside: 'auto',
              pageBreakInside: 'auto'
            }}
          >
            {getFieldValue('otherSupports') || ' '}
          </div>
        </div>

        {/* Continue with next table if needed */}
        <div className="flex-1 mt-4">
          <table className="w-full border-collapse border border-black text-sm">
            <tbody>
            </tbody>
          </table>
        </div>
      </A4Page>

      {/* PAGE 3: All About Me - Compact Header Bar */}
      <A4Page>
        <div className="flex justify-center mb-4">
          <img
            alt="Infinity Logo"
            src={images?.infinityLogo || "/infinity_logo.png"}
            width={150}
            height={60}
            className="object-contain"
          />
        </div>
        <div className="flex-1">
          {/* Compact Header Bar */}
          <div className="bg-gray-300 border border-black px-2 py-1">
            <span className="font-semibold text-black text-xs">All About Me</span>
          </div>

          {/* Content Area - Fixed Text Overflow Issue */}
          <div
            style={{
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              overflow: 'visible',
              minHeight: '120px',
              width: '100%',
              display: 'block',
              boxSizing: 'border-box',
              textOverflow: 'clip',
              maxHeight: 'none',
              lineClamp: 'none',
              WebkitLineClamp: 'none',
              border: '1px solid black',
              borderTop: 'none',
              padding: '8px',
              backgroundColor: 'white',
              fontSize: '12px',
              lineHeight: '1.4',
              height: 'auto',
              breakInside: 'auto',
              pageBreakInside: 'auto'
            }}
          >
            {getFieldValue('aboutMe') || ' '}
          </div>
        </div>
      </A4Page>

      {/* PAGE 4: Advocate Details */}
      <A4Page>
        <div className="flex justify-center mb-4">
          <img
            alt="Infinity Logo"
            src={images?.infinityLogo || "/infinity_logo.png"}
            width={150}
            height={60}
            className="object-contain"
          />
        </div>
        <div className="flex-1">
          <table className="w-full border-collapse border border-black text-sm">
            <tbody>
              {/* Advocate Header */}
              <tr className="bg-gray-300 font-semibold">
                <td className="border border-black px-3 py-2" colSpan={4} style={{ fontSize: '14px' }}>Advocate/representative details (if applicable)</td>
              </tr>

              {/* Name - Single Row */}
              <tr>
                <td className="border border-black px-3 py-2 font-semibold" style={{ width: "25%", fontSize: '13px' }}>Name:</td>
                <td className="border border-black px-3 py-2" colSpan={3} style={{ borderBottom: "1px solid #000", fontSize: '13px' }}>
                  {getFieldValue('advocateName') || ' '}
                </td>
              </tr>

              {/* Relationship - Single Row */}
              <tr>
                <td className="border border-black px-3 py-2 font-semibold" style={{ width: "25%", fontSize: '13px' }}>Relationship with the participant:</td>
                <td className="border border-black px-3 py-2" colSpan={3} style={{ borderBottom: "1px solid #000", fontSize: '13px' }}>
                  {getFieldValue('advocateRelationship') || ' '}
                </td>
              </tr>

              {/* Phone No - Single Row */}
              <tr>
                <td className="border border-black px-3 py-2 font-semibold" style={{ width: "25%", fontSize: '13px' }}>Phone No:</td>
                <td className="border border-black px-3 py-2" colSpan={3} style={{ borderBottom: "1px solid #000", fontSize: '13px' }}>
                  {getFieldValue('advocatePhone') || ' '}
                </td>
              </tr>

              {/* Mobile No - Single Row */}
              <tr>
                <td className="border border-black px-3 py-2 font-semibold" style={{ width: "25%", fontSize: '13px' }}>Mobile No:</td>
                <td className="border border-black px-3 py-2" colSpan={3} style={{ borderBottom: "1px solid #000", fontSize: '13px' }}>
                  {getFieldValue('advocateMobile') || ' '}
                </td>
              </tr>

              {/* Email - Single Row */}
              <tr>
                <td className="border border-black px-3 py-2 font-semibold" style={{ width: "25%", fontSize: '13px' }}>Email:</td>
                <td className="border border-black px-3 py-2" colSpan={3} style={{ borderBottom: "1px solid #000", fontSize: '13px' }}>
                  {getFieldValue('advocateEmail') || ' '}
                </td>
              </tr>

              {/* Address Details - Dynamic Height */}
              <tr>
                <td className="border border-black px-3 py-2 font-semibold" style={{ width: "25%", fontSize: '13px' }}>Address Details:</td>
                <td
                  className="border border-black px-3 py-3 align-top"
                  colSpan={3}
                  style={{
                    height: 'auto',
                    minHeight: '40px',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    overflow: 'visible',
                    fontSize: '13px'
                  }}
                >
                  {getFieldValue('advocateAddress') || ' '}
                </td>
              </tr>

              {/* Postal Address Details - Dynamic Height */}
              <tr>
                <td className="border border-black px-3 py-2 font-semibold" style={{ width: "25%", fontSize: '13px' }}>Postal Address Details:</td>
                <td
                  className="border border-black px-3 py-3 align-top"
                  colSpan={3}
                  style={{
                    height: 'auto',
                    minHeight: '40px',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    overflow: 'visible',
                    fontSize: '13px'
                  }}
                >
                  {getFieldValue('advocatePostalAddress') || ' '}
                </td>
              </tr>

              {/* Other Information - Dynamic Height */}
              <tr>
                <td className="border border-black px-3 py-2 font-semibold" style={{ width: "25%", fontSize: '13px' }}>Other Information:</td>
                <td
                  className="border border-black px-3 py-3 align-top"
                  colSpan={3}
                  style={{
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    overflow: 'visible',
                    minHeight: '120px',
                    width: '100%',
                    display: 'block',
                    boxSizing: 'border-box',
                    textOverflow: 'clip',
                    maxHeight: 'none',
                    lineClamp: 'none',
                    WebkitLineClamp: 'none',
                    height: 'auto',
                    breakInside: 'auto',
                    pageBreakInside: 'auto',
                    fontSize: '13px',
                    lineHeight: '1.4'
                  }}
                >
                  {getFieldValue('advocateOtherInfo') || ' '}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </A4Page>

      {/* PAGE 5: Personal Situation */}
      <A4Page>
        <div className="flex justify-center mb-4">
          <img
            alt="Infinity Logo"
            src={images?.infinityLogo || "/infinity_logo.png"}
            width={150}
            height={60}
            className="object-contain"
          />
        </div>
        <div className="flex-1">
          <table className="w-full border-collapse border border-black text-sm">
            <tbody>
              {/* Personal Situation Header */}
              <tr className="bg-gray-300 font-semibold">
                <td className="border border-black px-3 py-2" colSpan={4} style={{ fontSize: '14px' }}>Personal Situation</td>
              </tr>

              {/* Barriers Question - Single Row */}
              <tr>
                <td className="border border-black px-3 py-2 font-semibold" style={{ width: "25%", fontSize: '13px' }}>Are there any cultural, communication barriers or intimacy issues that need to be considered when delivering services?</td>
                <td className="border border-black px-3 py-2" colSpan={3} style={{ borderBottom: "1px solid #000", fontSize: '13px' }}>
                  {displayCheckboxGroup(["Yes", "No"], getFieldValue('barriers'))}
                </td>
              </tr>

              {/* Interpreter Question - Single Row */}
              <tr>
                <td className="border border-black px-3 py-2 font-semibold" style={{ width: "25%", fontSize: '13px' }}>Verbal communication or spoken language - Is an interpreter needed?</td>
                <td className="border border-black px-3 py-2" colSpan={3} style={{ borderBottom: "1px solid #000", fontSize: '13px' }}>
                  {displayCheckboxGroup(["Yes", "No"], getFieldValue('interpreter'))}
                </td>
              </tr>

              {/* Language - Single Row */}
              <tr>
                <td className="border border-black px-3 py-2 font-semibold" style={{ width: "25%", fontSize: '13px' }}>Language:</td>
                <td className="border border-black px-3 py-2" colSpan={3} style={{ borderBottom: "1px solid #000", fontSize: '13px' }}>
                  {getFieldValue('language') || ' '}
                </td>
              </tr>

              {/* Country of Birth - Single Row */}
              <tr>
                <td className="border border-black px-3 py-2 font-semibold" style={{ width: "25%", fontSize: '13px' }}>Country of birth:</td>
                <td className="border border-black px-3 py-2" colSpan={3} style={{ borderBottom: "1px solid #000", fontSize: '13px' }}>
                  {getFieldValue('countryOfBirth') || ' '}
                </td>
              </tr>

              {/* Cultural Values - Dynamic Height */}
              <tr>
                <td className="border border-black px-3 py-2 font-semibold" style={{ width: "25%", fontSize: '13px' }}>Cultural values/ beliefs or assumptions:</td>
                <td
                  className="border border-black px-3 py-3 align-top"
                  colSpan={3}
                  style={{
                    height: 'auto',
                    minHeight: '40px',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    overflow: 'visible',
                    fontSize: '13px'
                  }}
                >
                  {getFieldValue('culturalValues') || ' '}
                </td>
              </tr>

              {/* Cultural Behaviours - Dynamic Height */}
              <tr>
                <td className="border border-black px-3 py-2 font-semibold" style={{ width: "25%", fontSize: '13px' }}>Cultural behaviours:</td>
                <td
                  className="border border-black px-3 py-3 align-top"
                  colSpan={3}
                  style={{
                    height: 'auto',
                    minHeight: '40px',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    overflow: 'visible',
                    fontSize: '13px'
                  }}
                >
                  {getFieldValue('culturalBehaviours') || ' '}
                </td>
              </tr>

              {/* Written Communication - Dynamic Height */}
              <tr>
                <td className="border border-black px-3 py-2 font-semibold" style={{ width: "25%", fontSize: '13px' }}>Written communication/literacy:</td>
                <td
                  className="border border-black px-3 py-3 align-top"
                  colSpan={3}
                  style={{
                    height: 'auto',
                    minHeight: '40px',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    overflow: 'visible',
                    fontSize: '13px'
                  }}
                >
                  {getFieldValue('writtenCommunication') || ' '}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </A4Page>

      {/* PAGE 6: Contact Details & Living Arrangements */}
      <A4Page>
        <div className="flex justify-center mb-4">
          <img
            alt="Infinity Logo"
            src={images?.infinityLogo || "/infinity_logo.png"}
            width={150}
            height={70}
            className="object-contain"
          />
        </div>
        <div className="flex-1">
          <table className="w-full border-collapse border border-black text-sm">
            <tbody>
              {/* Primary Contact Section */}
              <tr className="bg-gray-300 font-semibold">
                <td className="border border-black px-3 py-2" colSpan={4} style={{ fontSize: '14px' }}>Primary Contact</td>
              </tr>

              {/* Contact Name - Single Row */}
              <tr>
                <td className="border border-black px-3 py-2 font-semibold" style={{ width: "25%", fontSize: '13px' }}>Contact Name:</td>
                <td className="border border-black px-3 py-2" colSpan={3} style={{ borderBottom: "1px solid #000", fontSize: '13px' }}>
                  {getFieldValue('primaryContactName') || ' '}
                </td>
              </tr>

              {/* Relationship - Single Row */}
              <tr>
                <td className="border border-black px-3 py-2 font-semibold" style={{ width: "25%", fontSize: '13px' }}>Relationship:</td>
                <td className="border border-black px-3 py-2" colSpan={3} style={{ borderBottom: "1px solid #000", fontSize: '13px' }}>
                  {getFieldValue('primaryContactRelationship') || ' '}
                </td>
              </tr>

              {/* Home Phone No - Single Row */}
              <tr>
                <td className="border border-black px-3 py-2 font-semibold" style={{ width: "25%", fontSize: '13px' }}>Home Phone No:</td>
                <td className="border border-black px-3 py-2" colSpan={3} style={{ borderBottom: "1px solid #000", fontSize: '13px' }}>
                  {getFieldValue('primaryContactHomePhone') || ' '}
                </td>
              </tr>

              {/* Mobile No - Single Row */}
              <tr>
                <td className="border border-black px-3 py-2 font-semibold" style={{ width: "25%", fontSize: '13px' }}>Mobile No:</td>
                <td className="border border-black px-3 py-2" colSpan={3} style={{ borderBottom: "1px solid #000", fontSize: '13px' }}>
                  {getFieldValue('primaryContactMobile') || ' '}
                </td>
              </tr>

              {/* Secondary Contact Section */}
              <tr className="bg-gray-300 font-semibold">
                <td className="border border-black px-3 py-2" colSpan={4} style={{ fontSize: '14px' }}>Secondary Contact</td>
              </tr>

              {/* Contact Name - Single Row */}
              <tr>
                <td className="border border-black px-3 py-2 font-semibold" style={{ width: "25%", fontSize: '13px' }}>Contact Name:</td>
                <td className="border border-black px-3 py-2" colSpan={3} style={{ borderBottom: "1px solid #000", fontSize: '13px' }}>
                  {getFieldValue('secondaryContactName') || ' '}
                </td>
              </tr>

              {/* Relationship - Single Row */}
              <tr>
                <td className="border border-black px-3 py-2 font-semibold" style={{ width: "25%", fontSize: '13px' }}>Relationship:</td>
                <td className="border border-black px-3 py-2" colSpan={3} style={{ borderBottom: "1px solid #000", fontSize: '13px' }}>
                  {getFieldValue('secondaryContactRelationship') || ' '}
                </td>
              </tr>

              {/* Home Phone No - Single Row */}
              <tr>
                <td className="border border-black px-3 py-2 font-semibold" style={{ width: "25%", fontSize: '13px' }}>Home Phone No:</td>
                <td className="border border-black px-3 py-2" colSpan={3} style={{ borderBottom: "1px solid #000", fontSize: '13px' }}>
                  {getFieldValue('secondaryContactHomePhone') || ' '}
                </td>
              </tr>

              {/* Mobile No - Single Row */}
              <tr>
                <td className="border border-black px-3 py-2 font-semibold" style={{ width: "25%", fontSize: '13px' }}>Mobile No:</td>
                <td className="border border-black px-3 py-2" colSpan={3} style={{ borderBottom: "1px solid #000", fontSize: '13px' }}>
                  {getFieldValue('secondaryContactMobile') || ' '}
                </td>
              </tr>

              {/* Living and support arrangements Section */}
              <tr className="bg-gray-300 font-semibold">
                <td className="border border-black px-3 py-2" colSpan={4} style={{ fontSize: '14px' }}>Living and support arrangements</td>
              </tr>

              {/* Living Arrangement Question - Single Row */}
              <tr>
                <td className="border border-black px-3 py-2 font-semibold" style={{ width: "25%", fontSize: '13px' }}>What is your current living arrangement? (Please tick the appropriate box)</td>
                <td className="border border-black px-3 py-2" colSpan={3} style={{ borderBottom: "1px solid #000", fontSize: '13px' }}>
                  {displaySelectedOptions(getFieldValue('livingArrangements'), getFieldValue('livingArrangementsOther'))}
                </td>
              </tr>

              {/* Travel Section */}
              <tr className="bg-gray-300 font-semibold">
                <td className="border border-black px-3 py-2" colSpan={4} style={{ fontSize: '14px' }}>Travel</td>
              </tr>

              {/* Travel Question - Single Row */}
              <tr>
                <td className="border border-black px-3 py-2 font-semibold" style={{ width: "25%", fontSize: '13px' }}>How do you travel to work or to your day service? (Please tick the appropriate box)</td>
                <td className="border border-black px-3 py-2" colSpan={3} style={{ borderBottom: "1px solid #000", fontSize: '13px' }}>
                  {displaySelectedOptions(getFieldValue('travelArrangements'), getFieldValue('travelArrangementsOther'))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </A4Page>

      {/* PAGE 7: Medical Information */}
      <A4Page>
        <div className="flex justify-center mb-4">
          <img
            alt="Infinity Logo"
            src={images?.infinityLogo || "/infinity_logo.png"}
            width={120}
            height={50}
            className="object-contain"
          />
        </div>
        <div className="flex-1 px-6 py-4">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 bg-gray-200 px-4 py-2 rounded">
              Medication Information/Diagnosis/Health Concerns
            </h2>

            {renderYesNoQuestion('medicationChart', 'Does the Participant require a Medication Chart?', 'medicationChartOthers')}
            {renderYesNoQuestion('mealtimeManagement', 'Does the Participant require Mealtime Management?')}
            {renderYesNoQuestion('bowelCare', 'Does the participant require Bowel Care Management?', 'bowelCareOthers')}
            {renderYesNoQuestion('menstrualIssues', 'Are there any issues with a menstrual cycle or is assistance needed with female hygiene', 'menstrualIssuesOthers')}
            {renderYesNoQuestion('epilepsy', 'Does the Participant have Epilepsy?', 'epilepsyOthers')}
            {renderYesNoQuestion('asthmatic', 'Is the Participant an Asthmatic?', 'asthmaticOthers')}
            {renderYesNoQuestion('allergies', 'Does the Participant have any allergies?', 'allergiesOthers')}
            {renderYesNoQuestion('anaphylactic', 'Is the Participant anaphylactic?', 'anaphylacticOthers')}
            {renderYesNoQuestion('minorInjury', 'Do you give permission for our company\'s staff to administer band-aids in cases of a minor injury?')}
            {renderYesNoQuestion('training', 'Does this participant require specific training?', 'trainingOthers')}
            {renderYesNoQuestion('othermedical', 'Are there any other medication conditions that will be relevant to the care provided to this Participant?', 'othermedicalOthers')}
            {renderYesNoQuestion('trigger', 'Is there any specific trigger for community activities?', 'triggerOthers')}
          </div>
        </div>
      </A4Page>

      {/* PAGE 8: Safety Considerations */}
      <A4Page>
        <div className="flex justify-center mb-4">
          <img
            alt="Infinity Logo"
            src={images?.infinityLogo || "/infinity_logo.png"}
            width={120}
            height={50}
            className="object-contain"
          />
        </div>
        <div className="flex-1 px-6 py-4">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 bg-gray-200 px-4 py-2 rounded">
              Safety Considerations
            </h2>

            {renderYesNoQuestion('absconding', 'Does the Participant show signs or a history of unexpectedly leaving (absconding)?', 'abscondingOthers')}
            {renderYesNoQuestion('historyOfFalls', 'Is this participant prone to falls or have a history of falls?')}
            {renderYesNoQuestion('behaviourConcern', 'Are there any behaviours of concern? E.g.: kicking, biting', 'behaviourConcernOthers')}
            {renderYesNoQuestion('positiveBehaviour', 'Is there a current Positive Behaviour Support Plan in place', 'positiveBehaviourOthers')}
            {renderYesNoQuestion('communicationAssistance', 'Does the participant require communication assistance?', 'communicationAssistanceOthers')}
            {renderYesNoQuestion('physicalAssistance', 'Is there any physical assistance or physical assistance preference for this Participant?', 'physicalAssistanceOthers')}
            {renderYesNoQuestion('languageConcern', 'Does the Participant have any expressive language concerns?', 'languageConcernOthers')}
            {renderYesNoQuestion('personalGoals', 'Does this Participant have any personal preferences & personal goals?')}
          </div>
        </div>
      </A4Page>
    </div>
  );
};

export default ClientIntakeFormUnified;

