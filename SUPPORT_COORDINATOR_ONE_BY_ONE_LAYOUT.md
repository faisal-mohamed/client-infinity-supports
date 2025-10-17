# Support Coordinator - One by One Layout Implementation

## Overview

Updated the Support Coordinator section to use the **same layout as GP Medical Contact** - with each field on its own full-width row (one by one), instead of the previous two-column layout.

## Layout Change

### ✅ **Before (Two-Column Layout):**
```
Row 1: Name | Email Address
Row 2: Company | Contact Number
```

### ✅ **After (One by One Layout):**
```
Row 1: Name (full width)
Row 2: Email Address (full width)
Row 3: Company (full width)
Row 4: Contact Number (full width)
```

## Implementation

### **PDF Component (@react-pdf/renderer)**

```typescript
{/* Section 2: Support Coordinator - One by One Layout */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Support Coordinator</Text>
  
  {/* Name - Full Width Row */}
  <View style={styles.fieldRow}>
    <Text style={styles.label}>Name:</Text>
    <Text style={styles.value}>{getValue('supportCoordinatorName')}</Text>
  </View>
  
  {/* Email Address - Full Width Row */}
  <View style={styles.fieldRow}>
    <Text style={styles.label}>Email Address:</Text>
    <Text style={styles.value}>{getValue('supportCoordinatorEmail')}</Text>
  </View>
  
  {/* Company - Full Width Row */}
  <View style={styles.fieldRow}>
    <Text style={styles.label}>Company:</Text>
    <Text style={styles.value}>{getValue('supportCoordinatorCompany')}</Text>
  </View>
  
  {/* Contact Number - Full Width Row */}
  <View style={styles.fieldRow}>
    <Text style={styles.label}>Contact number:</Text>
    <Text style={styles.value}>{getValue('supportCoordinatorContact')}</Text>
  </View>
</View>
```

### **Unified Component (HTML/Table)**

```typescript
{/* Name - Full Width Row */}
<tr>
  <td className="border border-black px-1 py-0.5 font-semibold" style={{ width: "25%" }}>Name:</td>
  <td className="border border-black px-1 py-0.5" colSpan={3}>{getFieldValue('supportCoordinatorName')}</td>
</tr>
{/* Email Address - Full Width Row */}
<tr>
  <td className="border border-black px-1 py-0.5 font-semibold" style={{ width: "25%" }}>Email Address:</td>
  <td className="border border-black px-1 py-0.5" colSpan={3}>{getFieldValue('supportCoordinatorEmail')}</td>
</tr>
{/* Company - Full Width Row */}
<tr>
  <td className="border border-black px-1 py-0.5 font-semibold" style={{ width: "25%" }}>Company:</td>
  <td className="border border-black px-1 py-0.5" colSpan={3}>{getFieldValue('supportCoordinatorCompany')}</td>
</tr>
{/* Contact Number - Full Width Row */}
<tr>
  <td className="border border-black px-1 py-0.5 font-semibold" style={{ width: "25%" }}>Contact number:</td>
  <td className="border border-black px-1 py-0.5" colSpan={3}>{getFieldValue('supportCoordinatorContact')}</td>
</tr>
```

## Layout Comparison

### **GP Medical Contact (Reference Layout):**
```
Row 1: Medical Centre Name (full width)
Row 2: Phone (full width)
```

### **Support Coordinator (Now Matching):**
```
Row 1: Name (full width)
Row 2: Email Address (full width)
Row 3: Company (full width)
Row 4: Contact Number (full width)
```

## Benefits

### ✅ **Consistency**
- **Same layout pattern** as GP Medical Contact section
- **Uniform field spacing** and alignment
- **Consistent user experience** across sections

### ✅ **Readability**
- **Each field gets full width** for better readability
- **Clear field separation** with individual rows
- **Better data entry experience** for users

### ✅ **Professional Appearance**
- **Clean, organized layout** with proper spacing
- **Consistent styling** across all fields
- **Professional form design** standards

## Files Updated

### **1. PDF Component**
- **File:** `src/components-server/PrintableForms/ClientIntakev2.tsx`
- **Changes:** Updated Support Coordinator to use one-by-one layout

### **2. Unified Component**
- **File:** `src/app/components/forms/client_intake_form/ClientIntakeFormUnified.tsx`
- **Changes:** Updated table structure to match one-by-one layout

## Visual Result

The Support Coordinator section now has:
- ✅ **4 separate rows** - one for each field
- ✅ **Full width** for each field value
- ✅ **Consistent layout** matching GP Medical Contact
- ✅ **Professional spacing** and alignment
- ✅ **Clean table structure** with grey headers

## Summary

The Support Coordinator section now uses the **same one-by-one layout as GP Medical Contact**:

1. ✅ **Name** - Full width row
2. ✅ **Email Address** - Full width row
3. ✅ **Company** - Full width row
4. ✅ **Contact Number** - Full width row

This provides a **consistent and professional layout** that matches the GP Medical Contact section design pattern, ensuring a uniform user experience across the form.
