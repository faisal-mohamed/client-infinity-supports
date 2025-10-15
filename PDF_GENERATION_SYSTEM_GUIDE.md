# 📄 PDF Generation System - Complete Guide

## Table of Contents

1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Two Generation Approaches](#two-generation-approaches)
5. [Emergency Drill Example Analysis](#emergency-drill-example-analysis)
6. [Data Flow](#data-flow)
7. [Step-by-Step: How to Create a New PDF Form](#step-by-step-how-to-create-a-new-pdf-form)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## System Overview

This system provides professional PDF generation for form submissions. It supports two different rendering approaches:

1. **@react-pdf/renderer** - Direct React-to-PDF compilation (faster, lighter)
2. **Playwright + HTML/CSS** - Browser-based rendering (more flexible styling)

The Emergency Drill form uses **@react-pdf/renderer** for optimal performance.

---

## Technology Stack

### Core Libraries

```json
{
  "@react-pdf/renderer": "^3.x", // Direct PDF generation
  "playwright": "^1.x", // Browser automation for HTML→PDF
  "react": "^18.x", // Component framework
  "next.js": "^14.x", // API routes
  "prisma": "^5.x" // Database ORM
}
```

### Key Technologies Used

- **TypeScript** - Type safety
- **React Server Components** - Server-side rendering
- **Base64 Encoding** - Image embedding
- **CSS Print Media** - Print-specific styling

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     USER DOWNLOADS PDF                       │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  API Route: /api/generate-pdf/[formSubmissionId]/[formId]  │
│                                                              │
│  1. Fetch form submission from database                     │
│  2. Fetch client common fields                              │
│  3. Fetch app settings                                      │
│  4. Encode logo to Base64                                   │
│  5. Choose generation method based on form type             │
└───────────────────────────┬─────────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│  @react-pdf/renderer     │  │  Playwright + HTML       │
│  (Emergency Drill)       │  │  (Other Forms)           │
│                          │  │                          │
│  • Direct PDF creation   │  │  • Generate HTML         │
│  • React components      │  │  • Launch browser        │
│  • Inline styling        │  │  • Render & convert      │
│  • Fast & lightweight    │  │  • Full CSS support      │
└────────────┬─────────────┘  └───────────┬──────────────┘
             │                            │
             └────────────┬───────────────┘
                          │
                          ▼
                  ┌───────────────┐
                  │  PDF Buffer   │
                  └───────┬───────┘
                          │
                          ▼
              ┌────────────────────────┐
              │  Return to User        │
              │  Content-Type: pdf     │
              │  Content-Disposition   │
              └────────────────────────┘
```

---

## Two Generation Approaches

### Approach 1: @react-pdf/renderer (RECOMMENDED - Emergency Drill Uses This)

**Files Involved:**

- `src/components-server/PrintableForms/emergency-drill/EmergencyDrillPDF.tsx`
- Uses `@react-pdf/renderer` components

**Pros:**
✅ Faster generation (no browser needed)
✅ Lower resource usage
✅ Precise control over PDF structure
✅ Better for production at scale
✅ Consistent across environments

**Cons:**
❌ Limited styling options (no full CSS)
❌ Steeper learning curve
❌ Must use @react-pdf components only

**Example Structure:**

```tsx
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 20,
  },
  header: {
    fontSize: 14,
    marginBottom: 10,
  },
});

const MyPDF = ({ formData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text>Form Title</Text>
      </View>
      <View>
        <Text>{formData.fieldName}</Text>
      </View>
    </Page>
  </Document>
);
```

### Approach 2: Playwright + HTML/CSS

**Files Involved:**

- `src/components-server/PrintableForms/emergency-drill/page_strict_form.tsx`
- `src/components-server/PrintableForms/pdf/pdf-print.css`

**Pros:**
✅ Full CSS support
✅ Easier for web developers
✅ Complex layouts possible
✅ Can reuse existing HTML components

**Cons:**
❌ Slower (requires browser launch)
❌ Higher resource usage
❌ Potential inconsistencies across systems

**Example Structure:**

```tsx
const MyFormHTML = ({ formData }) => (
  <PdfPageLayout logoDataUrl={logoDataUrl} footerData={{...}}>
    <section>
      <h2>Section Title</h2>
      <div className="field-row">
        <label>Field Label:</label>
        <p>{formData.fieldName}</p>
      </div>
    </section>
  </PdfPageLayout>
);
```

---

## Emergency Drill Example Analysis

### Component Breakdown

#### 1. **EmergencyDrillPDF.tsx** (@react-pdf/renderer version)

**Location:** `src/components-server/PrintableForms/emergency-drill/EmergencyDrillPDF.tsx`

**Key Features:**

```tsx
// 1. Import @react-pdf/renderer components
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

// 2. Define styles using StyleSheet.create
const styles = StyleSheet.create({
  page: {
    /* page layout */
  },
  header: {
    /* header styling */
  },
  // ... more styles
});

// 3. Component receives props
interface EmergencyDrillPDFProps {
  formData: any; // Form submission data
  commonFieldsData: any; // Client common fields
  settings: any; // App settings
  logoDataUrl: string; // Base64 encoded logo
}

// 4. Data extraction function
const getValue = (key: string): string => {
  // Maps form field keys to data sources
  // Handles common fields vs form-specific fields
};

// 5. Render components
return (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Fixed header (appears on all pages) */}
      <View style={styles.header} fixed>
        <Image src={logoDataUrl} style={styles.headerLogo} />
      </View>

      {/* Content sections */}
      <View style={styles.content}>{/* Sections with data */}</View>

      {/* Fixed footer */}
      <View style={styles.footer} fixed>
        <Text>www.infinitysupportswa.org</Text>
      </View>
    </Page>
  </Document>
);
```

#### 2. **page_strict_form.tsx** (HTML/CSS version)

**Location:** `src/components-server/PrintableForms/emergency-drill/page_strict_form.tsx`

**Key Features:**

```tsx
// Uses regular React/HTML with print CSS
const EmergencyDrillStrictForm = ({ formData, commonFieldsData, settings, logoDataUrl }) => {

  // Data mapping for common fields
  const commonFieldMapping = {
    clientName: 'name',
    phoneNumber: 'phone',
    // ... more mappings
  };

  // Extract values
  const getValue = (key: string) => {
    let value = '';
    if (commonFieldMapping[key]) {
      value = commonFieldsData[commonFieldMapping[key]];
    } else {
      value = formData[key];
    }
    return value || '';
  };

  // Render radio group
  const renderRadioGroup = (key, options) => (
    <div className="radio-group">
      {options.map(opt => (
        <label className="radio-item">
          <input type="checkbox" checked={getValue(key) === opt} readOnly />
          {opt}
        </label>
      ))}
    </div>
  );

  return (
    <PdfPageLayout logoDataUrl={logoDataUrl} footerData={{...}}>
      <section>
        <h2>Section Title</h2>
        <div className="field-row">
          <label>Label:</label>
          <p>{getValue('fieldKey')}</p>
        </div>
      </section>
    </PdfPageLayout>
  );
};
```

#### 3. **API Route** - `/api/generate-pdf/[formSubmissionId]/[formId]/route.ts`

**Key Functions:**

```typescript
// 1. Encode images to Base64
async function encodeImageToBase64(imagePath: string): Promise<string> {
  // Reads image from /public folder
  // Converts to Base64 data URL
  // Returns: "data:image/png;base64,..."
}

// 2. Generate HTML (for Playwright approach)
async function generateHTML(formData, formKey, commonFields, settings) {
  // Gets PDF component from registry
  // Renders React component to HTML string
  // Adds CSS styling
  // Returns complete HTML document
}

// 3. Generate PDF with @react-pdf/renderer
async function generatePDFWithReactPDF(formData, commonFields, settings, logoDataUrl) {
  // Creates React element with EmergencyDrillPDF component
  // Calls renderToBuffer from @react-pdf/renderer
  // Returns PDF buffer
}

// 4. Main GET handler
export async function GET(req, { params }) {
  // Step 1: Parse parameters
  const { formSubmissionId, formId } = await params;

  // Step 2: Fetch data from database
  const formSubmission = await prisma.formSubmission.findUnique({...});
  const form = await prisma.masterForm.findUnique({...});
  const commonFields = await prisma.commonField.findUnique({...});
  const settings = await prisma.appSettings.findMany({...});

  // Step 3: Choose generation method
  if (form.formKey === 'emergency_drill') {
    // Use @react-pdf/renderer
    const logoDataUrl = await encodeImageToBase64("/infinity_logo.png");
    pdfBuffer = await generatePDFWithReactPDF(formData, commonFields, settings, logoDataUrl);
  } else {
    // Use Playwright + HTML
    const html = await generateHTML(formData, form.formKey, commonFields, settings);
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();
  }

  // Step 4: Return PDF
  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}.pdf"`
    }
  });
}
```

#### 4. **PDF Registry** - `pdfRegistry.ts`

```typescript
// Central registry for all PDF forms
const pdfFormRegistry = [
  {
    formKey: "emergency_drill",
    component: EmergencyDrill,
    name: "Emergency Drill Reporting Form",
  },
  {
    formKey: "client_intake_form",
    component: ClientIntakev2,
    name: "Client Intake Form",
  },
  // ... more forms
];

// Helper to get component by form key
export const getPDFComponent = (formKey: string) => {
  const formConfig = pdfFormRegistry.find(
    (config) => config.formKey === formKey
  );
  return formConfig?.component || ClientIntakev2; // Fallback
};
```

#### 5. **Styling Approach**

**For @react-pdf/renderer (EmergencyDrillPDF.tsx):**

```tsx
const styles = StyleSheet.create({
  // Use flexbox-like syntax
  page: {
    flexDirection: "column",
    padding: 20,
    fontSize: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  // Note: Limited CSS properties available
  // No: grid, position: absolute (limited), z-index, etc.
});
```

**For HTML/CSS (page_strict_form.tsx + pdf-print.css):**

```css
/* Full CSS support */
@page {
  size: A4;
  margin: 0;
}

.pdf-body {
  padding: 20mm;
  font-size: 11pt;
  line-height: 1.4;
}

.field-row {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 6mm;
}

/* Print-specific rules */
@media print {
  .no-print {
    display: none;
  }
}
```

---

## Data Flow

### 1. **User Triggers Download**

```
User clicks "Download PDF" button
↓
Frontend calls: GET /api/generate-pdf/123/45
```

### 2. **API Route Processing**

```typescript
// 1. Fetch Form Submission
const formSubmission = await prisma.formSubmission.findUnique({
  where: { id: submissionId },
});
// Contains: { id, clientId, data: { field1: 'value1', ... } }

// 2. Fetch Client Common Fields
const commonFields = await prisma.commonField.findUnique({
  where: { clientId: formSubmission.clientId },
});
// Contains: { name, phone, email, address, ... }

// 3. Fetch App Settings
const settings = await prisma.appSettings.findMany({
  where: { isActive: true },
});
// Contains: { emergency_drill: 'ED-001', review_date: '2025-10-15', ... }

// 4. Encode Logo
const logoDataUrl = await encodeImageToBase64("/infinity_logo.png");
// Returns: "data:image/png;base64,iVBORw0KGg..."
```

### 3. **Data Mapping**

```typescript
// Emergency Drill component maps common fields
const commonFieldMapping = {
  clientName: "name", // form field → common field
  phoneNumber: "phone",
  address: "street",
  // ...
};

const getValue = (key: string) => {
  // If it's a common field, get from commonFieldsData
  if (commonFieldMapping[key]) {
    return commonFieldsData[commonFieldMapping[key]];
  }
  // Otherwise, get from formData
  return formData[key];
};
```

### 4. **PDF Generation**

```typescript
// For emergency_drill (using @react-pdf/renderer)
const pdfDoc = React.createElement(EmergencyDrillPDF, {
  formData: formSubmission.data,
  commonFieldsData: commonFields,
  settings: settings,
  logoDataUrl: logoDataUrl,
});

const pdfBuffer = await renderToBuffer(pdfDoc);
```

### 5. **Return to User**

```typescript
return new NextResponse(pdfBuffer, {
  headers: {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="Emergency_Drill_John_Doe.pdf"`,
  },
});
```

---

## Step-by-Step: How to Create a New PDF Form

### Prerequisites

- Form already exists in database (MasterForm)
- Form has a unique `formKey` (e.g., 'medical_assessment')
- Form submissions are stored in `FormSubmission.data`

---

### **OPTION A: Using @react-pdf/renderer (RECOMMENDED)**

#### Step 1: Create PDF Component

Create: `src/components-server/PrintableForms/medical-assessment/MedicalAssessmentPDF.tsx`

```tsx
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

// Define styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 20,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottom: "1 solid #e5e7eb",
    paddingBottom: 10,
    marginBottom: 15,
  },
  headerLogo: {
    width: 80,
    height: "auto",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTop: "1 solid #e5e7eb",
    fontSize: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 8,
    borderBottom: "1 solid #d1d5db",
    paddingBottom: 3,
  },
  fieldRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  label: {
    width: 150,
    fontWeight: "bold",
    fontSize: 9,
  },
  value: {
    flex: 1,
    fontSize: 9,
    marginLeft: 10,
  },
});

interface MedicalAssessmentPDFProps {
  formData: any;
  commonFieldsData: any;
  settings: any;
  logoDataUrl: string;
}

const MedicalAssessmentPDF: React.FC<MedicalAssessmentPDFProps> = ({
  formData,
  commonFieldsData,
  settings,
  logoDataUrl,
}) => {
  // Map common fields
  const commonFieldMapping: Record<string, string> = {
    clientName: "name",
    dob: "dob",
    phone: "phone",
    // Add your mappings
  };

  // Get value helper
  const getValue = (key: string): string => {
    try {
      if (commonFieldMapping[key]) {
        return commonFieldsData?.[commonFieldMapping[key]] || "";
      }
      return formData?.[key] || "";
    } catch {
      return "";
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header - Fixed on all pages */}
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>

        {/* Title */}
        <View>
          <Text style={styles.title}>Medical Assessment Form</Text>
        </View>

        {/* Section 1 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Patient Information</Text>

          <View style={styles.fieldRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{getValue("clientName")}</Text>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.label}>Date of Birth:</Text>
            <Text style={styles.value}>{getValue("dob")}</Text>
          </View>

          {/* Add more fields */}
        </View>

        {/* Add more sections */}

        {/* Footer - Fixed on all pages */}
        <View style={styles.footer} fixed>
          <Text>www.infinitysupportswa.org</Text>
          <Text>{settings?.medical_assessment || "MA-001"}</Text>
          <Text>Date: {new Date().toLocaleDateString()}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default MedicalAssessmentPDF;
```

#### Step 2: Register in API Route

Edit: `src/app/api/generate-pdf/[formSubmissionId]/[formId]/route.ts`

```typescript
// Import your component
import MedicalAssessmentPDF from "@/components-server/PrintableForms/medical-assessment/MedicalAssessmentPDF";

// Add to switch statement (around line 128)
case "medical_assessment":
  const logoDataUrl = await encodeImageToBase64("/infinity_logo.png");
  images = {
    infinityLogo: logoDataUrl,
    infinityLogoDataUrl: logoDataUrl
  }

  componentProps = {
    formData,
    images,
    commonFieldsData: commonFields || {},
    settings: settings || {},
    logoDataUrl: logoDataUrl
  }
  break;

// Add to generation logic (around line 388)
if (form.formKey === 'emergency_drill' || form.formKey === 'medical_assessment') {
  // Use @react-pdf/renderer
  const logoDataUrl = await encodeImageToBase64("/infinity_logo.png");

  // Choose component
  const PDFComponent = form.formKey === 'emergency_drill'
    ? EmergencyDrillPDF
    : MedicalAssessmentPDF;

  pdfBuffer = await generatePDFWithReactPDF(
    formData,
    commonFields,
    settings,
    logoDataUrl,
    PDFComponent  // Pass component
  );
} else {
  // Use Playwright
  // ...existing code
}
```

Update the `generatePDFWithReactPDF` function:

```typescript
async function generatePDFWithReactPDF(
  formData: any,
  commonFields: any,
  settings: any,
  logoDataUrl: string,
  PDFComponent: any = EmergencyDrillPDF // Add parameter with default
): Promise<Buffer> {
  const pdfDoc = React.createElement(PDFComponent, {
    formData,
    commonFieldsData: commonFields,
    settings,
    logoDataUrl,
  }) as any;

  const pdfBuffer = await renderToBuffer(pdfDoc);
  return pdfBuffer;
}
```

#### Step 3: Register in PDF Registry

Edit: `src/components-server/PrintableForms/pdfRegistry.ts`

```typescript
// Import component
import MedicalAssessmentPDF from "./medical-assessment/MedicalAssessmentPDF";

// Add to registry
const pdfFormRegistry: PDFFormComponent[] = [
  // ... existing entries
  {
    formKey: "medical_assessment",
    component: MedicalAssessmentPDF,
    name: "Medical Assessment Form",
  },
];
```

#### Step 4: Test

Create test route: `src/app/api/test-medical-assessment/route.ts`

```typescript
import { NextResponse } from "next/server";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import MedicalAssessmentPDF from "@/components-server/PrintableForms/medical-assessment/MedicalAssessmentPDF";

export async function GET() {
  const sampleData = {
    clientName: "Test Patient",
    dob: "1990-01-01",
    // ... add sample data
  };

  const pdfDoc = React.createElement(MedicalAssessmentPDF, {
    formData: sampleData,
    commonFieldsData: {},
    settings: {},
    logoDataUrl: "data:image/svg+xml;base64,...", // Placeholder
  });

  const pdfBuffer = await renderToBuffer(pdfDoc);
  const base64PDF = pdfBuffer.toString("base64");

  return new NextResponse(
    `
    <html>
      <body>
        <h1>Medical Assessment Test</h1>
        <iframe 
          src="data:application/pdf;base64,${base64PDF}" 
          width="100%" 
          height="800px"
        ></iframe>
      </body>
    </html>
  `,
    {
      headers: { "Content-Type": "text/html" },
    }
  );
}
```

Visit: `http://localhost:3000/api/test-medical-assessment`

---

### **OPTION B: Using HTML/CSS + Playwright**

#### Step 1: Create Component

Create: `src/components-server/PrintableForms/medical-assessment/page_FIXED.tsx`

```tsx
import React from "react";
import PdfPageLayout from "../pdf/PdfPageLayout";

const MedicalAssessmentView: React.FC<any> = ({
  formData,
  commonFieldsData,
  settings,
  logoDataUrl,
}) => {
  // Common field mapping
  const commonFieldMapping: Record<string, string> = {
    clientName: "name",
    dob: "dob",
    phone: "phone",
  };

  // Get value helper
  const getValue = (key: string) => {
    if (commonFieldMapping[key]) {
      return commonFieldsData?.[commonFieldMapping[key]] ?? "";
    }
    return formData?.[key] ?? "";
  };

  return (
    <PdfPageLayout
      logoDataUrl={logoDataUrl || "/infinity_logo.png"}
      footerData={{
        documentRef: settings?.medical_assessment || "MA-001",
        date: settings?.review_date,
      }}
    >
      {/* Section 1 */}
      <section>
        <h2>1. Patient Information</h2>

        <div className="field-row">
          <label>Full Name:</label>
          <p>{getValue("clientName")}</p>
        </div>

        <div className="field-row">
          <label>Date of Birth:</label>
          <p>{getValue("dob")}</p>
        </div>

        {/* Add more fields */}
      </section>

      {/* Section 2 */}
      <section>
        <h2>2. Medical History</h2>

        <div className="long-answer">
          <label>Current Medications:</label>
          <p>{getValue("medications")}</p>
        </div>

        <div className="long-answer">
          <label>Allergies:</label>
          <p>{getValue("allergies")}</p>
        </div>
      </section>

      {/* Add more sections */}
    </PdfPageLayout>
  );
};

export default MedicalAssessmentView;
```

#### Step 2: Register in PDF Registry

```typescript
// Import
import MedicalAssessmentView from './medical-assessment/page_FIXED';

// Add to registry
{
  formKey: 'medical_assessment',
  component: MedicalAssessmentView,
  name: 'Medical Assessment Form'
}
```

#### Step 3: Add to API Route

```typescript
case "medical_assessment":
  images = {
    infinityLogo: await encodeImageToBase64("/infinity_logo.png"),
  };

  componentProps = {
    formData,
    images,
    commonFieldsData: commonFields || {},
    settings: settings || {}
  };
  break;
```

The Playwright generation will automatically pick it up!

---

## Best Practices

### 1. **Data Extraction**

```typescript
// ✅ GOOD: Safe data extraction with fallbacks
const getValue = (key: string): string => {
  try {
    let value = "";
    if (commonFieldMapping?.[key]) {
      value = commonFieldsData?.[commonFieldMapping[key]];
    } else {
      value = formData?.[key];
    }
    return value ? String(value) : "";
  } catch (error) {
    console.warn(`Error getting value for ${key}:`, error);
    return "";
  }
};

// ❌ BAD: Direct access without safety
const value = formData[key]; // Can throw errors
```

### 2. **Date Formatting**

```typescript
// ✅ GOOD: Safe date formatting
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return new Date().toLocaleDateString();
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return String(dateString);
  }
};

// ❌ BAD: Unsafe
const date = new Date(dateString).toLocaleDateString(); // Can throw
```

### 3. **Image Handling**

```typescript
// ✅ GOOD: Always encode images to Base64
const logoDataUrl = await encodeImageToBase64("/infinity_logo.png");
// Pass: "data:image/png;base64,iVBORw0K..."

// ❌ BAD: Direct paths don't work in PDFs
<Image src="/infinity_logo.png" />; // Won't work
```

### 4. **Page Breaks**

```tsx
// @react-pdf/renderer
<View style={styles.pageBreak} />
// Where: pageBreak: { breakBefore: 'page' }

// HTML/CSS
<div className="page-break-before"></div>
// Where: .page-break-before { page-break-before: always; }
```

### 5. **Fixed Headers/Footers**

```tsx
// @react-pdf/renderer
<View style={styles.header} fixed>
  <Image src={logoDataUrl} />
</View>

// HTML/CSS
.page-header-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}
```

### 6. **Conditional Rendering**

```tsx
// ✅ GOOD: Check before rendering
{
  getValue("selectedType") === "Other" && (
    <View style={styles.fieldRow}>
      <Text>Details: {getValue("otherDetails")}</Text>
    </View>
  );
}

// ❌ BAD: Always render
<View>
  <Text>{getValue("otherDetails")}</Text>
</View>;
```

### 7. **Typography Best Practices**

```typescript
// Font sizes (points)
const styles = StyleSheet.create({
  title: { fontSize: 14 }, // Main title
  sectionTitle: { fontSize: 11 }, // Section headers
  body: { fontSize: 9 }, // Body text
  footer: { fontSize: 8 }, // Footer text
});
```

### 8. **Prevent Content Overflow**

```tsx
// @react-pdf/renderer: Use flex
value: {
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis'
}

// HTML/CSS: Use word-break
.value {
  word-break: break-word;
  overflow-wrap: anywhere;
}
```

---

## Troubleshooting

### Problem 1: "Image not displaying"

**Cause:** Image path is relative or not Base64 encoded

**Solution:**

```typescript
// Always encode images
const logoDataUrl = await encodeImageToBase64("/infinity_logo.png");
<Image src={logoDataUrl} />; // Use encoded version
```

### Problem 2: "Content overlapping footer"

**Cause:** Not enough padding/margin in content area

**Solution (@react-pdf/renderer):**

```tsx
const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingBottom: 20, // Add space before footer
  },
});
```

**Solution (HTML/CSS):**

```css
.pdf-body {
  padding-bottom: calc(var(--footer-h) + 12mm);
}
```

### Problem 3: "PDF generation timeout"

**Cause:** Playwright browser launch taking too long

**Solution:**

```typescript
// Increase timeout
await page.setContent(html, {
  waitUntil: "networkidle",
  timeout: 30000, // Increase from 15000
});
```

### Problem 4: "Styles not applying"

**Cause (@react-pdf/renderer):** Using unsupported CSS properties

**Solution:**

```tsx
// ❌ BAD: grid not supported
display: 'grid'

// ✅ GOOD: use flexbox
flexDirection: 'row',
justifyContent: 'space-between'
```

**Cause (HTML/CSS):** CSS not loaded

**Solution:**

```typescript
// Make sure CSS is included in generateHTML function
const css = fs.readFileSync(cssPath, "utf8");
// Include in <style> tag
```

### Problem 5: "Common fields not showing"

**Cause:** Common field mapping incorrect

**Solution:**

```typescript
// Check your mapping
const commonFieldMapping = {
  clientName: "name", // Must match CommonField schema
  phoneNumber: "phone", // Not 'phoneNumber'
  // Check prisma schema for correct field names
};

// Debug
console.log("Common fields:", commonFieldsData);
console.log(
  "Mapped value:",
  commonFieldsData?.[commonFieldMapping["clientName"]]
);
```

### Problem 6: "Page breaks in wrong places"

**Solution (@react-pdf/renderer):**

```tsx
// Force page break before section
<View style={{ breakBefore: 'page' }}>
  <Text>New Page Content</Text>
</View>

// Prevent section from breaking
<View style={{ breakInside: 'avoid' }}>
  <Text>Keep together</Text>
</View>
```

**Solution (HTML/CSS):**

```css
.section {
  page-break-inside: avoid; /* Keep section together */
}

.page-break-before {
  page-break-before: always; /* Force new page */
}
```

### Problem 7: "Signature images not displaying"

**Cause:** Signature data not in Base64 format

**Solution:**

```tsx
// Check if signature exists and is valid Base64
{
  getValue("supportWorkerSignature") &&
  getValue("supportWorkerSignature").startsWith("data:image") ? (
    <Image
      src={getValue("supportWorkerSignature")}
      style={styles.signatureImage}
    />
  ) : (
    <View style={styles.signatureImage} /> // Empty placeholder
  );
}
```

---

## Common CSS Classes (HTML/CSS Approach)

When using the HTML/CSS approach, these classes are available from `pdf-print.css`:

```css
/* Layout */
.pdf-body              /* Main content wrapper */
/* Main content wrapper */
/* Main content wrapper */
/* Main content wrapper */
.pdf-header-fixed      /* Fixed header on all pages */
.pdf-footer-fixed      /* Fixed footer on all pages */

/* Sections */
section                /* Form section */
h2                     /* Section title */

/* Fields */
.field-row             /* Label + value row */
.field-row label       /* Field label */
.field-row p           /* Field value */

/* Long answer fields */
.long-answer           /* Long answer wrapper */
.long-answer label     /* Long answer label */
.long-answer p         /* Long answer content */

/* Radio/Checkbox groups */
.radio-group           /* Radio group container */
.radio-item            /* Individual radio/checkbox */

/* Signatures */
.signature-block       /* Signature container */
.signature-section     /* Individual signature */
.signature-img         /* Signature image */
.signature-date        /* Signature date */

/* Page breaks */
.page-break-before     /* Force page break before */
.page-break-after; /* Force page break after */
```

---

## Performance Tips

### 1. **@react-pdf/renderer vs Playwright**

```
Emergency Drill Form Generation Times:

@react-pdf/renderer:    ~500-800ms   ⚡ Fast
Playwright + HTML:      ~2-4 seconds 🐌 Slower

For production: Use @react-pdf/renderer when possible
```

### 2. **Image Optimization**

```typescript
// ✅ GOOD: Cache encoded images
let logoCache: string | null = null;

async function getCachedLogo() {
  if (!logoCache) {
    logoCache = await encodeImageToBase64("/infinity_logo.png");
  }
  return logoCache;
}

// ❌ BAD: Re-encode every time
const logo = await encodeImageToBase64("/infinity_logo.png"); // Slow
```

### 3. **Parallel Data Fetching**

```typescript
// ✅ GOOD: Parallel queries
const [formSubmission, form, settings] = await Promise.all([
  prisma.formSubmission.findUnique({...}),
  prisma.masterForm.findUnique({...}),
  prisma.appSettings.findMany({...})
]);

// ❌ BAD: Sequential queries
const formSubmission = await prisma.formSubmission.findUnique({...});
const form = await prisma.masterForm.findUnique({...});
const settings = await prisma.appSettings.findMany({...});
```

---

## Summary

### When to Use Each Approach

**Use @react-pdf/renderer when:**

- ✅ You need fast generation
- ✅ Form has simple layout
- ✅ You want lower server resource usage
- ✅ You need consistent output
- ✅ Production environment

**Use HTML/CSS + Playwright when:**

- ✅ You need complex layouts
- ✅ You want full CSS flexibility
- ✅ You're prototyping quickly
- ✅ You have existing HTML components
- ✅ Development environment

### Quick Reference

| Feature          | @react-pdf/renderer | HTML/CSS + Playwright |
| ---------------- | ------------------- | --------------------- |
| Speed            | ⚡ Fast (500ms)     | 🐌 Slow (2-4s)        |
| Resources        | Low                 | High                  |
| Styling          | Limited             | Full CSS              |
| Learning Curve   | Steep               | Easy                  |
| Production Ready | ✅ Yes              | ⚠️ OK                 |
| Complex Layouts  | ❌ Difficult        | ✅ Easy               |

---

## Next Steps

1. **Study Emergency Drill implementation** ✅
2. **Choose your approach** (@react-pdf/renderer recommended)
3. **Create your PDF component**
4. **Register in pdfRegistry.ts**
5. **Update API route**
6. **Test with sample data**
7. **Test with real submission**
8. **Deploy**

---

## Additional Resources

### Official Documentation

- [@react-pdf/renderer docs](https://react-pdf.org/)
- [Playwright PDF API](https://playwright.dev/docs/api/class-page#page-pdf)
- [CSS Print Media](https://developer.mozilla.org/en-US/docs/Web/CSS/Paged_Media)

### Key Files to Reference

- `src/components-server/PrintableForms/emergency-drill/EmergencyDrillPDF.tsx` - @react-pdf example
- `src/components-server/PrintableForms/emergency-drill/page_strict_form.tsx` - HTML/CSS example
- `src/app/api/generate-pdf/[formSubmissionId]/[formId]/route.ts` - Main API logic
- `src/components-server/PrintableForms/pdf/pdf-print.css` - Print CSS styles

---

**Last Updated:** October 15, 2025
**Author:** Client Infinity Development Team
**Version:** 1.0
