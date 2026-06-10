// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getStaffFormComponent } from '@/app/forms/staff-registry';
import { useToast } from '@/components/ui/Toast';
import { 
  FaSignature, FaCheck, FaClock, FaSpinner, FaArrowLeft,
  FaExclamationCircle, FaInfoCircle
} from 'react-icons/fa';
import LoadingView from '@/components/ui/LoadingView';

interface FormSignatureData {
  formSubmission: {
    id: number;
    data: any;
    staffSignature?: string;
    staffSignedAt?: string;
    form: {
      id: number;
      formKey: string;
      title: string;
      requiresSignature?: boolean;
    };
  };
  staff: {
    id: number;
    firstName: string;
    surname: string;
    email: string;
    name: string;
    commonFields?: any[];
  };
  batchToken: string;
  isExpired: boolean;
}

export default function StaffFormSignaturePageClient() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  const formSubmissionId = params.formSubmissionId as string;
  const { showToast } = useToast();

  const [formData, setFormData] = useState<FormSignatureData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editedFormValues, setEditedFormValues] = useState<any>({});

  useEffect(() => {
    loadFormData();
  }, [token, formSubmissionId]);

  const loadFormData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/staff/signature/${token}/${formSubmissionId}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Form not found or access denied");
        } else if (response.status === 410) {
          throw new Error("This signature link has expired");
        }
        throw new Error("Failed to load form data");
      }

      const data = await response.json();
      setFormData(data);
      setEditedFormValues(data?.formSubmission?.data || {});
    } catch (error: any) {
      console.error("Error loading form data:", error);
      setError(error.message || "Failed to load form data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/staff/signature/${token}/${formSubmissionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData: editedFormValues }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save form');
      }

      showToast({
        type: 'success',
        title: 'Form Saved',
        message: 'Your progress has been saved successfully.',
        duration: 3000,
      });

      // Reload to get updated data
      await loadFormData();
    } catch (error: any) {
      console.error('Error saving form:', error);
      showToast({
        type: 'error',
        title: 'Save Failed',
        message: error.message || 'Failed to save form. Please try again.',
        duration: 5000,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitSignature = async (signature: string, signatureId: string, signerName?: string) => {
    if (!formData) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/staff/signature/${token}/${formSubmissionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData: editedFormValues,
          signature: signature,
          signatureId: signatureId,
          signedAt: new Date().toISOString(),
          signerName: signerName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit signature');
      }

      const result = await response.json();

      showToast({
        type: 'success',
        title: 'Form Signed',
        message: result.batchComplete 
          ? 'All forms completed! Thank you.' 
          : 'Form signed successfully.',
        duration: 3000,
      });

      // Redirect back to portal
      setTimeout(() => {
        router.push(`/staff/signature/${token}`);
      }, 2000);
    } catch (error: any) {
      console.error('Error submitting signature:', error);
      showToast({
        type: 'error',
        title: 'Signature Failed',
        message: error.message || 'Failed to submit signature. Please try again.',
        duration: 5000,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingView title="Loading Form" message="Please wait..." />;
  }

  if (error) {
    return (
      <div className=" flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center bg-white rounded-xl shadow-soft p-6 sm:p-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <FaExclamationCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-azure-700 mb-3 sm:mb-4">Error</h1>
          <p className="text-sm sm:text-base text-azure-400 mb-4 sm:mb-6">{error}</p>
          <button
            onClick={() => router.push(`/staff/signature/${token}`)}
            className="w-full bg-azure-600 to-azure-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:from-azure-700 hover:to-azure-700 transition-all duration-200"
          >
            Back to Forms
          </button>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className=" flex justify-center items-center">
        <p className="text-azure-400">No form data found.</p>
      </div>
    );
  }

  const formKey = formData.formSubmission.form.formKey;
  const requiresSignature = formData.formSubmission.form.requiresSignature;
  const isSigned = formData.formSubmission.staffSignature && formData.formSubmission.staffSignature !== null;
  
  // Get the form component (prefer edit if available, otherwise view)
  let FormComponent;
  try {
    FormComponent = getStaffFormComponent(formKey, 'edit');
  } catch {
    try {
      FormComponent = getStaffFormComponent(formKey, 'view');
    } catch {
      return (
        <div className=" flex justify-center items-center">
          <p className="text-azure-400">Form component not found for: {formKey}</p>
        </div>
      );
    }
  }

  const commonFieldsData = formData.staff.commonFields?.[0] || {};

  return (
    <div className="">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-soft overflow-hidden mb-6">
          <div className="bg-azure-600 via-azure-600 to-azure-600 px-4 sm:px-8 py-4 sm:py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push(`/staff/signature/${token}`)}
                  className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FaArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">
                    {formData.formSubmission.form.title}
                  </h1>
                  <p className="text-azure-100 text-sm mt-1">
                    {formData.staff.name}
                  </p>
                </div>
              </div>
              {isSigned && (
                <div className="flex items-center gap-2 bg-emerald-500/20 px-4 py-2 rounded-lg">
                  <FaCheck className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">Signed</span>
                </div>
              )}
            </div>
          </div>

          {/* Status Info */}
          <div className="px-4 sm:px-8 py-4 bg-azure-50 border-b border-azure-200">
            {requiresSignature ? (
              isSigned ? (
                <div className="flex items-center text-emerald-600">
                  <FaCheck className="h-5 w-5 mr-2" />
                  <span className="font-medium">This form has been signed</span>
                  {formData.formSubmission.staffSignedAt && (
                    <span className="ml-2 text-sm text-azure-400">
                      on {new Date(formData.formSubmission.staffSignedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center text-gold-600">
                  <FaClock className="h-5 w-5 mr-2" />
                  <span className="font-medium">Signature Required</span>
                </div>
              )
            ) : (
              <div className="flex items-center text-azure-600">
                <FaInfoCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">View Only - No signature required</span>
              </div>
            )}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-soft p-6 sm:p-8 mb-6">
          <FormComponent
            data={editedFormValues}
            staffId={formData.staff.id.toString()}
            readOnly={isSigned} // Make read-only if already signed
            isSignatureLink={true} // Indicate this is signature link mode
            commonFieldsData={commonFieldsData}
            onChange={(values: any) => {
              if (!isSigned) {
                setEditedFormValues(values);
              }
            }}
            onSubmit={handleSubmitSignature}
            onSave={handleSave}
            existingSignature={formData.formSubmission.staffSignature}
            signatureDate={formData.formSubmission.staffSignedAt}
          />
        </div>

        {/* Action Buttons */}
        {!isSigned && (
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 border-2 border-azure-300 text-azure-600 rounded-lg font-medium hover:bg-azure-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <FaSpinner className="inline-block mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Progress'
                )}
              </button>
              {requiresSignature && (
                <button
                  onClick={() => {
                    // Trigger signature - this will be handled by the form component
                    // For now, just show a message
                    showToast({
                      type: 'info',
                      title: 'Sign Form',
                      message: 'Please use the signature field in the form above to sign.',
                      duration: 3000,
                    });
                  }}
                  className="px-6 py-3 bg-azure-600 to-azure-700 text-white rounded-lg font-medium hover:from-azure-700 hover:to-azure-700 transition-colors"
                >
                  <FaSignature className="inline-block mr-2" />
                  Sign Form
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

