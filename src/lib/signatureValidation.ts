import { getFormConfig, SignatureRequirement } from '@/app/forms/registry';

export interface SignatureValidationResult {
  isComplete: boolean;
  completedSignatures: string[];
  missingSignatures: string[];
  missingAdminSignatures: string[];
  missingNonAdminSignatures: string[];
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
  const missingAdminSignatures: string[] = [];
  const missingNonAdminSignatures: string[] = [];

  const adminSigIds = ["manager_signature", "supervisor_signature", "admin_signature"];

  // Track totals
  let totalRequired = 0;
  let completedCount = 0;

  const individualSigs = signatures.filter(
    (sig) => !sig.groupId && (sig.required || (sig.condition && sig.condition(formData)))
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
      if (adminSigIds.some(adminId => sig.id.includes(adminId))) {
        missingAdminSignatures.push(sig.id);
      } else {
        missingNonAdminSignatures.push(sig.id);
      }
    }
  }

  // ✅ Check grouped required signatures
  for (const [groupId, groupData] of groupMap.entries()) {
    if (!groupData.required) continue;

    const { signatures: groupSignatures, groupType } = groupData;

    if (groupType === "any") {
      totalRequired++;
      const signedSig = groupSignatures.find((sig) => {
        const signatureData = formData[sig.dataKey || sig.id];
        return (
          signatureData &&
          typeof signatureData === "string" &&
          signatureData.trim() !== "" &&
          signatureData.startsWith("data:image/")
        );
      });

      if (signedSig) {
        completedSignatures.push(signedSig.id);
        completedCount++;
      } else {
        // Entire group is missing
        missingSignatures.push(`Group: ${groupId}`);

        // Check if this group is considered "admin" (usually not for groups, but be safe)
        const isAnyAdmin = groupSignatures.some(sig => adminSigIds.some(adminId => sig.id.includes(adminId)));
        if (isAnyAdmin) {
          missingAdminSignatures.push(`Group: ${groupId}`);
        } else {
          missingNonAdminSignatures.push(`Group: ${groupId}`);
        }
      }
    }
  }

  return {
    isComplete: completedCount === totalRequired && totalRequired > 0,
    completedSignatures,
    missingSignatures,
    missingAdminSignatures,
    missingNonAdminSignatures,
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
  const formConfig = getFormConfig(formKey);
  const signatures = formConfig?.signatures || [];
  return signatures.some(sig => sig.required);
}
