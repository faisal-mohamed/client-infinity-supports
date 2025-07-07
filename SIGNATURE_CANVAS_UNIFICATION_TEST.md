# Signature Canvas Unification & Status Update Fix - Test Plan

## Issues Fixed

### Issue 1: Different Signature Canvas Components
- **Problem**: Edit component and signature portal used different signature canvas implementations
- **Solution**: Created a reusable `SignatureCanvas` component with consistent styling and functionality

### Issue 2: Status Not Updating When Signing in Edit Component
- **Problem**: Signing in edit component didn't update form status to "completed"
- **Solution**: Modified API to detect signature in form data and update `clientSignature` field

## Changes Made

### 1. New Reusable Component
**File**: `/src/components/ui/SignatureCanvas.tsx`
- Unified signature canvas with consistent API
- Handles existing signature loading
- Provides clear button and placeholder text
- Exposes standard methods: `clear()`, `isEmpty()`, `toDataURL()`

### 2. Updated Edit Component
**File**: `/src/app/components/forms/home_visit_risk_assessment/Edit.tsx`
- Now uses the reusable `SignatureCanvas` component
- Simplified signature handling logic
- Consistent styling with signature portal

### 3. Updated Signature Portal
**File**: `/src/app/forms/signature/[token]/[formSubmissionId]/FormSignaturePageClient.tsx`
- Now uses the same reusable `SignatureCanvas` component
- Consistent user experience across both interfaces

### 4. Enhanced API Logic
**File**: `/src/app/api/form-assignments/[assignmentId]/save/route.ts`
- Detects signature in form data (`formData.signature`)
- Updates `clientSignature` and `clientSignedAt` fields when signature is present
- Maintains backward compatibility

## Test Scenarios

### Scenario 1: Signature Canvas Consistency
1. **Edit Component Signature**:
   - Navigate to `/admin/clients/[id]/forms/edit/[assignmentId]`
   - Go to signature section
   - Verify signature canvas has same styling and functionality
   - Test clear button and signature drawing

2. **Signature Portal**:
   - Navigate to `/forms/signature/[token]/[formSubmissionId]`
   - Verify signature canvas looks identical to edit component
   - Test signature drawing and clear functionality

### Scenario 2: Status Update from Edit Component
1. **Before Fix**: 
   - Admin fills form with signature in edit component
   - Form status shows "Ready for Signature" (incorrect)
   - Checkbox not available for signature link generation

2. **After Fix**:
   - Admin fills form with signature in edit component
   - Form status should show "Client Signed" (correct)
   - Form should be marked as completed
   - No need for separate signature link

### Scenario 3: Mixed Workflow
1. **Admin fills form without signature**:
   - Status: "Ready for Signature"
   - Checkbox available for signature link generation

2. **Admin fills form with signature**:
   - Status: "Client Signed"
   - Form marked as completed
   - No signature link needed

### Scenario 4: Signature Portal Still Works
1. **Traditional workflow**:
   - Admin fills form without signature
   - Generates signature link
   - Client signs via portal
   - Status updates to "Client Signed"

## Expected Database States

### When Admin Signs in Edit Component:
```sql
FormSubmission:
  filledByAdmin: true
  adminFilledAt: timestamp
  clientSignature: base64_signature_data
  clientSignedAt: timestamp
  data: { signature: base64_signature_data, ... }
```

### When Client Signs via Portal:
```sql
FormSubmission:
  filledByAdmin: true
  adminFilledAt: timestamp
  clientSignature: base64_signature_data
  clientSignedAt: timestamp
  data: { ... } -- no signature field needed
```

## Testing Steps

### 1. Test Signature Canvas Consistency
```bash
# Start development server
npm run dev

# Test edit component
# Navigate to: /admin/clients/[id]/forms/edit/[assignmentId]
# Go to signature section and test drawing

# Test signature portal
# Generate signature link and test signing
```

### 2. Test Status Updates
```bash
# Test admin signing in edit component
1. Fill form completely including signature
2. Save form
3. Check form status in client forms list
4. Verify status shows "Client Signed"

# Test traditional workflow still works
1. Fill form without signature
2. Generate signature link
3. Sign via portal
4. Verify status updates correctly
```

### 3. Database Verification
```sql
-- Check FormSubmission record after admin signs in edit
SELECT 
  filledByAdmin,
  adminFilledAt,
  clientSignature IS NOT NULL as has_client_signature,
  clientSignedAt,
  data->>'signature' IS NOT NULL as has_form_signature
FROM FormSubmission 
WHERE id = [submission_id];
```

## Success Criteria

✅ **Signature Canvas Consistency**:
- Both edit and portal use identical signature canvas
- Same styling, functionality, and user experience

✅ **Status Update Fix**:
- Admin signing in edit component updates status to "Client Signed"
- Form marked as completed without needing separate signature link

✅ **Backward Compatibility**:
- Traditional signature portal workflow still works
- Existing signature links continue to function

✅ **Database Integrity**:
- `clientSignature` field updated correctly in both workflows
- Form data and signature data properly synchronized

## Rollback Plan

If issues arise:
1. Revert `SignatureCanvas.tsx` component
2. Restore original signature implementations in both components
3. Revert API changes in `save/route.ts`
4. Test original functionality
