export interface CommonField {
  id?: number;
  clientId: number;
  name?: string;
  age?: number | null;
  email?: string;
  sex?: string;
  street?: string;
  state?: string;
  postCode?: string;
  dob?: string;
  ndis?: string;
  disability?: string;
  address?: string;
  phone?: string;
}

export interface SignatureInvalidationData {
  type: 'common-fields' | 'form-edit';
  affectedForms: Array<{
    id: number;
    title: string;
    version: number;
    formKey: string;
  }>;
  changes: string[];
}

/**
 * Detect changes in common fields
 */
export function detectCommonFieldChanges(original: CommonField | null, updated: CommonField): boolean {
  if (!original) return true; // If no original data, consider it a change
  
  const fieldsToCheck: (keyof CommonField)[] = [
    'name', 'age', 'email', 'sex', 'street', 'state', 'postCode', 
    'dob', 'ndis', 'disability', 'address', 'phone'
  ];
  
  return fieldsToCheck.some(field => {
    const originalValue = original[field] || '';
    const updatedValue = updated[field] || '';
    return String(originalValue) !== String(updatedValue);
  });
}

/**
 * Get list of changed common fields
 */
export function getChangedCommonFields(original: CommonField | null, updated: CommonField): string[] {
  if (!original) return Object.keys(updated).filter(key => key !== 'id' && key !== 'clientId');
  
  const fieldsToCheck: (keyof CommonField)[] = [
    'name', 'age', 'email', 'sex', 'street', 'state', 'postCode', 
    'dob', 'ndis', 'disability', 'address', 'phone'
  ];
  
  return fieldsToCheck.filter(field => {
    const originalValue = original[field] || '';
    const updatedValue = updated[field] || '';
    return String(originalValue) !== String(updatedValue);
  });
}

/**
 * Detect changes in form data
 */
export function detectFormDataChanges(original: any, updated: any): boolean {
  return JSON.stringify(original) !== JSON.stringify(updated);
}

/**
 * Get list of changed form fields
 */
export function getChangedFormFields(original: any, updated: any): string[] {
  const changes: string[] = [];
  
  const compareObjects = (obj1: any, obj2: any, prefix = '') => {
    const allKeys = new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})]);
    
    allKeys.forEach(key => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      const val1 = obj1?.[key];
      const val2 = obj2?.[key];
      
      if (typeof val1 === 'object' && typeof val2 === 'object' && val1 !== null && val2 !== null) {
        compareObjects(val1, val2, fullKey);
      } else if (val1 !== val2) {
        changes.push(fullKey);
      }
    });
  };
  
  compareObjects(original, updated);
  return changes;
}
