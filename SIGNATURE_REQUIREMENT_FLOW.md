# How Signature Requirements Work - Complete Flow

## **Overview**
The system determines signature requirements through a multi-layer approach that flows from form definition to client interface.

## **1. Database Level - Form Definition**

### **MasterForm Table**
```sql
model MasterForm {
  id                Int      @id @default(autoincrement())
  formKey           String   @unique
  title             String
  version           Int
  schema            Json
  requiresSignature Boolean? -- This field determines if form needs signature
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

**Key Point:** Each form type has a `requiresSignature` field that defines whether that specific form requires client signature.

## **2. Form Assignment Level**

### **When Admin Assigns Forms:**
1. Admin selects forms to assign to client
2. System creates `FormAssignment` records
3. Each assignment links to a `MasterForm` which has the `requiresSignature` property

### **FormAssignment → MasterForm Relationship:**
```typescript
FormAssignment {
  id: number
  clientId: number
  formId: number  // Links to MasterForm.id
  formVersion: number
  form: {
    requiresSignature: boolean // Comes from MasterForm
  }
}
```

## **3. Admin Interface - Form Status Logic**

### **Status Determination:**
```typescript
const getFormStatus = (assignment: FormAssignmentWithDetails) => {
  const requiresSignature = assignment.form.requiresSignature === true;
  
  if (assignment.clientSignature) {
    return { status: 'Client Signed' }; // ✅ Signed
  } else if (assignment.isCompleted && requiresSignature) {
    return { status: 'Ready for Signature' }; // 🔵 Needs signature
  } else if (assignment.isCompleted && !requiresSignature) {
    return { status: 'Completed' }; // ✅ No signature needed
  }
  // ... other statuses
};
```

### **Visual Indicators:**
- **Purple badge** shows "Requires Signature" for forms that need signatures
- **Status colors** differentiate between completed vs ready-for-signature
- **Checkboxes** only appear for completed forms (ready for signature links)

## **4. Signature Link Generation**

### **When Admin Generates Link:**
1. Admin selects completed forms
2. System creates `FormBatch` with `isSignatureOnly: true`
3. Creates `SignatureBatchForm` entries linking to `FormSubmission`
4. Each form submission includes the original form's `requiresSignature` property

### **Data Flow:**
```
FormAssignment → FormSubmission → MasterForm.requiresSignature
```

## **5. Client Signature Interface**

### **When Client Opens Link:**
1. Client accesses `/forms/signature/[token]`
2. System fetches `FormBatch` with all related `SignatureBatchForm` entries
3. Each entry includes `FormSubmission.form.requiresSignature`

### **Client Interface Logic:**
```typescript
const getFormStatus = (form: SignatureForm) => {
  const requiresSignature = form.formSubmission.form.requiresSignature;
  
  if (!requiresSignature) {
    return {
      status: 'View Only',        // 👁️ Just for viewing
      action: 'View Form'
    };
  } else if (form.formSubmission.clientSignature) {
    return {
      status: 'Signed',          // ✅ Already signed
      action: 'View Signed'
    };
  } else {
    return {
      status: 'Requires Signature', // ✏️ Needs signature
      action: 'Sign Form'
    };
  }
};
```

### **Client Experience:**
- **Forms requiring signature:** Show "Sign Form" button
- **Forms not requiring signature:** Show "View Form" button (read-only)
- **Already signed forms:** Show "View Signed" with signature details

## **6. How requiresSignature is Set**

### **Current Implementation:**
The `requiresSignature` field is set at the database level when forms are created. Currently, this seems to be done manually or through database seeding.

### **Typical Values:**
```sql
-- Example form definitions
INSERT INTO MasterForm (formKey, title, version, requiresSignature) VALUES
('client_intake_form', 'Client Intake Form', 1, true),
('medical_assessment', 'Medical Assessment', 1, true),
('service_agreement', 'Service Agreement', 1, true),
('information_sheet', 'Information Sheet', 1, false);
```

## **7. Complete Flow Example**

### **Scenario: Client Intake Form Requires Signature**

1. **Form Definition:** `client_intake_form` has `requiresSignature: true`
2. **Assignment:** Admin assigns form to client
3. **Form Filling:** Admin fills out form, clicks "Submit Form"
4. **Status:** Form shows as "Ready for Signature" (blue badge)
5. **Link Generation:** Admin selects form, generates signature link
6. **Client Access:** Client opens link, sees "Sign Form" button
7. **Signature:** Client signs form
8. **Completion:** Form status changes to "Client Signed" (green badge)

### **Scenario: Information Sheet (View Only)**

1. **Form Definition:** `information_sheet` has `requiresSignature: false`
2. **Assignment:** Admin assigns form to client
3. **Form Filling:** Admin fills out form, clicks "Submit Form"
4. **Status:** Form shows as "Completed" (green badge)
5. **Link Generation:** Admin can include in signature link
6. **Client Access:** Client opens link, sees "View Form" button (read-only)
7. **Completion:** No signature needed, just for client reference

## **8. Key Benefits**

- ✅ **Flexible per form:** Each form type can have different signature requirements
- ✅ **Clear visual indicators:** Admin knows which forms need signatures
- ✅ **Proper client experience:** Clients see appropriate actions (sign vs view)
- ✅ **Mixed signature links:** Can include both signature-required and view-only forms
- ✅ **Audit trail:** System tracks what requires signatures and what doesn't

## **9. Current Question: How to Set requiresSignature**

**The missing piece:** There doesn't seem to be an admin interface to set `requiresSignature` when creating/managing forms. This is currently handled at the database level.

**Potential Enhancement:** Add form management interface where admins can:
- Create new form types
- Set whether each form requires signature
- Update existing form signature requirements

This would make the system more flexible and user-friendly for administrators.
