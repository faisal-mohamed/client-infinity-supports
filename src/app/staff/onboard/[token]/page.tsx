"use client";

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import EmployeeWelcomeAckForm, { EmployeeWelcomeAckFormRef } from './components/EmployeeWelcomeAckForm';
import EmployeeDetailsStep, { EmployeeDetailsStepRef } from './components/EmployeeDetailsStep';
import SupportWorkerForm, { SupportWorkerFormRef } from './components/SupportWorkerForm';
import PreEmploymentMedicalForm, { PreEmploymentMedicalFormRef } from './components/PreEmploymentMedicalForm';
import { ToastProvider, useToast } from '@/components/ui/Toast';
import './components/styles.css';

const NdisWorkforceCapabilityView = dynamic(async () => (await import('@/app/form-components/staff/ndis-workforce-capability/View')).default, { ssr: false });

const EmployeeWelcomeView = dynamic(async () => (await import('@/app/form-components/staff/employee-welcome/View')).default, { ssr: false });

// Define all 10 forms for the system
const TOTAL_FORMS = 10;
const FORM_NAMES = [
  'Employee Details',
  'Employee Welcome', 
  'Support Worker',
  'Pre-Employment Medical',
  'NDIS Workforce Capability Framework',
  'Form 6',
  'Form 7',
  'Form 8',
  'Form 9',
  'Form 10'
];

function InnerPage() {
  const { token } = useParams<{ token: string }>();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10>(1);
  const [canContinue, setCanContinue] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [validationStatus, setValidationStatus] = useState<{ isValid: boolean; missing?: string[]; invalid?: string[] } | null>(null);
  
  // Refs for all form components
  const ackRef = useRef<EmployeeWelcomeAckFormRef | null>(null);
  const detailsRef = useRef<EmployeeDetailsStepRef | null>(null);
  const supportWorkerRef = useRef<SupportWorkerFormRef | null>(null);
  const preEmploymentMedicalRef = useRef<PreEmploymentMedicalFormRef | null>(null);
  const ndisWorkforceCapabilityRef = useRef<any | null>(null);
  
  const { showToast } = useToast();

  // Get current form ref based on step
  const getCurrentFormRef = () => {
    switch (step) {
      case 1: return detailsRef;
      case 2: return ackRef;
      case 3: return supportWorkerRef;
      case 4: return preEmploymentMedicalRef;
      case 5: return ndisWorkforceCapabilityRef;
      default: return null;
    }
  };

  // Update validation status whenever canContinue changes
  useEffect(() => {
    const updateValidationStatus = () => {
      const currentRef = getCurrentFormRef();
      if (currentRef?.current?.validateDetailed) {
        const validation = currentRef.current.validateDetailed();
        setValidationStatus(validation);
      }
    };

    // Update validation status after a short delay to allow form to update
    const timer = setTimeout(updateValidationStatus, 100);
    return () => clearTimeout(timer);
  }, [canContinue, step]);

  // Common save draft function for all forms
  const handleSaveDraft = async () => {
    const currentRef = getCurrentFormRef();
    if (!currentRef?.current) return;

    // Validate before saving draft
    const validation = currentRef.current?.validateDetailed?.();
    if (validation && !validation.isValid) {
      // Show validation errors in toast
      const errorMessages = [];
      
      if (validation.missing?.length) {
        errorMessages.push(`Missing: ${validation.missing.join(', ')}`);
      }
      
      if (validation.invalid?.length) {
        errorMessages.push(`Invalid: ${validation.invalid.join(', ')}`);
      }

      showToast({ 
        type: 'warning', 
        title: 'Cannot Save Draft - Form Has Errors', 
        message: errorMessages.join(' | ') 
      });
      return;
    }

    setIsSaving(true);
    try {
      const ok = await currentRef.current?.save?.(false);
      if (ok) {
        showToast({ 
          type: 'success', 
          title: 'Draft Saved', 
          message: 'Your progress has been saved. You can continue later using the same link.' 
        });
        // Enable Next button after successful save
        setCanContinue(true);
        setDraftSaved(true);
      } else {
        showToast({ 
          type: 'error', 
          title: 'Save Failed', 
          message: 'Failed to save draft. Please try again.' 
        });
      }
    } catch (e: any) {
      showToast({ 
        type: 'error', 
        title: 'Save Failed', 
        message: e?.message || 'Unexpected error occurred' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Common next/complete function with validation
  const handleNext = async () => {
    const currentRef = getCurrentFormRef();
    if (!currentRef?.current) return;

    // Validate current form
    const validation = currentRef.current?.validateDetailed?.();
    if (validation && !validation.isValid) {
      // Show detailed validation errors
      const errorMessages = [];
      
      if (validation.missing?.length) {
        errorMessages.push(`Missing required fields: ${validation.missing.join(', ')}`);
      }
      
      if (validation.invalid?.length) {
        errorMessages.push(`Invalid fields: ${validation.invalid.join(', ')}`);
      }

      showToast({ 
        type: 'warning', 
        title: 'Please Complete the Form', 
        message: errorMessages.join(' | ') 
      });
      return;
    }

    // Save and proceed
    try {
      const ok = await currentRef.current?.save?.(true);
      if (ok) {
        if (step < TOTAL_FORMS) {
          setStep((step + 1) as any);
          showToast({ 
            type: 'success', 
            title: 'Form Completed', 
            message: `Moving to ${FORM_NAMES[step]}` 
          });
        } else {
          showToast({ 
            type: 'success', 
            title: 'All Forms Completed!', 
            message: 'Staff onboarding process has been completed successfully.' 
          });
          // Could redirect to completion page
        }
      } else {
        showToast({ 
          type: 'error', 
          title: 'Save Failed', 
          message: 'Please try again.' 
        });
      }
    } catch (e: any) {
      showToast({ 
        type: 'error', 
        title: 'Save Failed', 
        message: e?.message || 'Unexpected error occurred' 
      });
    }
  };

  // Go back to previous step
  const handlePrevious = () => {
    if (step > 1) {
      setStep((step - 1) as any);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header with Progress */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Staff Onboarding</h1>
          <div className="flex items-center gap-2 text-sm">
            {FORM_NAMES.slice(0, 3).map((name, index) => (
              <span 
                key={index}
                className={`px-3 py-2 rounded-full ${
                  step === (index + 1) 
                    ? 'bg-rose-600 text-white' 
                    : step > (index + 1)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {index + 1}. {name}
              </span>
            ))}
            {TOTAL_FORMS > 3 && (
              <span className="px-3 py-2 rounded-full bg-gray-100 text-gray-600">
                +{TOTAL_FORMS - 3} more forms
              </span>
            )}
          </div>
        </div>

        {/* Sticky Progress Bar */}
        <div className="sticky top-0 z-20 bg-white py-3 border-b mb-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/client_logo.png" alt="Logo" className="h-8" />
              <span className="font-semibold text-rose-600">Staff Onboarding</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Step {step} of {TOTAL_FORMS}
              </div>
              <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-600 transition-all duration-300" 
                  style={{ width: `${(step / TOTAL_FORMS) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="mb-6 border rounded-xl overflow-hidden">
          {step === 1 && (
            <EmployeeDetailsStep 
              ref={detailsRef as any} 
              token={token} 
              onValidityChange={setCanContinue} 
            />
          )}

        {step === 2 && (
              <EmployeeWelcomeView excludeLastPage={true}>
              <EmployeeWelcomeAckForm 
                ref={ackRef as any} 
                token={token} 
                onValidityChange={setCanContinue} 
              />
              </EmployeeWelcomeView>
          )}
          
          {step === 3 && (
            <SupportWorkerForm 
              ref={supportWorkerRef as any} 
              token={token} 
              onValidityChange={setCanContinue} 
            />
          )}

          {step === 4 && (
            <PreEmploymentMedicalForm 
              ref={preEmploymentMedicalRef as any} 
              token={token} 
              onValidityChange={setCanContinue} 
            />
          )}

          {step === 5 && (
            <NdisWorkforceCapabilityView excludeLastPage={true}>
              <div className="p-8 text-center">
                <h2 className="text-xl font-semibold mb-4">NDIS Workforce Capability Framework</h2>
                <p className="text-gray-600">Please review the framework above and acknowledge below.</p>
              </div>
            </NdisWorkforceCapabilityView>
          )}
          
          {/* Placeholder for future forms */}
          {step > 5 && (
            <div className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-4">Form {step}</h2>
              <p className="text-gray-600">This form is under development.</p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button 
            className={`px-6 py-3 border rounded-lg ${
              step > 1 
                ? 'text-rose-600 border-rose-200 hover:bg-rose-50' 
                : 'text-gray-400 border-gray-200 cursor-not-allowed'
            }`}
            onClick={handlePrevious}
            disabled={step <= 1}
          >
            Previous
          </button>
          
          <div className="flex gap-3">
            <button 
              className="px-6 py-3 border rounded-lg text-rose-600 border-rose-200 hover:bg-rose-50 disabled:opacity-50"
              onClick={handleSaveDraft}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Draft'}
            </button>
            
            <button 
              className="px-6 py-3 bg-rose-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleNext}
              disabled={!canContinue || isSaving || !draftSaved}
              title={!draftSaved ? "Please save draft first" : ""}
            >
              {step === TOTAL_FORMS ? 'Complete' : 'Next'}
            </button>
          </div>
            </div>
        
        {/* Status Message */}
        <div className="text-center mt-4">
          {!draftSaved && (
            <p className="text-sm text-gray-600">
              💡 Save your draft first to enable the Next button
            </p>
          )}
          {draftSaved && canContinue && (
            <p className="text-sm text-green-600">
              ✅ Draft saved and form is complete - you can proceed
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <ToastProvider>
      <InnerPage />
    </ToastProvider>
  );
}
