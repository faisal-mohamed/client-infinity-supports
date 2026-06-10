"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    FaUser,
    FaUsers,
    FaBuilding,
    FaChevronLeft,
    FaChevronRight,
    FaSave,
    FaSpinner,
    FaCheck,
    FaClipboardList,
    FaClock,
    FaPenNib
} from "react-icons/fa";
import { useToast } from "@/components/ui/Toast";
import SignatureCanvas from "@/components/ui/SignatureCanvas";

export const FORM_SECTIONS = [
    {
        id: "partA",
        title: "Applicant/Participant Details",
        icon: FaUser,
        description: "Your details",
        fields: ["participantName", "participantDob", "ndisNumber", "participantAddress", "participantPhone", "participantEmail"],
        requiredFields: ["participantName", "participantDob", "ndisNumber", "participantAddress", "participantPhone", "participantEmail"]
    },
    {
        id: "partB",
        title: "Child Representative, Plan Nominee, or Legally Appointed Decision Maker Details",
        icon: FaUsers,
        description: "Representative details (Optional)",
        fields: ["repName", "repDob", "repPhone", "repEmail", "repRelationship", "employeeNumber"],
        requiredFields: []
    },
    {
        id: "partC",
        title: "Give Consent to a Person or Organisation",
        icon: FaBuilding,
        description: "Details for consent recipient (Optional)",
        fields: [
            "consentToPerson",
            "personFirstName", "personSurname", "personDob",
            "personIsNdisProvider", "personNdisProviderName", "personNdisProviderNumber",
            "personPhone", "personEmail", "personAddress", "personRelationship"
        ],
        requiredFields: []
    },
    {
        id: "partC_org",
        title: "Give Consent to a Person or Organisation (Continued)",
        icon: FaBuilding,
        description: "Organisation details (Optional)",
        fields: [
            "consentToOrg",
            "orgName", "orgContactFirstName", "orgContactSurname", "orgContactPosition",
            "orgIsNdisProvider", "orgProvideSupports", "orgProviderNumber", "orgAbn",
            "orgPhone", "orgEmail", "orgAddress"
        ],
        requiredFields: []
    },
    {
        id: "partD",
        title: "Choose the Consent Types",
        icon: FaClipboardList,
        description: "Select the types of consent (Optional)",
        fields: ["consentTypes", "consentBehalf", "consentChange"],
        requiredFields: []
    },
    {
        id: "partD_other",
        title: "Additional Consent Information",
        icon: FaClipboardList,
        description: "Other things you want the person to do on your behalf",
        fields: ["consentOtherCheck", "consentOtherDetails"],
        requiredFields: []
    },
    {
        id: "partE",
        title: "Choose the Consent Length",
        icon: FaClock,
        description: "Choose how long you want the consent to have (Optional)",
        fields: ["consentLength", "consentEndDate"],
        requiredFields: []
    },
    {
        id: "partF",
        title: "Signature and Consent",
        icon: FaPenNib,
        description: "Signature and date",
        fields: ["signature", "signatoryName", "signatureDate"],
        requiredFields: ["signature", "signatoryName", "signatureDate"]
    }
];

const FIELD_METADATA: Record<string, any> = {
    // Part A
    participantName: { label: "Full name", type: "text", required: true },
    participantDob: { label: "Date of birth (DD/MM/YYYY)", type: "date", required: true },
    ndisNumber: { label: "NDIS number", type: "text", required: true },
    participantAddress: { label: "Residential address", type: "textarea", required: true },
    participantPhone: { label: "Contact phone number", type: "text", required: true },
    participantEmail: { label: "Contact email", type: "email", required: true },

    // Part B
    repName: { label: "Your full name", type: "text" },
    repDob: { label: "Your date of birth (DD/MM/YYYY)", type: "date" },
    repPhone: { label: "Your phone number", type: "text" },
    repEmail: { label: "Your email", type: "email" },
    repRelationship: {
        label: "What is your relationship to the participant/ the applicant",
        type: "textarea",
        placeholder: "e.g. child representative, plan nominee, legally appointed decision maker"
    },
    employeeNumber: { label: "Employee number or logon (if you are completing this form as part of your job)", type: "text" },

    // Part C (Person)
    consentToPerson: {
        label: "I am giving consent to a person",
        type: "checkbox",
        options: ["I am giving consent to a person"],
        singleSelect: true
    },
    personFirstName: { label: "First name", type: "text" },
    personSurname: { label: "Surname", type: "text" },
    personDob: { label: "Date of birth", type: "date" },
    personIsNdisProvider: {
        label: "Is this person an NDIS provider or do they work for an NDIS provider? (if applicable)",
        type: "checkbox",
        options: ["Yes", "No"],
        singleSelect: true
    },
    personNdisProviderName: { label: "If you answered yes to this question, what is the name of the NDIS provider?", type: "text" },
    personNdisProviderNumber: { label: "If they are an NDIS provider, what is their provider number?", type: "text" },
    personPhone: { label: "Phone", type: "text" },
    personEmail: { label: "Email", type: "email" },
    personAddress: { label: "Address (include street or PO Box number, suburb, state and postcode)", type: "textarea" },
    personRelationship: { label: "Relationship to participant/applicant", type: "text" },

    // Part C (Organisation)
    consentToOrg: {
        label: "I am giving consent to an organisation",
        type: "checkbox",
        options: ["I am giving consent to an organisation"],
        singleSelect: true
    },
    orgName: { label: "Organisation name", type: "text", readOnly: true },
    orgContactFirstName: { label: "Key contact’s first name", type: "text" },
    orgContactSurname: { label: "Key contact’s surname", type: "text" },
    orgContactPosition: { label: "Key contact’s position title (if applicable)", type: "text" },
    orgIsNdisProvider: {
        label: "Is this organisation an NDIS provider?",
        type: "checkbox",
        options: ["Yes", "No"],
        singleSelect: true
    },
    orgProvideSupports: {
        label: "If they are an NDIS provider, do they provide NDIS supports to you?",
        type: "checkbox",
        options: ["Yes", "No"],
        singleSelect: true
    },
    orgProviderNumber: { label: "If they are an NDIS provider, what is their provider number?", type: "text", readOnly: true },
    orgAbn: { label: "ABN", type: "text", readOnly: true },
    orgPhone: {
        label: "Phone",
        type: "select",
        options: ["0493141688", "0493282661", "0493540924"],
        legend: "Staff"
    },
    orgEmail: {
        label: "Email",
        type: "select",
        options: [
            "anand@infinitysupportswa.org",
            "sharon@infinitysupportswa.org",
            "admin@infinitysupportswa.org",
            "sc@infinitysupportswa.org"
        ],
        legend: "Staff"
    },
    orgAddress: { label: "Address (include street or PO Box number, suburb, state and postcode)", type: "textarea", readOnly: true },

    // Part D
    consentTypes: {
        label: "I am providing consent for the person or organisation named in Part C to have the following types of consent. Consent to share information about my:",
        type: "checkbox",
        options: [
            "NDIS contact",
            "assessments and reports",
            "current NDIS plan, including my goals and aspirations",
            "NDIS application outcome",
            "NDIS application form",
            "current NDIS funding",
            "previous NDIS funding",
            "previous NDIS plans, including my goals and aspirations",
            "bank account details",
            "name, date of birth, NDIS participant number and NDIS participant status",
            "address, email and phone number",
            "communication preferences",
            "correspondence preferences – for example, if I prefer to receive NDIS information in an email, letter or over the phone",
            "disability or disabilities that are recorded in the NDIS system",
            "informal supports",
            "service providers",
            "all of the above"
        ]
    },
    consentBehalf: {
        label: "Consent to do these things on my behalf:",
        type: "checkbox",
        options: [
            "submit an NDIS application",
            "submit a request for assistive technology, home modifications, or other specific supports",
            "submit additional information requested by the NDIA",
            "make a complaint or give feedback to the NDIA",
            "tell the NDIA about change in my disability",
            "submit claims for my current plan",
            "ask to review a decision made by the NDIA",
            "ask for a plan change",
            "all of the above"
        ]
    },
    consentChange: {
        label: "Consent to change my:",
        type: "checkbox",
        options: [
            "personal details",
            "communication preferences",
            "correspondence preferences",
            "all of the above"
        ]
    },
    consentOtherCheck: {
        label: "Are there other things you want the person to do on your behalf, or information you want to share:",
        type: "checkbox",
        options: ["If so, please tell us what this is below:"],
        singleSelect: true
    },
    consentOtherDetails: {
        label: "",
        type: "textarea",
        placeholder: "Please tell us what this is...",
        footer: "We’ll do our best to include these other things. If we’re unable to do this, we’ll let you know and explain why."
    },

    // Part E
    consentLength: {
        label: "How long are you giving consent for?",
        type: "checkbox",
        options: [
            "One time only",
            "Until a set date (DD/MM/YYYY):",
            "Ongoing (enduring)"
        ],
        singleSelect: true
    },
    consentEndDate: {
        label: "Set date",
        type: "date"
    },

    // Part F
    signature: {
        label: "Signature",
        type: "signature",
        required: true
    },
    signatoryName: {
        label: "Name",
        type: "text",
        required: true
    },
    signatureDate: {
        label: "Date (DD/MM/YYYY)",
        type: "date",
        required: true
    }
};

interface FormProps {
    formData: any;
    commonFieldsData: any;
    onChange: (values: any, field?: string, isCommon?: boolean) => void;
    onSubmit?: (values: any) => void;
    readOnly?: boolean;
    fieldErrors?: Record<string, string>;
    handleSaveProgress?: () => Promise<void>;
    handleSubmitForm?: () => Promise<void>;
    saving?: boolean;
}

const NDISConsentEdit: React.FC<FormProps> = ({
    formData,
    commonFieldsData,
    onChange,
    readOnly = false,
    fieldErrors = {},
    handleSaveProgress,
    handleSubmitForm,
    saving = false,
}: FormProps) => {
    const { showToast } = useToast();
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
    const [maxStep, setMaxStep] = useState(0);
    const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
    const sigRefs = useRef<Record<string, any>>({});

    const [localValues, setLocalValues] = useState<any>(() => {
        const initial = {
            ...Object.keys(FIELD_METADATA).reduce((acc, key) => ({ ...acc, [key]: "" }), {}),
            orgName: "Infinity Supports WA Pty Ltd",
            orgProviderNumber: "4050126792",
            orgAbn: "45 655 038 074",
            orgAddress: "PO Box 4275 BALDIVIS WA 6171",
            ...formData,
        };

        // Signature Clearing Logic: If form was previously signed, clear it for the new edit session
        if (formData?.signature) {
            initial.signature = "";
            initial.signatureDate = "";
            // We keep signatoryName as it's likely still the same person
        }
        // Helper to format dates specifically for initial state
        const formatDate = (dateStr: string) => {
            if (!dateStr) return "";
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
            const parts = dateStr.split(/[-/]/);
            if (parts.length === 3) {
                const [p1, p2, p3] = parts;
                if (p1.length === 4) return `${p1}-${p2.padStart(2, '0')}-${p3.padStart(2, '0')}`;
                return `${p3}-${p2.padStart(2, '0')}-${p1.padStart(2, '0')}`;
            }
            return dateStr;
        };
        const dateFields = ["participantDob", "repDob", "personDob", "consentEndDate", "signatureDate"];
        dateFields.forEach(field => {
            if (initial[field]) initial[field] = formatDate(initial[field]);
        });
        return initial;
    });

    // Navigation state
    const [navigatingPrev, setNavigatingPrev] = useState(false);
    const [navigatingNext, setNavigatingNext] = useState(false);

    const formatDateForInput = (dateStr: string) => {
        if (!dateStr) return "";
        // Check if it's already in YYYY-MM-DD format
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

        // Try to parse DD-MM-YYYY or DD/MM/YYYY
        const parts = dateStr.split(/[-/]/);
        if (parts.length === 3) {
            const [p1, p2, p3] = parts;
            // If the first part is 4 digits, it's likely YYYY-MM-DD (but failed regex?)
            if (p1.length === 4) return `${p1}-${p2.padStart(2, '0')}-${p3.padStart(2, '0')}`;
            // Otherwise assume DD-MM-YYYY
            return `${p3}-${p2.padStart(2, '0')}-${p1.padStart(2, '0')}`;
        }
        return dateStr;
    }

    // Effect to handle pre-filling Part A from commonFieldsData if localValues are empty
    useEffect(() => {
        const updatedValues = { ...localValues };
        let changed = false;

        // Name
        if (!localValues.participantName && (commonFieldsData?.name || commonFieldsData?.surname)) {
            updatedValues.participantName = `${commonFieldsData.name || ""} ${commonFieldsData.surname || ""}`.trim();
            changed = true;
        }

        // DOB - More aggressive check: pre-fill if empty OR if currently in wrong format
        const rawDob = commonFieldsData?.dob || commonFieldsData?.dateOfBirth;
        if (rawDob) {
            const formattedDob = formatDateForInput(rawDob);
            if (!localValues.participantDob || (localValues.participantDob !== formattedDob && !/^\d{4}-\d{2}-\d{2}$/.test(localValues.participantDob))) {
                updatedValues.participantDob = formattedDob;
                changed = true;
            }
        }
        if (!localValues.ndisNumber && commonFieldsData?.ndis) {
            updatedValues.ndisNumber = commonFieldsData.ndis;
            changed = true;
        }
        if (!localValues.participantAddress && commonFieldsData?.address) {
            updatedValues.participantAddress = commonFieldsData.address;
            changed = true;
        }
        if (!localValues.participantPhone && commonFieldsData?.phone) {
            updatedValues.participantPhone = commonFieldsData.phone;
            changed = true;
        }
        if (!localValues.participantEmail && commonFieldsData?.email) {
            updatedValues.participantEmail = commonFieldsData.email;
            changed = true;
        }

        // Part F defaults
        if (!localValues.signatureDate) {
            updatedValues.signatureDate = new Date().toISOString().split("T")[0];
            changed = true;
        }
        if (!localValues.signatoryName && updatedValues.participantName) {
            updatedValues.signatoryName = updatedValues.participantName;
            changed = true;
        }

        if (changed) {
            setLocalValues(updatedValues);
            onChange(updatedValues);
        }
    }, [commonFieldsData]);

    const isCurrentSectionComplete = () => {
        const section = FORM_SECTIONS[currentStep];
        const requiredFields = [...(section.requiredFields || [])];

        // Dynamic requirements for Consent Length (Part E)
        if (section.id === "partE") {
            if (localValues.consentLength === "Until a set date (DD/MM/YYYY):" && !localValues.consentEndDate) {
                return false;
            }
            return true;
        }

        // Dynamic requirements for Part C (Person NDIS Provider)
        if (section.id === "partC") {
            if (localValues.personIsNdisProvider === "Yes") {
                if (!localValues.personNdisProviderName || !localValues.personNdisProviderNumber) {
                    return false;
                }
            }
        }

        for (const field of requiredFields) {
            const value = localValues[field];
            const isEmpty = Array.isArray(value) ? value.length === 0 : !value;
            if (isEmpty) return false;
        }
        return true;
    };

    const validateField = (name: string, value: any) => {
        const metadata = FIELD_METADATA[name];
        if (!metadata) return null;

        if (value) {
            if (metadata.type === "email") {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    return "Please enter a valid email address";
                }
            }
            if (metadata.type === "text" && name.toLowerCase().includes("phone")) {
                // Basic phone validation (digits, spaces, plus, brackets, hyphens)
                const phoneRegex = /^[0-9\s\+\-\(\)]{8,}$/;
                if (!phoneRegex.test(value)) {
                    return "Please enter a valid phone number";
                }
            }
        }
        return null;
    };

    const handleChange = (name: string, value: any) => {
        let finalValue = value;

        // Numeric Filtering
        const numericFields = ["ndisNumber", "participantPhone", "repPhone", "personPhone", "personNdisProviderNumber"];
        if (numericFields.includes(name)) {
            finalValue = String(value).replace(/[^0-9]/g, '');
        }

        const newValues = { ...localValues, [name]: finalValue };
        setLocalValues(newValues);
        onChange(newValues, name, false);

        // Real-time Validation
        const error = validateField(name, finalValue);
        setLocalErrors(prev => ({
            ...prev,
            [name]: error || ""
        }));
    };

    const adjustHeight = (el: HTMLTextAreaElement) => {
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
    }

    const renderLegend = (name: string) => {
        const meta = FIELD_METADATA[name];
        if (meta?.legend) {
            return (
                <span className="ml-2 px-2 py-0.5 text-[8px] font-extrabold rounded-full bg-azure-50 text-azure-700 border border-azure-100 uppercase tracking-tighter">
                    {meta.legend}
                </span>
            );
        }
        return null;
    };

    const renderInput = (fieldName: string) => {
        const metadata = FIELD_METADATA[fieldName];
        const value = localValues[fieldName] || "";
        let isRequired = FORM_SECTIONS[currentStep].requiredFields.includes(fieldName);

        // Conditional requirement logic
        if (fieldName === "personNdisProviderName" || fieldName === "personNdisProviderNumber") {
            if (localValues.personIsNdisProvider === "Yes") {
                isRequired = true;
            }
        }
        if (fieldName === "consentEndDate") {
            if (localValues.consentLength === "Until a set date (DD/MM/YYYY):") {
                isRequired = true;
            }
        }

        const error = localErrors[fieldName] || fieldErrors[fieldName];

        // Conditional rendering for other details
        if (fieldName === "consentOtherDetails" && localValues.consentOtherCheck !== "If so, please tell us what this is below:") {
            return null;
        }

        // Conditional rendering for Part E date
        if (fieldName === "consentEndDate" && localValues.consentLength !== "Until a set date (DD/MM/YYYY):") {
            return null;
        }
        if (metadata.type === "signature") {
            return (
                <div key={fieldName} className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-xs font-medium text-azure-600 flex items-center">
                        {metadata.label} {isRequired && <span className="text-red-500 ml-1">*</span>}
                        {renderLegend(fieldName)}
                    </label>
                    <SignatureCanvas
                        ref={(el) => { sigRefs.current[fieldName] = el; }}
                        existingSignature={value}
                        onSignatureEnd={(signature: string) => {
                            if (readOnly) return;
                            handleChange(fieldName, signature);
                        }}
                        onSignatureClear={() => {
                            if (readOnly) return;
                            handleChange(fieldName, "");
                        }}
                        disabled={readOnly}
                        height={150}
                    />
                    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                </div>
            );
        }

        if (metadata.type === "checkbox") {
            return (
                <div key={fieldName} className="md:col-span-2 flex flex-col gap-1">
                    <label className={`text-xs font-medium mb-1 flex items-center ${error ? "text-red-500" : "text-azure-600"}`}>
                        {metadata.label} {isRequired && <span className="text-red-500 ml-1">*</span>}
                        {renderLegend(fieldName)}
                    </label>
                    <div className="flex flex-col gap-2 w-full">
                        {metadata.options.map((option: string) => (
                            <label
                                key={option}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-azure-100 shadow-sm transition-all w-full bg-white hover:shadow-md cursor-pointer`}
                                onClick={(e) => {
                                    if (readOnly) return;
                                    if (metadata.singleSelect) {
                                        const newValue = value === option ? "" : option;

                                        if (fieldName === "consentLength") {
                                            const updates: any = { [fieldName]: newValue };
                                            if (newValue === "Until a set date (DD/MM/YYYY):") {
                                                updates.consentEndDate = localValues.consentEndDate || new Date().toISOString().split("T")[0];
                                            } else {
                                                updates.consentEndDate = "";
                                            }
                                            const updatedValues = { ...localValues, ...updates };
                                            setLocalValues(updatedValues);
                                            onChange(updatedValues, fieldName, false);
                                        } else {
                                            handleChange(fieldName, newValue);
                                        }
                                    } else {
                                        const currentOptions: string[] = Array.isArray(value) ? value : [];
                                        let newOptions: string[];
                                        if (option === "all of the above") {
                                            newOptions = currentOptions.includes("all of the above") ? [] : [...(metadata.options as string[])];
                                        } else {
                                            newOptions = currentOptions.includes(option)
                                                ? currentOptions.filter((o: string) => o !== option && o !== "all of the above")
                                                : [...currentOptions, option];
                                            const otherOptions = (metadata.options as string[]).filter((o: string) => o !== "all of the above");
                                            if (otherOptions.every((o: string) => newOptions.includes(o))) {
                                                newOptions = [...(metadata.options as string[])];
                                            }
                                        }
                                        handleChange(fieldName, newOptions);
                                    }
                                }}
                            >
                                <div className={`w-5 h-5 border-2 rounded flex-shrink-0 flex items-center justify-center transition-all ${(metadata.singleSelect ? value === option : (Array.isArray(value) && value.includes(option))) ? "border-azure-700 bg-azure-50" : "border-azure-200"}`}>
                                    {((metadata.singleSelect ? value === option : (Array.isArray(value) && value.includes(option)))) && (
                                        <span className="text-azure-700 font-bold text-xs">X</span>
                                    )}
                                </div>
                                <span className="text-sm text-azure-600">{option}</span>
                            </label>
                        ))}
                    </div>
                    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                </div>
            );
        }

        if (metadata.type === "textarea") {
            return (
                <div key={fieldName} className="md:col-span-2 flex flex-col gap-1">
                    <label className="text-xs font-medium text-azure-600 mb-1 flex items-center">
                        {metadata.label} {isRequired && <span className="text-red-500 ml-1">*</span>}
                        {renderLegend(fieldName)}
                    </label>
                    <textarea
                        value={value}
                        ref={(el) => { if (el) adjustHeight(el); }}
                        onChange={(e) => {
                            adjustHeight(e.target);
                            handleChange(fieldName, e.target.value);
                        }}
                        disabled={readOnly || metadata.readOnly}
                        placeholder={metadata.placeholder || ""}
                        rows={1}
                        className={`w-full rounded-lg border border-azure-100 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all placeholder-azure-300 resize-none overflow-hidden ${error ? "border-red-300 bg-red-50" : (readOnly || metadata.readOnly) ? "bg-azure-100 text-azure-400 cursor-not-allowed" : "bg-white hover:border-gold-300"}`}
                    />
                    {metadata.footer && <p className="text-xs text-azure-400 mt-2 italic px-1">{metadata.footer}</p>}
                    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                </div>
            );
        }

        if (metadata.type === "select") {
            return (
                <div key={fieldName} className="md:col-span-2 flex flex-col gap-1">
                    <label className="text-xs font-medium text-azure-600 mb-1 flex items-center">
                        {metadata.label} {isRequired && <span className="text-red-500 ml-1">*</span>}
                        {renderLegend(fieldName)}
                    </label>
                    <select
                        value={value}
                        onChange={(e) => handleChange(fieldName, e.target.value)}
                        disabled={readOnly || metadata.readOnly}
                        className={`w-full rounded-lg border border-azure-100 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all ${error ? "border-red-300 bg-red-50" : (readOnly || metadata.readOnly) ? "bg-azure-100 text-azure-400 cursor-not-allowed border-azure-100" : "bg-white hover:border-gold-300"}`}
                    >
                        <option value="">Select an option</option>
                        {metadata.options.map((option: string) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                </div>
            );
        }

        return (
            <div key={fieldName} className="md:col-span-2 flex flex-col gap-1">
                <label className="text-xs font-medium text-azure-600 mb-1 flex items-center">
                    {metadata.label} {isRequired && <span className="text-red-500 ml-1">*</span>}
                    {renderLegend(fieldName)}
                </label>
                <input
                    type={metadata.type}
                    value={value}
                    onChange={(e) => handleChange(fieldName, e.target.value)}
                    disabled={readOnly || metadata.readOnly}
                    className={`w-full rounded-lg border border-azure-100 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all ${error ? "border-red-300 bg-red-50" : (readOnly || metadata.readOnly) ? "bg-azure-100 text-azure-400 cursor-not-allowed" : "bg-white hover:border-gold-300"}`}
                />
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>
        );
    };

    const handleNextSequential = async () => {
        if (!isCurrentSectionComplete()) {
            showToast({
                type: "error",
                title: "Incomplete Section",
                message: "Please fill in all required fields before proceeding.",
                duration: 3000,
            });
            return;
        }

        setNavigatingNext(true);
        if (handleSaveProgress) {
            try {
                await handleSaveProgress();
            } catch (err) {
                console.error("Auto-save failed:", err);
            }
        }

        if (currentStep < FORM_SECTIONS.length - 1) {
            setCompletedSteps(prev => new Set(prev).add(currentStep));
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);
            if (nextStep > maxStep) setMaxStep(nextStep);
            window.scrollTo(0, 0);
        }
        setNavigatingNext(false);
    };

    const handlePreviousSequential = () => {
        if (currentStep > 0) {
            setNavigatingPrev(true);
            setCurrentStep(currentStep - 1);
            window.scrollTo(0, 0);
            setNavigatingPrev(false);
        }
    };

    const handleFinalSubmit = async () => {
        if (!isCurrentSectionComplete()) {
            showToast({
                type: "error",
                title: "Incomplete Form",
                message: "Please fill in all required fields before submitting.",
                duration: 3000,
            });
            return;
        }

        if (handleSubmitForm) {
            await handleSubmitForm();
        }
    };

    return (
        <div className="min-h-screen pb-12">
            {/* Progress Bar & Stepper */}
            <div className="w-full max-w-2xl mx-auto pt-6 px-4">
                <div className="w-full h-2 bg-azure-200 rounded-full mb-6">
                    <div
                        className="h-2 bg-gradient-to-r from-azure-600 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${((currentStep + 1) / FORM_SECTIONS.length) * 100}%` }}
                    />
                </div>

                <nav className="flex items-center justify-between gap-1 overflow-visible pb-4 relative">
                    {FORM_SECTIONS.map((section: any, idx: number) => {
                        const active = idx === currentStep;
                        const unlocked = idx <= maxStep;
                        const completed = completedSteps.has(idx);

                        return (
                            <div key={section.id} className="relative flex flex-col items-center group">
                                <button
                                    type="button"
                                    onClick={() => unlocked && setCurrentStep(idx)}
                                    disabled={!unlocked}
                                    className={`flex flex-col items-center min-w-[50px] focus:outline-none transition-all duration-200 ${active ? 'text-azure-700' : unlocked ? 'text-emerald-600' : 'text-azure-300 opacity-50 cursor-not-allowed'}`}
                                >
                                    <span className={`flex items-center justify-center w-8 h-8 rounded-full border-2 mb-1 transition-all duration-300 ${active ? 'bg-azure-800 border-azure-600 text-white scale-110 shadow-lg' : completed ? 'bg-emerald-500 border-emerald-500 text-white' : unlocked ? 'bg-white border-gold-300 text-azure-600' : 'bg-azure-100 border-azure-200 text-azure-300'}`}>
                                        {completed ? <FaCheck className="w-3 h-3" /> : React.createElement(section.icon, { className: "w-3 h-3" })}
                                    </span>
                                    <span className="text-[10px] font-bold">{idx + 1}</span>
                                    {!unlocked && <span className="text-[9px] text-azure-300 font-medium">Locked</span>}
                                </button>

                                {/* Tooltip */}
                                <div className="absolute left-1/2 -translate-x-1/2 top-14 z-20 hidden group-hover:flex flex-col items-center pointer-events-none">
                                    <span className="bg-azure-700 text-white text-[10px] rounded px-2 py-1 shadow-xl whitespace-nowrap">
                                        {section.title}
                                    </span>
                                    <span className="w-1.5 h-1.5 bg-azure-700 rotate-45 mt-[-3px]"></span>
                                </div>
                            </div>
                        );
                    })}
                </nav>
            </div>

            <main className="w-full flex flex-col items-center justify-center pt-2 px-4">
                <section className="w-full max-w-2xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-azure-50 p-6 md:p-10 flex flex-col gap-6">
                    <div>
                        <h2 className="text-2xl font-bold text-[#5B2C6F] flex items-center gap-3">
                            {React.createElement(FORM_SECTIONS[currentStep].icon, { className: "w-7 h-7 text-[#5B2C6F]" })}
                            {FORM_SECTIONS[currentStep].title}
                        </h2>
                        <p className="text-sm text-azure-400 font-semibold mt-1.5">{FORM_SECTIONS[currentStep].description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {FORM_SECTIONS[currentStep].fields.map(fieldName => renderInput(fieldName))}
                    </div>
                </section>

                <footer className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-lg border-t border-azure-50 px-6 py-6 flex flex-col items-center gap-4 shadow-2xl rounded-b-3xl mt-4">
                    <div className="flex flex-col w-full gap-3 md:flex-row md:justify-between items-center">
                        <button
                            onClick={handlePreviousSequential}
                            disabled={currentStep === 0 || navigatingPrev}
                            className={`flex items-center justify-center gap-2 px-8 py-2.5 rounded-full font-bold transition-all text-sm shadow-md border duration-200 w-full md:w-auto min-w-[140px] ${currentStep === 0 || navigatingPrev ? "bg-azure-100 text-azure-300 cursor-not-allowed border-azure-100" : "bg-azure-700 text-white hover:bg-azure-800 border-azure-700 active:scale-95"}`}
                        >
                            <FaChevronLeft className="w-3.5 h-3.5" />
                            <span>Previous</span>
                        </button>

                        <button
                            onClick={handleNextSequential}
                            disabled={currentStep === FORM_SECTIONS.length - 1 || !isCurrentSectionComplete() || navigatingNext}
                            className={`flex items-center justify-center gap-2 px-10 py-2.5 rounded-full font-bold transition-all text-sm shadow-lg border duration-300 w-full md:w-auto min-w-[160px] ${currentStep === FORM_SECTIONS.length - 1 || !isCurrentSectionComplete() || navigatingNext ? "bg-azure-200 text-azure-300 cursor-not-allowed border-azure-200" : "bg-gradient-to-r from-azure-700 to-emerald-400 text-white hover:shadow-gold border-transparent active:scale-95"}`}
                        >
                            <span>Next</span>
                            <FaChevronRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                            onClick={() => handleSaveProgress?.()}
                            disabled={saving}
                            className="flex items-center justify-center gap-2 px-8 py-2.5 rounded-full font-bold text-sm bg-azure-600 hover:bg-azure-700 text-white shadow-md border border-azure-600 transition-all duration-200 w-full md:w-auto min-w-[140px] active:scale-95"
                        >
                            {saving ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaSave className="w-4 h-4" />}
                            <span>Save Progress</span>
                        </button>
                    </div>

                    {currentStep === FORM_SECTIONS.length - 1 && (
                        <button
                            onClick={handleFinalSubmit}
                            disabled={!isCurrentSectionComplete() || saving}
                            className={`w-full mt-2 flex items-center justify-center gap-3 px-6 py-3 rounded-full font-bold text-base shadow-xl transition-all duration-300 ${!isCurrentSectionComplete() || saving
                                ? "bg-azure-100 text-azure-300 cursor-not-allowed border border-azure-100"
                                : "bg-gradient-to-r from-azure-600 to-emerald-500 text-white hover:shadow-soft active:scale-[0.98]"
                                }`}
                        >
                            {saving ? <FaSpinner className="w-5 h-5 animate-spin" /> : <FaCheck className="w-5 h-5" />}
                            <span>{saving ? "Submitting..." : "Submit Form"}</span>
                        </button>
                    )}
                </footer>
            </main>
        </div>
    );
};

export default NDISConsentEdit;
