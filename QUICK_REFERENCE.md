# Service Agreement Support Coordination - Quick Reference

## 🚀 Quick Start

### Files

```
View:     src/app/components/forms/sa-support-coordination/SASupportCoordinationDynamic.tsx
PDF:      src/components-server/PrintableForms/SASupportCoordination_MATCHING.tsx
Schema:   src/app/components/forms/sa-support-coordination/schema.ts
```

### Key Numbers

```typescript
PAGE_BUDGET:    1000px   // Available height per page
BLOCK_SPACING:  16px     // Space between blocks
SAFETY_BUFFER:  100px    // Header + footer margin
A4_WIDTH:       794px    // 210mm in pixels
A4_HEIGHT:      1123px   // 297mm in pixels
```

---

## 📋 Block Size Reference

| Size      | Type           | Examples                   |
| --------- | -------------- | -------------------------- |
| 30-40px   | Single item    | Checkbox, single bullet    |
| 50-80px   | Short section  | Small paragraph, 2-3 lines |
| 100-150px | Medium section | Table header, explanation  |
| 200-300px | Large section  | Responsibilities list      |

---

## 🎨 Styling Quick Reference

### Red Text

```tsx
<span className="font-bold text-red-600">Infinity Supports WA</span>
```

### Underline

```tsx
<span className="underline">text</span>
```

### Checkbox

```tsx
<input type="checkbox" className="mr-2 w-4 h-4 accent-blue-600" />
```

### Table

```tsx
<table className="w-full border border-black text-xs">
  <thead>
    <tr className="bg-gray-200">
      <th className="border border-black p-2">Header</th>
    </tr>
  </thead>
</table>
```

---

## 🔍 Common Patterns

### Conditional Rendering

```tsx
{
  getFieldValue("fieldName") && <div>Content</div>;
}
```

### Date Formatting

```tsx
{
  formatDate(getFieldValue("date"));
}
```

### Signature Display

```tsx
{
  signature ? (
    <img src={signature} alt="Signature" className="max-h-20" />
  ) : (
    <span className="text-gray-400">Not signed</span>
  );
}
```

---

## 🐛 Quick Troubleshooting

| Problem                 | Solution                                           |
| ----------------------- | -------------------------------------------------- |
| Content cut off         | Increase block height or split into smaller blocks |
| Empty pages             | Split large blocks (>300px) into smaller ones      |
| Scrollbars inside pages | Set `height: "1123px"` on A4Page                   |
| Content not flowing     | Remove `maxHeight`, add `overflow: hidden`         |
| Wrong heights           | Match measurement div width/padding to A4Page      |

---

## ✅ Pre-Deployment Checklist

- [ ] All content blocks defined
- [ ] Heights accurately estimated
- [ ] Red highlights applied
- [ ] Underlines added
- [ ] Conditional sections work
- [ ] PDF matches view
- [ ] No linting errors (warnings OK)
- [ ] Tested with short/medium/long content
- [ ] Print preview looks good
- [ ] Mobile responsive

---

## 📊 Block Distribution (Emergency Preparedness Example)

```
┌─────────────────────────────────┐
│ Part 1 (240px)                  │  Header, intro, training
│ • Header & title                │
│ • 5 cause bullets               │
│ • 3 training paragraphs         │
├─────────────────────────────────┤
│ Bullet 1 (35px)                 │  IDMP copy
├─────────────────────────────────┤
│ Bullet 2 (60px)                 │  Annual review (longest)
├─────────────────────────────────┤
│ Bullet 3 (35px)                 │  Rights/responsibilities
├─────────────────────────────────┤
│ Bullet 4 (35px)                 │  HR screening
├─────────────────────────────────┤
│ Bullet 5 (40px)                 │  High-Risk Register
├─────────────────────────────────┤
│ Audit (50px)                    │  NDIS audit statement
└─────────────────────────────────┘
Total: 495px across 7 flexible blocks
```

---

## 🎯 Content Order

1. Section 1 - Participant Details
2. 3 Checkboxes (individual)
3. Agreement Statement
4. Schedule Table
5. CONFLICT OF INTEREST
6. Signed/Print Name/Date
7. ENDING SERVICE AGREEMENT
8. SERVICE PAYMENTS (NDIS)
9. GST
10. RESPONSIBILITIES (Infinity)
11. RESPONSIBILITIES (Individual)
12. FEEDBACK & COMPLAINTS
13. EMERGENCY PREPAREDNESS (7 blocks)
14. Consent Table
15. Signatures (3 blocks)

---

## 💾 Field Mapping

### Common Fields (from commonFieldsData)

```typescript
name         → Given name(s)
surname      → Surname
dob          → Date of Birth
ndis         → NDIS Number
sex          → Sex
street       → Address
state        → State
postCode     → Postcode
email        → Email
phone        → Home Phone & Mobile
```

### Schedule Data (row-based)

```typescript
row1_weeks, row2_weeks, row3_weeks           → Weeks column
row1_totalHours, row2_totalHours, row3_totalHours → Total Hours column
row1_totalCost, row2_totalCost, row3_totalCost   → Total Cost column
```

### Payment Methods (boolean fields)

```typescript
selfManaged         → Self-managed checkbox
nomineeManaged      → Nominee managed checkbox
ndiaManaged         → NDIA managed checkbox
planManagerManaged  → Plan Manager checkbox
```

### Checkboxes (boolean values)

```typescript
noCopyRequested  → Participant may wish not to receive copy
planAttached     → Plan is attached
planNotAttached  → Individual chooses not to attach plan
```

### Signatures (base64 data URLs)

```typescript
signature             → Conflict of Interest table signature
participantSignature  → Participant signature (conditional)
nomineeSignature      → Nominee signature (conditional)
providerSignature     → Provider signature (always shows)
```

---

## 🎯 PDF Specific Features

### Bordered Block Structure

```tsx
// All major sections wrapped in borders
<View style={{ border: "0.5 solid #000" }}>
  <View style={{ backgroundColor: "#e5e7eb" }}>Grey Header</View>
  <View>Content...</View>
</View>
```

### Signature Protection

```tsx
// CRITICAL: Prevents signatures from splitting
<View style={styles.signatureBox} wrap={false}>
  <Image src={signature} />
</View>
```

### Tables That Never Split

- Schedule table: `wrap={false}`
- Signed/Print Name/Date: `wrap={false}`
- Plan Manager Details: `wrap={false}`
- Consent section: `wrap={false}`
- All signature boxes: `wrap={false}`

---

## 🔗 Links

- Full Documentation: `SA_SUPPORT_COORDINATION_IMPLEMENTATION_GUIDE.md`
- Model PDF: `public/Service_Agreement_Support_Coordination_prefinal.docx (1).pdf`

---

**Last Updated:** 2025-11-02  
**Version:** 4.0  
**Status:** ✅ PRODUCTION READY
