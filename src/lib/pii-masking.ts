/**
 * PII Data Masking Utilities
 * Government-grade compliance for NDIS participant data protection.
 * All masking functions are pure, deterministic, and null-safe.
 */

export function maskEmail(email: string | null | undefined): string {
  if (!email || typeof email !== 'string') return '••••@••••';
  const parts = email.split('@');
  if (parts.length !== 2) return '••••@••••';
  const [local, domain] = parts;
  const maskedLocal = local.length <= 2 ? '••' : local[0] + '•'.repeat(local.length - 2) + local[local.length - 1];
  const domainParts = domain.split('.');
  const maskedDomain = domainParts[0][0] + '•'.repeat(Math.max(domainParts[0].length - 1, 1)) + '.' + domainParts.slice(1).join('.');
  return `${maskedLocal}@${maskedDomain}`;
}

export function maskPhone(phone: string | null | undefined): string {
  if (!phone || typeof phone !== 'string') return '•••• ••• •••';
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return '•'.repeat(phone.length);
  return '•'.repeat(digits.length - 3) + ' ' + digits.slice(-3);
}

export function maskNDIS(ndis: string | null | undefined): string {
  if (!ndis || typeof ndis !== 'string') return '•••-•••-••••';
  const digits = ndis.replace(/\D/g, '');
  if (digits.length < 4) return '•'.repeat(ndis.length);
  return '•'.repeat(digits.length - 4) + digits.slice(-4);
}

export function maskDOB(dob: string | null | undefined): string {
  if (!dob || typeof dob !== 'string') return '••/••/••••';
  // Show only the year for age verification context
  const match = dob.match(/(\d{4})/);
  if (match) return `••/••/${match[1]}`;
  return '••/••/••••';
}

export function maskAddress(address: string | null | undefined): string {
  if (!address || typeof address !== 'string') return '•••••••••';
  // Show only last word (typically suburb or state)
  const parts = address.trim().split(/\s+/);
  if (parts.length <= 1) return '•'.repeat(address.length);
  return '•'.repeat(address.length - parts[parts.length - 1].length - 1) + ' ' + parts[parts.length - 1];
}

export function maskStreet(street: string | null | undefined): string {
  if (!street || typeof street !== 'string') return '•••••••••';
  // Hide street number, show street name partially
  const parts = street.trim().split(/\s+/);
  if (parts.length <= 1) return '•'.repeat(street.length);
  return '••• ' + parts.slice(1).join(' ');
}

export function maskName(name: string | null | undefined): string {
  if (!name || typeof name !== 'string') return '••••';
  if (name.length <= 1) return '•';
  return name[0] + '•'.repeat(name.length - 1);
}

export function maskPostCode(postCode: string | null | undefined): string {
  if (!postCode || typeof postCode !== 'string') return '••••';
  if (postCode.length <= 2) return '•'.repeat(postCode.length);
  return postCode[0] + '•'.repeat(postCode.length - 2) + postCode[postCode.length - 1];
}

export function maskGeneric(value: string | null | undefined): string {
  if (!value || typeof value !== 'string') return '••••';
  if (value.length <= 2) return '•'.repeat(value.length);
  return value[0] + '•'.repeat(value.length - 2) + value[value.length - 1];
}

/** Fields in CommonField that are PII and their masking functions */
export const COMMON_FIELD_MASKING_RULES: Record<string, (v: any) => string> = {
  name: maskName,
  surname: maskName,
  email: maskEmail,
  phone: maskPhone,
  dob: maskDOB,
  ndis: maskNDIS,
  street: maskStreet,
  address: maskAddress,
  postCode: maskPostCode,
  state: (v) => v || '', // State is low-sensitivity, keep visible
  sex: (v) => v || '',   // Sex is low-sensitivity, keep visible
  age: (v) => v != null ? String(v) : '', // Age is low-sensitivity
  disability: maskGeneric,
};

/**
 * PII field patterns in formData JSON that should be masked.
 * Keys are regex patterns matched against formData field names.
 */
export const FORM_DATA_PII_PATTERNS: Array<{ pattern: RegExp; mask: (v: any) => string }> = [
  { pattern: /^(givenName|givenNames|firstName|participantName|fullName|nomineeName|representativeName|advocateName|primaryContactName|secondaryContactName|emergencyContactName|guardianName?)$/i, mask: maskName },
  { pattern: /^(surname|familyName|lastName)$/i, mask: maskName },
  { pattern: /^(email|advocateEmail|supportCoordinatorEmail|emergencyContactEmail)$/i, mask: maskEmail },
  { pattern: /^(phone|mobile|homePhone|mobilePhone|phoneNumber|advocatePhone|advocateMobile|primaryContactHomePhone|primaryContactMobile|secondaryContactHomePhone|secondaryContactMobile|emergencyContactPhone|supportCoordinatorContact|medicalPhone)$/i, mask: maskPhone },
  { pattern: /^(ndisNumber|ndis)$/i, mask: maskNDIS },
  { pattern: /^(dob|dateOfBirth)$/i, mask: maskDOB },
  { pattern: /^(address|addressNumberStreet|advocateAddress|advocatePostalAddress|guardianAddress)$/i, mask: maskStreet },
  { pattern: /^(postcode|postCode)$/i, mask: maskPostCode },
  { pattern: /^(disabilityConditions)$/i, mask: maskGeneric },
];

/**
 * Apply masking to commonFieldsData object.
 * Returns a new object with masked values — does NOT mutate input.
 */
export function maskCommonFields(commonFields: Record<string, any> | null | undefined): Record<string, any> {
  if (!commonFields) return {};
  const masked: Record<string, any> = { ...commonFields };
  for (const [key, maskFn] of Object.entries(COMMON_FIELD_MASKING_RULES)) {
    if (key in masked && masked[key] != null) {
      masked[key] = maskFn(masked[key]);
    }
  }
  return masked;
}

/**
 * Apply masking to formData JSON object.
 * Only masks top-level string fields matching PII patterns.
 * Returns a new object — does NOT mutate input.
 */
export function maskFormData(formData: Record<string, any> | null | undefined): Record<string, any> {
  if (!formData) return {};
  const masked: Record<string, any> = { ...formData };
  for (const key of Object.keys(masked)) {
    if (masked[key] == null || typeof masked[key] !== 'string') continue;
    for (const rule of FORM_DATA_PII_PATTERNS) {
      if (rule.pattern.test(key)) {
        masked[key] = rule.mask(masked[key]);
        break;
      }
    }
  }
  return masked;
}
