"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    FaUser,
    FaBuilding,
    FaUserTie,
    FaExclamationTriangle,
    FaChevronLeft,
    FaChevronRight,
    FaCheck,
    FaSave,
    FaSpinner,
    FaClipboardList,
    FaPenNib,
} from "react-icons/fa";
import SignatureCanvas from "@/components/ui/SignatureCanvas";
import { useToast } from "@/components/ui/Toast";

export const FORM_SECTIONS = [
    {
        id: "participantDetails",
        title: "Participant Details",
        icon: FaUser,
        description: "Details of the participant (Read-only from database)",
        fields: ["participantName", "dob", "ndisNumber", "residentialAddress", "contactPhone", "contactEmail"],
        requiredFields: [] // Read only
    },
    {
        id: "providerDetails",
        title: "Provider Details",
        icon: FaBuilding,
        description: "Details of the provider",
        fields: ["orgName", "providerNo", "providerAddress", "providerContactEmail", "providerContactPhone"],
        requiredFields: ["providerContactEmail", "providerContactPhone"]
    },
    {
        id: "employeeDetails",
        title: "Employee Details",
        icon: FaUserTie,
        description: "Details of the employee declaring conflict",
        fields: ["employeeName", "employeeRelationship", "employeePosition", "employeePhone", "employeeEmail"],
        requiredFields: ["employeeName", "employeeRelationship", "employeePosition", "employeePhone", "employeeEmail"]
    },
    {
        id: "conflictIdentification",
        title: "Identification of Conflict",
        icon: FaExclamationTriangle,
        description: "Section C: Identification of the conflict of interest",
        fields: ["conflictIdentifiedDate", "conflictType", "conflictRelatesTo", "conflictNature", "conflictDescription", "participantConcerns", "conflictAvoidable"],
        requiredFields: ["conflictIdentifiedDate", "conflictType", "conflictRelatesTo", "conflictNature", "conflictDescription", "participantConcerns", "conflictAvoidable"]
    },
    {
        id: "providerManagementPlan",
        title: "Provider Management Plan",
        icon: FaClipboardList,
        description: "Section D: Provider management plan",
        fields: ["conflictRisks", "alternativeOptions", "managementAction", "managementPlan", "discussedWith"],
        requiredFields: ["conflictRisks", "alternativeOptions", "managementAction", "managementPlan", "discussedWith"]
    },
    {
        id: "participant_declaration",
        title: "Acknowledgement - Participant",
        icon: FaPenNib,
        description: "Section E: Participant / Authorised Person Declaration",
        fields: [
            "participantAck",
            "participantSignerType",
            "participantName", "participantSignature", "participantSignDate",
            "authRepName", "authRepSignature", "authRepSignDate",
        ],
        requiredFields: [
            "participantAck",
            "participantSignerType"
            // Signature fields made conditional
        ]
    },
    {
        id: "employee_declaration",
        title: "Declaration - Employee/Provider",
        icon: FaUserTie,
        description: "Section F: Employee and Provider Declaration",
        fields: [
            "employeeProvided",
            "employeeAck",
            "reviewPeriod",
            "employeePrivacyAck",
            "employeeName", "employeeSignature", "employeeSignDate",
            "managerName", "managerSignature", "managerSignDate"
        ],
        requiredFields: [
            "employeeProvided", "employeeAck", "reviewPeriod", "employeePrivacyAck",
            "employeeSignature", "employeeSignDate",
            "managerName", "managerSignature", "managerSignDate"
        ]
    }
];

const FIELD_METADATA: Record<string, any> = {
    participantName: { label: "Full Name", type: "text" },
    dob: { label: "Date of Birth (DD/MM/YYYY)", type: "date" },
    ndisNumber: { label: "NDIS Number", type: "text" },
    residentialAddress: { label: "Residential Address", type: "text" },
    contactPhone: { label: "Contact Phone Number", type: "text" },
    contactEmail: { label: "Contact Email", type: "email" },

    orgName: { label: "Organisation Name", type: "text", readOnly: true },
    providerNo: { label: "Provider No", type: "text", readOnly: true },
    providerAddress: { label: "Address", type: "text", readOnly: true },
    providerContactEmail: {
        label: "Contact Email",
        type: "dropdown",
        options: [
            "anand@infinitysupportswa.org",
            "sharon@infinitysupportswa.org",
            "admin@infinitysupportswa.org",
            "sc@infinitysupportswa.org"
        ]
    },
    providerContactPhone: {
        label: "Contact Phone Number",
        type: "dropdown",
        options: [
            "0493141688",
            "0493282661",
            "0419097777"
        ]
    },

    employeeName: { label: "Full Name", type: "text" },
    employeeRelationship: { label: "Relationship to Participant", type: "text" },
    employeePosition: { label: "Job Title or Position", type: "text" },
    employeePhone: { label: "Contact Phone Number", type: "text" },
    employeeEmail: { label: "Contact Email", type: "email" },

    conflictIdentifiedDate: { label: "Date Conflict of Interest Identified", type: "date" },

    conflictType: {
        label: "1. The conflict of interest has been identified as (Please tick all that apply):",
        type: "checkbox",
        options: [
            "an actual conflict of interest – it happened or is happening",
            "a potential conflict of interest – it might happen",
            "a perceived conflict of interest – it seems like it has happened or might happen"
        ],
        singleSelect: false
    },
    conflictRelatesTo: {
        label: "2. Indicate who the conflicted relationship relates to (Please tick all that apply):",
        type: "checkbox",
        options: [
            "an employee",
            "a provider or organisation",
            "a business owner"
        ],
        singleSelect: false
    },
    conflictNature: {
        label: "3. What is the nature of the conflict of interest? (Please tick all that apply):",
        type: "checkbox",
        options: [
            "Financial. For example, receiving a secondary gain, financial incentive or gift.",
            "Business. For example, there are multiple supports and services provided from the same or connected business or organisation.",
            "Personal. For example, a friend or family member benefits from the arrangement."
        ],
        singleSelect: false
    },
    conflictDescription: {
        label: "4. Describe the conflict of interest including who is involved and the circumstances.",
        type: "textarea",
        rows: 6
    },
    participantConcerns: {
        label: "5. Discuss and describe the participant’s concerns using their own words.",
        type: "textarea",
        rows: 6
    },
    conflictAvoidable: {
        label: "6. Can the conflict be avoided? (Choose the best answer):",
        type: "checkbox",
        options: [
            "Yes, (outline strategies to avoid in Section D: Provider Management Plan).",
            "Yes, the participant has made an informed choice to receive supports from a specified provider after fully thinking about options available.",
            "No, limited-service options are available in regional, rural and remote areas.",
            "No, services require specific cultural and religious choices and practices.",
            "No, highly specialised services have few accredited providers that operate nationally."
        ],
        singleSelect: false
    },
    conflictRisks: {
        label: "7. Describe the risk or impacts associated with the conflict.",
        type: "textarea",
        rows: 6
    },
    alternativeOptions: {
        label: "8. List the alternative options that were explored and offered to the participant.",
        type: "textarea",
        rows: 10
    },
    managementAction: {
        label: "9. Describe the management strategy and actions to be taken by the NDIS provider.",
        type: "checkbox",
        options: [
            "Monitor. Implement close supervision.",
            "Monitor. No further action required.",
            "Implement. An independent third-party contact or review.",
            "Restrict. Limit conflicted person’s involvement in delivering supports and services.",
            "Remove. Conflicted person to be removed from delivering supports and services to participant named in section A."
        ],
        singleSelect: false
    },
    managementPlan: {
        label: "",
        type: "textarea",
        rows: 15
    },
    discussedWith: {
        label: "10. The conflict has been discussed with (Please tick all that apply):",
        type: "checkbox",
        options: [
            "NDIS participant",
            "an authorised representative or decision supporter",
            "employee",
            "other, please state"
        ],
        singleSelect: false
    },
    participantAck: {
        label: "Participant or authorised person - I acknowledge the following:",
        type: "checkbox",
        options: [
            "The details discussed and provided on this conflict of interest declaration form are correct to the best of my knowledge.",
            "I understand the conflict of interest, the associated risks and management strategy set out in this declaration form.",
            "I have been provided with options to raise my concerns if the circumstances set out in this declaration change.",
            "I understand that personal information collected, managed and disclosed on this form will comply with requirements of the organisation’s privacy policy."
        ],
        singleSelect: false
    },
    // Participant Signature Block
    participantSignerType: {
        label: "Who is signing this form?",
        type: "dropdown",
        options: ["Participant", "Authorised Representative"]
    },
    participantSignature: { label: "Signature", type: "signature" },
    participantSignDate: { label: "Date (DD/MM/YYYY)", type: "date" },
    authRepName: { label: "Authorised representative name", type: "text" },
    authRepSignature: { label: "Signature", type: "signature" },
    authRepSignDate: { label: "Date (DD/MM/YYYY)", type: "date" },

    // Employee Section
    employeeProvided: {
        label: "Employee and provider operations manager or director - I declare the following:\nI have provided the above named participant or authorised representative with:",
        type: "checkbox",
        options: [
            "a copy of this declaration form",
            "any additional management plans",
            "the organisation’s conflict of interest policy and procedures."
        ],
        singleSelect: false
    },
    employeeAck: {
        label: "",
        type: "checkbox",
        options: [
            "the details provided are correct to the best of my knowledge and I make this conflict of interest declaration in good faith.",
            "I understand that if the circumstances as set out in this declaration change, I am required to complete a new declaration setting out the circumstances."
        ],
        singleSelect: false
    },
    reviewPeriod: {
        label: "I acknowledge that this conflict of interest declaration and management plan will be reviewed (Date):",
        type: "date"
    },
    employeePrivacyAck: {
        label: "",
        type: "checkbox",
        options: [
            "I understand that personal information collected, managed and disclosed on this form will comply with requirements of our organisation’s privacy policy."
        ],
        singleSelect: false
    },
    // Employee Signature Block
    employeeSignature: { label: "Signature", type: "signature" },
    employeeSignDate: { label: "Date (DD/MM/YYYY)", type: "date" },
    managerName: { label: "Operations manager or director name", type: "text" },
    managerSignature: { label: "Signature", type: "signature" },
    managerSignDate: { label: "Date (DD/MM/YYYY)", type: "date" },
};

const commonFieldsMapping: Record<string, string> = {
    participantName: "name",
    ndisNumber: "ndis",
    dob: "dob",
    residentialAddress: "street", // Assuming 'street' is used in common fields mostly
    contactPhone: "phone",
    contactEmail: "email"
};

const isCommonField = (fieldName: string): boolean => {
    return Object.keys(commonFieldsMapping).includes(fieldName);
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
    handleSubmitForm?: () => Promise<void>;
    saving?: boolean;
    onCommonFieldsUpdated?: () => void;
}

const ConflictOfInterestEdit: React.FC<FormProps> = ({
    formData,
    commonFieldsData,
    onChange,
    onSubmit,
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
    const [localValues, setLocalValues] = useState<any>({
        ...Object.keys(FIELD_METADATA).reduce((acc, key) => ({ ...acc, [key]: "" }), {}),
        ...formData,
        // Pre-fill "discussedWith" if not already present in formData
        discussedWith: formData?.discussedWith || ["an authorised representative or decision supporter"],
        // Pre-fill Employee Declaration checkboxes
        employeeProvided: formData?.employeeProvided || FIELD_METADATA.employeeProvided.options,
        employeeAck: formData?.employeeAck || FIELD_METADATA.employeeAck.options,
        employeePrivacyAck: formData?.employeePrivacyAck || FIELD_METADATA.employeePrivacyAck.options,
        // Pre-fill Participant/Auth Person Declaration checkboxes
        participantAck: formData?.participantAck || FIELD_METADATA.participantAck.options,
    });
    const [navigatingPrev, setNavigatingPrev] = useState(false);
    const [navigatingNext, setNavigatingNext] = useState(false);
    const [validationWarnings, setValidationWarnings] = useState<Record<string, string>>({});

    const getCommonFieldValue = (fieldName: string): string => {
        if (fieldName === 'participantName') {
            const firstName = commonFieldsData?.name || '';
            const surname = commonFieldsData?.surname || '';
            const fullName = [firstName, surname].filter(Boolean).join(' ').trim();
            if (fullName) return fullName;
            if (formData?.[fieldName]) return String(formData[fieldName]);
            return firstName || '';
        }

        const commonKey = commonFieldsMapping[fieldName];
        if (commonKey && commonFieldsData?.[commonKey]) {
            return String(commonFieldsData[commonKey]);
        }
        return formData?.[fieldName] ? String(formData[fieldName]) : '';
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

        let newValues = { ...localValues, [name]: value };

        // Handle field clearing for participant signature block
        if (name === 'participantSignerType') {
            if (value === 'Participant') {
                newValues.authRepName = '';
                newValues.authRepSignature = '';
                newValues.authRepSignDate = '';
            } else if (value === 'Authorised Representative') {
                newValues.participantSignature = '';
                newValues.participantSignDate = '';
                // Note: We might want to keep participantName as it's often the client's name, but if it was editable, we'd clear it. 
                // In this form, participantName is often read-only/mapped, but metadata says type: "text".
                // If it's intended to be the signer's name when signer is participant, we might leave it or clear it if they are switched.
                // Given participantName is usually the CLIENT, we probably shouldn't clear it blindly unless it's specifically the "Signer Name" field.
                // However, the field metadata has `participantName` as "Full Name" in Section 1.
                // In Section E, we are using `participantName` again for the signer name?
                // Let's check Section E fields in FORM_SECTIONS.
                // Ah, Section E uses `participantName`. If that's the same field as Section 1, it's the client's name.
                // If the "Participant" is signing, their name is the client name.
                // If "Auth Rep" is signing, `authRepName` is used.
                // So we don't need to clear `participantName` because it's the Client Name generally.
                // Only clear the signature and date.
            }
        }

        setLocalValues(newValues);
        onChange(newValues, name, false);
    };

    // Helper Functions
    const renderInput = (label: string, name: string, type: string = "text", placeholder?: string, required?: boolean, readOnlyOverride?: boolean) => {
        const isCommon = isCommonField(name);
        const displayValue = isCommon ? getCommonFieldValue(name) : (localValues[name] || "");
        const isFieldReadOnly = readOnly || isCommon || readOnlyOverride;

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
                    disabled={isFieldReadOnly}
                    className={`w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${fieldErrors[name] || validationWarnings[name]
                        ? "border-red-300 bg-red-50"
                        : isCommon
                            ? "bg-blue-50 border-blue-200 text-blue-800 cursor-not-allowed"
                            : isFieldReadOnly
                                ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                                : "bg-white hover:border-indigo-300"
                        }`}
                />
                {(fieldErrors[name] || validationWarnings[name]) && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors[name] || validationWarnings[name]}</p>
                )}
            </div>
        );
    };

    const renderDropdown = (label: string, name: string, options: string[], required?: boolean) => (
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
                className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${fieldErrors[name] ? "border-red-300 bg-red-50" : "hover:border-indigo-300"
                    }`}
            >
                <option value="">Select an option</option>
                {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
            {fieldErrors[name] && <p className="text-xs text-red-500 mt-1">{fieldErrors[name]}</p>}
        </div>
    );

    const renderMultiSelectCheckbox = (
        label: string,
        name: string,
        options: string[],
        showComments?: boolean,
        required?: boolean,
        singleSelect?: boolean
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
                            type={singleSelect ? "radio" : "checkbox"}
                            value={option}
                            checked={
                                Array.isArray(localValues[name]) &&
                                localValues[name].includes(option)
                            }
                            onChange={(e) => {
                                const checked = e.target.checked;
                                setLocalValues((prev: any) => {
                                    if (singleSelect) {
                                        return {
                                            ...prev,
                                            [name]: [option]
                                        };
                                    }
                                    const current = Array.isArray(prev[name]) ? prev[name] : [];
                                    const newValue = checked
                                        ? [...current, option]
                                        : current.filter((val: string) => val !== option);

                                    // Propagate change
                                    const newValues = { ...prev, [name]: newValue };
                                    onChange(newValues, name, false);

                                    return newValues;
                                });
                            }}
                            disabled={readOnly}
                            className={`accent-indigo-600 h-4 w-4 border-gray-300 focus:ring-indigo-500 ${singleSelect ? 'rounded-full' : 'rounded'}`}
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
                    {renderTextArea("Comments", `${name}_comments`, 2, "Add any additional comments...")}
                </div>
            )}
        </div>
    );

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

        const adjustHeight = (el: HTMLTextAreaElement) => {
            el.style.height = 'auto';
            el.style.height = `${el.scrollHeight}px`;
        };

        return (
            <div className="flex flex-col gap-1">
                {label && (
                    <label className="text-xs font-medium text-gray-700 mb-1">
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <textarea
                    name={name}
                    value={displayValue}
                    ref={(el) => {
                        if (el) adjustHeight(el);
                    }}
                    onChange={(e) => {
                        adjustHeight(e.target);
                        if (!isCommon) handleChange(e);
                    }}
                    placeholder={placeholder}
                    rows={rows}
                    disabled={isFieldReadOnly}
                    className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-gray-400 resize-none overflow-hidden ${fieldErrors[name]
                        ? "border-red-300 bg-red-50"
                        : isCommon
                            ? "bg-blue-50 border-blue-200 text-blue-800"
                            : "hover:border-indigo-300"
                        } ${isFieldReadOnly ? "cursor-not-allowed" : ""}`}
                />
            </div>
        );
    };

    const renderSignature = (label: string, name: string, required?: boolean) => {
        return (
            <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                    <SignatureCanvas
                        ref={React.createRef()}
                        onSignatureEnd={(signature: any) => {
                            const newValues = { ...localValues, [name]: signature };
                            setLocalValues(newValues);
                            onChange(newValues, name, false);
                        }}
                        existingSignature={localValues[name]}
                    />
                </div>
                {fieldErrors[name] && <p className="text-xs text-red-500">{fieldErrors[name]}</p>}
            </div>
        );
    };

    const isCurrentSectionComplete = () => {
        // Simple check: are all required fields in current section filled?
        // This is a basic implementation, can be enhanced.
        const section = FORM_SECTIONS[currentStep];
        for (const field of section.requiredFields) {
            if (!localValues[field]) return false;
        }
        return true;
    };

    const handlePreviousSequential = async () => {
        setNavigatingPrev(true);
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
        setNavigatingPrev(false);
    };

    const handleNextSequential = async () => {
        setNavigatingNext(true);
        if (currentStep < FORM_SECTIONS.length - 1) {
            setCompletedSteps(prev => new Set(prev).add(currentStep));
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);
            if (nextStep > maxStep) setMaxStep(nextStep);
        }
        setNavigatingNext(false);
    };

    return (
        <div className="">
            {/* Progress Bar */}
            <div className="w-full max-w-2xl mx-auto pt-2 md:pt-6 px-2">
                <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
                    <div className="h-2 bg-gradient-to-r from-indigo-500 to-green-400 rounded-full transition-all" style={{ width: `${((currentStep + 1) / FORM_SECTIONS.length) * 100}%` }} />
                </div>
                {/* Horizontal Stepper */}
                <nav className="flex items-center justify-between gap-2 overflow-visible pb-2 relative">
                    {FORM_SECTIONS.map((section: any, idx: number) => {
                        const active = idx === currentStep;
                        const unlocked = idx <= maxStep;
                        return (
                            <div key={section.id} className="relative flex flex-col items-center group">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (idx <= maxStep) setCurrentStep(idx);
                                    }}
                                    className={`flex flex-col items-center min-w-[60px] px-2 focus:outline-none transition-all duration-200 ${active ? 'text-indigo-700' : unlocked ? 'text-green-600' : 'text-gray-400 opacity-50 cursor-not-allowed'}`}
                                    aria-current={active ? 'step' : undefined}
                                    aria-label={section.title}
                                    disabled={!unlocked}
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

            <main className="w-full flex flex-col items-center justify-center flex-1">
                <section className="w-full max-w-2xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100 p-4 md:p-8 flex flex-col mt-2 md:mt-4 gap-4 md:gap-8">
                    <div className="mb-4">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-3">
                            {React.createElement(FORM_SECTIONS[currentStep].icon, { className: "w-6 h-6 text-indigo-600" })}
                            {FORM_SECTIONS[currentStep].title}
                        </h2>
                        <p className="text-sm text-gray-500 font-medium mt-1">{FORM_SECTIONS[currentStep].description}</p>
                    </div>

                    {/* Disclaimer for Participant Section */}
                    {FORM_SECTIONS[currentStep].id === "participant_declaration" && (
                        <div className="md:col-span-2 text-sm text-gray-600 space-y-4">
                            <p>This form needs to be signed by relevant parties to acknowledge the information contained within this form is true and correct. This may be the:</p>
                            <ul className="list-disc pl-5">
                                <li>participant</li>
                                <li>authorised representative</li>
                                <li>nominee</li>
                                <li>guardian</li>
                                <li>employee</li>
                                <li>provider operations manager or director.</li>
                            </ul>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {FORM_SECTIONS[currentStep].fields.map((field: string) => {
                            // Conditional Rendering for Participant/Auth Rep Signatures
                            if (field === 'participantName' || field === 'participantSignature' || field === 'participantSignDate') {
                                if (localValues.participantSignerType !== 'Participant') return null;
                            }
                            if (field === 'authRepName' || field === 'authRepSignature' || field === 'authRepSignDate') {
                                if (localValues.participantSignerType !== 'Authorised Representative') return null;
                            }

                            const meta = FIELD_METADATA[field] || { label: field, type: "text" };
                            const required = meta.required || FORM_SECTIONS[currentStep].requiredFields.includes(field) ||
                                (localValues.participantSignerType === 'Participant' && (field === 'participantSignature' || field === 'participantSignDate')) ||
                                (localValues.participantSignerType === 'Authorised Representative' && (field === 'authRepName' || field === 'authRepSignature' || field === 'authRepSignDate'));

                            if (meta.type === "dropdown") {
                                return <div key={field} className="md:col-span-2">{renderDropdown(meta.label, field, meta.options || [], required)}</div>;
                            }
                            if (meta.type === "textarea") {
                                return (
                                    <div key={field} className="md:col-span-2">
                                        {renderTextArea(meta.label, field, meta.rows || 3, meta.placeholder, required)}
                                    </div>
                                );
                            }
                            if (meta.type === "checkbox") {
                                return (
                                    <div key={field} className="md:col-span-2">
                                        {renderMultiSelectCheckbox(meta.label, field, meta.options || [], meta.showComments, required, meta.singleSelect)}
                                    </div>
                                );
                            }
                            if (meta.type === "signature") {
                                return (
                                    <div key={field} className="md:col-span-2">
                                        {renderSignature(meta.label, field, required)}
                                    </div>
                                );
                            }
                            if (field === 'managerSignDate') {
                                return (
                                    <React.Fragment key={field}>
                                        <div className="md:col-span-2">{renderInput(meta.label, field, meta.type, meta.placeholder, required, meta.readOnly)}</div>
                                        {/* NDIS Code of Conduct Footer */}
                                        <div className="md:col-span-2 mt-4 text-xs text-gray-500 border-t pt-4">
                                            <p className="mb-2">
                                                The <a href="https://www.ndiscommission.gov.au/about/ndis-code-conduct" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">NDIS Code of Conduct</a> promotes safe and ethical service delivery by setting out expectations for the conduct of both NDIS providers and workers.
                                            </p>
                                            <p>
                                                If you don’t abide by the obligations to disclose and manage conflicts of interest, this may constitute a breach of the NDIS Code of Conduct which may result in a report to the NDIS Quality and Safeguards Commission or National Disability Insurance Agency for non-compliant behaviour.
                                            </p>
                                        </div>
                                    </React.Fragment>
                                );
                            }
                            return <div key={field} className="md:col-span-2">{renderInput(meta.label, field, meta.type, meta.placeholder, required, meta.readOnly)}</div>;
                        })}
                    </div>
                </section>

                <footer className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-lg border-t border-gray-100 px-4 md:px-10 py-5 flex flex-col items-center gap-4 shadow-2xl rounded-b-3xl mt-2">
                    <div className="flex flex-col w-full gap-2 md:flex-row md:gap-3 md:justify-between">
                        <button
                            onClick={handlePreviousSequential}
                            disabled={currentStep === 0 || navigatingPrev}
                            className={`flex items-center justify-center space-x-1 px-5 py-2 rounded-full font-semibold transition-all text-sm shadow border duration-200 w-full md:w-1/3 ${currentStep === 0 || navigatingPrev ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200" : "bg-gradient-to-r from-gray-700 to-gray-900 text-white hover:from-gray-800 hover:to-black"}`}
                        >
                            {navigatingPrev ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaChevronLeft className="w-4 h-4" />}
                            <span>Previous</span>
                        </button>

                        <button
                            onClick={handleNextSequential}
                            disabled={currentStep === FORM_SECTIONS.length - 1 || !isCurrentSectionComplete() || navigatingNext}
                            className={`flex items-center justify-center space-x-1 px-5 py-2 rounded-full font-semibold transition-all text-sm shadow border duration-200 w-full md:w-1/3 ${currentStep === FORM_SECTIONS.length - 1 || !isCurrentSectionComplete() || navigatingNext ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200" : "bg-gradient-to-r from-indigo-600 to-green-400 text-white hover:from-indigo-700 hover:to-green-500"}`}
                        >
                            <span>Next</span>
                            {navigatingNext ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaChevronRight className="w-4 h-4" />}
                        </button>

                        <button
                            onClick={() => handleSaveProgress && handleSaveProgress()}
                            disabled={saving}
                            className="flex items-center justify-center gap-1 px-5 py-2 rounded-full font-semibold text-sm bg-gray-600 hover:bg-gray-700 text-white shadow border border-gray-700 transition-all duration-200 w-full md:w-1/3"
                        >
                            {saving ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaSave className="w-4 h-4" />}
                            <span>Save Progress</span>
                        </button>
                    </div>
                    {currentStep === FORM_SECTIONS.length - 1 && (
                        <button
                            onClick={() => handleSubmitForm && handleSubmitForm()}
                            disabled={saving}
                            className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 rounded-full font-semibold text-sm bg-gradient-to-r from-blue-600 to-green-400 text-white hover:from-blue-700 hover:to-green-500 shadow transition"
                        >
                            <FaCheck className="w-4 h-4" />
                            <span>Submit Form</span>
                        </button>
                    )}
                </footer>
            </main>
        </div>
    );
};

export default ConflictOfInterestEdit;
