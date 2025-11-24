"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/Toast";
import SuperChoiceForm from "./page"; // Import the existing view component

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
  onCommonFieldsUpdated?: () => void;
}

export default function SuperChoiceFormEdit({
  formData = {},
  commonFieldsData = {},
  onChange,
  onSubmit,
  readOnly = false,
  fieldErrors = {},
  handleSave,
  handleSaveProgress,
  handleSubmitForm,
  onCommonFieldsUpdated
}: FormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  const [localFormData, setLocalFormData] = useState({
    fullName: formData.fullName || "",
    employeeNumber: formData.employeeNumber || "",
    tfn: formData.tfn || "",
    fundChoice: formData.fundChoice || "",
    superFundName: formData.superFundName || "",
    superFundABN: formData.superFundABN || "",
    superFundUSI: formData.superFundUSI || "",
    memberAccountNumber: formData.memberAccountNumber || "",
    accountName: formData.accountName || "",
    hasComplianceLetter: formData.hasComplianceLetter || false,
    sectionBSignature: formData.sectionBSignature || "",
    sectionBDate: formData.sectionBDate || { day: "", month: "", year: "" },
    businessName: formData.businessName || "",
    businessABN: formData.businessABN || "",
    defaultSuperFundName: formData.defaultSuperFundName || "",
    defaultSuperFundABN: formData.defaultSuperFundABN || "",
    defaultSuperFundUSI: formData.defaultSuperFundUSI || "",
    chooseDefaultFund: formData.chooseDefaultFund || false,
    sectionCSignature: formData.sectionCSignature || "",
    sectionCDate: formData.sectionCDate || { day: "", month: "", year: "" },
    smsfName: formData.smsfName || "",
    smsfABN: formData.smsfABN || "",
    smsfESA: formData.smsfESA || "",
    smsfAccountName: formData.smsfAccountName || "",
    bankAccountName: formData.bankAccountName || "",
    bsbCode: formData.bsbCode || "",
    accountNumber: formData.accountNumber || "",
    hasSMSFEvidence: formData.hasSMSFEvidence || false,
    sectionDSignature: formData.sectionDSignature || "",
    sectionDDate: formData.sectionDDate || { day: "", month: "", year: "" }
  });

  useEffect(() => {
    setLocalFormData(prev => ({
      ...prev,
      ...formData
    }));
  }, [formData]);

  const handleDataChange = (data: any) => {
    setLocalFormData(data);
    if (onChange) {
      onChange(data);
    }
  };

  const handleSaveProgressInternal = async () => {
    if (handleSaveProgress && typeof handleSaveProgress === 'function') {
      setIsSaving(true);
      try {
        await handleSaveProgress();
        showToast({
          type: 'success',
          title: 'Progress Saved',
          message: 'Your form progress has been saved successfully',
          duration: 3000,
        });
      } catch (error) {
        console.error("Error saving progress:", error);
        showToast({
          type: 'error',
          title: 'Save Failed',
          message: 'Failed to save form progress. Please try again',
          duration: 5000,
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Helper to check if date is complete
  const isDateComplete = (date: { day: string; month: string; year: string } | undefined): boolean => {
    if (!date) return false;
    return !!(date.day && date.month && date.year && 
              date.day.length === 2 && date.month.length === 2 && date.year.length === 4);
  };

  const handleSubmitFormInternal = async () => {
    // Validate required fields based on fund choice
    const requiredFields: { key: string; label: string }[] = [
      { key: 'fullName', label: 'Full Name' },
      { key: 'tfn', label: 'TFN' },
    ];
    let missingFields = requiredFields.filter(field => {
      const value = (localFormData as any)[field.key];
      return !value || (typeof value === 'string' && value.trim() === '');
    });

    // Add conditional required fields based on fund choice
    if (localFormData.fundChoice === 'existing') {
      const existingFundFields: { key: string; label: string }[] = [
        { key: 'superFundName', label: 'Super Fund Name' },
        { key: 'superFundABN', label: 'Super Fund ABN' },
        { key: 'superFundUSI', label: 'Super Fund USI' },
        { key: 'memberAccountNumber', label: 'Member Account Number' },
        { key: 'accountName', label: 'Account Name' },
      ];
      missingFields = missingFields.concat(
        existingFundFields.filter(field => {
          const value = (localFormData as any)[field.key];
          return !value || (typeof value === 'string' && value.trim() === '');
        })
      );
      
      // Validate Section B signature and date
      if (!localFormData.sectionBSignature || localFormData.sectionBSignature.trim() === '') {
        showToast({
          type: 'error',
          title: 'Signature Required',
          message: 'Please provide your signature for Section B (My existing super fund)',
          duration: 5000,
        });
        return;
      }
      
      if (!isDateComplete(localFormData.sectionBDate)) {
        showToast({
          type: 'error',
          title: 'Date Required',
          message: 'Please provide the signature date for Section B (My existing super fund)',
          duration: 5000,
        });
        return;
      }
    } else if (localFormData.fundChoice === 'default') {
      const defaultFundFields: { key: string; label: string }[] = [
        { key: 'businessName', label: 'Business Name' },
        { key: 'businessABN', label: 'Business ABN' },
        { key: 'defaultSuperFundName', label: 'Default Super Fund Name' },
        { key: 'defaultSuperFundABN', label: 'Default Super Fund ABN' },
        { key: 'defaultSuperFundUSI', label: 'Default Super Fund USI' },
      ];
      missingFields = missingFields.concat(
        defaultFundFields.filter(field => {
          const value = (localFormData as any)[field.key];
          return !value || (typeof value === 'string' && value.trim() === '');
        })
      );
      
      // Validate Section C signature and date
      if (!localFormData.sectionCSignature || localFormData.sectionCSignature.trim() === '') {
        showToast({
          type: 'error',
          title: 'Signature Required',
          message: 'Please provide your signature for Section C (My employer\'s default super fund)',
          duration: 5000,
        });
        return;
      }
      
      if (!isDateComplete(localFormData.sectionCDate)) {
        showToast({
          type: 'error',
          title: 'Date Required',
          message: 'Please provide the signature date for Section C (My employer\'s default super fund)',
          duration: 5000,
        });
        return;
      }
    } else if (localFormData.fundChoice === 'smsf') {
      const smsfFields: { key: string; label: string }[] = [
        { key: 'smsfName', label: 'SMSF Name' },
        { key: 'smsfABN', label: 'SMSF ABN' },
        { key: 'smsfESA', label: 'SMSF ESA' },
        { key: 'smsfAccountName', label: 'SMSF Account Name' },
        { key: 'bankAccountName', label: 'Bank Account Name' },
        { key: 'bsbCode', label: 'BSB Code' },
        { key: 'accountNumber', label: 'Account Number' },
      ];
      missingFields = missingFields.concat(
        smsfFields.filter(field => {
          const value = (localFormData as any)[field.key];
          return !value || (typeof value === 'string' && value.trim() === '');
        })
      );
      
      // Validate Section D signature and date
      if (!localFormData.sectionDSignature || localFormData.sectionDSignature.trim() === '') {
        showToast({
          type: 'error',
          title: 'Signature Required',
          message: 'Please provide your signature for Section D (My private self-managed super fund)',
          duration: 5000,
        });
        return;
      }
      
      if (!isDateComplete(localFormData.sectionDDate)) {
        showToast({
          type: 'error',
          title: 'Date Required',
          message: 'Please provide the signature date for Section D (My private self-managed super fund)',
          duration: 5000,
        });
        return;
      }
    }

    if (missingFields.length > 0) {
      const fieldLabels = missingFields.map(f => f.label).join(', ');
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: `Please fill in required fields: ${fieldLabels}`,
        duration: 5000,
      });
      return;
    }

    if (handleSubmitForm && typeof handleSubmitForm === 'function') {
      setIsSubmitting(true);
      try {
        await handleSubmitForm();
        showToast({
          type: 'success',
          title: 'Form Submitted',
          message: 'Your Superannuation Standard Choice Form has been submitted successfully',
          duration: 3000,
        });
      } catch (error) {
        console.error("Error submitting form:", error);
        showToast({
          type: 'error',
          title: 'Submission Failed',
          message: 'Failed to submit form. Please try again',
          duration: 5000,
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="relative">
      <SuperChoiceForm
        initialData={localFormData}
        onDataChange={handleDataChange}
        readOnly={readOnly}
        showButtons={false}
      />
      {!readOnly && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 z-10">
          <button 
            onClick={handleSaveProgressInternal} 
            disabled={isSaving || isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isSaving ? 'Saving...' : 'Save Progress'}
          </button>
          <button 
            onClick={handleSubmitFormInternal} 
            disabled={isSaving || isSubmitting}
            className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 disabled:bg-gray-400"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Form'}
          </button>
        </div>
      )}
    </div>
  );
}
