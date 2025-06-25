"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getFormDataByToken, saveFormDataByToken } from "@/lib/api";
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

export default function FormViewClient({ token }: { token: string }) {
  const router = useRouter();

  const [formData, setFormData] = useState<any>(null);
  const [formValues, setFormValues] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [passcode, setPasscode] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const { showToast } = useToast();
  // Extract passcode from URL query param
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlPasscode = urlParams.get("passcode");
    if (urlPasscode) {
      setPasscode(urlPasscode);
    }
  }, []);

  // Load form data
  useEffect(() => {
    if (!passcode) return; // Don't load data until passcode is available

    const loadFormData = async () => {
      try {
        setLoading(true);
        const data = await getFormDataByToken(token, passcode);
        console.log("DATA: ", data);
        setFormData(data);

        const now = new Date();
        const expiryDate = new Date(data.assignment.expiresAt);
        setIsExpired(expiryDate < now);
        setIsSubmitted(data.isSubmitted);
        setFormValues(data.formData || {});
        setError("");
        setLastSavedAt(data.lastSavedAt ? new Date(data.lastSavedAt) : null);
      } catch (err: any) {
        setError(err.message || "Failed to load form");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadFormData();
  }, [token, passcode]);

  const handleSave = async (submit: boolean = false) => {
    try {
      setError("");
      setFieldErrors({});

      if (submit) {
        const validateForm = getValidationForForm(formData.form.formKey);
        const validationResult = validateForm(formValues);

        console.log("validation result ", validationResult);

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
          data: formValues,
          isSubmitted: submit,
        },
        passcode || undefined
      );

      setLastSavedAt(new Date());

      if (submit) {
        setIsSubmitted(true);
        setSuccess("Form submitted successfully!");

        setTimeout(() => {
          if (formData.navigation.nextForm) {
            router.push(
              `/forms/view-form/${formData.navigation.nextForm.accessToken}${
                passcode ? `?passcode=${passcode}` : ""
              }`
            );
          } else if (formData.navigation.batchToken) {
            // Redirect to batch signature step if batchToken exists
            router.push(
              `/forms/view-form/${formData.navigation.batchToken}/batch-signature?passcode=${encodeURIComponent(
                passcode || ""
              )}`
            );
          } else {
            // fallback: completed page
            router.push(
              `/forms/completed/${formData.navigation.batchToken}?passcode=${encodeURIComponent(
                passcode || ""
              )}`
            );
          }
        }, 1500);
      } else {
        setSuccess("Progress saved successfully!");
        showToast({
          type: "info",
          title: "Data Saved",
          message: "Your changes have been saved. You can continue working or close this window.",
          duration: 3000,
        });
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to save form");
      console.error(err);
    } finally {
      setSaving(false);
      setSubmitting(false);
    }
  };

  const handleFormChange = (newValues: any) => {
    setFormValues(newValues);
  };

  const navigateToPreviousForm = () => {
    if (formData.navigation.previousForm) {
      router.push(
        `/forms/view-form/${formData.navigation.previousForm.accessToken}?passcode=${encodeURIComponent(
          passcode || ""
        )}`
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isExpired) {
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
            This form has expired and is no longer available for submission.
          </p>
        </div>
      </div>
    );
  }

  if (isSubmitted && !formData.navigation.nextForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border border-green-100 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-5 shadow-lg animate-bounce-slow">
              <FaCheck className="text-green-600 text-5xl" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-center text-green-700 mb-2 tracking-tight">
            Form Submitted!
          </h1>
          <p className="text-gray-600 text-center mb-8 text-lg">
            Thank you! Your form has been <span className="text-green-600 font-semibold">successfully submitted</span>.
          </p>
          {/* {formData.navigation.batchToken && (
            <button
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-green-400 hover:from-blue-700 hover:to-green-500 text-white py-3 px-4 rounded-full font-bold text-lg shadow transition"
            >
              <FaCheck className="w-5 h-5" />
              View All Forms
            </button>
          )} */}
        </div>
        <style jsx>{`
          .animate-bounce-slow {
            animation: bounce 1.5s infinite;
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0);}
            50% { transform: translateY(-10px);}
          }
          .animate-fade-in {
            animation: fade-in 0.8s cubic-bezier(0.4, 0, 0.2, 1) both;
          }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(24px);}
            to { opacity: 1; transform: none;}
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-4 md:px-8 pt-6 pb-4 border-b border-gray-100 bg-gradient-to-r from-white via-blue-50 to-green-50 rounded-t-2xl shadow-sm">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {formData?.form?.title}
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
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}

            <div className="mb-6">
              <DynamicFormRenderer
                formKey={formData.form.formKey}
                formSchema={formData.form.schema}
                formData={formValues}
                commonFieldsData={formData.commonFields || {}}
                onChange={handleFormChange}
                onSubmit={() => handleSave(true)}
                readOnly={isSubmitted}
                fieldErrors={fieldErrors}
                handleSave={handleSave}
              />
            </div>

            <div className="flex justify-between">
              {formData.navigation.previousForm ? (
                <button
                  onClick={navigateToPreviousForm}
                  className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md flex items-center"
                >
                  <FaArrowLeft className="mr-2" /> Previous Form
                </button>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
