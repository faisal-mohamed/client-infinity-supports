"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    FaUser,
    FaUsers,
    FaClipboardList,
    FaPenNib,
    FaChevronLeft,
    FaChevronRight,
    FaSave,
    FaSpinner,
    FaCheck
} from "react-icons/fa";
import { useToast } from "@/components/ui/Toast";
import SignatureCanvas from "@/components/ui/SignatureCanvas";
// Helper functions for date formatting
const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    // If already in DD/MM/YYYY format, return as is
    if (/^\d{2}[-/]\d{2}[-/]\d{4}$/.test(dateStr)) return dateStr;
    // If in YYYY-MM-DD format, convert to DA/MM/YYYY
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    }
    return dateStr;
};

const formatDateForStorage = (dateStr: string) => {
    if (!dateStr) return "";
    // If in YYYY-MM-DD format (standard input format), return as is (wait, input needs YYYY-MM-DD)
    // Actually, this function is used for the INPUT value, so it should be "to YYYY-MM-DD"
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

    // If in DD/MM/YYYY format, convert to YYYY-MM-DD
    const parts = dateStr.split(/[-/]/);
    if (parts.length === 3) {
        const [p1, p2, p3] = parts;
        // Assuming DD/MM/YYYY
        if (p3.length === 4) return `${p3}-${p2.padStart(2, '0')}-${p1.padStart(2, '0')}`;
    }
    return dateStr;
};

export const FORM_SECTIONS = [
    {
        id: "partA",
        title: "Part A: Person’s details",
        icon: FaUser,
        description: "Details of the applicant or participant",
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
        title: "Part C: Information about your request",
        icon: FaClipboardList,
        description: "Details about the decision review",
        fields: ["decisionToReview", "decisionDate", "decisionExpected", "situationChanged", "newEvidence", "whyDifferentDecision"],
        requiredFields: ["decisionToReview", "decisionDate", "decisionExpected"]
    },
    {
        id: "partD",
        title: "Part D: Your declaration",
        icon: FaPenNib,
        description: "Signature and declaration",
        fields: ["declarationName", "signature", "declarationDate"],
        requiredFields: ["declarationName", "signature", "declarationDate"]
    }
];

const FIELD_METADATA: Record<string, any> = {
    // Part A
    fullName: { label: "Full name", type: "text", required: true },
    dob: { label: "Date of birth (DD/MM/YYYY)", type: "date", required: true },
    ndisNumber: { label: "NDIS number", type: "text", required: true },
    contactDetails: { label: "Preferred contact details (phone number, email address, etc.)", type: "text", required: true },

    // Part B
    thirdPartyName: { label: "Full name", type: "text" },
    thirdPartyDob: { label: "Date of birth (DD/MM/YYYY)", type: "date" },
    thirdPartyPhone: { label: "Contact phone number", type: "text" },
    thirdPartyRelationship: {
        label: "Relationship to Person in Part A",
        type: "textarea",
        placeholder: "for example: child representative, advocate, nominee"
    },

    // Part C
    decisionToReview: { label: "What decision do you want to review?", type: "textarea", required: true },
    decisionDate: {
        label: "What was the date of this decision?",
        type: "date",
        required: true,
        helpText: "Remember, you need to ask for a review within 3 months of our decision."
    },
    decisionExpected: {
        label: "What decision were you expecting?",
        type: "textarea",
        required: true,
        placeholder: "If your request is to review a decision about an NDIS-funded support, please detail the type of support you are seeking, hours of support and frequency.\n\nFor example: ‘I need 4 hours additional social and community access support on a Saturday for 26 weeks so I can see my friends’. OR ‘I need 20 hours of occupational therapy supports to assess my equipment needs’. OR ‘I need 9 hours of 1:1 daytime support each week for 12 months’"
    },
    situationChanged: { label: "Has your situation changed since the decision was made?", type: "textarea" },
    newEvidence: { label: "Do you have new evidence, such as medical or therapy reports you would like us to think about? If so - please send with this form.", type: "textarea" },
    whyDifferentDecision: { label: "Why do you think we should make a different decision?", type: "textarea" },

    // Part D
    declarationName: { label: "Full name", type: "text", required: true },
    signature: { label: "Signature", type: "signature", required: true },
    declarationDate: { label: "Date (DD/MM/YYYY)", type: "date", required: true }
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

const ReviewOfDecisionEdit: React.FC<FormProps> = ({
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

        const dateFields = ["dob", "thirdPartyDob", "decisionDate", "declarationDate"];
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

        if (!localValues.declarationDate) {
            updatedValues.declarationDate = new Date().toISOString().split("T")[0];
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
        const finalValue = value;
        const newValues = { ...localValues, [name]: finalValue };
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
        for (const field of requiredFields) {
            const value = localValues[field];
            if (!value) return false;
        }
        return true;
    };

    const handleNext = () => {
        setNavigatingNext(true);
        if (currentStep < FORM_SECTIONS.length - 1) {
            const nextStep = currentStep + 1;
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
            setCurrentStep(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        setTimeout(() => setNavigatingPrev(false), 300);
    };

    const handleStepClick = (index: number) => {
        if (index <= maxStep || completedSteps.has(index - 1)) {
            setCurrentStep(index);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const renderInput = (fieldName: string) => {
        const metadata = FIELD_METADATA[fieldName];
        const value = localValues[fieldName] || "";
        const isRequired = FORM_SECTIONS[currentStep].requiredFields.includes(fieldName);
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

        if (metadata.type === "textarea") {
            return (
                <div key={fieldName} className="md:col-span-2 flex flex-col gap-1">
                    <label className="text-xs font-medium text-azure-600 mb-1 flex items-center">
                        {metadata.label} {isRequired && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {metadata.helpText && <p className="text-xs text-azure-400 mb-1 italic">{metadata.helpText}</p>}
                    <textarea
                        value={value}
                        ref={(el) => { if (el) adjustHeight(el); }}
                        onChange={(e) => {
                            adjustHeight(e.target);
                            handleChange(fieldName, e.target.value);
                        }}
                        disabled={readOnly}
                        placeholder={metadata.placeholder || "Click or tap here to enter text."}
                        rows={1}
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
                    {metadata.helpText && <p className="text-xs text-azure-400 mb-1 italic">{metadata.helpText}</p>}
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

    return (
        <div className="min-h-screen pb-12">
            {/* Steps Header */}
            {/* Progress Bar & Stepper */}
            <div className="w-full max-w-2xl mx-auto pt-6 px-4">
                <div className="w-full h-2 bg-azure-200 rounded-full mb-6">
                    <div
                        className="h-2 bg-gradient-to-r from-azure-600 to-green-400 rounded-full transition-all duration-500"
                        style={{ width: `${((currentStep + 1) / FORM_SECTIONS.length) * 100}%` }}
                    />
                </div>

                <nav className="flex items-center justify-between gap-1 overflow-visible pb-4 relative">
                    {FORM_SECTIONS.map((section, idx) => {
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

            {/* Content Area */}
            <main className="w-full flex flex-col items-center justify-center pt-2 px-4">
                <section className="w-full max-w-2xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-azure-50 p-6 md:p-10 flex flex-col gap-6">
                    <div>
                        <h2 className="text-2xl font-bold text-azure-700 flex items-center gap-3">
                            {React.createElement(FORM_SECTIONS[currentStep].icon, { className: "w-7 h-7 text-azure-700" })}
                            {FORM_SECTIONS[currentStep].title}
                        </h2>
                        <p className="text-sm text-azure-400 font-semibold mt-1.5">{FORM_SECTIONS[currentStep].description}</p>
                    </div>

                    {/* Part D Specific Header */}
                    {FORM_SECTIONS[currentStep].id === 'partD' && (
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 mb-6 text-sm text-purple-900 leading-relaxed">
                            <p className="font-bold mb-2">I confirm that the information provided in this form is complete and correct.</p>
                            <p className="mb-2">I understand that:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>giving false or misleading information is a serious offence</li>
                                <li>this information is protected by law and can only be given to someone else where Commonwealth law allows, or requires it, or where I give permission.</li>
                            </ul>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {FORM_SECTIONS[currentStep].fields.map(fieldName => renderInput(fieldName))}
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
                                : "bg-gradient-to-r from-blue-600 to-emerald-500 text-white hover:shadow-blue-200 active:scale-[0.98]"
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

export default ReviewOfDecisionEdit;
