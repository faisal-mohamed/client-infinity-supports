// Types
export interface FormAssignmentWithDetails {
  id: string | number;
  formId: string | number;
  formVersion: number;
  assignedAt: string;
  displayOrder: number;
  instanceNumber: number; // Add instanceNumber
  isCompleted: boolean; // Add this field
  form: {
    id: string | number;
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
  staffSignature?: string;
  staffSignedAt?: string;
  adminSignature?: string;
  // NEW: Include form data for signature validation
  formData?: any;
  currentStatus: string;
}

export interface ClientInfo {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  commonFields?: any
}

export interface AvailableForm {
  id: string | number;
  formKey: string;
  title: string;
  version: number;
}