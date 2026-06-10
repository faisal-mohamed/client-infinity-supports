"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
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
    FaTimes,
    FaChevronDown,
} from "react-icons/fa";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
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
    participantName: {
        label: "Full name",
        type: "text",
        readOnly: true,
        defaultValueSource: "name_surname", // Custom flag to handle commonFieldsData merging
        legend: "Participant"
    },
    dob: { label: "Date of Birth (DD/MM/YYYY)", type: "date", legend: "Participant" },
    ndisNumber: { label: "NDIS Number", type: "text", legend: "Participant" },
    residentialAddress: { label: "Residential Address", type: "textarea", rows: 2, legend: "Participant" },
    contactPhone: { label: "Contact Phone Number", type: "text", legend: "Participant" },
    contactEmail: { label: "Contact Email", type: "email", legend: "Participant" },

    orgName: { label: "Organisation Name", type: "text", readOnly: true },
    providerNo: { label: "Provider Number", type: "text", readOnly: true },
    providerAddress: { label: "Address", type: "textarea", rows: 2, readOnly: true },
    providerContactEmail: {
        label: "Contact Email",
        type: "suggestedInput",
        inputType: "email",
        options: [
            "anand@infinitysupportswa.org",
            "sharon@infinitysupportswa.org",
            "admin@infinitysupportswa.org",
            "sc@infinitysupportswa.org"
        ],
        legend: "Staff"
    },
    providerContactPhone: {
        label: "Contact Phone Number",
        type: "suggestedInput",
        inputType: "tel",
        options: [
            "0493141688",
            "0493282661",
            "0493540924"
        ],
        legend: "Staff"
    },

    employeeName: { label: "Full Name", type: "text", legend: "Staff" },
    employeeRelationship: { label: "Relationship to Participant", type: "textarea", rows: 1, legend: "Staff" },
    employeePosition: { label: "Job Title or Position", type: "textarea", rows: 1, legend: "Staff" },
    employeePhone: { label: "Contact Phone Number", type: "text", legend: "Staff" },
    employeeEmail: { label: "Contact Email", type: "email", legend: "Staff" },

    conflictIdentifiedDate: { label: "Date Conflict of Interest Identified", type: "date", legend: "Staff" },

    conflictType: {
        label: "1. The conflict of interest has been identified as (Please tick all that apply):",
        type: "checkbox",
        options: [
            "an actual conflict of interest – it happened or is happening",
            "a potential conflict of interest – it might happen",
            "a perceived conflict of interest – it seems like it has happened or might happen"
        ],
        singleSelect: false,
        legend: "Staff"
    },
    conflictRelatesTo: {
        label: "2. Indicate who the conflicted relationship relates to (Please tick all that apply):",
        type: "checkbox",
        options: [
            "an employee",
            "a provider or organisation",
            "a business owner"
        ],
        singleSelect: false,
        legend: "Staff"
    },
    conflictNature: {
        label: "3. What is the nature of the conflict of interest? (Please tick all that apply):",
        type: "checkbox",
        options: [
            "Financial. For example, receiving a secondary gain, financial incentive or gift.",
            "Business. For example, there are multiple supports and services provided from the same or connected business or organisation.",
            "Personal. For example, a friend or family member benefits from the arrangement."
        ],
        singleSelect: false,
        legend: "Staff"
    },
    conflictDescription: {
        label: "4. Describe the conflict of interest including who is involved and the circumstances.",
        type: "textarea",
        rows: 6,
        legend: "Staff"
    },
    participantConcerns: {
        label: "5. Discuss and describe the participant’s concerns using their own words.",
        type: "textarea",
        rows: 6,
        legend: "Staff"
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
        singleSelect: false,
        legend: "Staff"
    },
    conflictRisks: {
        label: "7. Describe the risk or impacts associated with the conflict.",
        type: "textarea",
        rows: 6,
        legend: "Staff"
    },
    alternativeOptions: {
        label: "8. List the alternative options that were explored and offered to the participant.",
        type: "textarea",
        rows: 10,
        legend: "Staff"
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
        singleSelect: false,
        legend: "Staff"
    },
    managementPlan: {
        label: "",
        type: "textarea",
        rows: 15,
        legend: "Staff"
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
        singleSelect: false,
        legend: "Staff"
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
        singleSelect: false,
        legend: "Participant"
    },
    // Participant Signature Block
    participantSignerType: {
        label: "Who is signing this form?",
        type: "dropdown",
        options: ["Participant", "Authorised Representative"],
        legend: "Participant/Auth Rep"
    },
    participantSignature: { label: "Signature", type: "signature", legend: "Participant" },
    participantSignDate: { label: "Date (DD/MM/YYYY)", type: "date", legend: "Participant" },
    authRepName: {
        label: "Authorised representative name",
        type: "textarea",
        rows: 1,
        legend: "Authorised Representative"
    },
    authRepSignature: { label: "Signature", type: "signature", legend: "Authorised Representative" },
    authRepSignDate: { label: "Date (DD/MM/YYYY)", type: "date", legend: "Authorised Representative" },

    // Employee Section
    employeeProvided: {
        label: "Employee and provider operations manager or director - I declare the following:\nI have provided the above named participant or authorised representative with:",
        type: "checkbox",
        options: [
            "a copy of this declaration form",
            "any additional management plans",
            "the organisation’s conflict of interest policy and procedures."
        ],
        singleSelect: false,
        legend: "Staff"
    },
    employeeAck: {
        label: "",
        type: "checkbox",
        options: [
            "the details provided are correct to the best of my knowledge and I make this conflict of interest declaration in good faith.",
            "I understand that if the circumstances as set out in this declaration change, I am required to complete a new declaration setting out the circumstances."
        ],
        singleSelect: false,
        legend: "Staff"
    },
    reviewPeriod: {
        label: "I acknowledge that this conflict of interest declaration and management plan will be reviewed (Date):",
        type: "date",
        legend: "Staff"
    },
    employeePrivacyAck: {
        label: "",
        type: "checkbox",
        options: [
            "I understand that personal information collected, managed and disclosed on this form will comply with requirements of our organisation’s privacy policy."
        ],
        singleSelect: false,
        legend: "Staff"
    },
    // Employee Signature Block
    employeeSignature: { label: "Signature", type: "signature", legend: "Staff" },
    employeeSignDate: { label: "Date (DD/MM/YYYY)", type: "date", legend: "Staff" },
    managerName: { label: "Operations manager or director name", type: "text", legend: "Manager" },
    managerSignature: { label: "Signature", type: "signature", legend: "Manager" },
    managerSignDate: { label: "Date (DD/MM/YYYY)", type: "date", legend: "Manager" },
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
    isSignatureLink?: boolean;
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
    isSignatureLink = false,
}: FormProps) => {
    const { showToast } = useToast();
    const router = useRouter();
    const params = useParams();
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
    const [maxStep, setMaxStep] = useState(0);

    // Store the ORIGINAL formData (saved from DB) to determine workflow stage
    // If the form was fully completed (Manager signed), we reset the original data ref as well
    // so that getWorkflowStage() returns 0 (Start) and unlocks the fields for re-entry.
    const originalFormDataRef = useRef(
        formData?.managerSignature
            ? {
                ...formData,
                participantSignature: "",
                participantSignDate: "",
                authRepSignature: "",
                authRepSignDate: "",
                employeeSignature: "",
                employeeSignDate: "",
                managerSignature: "",
                managerSignDate: ""
            }
            : formData
    );

    const [localValues, setLocalValues] = useState<any>({
        ...Object.keys(FIELD_METADATA).reduce((acc, key) => ({ ...acc, [key]: "" }), {}),
        // Provider Details Defaults
        orgName: "Infinity Supports WA",
        providerNo: "4050126792",
        providerAddress: "Po Box 4275 Baldivis 6171",

        // Pre-fill DOB from commonFieldsData (check both possible field names)
        // Convert from dd-MM-yyyy to yyyy-MM-dd format for HTML date input
        dob: (() => {
            const dobValue = commonFieldsData?.dob || commonFieldsData?.dateOfBirth || "";
            if (!dobValue) return "";

            // Check if already in yyyy-MM-dd format
            if (/^\d{4}-\d{2}-\d{2}$/.test(dobValue)) return dobValue;

            // Convert from dd-MM-yyyy to yyyy-MM-dd
            const parts = dobValue.split('-');
            if (parts.length === 3) {
                const [day, month, year] = parts;
                return `${year}-${month}-${day}`;
            }
            return dobValue;
        })(),

        ...formData,

        // Set default current date for date fields if they are empty
        conflictIdentifiedDate: formData?.conflictIdentifiedDate || new Date().toISOString().split('T')[0],
        participantSignDate: formData?.participantSignDate || new Date().toISOString().split('T')[0],
        authRepSignDate: formData?.authRepSignDate || new Date().toISOString().split('T')[0],
        employeeSignDate: formData?.employeeSignDate || new Date().toISOString().split('T')[0],
        managerSignDate: formData?.managerSignDate || new Date().toISOString().split('T')[0],

        // If the form was fully completed (indicated by Manager's signature), clear ALL signatures.
        // This ensures that if a completed form is edited, it must be re-signed by everyone to maintain validity.
        ...(formData?.managerSignature ? {
            participantSignature: "",
            authRepSignature: "",
            employeeSignature: "",
            managerSignature: "",
            // We keep the dates as the current date (already defaulted above)
        } : {}),

        // Section C: Preserve Conflict Identification defaults if formData is empty
        conflictType: (formData?.conflictType && Array.isArray(formData.conflictType) && formData.conflictType.length > 0)
            ? formData.conflictType
            : ["a perceived conflict of interest – it seems like it has happened or might happen"],
        conflictRelatesTo: (formData?.conflictRelatesTo && Array.isArray(formData.conflictRelatesTo) && formData.conflictRelatesTo.length > 0)
            ? formData.conflictRelatesTo
            : ["a provider or organisation"],
        conflictNature: (formData?.conflictNature && Array.isArray(formData.conflictNature) && formData.conflictNature.length > 0)
            ? formData.conflictNature
            : ["Business. For example, there are multiple supports and services provided from the same or connected business or organisation."],
        conflictDescription: formData?.conflictDescription || "Infinity Supports WA is providing both Support Coordination and Direct Service Delivery to the participant. As these supports are delivered by the same organisation, a potential or perceived conflict of interest may arise regarding participant choice, impartiality, or independence.",
        participantConcerns: formData?.participantConcerns || "The participant/family has chosen to receive both services from Infinity Supports WA due to previous experiences with other providers not meeting the participant's needs, lack of continuity, or poor service quality. They express confidence in Infinity Supports WA and have voluntarily requested the dual-service arrangement.",
        conflictAvoidable: (formData?.conflictAvoidable && Array.isArray(formData.conflictAvoidable) && formData.conflictAvoidable.length > 0)
            ? formData.conflictAvoidable
            : ["Yes, the participant has made an informed choice to receive supports from a specified provider after fully thinking about options available."],

        // Section D: Provider Management Plan Defaults
        conflictRisks: formData?.conflictRisks || "•\tPerceived reduced participant choice and control\n•\tPerceived pressure to use other services from the same organization\n•\tPerceived lack of impartial referrals or recommendations",
        alternativeOptions: formData?.alternativeOptions || "•\tThe participant was previously with another organisation for service delivery whilst Infinity Supports provided Support Coordination. The family requested a change in provider due to lack of continuity and poor quality of care.\n•\tSupport Coordinator offered alternative providers in the local area as mentioned in the service agreement. The family requested services were provided by Infinity Supports due to reputation of quality services.\n•\tThe family were offered to be transferred to another Support Coordinator, but this was declined also.",
        managementAction: (formData?.managementAction && Array.isArray(formData.managementAction) && formData.managementAction.length > 0)
            ? formData.managementAction
            : ["Monitor. Implement close supervision."],
        managementPlan: formData?.managementPlan || "Infinity Supports WA has a clear, structured plan to ensure transparency, independence, and safety when Support Coordination and Service Delivery are provided to the same participant.\n•\tDifferent staff deliver Support Coordination and Direct Supports, maintaining strict role boundaries and avoiding overlap.\n•\tSupport Coordinators do not recommend Infinity Supports WA services unless the participant specifically requests them.\n•\tStaff maintain separate participant files, supervision structures, and reporting lines to protect impartiality.\n•\tParticipants have direct access to directors (Sharon or Anand) for independent oversight and to raise concerns, along with full contact details for the NDIS Quality and Safeguards Commission.\n•\tParticipants are provided with written information about alternative providers and may change providers at any time. Full support is provided to transition to another provider upon request or during plan renewal.\n\n•\tAn independent check-in or review may be arranged to ensure the participant's choices remain free and informed.\n•\tThe conflict is recorded in the Conflict-of-Interest Register, reviewed annually or sooner if circumstances change.\n•\tAll personal information is handled strictly in accordance with Infinity Supports WA's Privacy and Confidentiality Policy.",

        // Pre-fill "discussedWith" if not already present or empty in formData
        discussedWith: (formData?.discussedWith && Array.isArray(formData.discussedWith) && formData.discussedWith.length > 0)
            ? formData.discussedWith
            : ["an authorised representative or decision supporter"],
        // Pre-fill Employee Declaration checkboxes
        employeeProvided: (formData?.employeeProvided && Array.isArray(formData.employeeProvided) && formData.employeeProvided.length > 0)
            ? formData.employeeProvided
            : FIELD_METADATA.employeeProvided.options,
        employeeAck: (formData?.employeeAck && Array.isArray(formData.employeeAck) && formData.employeeAck.length > 0)
            ? formData.employeeAck
            : FIELD_METADATA.employeeAck.options,
        employeePrivacyAck: (formData?.employeePrivacyAck && Array.isArray(formData.employeePrivacyAck) && formData.employeePrivacyAck.length > 0)
            ? formData.employeePrivacyAck
            : FIELD_METADATA.employeePrivacyAck.options,
        // Pre-fill Participant/Auth Person Declaration checkboxes
        participantAck: (formData?.participantAck && Array.isArray(formData.participantAck) && formData.participantAck.length > 0)
            ? formData.participantAck
            : FIELD_METADATA.participantAck.options,
    });
    const [navigatingPrev, setNavigatingPrev] = useState(false);
    const [navigatingNext, setNavigatingNext] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const validationWarnings: Record<string, string> = {}; // Placeholder if needed

    const getCommonFieldValue = (fieldName: string): string => {
        if (fieldName === 'participantName') {
            const firstName = commonFieldsData?.name || '';
            const surname = commonFieldsData?.surname || '';
            const fullName = [firstName, surname].filter(Boolean).join(' ').trim();
            if (fullName) return fullName;
            if (formData?.[fieldName]) return String(formData[fieldName]);
            return firstName || '';
        }

        // Special handling for date of birth - check multiple possible field names
        if (fieldName === 'dob') {
            const dobValue = commonFieldsData?.dob || commonFieldsData?.dateOfBirth || formData?.dob;
            if (!dobValue) return '';

            // Convert from dd-MM-yyyy to yyyy-MM-dd format for HTML date input
            const dobString = String(dobValue);

            // Check if already in yyyy-MM-dd format
            if (/^\d{4}-\d{2}-\d{2}$/.test(dobString)) return dobString;

            // Convert from dd-MM-yyyy to yyyy-MM-dd
            const parts = dobString.split('-');
            if (parts.length === 3) {
                const [day, month, year] = parts;
                return `${year}-${month}-${day}`;
            }
            return dobString;
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

        // eslint-disable-next-line prefer-const
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

    // Helper to render legends
    const renderLegend = (fieldName: string) => {
        const legend = FIELD_METADATA[fieldName]?.legend;
        if (!legend) return null;

        let badgeClass = "text-azure-500 bg-azure-50 border-azure-100";
        if (legend === "Staff") badgeClass = "text-azure-600 bg-azure-50 border-azure-100";
        else if (legend === "Manager") badgeClass = "text-gold-600 bg-gold-50 border-gold-200";
        else if (legend === "Participant") badgeClass = "text-emerald-600 bg-emerald-50 border-emerald-200";
        else if (legend === "Authorised Representative") badgeClass = "text-azure-600 bg-azure-50 border-azure-100";
        else if (legend === "Participant/Auth Rep") badgeClass = "text-azure-600 bg-azure-50 border-azure-100";

        return (
            <span className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full border ${badgeClass}`}>
                {legend}
            </span>
        );
    };

    // Workflow Stage Helper
    const getWorkflowStage = (): number => {
        // Use ORIGINAL saved data to determine stage, not current editing state
        // This prevents premature locking when user draws signatures but hasn't submitted
        const savedData = originalFormDataRef.current || {};
        const hasStaffDetails = !!savedData.employeeName;
        // Joint signatures means EITHER Participant OR Auth Rep has signed AND Employee has signed
        const hasParticipantSign = !!savedData.participantSignature || !!savedData.authRepSignature;
        const hasEmployeeSign = !!savedData.employeeSignature;
        const hasJointSignatures = hasParticipantSign && hasEmployeeSign;
        const hasManagerSign = !!savedData.managerSignature;

        if (hasManagerSign) return 3; // Completed
        if (hasJointSignatures) return 2; // Manager Review
        if (hasEmployeeSign) return 1; // Client Fill (Employee has signed, now Client's turn)
        return 0; // Staff Start (Employee hasn't signed yet)
    };

    // Workflow State Logic
    const calculateFieldReadOnly = (name: string): boolean => {
        if (readOnly) return true; // Global read-only override
        if (isCommonField(name)) return true; // Common fields always read-only
        if (FIELD_METADATA[name]?.readOnly) return true; // Metadata read-only override

        const stage = getWorkflowStage();

        // Helper to check legend
        const legend = FIELD_METADATA[name]?.legend;
        const isManagerLegend = legend === 'Manager';
        const isParticipantLegend = legend === 'Participant' || legend === 'Authorised Representative' || legend === 'Participant/Auth Rep';

        // Stage 3: Completed (Manager Saved)
        if (stage === 3) {
            return true; // All locked
        }

        // Stage 2: Manager Mode (Joint signatures present)
        if (stage === 2) {
            if (isManagerLegend) return false; // Manager can edit their fields

            // Allow Participant/AuthRep to clear their signature to unlock the form (revert to Stage 1)
            if (name === 'participantSignature' || name === 'authRepSignature') return false;

            return true; // Everything else locked
        }

        // Stage 1: Client Fill Mode (Employee has signed)
        if (stage === 1) {
            // If accessed via signature link, participant fields are open
            if (isSignatureLink) {
                if (isParticipantLegend) return false;
                return true;
            }

            // If accessed via admin/staff dashboard
            if (isParticipantLegend) return false; // Staff can also edit participant fields (fallback)
            return true; // Staff fields already signed, locked. Manager fields locked.
        }

        // Stage 0: Initial/Staff Start Mode (No Employee Signature yet)
        if (stage === 0) {
            // Staff is filling the form.
            if (isManagerLegend) return true; // Manager fields locked
            if (isParticipantLegend) return true; // Participant fields locked (until Staff submits)

            return false;
        }

        return false;
    };

    // Dynamic Validation Logic
    const getDynamicRequiredFields = (sectionId: string): string[] => {
        const stage = getWorkflowStage();
        const staticRequired = FORM_SECTIONS.find(s => s.id === sectionId)?.requiredFields || [];

        if (sectionId === 'employee_declaration') {
            // Section F Logic
            if (stage === 1) { // Joint Fill - Require Staff fields ONLY
                return [
                    "employeeProvided", "employeeAck", "reviewPeriod", "employeePrivacyAck",
                    "employeeSignature", "employeeSignDate"
                ];
            }
            if (stage === 2) { // Manager Review - Require Manager fields ONLY
                return ["managerName", "managerSignature", "managerSignDate"];
            }
            return [
                "employeeProvided", "employeeAck", "reviewPeriod", "employeePrivacyAck",
                "employeeSignature", "employeeSignDate"
            ];
        }

        return staticRequired;
    };

    // Helper Functions
    const renderInput = (label: string, name: string, type: string = "text", placeholder?: string, required?: boolean, readOnlyOverride?: boolean) => {
        const displayValue = isCommonField(name) ? getCommonFieldValue(name) : (localValues[name] || "");
        // Use workflow logic
        const isFieldReadOnly = readOnlyOverride || calculateFieldReadOnly(name);
        // Calculate dynamic required
        const sectionId = FORM_SECTIONS[currentStep].id;
        const dynamicRequired = getDynamicRequiredFields(sectionId);

        const isRequired = required || dynamicRequired.includes(name) ||
            (FORM_SECTIONS[currentStep].id === 'participant_declaration' &&
                ((localValues.participantSignerType === 'Participant' && (name === 'participantSignature' || name === 'participantSignDate')) ||
                    (localValues.participantSignerType === 'Authorised Representative' && (name === 'authRepName' || name === 'authRepSignature' || name === 'authRepSignDate'))));

        const errorMessage = fieldErrors[name] || validationErrors[name];

        return (
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-azure-600 mb-1 flex items-center">
                    {label}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                    {renderLegend(name)}
                </label>
                <input
                    type={type}
                    name={name}
                    value={displayValue}
                    onChange={(e) => {
                        if (isCommonField(name)) return;
                        handleChange(e);
                        // Clear error on change
                        if (validationErrors[name]) {
                            setValidationErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors[name];
                                return newErrors;
                            });
                        }
                    }}
                    disabled={isFieldReadOnly}
                    className={`w-full rounded-lg border border-azure-100 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all ${errorMessage
                        ? "border-red-300 bg-red-50"
                        : isFieldReadOnly
                            ? "bg-azure-100 text-azure-400 cursor-not-allowed border-azure-100"
                            : "bg-white hover:border-gold-300"
                        }`}
                />
                {errorMessage && (
                    <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
                )}
            </div>
        );
    };

    const renderDropdown = (label: string, name: string, options: string[], required?: boolean) => {
        const isFieldReadOnly = calculateFieldReadOnly(name);
        const errorMessage = fieldErrors[name] || validationErrors[name];
        return (
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-azure-600 mb-1 flex items-center">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                    {renderLegend(name)}
                </label>
                <select
                    name={name}
                    value={localValues[name] || ""}
                    onChange={(e) => {
                        handleChange(e);
                        if (validationErrors[name]) {
                            setValidationErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors[name];
                                return newErrors;
                            });
                        }
                    }}
                    disabled={isFieldReadOnly}
                    className={`w-full rounded-lg border border-azure-100 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all ${errorMessage ? "border-red-300 bg-red-50" : isFieldReadOnly ? "bg-azure-100 text-azure-400 cursor-not-allowed border-azure-100" : "bg-white hover:border-gold-300"
                        }`}
                >
                    <option value="">Select an option</option>
                    {options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
                {errorMessage && <p className="text-xs text-red-500 mt-1">{errorMessage}</p>}
            </div>
        );
    };

    const renderSuggestedInput = (label: string, name: string, options: string[], required?: boolean, inputType: string = "text") => {
        const isFieldReadOnly = calculateFieldReadOnly(name);
        const currentValue = localValues[name] || "";
        const errorMessage = fieldErrors[name] || validationErrors[name];

        return (
            <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-azure-600 flex items-center">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                    {renderLegend(name)}
                </label>

                <div className="flex gap-2">
                    {/* Text Input with Clear Button */}
                    <div className="relative flex-1 group">
                        <input
                            type={inputType}
                            name={name}
                            value={currentValue}
                            onChange={(e) => {
                                handleChange(e);
                                if (validationErrors[name]) {
                                    setValidationErrors(prev => {
                                        const newErrors = { ...prev };
                                        delete newErrors[name];
                                        return newErrors;
                                    });
                                }
                            }}
                            disabled={isFieldReadOnly}
                            placeholder={`Enter ${label.toLowerCase()}...`}
                            className={`w-full rounded-lg border border-azure-100 pl-3 pr-10 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all ${errorMessage
                                ? "border-red-300 bg-red-50"
                                : isFieldReadOnly
                                    ? "bg-azure-100 text-azure-400 cursor-not-allowed border-azure-100"
                                    : "bg-white hover:border-gold-300"
                                }`}
                        />
                        {!isFieldReadOnly && currentValue && (
                            <button
                                type="button"
                                onClick={() => {
                                    const newValues = { ...localValues, [name]: "" };
                                    setLocalValues(newValues);
                                    onChange(newValues, name, false);
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-azure-300 hover:text-red-500 transition-colors"
                                aria-label="Clear field"
                            >
                                <FaTimes className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Suggestions Dropdown */}
                    {!isFieldReadOnly && (
                        <Menu as="div" className="relative inline-block text-left">
                            <MenuButton className="inline-flex items-center justify-center gap-2 rounded-lg bg-azure-50 px-3 py-2 text-sm font-semibold text-azure-700 border border-azure-100 hover:bg-azure-100 transition-all shadow-sm">
                                Suggestions
                                <FaChevronDown className="w-3 h-3 pt-0.5" />
                            </MenuButton>

                            <Transition
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <MenuItems
                                    anchor="bottom end"
                                    className="min-w-[240px] max-w-xs origin-top-right rounded-xl bg-white p-1 shadow-xl ring-1 ring-black/5 focus:outline-none z-50 [--anchor-gap:8px]"
                                >
                                    {options.map((opt) => (
                                        <MenuItem key={opt}>
                                            {({ active }) => (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newValues = { ...localValues, [name]: opt };
                                                        setLocalValues(newValues);
                                                        onChange(newValues, name, false);
                                                        if (validationErrors[name]) {
                                                            setValidationErrors(prev => {
                                                                const newErrors = { ...prev };
                                                                delete newErrors[name];
                                                                return newErrors;
                                                            });
                                                        }
                                                    }}
                                                    className={`${active ? 'bg-azure-50 text-azure-700' : 'text-azure-600'
                                                        } group flex w-full items-center rounded-lg px-3 py-2.5 text-sm transition-colors duration-150 text-left truncate`}
                                                    title={opt}
                                                >
                                                    <span className="truncate">{opt}</span>
                                                </button>
                                            )}
                                        </MenuItem>
                                    ))}
                                </MenuItems>
                            </Transition>
                        </Menu>
                    )}
                </div>

                {errorMessage && (
                    <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
                )}
            </div>
        );
    };

    const renderMultiSelectCheckbox = (
        label: string,
        name: string,
        options: string[],
        showComments?: boolean,
        required?: boolean,
        singleSelect?: boolean
    ) => {
        const isFieldReadOnly = calculateFieldReadOnly(name);
        const errorMessage = fieldErrors[name] || validationErrors[name];
        return (
            <div className="flex flex-col gap-1">
                <label
                    className={`text-xs font-medium mb-1 flex items-center ${errorMessage ? "text-red-500" : "text-azure-600"
                        }`}
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                    {renderLegend(name)}
                </label>
                <div className={`flex flex-col gap-2 w-full ${isFieldReadOnly ? 'opacity-70 pointer-events-none' : ''}`}>
                    {options.map((option) => (
                        <label
                            key={option}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-azure-100 shadow-sm transition-all w-full ${isFieldReadOnly ? 'bg-azure-50' : 'bg-white hover:shadow-md cursor-pointer'}`}
                        >
                            <input
                                type={singleSelect ? "radio" : "checkbox"}
                                value={option}
                                checked={
                                    Array.isArray(localValues[name]) &&
                                    localValues[name].includes(option)
                                }
                                onChange={(e) => {
                                    if (isFieldReadOnly) return;
                                    const checked = e.target.checked;

                                    // Fix: Do not call side effects in setLocalValues updater
                                    const current = Array.isArray(localValues[name]) ? localValues[name] : [];
                                    let newValue: string[];

                                    if (singleSelect) {
                                        newValue = [option];
                                    } else {
                                        newValue = checked
                                            ? [...current, option]
                                            : current.filter((val: string) => val !== option);
                                    }

                                    const newValues = { ...localValues, [name]: newValue };

                                    setLocalValues(newValues);
                                    onChange(newValues, name, false);

                                    // Clear validation error
                                    if (validationErrors[name]) {
                                        setValidationErrors(prevErr => {
                                            const newErrors = { ...prevErr };
                                            delete newErrors[name];
                                            return newErrors;
                                        });
                                    }
                                }}
                                disabled={isFieldReadOnly}
                                className={`accent-azure-700 h-4 w-4 border-azure-200 focus:ring-gold-500 ${singleSelect ? 'rounded-full' : 'rounded'}`}
                            />
                            <span className="text-sm text-azure-600">{option}</span>
                        </label>
                    ))}
                    {/* Handle "Other" text input */}
                    {options.some(opt => opt.toLowerCase().includes("other") &&
                        Array.isArray(localValues[name]) && localValues[name].includes(opt)) && (
                            <div className="ml-6 mt-1">
                                <input
                                    type="text"
                                    name={`${name}_other`}
                                    value={localValues[`${name}_other`] || ""}
                                    onChange={(e) => {
                                        if (isFieldReadOnly) return;
                                        const newValues = { ...localValues, [`${name}_other`]: e.target.value };
                                        setLocalValues(newValues);
                                        onChange(newValues, name, false);
                                    }}
                                    disabled={isFieldReadOnly}
                                    placeholder="Please state..."
                                    className={`w-full rounded-md border border-azure-200 px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gold-500 ${isFieldReadOnly ? "bg-azure-100 cursor-not-allowed" : "bg-white"
                                        }`}
                                />
                            </div>
                        )}
                </div>
                {errorMessage && (
                    <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
                )}
                {showComments && (
                    <div className="mt-3">
                        {renderTextArea("Comments", `${name}_comments`, 2, "Add any additional comments...")}
                    </div>
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
        const displayValue = isCommonField(name) ? getCommonFieldValue(name) : (localValues[name] || "");
        // Use workflow logic
        const isFieldReadOnly = calculateFieldReadOnly(name);
        const errorMessage = fieldErrors[name] || validationErrors[name];

        const adjustHeight = (el: HTMLTextAreaElement) => {
            el.style.height = 'auto';
            el.style.height = `${el.scrollHeight}px`;
        };

        return (
            <div className="flex flex-col gap-1">
                {label && (
                    <label className="text-xs font-medium text-azure-600 mb-1 flex items-center">
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                        {renderLegend(name)}
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
                        if (!isCommonField(name)) {
                            handleChange(e);
                            if (validationErrors[name]) {
                                setValidationErrors(prev => {
                                    const newErrors = { ...prev };
                                    delete newErrors[name];
                                    return newErrors;
                                });
                            }
                        }
                    }}
                    placeholder={placeholder}
                    rows={rows}
                    disabled={isFieldReadOnly}
                    className={`w-full rounded-lg border border-azure-100 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all placeholder-azure-300 resize-none overflow-hidden ${errorMessage
                        ? "border-red-300 bg-red-50"
                        : isFieldReadOnly
                            ? "bg-azure-100 text-azure-400 cursor-not-allowed border-azure-100"
                            : "bg-white hover:border-gold-300"
                        }`}
                />
            </div>
        );
    };

    const sigRefs = useRef<Record<string, any>>({});

    const renderSignature = (label: string, name: string, required?: boolean) => {
        const isFieldReadOnly = calculateFieldReadOnly(name);
        const errorMessage = fieldErrors[name] || validationErrors[name];
        return (
            <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-azure-600 flex items-center">
                    {label} {required && <span className="text-red-500 ml-1">*</span>}
                    {renderLegend(name)}
                </label>
                <div className={`border border-azure-200 rounded-lg overflow-hidden bg-white ${isFieldReadOnly ? 'opacity-70 pointer-events-none' : ''}`}>
                    <SignatureCanvas
                        ref={(el) => { sigRefs.current[name] = el; }}
                        onSignatureEnd={(signature: any) => {
                            if (isFieldReadOnly) return;
                            const newValues = { ...localValues, [name]: signature };
                            setLocalValues(newValues);
                            onChange(newValues, name, false);

                            // Clear validation error
                            if (validationErrors[name]) {
                                setValidationErrors(prev => {
                                    const newErrors = { ...prev };
                                    delete newErrors[name];
                                    return newErrors;
                                });
                            }
                        }}
                        existingSignature={localValues[name]}
                    />
                </div>
                {errorMessage && <p className="text-xs text-red-500">{errorMessage}</p>}
            </div>
        );
    };

    const isCurrentSectionComplete = () => {
        const section = FORM_SECTIONS[currentStep];
        // Use dynamic required fields
        const requiredFields = getDynamicRequiredFields(section.id);
        // Check ALL fields in the section, not just the base requiredFields
        const allFields = section.fields;

        for (const field of allFields) {
            // Skip validations for read-only fields
            if (calculateFieldReadOnly(field)) continue;

            // If not a signature link, staff can skip participant signatures
            if (!isSignatureLink) {
                const legend = FIELD_METADATA[field]?.legend;
                const isParticipantLegend = legend === 'Participant' || legend === 'Authorised Representative' || legend === 'Participant/Auth Rep';
                if (isParticipantLegend) continue;
            }

            // Check for conditional Participant/Auth Rep fields
            const meta = FIELD_METADATA[field];
            const required = meta?.required || requiredFields.includes(field) ||
                (FIELD_METADATA.participantSignerType && localValues.participantSignerType === 'Participant' && (field === 'participantSignature' || field === 'participantSignDate')) ||
                (FIELD_METADATA.participantSignerType && localValues.participantSignerType === 'Authorised Representative' && (field === 'authRepName' || field === 'authRepSignature' || field === 'authRepSignDate'));

            if (required) {
                const value = localValues[field];
                // For checkbox fields (arrays), check if array is empty
                const isEmpty = Array.isArray(value) ? value.length === 0 : !value;
                if (isEmpty) return false;
            }
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

    const validateField = (name: string, value: string): string | null => {
        if (!value) return null; // Only validate format if value exists

        const meta = FIELD_METADATA[name];
        if (!meta) return null;

        const val = String(value).trim();
        if (!val) return null;

        // Email Validation
        if (meta.type === 'email' || meta.inputType === 'email' || name.toLowerCase().includes('email')) {
            // More robust email regex
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(val)) return "Invalid email format (e.g., name@example.com)";
        }

        // Phone Validation
        if (meta.inputType === 'tel' || name.toLowerCase().includes('phone') || name.toLowerCase().includes('mobile')) {
            // Must contain at least 8 digits, allow spaces/+/-/()
            const phoneRegex = /^[\d\s\+\-\(\)]{8,20}$/;
            if (!phoneRegex.test(val)) return "Invalid phone format (minimum 8 digits)";
            // Strictly no letters
            if (/[a-zA-Z]/.test(val)) return "Phone number cannot contain letters";

            // Ensure there are actually some digits
            const digits = val.replace(/\D/g, '');
            if (digits.length < 8) return "Phone number must contain at least 8 digits";
        }

        return null;
    };

    const handleNextSequential = async () => {
        const section = FORM_SECTIONS[currentStep];
        const newFieldErrors: Record<string, string> = {};

        // Use dynamic required fields for "Required" check
        const requiredFields = getDynamicRequiredFields(section.id);
        const sectionFields = section.fields; // Check ALL fields in the section
        let isValid = true;

        sectionFields.forEach((field) => {
            // Skip validations for read-only fields
            if (calculateFieldReadOnly(field)) return;

            const value = localValues[field];

            // 1. Required Check
            const isRequired = requiredFields.includes(field) ||
                (FIELD_METADATA.participantSignerType && localValues.participantSignerType === 'Participant' && (field === 'participantSignature' || field === 'participantSignDate')) ||
                (FIELD_METADATA.participantSignerType && localValues.participantSignerType === 'Authorised Representative' && (field === 'authRepName' || field === 'authRepSignature' || field === 'authRepSignDate'));

            if (isRequired) {
                // For checkbox fields (arrays), check if array is empty
                const isEmpty = Array.isArray(value) ? value.length === 0 : !value;

                if (isEmpty) {
                    const label = FIELD_METADATA[field]?.label || field;
                    newFieldErrors[field] = `${label} is required`;
                    isValid = false;
                    return; // Stop checking this field if it's missing
                }
            }

            // 2. Format Check (if value exists)
            const formatError = validateField(field, value);
            if (formatError) {
                newFieldErrors[field] = formatError;
                isValid = false;
            }
        });

        if (!isValid) {
            setValidationErrors(newFieldErrors); // Use local validation error state
            showToast({
                type: "error",
                title: "Validation Error",
                message: "Please fill in all required fields correctly.",
                duration: 3000,
            });
            // Scroll to first error?
            return;
        }

        setNavigatingNext(true);

        // Auto-save on next
        if (handleSaveProgress) {
            try {
                await handleSaveProgress();
                // DO NOT update originalFormDataRef here - only update on final submit
                // This prevents premature stage transitions when navigating between sections
            } catch (error) {
                console.error("Auto-save failed:", error);
                // Optionally show toast? For now, continue navigation.
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

    const handleFinalSubmit = async () => {
        const section = FORM_SECTIONS[currentStep];
        const newFieldErrors: Record<string, string> = {};
        const requiredFields = getDynamicRequiredFields(section.id);
        const sectionFields = section.fields;
        let isValid = true;

        sectionFields.forEach((field) => {
            if (calculateFieldReadOnly(field)) return;

            const value = localValues[field];
            const isRequired = requiredFields.includes(field) ||
                (FIELD_METADATA.participantSignerType && localValues.participantSignerType === 'Participant' && (field === 'participantSignature' || field === 'participantSignDate')) ||
                (FIELD_METADATA.participantSignerType && localValues.participantSignerType === 'Authorised Representative' && (field === 'authRepName' || field === 'authRepSignature' || field === 'authRepSignDate'));

            if (isRequired) {
                // For checkbox fields (arrays), check if array is empty
                const isEmpty = Array.isArray(value) ? value.length === 0 : !value;

                if (isEmpty) {
                    const label = FIELD_METADATA[field]?.label || field;
                    newFieldErrors[field] = `${label} is required`;
                    isValid = false;
                    return;
                }
            }

            const formatError = validateField(field, value);
            if (formatError) {
                newFieldErrors[field] = formatError;
                isValid = false;
            }
        });

        if (!isValid) {
            setValidationErrors(newFieldErrors);
            showToast({
                type: "error",
                title: "Validation Error",
                message: "Please fill in all required fields correctly.",
                duration: 3000,
            });
            return;
        }

        if (handleSubmitForm) {
            await handleSubmitForm();
            // Update the saved data ref after successful submit
            originalFormDataRef.current = localValues;

            // Redirect after successful submission
            // Give user time to see the success toast (2 seconds)
            setTimeout(() => {
                if (params?.id) {
                    router.push(`/admin/clients/${params.id}/forms`);
                    router.refresh();
                } else if (window.opener) {
                    window.close();
                } else {
                    window.history.back();
                }
            }, 2000);
        }
    };

    return (
        <div className="">
            {/* Progress Bar */}
            <div className="w-full max-w-2xl mx-auto pt-2 md:pt-6 px-2">
                <div className="w-full h-2 bg-azure-200 rounded-full mb-4">
                    <div className="h-2 bg-gradient-to-r from-azure-600 to-emerald-400 rounded-full transition-all" style={{ width: `${((currentStep + 1) / FORM_SECTIONS.length) * 100}%` }} />
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
                                    className={`flex flex-col items-center min-w-[60px] px-2 focus:outline-none transition-all duration-200 ${active ? 'text-azure-700' : unlocked ? 'text-emerald-600' : 'text-azure-300 opacity-50 cursor-not-allowed'}`}
                                    aria-current={active ? 'step' : undefined}
                                    aria-label={section.title}
                                    disabled={!unlocked}
                                >
                                    <span className={`flex items-center justify-center w-8 h-8 rounded-full border-2 mb-1 ${active ? 'bg-azure-800 border-azure-600 text-white scale-110' : unlocked ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-azure-200 border-azure-200 text-azure-300'}`}>
                                        {completedSteps.has(idx)
                                            ? <FaCheck className="w-4 h-4" />
                                            : React.createElement(section.icon, { className: "w-4 h-4" })}
                                    </span>
                                    <span className="text-[10px] font-medium">{idx + 1}</span>
                                    {!unlocked && <span className="text-[10px] text-azure-300 mt-1">Locked</span>}
                                </button>
                                {/* Tooltip */}
                                <div className="absolute left-1/2 -translate-x-1/2 top-12 z-20 hidden group-hover:flex group-focus-within:flex flex-col items-center pointer-events-none">
                                    <span className="bg-azure-700 text-white text-xs rounded px-3 py-1 shadow-lg whitespace-nowrap max-w-xs text-center">
                                        {section.title}
                                    </span>
                                    <span className="w-2 h-2 bg-azure-700 rotate-45 mt-[-4px]"></span>
                                </div>
                            </div>
                        );
                    })}
                </nav>
            </div>

            <main className="w-full flex flex-col items-center justify-center flex-1">
                <section className="w-full max-w-2xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-azure-50 p-4 md:p-8 flex flex-col mt-2 md:mt-4 gap-4 md:gap-8">
                    <div className="mb-4">
                        <h2 className="text-xl md:text-2xl font-bold text-azure-700 flex items-center gap-3">
                            {React.createElement(FORM_SECTIONS[currentStep].icon, { className: "w-6 h-6 text-azure-700" })}
                            {FORM_SECTIONS[currentStep].title}
                        </h2>
                        <p className="text-sm text-azure-400 font-medium mt-1">{FORM_SECTIONS[currentStep].description}</p>
                    </div>

                    {/* Disclaimer for Participant Section */}
                    {FORM_SECTIONS[currentStep].id === "participant_declaration" && (
                        <div className="md:col-span-2 text-sm text-azure-500 space-y-4">
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
                            // Conditional Rendering for Participant/Auth Rep Signatures (ONLY in Declaration Section)
                            if (FORM_SECTIONS[currentStep].id === 'participant_declaration') {
                                if (field === 'participantName' || field === 'participantSignature' || field === 'participantSignDate') {
                                    if (localValues.participantSignerType !== 'Participant') return null;
                                }
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
                            if (meta.type === "suggestedInput") {
                                return <div key={field} className="md:col-span-2">{renderSuggestedInput(meta.label, field, meta.options || [], required, meta.inputType || "text")}</div>;
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
                                        <div className="md:col-span-2 mt-4 text-xs text-azure-400 border-t pt-4">
                                            <p className="mb-2">
                                                The <a href="https://www.ndiscommission.gov.au/about/ndis-code-conduct" target="_blank" rel="noopener noreferrer" className="text-azure-600 underline">NDIS Code of Conduct</a> promotes safe and ethical service delivery by setting out expectations for the conduct of both NDIS providers and workers.
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

                <footer className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-lg border-t border-azure-50 px-4 md:px-10 py-5 flex flex-col items-center gap-4 shadow-2xl rounded-b-3xl mt-2">
                    <div className="flex flex-col w-full gap-2 md:flex-row md:gap-3 md:justify-between">
                        <button
                            onClick={handlePreviousSequential}
                            disabled={currentStep === 0 || navigatingPrev}
                            className={`flex items-center justify-center space-x-1 px-5 py-2 rounded-full font-semibold transition-all text-sm shadow border duration-200 w-full md:w-1/3 ${currentStep === 0 || navigatingPrev ? "bg-azure-100 text-azure-300 cursor-not-allowed border-azure-100" : "bg-gradient-to-r from-azure-600 to-azure-800 text-white hover:from-azure-700 hover:to-black"}`}
                        >
                            {navigatingPrev ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaChevronLeft className="w-4 h-4" />}
                            <span>Previous</span>
                        </button>

                        <button
                            onClick={handleNextSequential}
                            disabled={currentStep === FORM_SECTIONS.length - 1 || !isCurrentSectionComplete() || navigatingNext}
                            className={`flex items-center justify-center space-x-1 px-5 py-2 rounded-full font-semibold transition-all text-sm shadow border duration-200 w-full md:w-1/3 ${currentStep === FORM_SECTIONS.length - 1 || !isCurrentSectionComplete() || navigatingNext ? "bg-azure-100 text-azure-300 cursor-not-allowed border-azure-100" : "bg-gradient-to-r from-azure-700 to-emerald-400 text-white hover:from-azure-800 hover:to-emerald-500"}`}
                        >
                            <span>Next</span>
                            {navigatingNext ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaChevronRight className="w-4 h-4" />}
                        </button>

                        <button
                            onClick={() => handleSaveProgress && handleSaveProgress()}
                            disabled={saving}
                            className="flex items-center justify-center gap-1 px-5 py-2 rounded-full font-semibold text-sm bg-azure-500 hover:bg-azure-600 text-white shadow border border-azure-600 transition-all duration-200 w-full md:w-1/3"
                        >
                            {saving ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaSave className="w-4 h-4" />}
                            <span>Save Progress</span>
                        </button>
                    </div>
                    {currentStep === FORM_SECTIONS.length - 1 && (
                        <button
                            onClick={handleFinalSubmit}
                            disabled={!isCurrentSectionComplete() || saving}
                            className={`w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 rounded-full font-semibold text-sm shadow transition ${!isCurrentSectionComplete() || saving
                                ? "bg-azure-100 text-azure-300 cursor-not-allowed border border-azure-100"
                                : "bg-gradient-to-r from-azure-600 to-emerald-400 text-white hover:from-azure-700 hover:to-emerald-500"
                                }`}
                        >
                            {saving ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaCheck className="w-4 h-4" />}
                            <span>{saving ? "Submitting..." : "Submit Form"}</span>
                        </button>
                    )}
                </footer>
            </main>
        </div>
    );
};

export default ConflictOfInterestEdit;
