# Form Components Update - Separate Save/Submit Implementation

## ✅ Components Updated

### **1. HomeVisitRiskAssessmentEdit.tsx**
**Location**: `/src/app/components/forms/home_visit_risk_assessment/Edit.tsx`

### **2. ClientIntakeFormEnhanced.tsx**
**Location**: `/src/app/components/forms/client_intake_form/ClientIntakeFormEnhanced.tsx`

### **3. FormEditPageClient.tsx**
**Location**: `/src/app/admin/clients/[id]/forms/edit/[assignmentId]/FormEditPageClient.tsx`

## 🔧 Changes Made

### **Interface Updates:**
```typescript
interface FormProps {
  // ... existing props
  handleSave: (submit: boolean) => void; // Legacy - kept for compatibility
  handleSaveProgress?: () => Promise<void>; // NEW: separate save function
  handleSubmitForm?: () => Promise<void>; // NEW: separate submit function
}
```

### **New Functions Added:**

#### **🎯 Save Progress Function:**
```typescript
const handleSaveProgress = async () => {
  if (handleSaveProgress && typeof handleSaveProgress === 'function') {
    setSaving(true);
    try {
      await handleSaveProgress(); // Calls /api/.../save
    } finally {
      setSaving(false);
    }
  } else {
    handleSave(false); // Fallback to legacy
  }
};
```

#### **🎯 Submit Form Function:**
```typescript
const handleSubmitForm = async () => {
  // Validate required fields first
  const validation = validateRequiredFields();
  if (!validation.isValid) {
    showToast({ /* validation error */ });
    return;
  }

  if (handleSubmitForm && typeof handleSubmitForm === 'function') {
    setSubmitting(true);
    try {
      await handleSubmitForm(); // Calls /api/.../submit
    } finally {
      setSubmitting(false);
    }
  } else {
    handleSave(true); // Fallback to legacy
  }
};
```

### **Button Updates:**

#### **Save Progress Button:**
```typescript
<button
  onClick={() => handleSaveProgress()}
  disabled={saving || submitting}
  className="..."
>
  {saving ? 'Saving...' : 'Save Progress'}
</button>
```

#### **Submit Form Button:**
```typescript
<button
  onClick={() => handleSubmitForm()}
  disabled={saving || submitting}
  className="..."
>
  {submitting ? 'Submitting...' : 'Submit Form'}
</button>
```

### **Parent Component (FormEditPageClient.tsx):**

#### **New API Functions:**
```typescript
// Save Progress - calls /api/form-assignments/[id]/save
const handleSaveProgress = async () => {
  const response = await fetch(`/api/form-assignments/${assignmentId}/save`, {
    method: 'POST',
    body: JSON.stringify({ formData, commonFieldsData })
  });
  // Status: "in_progress"
};

// Submit Form - calls /api/form-assignments/[id]/submit  
const handleSubmitForm = async () => {
  const response = await fetch(`/api/form-assignments/${assignmentId}/submit`, {
    method: 'POST', 
    body: JSON.stringify({ formData, commonFieldsData })
  });
  // Status: "completed" (if requirements met)
};
```

## 🔄 Status Flow

### **Complete Workflow:**
```
1. Form Assignment Created → "not_started"
2. Admin Clicks "Save Progress" → "in_progress" (via /save API)
3. Admin Clicks "Submit Form" → 
   - Requirements met → "completed" (via /submit API)
   - Requirements missing → "in_progress" + warning message
```

### **API Calls:**
- **Save Progress** → `/api/form-assignments/[id]/save` → Status: `"in_progress"`
- **Submit Form** → `/api/form-assignments/[id]/submit` → Status: `"completed"` or `"in_progress"`

## 🎯 Backward Compatibility

### **Legacy Support:**
- ✅ Old `handleSave(submit: boolean)` function still works
- ✅ Components detect if new functions are provided
- ✅ Fallback to legacy behavior if new functions not available
- ✅ Gradual migration possible

### **Migration Path:**
1. **Phase 1**: New APIs work, components use new functions if available
2. **Phase 2**: All parent components provide new functions
3. **Phase 3**: Remove legacy `handleSave` function (future)

## 🧪 Testing

### **Test Save Progress:**
1. Edit form and click "Save Progress"
2. Should see "Saving..." then "Save Progress"
3. Check console: API call to `/save` endpoint
4. Status should be `"in_progress"`

### **Test Submit Form:**
1. Complete form and click "Submit Form"
2. Should see "Submitting..." then "Submit Form"
3. Check console: API call to `/submit` endpoint
4. If complete: Status `"completed"` + redirect
5. If incomplete: Warning message + Status `"in_progress"`

### **Test Validation:**
1. Try submitting incomplete form
2. Should see validation error toast
3. Should not make API call
4. Form should remain editable

## 🎉 Benefits Achieved

### **✅ Clear Separation:**
- Save Progress vs Submit Form are distinct operations
- Different loading states and messages
- Better user experience

### **✅ Proper Status Tracking:**
- Save → Always `"in_progress"`
- Submit → `"completed"` only when requirements met
- Clear status progression

### **✅ Enhanced UX:**
- Separate loading indicators
- Specific error messages
- Proper validation flow

### **✅ Future Ready:**
- Easy to add submission-specific features
- Can enhance validation per operation
- Flexible architecture

The components are now fully updated and ready to use the new separate save/submit API approach! 🚀
