// Types
export interface FormAssignmentWithDetails {
  id: number;
  formId: number;
  formVersion: number;
  assignedAt: string;
  displayOrder: number;
  isCompleted: boolean; // Add this field
  form: {
    id: number;
    formKey: string;
    title: string;
    version: number;
    requiresSignature?: boolean; // Add signature requirement field
  };
  // Check if FormSubmission exists
  hasSubmission: boolean;
  submissionId?: number;
  filledByAdmin: boolean;
  adminFilledAt?: string;
  clientSignature?: string;
  clientSignedAt?: string;
  // Staff-specific fields (for staff forms)
  staffSignature?: string;
  staffSignedAt?: string;
  // NEW: Include form data for signature validation
  formData?: any;
  currentStatus: string;
}

export interface ClientInfo {
  id: number;
  name: string;
  email: string;
  phone?: string;
  commonFields?: any
}

export interface AvailableForm {
  id: number;
  formKey: string;
  title: string;
  version: number;
}