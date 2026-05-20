"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    FaUser,
    FaUsers,
    FaClipboardList,
    FaExclamationTriangle,
    FaCalendarAlt,
    FaMoneyBillWave,
    FaExchangeAlt,
    FaPenNib,
    FaChevronLeft,
    FaChevronRight,
    FaSave,
    FaSpinner,
    FaCheck
} from "react-icons/fa";
import { useToast } from "@/components/ui/Toast";
import SignatureCanvas from "@/components/ui/SignatureCanvas";
import AutoResizeTextArea from "@/components/ui/AutoResizeTextArea";

export const FORM_SECTIONS = [
    {
        id: "partA",
        title: "Part A: Person’s details",
        icon: FaUser,
        description: "Details of the participant or applicant",
        fields: ["fullName", "dob", "ndisNumber", "contactDetails"],
        requiredFields: ["fullName", "dob", "ndisNumber", "contactDetails"]
    },
    {
        id: "partB",
        title: "Part B: Third party details",
        icon: FaUsers,
        description: "If completing on behalf of someone else (Optional)",
        fields: ["thirdPartyName", "thirdPartyDob", "thirdPartyPhone", "thirdPartyRelationship"],
        requiredFields: []
    },
    {
        id: "partC",
        title: "Part C: Information about what has changed",
        icon: FaClipboardList,
        description: "Mark the boxes that apply to you",
        fields: ["changes"],
        requiredFields: ["changes"]
    },
    {
        id: "partD",
        title: "Part D: Your contact details have changed",
        icon: FaClipboardList,
        description: "Complete if your contact details have changed",
        fields: ["newAddress", "newPhone", "newEmail", "changeType", "partD_startDate", "partD_endDate"],
        requiredFields: []
    },
    {
        id: "partE",
        title: "Part E: My plan has an error",
        icon: FaExclamationTriangle,
        description: "Complete if your plan has an error",
        fields: ["errorDescription"],
        requiredFields: []
    },
    {
        id: "partF",
        title: "Part F: Reassessment date change",
        icon: FaCalendarAlt,
        description: "I would like the reassessment date of my plan changed",
        fields: ["reassessmentDateType", "reassessmentReason"],
        requiredFields: []
    },
    {
        id: "partG",
        title: "Part G: Funding management change",
        icon: FaMoneyBillWave,
        description: "I want to change how the funding is managed in my plan",
        fields: [
            "partG_Label1", "rpm_Managed", "rpm_Details",
            "partG_Label2", "sm_Managed", "sm_Details",
            "partG_Label3", "agency_Managed", "agency_Details"
        ],
        requiredFields: []
    },
    {
        id: "partH",
        title: "Part H: My situation has changed",
        icon: FaExchangeAlt,
        description: "Complete if your situation has changed",
        fields: [
            "situationChangeType", "planChangeRequest",
            "changeDescription", "changeReason", "otherSupports",
            "additionalInfo", "additionalInfoDetails",
            "partH_startDate", "partH_endDate"
        ],
        requiredFields: []
    },
    {
        id: "partI",
        title: "Part I: Your declaration",
        icon: FaPenNib,
        description: "Please sign here to give your consent",
        fields: ["declarationName", "signature", "partI_declarationDate"],
        requiredFields: ["declarationName", "signature", "partI_declarationDate"]
    }
];

const FIELD_METADATA: Record<string, any> = {
    // Part A
    fullName: { label: "Full name", type: "text", required: true },
    dob: { label: "Date of birth (DD/MM/YYYY)", type: "date", required: true },
    ndisNumber: { label: "NDIS number", type: "text", required: true },
    contactDetails: { label: "Preferred contact details (phone number, email address, etc.)", type: "textarea", required: true },

    // Part B
    thirdPartyName: { label: "Full name", type: "text" },
    thirdPartyDob: { label: "Date of birth (DD/MM/YYYY)", type: "date" },
    thirdPartyPhone: {
        label: "Contact phone number",
        type: "tel",
        pattern: "^[+]?([0-9][- .]?){7,14}[0-9]$|^[0-9]{8,15}$",
        patternError: "Please enter a valid phone number (e.g. 0412 345 678)"
    },
    thirdPartyRelationship: {
        label: "Relationship to Person in Part A",
        type: "textarea",
        placeholder: "for example: child representative, advocate, nominee"
    },

    // Part C
    changes: {
        label: "Mark the boxes that apply to you:",
        type: "checkbox",
        options: [
            "My contact details have changed – Go to Part D",
            "My plan has an error – Go to Part E",
            "I would like the reassessment date of my plan changed – Go to Part F",
            "I want to change how the funding is managed in my plan – Go to Part G",
            "My situation has changed – Go to Part H"
        ],
        singleSelect: true
    },

    // Part D
    newAddress: { label: "New address (Include number, street, suburb, state, postcode and country.)", type: "textarea" },
    newPhone: {
        label: "New phone number",
        type: "tel",
        pattern: "^[+]?([0-9][- .]?){7,14}[0-9]$|^[0-9]{8,15}$",
        patternError: "Please enter a valid phone number (e.g. 0412 345 678)"
    },
    newEmail: {
        label: "New email",
        type: "email",
        pattern: "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$",
        patternError: "Please enter a valid email address (e.g. name@example.com)"
    },
    changeType: {
        label: "Permanent or temporary change",
        type: "checkbox",
        options: ["Permanent", "Temporary"],
        singleSelect: true
    },
    partD_startDate: { label: "Start date", type: "date" },
    partD_endDate: { label: "End date (temporary changes only)", type: "date" },

    // Part E
    errorDescription: { label: "Describe the error", type: "textarea" },

    // Part F
    reassessmentDateType: {
        label: "How would you like your reassessment date changed?",
        type: "checkbox",
        options: ["Extended", "Shortened"]
    },
    reassessmentReason: { label: "Describe why your reassessment date needs changing", type: "textarea" },

    // Part G
    partG_Label1: { label: "I would like a registered plan manager to manage these supports:", type: "section_label", description: "You’ll need to agree to provide your registered plan manager with a copy of your plan." },
    rpm_Managed: {
        label: "Select supports:",
        type: "checkbox",
        options: ["All supports", "Specific supports - please list supports below:"]
    },
    rpm_Details: { label: "List specific supports for Plan Manager", type: "textarea" },

    partG_Label2: { label: "I would like to self-manage these supports:", type: "section_label" },
    sm_Managed: {
        label: "Select supports:",
        type: "checkbox",
        options: ["All supports", "Specific supports - please list supports below:"]
    },
    sm_Details: { label: "List specific supports for Self-Management", type: "textarea" },

    partG_Label3: { label: "I would like the Agency to manage these supports:", type: "section_label" },
    agency_Managed: {
        label: "Select supports:",
        type: "checkbox",
        options: ["All supports", "Specific supports - please list supports below:"]
    },
    agency_Details: { label: "List specific supports for Agency", type: "textarea" },

    // Part H
    situationChangeType: {
        label: "Type of change - select any that apply",
        type: "checkbox",
        options: [
            "There have been small changes to my situation",
            "There have been large changes to my situation",
            "I need more or different supports urgently"
        ]
    },
    planChangeRequest: {
        label: "What type of plan change are you requesting?",
        type: "checkbox",
        options: [
            "Plan Variation",
            "Plan Reassessment",
            "Not sure. If you’re not sure, we will contact you to discuss your situation."
        ]
    },
    changeDescription: { label: "Describe what has changed with your situation?", type: "textarea" },
    changeReason: { label: "Why does this change mean your current funded supports no longer meet your needs?", type: "textarea" },
    otherSupports: { label: "What other funded supports are you asking to be included in your plan?", type: "textarea" },
    additionalInfo: {
        label: "Do you have any additional information?",
        type: "checkbox",
        options: ["Yes", "No"],
        singleSelect: true
    },
    additionalInfoDetails: {
        label: "If yes, please attach your information when you return this form (or describe here)",
        type: "textarea"
    },
    partH_startDate: { label: "Start date of this change", type: "date" },
    partH_endDate: {
        label: "End date",
        type: "checkbox",
        options: ["Under 1 month", "Under 3 months", "Under 6 months", "Permanent"],
        singleSelect: true
    },

    // Part I
    declarationName: { label: "Full name", type: "text", required: true },
    signature: { label: "Signature", type: "signature", required: true },
    partI_declarationDate: { label: "Date (DD/MM/YYYY)", type: "date", required: true }
};

interface FormProps {
    formData: any;
    commonFieldsData: any;
    onChange?: (values: any, field?: string, isCommon?: boolean) => void;
    onSubmit?: (values: any) => void;
    readOnly?: boolean;
    fieldErrors?: Record<string, string>;
    handleSaveProgress?: () => Promise<void>;
    handleSubmitForm?: () => Promise<void>;
    saving?: boolean;
}

const ChangeOfDetailsEdit: React.FC<FormProps> = ({
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
            ...formData,
        };

        // Signature Clearing Logic
        if (formData?.signature) {
            initial.signature = "";
            initial.declarationDate = "";
        }

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

        const dateFields = ["dob", "thirdPartyDob", "partD_startDate", "partD_endDate", "partH_startDate", "partI_declarationDate"];
        dateFields.forEach(field => {
            if (initial[field]) initial[field] = formatDate(initial[field]);
        });

        return initial;
    });

    const [navigatingPrev, setNavigatingPrev] = useState(false);
    const [navigatingNext, setNavigatingNext] = useState(false);

    // Auto-fill Part A
    useEffect(() => {
        const updatedValues = { ...localValues };
        let changed = false;

        if (!localValues.fullName && (commonFieldsData?.name || commonFieldsData?.surname)) {
            updatedValues.fullName = `${commonFieldsData.name || ""} ${commonFieldsData.surname || ""}`.trim();
            changed = true;
        }

        const rawDob = commonFieldsData?.dob || commonFieldsData?.dateOfBirth;
        if (rawDob) {
            const formatDateForInput = (dateStr: string) => {
                if (!dateStr) return "";
                if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
                const parts = dateStr.split(/[-/]/);
                if (parts.length === 3) {
                    const [p1, p2, p3] = parts;
                    if (p1.length === 4) return `${p1}-${p2.padStart(2, '0')}-${p3.padStart(2, '0')}`;
                    return `${p3}-${p2.padStart(2, '0')}-${p1.padStart(2, '0')}`;
                }
                return dateStr;
            }
            const formattedDob = formatDateForInput(rawDob);
            if (!localValues.dob || (localValues.dob !== formattedDob && !/^\d{4}-\d{2}-\d{2}$/.test(localValues.dob))) {
                updatedValues.dob = formattedDob;
                changed = true;
            }
        }

        if (!localValues.ndisNumber && commonFieldsData?.ndis) {
            updatedValues.ndisNumber = commonFieldsData.ndis;
            changed = true;
        }

        const contacts = [];
        if (commonFieldsData?.phone) contacts.push(`Phone: ${commonFieldsData.phone}`);
        if (commonFieldsData?.email) contacts.push(`Email: ${commonFieldsData.email}`);

        if (!localValues.contactDetails && contacts.length > 0) {
            updatedValues.contactDetails = contacts.join(", ");
            changed = true;
        }

        // Auto-fill declaration name
        if (!localValues.declarationName && updatedValues.fullName) {
            updatedValues.declarationName = updatedValues.fullName;
            changed = true;
        }

        if (!localValues.partI_declarationDate) {
            updatedValues.partI_declarationDate = new Date().toISOString().split("T")[0];
            changed = true;
        }

        if (changed) {
            setLocalValues(updatedValues);
            if (onChange && !readOnly) {
                onChange(updatedValues);
            }
        }
    }, [commonFieldsData]);

    const handleChange = (name: string, value: any) => {
        const newValues = { ...localValues, [name]: value };

        // Data Clearing Logic: Reset Parts D-H if Part C selection changes
        if (name === "changes") {
            const conditionalSections = FORM_SECTIONS.slice(3, 8); // Parts D to H
            conditionalSections.forEach(section => {
                section.fields.forEach(field => {
                    // Skip if the field is not in FIELD_METADATA (like section labels)
                    if (!FIELD_METADATA[field]) return;

                    const metadata = FIELD_METADATA[field];
                    if (metadata.type === "checkbox" && !metadata.singleSelect) {
                        newValues[field] = [];
                    } else {
                        newValues[field] = "";
                    }
                });
            });
        }

        // Logic for Part H: Clear details if additionalInfo is "No"
        if (name === "additionalInfo" && value === "No") {
            newValues.additionalInfoDetails = "";
        }

        setLocalValues(newValues);
        if (onChange) {
            onChange(newValues, name, false);
        }

        if (localErrors[name]) {
            setLocalErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const adjustHeight = (el: HTMLTextAreaElement) => {
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
    }

    const isCurrentSectionComplete = () => {
        const section = FORM_SECTIONS[currentStep];
        const requiredFields = section.requiredFields || [];
        const newErrors: Record<string, string> = {};
        let isValid = true;

        // Check required fields
        for (const field of requiredFields) {
            const value = localValues[field];
            if (!value || (Array.isArray(value) && value.length === 0)) {
                newErrors[field] = "This field is required";
                isValid = false;
            }
        }

        // Check patterns for all fields in current section (if filled)
        section.fields.forEach(field => {
            const metadata = FIELD_METADATA[field];
            const value = localValues[field];
            if (metadata && metadata.pattern && value) {
                const regex = new RegExp(metadata.pattern);
                if (!regex.test(value)) {
                    newErrors[field] = metadata.patternError || "Invalid format";
                    isValid = false;
                }
            }
        });

        // Conditional validation for Part D
        if (section.id === "partD") {
            if (localValues.changeType === "Temporary") {
                if (!localValues.partD_startDate) {
                    newErrors.partD_startDate = "Start date is required for temporary changes";
                    isValid = false;
                }
                if (!localValues.partD_endDate) {
                    newErrors.partD_endDate = "End date is required for temporary changes";
                    isValid = false;
                }
            }
        }

        // Conditional validation for Part H
        if (section.id === "partH") {
            if (localValues.additionalInfo === "Yes") {
                if (!localValues.additionalInfoDetails) {
                    newErrors.additionalInfoDetails = "Please describe your additional information";
                    isValid = false;
                }
            }
        }

        if (!isValid) {
            setLocalErrors(newErrors);
        } else {
            setLocalErrors({});
        }

        return isValid;
    };

    const isFieldRequired = (fieldName: string) => {
        const section = FORM_SECTIONS[currentStep];
        if (section.requiredFields.includes(fieldName)) return true;

        if (section.id === "partD" && localValues.changeType === "Temporary") {
            if (fieldName === "partD_startDate" || fieldName === "partD_endDate") return true;
        }

        if (section.id === "partH" && localValues.additionalInfo === "Yes") {
            if (fieldName === "additionalInfoDetails") return true;
        }

        return false;
    };

    const getTargetStep = (selection: string) => {
        if (selection.includes("Part D")) return 3;
        if (selection.includes("Part E")) return 4;
        if (selection.includes("Part F")) return 5;
        if (selection.includes("Part G")) return 6;
        if (selection.includes("Part H")) return 7;
        return null;
    };

    const handleNext = async () => {
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

        let nextStep = currentStep + 1;

        if (currentStep === 2) { // Part C
            const selection = localValues.changes;
            const target = getTargetStep(selection);
            if (target !== null) {
                nextStep = target;
            }
        } else if (currentStep >= 3 && currentStep <= 7) {
            nextStep = 8; // Jump to Part I
        }

        if (currentStep < FORM_SECTIONS.length - 1) {
            setCompletedSteps(prev => new Set(prev).add(currentStep));
            setCurrentStep(nextStep);
            setMaxStep(prev => Math.max(prev, nextStep));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        setTimeout(() => setNavigatingNext(false), 300);
    };

    const handleBack = () => {
        setNavigatingPrev(true);
        if (currentStep > 0) {
            let prevStep = currentStep - 1;

            if (currentStep === 8) { // Part I
                const selection = localValues.changes || "";
                const target = getTargetStep(selection);
                if (target !== null) {
                    prevStep = target;
                }
            } else if (currentStep >= 3 && currentStep <= 7) {
                prevStep = 2; // Return to Part C
            }

            setCurrentStep(prevStep);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        setTimeout(() => setNavigatingPrev(false), 300);
    };

    const renderInput = (fieldName: string) => {
        const metadata = FIELD_METADATA[fieldName];
        const value = localValues[fieldName] || "";
        const isRequired = isFieldRequired(fieldName);
        const error = localErrors[fieldName] || fieldErrors[fieldName];

        if (metadata.type === "signature") {
            return (
                <div key={fieldName} className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-xs font-medium text-azure-600 flex items-center">
                        {metadata.label} {isRequired && <span className="text-red-500 ml-1">*</span>}
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
                    </label>
                    <div className="flex flex-col gap-2 w-full">
                        {metadata.options.map((option: string) => {
                            const isSelected = metadata.singleSelect ? value === option : (Array.isArray(value) && value.includes(option));
                            return (
                                <label
                                    key={option}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-azure-100 shadow-sm transition-all w-full bg-white hover:shadow-md cursor-pointer`}
                                    onClick={() => {
                                        if (readOnly) return;
                                        if (metadata.singleSelect) {
                                            handleChange(fieldName, value === option ? "" : option);
                                        } else {
                                            const currentOptions = Array.isArray(value) ? value : [];
                                            const newOptions = currentOptions.includes(option)
                                                ? currentOptions.filter(o => o !== option)
                                                : [...currentOptions, option];
                                            handleChange(fieldName, newOptions);
                                        }
                                    }}
                                >
                                    <div className={`w-5 h-5 border-2 rounded flex-shrink-0 flex items-center justify-center transition-all ${isSelected ? "border-azure-700 bg-azure-50" : "border-azure-200"}`}>
                                        {isSelected && <span className="text-azure-700 font-bold text-xs">X</span>}
                                    </div>
                                    <span className="text-sm text-azure-600">{option}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            );
        }

        if (metadata.type === "textarea") {
            return (
                <div key={fieldName} className="md:col-span-2 flex flex-col gap-1">
                    <label className="text-xs font-medium text-azure-600 mb-1 flex items-center">
                        {metadata.label} {isRequired && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <AutoResizeTextArea
                        value={value}
                        onChange={(e) => handleChange(fieldName, e.target.value)}
                        disabled={readOnly}
                        placeholder={metadata.placeholder || "Click or tap here to enter text."}
                        className={`w-full rounded-lg border border-azure-100 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all placeholder-azure-300 resize-none overflow-hidden ${error ? "border-red-300 bg-red-50" : readOnly ? "bg-azure-100 text-azure-400 cursor-not-allowed" : "bg-white hover:border-gold-300"}`}
                    />
                    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                </div>
            );
        }

        if (metadata.type === "date") {
            return (
                <div key={fieldName} className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-azure-600 flex items-center">
                        {metadata.label} {isRequired && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <input
                        type="date"
                        value={value}
                        onChange={(e) => handleChange(fieldName, e.target.value)}
                        disabled={readOnly}
                        className={`w-full p-2 border rounded-md text-sm transition-colors ${error ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-azure-100 focus:border-azure-600 focus:ring-gold-100"} focus:outline-none focus:ring-2 shadow-sm`}
                    />
                    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                </div>
            );
        }

        if (metadata.type === "section_label") {
            return (
                <div key={fieldName} className="md:col-span-2 mt-4 mb-2">
                    <h3 className="text-sm font-bold text-azure-700 border-b border-azure-100 pb-2">
                        {metadata.label}
                    </h3>
                    {metadata.description && (
                        <p className="text-xs text-azure-400 mt-1">{metadata.description}</p>
                    )}
                </div>
            );
        }

        return (
            <div key={fieldName} className="md:col-span-2 flex flex-col gap-1">
                <label className="text-xs font-medium text-azure-600 flex items-center">
                    {metadata.label} {isRequired && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                    type={metadata.type}
                    value={value}
                    onChange={(e) => handleChange(fieldName, e.target.value)}
                    placeholder="Click or tap here to enter text."
                    disabled={readOnly}
                    className={`w-full rounded-lg border border-azure-100 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all placeholder-azure-300 ${error ? "border-red-300 bg-red-50" : readOnly ? "bg-azure-100 text-azure-400 cursor-not-allowed" : "bg-white hover:border-gold-300"}`}
                />
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>
        );
    };

    const isStepInPath = (idx: number) => {
        if (idx <= 2 || idx === 8) return true;
        const selection = localValues.changes || "";
        const target = getTargetStep(selection);
        return idx === target;
    };

    const pathSteps = FORM_SECTIONS.filter((_, idx) => isStepInPath(idx));
    const currentPathIndex = pathSteps.map(s => FORM_SECTIONS.indexOf(s)).indexOf(currentStep);

    return (
        <div className="min-h-screen pb-12">
            <div className="w-full max-w-2xl mx-auto pt-6 px-4">
                <div className="w-full h-2 bg-azure-200 rounded-full mb-6">
                    <div
                        className="h-2 bg-gradient-to-r from-azure-600 to-green-400 rounded-full transition-all duration-500"
                        style={{ width: `${((currentPathIndex + 1) / pathSteps.length) * 100}%` }}
                    />
                </div>

                <nav className="flex items-center justify-between gap-1 overflow-visible pb-4 relative">
                    {FORM_SECTIONS.map((section, idx) => {
                        if (!isStepInPath(idx)) return null;
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
                                </button>

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
                        <h2 className="text-2xl font-bold text-azure-700 flex items-center gap-3">
                            {React.createElement(FORM_SECTIONS[currentStep].icon, { className: "w-7 h-7 text-azure-700" })}
                            {FORM_SECTIONS[currentStep].title}
                        </h2>
                        <p className="text-sm text-azure-400 font-semibold mt-1.5">{FORM_SECTIONS[currentStep].description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {FORM_SECTIONS[currentStep].fields.map(fieldName => {
                            // Conditional visibility for Part H
                            if (fieldName === "additionalInfoDetails" && localValues.additionalInfo !== "Yes") {
                                return null;
                            }
                            return renderInput(fieldName);
                        })}
                    </div>
                </section>

                <footer className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-lg border-t border-azure-50 px-6 py-6 flex flex-col items-center gap-4 shadow-2xl rounded-b-3xl mt-4">
                    <div className="flex flex-col w-full gap-3 md:flex-row md:justify-between items-center">
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 0 || navigatingPrev}
                            className={`flex items-center justify-center gap-2 px-8 py-2.5 rounded-full font-bold transition-all text-sm shadow-md border duration-200 w-full md:w-auto min-w-[140px] ${currentStep === 0 || navigatingPrev ? "bg-azure-100 text-azure-300 cursor-not-allowed border-azure-100" : "bg-azure-700 text-white hover:bg-azure-800 border-azure-700 active:scale-95"}`}
                        >
                            <FaChevronLeft className="w-3.5 h-3.5" />
                            <span>Previous</span>
                        </button>

                        <button
                            onClick={handleNext}
                            disabled={currentStep === FORM_SECTIONS.length - 1 || navigatingNext}
                            className={`flex items-center justify-center gap-2 px-10 py-2.5 rounded-full font-bold transition-all text-sm shadow-lg border duration-300 w-full md:w-auto min-w-[160px] ${currentStep === FORM_SECTIONS.length - 1 || navigatingNext ? "bg-azure-200 text-azure-300 cursor-not-allowed border-azure-200" : "bg-gradient-to-r from-azure-700 to-emerald-400 text-white hover:shadow-gold border-transparent active:scale-95"}`}
                        >
                            <span>Next</span>
                            <FaChevronRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                            onClick={() => handleSaveProgress?.()}
                            disabled={saving || readOnly}
                            className="flex items-center justify-center gap-2 px-8 py-2.5 rounded-full font-bold text-sm bg-azure-600 hover:bg-azure-700 text-white shadow-md border border-azure-600 transition-all duration-200 w-full md:w-auto min-w-[140px] active:scale-95"
                        >
                            {saving ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaSave className="w-4 h-4" />}
                            <span>{saving ? "Saving..." : "Save Progress"}</span>
                        </button>
                    </div>

                    {currentStep === FORM_SECTIONS.length - 1 && (
                        <button
                            onClick={handleSubmitForm}
                            disabled={saving}
                            className={`w-full mt-2 flex items-center justify-center gap-3 px-6 py-3 rounded-full font-bold text-base shadow-xl transition-all duration-300 ${saving
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

export default ChangeOfDetailsEdit;
