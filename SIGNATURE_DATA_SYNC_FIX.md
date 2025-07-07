# Signature Data Synchronization Fix

## Issue Description

There was a mismatch between how signatures were stored in the edit component vs. the signature portal:

### **Edit Component (Working)**:
```json
{
  "FormSubmission": {
    "data": {
      "signature": "data:image/png;base64,iVBORw0KGgo...", // ✅ Stored here
      "name": "John Doe",
      "designation": "Manager"
    },
    "clientSignature": "data:image/png;base64,iVBORw0KGgo...", // ✅ Also stored here
    "clientSignedAt": "2025-01-07T18:13:11.923Z"
  }
}
```

### **Signature Portal (Issue)**:
```json
{
  "FormSubmission": {
    "data": {
      "signature": "", // ❌ NOT updated
      "name": "John Doe", 
      "designation": "Manager"
    },
    "clientSignature": "data:image/png;base64,iVBORw0KGgo...", // ✅ Stored here
    "clientSignedAt": "2025-01-07T18:13:11.923Z"
  }
}
```

## Root Cause

The signature validation system reads from form-specific data (`formData.signature`), but the signature portal API only updated the FormSubmission-level fields (`clientSignature`), not the form-specific data.

## Solution Applied

Updated the signature portal API (`/api/signature/[token]/[formSubmissionId]/route.ts`) to:

1. **Read current form data** before updating
2. **Get signature field mapping** from form registry
3. **Update both locations**:
   - FormSubmission.clientSignature (legacy compatibility)
   - FormSubmission.data.signature (new validation system)

### **Code Changes**

```typescript
// Get current form data
const currentSubmission = await prisma.formSubmission.findUnique({
  where: { id: formSubmissionIdInt },
  select: { data: true }
});

// Get signature field key from registry
const formConfig = getFormConfig(signatureForm.formSubmission.form.formKey);
const signatures = formConfig?.signatures || [];
const primarySignature = signatures.find(sig => sig.required) || signatures[0];
const signatureDataKey = primarySignature?.dataKey || 'signature';

// Update form-specific data to include the signature
const updatedFormData = {
  ...currentSubmission.data,
  [signatureDataKey]: signature // Store in form-specific data
};

// Update both locations
await prisma.formSubmission.update({
  where: { id: formSubmissionIdInt },
  data: {
    clientSignature: signature,     // Legacy location
    clientSignedAt: new Date(),
    data: updatedFormData,          // Form-specific data (NEW)
  },
});
```

## Result After Fix

Now both workflows store signatures consistently:

### **Edit Component**:
```json
{
  "data": { "signature": "base64..." },
  "clientSignature": "base64...",
  "clientSignedAt": "timestamp"
}
```

### **Signature Portal**:
```json
{
  "data": { "signature": "base64..." }, // ✅ NOW UPDATED
  "clientSignature": "base64...",
  "clientSignedAt": "timestamp"
}
```

## Benefits

1. **Consistent Status Updates**: Both workflows now show correct status
2. **Unified Validation**: Same validation logic works for both workflows
3. **Future-Proof**: Ready for multiple signature forms
4. **Backward Compatible**: Legacy `clientSignature` field still populated

## Testing Scenarios

### **Scenario 1: Edit Component Signing**
1. Admin fills form with signature in edit component
2. Status: "Signature Complete" ✅
3. Form marked as completed ✅

### **Scenario 2: Signature Portal Signing**
1. Admin fills form without signature
2. Generates signature link
3. Client signs via portal
4. Status: "Signature Complete" ✅ (FIXED)
5. Form marked as completed ✅ (FIXED)

### **Scenario 3: Mixed Workflow**
1. Admin fills form without signature
2. Client signs via portal
3. Admin can see signature in edit component ✅
4. Status consistent across all views ✅

## Future Enhancements

For multiple signature forms, you might want to:
1. Pass specific signature ID in the API request
2. Update only the relevant signature field
3. Validate all required signatures before marking complete

## Files Modified

- `/src/app/api/signature/[token]/[formSubmissionId]/route.ts`
  - Added form registry import
  - Enhanced signature storage logic
  - Added form-specific data synchronization
