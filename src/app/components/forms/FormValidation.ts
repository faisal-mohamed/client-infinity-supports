/**
 * Form Validation Utilities
 * 
 * This file contains validation functions for different form types.
 * Each form type has its own validation function that returns an error message
 * if validation fails, or null if validation passes.
 */

/**
 * Validates the Client Intake Form
 * @param formValues The form values to validate
 * @returns Error message if validation fails, null if validation passes
 */
export const validateClientIntakeForm = (formValues: any): string | null => {
  // Basic Required Fields
  if (!formValues.givenName) return "Given name is required";
  if (!formValues.dateOfBirth) return "Date of birth is required";
  if (!formValues.addressNumberStreet) return "Address is required";
  if (!formValues.state) return "State is required";
  if (!formValues.postcode) return "Postcode is required";

  // Contact Details
  if (!formValues.email) return "Email is required";
  if (!isValidEmail(formValues.email)) return "Please enter a valid email address";

  if (!formValues.homePhone) return "Home Phone is required";
  if (!isValidPhone(formValues.homePhone)) return "Please enter a valid home phone number";

  if (!formValues.mobile) return "Mobile number is required";
  if (!isValidPhone(formValues.mobile)) return "Please enter a valid mobile number";

  // Support Coordinator
  if (!formValues.supportCoordinatorName) return "Support Coordinator Name is required";
  if (!formValues.supportCoordinatorEmail) return "Support Coordinator Email is required";
  if (!isValidEmail(formValues.supportCoordinatorEmail)) return "Enter a valid Support Coordinator Email";

  // Advocate Info
  if (!formValues.advocateName) return "Advocate name is required";
  if (!formValues.advocateEmail || !isValidEmail(formValues.advocateEmail)) return "Valid Advocate email is required";
  if (!formValues.advocatePhone) return "Advocate phone is required";

  // Emergency Contacts
  if (!formValues.primaryContactName) return "Primary contact name is required";
  if (!formValues.primaryContactMobile || !isValidPhone(formValues.primaryContactMobile)) return "Valid Primary Contact Mobile is required";

  // Living & Travel Arrangements
  if (!formValues.livingArrangements || formValues.livingArrangements.length === 0) return "At least one living arrangement must be selected";
  if (!formValues.travelArrangements || formValues.travelArrangements.length === 0) return "At least one travel arrangement must be selected";

  // Cultural & Communication
  if (!formValues.language) return "Language field is required";
  if (!formValues.countryOfBirth) return "Country of Birth is required";

  return null; // All validations passed
};

/**
 * Validates an email address
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a phone number
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9\s\-\(\)]+$/;
  return phoneRegex.test(phone);
};

/**
 * Get the validation function for a specific form type
 */
export const getValidationForForm = (formKey: string): ((values: any) => string | null) => {
  switch (formKey) {
    case 'client_intake_form':
      return validateClientIntakeForm;
    default:
      return () => null;
  }
};
