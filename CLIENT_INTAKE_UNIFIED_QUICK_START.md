# 🚀 Client Intake Form - Quick Start Guide

## ✨ What Changed?

You now have **ONE component** that handles both:
1. **Interactive Form** (for filling/editing)
2. **PDF Download** (for printing)

---

## 📦 Simple Usage

### **For Interactive Form (Edit Mode)**

```tsx
import ClientIntakeFormUnified from "@/app/components/forms/client_intake_form/ClientIntakeFormUnified";

<ClientIntakeFormUnified 
  mode="interactive"
  formData={formData}
  commonFieldsData={commonFieldsData}
  onChange={handleChange}
  handleSaveProgress={handleSave}
  handleSubmitForm={handleSubmit}
/>
```

---

### **For PDF/Download (View Mode)**

```tsx
import ClientIntakeFormUnified from "@/app/components/forms/client_intake_form/ClientIntakeFormUnified";

<ClientIntakeFormUnified 
  mode="pdf"
  formData={formData}
  commonFieldsData={commonFieldsData}
  images={{ infinityLogo: "/infinity_logo.png" }}
  settings={{
    company_website: "https://www.infinitysupportswa.org",
    client_intake_form_id: "CF001",
    review_date: "2024-12-31"
  }}
/>
```

---

## 🎯 Key Points

1. **Same component**, different `mode` prop
2. **No more maintaining 2 separate files**
3. **Data stays consistent** between view and edit
4. **Already configured** in your form registry

---

## ✅ What Was Done

| Task | Status | File |
|------|--------|------|
| Remove padding from Person Centred Plan PDF | ✅ Done | `PersonCentredPlanPDF.tsx` |
| Create unified component | ✅ Done | `ClientIntakeFormUnified.tsx` |
| Create wrapper components | ✅ Done | `ClientIntakeFormEdit.tsx` + `ClientIntakeFormView.tsx` |
| Update registry | ✅ Done | `registry.ts` |
| Add documentation | ✅ Done | `UNIFIED_CLIENT_INTAKE_FORM.md` |

---

## 🔄 How It Works

```
┌─────────────────────────────────┐
│  ClientIntakeFormUnified        │
│                                 │
│  Props: mode = ?                │
└────────────┬────────────────────┘
             │
             ├──── mode="interactive" ──> Multi-step wizard form
             │                            (9 sections, validation, save)
             │
             └──── mode="pdf" ──────────> A4 printable pages
                                          (6 pages, formatted tables)
```

---

## 📞 Need Help?

Check the full documentation: `UNIFIED_CLIENT_INTAKE_FORM.md`

---

**That's it! You're ready to use the unified form! 🎉**

