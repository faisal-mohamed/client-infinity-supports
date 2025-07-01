"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getFormBatchByToken, saveFormDataByToken, updateCommonFields, getFormDataByToken } from "@/lib/api";
import { getValidationForForm } from "@/app/components/forms/FormValidation";
import {
  FaCheck,
  FaExclamationTriangle,
  FaSave,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import DynamicFormRenderer from "@/app/components/DynamicFormRenderer";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/Confirm";
import Modal from '@/components/ui/Modal';

// Helper to format time difference as 'X ago'
function formatTimeAgo(date: Date | null) {
  if (!date) return "Not saved yet.";
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 5) return "just now";
  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return date.toLocaleString();
}

// Add field label metadata and mapping for user-friendly confirmation modals
const FIELD_METADATA: Record<string, any> = {
  ndisNumber: { label: "NDIS Number" },
  givenName: { label: "Given Name" },
  surname: { label: "Surname" },
  preferredName: { label: "Preferred Name" },
  dateOfBirth: { label: "Date of Birth" },
  sex: { label: "Sex" },
  pronoun: { label: "Pronoun" },
  aboriginalTorres: { label: "Aboriginal or Torres Strait Islander?" },
  addressNumberStreet: { label: "Address (Number/Street)" },
  state: { label: "State" },
  postcode: { label: "Postcode" },
  email: { label: "Email" },
  homePhone: { label: "Home Phone" },
  mobile: { label: "Mobile" },
  disabilityConditions: { label: "Disability Conditions/Disability type(s)" },
};
const commonFieldsMapping: Record<string, string> = {
  ndisNumber: "ndis",
  givenName: "name",
  sex: "sex",
  dateOfBirth: "dob",
  addressNumberStreet: "street",
  state: "state",
  postcode: "postCode",
  email: "email",
  homePhone: "phone",
  disabilityConditions: "disability",
};

export default function FormViewClient({ token }: { token: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const confirm = useConfirm();
  const { showToast } = useToast();

  // New state for batch-oriented data
  const [batchData, setBatchData] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [passcode, setPasscode] = useState<string | null>(null);

  // State for the current form's values and status
  const [formValues, setFormValues] = useState<any>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  
  // State for tracking common field changes
  const [pendingCommonFieldChanges, setPendingCommonFieldChanges] = useState<Record<string, any>>({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  // Derived state for the current form
  const currentForm = batchData?.forms ? batchData.forms[currentStep] : null;

  const [showExpiredModal, setShowExpiredModal] = useState(false);

  useEffect(() => {
    console.log("batchData", batchData);
  }, [batchData]);

  const [refreshKey, setRefreshKey] = useState(0);

  const handleCommonFieldsUpdated = () => {
    setRefreshKey((k) => k + 1);
  };

  useEffect(() => {
    console.log("currentForm", currentForm);
  }, [currentForm]);

  // Effect to parse URL and set initial state
  useEffect(() => {
    const urlPasscode = searchParams.get("passcode");
    const step = parseInt(searchParams.get("step") || "0", 10);
    
    setPasscode(urlPasscode);
    setCurrentStep(step);
  }, [searchParams]);

  // Effect to load the entire batch data
  useEffect(() => {
    if (!passcode || !token) return;

    const loadBatchData = async () => {
      try {
        setLoading(true);
        const data = await getFormBatchByToken(token, passcode);
        setBatchData(data);
        // Fetch the latest form data for the current form using batchToken and formId
        if (data.forms && data.forms[currentStep]) {
          const formId = data.forms[currentStep].formId;
          try {
            const formDataResp = await getFormDataByToken(token, formId, passcode);
            setFormValues(formDataResp.formData || {});
          } catch (err) {
            setFormValues({});
          }
        } else {
          setFormValues({});
        }
        setError("");
      } catch (err: any) {
        setError(err.message || "Failed to load form data");
      } finally {
        setLoading(false);
      }
    };

    loadBatchData();
  }, [token, passcode, currentStep, refreshKey]);

  const confirmAndUpdateCommonFields = async () => {
    const changedFields = Object.keys(pendingCommonFieldChanges);
    if (changedFields.length === 0) {
      return true; // No changes to confirm
    }
    // Build a user-friendly list of changed fields and their new values
    const fieldList = changedFields.map((key) => {
      // Find the form field name from the mapping
      const formFieldEntry = Object.entries(commonFieldsMapping).find(([_formKey, commonKey]) => commonKey === key);
      const formField = formFieldEntry ? formFieldEntry[0] : undefined;
      // Get the user-friendly label
      const label = formField && FIELD_METADATA[formField] ? FIELD_METADATA[formField].label : formField || key;
      // Get the new value
      const value = pendingCommonFieldChanges[key];
      return `- ${label}: ${value}`;
    }).join("\n");
    const confirmed = await confirm.confirm({
      title: "Confirm Common Field Changes",
      message: `You are about to update the following common fields. These changes will be reflected across all forms.\n\n${fieldList}`,
      confirmText: "Update and Continue",
    });
    if (confirmed) {
      try {
        await updateCommonFields(token, pendingCommonFieldChanges, passcode || undefined);
        showToast({
          type: "success",
          title: "Common Fields Updated",
          message: "The shared information has been updated for all forms.",
        });
        setPendingCommonFieldChanges({});
        return true;
      } catch (err: any) {
        setError(err.message || "Failed to update common fields.");
        return false;
      }
    }
    return false; // User cancelled
  };

  const handleSave = async (submit: boolean = false) => {
    // Show confirmation modal if there are pending common field changes
    const canProceed = await confirmAndUpdateCommonFields();
    if (!canProceed) {
      setSaving(false);
      setSubmitting(false);
      return;
    }
    try {
      setError("");
      setFieldErrors({});
      if (submit) {
        const validateForm = getValidationForForm(currentForm.formKey);
        const validationResult = validateForm(formValues);
        if (!validationResult.isValid) {
          setFieldErrors(validationResult.errors);
          showToast({
            type: "error",
            title: "Validation Error",
            message: "Please correct the errors in the forms",
            duration: 3000,
          });
          return;
        }
        setSubmitting(true);
      } else {
        setSaving(true);
      }
      await saveFormDataByToken(
        token,
        {
          formId: currentForm.formId,
          data: formValues,
          isSubmitted: submit,
        },
        passcode || undefined
      );
      setLastSavedAt(new Date());
      if (submit) {
        showToast({
          type: "success",
          title: "Form Submitted",
          message: "Your form has been successfully submitted.",
          duration: 3000,
        });
        setTimeout(() => {
          if (currentStep < batchData.forms.length - 1) {
            router.push(
              `/forms/view-form/${token}?passcode=${encodeURIComponent(
                passcode || ""
              )}&step=${currentStep + 1}`
            );
          } else {
            router.push(
              `/forms/view-form/${token}/batch-signature?passcode=${encodeURIComponent(
                passcode || ""
              )}`
            );
          }
        }, 1500);
      } else {
        showToast({
          type: "info",
          title: "Progress Saved",
          message: "Your changes have been saved.",
          duration: 3000,
        });
      }
    } catch (err: any) {
      if (err.message && err.message.includes('Access link has expired')) {
        setShowExpiredModal(true);
      } else {
        setError(err.message || "Failed to save form");
        console.error(err);
      }
    } finally {
      setSaving(false);
      setSubmitting(false);
    }
  };

  const handleFormChange = (newValues: any, fieldName: string, isCommon: boolean) => {
    setFormValues(newValues);

    if (isCommon) {
      const commonKey = batchData?.client?.commonFields?.[0] ? Object.keys(batchData.client.commonFields[0]).find(k => k === fieldName) : undefined;
      const originalValue = batchData?.client?.commonFields?.[0]?.[fieldName];

      if (originalValue !== newValues[fieldName]) {
        setPendingCommonFieldChanges(prev => ({
          ...prev,
          [fieldName]: newValues[fieldName],
        }));
      } else {
        // If the user reverts the change, remove it from pending
        const { [fieldName]: _, ...rest } = pendingCommonFieldChanges;
        setPendingCommonFieldChanges(rest);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Add a guard to ensure batchData and currentForm are loaded
  if (!batchData || !currentForm) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-100 p-3">
              <FaExclamationTriangle className="text-red-600 text-3xl" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-center text-gray-900 mb-2">
            Error Loading Form
          </h1>
          <p className="text-gray-600 text-center mb-6">{error || "The form could not be loaded. Please check the URL and try again."}</p>
        </div>
      </div>
    );
  }

  if (currentForm.isExpired) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-100 p-3">
              <FaExclamationTriangle className="text-red-600 text-3xl" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-center text-gray-900 mb-2">
            Form Expired
          </h1>
          <p className="text-gray-600 text-center mb-6">
            This form has expired and is no longer available for submission. Please contact the administrator.  
          </p>
        </div>
      </div>
    );
  }

  if (currentForm && currentForm.isCompleted && !(currentStep < batchData.forms.length - 1)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full border border-gray-100">
          <div className="px-4 md:px-8 pt-6 pb-4 border-b border-gray-100 bg-gradient-to-r from-white via-blue-50 to-green-50 rounded-t-2xl shadow-sm">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {currentForm?.title}
            </h1>
            <p className="mt-2 text-base md:text-lg text-gray-500 font-medium flex items-center gap-2">
              <span className="inline-flex items-center gap-1">
                <FaSave className="w-4 h-4 text-gray-400" />
                Last saved: {formatTimeAgo(lastSavedAt)}
              </span>
            </p>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="mb-6">
              <DynamicFormRenderer
                formKey={currentForm.formKey}
                formSchema={currentForm.schema}
                formData={formValues}
                commonFieldsData={batchData?.client?.commonFields?.[0] || {}}
                onChange={handleFormChange}
                onSubmit={() => handleSave(true)}
                readOnly={currentForm.isCompleted}
                fieldErrors={fieldErrors}
                handleSave={() => handleSave(false)}
                token={token}
                onCommonFieldsUpdated={handleCommonFieldsUpdated}
              />
            </div>

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => handleSave(true)}
                disabled={saving || submitting}
                className="flex items-center gap-2 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
              >
                {submitting ? "Submitting..." : "Submit All Forms"}
                <FaCheck />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Only render one DynamicFormRenderer for the active form
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-4 md:px-8 pt-6 pb-4 border-b border-gray-100 bg-gradient-to-r from-white via-blue-50 to-green-50 rounded-t-2xl shadow-sm">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {currentForm?.title}
            </h1>
            <p className="mt-2 text-base md:text-lg text-gray-500 font-medium flex items-center gap-2">
              <span className="inline-flex items-center gap-1">
                <FaSave className="w-4 h-4 text-gray-400" />
                Last saved: {formatTimeAgo(lastSavedAt)}
              </span>
            </p>
          </div>

          <div className="p-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            {currentForm.success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {currentForm.success}
              </div>
            )}

            <div className="mb-6">
              <DynamicFormRenderer
                formKey={currentForm.formKey}
                formSchema={currentForm.schema}
                formData={formValues}
                commonFieldsData={batchData?.client?.commonFields?.[0] || {}}
                onChange={handleFormChange}
                onSubmit={() => handleSave(true)}
                readOnly={currentForm.isCompleted}
                fieldErrors={fieldErrors}
                handleSave={() => handleSave(false)}
                token={token}
                onCommonFieldsUpdated={handleCommonFieldsUpdated}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
