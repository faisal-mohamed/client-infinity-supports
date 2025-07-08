# Home Visit PDF Optimization Solution

## Problem
The HomeVisitRiskAssessment component pages are overflowing in PDF generation because:
1. Fixed dimensions (`w-[210mm] h-[297mm]`) don't work well with Playwright PDF generation
2. Web-specific styling interferes with PDF page breaks
3. Content doesn't fit properly within PDF page boundaries

## Solution Applied

### 1. Updated PDF Generation CSS
Modified `/api/generate-pdf/[formSubmissionId]/[formId]/route.ts` with:

```css
/* PDF-specific page settings */
@page {
  size: A4;
  margin: 15mm 10mm 15mm 10mm;
}

/* PDF Page Break Control */
.a4-page {
  page-break-before: always;
  page-break-after: always;
  page-break-inside: avoid;
  width: 100%;
  min-height: 100vh;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  background: white;
}

/* First page shouldn't have page break before */
.a4-page:first-child {
  page-break-before: auto;
}
```

### 2. Optimized PDF Generation Options
```typescript
const pdfBuffer = await page.pdf({
  format: 'A4',
  printBackground: true,
  margin: { top: '15mm', bottom: '15mm', left: '10mm', right: '10mm' },
  preferCSSPageSize: true,
  displayHeaderFooter: false,
});
```

### 3. Component Modification Needed
You need to update the A4Page component in HomeVisitRiskAssessment.tsx:

**Replace this:**
```typescript
const A4Page = ({ children, className = "" } : any) => (
  <div className={`
    a4-page
    w-[210mm] h-[297mm] 
    mx-auto mb-8 
    bg-white 
    shadow-lg 
    border border-gray-300
    flex flex-col
    ${className}
  `}>
    {children}
  </div>
);
```

**With this:**
```typescript
const A4Page = ({ children, className = "" } : any) => (
  <div className={`
    a4-page
    flex flex-col
    ${className}
  `}>
    {children}
  </div>
);
```

## Key Changes Explained

### Page Break Control
- Each `a4-page` div now creates a proper PDF page break
- `page-break-inside: avoid` prevents content from splitting mid-page
- First page doesn't have unnecessary page break

### Sizing Strategy
- Removed fixed `w-[210mm] h-[297mm]` dimensions
- Let PDF engine handle page sizing naturally
- Use flexbox for content distribution within pages

### Content Optimization
- Reduced margins for more content space
- Optimized table cell padding
- Better font sizing for PDF readability

## Testing Results Expected

After these changes:
✅ Page 1: Client info table + questions fit properly
✅ Page 2: Continuation questions fit properly  
✅ Page 3: Risk matrix image + descriptions fit properly
✅ Page 4: Risk assessment table fits properly
✅ Page 5: Signature section fits properly

## Alternative Approach (If Still Issues)

If content still overflows, consider:

1. **Reduce Content Per Page**: Split large tables across multiple pages
2. **Adjust Font Sizes**: Use smaller fonts for dense content
3. **Optimize Spacing**: Reduce padding/margins in tables
4. **Dynamic Page Breaks**: Add conditional page breaks for long content

## Manual Component Update Required

You need to manually update the A4Page component in:
`/src/components-server/PrintableForms/HomeVisitRiskAssessment.tsx`

Remove the fixed dimensions and web-specific styling from the A4Page component as shown above.
