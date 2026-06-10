"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import LoadingView from '@/components/ui/LoadingView';
import { getStaffFormConfig } from '@/app/forms/staff-registry';

// Import specific form components that need special handling
import SupportWorkerForm, { SupportWorkerFormRef } from '../../../../onboard/[token]/components/SupportWorkerForm';
import EmployeeDetailsStep, { EmployeeDetailsStepRef } from '../../../../onboard/[token]/components/EmployeeDetailsStep';
import EmployeeWelcomeFormPage from '../../../../onboard/[token]/forms/employee-welcome/page';

// Helper to map route path back to formKey
const normalizeFormKey = (routePath: string): string => {
  // Handle special mappings first
  if (routePath === 'employee-details' || routePath === 'employment-details') return 'employee_details';
  if (routePath === 'employee-welcome' || routePath === 'employment-welcome') return 'employee_welcome';
  if (routePath === 'support-worker') return 'support_worker';
  // For all others, convert kebab-case to snake_case
  return routePath.replace(/-/g, '_');
};

// Helper to check if form should use onboard component
const shouldUseOnboardComponent = (formKey: string): boolean => {
  const onboardForms = ['support_worker', 'employee_details', 'employee_welcome'];
  return onboardForms.includes(formKey);
};

export default function DynamicStaffSignatureFormPage() {
  const params = useParams<{ token: string; formKey: string }>();
  const router = useRouter();
  const { token, formKey: rawFormKey } = params;
  const { showToast } = useToast();
  
  // Normalize formKey (handle both kebab-case and snake_case)
  const formKey = normalizeFormKey(rawFormKey);
  const [loading, setLoading] = useState(true);
  const [formConfig, setFormConfig] = useState<any>(null);
  const [staff, setStaff] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFormData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if form exists in registry
        const config = getStaffFormConfig(formKey);
        if (!config) {
          throw new Error(`Form "${formKey}" not found in registry`);
        }
        setFormConfig(config);

        // Load signature batch data to verify form is in batch
        const res = await fetch(`/api/staff/signature/${token}`);
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error);
        
        // Find this form in the signature batch (handle aliases)
        const formAliases: Record<string, string[]> = {
          'employee_details': ['employee_details', 'employment_details'],
          'employee_welcome': ['employee_welcome', 'employment_welcome_ack', 'employment_welcome'],
        };
        const matchKeys = formAliases[formKey] || [formKey];
        
        const formInBatch = data.signatureForms?.find(
          (f: any) => matchKeys.includes(f.formSubmission?.formKey) || matchKeys.includes(f.formSubmission?.form?.formKey)
        );
        
        if (!formInBatch) {
          throw new Error(`${config.name} form not found in this signature batch`);
        }
        
        setStaff(data.staff);
      } catch (error: any) {
        console.error('Error loading form:', error);
        setError(error.message || 'Failed to load form');
        showToast({
          type: 'error',
          title: 'Failed to Load Form',
          message: error.message || 'Unable to load form data. Please refresh the page.',
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    if (token && formKey) {
      loadFormData();
    }
  }, [token, formKey, showToast]);

  // Handle forms that use onboard components - redirect to dedicated pages
  useEffect(() => {
    if (!loading && formConfig && shouldUseOnboardComponent(formKey)) {
      const dedicatedRoutes: Record<string, string> = {
        'employee_details': 'employee-details',
        'employee_welcome': 'employee-welcome',
        'support_worker': 'support-worker',
      };
      const route = dedicatedRoutes[formKey];
      if (route) {
        router.replace(`/staff/signature/${token}/forms/${route}`);
      }
    }
  }, [loading, formConfig, formKey, token, router]);

  if (loading) {
    return <LoadingView title="Loading Form" message="Please wait..." />;
  }

  if (error || !formConfig) {
    return (
      <div className="min-h-screen bg-azure-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-soft p-6">
            <h1 className="text-2xl font-bold text-azure-700 mb-4">Error</h1>
            <p className="text-red-600 mb-4">{error || 'Form not found'}</p>
            <button
              onClick={() => router.push(`/staff/signature/${token}`)}
              className="px-4 py-2 bg-azure-500 text-white rounded hover:bg-azure-700"
            >
              ← Back to Forms
            </button>
          </div>
        </div>
      </div>
    );
  }

  // For forms that only have view components, show a message
  // that they need to be filled via the signature API
  const FormViewComponent = formConfig.viewComponent;
  const FormEditComponent = formConfig.editComponent || formConfig.viewComponent;

  return (
    <div className="min-h-screen bg-azure-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-soft p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-azure-700">{formConfig.name}</h1>
              <p className="text-azure-400">{staff?.firstName} {staff?.surname}</p>
            </div>
            <button
              onClick={() => router.push(`/staff/signature/${token}`)}
              className="px-4 py-2 text-azure-400 hover:text-azure-700"
            >
              ← Back to Forms
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-soft p-6">
          <div className="mb-4 p-4 bg-gold-50 border border-gold-200 rounded">
            <p className="text-gold-800 text-sm">
              <strong>Note:</strong> This form is accessed via signature link. Form submission and signature handling 
              will be managed through the signature API endpoint.
            </p>
          </div>
          
          {/* For now, show view component. Forms with edit components can be enhanced later */}
          {FormEditComponent && (
            <FormEditComponent
              token={token}
              isSignatureLink={true}
              formKey={formKey}
            />
          )}
        </div>
      </div>
    </div>
  );
}

