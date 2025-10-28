import { prisma } from '@/lib/prisma';
import { validateFormSignatures } from './signatureValidation';

export type FormStatus = 'not_started' | 'in_progress' | 'completed';

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

  // If submitted, check signature completion
  if (isSubmitted) {
    const signatureValidation = validateFormSignatures(formKey, formData);
    
    // If no signatures required, it's completed when submitted
    if (signatureValidation.totalRequired === 0) {
      return 'completed';
    }
    
    // If all signatures complete, it's completed
    if (signatureValidation.isComplete) {
      return 'completed';
    }
  }

  // Otherwise, it's in progress
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
