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
export interface SignatureValidationResult {
  isComplete: boolean;
  completedSignatures: string[];
  missingSignatures: string[];
  totalRequired: number;
  completedCount: number;
}

export function validateFormSignatures(
  formKey: string,
  formData: Record<string, any>
): SignatureValidationResult {
  const formConfig = getFormConfig(formKey);
  const signatures = formConfig?.signatures || [];

  const completedSignatures: string[] = [];
  const missingSignatures: string[] = [];

  // Track totals
  let totalRequired = 0;
  let completedCount = 0;

  const individualSigs = signatures.filter(
    (sig) => !sig.groupId && sig.required
  );

  const groupMap = new Map<
    string,
    {
      groupType: "any" | "all";
      required: boolean;
      signatures: typeof signatures;
    }
  >();

  // Separate group logic
  signatures.forEach((sig) => {
    if (sig.groupId) {
      const key = sig.groupId;
      if (!groupMap.has(key)) {
        groupMap.set(key, {
          groupType: sig.groupRequirementType || "any",
          required: sig.groupRequired || false,
          signatures: [],
        });
      }
      groupMap.get(key)!.signatures.push(sig);
    }
  });

  // ✅ Check individual required signatures
  for (const sig of individualSigs) {
    const signatureData = formData[sig.dataKey || sig.id];
    const hasSignature =
      signatureData &&
      typeof signatureData === "string" &&
      signatureData.trim() !== "" &&
      signatureData.startsWith("data:image/");

    totalRequired++;
    if (hasSignature) {
      completedSignatures.push(sig.id);
      completedCount++;
    } else {
      missingSignatures.push(sig.id);
    }
  }

  // ✅ Check grouped required signatures
  for (const [groupId, groupData] of groupMap.entries()) {
    if (!groupData.required) continue;

    const { signatures, groupType } = groupData;

    if (groupType === "any") {
      totalRequired++;
      const anySigned = signatures.some((sig) => {
        const signatureData = formData[sig.dataKey || sig.id];
        const hasSignature =
          signatureData &&
          typeof signatureData === "string" &&
          signatureData.trim() !== "" &&
          signatureData.startsWith("data:image/");

        if (hasSignature) {
          completedSignatures.push(sig.id);
        }

        return hasSignature;
      });

      if (anySigned) {
        completedCount++;
      } else {
        // Push all group options into missing list for transparency
        missingSignatures.push(
          ...signatures.map((sig) => `${sig.id} (any group: ${groupId})`)
        );
      }
    }

    // Optional: support groupType === 'all' in future
  }

  return {
    isComplete: completedCount === totalRequired && totalRequired > 0,
    completedSignatures,
    missingSignatures,
    totalRequired,
    completedCount,
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
      : `${validation.totalRequired} Signatures Required`;
  }

  return `${validation.completedCount} of ${validation.totalRequired} Signatures Complete`;
}


/**
 * Check if a form requires any signatures
 */
export function formRequiresSignatures(formKey: string): boolean {
  // Vehicle Safety Inspection does NOT require signature
  if (formKey === 'vehicle_safety_inspection') {
    return false;
  }
  
  const formConfig = getFormConfig(formKey);
  const signatures = formConfig?.signatures || [];
  return signatures.some(sig => sig.required);
}
