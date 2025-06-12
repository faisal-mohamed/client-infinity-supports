/**
 * Form Validation Utilities
 *
 * This file contains validation functions for different form types.
 * Each form type has its own validation function that returns field-specific errors
 * and an overall validation status.
 */

/**
 * Validates the Client Intake Form
 * @param formValues The form values to validate
 * @returns Object with isValid flag and field-specific errors
 */
export const validateClientIntakeForm = (formValues: any): { isValid: boolean, errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  // Basic Required Fields
  if (!formValues.givenName) errors.givenName = "Given name is required";
  if (!formValues.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
  if (!formValues.addressNumberStreet) errors.addressNumberStreet = "Address is required";
  if (!formValues.state) errors.state = "State is required";
  if (!formValues.postcode) errors.postcode = "Postcode is required";

  // Contact Details
  if (!formValues.email) errors.email = "Email is required";
  else if (!isValidEmail(formValues.email)) errors.email = "Please enter a valid email address";

  if (!formValues.homePhone) errors.homePhone = "Home Phone is required";
  else if (!isValidPhone(formValues.homePhone)) errors.homePhone = "Please enter a valid home phone number";

  if (!formValues.mobile) errors.mobile = "Mobile number is required";
  else if (!isValidPhone(formValues.mobile)) errors.mobile = "Please enter a valid mobile number";

  // Support Coordinator
  if (!formValues.supportCoordinatorName) errors.supportCoordinatorName = "Support Coordinator Name is required";
  if (!formValues.supportCoordinatorEmail) errors.supportCoordinatorEmail = "Support Coordinator Email is required";
  else if (!isValidEmail(formValues.supportCoordinatorEmail)) errors.supportCoordinatorEmail = "Enter a valid Support Coordinator Email";

  // Advocate Info
  if (!formValues.advocateName) errors.advocateName = "Advocate name is required";
  if (!formValues.advocateEmail) errors.advocateEmail = "Advocate email is required";
  else if (!isValidEmail(formValues.advocateEmail)) errors.advocateEmail = "Valid Advocate email is required";
  if (!formValues.advocatePhone) errors.advocatePhone = "Advocate phone is required";

  // Emergency Contacts
  if (!formValues.primaryContactName) errors.primaryContactName = "Primary contact name is required";
  if (!formValues.primaryContactMobile) errors.primaryContactMobile = "Primary Contact Mobile is required";
  else if (!isValidPhone(formValues.primaryContactMobile)) errors.primaryContactMobile = "Valid Primary Contact Mobile is required";

  // Living & Travel Arrangements
  if (!formValues.livingArrangements || formValues.livingArrangements.length === 0)
    errors.livingArrangements = "At least one living arrangement must be selected";
  if (!formValues.travelArrangements || formValues.travelArrangements.length === 0)
    errors.travelArrangements = "At least one travel arrangement must be selected";

  // Cultural & Communication
  if (!formValues.language) errors.language = "Language field is required";
  if (!formValues.countryOfBirth) errors.countryOfBirth = "Country of Birth is required";

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
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
export const getValidationForForm = (formKey: string): ((values: any) => { isValid: boolean, errors: Record<string, string> }) => {
  switch (formKey) {
    case 'client_intake_form':
      return validateClientIntakeForm;
    default:
      return () => ({ isValid: true, errors: {} });
  }
};
