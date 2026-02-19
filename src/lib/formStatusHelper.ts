import { prisma } from '@/lib/prisma';
import { validateFormSignatures } from './signatureValidation';

export type FormStatus = 'not_started' | 'in_progress' | 'pending_admin_review' | 'completed';

/**
 * Simple helper to update form assignment status
 */
export async function updateFormAssignmentStatus(
  assignmentId: number,
  newStatus: FormStatus
): Promise<void> {
  await prisma.formAssignment.update({
    where: { id: assignmentId },
    data: {
      currentStatus: newStatus,
      isCompleted: newStatus === 'completed' // Keep legacy field in sync
    }
  });
}

/**
 * Calculate form status based on form data and signatures
 */
export function calculateFormStatus(
  formKey: string,
  formData: any,
  hasSubmission: boolean,
  isSubmitted: boolean
): FormStatus {
  // If no submission exists, it's not started
  if (!hasSubmission) {
    return 'not_started';
  }

  // Calculate signature validation
  const signatureValidation = validateFormSignatures(formKey, formData);

  // 1. Check for 'completed'
  // It's completed if all signatures are present (even if isSubmitted is false, 
  // as signatures are the final step)
  // OR if isSubmitted is true and no signatures are required.
  if (signatureValidation.isComplete && (isSubmitted || signatureValidation.totalRequired > 0)) {
    return 'completed';
  }

  if (isSubmitted && signatureValidation.totalRequired === 0) {
    return 'completed';
  }

  // 2. Check for 'pending_admin_review'
  // If all non-admin signatures are complete, but admin signatures are missing.
  // We also allow this if the form has been explicitly submitted by staff, even if some
  // non-admin signatures are still pending (as it's now in the manager's queue).
  const allNonAdminSignaturesComplete = signatureValidation.missingNonAdminSignatures.length === 0;
  const hasMissingAdminSignatures = signatureValidation.missingAdminSignatures.length > 0;

  if ((allNonAdminSignaturesComplete || isSubmitted) && hasMissingAdminSignatures) {
    return 'pending_admin_review';
  }

  // 3. Otherwise it's in progress
  return 'in_progress';
}

/**
 * Get status display information for UI
 */
export function getStatusDisplay(status: FormStatus) {
  const statusMap = {
    'not_started': {
      label: 'Not Started',
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: 'FaTimesCircle',
      description: 'Form assigned but not started'
    },
    'in_progress': {
      label: 'In Progress',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: 'FaClock',
      description: 'Admin is working on the form'
    },
    'pending_admin_review': {
      label: 'Pending Review',
      color: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: 'FaUserShield',
      description: 'Awaiting Administrator or Manager signature'
    },
    'completed': {
      label: 'Completed',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: 'FaCheckCircle',
      description: 'Form completed with all requirements'
    }
  };

  return statusMap[status] || statusMap['not_started'];
}

/**
 * Update status when client edits a completed form
 */
export async function handleClientFormEdit(
  clientId: number,
  formId: number,
  formVersion: number
): Promise<void> {
  // Find the form assignment
  const assignment = await prisma.formAssignment.findFirst({
    where: {
      clientId,
      formId,
      formVersion
    }
  });

  if (assignment && assignment.currentStatus === 'completed') {
    // If form was completed but client is editing, move back to in_progress
    await updateFormAssignmentStatus(assignment.id, 'in_progress');
  }
}
