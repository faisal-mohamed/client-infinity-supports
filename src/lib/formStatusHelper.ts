import { findAssignmentById, updateAssignmentStatus, getClientAssignments } from "@/lib/db/forms";
import { validateFormSignatures } from "./signatureValidation";

export type FormStatus = 'not_started' | 'in_progress' | 'pending_admin_review' | 'completed';

export async function updateFormAssignmentStatus(
  assignmentId: string,
  newStatus: FormStatus
): Promise<void> {
  const assignment = await findAssignmentById(assignmentId);
  if (!assignment) return;
  await updateAssignmentStatus(assignment.clientId, assignmentId, newStatus, assignment.currentStatus);
}

export function calculateFormStatus(
  formKey: string,
  formData: any,
  hasSubmission: boolean,
  isSubmitted: boolean
): FormStatus {
  if (!hasSubmission) return 'not_started';

  const signatureValidation = validateFormSignatures(formKey, formData);

  if (signatureValidation.isComplete && (isSubmitted || signatureValidation.totalRequired > 0)) return 'completed';
  if (isSubmitted && signatureValidation.totalRequired === 0) return 'completed';

  const allNonAdminSignaturesComplete = signatureValidation.missingNonAdminSignatures.length === 0;
  const hasMissingAdminSignatures = signatureValidation.missingAdminSignatures.length > 0;

  if ((allNonAdminSignaturesComplete || isSubmitted) && hasMissingAdminSignatures) return 'pending_admin_review';

  return 'in_progress';
}

export function getStatusDisplay(status: FormStatus) {
  const statusMap = {
    'not_started': { label: 'Not Started', color: 'bg-azure-100 text-azure-700 border-azure-100', icon: 'FaTimesCircle', description: 'Form assigned but not started' },
    'in_progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: 'FaClock', description: 'Admin is working on the form' },
    'pending_admin_review': { label: 'Pending Review', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: 'FaUserShield', description: 'Awaiting Administrator or Manager signature' },
    'completed': { label: 'Completed', color: 'bg-green-100 text-green-800 border-green-200', icon: 'FaCheckCircle', description: 'Form completed with all requirements' },
  };
  return statusMap[status] || statusMap['not_started'];
}

export async function handleClientFormEdit(clientId: string, formId: string, formVersion: number): Promise<void> {
  const assignments = await getClientAssignments(clientId);
  const assignment = assignments.find((a) => a.formId === formId && a.formVersion === formVersion);
  if (assignment && assignment.currentStatus === 'completed') {
    await updateAssignmentStatus(clientId, assignment.id, 'in_progress', 'completed');
  }
}
