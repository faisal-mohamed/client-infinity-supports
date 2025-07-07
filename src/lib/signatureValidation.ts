import { getFormConfig, SignatureRequirement } from '@/app/forms/registry';

export interface SignatureValidationResult {
  isComplete: boolean;
  completedSignatures: string[];
  missingSignatures: string[];
  totalRequired: number;
  completedCount: number;
}

/**
 * Validates if all required signatures are present in form data
 */
export function validateFormSignatures(formKey: string, formData: any): SignatureValidationResult {
  const formConfig = getFormConfig(formKey);
  const signatures = formConfig?.signatures || [];
  
  // Filter to only required signatures
  const requiredSignatures = signatures.filter(sig => {
    if (sig.condition && typeof sig.condition === 'function') {
      return sig.condition(formData); // Dynamic requirement based on form data
    }
    return sig.required;
  });
  
  // Check which signatures are completed
  const completedSignatures: string[] = [];
  const missingSignatures: string[] = [];
  
  requiredSignatures.forEach(sig => {
    const signatureData = formData[sig.dataKey || sig.id];
    const hasSignature = signatureData && 
                        typeof signatureData === 'string' && 
                        signatureData.trim() !== '' &&
                        signatureData.startsWith('data:image/'); // Ensure it's a valid signature data URL
    
    if (hasSignature) {
      completedSignatures.push(sig.id);
    } else {
      missingSignatures.push(sig.id);
    }
  });
  
  return {
    isComplete: completedSignatures.length === requiredSignatures.length && requiredSignatures.length > 0,
    completedSignatures,
    missingSignatures,
    totalRequired: requiredSignatures.length,
    completedCount: completedSignatures.length
  };
}

/**
 * Get signature completion status text for UI display
 */
export function getSignatureStatusText(validation: SignatureValidationResult): string {
  if (validation.totalRequired === 0) {
    return 'No Signature Required';
  }
  
  if (validation.isComplete) {
    return validation.totalRequired === 1 
      ? 'Signature Complete' 
      : 'All Signatures Complete';
  }
  
  if (validation.completedCount === 0) {
    return validation.totalRequired === 1 
      ? 'Signature Required' 
      : 'Signatures Required';
  }
  
  return `Signatures: ${validation.completedCount}/${validation.totalRequired} Complete`;
}

/**
 * Check if a form requires any signatures
 */
export function formRequiresSignatures(formKey: string): boolean {
  const formConfig = getFormConfig(formKey);
  const signatures = formConfig?.signatures || [];
  return signatures.some(sig => sig.required);
}
