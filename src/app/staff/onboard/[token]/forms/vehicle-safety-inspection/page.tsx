"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import { getStaffFormComponent } from '@/app/forms/staff-registry';
import { useToast } from '@/components/ui/Toast';
import LoadingView from '@/components/ui/LoadingView';

export default function VehicleSafetyInspectionFormPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const [staff, setStaff] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [initialFormData, setInitialFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const isInitialLoad = useRef(true);

  // Required fields for Driver Information section
  const requiredFields = [
    'driver',
    'licenceNumber',
    'plantIdNo',
    'vehicleRegistration',
    'insurancePolicy',
    'dateOfInspection'
  ];

  // Field labels mapping
  const fieldLabels: Record<string, string> = {
    driver: 'Driver',
    licenceNumber: 'Licence number',
    plantIdNo: 'Plant ID No',
    vehicleRegistration: 'Vehicle registration',
    insurancePolicy: 'Insurance policy',
    dateOfInspection: 'Date of inspection'
  };

  // Helper function to check if a field value is empty
  const isFieldEmpty = useCallback((field: string, value: any): boolean => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed === '') return true;
      
      // Date fields - check if it's a valid date string (not placeholder)
      if (field === 'dateOfInspection' || field === 'reviewedByDate' || field === 'nextInspectionDate') {
        // Reject placeholder values like "dd-mm-yyyy", "mm/dd/yyyy", etc.
        const placeholderPatterns = [
          /^dd[-/]mm[-/]yyyy$/i,
          /^mm[-/]dd[-/]yyyy$/i,
          /^yyyy[-/]mm[-/]dd$/i,
          /^dd[-/]mm[-/]yy$/i,
          /^mm[-/]dd[-/]yy$/i,
        ];
        
        // Check if it matches any placeholder pattern
        if (placeholderPatterns.some(pattern => pattern.test(trimmed))) {
          return true;
        }
        
        // Check if it's a valid date format (YYYY-MM-DD)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
          return true; // Invalid date format
        }
        
        // Additional validation: check if it's a valid date
        const date = new Date(trimmed);
        if (isNaN(date.getTime())) {
          return true; // Invalid date
        }
      }
    }
    if (Array.isArray(value) && value.length === 0) return true;
    return false;
  }, []);

  // Validation function
  const validateForm = useCallback((): { isValid: boolean; missingFields: string[] } => {
    const errors: Record<string, string> = {};
    const missingFields: string[] = [];
    
    requiredFields.forEach(field => {
      const value = formData[field];
      if (isFieldEmpty(field, value)) {
        const fieldLabel = fieldLabels[field];
        errors[field] = `${fieldLabel} is required`;
        missingFields.push(fieldLabel);
      }
    });

    setFieldErrors(errors);
    return { isValid: Object.keys(errors).length === 0, missingFields };
  }, [formData, isFieldEmpty]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Detect if this is a signature link or onboard link
        const isSignatureLink = window.location.pathname.includes('/staff/signature/');
        const apiEndpoint = isSignatureLink 
          ? `/api/staff/signature/${token}` 
          : `/api/staff/onboard/${token}`;
        
        const response = await fetch(apiEndpoint);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          showToast({
            type: 'error',
            title: 'Failed to Load Form',
            message: errorData.message || 'Unable to load form data. Please refresh the page and try again.',
            duration: 5000,
          });
          return;
        }

        const staffData = await response.json();
        setStaff(staffData.staff || staffData);
        
        // Load saved form data - handle both signature and onboard structures
        let formSubmission: any = {};
        if (isSignatureLink) {
          const vehicleForm = staffData.signatureForms?.find(
            (f: any) => f.formSubmission?.form?.formKey === 'vehicle_safety_inspection'
          );
          if (vehicleForm && vehicleForm.formSubmission?.data) {
            // Extract only the form data, exclude signature fields since this form doesn't use signatures
            const { staffSignature, staffSignedAt, adminSignature, adminSignedAt, ...formData } = vehicleForm.formSubmission.data;
            formSubmission = formData;
          }
        } else {
          // Check submissions dictionary
          if (staffData.submissions && staffData.submissions['vehicle_safety_inspection']) {
            // Extract only the form data, exclude signature fields since this form doesn't use signatures
            const submissionData = staffData.submissions['vehicle_safety_inspection'];
            const { staffSignature, staffSignedAt, adminSignature, adminSignedAt, ...formData } = submissionData;
            formSubmission = formData;
          }
        }
        
        console.log('Loaded form submission data for vehicle_safety_inspection:', {
          hasData: Object.keys(formSubmission).length > 0,
          keys: Object.keys(formSubmission),
          sampleData: Object.keys(formSubmission).slice(0, 5).reduce((acc, key) => {
            acc[key] = formSubmission[key];
            return acc;
          }, {} as any)
        });
        
        setInitialFormData(formSubmission);
        setFormData(formSubmission);
      } catch (error: any) {
        console.error('Error loading data:', error);
        showToast({
          type: 'error',
          title: 'Connection Error',
          message: 'Unable to connect to the server. Please check your internet connection and try again.',
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadData();
    }
  }, [token, showToast]);

  // Memoize the onDataChange callback to prevent infinite loops
  const handleDataChange = useCallback((data: any) => {
    console.log('Form data changed:', {
      driver: data.driver,
      licenceNumber: data.licenceNumber,
      plantIdNo: data.plantIdNo,
      vehicleRegistration: data.vehicleRegistration,
      insurancePolicy: data.insurancePolicy,
      dateOfInspection: data.dateOfInspection,
    });
    setFormData(data);
  }, []);

  // Clear field errors when form data changes and fields are filled
  useEffect(() => {
    setFieldErrors(prevErrors => {
      if (Object.keys(prevErrors).length === 0) {
        return prevErrors; // No errors to clear
      }

      const newErrors = { ...prevErrors };
      let hasChanges = false;
      
      // Check each field that has an error
      Object.keys(newErrors).forEach(field => {
        const value = formData[field];
        const isEmpty = isFieldEmpty(field, value);
        
        console.log(`Checking field ${field}:`, {
          value,
          isEmpty,
          hasError: !!newErrors[field]
        });
        
        // Check if field is now filled (not empty)
        if (!isEmpty && newErrors[field]) {
          console.log(`Clearing error for ${field}`);
          delete newErrors[field];
          hasChanges = true;
        }
      });
      
      return hasChanges ? newErrors : prevErrors;
    });
  }, [formData, isFieldEmpty]);

  useEffect(() => {
    console.log("formData: ", formData);
  }, [formData]);

  const handleSave = async (isSubmit: boolean) => {
    // Validate required fields before submission
    if (isSubmit) {
      const validation = validateForm();
      if (!validation.isValid) {
        // Build toast message with missing field names
        let message = '';
        const missingCount = validation.missingFields.length;
        
        if (missingCount === 1) {
          message = `Please fill in the required field: ${validation.missingFields[0]}`;
        } else if (missingCount <= 3) {
          // Show all field names if 3 or fewer
          const fieldsList = validation.missingFields.slice(0, -1).join(', ');
          const lastField = validation.missingFields[validation.missingFields.length - 1];
          message = `Please fill in the required fields: ${fieldsList} and ${lastField}`;
        } else {
          // Show first 3 fields and count of remaining
          const firstThree = validation.missingFields.slice(0, 3).join(', ');
          const remaining = missingCount - 3;
          message = `Please fill in the required fields: ${firstThree} and ${remaining} more`;
        }

        showToast({
          type: 'error',
          title: 'Validation Error',
          message: message,
          duration: 6000,
        });
        
        // Scroll to first error field
        const firstErrorField = Object.keys(fieldErrors)[0];
        if (firstErrorField) {
          const element = document.querySelector(`[name="${firstErrorField}"]`) || 
                         document.querySelector(`input[type="date"][value="${formData[firstErrorField] || ''}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            (element as HTMLElement).focus();
          }
        }
        return;
      }
    }

    setSaving(true);
    try {
      // Detect if this is a signature link or onboard link
      const isSignatureLink = window.location.pathname.includes('/staff/signature/');
      const apiEndpoint = isSignatureLink
        ? `/api/staff/signature/${token}/forms/vehicle_safety_inspection`
        : `/api/staff/onboard/${token}`;
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formKey: 'vehicle_safety_inspection',
          data: formData,
          submit: isSubmit,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        const action = isSubmit ? 'submitted' : 'saved';
        showToast({
          type: 'success',
          title: `Form ${action === 'submitted' ? 'Submitted' : 'Saved'}`,
          message: `Your Vehicle Safety Inspection Checklist has been ${action} successfully.`,
          duration: 4000,
        });
      
      if (isSubmit) {
          // Small delay to show success message before navigation
          const isSignatureLink = window.location.pathname.includes('/staff/signature/');
          setTimeout(() => {
        router.push(isSignatureLink ? `/staff/signature/${token}` : `/staff/onboard/${token}`);
          }, 1000);
        }
      } else {
        // Handle different error types with appropriate messages
        const errorMessage = result.message || result.error || 'Failed to save form';
        let title = 'Save Failed';
        
        // Customize error messages based on error code
        if (result.code === 'DUPLICATE_ENTRY') {
          title = 'Already Submitted';
        } else if (result.code === 'LINK_EXPIRED') {
          title = 'Access Link Expired';
        } else if (result.code === 'DATABASE_CONNECTION_ERROR') {
          title = 'Connection Error';
        } else if (result.code === 'DATA_TOO_LONG') {
          title = 'Validation Error';
        }

        showToast({
          type: 'error',
          title,
          message: errorMessage,
          duration: 5000,
        });
      }
    } catch (error: any) {
      console.error('Error saving form:', error);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        showToast({
          type: 'error',
          title: 'Network Error',
          message: 'Unable to connect to the server. Please check your internet connection and try again.',
          duration: 5000,
        });
      } else {
        showToast({
          type: 'error',
          title: 'Unexpected Error',
          message: 'An unexpected error occurred while saving. Please try again.',
          duration: 5000,
        });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingView title="Loading Vehicle Safety Inspection Form" message="Please wait..." />;
  }

  const VehicleSafetyInspectionEdit = getStaffFormComponent('vehicle_safety_inspection', 'edit');

  return (
    <div className="min-h-screen bg-gray-100 py-4 md:py-8">
      <style jsx>{`
        .view-component-wrapper {
          min-height: 600px;
        }
        @media (max-width: 768px) {
        .view-component-wrapper { 
            min-height: 400px;
          }
        }
      `}</style>
      
      <div className="w-full max-w-7xl mx-auto px-2 md:px-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-4 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Vehicle Safety Inspection Checklist</h1>
              <p className="text-gray-600">{staff?.firstName} {staff?.surname}</p>
            </div>
            <button
              onClick={() => {
                const isSignatureLink = window.location.pathname.includes('/staff/signature/');
                router.push(isSignatureLink ? `/staff/signature/${token}` : `/staff/onboard/${token}`);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 self-start sm:self-auto"
            >
              ← Back to Forms
            </button>
          </div>
        </div>

        {/* Edit Component */}
        <div className="bg-white rounded-lg shadow-lg p-2 md:p-6">
          <div className="view-component-wrapper w-full">
            <VehicleSafetyInspectionEdit
              initialData={initialFormData}
              onDataChange={handleDataChange}
              showButtons={false}
              fieldErrors={fieldErrors}
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6 md:mt-8 pt-4 md:pt-6 border-t">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 w-full sm:w-auto"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 w-full sm:w-auto"
            >
              {saving ? 'Submitting...' : 'Submit & Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
