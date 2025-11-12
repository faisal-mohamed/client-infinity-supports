# Dynamic Form PDF Architecture - Complete Technical Guide

## Table of Contents
1. [Overview](#overview)
2. [Architecture Components](#architecture-components)
3. [Schema-Driven Dynamic Forms](#schema-driven-dynamic-forms)
4. [React-PDF Implementation](#react-pdf-implementation)
5. [Dynamic Page Management](#dynamic-page-management)
6. [Overflow & Page Break Handling](#overflow--page-break-handling)
7. [Content-Aware Pagination Algorithm](#content-aware-pagination-algorithm)
8. [Empty Pages & Spaces Prevention](#empty-pages--spaces-prevention)
9. [Signature Management](#signature-management)
10. [Best Practices & Patterns](#best-practices--patterns)

---

## Overview

This system generates **PDF documents dynamically** from form submissions using a **schema-driven architecture**. The key challenges solved:

- **Dynamic content length**: Forms with variable text fields that can span multiple pages
- **Page breaks without cutoff**: Content flows naturally across pages without being cut mid-sentence
- **Overflow management**: Long text, tables, and images handled gracefully
- **Empty page prevention**: Intelligent pagination avoids blank pages and large gaps
- **Multi-signature flows**: Support for conditional signatures (participant OR nominee)
- **Exact web-to-PDF matching**: PDF output matches the web view design

### Technology Stack

- **@react-pdf/renderer** - Core PDF generation library
- **Playwright** (Chromium) - HTML-to-PDF conversion for complex layouts
- **Schema-based forms** - JSON schemas define form structure
- **Registry pattern** - Centralized form component management

---

## Architecture Components

### 1. Form Registry System (`src/app/forms/registry.ts`)

The registry is the **single source of truth** for all forms. Each form has:

```typescript
interface FormRegistryItem {
  key: string;                           // Unique identifier (e.g., "client_intake_form")
  name: string;                          // Display name
  editComponent: React.ComponentType;    // Edit mode component
  viewComponent: React.ComponentType;    // View/read-only component
  pdfComponent?: React.ComponentType;    // PDF generation component
  signatures?: SignatureRequirement[];   // Signature configuration
}
```

**Example:**
```typescript
const formRegistry: Record<string, FormRegistryItem> = {
  schedule_of_supports: {
    key: "schedule_of_supports",
    name: "Schedule of Supports",
    viewComponent: ScheduleForSupportView1,
    editComponent: ScheduleForSupportEdit1,
    signatures: [
      {
        id: "participant_signature",
        label: "Participant Signature",
        dataKey: "participantSignature",
        groupId: "participant_or_nominee",
        groupRequirementType: "any", // Either participant OR nominee
      },
      {
        id: "nominee_signature",
        label: "Nominee Signature",
        dataKey: "nomineeSignature",
        groupId: "participant_or_nominee",
        groupRequirementType: "any",
      },
      {
        id: "representative_signature",
        label: "Representative Signature",
        required: true, // Always required
        dataKey: "representativeSignature",
      }
    ]
  }
};
```

### 2. PDF Registry (`src/components-server/PrintableForms/pdfRegistry.ts`)

Maps form keys to their PDF rendering components:

```typescript
const pdfFormRegistry: PDFFormComponent[] = [
  {
    formKey: 'schedule_of_supports',
    component: ScheduleOfSupports,
    name: "Schedule of Supports"
  },
  // ... other forms
];

export const getPDFComponent = (formKey: string) => {
  const formConfig = pdfFormRegistry.find(c => c.formKey === formKey);
  return formConfig?.component || DefaultComponent;
};
```

---

## Schema-Driven Dynamic Forms

Forms are defined using **JSON schemas** that describe:
- Field types (text, textarea, checkbox, radio, date, signature)
- Sections and grouping
- Validation rules
- Layout hints

### Schema Structure Example

```typescript
// src/app/components/forms/individual-risk-assessment/schema.ts
export type IRABlockType =
  | 'title'
  | 'header_grid'
  | 'risk_matrix'
  | 'risk_table'
  | 'additional_info'
  | 'review_and_signature';

export interface IRABlock {
  type: IRABlockType;
  label?: string;
}

export const iraSchema: IRABlock[] = [
  { type: 'title', label: 'Individual Activity Risk Assessment' },
  { type: 'header_grid' },
  { type: 'risk_matrix' },
  { type: 'risk_table', label: 'POTENTIAL RISK & CONTROL MEASURES' },
  { type: 'additional_info', label: 'Additional Support Requirements' },
  { type: 'review_and_signature' },
];
```

### More Complex Schema: Home Visit Risk Assessment

```typescript
const homeVisitSchema = {
  metadataFields: [
    { label: "Name", key: "name" },
    { label: "NDIS Number", key: "ndisNumber" },
    { label: "DOB", key: "dob" },
    { label: "Address", key: "address" },
  ],
  pages: [
    {
      sections: [
        {
          title: "CLIENT AND FAMILY",
          fields: [
            { 
              label: "Will anyone else be present during the visit?", 
              key: "visitCompany" 
            },
            { 
              label: "Any history of verbal or physical aggression?", 
              key: "aggressionHistory" 
            },
          ]
        },
        {
          title: "ENVIRONMENT",
          fields: [
            { 
              label: "Are there any pets?", 
              key: "petsRestrained" 
            },
          ]
        }
      ]
    }
  ]
};
```

**Benefits:**
- ✅ **Single definition** for edit, view, and PDF modes
- ✅ **Type safety** with TypeScript
- ✅ **Easy modifications** - change schema, all modes update
- ✅ **Validation logic** embedded in schema

---

## React-PDF Implementation

### Why React-PDF?

**@react-pdf/renderer** provides:
- React-like component structure
- Automatic pagination
- Flexbox layout (similar to CSS Flexbox)
- Built-in PDF primitives (Document, Page, View, Text, Image)
- Cross-platform consistency

### Basic Structure

```typescript
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
  },
  section: {
    marginBottom: 10,
    padding: 10,
  },
});

function MyPDFDocument({ data }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Hello PDF World!</Text>
        </View>
      </Page>
    </Document>
  );
}
```

### Real Example: Schedule of Supports (React-PDF)

```typescript
// src/components-server/PrintableForms/schedule-of-supports/ScheduleOfSupports_REACT_PDF.tsx

export default function ScheduleOfSupports({ formData, commonFieldsData, settings, logoDataUrl }) {
  
  const formatDate = (value: string) => {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const date = new Date(value);
      return date.toLocaleDateString('en-GB');
    }
    return value || '';
  };

  const tableRows = [
    { key: "row0", description: 'Establishment Fee', cost: '$702.30' },
    { key: "row1", description: 'Assistance with Self-care weekday', cost: '$70.23' },
    // ... more rows
  ];

  return (
    <Document>
      {/* Page 1 - Support Schedule Table */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {logoDataUrl && <Image src={logoDataUrl} style={styles.logo} />}
          <Text style={styles.title}>
            Schedule of Support for: {commonFieldsData?.name || "________________"}
          </Text>
        </View>

        {/* Dynamic table rows */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.col1]}>Support Item</Text>
            <Text style={[styles.tableCell, styles.col2]}>Weeks</Text>
            <Text style={[styles.tableCell, styles.col3]}>Total Hours</Text>
            <Text style={[styles.tableCell, styles.col4]}>Cost per hr</Text>
            <Text style={[styles.tableCell, styles.col5]}>Total Cost</Text>
          </View>
          
          {tableRows.map((item) => {
            const weeks = formData?.[`${item.key}_weeks`] || "";
            const totalHours = formData?.[`${item.key}_totalHours`] || "";
            
            return (
              <View key={item.key} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.col1]}>{item.description}</Text>
                <Text style={[styles.tableCell, styles.col2]}>{weeks}</Text>
                <Text style={[styles.tableCell, styles.col3]}>{totalHours}</Text>
                <Text style={[styles.tableCell, styles.col4]}>{item.cost}</Text>
                <Text style={[styles.tableCell, styles.col5]}>{totalCost}</Text>
              </View>
            );
          })}
        </View>

        {/* Footer at bottom of page */}
        <View style={styles.footer}>
          <Text>Website: {settings?.company_website || ''}</Text>
          <Text>Review Date: {formatDate(settings?.review_date)}</Text>
        </View>
      </Page>

      {/* Page 2 - Transport & Fees */}
      <Page size="A4" style={styles.page}>
        {/* ... more content */}
      </Page>

      {/* Page 3 - Signatures */}
      <Page size="A4" style={styles.page}>
        {/* Conditional signature rendering */}
        {formData?.signatureRole === "Participant" && (
          <View style={styles.signatureSection}>
            <Text>Participant Signature</Text>
            {formData?.participantSignature && (
              <Image src={formData.participantSignature} style={styles.signatureImage} />
            )}
          </View>
        )}

        {formData?.signatureRole === "Nominee" && (
          <View style={styles.signatureSection}>
            <Text>Nominee Signature</Text>
            {formData?.nomineeSignature && (
              <Image src={formData.nomineeSignature} style={styles.signatureImage} />
            )}
          </View>
        )}
      </Page>
    </Document>
  );
}
```

### Key React-PDF Patterns

**1. Fixed Headers and Footers**
```typescript
const styles = StyleSheet.create({
  page: {
    paddingTop: 85,      // Reserve space for header
    paddingBottom: 60,   // Reserve space for footer
  },
  header: {
    position: 'absolute',
    top: 15,
    left: 0,
    right: 0,
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
  }
});
```

**2. Dynamic Content Rendering**
```typescript
// Only render if data exists
{formData?.participantSignature && (
  <Image src={formData.participantSignature} />
)}

// Map over dynamic data
{tableRows.map((row) => (
  <View key={row.key}>
    <Text>{row.description}</Text>
  </View>
))}

// Conditional sections
{formData?.signatureRole === "Participant" ? (
  <ParticipantSection />
) : (
  <NomineeSection />
)}
```

---

## Dynamic Page Management

### Problem: Unknown Content Length

Forms have variable content:
- User-entered text fields (can be 10 words or 1000 words)
- Dynamic tables (2 rows or 50 rows)
- Conditional sections (show/hide based on answers)

**Challenge:** How do we know when to start a new page?

### Solution 1: Content-Aware Pagination (Estimation-Based)

**Algorithm:**
1. **Estimate the height** of each content block
2. **Track cumulative height** as we add blocks
3. **When estimated height exceeds page limit**, start a new page
4. **Account for headers, footers, and margins**

#### Implementation Example

```typescript
// src/app/form-components/emergency-drill/components/ContentAwarePagination.tsx

const ContentAwarePagination = ({ schema, data, commonFieldsData, settings }) => {
  
  // Page dimensions
  const A4_HEIGHT = 1123; // pixels at 96 DPI (297mm)
  const HEADER_HEIGHT = 140;
  const FOOTER_HEIGHT = 80;
  const MARGIN_TOP = 76;
  const MARGIN_BOTTOM = 76;
  const FOOTER_BUFFER = 150; // Extra space to prevent footer overlap
  
  // Available content height per page
  const maxPageHeight = A4_HEIGHT 
                      - MARGIN_TOP 
                      - MARGIN_BOTTOM 
                      - HEADER_HEIGHT 
                      - FOOTER_HEIGHT 
                      - FOOTER_BUFFER;
  
  console.log(`📏 Available content height: ${maxPageHeight}px`);

  const estimateFieldHeight = (field, content) => {
    let estimatedHeight = 60; // Base height (label + padding)
    
    if (field.type === 'checkbox' || field.type === 'radio') {
      estimatedHeight = 80;
    } 
    else if (field.type === 'select') {
      estimatedHeight = 100;
    }
    else if (field.type === 'textarea' || field.type === 'text') {
      if (content && content.length > 0) {
        // Count actual line breaks
        const lines = Math.max(1, content.split('\n').length);
        
        // Estimate lines based on word count
        const wordsPerLine = 12;
        const words = content.trim().split(/\s+/).length;
        const wordBasedLines = Math.ceil(words / wordsPerLine);
        
        // Use the maximum (accounts for both line breaks and wrapping)
        const estimatedLines = Math.max(lines, wordBasedLines);
        
        // Calculate height
        const lineHeight = 22;
        const padding = 60;
        const labelHeight = 30;
        const borderHeight = 15;
        
        estimatedHeight = (estimatedLines * lineHeight) 
                        + padding 
                        + labelHeight 
                        + borderHeight;
        
        // Safety buffer to prevent cutoff
        estimatedHeight += 25;
        
        // Minimum heights
        const minHeight = field.type === 'textarea' ? 100 : 80;
        estimatedHeight = Math.max(minHeight, estimatedHeight);
      }
    }
    
    return estimatedHeight;
  };

  const createDynamicPages = () => {
    const pages = [];
    let currentPage = [];
    let currentPageHeight = 0;
    
    schema.forEach((section) => {
      section.fields.forEach((field) => {
        const content = data[field.key];
        const estimatedHeight = estimateFieldHeight(field, content);
        
        console.log(`📐 Field "${field.label}": ${estimatedHeight}px`);
        
        // Will this field fit on current page?
        if (currentPageHeight + estimatedHeight > maxPageHeight && currentPage.length > 0) {
          console.log(`📄 PAGE BREAK! Current: ${currentPageHeight}px, Max: ${maxPageHeight}px`);
          
          // Start new page
          pages.push([...currentPage]);
          currentPage = [{ field, estimatedHeight, content }];
          currentPageHeight = estimatedHeight;
        } else {
          // Add to current page
          currentPage.push({ field, estimatedHeight, content });
          currentPageHeight += estimatedHeight;
        }
      });
    });
    
    // Add remaining fields to last page
    if (currentPage.length > 0) {
      pages.push(currentPage);
    }
    
    console.log(`📊 Total pages: ${pages.length}`);
    return pages;
  };

  const pages = createDynamicPages();

  return (
    <>
      {pages.map((pageFields, pageIndex) => (
        <div key={pageIndex} className="pdf-page">
          {pageFields.map((item, idx) => (
            <div key={idx} className="field">
              <label>{item.field.label}</label>
              <div className="content">{item.content}</div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
};
```

**Key Points:**
- **Estimation is not perfect** - we add safety buffers (25px extra)
- **Line height calculation** accounts for both `\n` breaks and word wrapping
- **Minimum heights** ensure small content doesn't look cramped
- **Footer buffer** prevents content from overlapping with footer

### Solution 2: Measured Rendering (HTML-to-PDF)

For **ultra-accurate** pagination, use Playwright to:
1. Render HTML in a real browser
2. Measure actual element heights with `getBoundingClientRect()`
3. Calculate exact page breaks
4. Convert to PDF

**Implementation:**
```typescript
// src/app/api/generate-pdf/[formSubmissionId]/[formId]/route.ts

export async function GET(request, { params }) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Render HTML with form data
  const htmlContent = await generateHTML(formData, formKey, commonFields, settings);
  await page.setContent(htmlContent);
  
  // Wait for all content to load
  await page.waitForLoadState('networkidle');
  
  // Generate PDF with exact dimensions
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20mm',
      bottom: '20mm',
      left: '20mm',
      right: '20mm'
    }
  });
  
  await browser.close();
  
  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${formTitle}.pdf"`
    }
  });
}
```

---

## Overflow & Page Break Handling

### CSS Techniques for Clean Page Breaks

```css
/* src/components-server/PrintableForms/pdf/pdf-print.css */

/* =====================
   PAGE STRUCTURE
   ===================== */

@page {
  size: A4;
  margin-top: 120px;    /* Reserve for header */
  margin-bottom: 80px;  /* Reserve for footer */
  margin-left: 20px;
  margin-right: 20px;
}

/* Fixed header (appears on every page) */
.page-header-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: #fff;
  z-index: 999;
  text-align: center;
}

/* Fixed footer (appears on every page) */
.pdf-footer-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: #fff;
  z-index: 999;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  border-top: 1px solid #d1d5db;
}

/* Content area (flows between header and footer) */
.pdf-body {
  padding-top: 120px;    /* Match header height */
  padding-bottom: 80px;  /* Match footer height */
  min-height: 100vh;
}

/* =====================
   OVERFLOW HANDLING
   ===================== */

/* CRITICAL: Never hide overflow */
* {
  overflow: visible !important;
}

/* Allow content to break naturally across pages */
.field-row {
  page-break-inside: auto;   /* Allow breaking */
  break-inside: auto;
  overflow: visible;
}

/* But keep certain elements together */
.signature-block {
  page-break-inside: avoid;  /* Don't break signatures */
  break-inside: avoid;
}

/* Keep labels with their content */
.field-row label {
  page-break-after: avoid;
  break-after: avoid;
}

/* =====================
   LONG CONTENT
   ===================== */

/* Allow long text to flow naturally */
.long-answer {
  page-break-inside: auto;
  break-inside: auto;
  white-space: pre-wrap;      /* Preserve line breaks */
  word-wrap: break-word;      /* Break long words */
  overflow-wrap: anywhere;    /* Break anywhere if needed */
}

/* Prevent widows and orphans (single lines stranded on a page) */
.long-answer p {
  orphans: 2;  /* Minimum 2 lines at bottom of page */
  widows: 2;   /* Minimum 2 lines at top of page */
}

/* =====================
   TABLES
   ===================== */

table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  page-break-inside: auto;  /* Allow table to break across pages */
}

/* But keep table headers with first row */
thead {
  display: table-header-group;  /* Repeat on each page */
}

/* Keep individual rows together when possible */
tr {
  page-break-inside: avoid;
  break-inside: avoid;
}

th, td {
  overflow-wrap: anywhere;
  word-break: break-word;
  overflow: visible;
}

/* =====================
   SECTION TITLES
   ===================== */

/* Section titles should stay with content */
h2, h3, .section-title {
  page-break-after: avoid;
  break-after: avoid;
  page-break-inside: avoid;
  break-inside: avoid;
}

/* =====================
   FORCE PAGE BREAKS
   ===================== */

.page-break-before {
  page-break-before: always;
  break-before: page;
}

.page-break-after {
  page-break-after: always;
  break-after: page;
}

/* =====================
   PRINT-SPECIFIC
   ===================== */

@media print {
  body {
    -webkit-print-color-adjust: exact;  /* Preserve colors */
    print-color-adjust: exact;
  }
  
  /* Ensure fixed elements stay fixed */
  .page-header-fixed,
  .pdf-footer-fixed {
    position: fixed !important;
  }
  
  /* Hide elements that shouldn't print */
  .no-print {
    display: none !important;
  }
}
```

### React-PDF Overflow Handling

React-PDF doesn't support CSS `overflow: hidden` the same way browsers do. Instead:

**1. Use `wrap` property:**
```typescript
<Text style={{ 
  width: 200,
  // Text will automatically wrap to next line
}}>
  Long text that needs to wrap...
</Text>
```

**2. Manual truncation:**
```typescript
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

<Text>{truncateText(longText, 100)}</Text>
```

**3. Dynamic sizing:**
```typescript
// Adjust font size based on content length
const fontSize = content.length > 500 ? 9 : 10;

<Text style={{ fontSize }}>{content}</Text>
```

---

## Content-Aware Pagination Algorithm

### Complete Algorithm Breakdown

```typescript
/**
 * CONTENT-AWARE PAGINATION ALGORITHM
 * 
 * Goal: Distribute form fields across PDF pages without cutting content
 * 
 * Steps:
 * 1. Define page constraints (A4 dimensions, margins, header/footer)
 * 2. Estimate height of each field based on content
 * 3. Accumulate fields on current page until limit reached
 * 4. When limit exceeded, start new page
 * 5. Handle special cases (tables, signatures, images)
 */

interface PageConfig {
  width: number;
  height: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  headerHeight: number;
  footerHeight: number;
  footerBuffer: number; // Extra space to prevent footer overlap
}

const A4_CONFIG: PageConfig = {
  width: 794,          // 210mm at 96 DPI
  height: 1123,        // 297mm at 96 DPI
  marginTop: 76,       // 20mm
  marginBottom: 76,
  marginLeft: 76,
  marginRight: 76,
  headerHeight: 140,
  footerHeight: 80,
  footerBuffer: 150,   // Critical: prevents content-footer collision
};

function calculateAvailableHeight(config: PageConfig): number {
  return config.height
    - config.marginTop
    - config.marginBottom
    - config.headerHeight
    - config.footerHeight
    - config.footerBuffer;
}

function estimateContentHeight(
  field: FormField, 
  content: string
): number {
  // Base height: label + borders + padding
  let height = 60;
  
  switch (field.type) {
    case 'checkbox':
    case 'radio':
      height = 80;
      break;
      
    case 'select':
      height = 100;
      break;
      
    case 'textarea':
    case 'text':
      if (content && content.length > 0) {
        // Method 1: Count explicit line breaks
        const explicitLines = content.split('\n').length;
        
        // Method 2: Estimate based on word count and wrapping
        const words = content.trim().split(/\s+/).length;
        const wordsPerLine = 12; // Depends on font size and page width
        const wrappedLines = Math.ceil(words / wordsPerLine);
        
        // Use the maximum to account for both
        const totalLines = Math.max(explicitLines, wrappedLines);
        
        // Calculate total height
        const lineHeight = 22;        // Space per line
        const padding = 60;           // Top + bottom padding
        const labelHeight = 30;       // Label space
        const borderHeight = 15;      // Border thickness
        const safetyBuffer = 25;      // Extra space to prevent cutoff
        
        height = (totalLines * lineHeight) 
               + padding 
               + labelHeight 
               + borderHeight 
               + safetyBuffer;
        
        // Enforce minimums
        const minHeight = field.type === 'textarea' ? 100 : 80;
        height = Math.max(height, minHeight);
        
        // Cap at reasonable maximum (if content is huge, let it span pages)
        const maxHeight = 600;
        if (height > maxHeight) {
          // This field will be split across pages
          console.warn(`Field "${field.label}" exceeds single page capacity`);
        }
      }
      break;
      
    case 'table':
      // Tables require special handling
      const rows = field.data?.length || 0;
      const headerHeight = 40;
      const rowHeight = 35;
      height = headerHeight + (rows * rowHeight);
      break;
      
    case 'signature':
      height = 120; // Space for signature pad
      break;
      
    case 'image':
      height = field.imageHeight || 200;
      break;
  }
  
  return Math.round(height);
}

interface PageItem {
  field: FormField;
  estimatedHeight: number;
  content: string;
  showSectionTitle?: boolean;
}

function paginateForm(
  schema: FormSchema,
  formData: Record<string, any>
): PageItem[][] {
  const availableHeight = calculateAvailableHeight(A4_CONFIG);
  const pages: PageItem[][] = [];
  
  let currentPage: PageItem[] = [];
  let currentPageHeight = 0;
  let pageNumber = 1;
  
  console.log(`📏 Starting pagination:`);
  console.log(`   Available height per page: ${availableHeight}px`);
  console.log(`   Total fields: ${schema.fields.length}`);
  
  schema.fields.forEach((field, fieldIndex) => {
    const content = formData[field.key] || '';
    const estimatedHeight = estimateContentHeight(field, content);
    
    console.log(`📐 Field ${fieldIndex + 1}: "${field.label}"`);
    console.log(`   Estimated height: ${estimatedHeight}px`);
    console.log(`   Current page height: ${currentPageHeight}px`);
    
    // Check if this field fits on current page
    const willFit = (currentPageHeight + estimatedHeight) <= availableHeight;
    const isPageEmpty = currentPage.length === 0;
    
    if (!willFit && !isPageEmpty) {
      // Field doesn't fit and page has content - start new page
      console.log(`📄 Starting new page (page ${pageNumber + 1})`);
      console.log(`   Reason: ${currentPageHeight}px + ${estimatedHeight}px > ${availableHeight}px`);
      
      pages.push([...currentPage]);
      currentPage = [];
      currentPageHeight = 0;
      pageNumber++;
    }
    
    // Add field to current page
    currentPage.push({
      field,
      estimatedHeight,
      content,
      showSectionTitle: field.isFirstInSection
    });
    
    currentPageHeight += estimatedHeight;
    
    console.log(`   Added to page ${pageNumber}, new height: ${currentPageHeight}px`);
  });
  
  // Add final page
  if (currentPage.length > 0) {
    pages.push(currentPage);
  }
  
  console.log(`✅ Pagination complete: ${pages.length} pages`);
  pages.forEach((page, idx) => {
    const totalHeight = page.reduce((sum, item) => sum + item.estimatedHeight, 0);
    console.log(`   Page ${idx + 1}: ${page.length} fields, ${totalHeight}px`);
  });
  
  return pages;
}
```

### Handling Edge Cases

**1. Field taller than available page height:**
```typescript
// If a single field is taller than the page, allow it to span pages
if (estimatedHeight > availableHeight) {
  console.warn(`Field "${field.label}" will span multiple pages`);
  // Add to current page anyway - CSS will handle the overflow
  currentPage.push(item);
  
  // Calculate how many additional pages this will need
  const additionalPages = Math.ceil((estimatedHeight - availableHeight) / availableHeight);
  // Reserve space for this content
}
```

**2. Section titles must stay with content:**
```typescript
// When adding a section title, check if at least one field fits below it
if (field.type === 'section_title') {
  const nextField = schema.fields[fieldIndex + 1];
  if (nextField) {
    const nextHeight = estimateContentHeight(nextField, formData[nextField.key]);
    const combinedHeight = estimatedHeight + nextHeight;
    
    // If title + next field don't fit, move both to next page
    if (currentPageHeight + combinedHeight > availableHeight && currentPage.length > 0) {
      pages.push([...currentPage]);
      currentPage = [];
      currentPageHeight = 0;
    }
  }
}
```

**3. Tables that span pages:**
```typescript
// For large tables, render header on each page
if (field.type === 'table' && estimatedHeight > availableHeight) {
  // Split table into chunks
  const rowHeight = 35;
  const rowsPerPage = Math.floor(availableHeight / rowHeight);
  const tableChunks = chunkArray(field.data, rowsPerPage);
  
  tableChunks.forEach((chunk, chunkIndex) => {
    currentPage.push({
      field: {
        ...field,
        data: chunk,
        showHeader: chunkIndex === 0 || true, // Show header on every page
      },
      estimatedHeight: chunk.length * rowHeight + 40, // Header height
      content: '',
    });
    
    // Start new page after each chunk (except last)
    if (chunkIndex < tableChunks.length - 1) {
      pages.push([...currentPage]);
      currentPage = [];
      currentPageHeight = 0;
    }
  });
}
```

---

## Empty Pages & Spaces Prevention

### Problem: Unwanted Empty Pages

Empty pages appear when:
1. **Page break forced too early** - logic creates new page when not needed
2. **Footer takes up too much space** - content ends but footer doesn't fill gap
3. **Margins too large** - excessive padding creates blank areas
4. **Hidden content** - `display: none` elements still reserve space

### Solutions

**1. Smart Footer Positioning**

```css
/* DON'T DO THIS - Footer might create empty page */
.pdf-footer {
  position: fixed;
  bottom: 0;
  height: 100px; /* Too tall */
}

/* DO THIS - Footer adjusts to content */
.pdf-footer {
  position: fixed;
  bottom: 0;
  height: auto;
  max-height: 80px;
  padding: 10px 20px;
}
```

**2. Margin Calculation**

```typescript
// Calculate minimum footer buffer
const MIN_CONTENT_AFTER_BREAK = 100; // Don't start new page if less than 100px remains

if (currentPageHeight + estimatedHeight > availableHeight) {
  const remainingSpace = availableHeight - currentPageHeight;
  
  if (remainingSpace < MIN_CONTENT_AFTER_BREAK && currentPage.length > 0) {
    // Move entire field to next page
    pages.push([...currentPage]);
    currentPage = [item];
    currentPageHeight = estimatedHeight;
  } else {
    // Let content flow naturally (will be cut, but CSS handles it)
    currentPage.push(item);
  }
}
```

**3. Remove Empty Sections**

```typescript
// Filter out sections with no visible content
const renderSection = (section) => {
  const visibleFields = section.fields.filter(field => {
    const value = formData[field.key];
    return value && value.trim().length > 0;
  });
  
  // Don't render empty sections
  if (visibleFields.length === 0) {
    return null;
  }
  
  return (
    <div className="section">
      <h2>{section.title}</h2>
      {visibleFields.map(field => (
        <Field key={field.key} {...field} value={formData[field.key]} />
      ))}
    </div>
  );
};
```

**4. Consolidate Small Spaces**

```css
/* Reduce excessive spacing between elements */
.field-row {
  margin-bottom: 8px; /* Not 30px */
}

.section {
  margin-bottom: 15px; /* Not 50px */
}

/* Use consistent padding */
.pdf-body {
  padding: 20px; /* Uniform all sides */
}
```

**5. Detect and Log Empty Pages**

```typescript
// Debugging tool: detect pages with minimal content
pages.forEach((page, index) => {
  const totalHeight = page.reduce((sum, item) => sum + item.estimatedHeight, 0);
  
  if (totalHeight < 100) {
    console.warn(`⚠️ Page ${index + 1} has very little content (${totalHeight}px)`);
    console.warn(`   Fields on this page:`, page.map(item => item.field.label));
    console.warn(`   Consider merging with previous or next page`);
  }
  
  if (page.length === 0) {
    console.error(`❌ Page ${index + 1} is completely empty! This should never happen.`);
  }
});

// Remove any accidentally empty pages
const cleanedPages = pages.filter(page => page.length > 0 && 
  page.reduce((sum, item) => sum + item.estimatedHeight, 0) > 50
);
```

---

## Signature Management

### Multi-Signature Requirements

Forms often need signatures from multiple parties:
- **Participant OR Nominee** (either one is required, not both)
- **Representative** (always required)
- **Assessor** (conditional - only if assessment is complete)

### Signature Schema

```typescript
interface SignatureRequirement {
  id: string;                          // Unique identifier
  label: string;                       // Display label
  description?: string;                // Help text
  required?: boolean;                  // Always required
  dataKey: string;                     // Form field key for signature image
  signedAtKey?: string;                // Form field key for signature date
  signerName?: string;                 // Form field key for signer name
  condition?: (formData: any) => boolean; // Conditional logic
  
  // Grouping (for "OR" requirements)
  groupId?: string;                    // Group identifier
  groupRequirementType?: "any" | "all"; // any = one required, all = all required
  groupRequired?: boolean;             // Is this group required
}
```

### Example: Schedule of Supports Signatures

```typescript
signatures: [
  // GROUP: Participant OR Nominee (one required)
  {
    id: "participant_signature",
    label: "Participant Signature",
    dataKey: "participantSignature",
    signedAtKey: "participantSignatureDate",
    groupId: "participant_or_nominee",
    groupRequirementType: "any",
    groupRequired: true,
    signerName: "participantName",
  },
  {
    id: "nominee_signature",
    label: "Nominee Signature",
    dataKey: "nomineeSignature",
    signedAtKey: "nomineeSignatureDate",
    groupId: "participant_or_nominee",
    groupRequirementType: "any",
    groupRequired: true,
    signerName: "nomineeName",
  },
  
  // ALWAYS REQUIRED
  {
    id: "representative_signature",
    label: "Representative Signature",
    required: true,
    dataKey: "representativeSignature",
    signedAtKey: "representativeSignatureDate",
    signerName: "representativeName"
  },
]
```

### Signature Logic in Forms

**Client-side validation:**
```typescript
// src/app/forms/signature/[token]/[formSubmissionId]/FormSignaturePageClient.tsx

useEffect(() => {
  if (formData) {
    const allSignatures = getFormSignatures(formData.formSubmission.form.formKey);
    const completed: Record<string, boolean> = {};
    const filtered: SignatureRequirement[] = [];
    const groupMap = new Map<string, any[]>();

    for (const sig of allSignatures) {
      const dataKey = sig.dataKey || sig.id;
      const isSigned = !!formData.formSubmission.data[dataKey];

      // Grouped signatures (OR logic)
      if (sig.groupId && sig.groupRequirementType === "any") {
        if (!groupMap.has(sig.groupId)) {
          groupMap.set(sig.groupId, []);
        }
        groupMap.get(sig.groupId)!.push({ ...sig, isSigned });
      } 
      // Regular signatures
      else {
        if (sig.required || (sig.condition && sig.condition(formData.formSubmission.data))) {
          completed[sig.id] = isSigned;
          if (!isSigned) {
            filtered.push(sig); // Needs signature
          }
        }
      }
    }

    // Evaluate "any" groups (one signature required from group)
    for (const [groupId, groupSigs] of groupMap.entries()) {
      const isGroupSigned = groupSigs.some((sig: any) => sig.isSigned);
      if (isGroupSigned) {
        // Group is satisfied
        groupSigs.forEach((sig) => (completed[sig.id] = true));
      } else {
        // Group needs signature - show all options
        groupSigs.forEach((sig) => {
          filtered.push(sig);
          completed[sig.id] = false;
        });
      }
    }

    setRequiredSignatures(filtered);
    setCompletedSignatures(completed);
  }
}, [formData]);
```

**UI for grouped signatures:**
```typescript
// If group type is "any", show dropdown to select which signature to provide
{isGroupAny && (
  <div className="mb-4">
    <label>Select Signature Type</label>
    <select onChange={(e) => setSelectedGroupSignatureId(e.target.value)}>
      <option value="">Select</option>
      {sameGroupSigs.map((sig) => (
        <option key={sig.id} value={sig.id}>
          {sig.label}
        </option>
      ))}
    </select>
  </div>
)}

{/* Signature pad for selected signature */}
{activeSignatureId && (
  <>
    {needsName && (
      <input
        type="text"
        placeholder="Enter your full name"
        value={signatureName}
        onChange={(e) => setSignatureName(e.target.value)}
      />
    )}
    
    <input
      type="date"
      value={signatureDate}
      onChange={(e) => setSignatureDate(e.target.value)}
    />
    
    <SignatureCanvas ref={(ref) => setSignatureRefs({...signatureRefs, [activeSignatureId]: ref})} />
    
    <button onClick={() => submitSignature(activeSignatureId)}>
      Submit Signature
    </button>
  </>
)}
```

### PDF Rendering with Signatures

**React-PDF approach:**
```typescript
// Show different signature blocks based on who signed
{formData?.signatureRole === "Participant" && (
  <View style={styles.signatureSection}>
    <Text style={styles.signatureLabel}>Participant Signature</Text>
    {formData?.participantSignature ? (
      <Image 
        src={formData.participantSignature} 
        style={styles.signatureImage} 
      />
    ) : (
      <Text>________________________</Text>
    )}
    <Text>Date: {formatDate(formData?.participantSignatureDate)}</Text>
    <Text>Name: {formData?.participantName || ''}</Text>
  </View>
)}

{formData?.signatureRole === "Nominee" && (
  <View style={styles.signatureSection}>
    <Text style={styles.signatureLabel}>Nominee Signature</Text>
    {formData?.nomineeSignature ? (
      <Image 
        src={formData.nomineeSignature} 
        style={styles.signatureImage} 
      />
    ) : (
      <Text>________________________</Text>
    )}
    <Text>Date: {formatDate(formData?.nomineeSignatureDate)}</Text>
    <Text>Name: {formData?.nomineeName || ''}</Text>
  </View>
)}

{/* Representative signature always shown */}
<View style={styles.signatureSection}>
  <Text style={styles.signatureLabel}>Representative Signature</Text>
  {formData?.representativeSignature ? (
    <Image 
      src={formData.representativeSignature} 
      style={styles.signatureImage} 
    />
  ) : (
    <Text>________________________</Text>
  )}
  <Text>Date: {formatDate(formData?.representativeSignatureDate)}</Text>
  <Text>Name: {formData?.representativeName || ''}</Text>
</View>
```

---

## Best Practices & Patterns

### 1. Schema-First Design

**Always define the schema before building components.**

```typescript
// ✅ GOOD: Schema defines structure
const schema = {
  sections: [
    {
      title: "Personal Information",
      fields: [
        { key: "name", label: "Full Name", type: "text", required: true },
        { key: "dob", label: "Date of Birth", type: "date", required: true },
      ]
    }
  ]
};

// Component uses schema
function FormComponent({ schema, data }) {
  return schema.sections.map(section => (
    <Section key={section.title} title={section.title}>
      {section.fields.map(field => (
        <Field key={field.key} {...field} value={data[field.key]} />
      ))}
    </Section>
  ));
}
```

```typescript
// ❌ BAD: Hard-coded structure
function FormComponent({ data }) {
  return (
    <div>
      <Section title="Personal Information">
        <Field label="Full Name" value={data.name} />
        <Field label="Date of Birth" value={data.dob} />
      </Section>
    </div>
  );
}
```

### 2. Separation of Concerns

**Keep edit, view, and PDF components separate but consistent.**

```
src/
├── app/components/forms/
│   └── client-intake/
│       ├── Edit.tsx           # Edit mode (form inputs)
│       ├── View.tsx           # View mode (read-only)
│       └── schema.ts          # Shared schema
├── components-server/PrintableForms/
│   └── ClientIntake_PDF.tsx   # PDF generation
└── app/forms/
    └── registry.ts            # Register all components
```

### 3. Reusable Components

**Build generic components that work across all forms.**

```typescript
// src/components/shared/UnifiedFieldRenderer.tsx
interface UnifiedFieldRendererProps {
  fieldKey: string;
  label: string;
  value: string;
  type: 'text' | 'textarea' | 'checkbox' | 'date';
  mode: 'edit' | 'view' | 'pdf';
  onChange?: (value: string) => void;
}

export const UnifiedFieldRenderer = ({ mode, type, value, label, onChange }) => {
  if (mode === 'pdf') {
    return (
      <div className="pdf-field">
        <div className="pdf-field-label">{label}</div>
        <div className="pdf-field-value">{value || ''}</div>
      </div>
    );
  }
  
  if (mode === 'view') {
    return (
      <div className="view-field">
        <label>{label}</label>
        <p>{value || 'Not provided'}</p>
      </div>
    );
  }
  
  // Edit mode
  if (type === 'textarea') {
    return (
      <div className="edit-field">
        <label>{label}</label>
        <textarea value={value} onChange={(e) => onChange?.(e.target.value)} />
      </div>
    );
  }
  
  return (
    <div className="edit-field">
      <label>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange?.(e.target.value)} />
    </div>
  );
};
```

### 4. Defensive Data Access

**Always handle missing or malformed data gracefully.**

```typescript
// ✅ GOOD: Safe data access
const getValue = (key: string): string => {
  try {
    const value = formData?.[key] ?? commonFieldsData?.[key] ?? '';
    return typeof value === 'string' ? value : String(value);
  } catch (error) {
    console.warn(`Error getting value for key ${key}:`, error);
    return '';
  }
};

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return String(dateString); // Return as-is if invalid
    }
    return date.toLocaleDateString('en-GB');
  } catch {
    return String(dateString);
  }
};
```

### 5. Console Logging for Debugging

**Add detailed logs during pagination.**

```typescript
console.log(`📏 Page dimensions:`, { width: A4_WIDTH, height: A4_HEIGHT });
console.log(`📐 Field "${field.label}": ${estimatedHeight}px`);
console.log(`📄 Starting new page (page ${pageNumber})`);
console.log(`✅ Pagination complete: ${pages.length} pages`);

// Use emojis for easy scanning
// 📏 = measurements
// 📐 = calculations
// 📄 = page events
// ✅ = success
// ⚠️ = warnings
// ❌ = errors
```

### 6. Version Control for PDF Components

**When making breaking changes, create new versions.**

```
PrintableForms/
├── ClientIntakev2.tsx           # Current production version
├── ClientIntakev2_MATCHING.tsx  # Matches web view exactly
├── ClientIntakev2_NATURAL.tsx   # Natural flow version
├── ClientIntakev2_BULLETPROOF.tsx # Handles edge cases
└── ClientIntakev2_DYNAMIC.tsx   # Content-aware pagination
```

### 7. Testing Checklist

Before deploying PDF changes:
- [ ] Test with minimal data (1-2 fields filled)
- [ ] Test with maximum data (all fields filled with long text)
- [ ] Test with special characters (quotes, apostrophes, line breaks)
- [ ] Test with images (signatures, logos)
- [ ] Verify page breaks at expected locations
- [ ] Check no empty pages generated
- [ ] Verify headers/footers on all pages
- [ ] Test all signature combinations (participant vs nominee)
- [ ] Check PDF file size is reasonable (<2MB)
- [ ] Test download in multiple browsers

### 8. Performance Optimization

```typescript
// ✅ GOOD: Memoize expensive calculations
const estimatedHeight = useMemo(
  () => estimateContentHeight(field, content),
  [field.type, content]
);

// ✅ GOOD: Lazy load images
<Image src={logoDataUrl} loading="lazy" />

// ✅ GOOD: Compress signature images before saving
const compressSignature = async (dataUrl: string): Promise<string> => {
  const img = new Image();
  img.src = dataUrl;
  await img.decode();
  
  const canvas = document.createElement('canvas');
  canvas.width = img.width * 0.5;  // 50% size
  canvas.height = img.height * 0.5;
  
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
  return canvas.toDataURL('image/jpeg', 0.8); // 80% quality
};
```

---

## Summary

### Key Takeaways

1. **Schema-driven architecture** makes forms maintainable and scalable
2. **Content-aware pagination** prevents cutoff and empty pages
3. **React-PDF** provides programmatic control over PDF generation
4. **CSS page-break properties** give fine-grained control over layout
5. **Height estimation** requires tuning but works reliably
6. **Signature management** supports complex workflows (OR groups, conditionals)
7. **Defensive coding** handles edge cases gracefully

### Common Pitfalls to Avoid

- ❌ Using `overflow: hidden` in PDFs (content disappears)
- ❌ Not accounting for footer buffer (content overlaps footer)
- ❌ Hard-coding page breaks (doesn't scale)
- ❌ Ignoring word wrapping in height calculations
- ❌ Forgetting to repeat table headers on page breaks
- ❌ Not testing with real user data (which is always messier than test data)

### When to Use Each Approach

**React-PDF:**
- ✅ Simple layouts (invoices, receipts, reports)
- ✅ Programmatic generation (batch processing)
- ✅ Consistent styling across platforms
- ✅ Small file sizes

**HTML-to-PDF (Playwright):**
- ✅ Complex layouts (multi-column, nested tables)
- ✅ Need exact web view match
- ✅ CSS animations or advanced styling
- ✅ Existing HTML forms

**Hybrid Approach (Current System):**
- ✅ Uses React-PDF for simple forms
- ✅ Uses HTML-to-PDF for complex forms
- ✅ Best of both worlds

---

## Additional Resources

### Official Documentation
- **@react-pdf/renderer**: https://react-pdf.org/
- **Playwright PDF**: https://playwright.dev/docs/api/class-page#page-pdf
- **CSS Print**: https://developer.mozilla.org/en-US/docs/Web/CSS/@page

### Code Examples in This Repo
- `src/components-server/PrintableForms/schedule-of-supports/ScheduleOfSupports_REACT_PDF.tsx` - Complete React-PDF example
- `src/app/form-components/emergency-drill/components/ContentAwarePagination.tsx` - Pagination algorithm
- `src/components-server/PrintableForms/pdf/pdf-print.css` - CSS page break handling
- `src/app/forms/registry.ts` - Form and signature registration

### Internal Documentation
- Form Signature Flow: See `FormSignaturePageClient.tsx` for complete signature handling
- PDF Generation API: See `src/app/api/generate-pdf/[formSubmissionId]/[formId]/route.ts`
- Schema Definitions: Each form has a `schema.ts` file in its component directory

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-11  
**Author:** System Architecture Team  
**Review Status:** Ready for team distribution

For questions or clarifications, reference the specific files mentioned throughout this document.


