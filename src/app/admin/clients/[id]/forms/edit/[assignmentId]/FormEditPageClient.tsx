"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { useToast } from '@/components/ui/Toast';
import { getFormComponent } from '@/app/forms/registry';
import StaffNotSubmittedModal from '@/components/ui/StaffNotSubmittedModal';


// Types
interface FormAssignmentData {
  id: number;
  clientId: number;
  formId: number;
  formVersion: number;
  filledByAdmin: boolean; // Check if filled by admin vs client
  hasSubmission: boolean; // NEW: Check if submission data exists
  form: {
    formKey: string;
    title: string;
    schema: any;
  };
  client: {
    name: string;
    email: string;
  };
  existingData?: any; // Existing FormSubmission data if available
}

export default function FormEditPageClient() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [showStaffNotSubmittedModal, setShowStaffNotSubmittedModal] = useState(false);

  const clientId = parseInt(params.id as string);
  const assignmentId = parseInt(params.assignmentId as string);

  const [assignment, setAssignment] = useState<FormAssignmentData | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [commonFieldsData, setCommonFieldsData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [navigatingNext, setNavigatingNext] = useState(false); // For Next button only
  const [navigatingPrev, setNavigatingPrev] = useState(false); // For Previous button only

  // Load assignment and existing data
  useEffect(() => {
    loadAssignmentData();
  }, [assignmentId]);

  const loadAssignmentData = async () => {
    try {
      setLoading(true);

      // Get assignment details and existing submission data
      const response = await fetch(`/api/form-assignments/${assignmentId}`);
      if (!response.ok) throw new Error('Failed to load assignment data');

      const data = await response.json();
      console.log('Loaded assignment data:', data);
      console.log('hasSubmission:', data.assignment?.hasSubmission);
      console.log('filledByAdmin:', data.assignment?.filledByAdmin);
      console.log('staffSignature exists:', !!data.existingData?.supportWorkerSignature);
      setAssignment(data.assignment);
      setFormData(data.existingData || {});
      setCommonFieldsData(data.commonFields || {});

    } catch (error) {
      console.error('Error loading assignment data:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load form data',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (values: any, field?: string, isCommon?: boolean, fullReplace?: boolean) => {
    if (isCommon) {
      setCommonFieldsData((prev: any) => ({ ...prev, ...values }));
    } else {
      // If fullReplace is true, replace the entire formData instead of merging
      if (fullReplace) {
        setFormData(values);
      } else {
        setFormData((prev: any) => ({ ...prev, ...values }));
      }
    }
  };

  // 🎯 SEPARATE SAVE PROGRESS FUNCTION (for Save Progress button)
  const handleSaveProgress = async (overrideFormData?: any, overrideCommonFields?: any) => {
    if (!assignment) return;
    try {
      setSaving(true);

      // Use override values if provided, otherwise use state values
      const dataToSave = {
        formData: overrideFormData || formData,
        commonFieldsData: overrideCommonFields || commonFieldsData,
      };

      const response = await fetch(`/api/form-assignments/${assignmentId}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });

      if (!response.ok) throw new Error('Failed to save form data');

      const result = await response.json();
      console.log('Save progress result:', result);

      // Update local state if override data was provided
      if (overrideFormData) {
        setFormData(overrideFormData);
      }
      if (overrideCommonFields) {
        setCommonFieldsData(overrideCommonFields);
      }

      showToast({
        type: 'success',
        title: 'Progress Saved',
        message: 'Your progress has been saved',
        duration: 3000,
      });


    } catch (error) {
      console.error('Error saving form:', error);
      showToast({
        type: 'error',
        title: 'Save Failed',
        message: 'Failed to save progress',
        duration: 3000,
      });
    } finally {
      setSaving(false);
    }
  };

  // 🎯 SAVE FOR NEXT BUTTON
  const handleSaveForNext = async () => {
    if (!assignment) return;
    try {
      setNavigatingNext(true);

      const response = await fetch(`/api/form-assignments/${assignmentId}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData,
          commonFieldsData,
        }),
      });

      if (!response.ok) throw new Error('Failed to save form data');

      const result = await response.json();
      console.log('Save for next result:', result);

    } catch (error) {
      console.error('Error saving form:', error);
      showToast({
        type: 'error',
        title: 'Save Failed',
        message: 'Failed to save progress',
        duration: 3000,
      });
    } finally {
      setNavigatingNext(false);
    }
  };

  // 🎯 SAVE FOR PREVIOUS BUTTON
  const handleSaveForPrev = async () => {
    if (!assignment) return;
    try {
      setNavigatingPrev(true);

      const response = await fetch(`/api/form-assignments/${assignmentId}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData,
          commonFieldsData,
        }),
      });

      if (!response.ok) throw new Error('Failed to save form data');

      const result = await response.json();
      console.log('Save for previous result:', result);

    } catch (error) {
      console.error('Error saving form:', error);
      showToast({
        type: 'error',
        title: 'Save Failed',
        message: 'Failed to save progress',
        duration: 3000,
      });
    } finally {
      setNavigatingPrev(false);
    }
  };

  // 🎯 SEPARATE SUBMIT FORM FUNCTION
  const handleSubmitForm = async () => {
    if (!assignment) return;
    try {
      setSaving(true); // Using same loading state for now

      const response = await fetch(`/api/form-assignments/${assignmentId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData,
          commonFieldsData,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit form');

      const result = await response.json();
      console.log('Submit form result:', result);

      if (result.success) {
        showToast({
          type: 'success',
          title: 'Form Submitted',
          message: result.message,
          duration: 3000,
        });

        // Navigate back to forms list after successful submission
        setTimeout(() => {
          router.push(`/admin/clients/${clientId}/forms`);
        }, 1000);

      } else {
        // Submission failed due to missing requirements
        showToast({
          type: 'warning',
          title: result.signatureStatus?.missingSignatures?.length > 0 ? 'Notification' : 'Submission Failed',
          message: result.message,
          duration: 5000,
        });
      }

    } catch (error) {
      console.error('Error submitting form:', error);
      showToast({
        type: 'error',
        title: 'Submit Failed',
        message: 'Failed to submit form',
        duration: 3000,
      });
    } finally {
      setSaving(false);
    }
  };

  // 🎯 LEGACY FUNCTION (keep for backward compatibility)
  const handleSave = async (submit: boolean = false) => {
    if (submit) {
      await handleSubmitForm();
    } else {
      await handleSaveProgress();
    }
  };

  // Handle form submission (when submit button is clicked)
  const handleFormSubmit = async (formValues: any) => {
    // Update local state with the latest form values
    setFormData((prev: any) => ({ ...prev, ...formValues }));

    // Call save with submit = true
    await handleSave(true);
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-azure-50 to-azure-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-t-azure-600 border-azure-200 rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-xl font-bold text-azure-700 mb-2">Loading Edit template</h3>
          <p className="text-azure-500 font-medium">Please wait...</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-azure-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-azure-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-azure-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-azure-700 mb-4">Form Not Found</h1>
          <Link
            href={`/admin/clients/${clientId}/forms`}
            className="text-azure-700 hover:text-azure-800"
          >
            Back to Forms List
          </Link>
        </div>
      </div>
    );
  }

  // NEW: Check if we need to block admin from editing
  // Block if: form sent via link (filledByAdmin=false) AND staff hasn't submitted their portion yet
  // ONLY for Emergency Drill: check if support worker signature exists - if yes, staff submitted
  const staffHasSubmitted = formData?.supportWorkerSignature || formData?.clientSignature;
  const isWaitingForStaff = assignment.form.formKey === 'emergency_drill' &&
    !assignment.filledByAdmin &&
    assignment.hasSubmission &&
    !staffHasSubmitted;

  if (isWaitingForStaff) {
    // Show modal and block access - signature link sent but staff hasn't submitted
    return (
      <>
        <div className="bg-white shadow-sm border-b border-azure-100">
          <div className="max-w-full px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link
                  href={`/admin/clients/${clientId}/forms`}
                  className="flex items-center px-3 py-2 text-azure-500 hover:text-azure-700 hover:bg-azure-100 rounded-lg transition-colors mr-4"
                >
                  <FaArrowLeft className="h-4 w-4 mr-2" />
                  Back to Forms
                </Link>
                <div className="border-l border-azure-200 pl-4">
                  <h1 className="text-xl font-semibold text-azure-700">
                    Edit: {assignment?.form.title}
                  </h1>
                  <p className="text-sm text-azure-500">
                    {assignment?.client.name} • {assignment?.client.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <StaffNotSubmittedModal
          isOpen={true}
          onClose={() => router.push(`/admin/clients/${clientId}/forms`)}
          formTitle={assignment.form.title}
        />
      </>
    );
  }

  // Get the appropriate form component from registry
  let FormEditComponent;
  try {
    FormEditComponent = getFormComponent(assignment.form.formKey, 'edit');
  } catch (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-azure-700 mb-4">Form Component Not Found</h1>
          <p className="text-azure-500 mb-4">
            No edit component found for form: {assignment.form.formKey}
          </p>
          <Link
            href={`/admin/clients/${clientId}/forms`}
            className="text-azure-700 hover:text-azure-800"
          >
            Back to Forms List
          </Link>
        </div>
      </div>
    );
  }

  // Calculate props once to avoid re-executing on every render
  const filledByClient = assignment ? (assignment.form.formKey === 'emergency_drill' && assignment.hasSubmission && (formData?.supportWorkerSignature || formData?.clientSignature)) : false;
  const readOnly = assignment ? (assignment.form.formKey === 'emergency_drill' && assignment.hasSubmission && (formData?.supportWorkerSignature || formData?.clientSignature)) : false;

  return (
    <>
      {/* Minimal Header Bar */}
      <div className="bg-white shadow-sm border-b border-azure-100">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href={`/admin/clients/${clientId}/forms`}
                className="flex items-center px-3 py-2 text-azure-500 hover:text-azure-700 hover:bg-azure-100 rounded-lg transition-colors mr-4"
              >
                <FaArrowLeft className="h-4 w-4 mr-2" />
                Back to Forms
              </Link>
              <div className="border-l border-azure-200 pl-4">
                <h1 className="text-xl font-semibold text-azure-700">
                  Edit: {assignment?.form.title}
                </h1>
                <p className="text-sm text-azure-500">
                  {assignment?.client.name} • {assignment?.client.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Form Content */}
      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow-sm rounded-lg">
          <FormEditComponent
            formData={formData}
            commonFieldsData={commonFieldsData}
            onChange={handleFormChange}
            onSubmit={handleFormSubmit}
            handleSave={handleSave}
            handleSaveProgress={handleSaveProgress}
            handleSaveForNext={handleSaveForNext}
            handleSaveForPrev={handleSaveForPrev}
            handleSubmitForm={handleSubmitForm}
            saving={saving}
            navigatingNext={navigatingNext}
            navigatingPrev={navigatingPrev}
            filledByClient={filledByClient}
            isSignatureLink={false}
            readOnly={readOnly}
            fieldErrors={{}}
            onCommonFieldsUpdated={() => {
              // Empty handler
            }}
          />
        </div>
      </div>
    </>
  );
}
