# ✅ Emergency Drill Form - Signature Link Access Controls

## Overview

Implemented specific access controls for the Emergency Drill form when accessed via signature links. The form now has different edit permissions for clients/staff vs. admins.

## Access Control Rules

### For Admin Edit Page (`/admin/clients/[id]/forms/edit/[assignmentId]`)

- **All sections (1-7)**: Fully editable ✏️
- No restrictions

### For Signature Link Page (`/forms/signature/[token]/[formSubmissionId]`)

| Section #      | Section Name                   | Access Level     | Details                       |
| -------------- | ------------------------------ | ---------------- | ----------------------------- |
| 1              | General Information            | ✅ **Editable**  | Client + Staff can fill       |
| 2              | Type of Drill Conducted        | ✅ **Editable**  | Client + Staff can fill       |
| 3              | Drill Execution Details        | ✅ **Editable**  | Client + Staff can fill       |
| 4              | Observations & Challenges      | ✅ **Editable**  | Client + Staff can fill       |
| 5              | Recommendations & Improvements | ✅ **Editable**  | Client + Staff can fill       |
| 6              | **Follow-up**                  | 🔒 **VIEW ONLY** | Reserved for admin/supervisor |
| 7 (Signatures) | Support Worker Signature       | ✅ **Editable**  | Staff can sign                |
| 7 (Signatures) | Signature Date                 | ✅ **Editable**  | Can edit date                 |
| 7 (Signatures) | Supervisor Signature           | 🔒 **VIEW ONLY** | Reserved for supervisor       |

## Implementation Details

### 1. New Prop: `isSignatureLink`

Added to `FormProps` interface:

```typescript
interface FormProps {
  // ... existing props
  isSignatureLink?: boolean; // If true, apply signature link access restrictions
}
```

### 2. Access Control Helper Function

```typescript
const isFieldReadOnly = (fieldName: string) => {
  if (!isSignatureLink) return readOnly; // Admin view - use default readOnly prop

  // Signature link restrictions:
  // Section 5 (Follow-up) - ALL fields read-only
  if (currentStep === 5) return true;

  // Section 6 (Signatures) - Only supervisorSignature is read-only
  if (currentStep === 6 && fieldName === "supervisorSignature") return true;

  // Sections 0-4: Fully editable
  // Section 6: supportWorkerSignature and signatureDate editable
  return readOnly;
};
```

### 3. Updated Field Renderers

All field rendering methods now use `isFieldReadOnly()`:

- ✅ `renderInput` - Text, date, time inputs
- ✅ `renderTextArea` - Textareas
- ✅ `renderDropdown` - Dropdowns
- ✅ `renderSignatureField` - Signature canvases

### 4. Visual Indicators

#### "View Only" Badges

Fields that are read-only in signature link mode show an amber badge:

```tsx
{
  fieldIsReadOnly && isSignatureLink && (
    <span className="ml-2 text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
      View Only
    </span>
  );
}
```

#### Styling Changes

- Read-only fields in signature link: `bg-gray-50 border-gray-300`
- Supervisor signature placeholder: "View only - signature will be added by supervisor"

## Form Sections Mapping

```typescript
FORM_SECTIONS[0] = Section 1: General Information
FORM_SECTIONS[1] = Section 2: Type of Drill Conducted
FORM_SECTIONS[2] = Section 3: Drill Execution Details
FORM_SECTIONS[3] = Section 4: Observations and Challenges
FORM_SECTIONS[4] = Section 5: Recommendations & Improvements
FORM_SECTIONS[5] = Section 6: Follow-up (VIEW ONLY in signature link)
FORM_SECTIONS[6] = Section 7: Signatures (partial edit - only supportWorker)
```

## Files Modified

### ✅ `emergency-drill/Edit.tsx`

- Added `isSignatureLink` prop
- Added `isFieldReadOnly()` helper function
- Updated all field renderers to use the helper
- Added "View Only" badges for restricted fields

### ✅ `FormSignaturePageClient.tsx`

- Passed `isSignatureLink={true}` to FormEditComponent

## Testing Checklist

### Admin View Test:

1. ✅ Login as admin
2. ✅ Go to client → forms → edit emergency drill
3. ✅ All 7 sections should be fully editable
4. ✅ No "View Only" badges should appear

### Signature Link View Test:

1. ✅ Generate signature link for emergency drill form
2. ✅ Open the signature link
3. ✅ Sections 1-5: All fields should be editable
4. ✅ Section 6 (Follow-up): All fields should be read-only with "View Only" badges
5. ✅ Section 7 (Signatures):
   - Support Worker Signature: ✅ Editable
   - Signature Date: ✅ Editable
   - Supervisor Signature: 🔒 Read-only with "View Only" badge

## User Experience

### For Staff/Client (via Signature Link):

- Can fill sections 1-5 completely
- Section 6 (Follow-up) appears but cannot be edited (admin will complete)
- Can sign as support worker and add date
- Supervisor signature field is visible but locked (supervisor will complete later)

### For Admin:

- Full access to all sections
- Can complete Follow-up section
- Can add supervisor signature
- No restrictions

## Benefits

1. **Clear Separation of Duties**: Staff and clients handle field work, supervisors handle follow-up
2. **Visual Clarity**: "View Only" badges make it clear which fields are locked
3. **Data Integrity**: Prevents accidental edits to supervisor-only fields
4. **Workflow Enforcement**: Ensures proper approval process is followed

## Future Enhancements

If you want to apply similar access controls to other forms:

1. Add `isSignatureLink` prop to the form component
2. Define which sections/fields should be restricted
3. Update `isFieldReadOnly()` helper with your logic
4. Pass `isSignatureLink={true}` from FormSignaturePageClient

Example for other forms:

```typescript
// In FormSignaturePageClient.tsx
if (formData.formSubmission.form.formKey === "welcome_form") {
  FormEditComponent = getFormComponent("welcome_form", "edit");
}

// Then pass isSignatureLink={true} to the component
```
