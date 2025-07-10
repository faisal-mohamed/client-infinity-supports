# Frontend Update Example - Separate Save vs Submit

## 🎯 Update HomeVisitRiskAssessmentEdit.tsx

### **Before (Single Function):**
```typescript
const handleSaveWithConfirm = async (submit: boolean) => {
  // Single API call with submit parameter
  const response = await fetch(`/api/form-assignments/${assignmentId}/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      formData,
      commonFieldsData,
      submit, // This parameter determined behavior
    }),
  });
};
```

### **After (Separate Functions):**
```typescript
// 🎯 SAVE PROGRESS FUNCTION
const handleSave = async () => {
  try {
    setSaving(true);
    
    const response = await fetch(`/api/form-assignments/${assignmentId}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formData,
        commonFieldsData,
        // No submit parameter needed
      }),
    });

    if (!response.ok) throw new Error('Failed to save form data');
    
    const result = await response.json();
    console.log('Save result:', result); // Should show currentStatus: "in_progress"

    showToast({
      type: 'success',
      title: 'Progress Saved',
      message: 'Your progress has been saved',
      duration: 3000,
    });

  } catch (error) {
    console.error('Error saving form:', error);
    showToast({
      type: 'error',
      title: 'Save Failed',
      message: 'Failed to save progress',
      duration: 3000,
    });
  } finally {
    setSaving(false);
  }
};

// 🎯 SUBMIT FORM FUNCTION
const handleSubmit = async () => {
  try {
    setSubmitting(true);
    
    const response = await fetch(`/api/form-assignments/${assignmentId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formData,
        commonFieldsData,
      }),
    });

    if (!response.ok) throw new Error('Failed to submit form');
    
    const result = await response.json();
    console.log('Submit result:', result); // Should show currentStatus: "completed" or error

    if (result.success) {
      showToast({
        type: 'success',
        title: 'Form Submitted',
        message: result.message,
        duration: 3000,
      });
      
      // Navigate back to forms list after successful submission
      setTimeout(() => {
        router.push(`/admin/clients/${clientId}/forms`);
      }, 1000);
      
    } else {
      // Submission failed due to missing requirements
      showToast({
        type: 'warning',
        title: 'Submission Failed',
        message: result.message,
        duration: 5000,
      });
    }

  } catch (error) {
    console.error('Error submitting form:', error);
    showToast({
      type: 'error',
      title: 'Submit Failed',
      message: 'Failed to submit form',
      duration: 3000,
    });
  } finally {
    setSubmitting(false);
  }
};

// 🎯 WRAPPER FUNCTION (if you want to keep existing interface)
const handleSaveWithConfirm = async (submit: boolean) => {
  if (submit) {
    await handleSubmit();
  } else {
    await handleSave();
  }
};
```

### **Button Updates:**
```typescript
// Save Progress Button
<button
  onClick={() => handleSave()}
  disabled={saving}
  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
>
  {saving ? 'Saving...' : 'Save Progress'}
</button>

// Submit Form Button  
<button
  onClick={() => handleSubmit()}
  disabled={submitting}
  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
>
  {submitting ? 'Submitting...' : 'Submit Form'}
</button>

// Or keep existing interface:
<button onClick={() => handleSaveWithConfirm(false)}>Save</button>
<button onClick={() => handleSaveWithConfirm(true)}>Submit</button>
```

### **State Variables:**
```typescript
const [saving, setSaving] = useState(false);
const [submitting, setSubmitting] = useState(false);
```

## 🎯 Benefits of This Approach

### **✅ Clear Separation:**
- **Save** → Progress save, status: "in_progress"
- **Submit** → Final submission, status: "completed" (if requirements met)

### **✅ Better UX:**
- Different loading states for save vs submit
- Clear messaging about what's happening
- Proper error handling for each operation

### **✅ Flexible:**
- Can add submission validations
- Can add different behaviors for each operation
- Easy to extend with additional features

## 🧪 Testing

### **Test Save:**
1. Edit form and click "Save Progress"
2. Check console: should see `currentStatus: "in_progress"`
3. Form should remain editable

### **Test Submit:**
1. Complete form and click "Submit Form"
2. If signatures missing: should get warning message
3. If complete: should see `currentStatus: "completed"` and redirect

This approach gives you much cleaner separation and better control! 🎉
