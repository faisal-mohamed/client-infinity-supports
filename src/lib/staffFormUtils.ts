/**
 * Reusable utility functions for staff forms
 * Handles signature clearing, data change detection, etc.
 */

export interface SignatureClearingResult {
  shouldClearSignatures: boolean;
  shouldClearAdminApproval: boolean;
  cleanedFormData: any;
  message?: string;
}

/**
 * Detects data changes and determines if signatures should be cleared
 * @param existing - Existing form data from database
 * @param newFormData - New form data from user
 * @param hasNewSignature - Whether user provided new signature
 * @returns Object with clearing flags and cleaned data
 */
export function checkSignatureClearing(
  existing: any,
  newFormData: any,
  hasNewSignature: boolean
): SignatureClearingResult {
  let shouldClearSignatures = false;
  let shouldClearAdminApproval = false;
  const cleanedFormData = { ...newFormData };

  if (existing) {
    // Get existing data without admin fields for comparison
    const existingDataCopy = { ...existing.data } as any;
    delete existingDataCopy.employmentStatus;
    delete existingDataCopy.payRate;
    delete existingDataCopy.schadsLevel;
    delete existingDataCopy.schadsScore;
    
    // Compare only staff-fillable fields
    const dataChanged = JSON.stringify(existingDataCopy) !== JSON.stringify(newFormData);

    if (dataChanged) {
      // If data changed and user hasn't provided new signature, clear old signature
      shouldClearSignatures = !hasNewSignature;
      
      // If admin has approved and data changed, clear admin approval
      shouldClearAdminApproval = !!existing.adminSignature;

      // Remove admin fields from data when clearing approval
      if (shouldClearAdminApproval) {
        delete cleanedFormData.employmentStatus;
        delete cleanedFormData.payRate;
        delete cleanedFormData.schadsLevel;
        delete cleanedFormData.schadsScore;
      }

      // Generate warning message
      if (shouldClearSignatures || shouldClearAdminApproval) {
        let message = '⚠️ Form updated. ';
        if (shouldClearSignatures) {
          message += 'Your signature has been cleared - please sign again. ';
        }
        if (shouldClearAdminApproval) {
          message += 'Admin approval has been cleared and requires re-approval.';
        }
        
        return {
          shouldClearSignatures,
          shouldClearAdminApproval,
          cleanedFormData,
          message
        };
      }
    }
  }

  return {
    shouldClearSignatures: false,
    shouldClearAdminApproval: false,
    cleanedFormData
  };
}

/**
 * Clears admin data from form state after API update
 * @param formData - Current form data
 * @param clearStaffSignature - Whether to also clear staff signature
 * @returns Cleaned form data
 */
export function clearAdminDataFromState(
  formData: any,
  clearStaffSignature: boolean = false
): any {
  const updated = { ...formData };
  
  // Remove admin fields
  delete updated.employmentStatus;
  delete updated.payRate;
  delete updated.schadsLevel;
  delete updated.schadsScore;
  delete updated.adminSignature;
  delete updated.adminSignedAt;
  
  // Optionally clear staff signature
  if (clearStaffSignature) {
    delete updated.employeeSignature;
    delete updated.employeeSignatureDate;
    delete updated.signature;
    delete updated.signatureDate;
  }
  
  return updated;
}

