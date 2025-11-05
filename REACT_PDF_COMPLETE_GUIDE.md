# Complete React PDF (@react-pdf/renderer) Guide - 100% Perfect Implementation

## Table of Contents

1. [Installation & Setup](#installation--setup)
2. [Core Concepts](#core-concepts)
3. [Dynamic Pages & Content Flow](#dynamic-pages--content-flow)
4. [Page Breaks Management](#page-breaks-management)
5. [Overflow Issues & Solutions](#overflow-issues--solutions)
6. [Height Calculations](#height-calculations)
7. [Blank Pages Prevention](#blank-pages-prevention)
8. [Space Optimization](#space-optimization)
9. [Advanced Patterns](#advanced-patterns)
10. [Complete Working Examples](#complete-working-examples)
11. [Troubleshooting Guide](#troubleshooting-guide)

---

## Installation & Setup

```bash
npm install @react-pdf/renderer
# or
yarn add @react-pdf/renderer
# or
pnpm add @react-pdf/renderer
```

### Basic Imports

```typescript
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { renderToBuffer, renderToStream } from "@react-pdf/renderer";
```

### Font Registration (Optional but Recommended)

```typescript
// Register custom fonts for better typography
Font.register({
  family: "Roboto",
  fonts: [
    { src: "/fonts/Roboto-Regular.ttf", fontWeight: "normal" },
    { src: "/fonts/Roboto-Bold.ttf", fontWeight: "bold" },
    { src: "/fonts/Roboto-Italic.ttf", fontStyle: "italic" },
  ],
});
```

---

## Core Concepts

### Understanding the Box Model

React PDF uses a Flexbox-based layout similar to React Native:

```typescript
const styles = StyleSheet.create({
  container: {
    flexDirection: "column", // Default: column
    justifyContent: "flex-start",
    alignItems: "stretch",
    padding: 10, // Padding inside
    margin: 10, // Margin outside
    border: "1 solid #000", // Border syntax
  },
});
```

### Key Differences from Web CSS

| Web CSS                   | React PDF                                      |
| ------------------------- | ---------------------------------------------- |
| `display: flex`           | Always flex (no need to specify)               |
| `flex-direction: column`  | `flexDirection: 'column'`                      |
| `border: 1px solid black` | `border: '1 solid #000'`                       |
| `margin: 10px 20px`       | Separate: `marginVertical`, `marginHorizontal` |
| `overflow: auto`          | ❌ Not supported                               |
| `position: fixed`         | Use `fixed` prop on component                  |

---

## Dynamic Pages & Content Flow

### ✅ Best Practice: Single Page Component with Natural Flow

This is the **RECOMMENDED** approach - let React PDF handle pagination automatically:

```typescript
const DynamicPDF: React.FC<Props> = ({ items }) => {
  return (
    <Document>
      {/* Single Page component - will create multiple pages as needed */}
      <Page size="A4" style={styles.page}>
        {/* Fixed Header - appears on ALL pages */}
        <View style={styles.header} fixed>
          <Image src={logoUrl} style={styles.logo} />
          <Text>My Company</Text>
        </View>

        {/* Content - flows naturally across pages */}
        <View style={styles.content}>
          <Text style={styles.title}>Dynamic Content</Text>

          {/* Dynamic items - React PDF handles page breaks */}
          {items.map((item, index) => (
            <View key={index} style={styles.item} wrap={false}>
              <Text>{item.title}</Text>
              <Text>{item.description}</Text>
            </View>
          ))}
        </View>

        {/* Fixed Footer - appears on ALL pages */}
        <View style={styles.footer} fixed>
          <Text>Page {/* Auto page number */}</Text>
          <Text>Date: {new Date().toLocaleDateString()}</Text>
        </View>
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    paddingTop: 100, // Space for fixed header
    paddingBottom: 60, // Space for fixed footer
  },
  header: {
    position: "absolute",
    top: 20,
    left: 30,
    right: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1 solid #000",
    paddingBottom: 10,
  },
  content: {
    flex: 1,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    borderTop: "1 solid #ccc",
    paddingTop: 10,
    fontSize: 9,
  },
});
```

### ❌ Anti-Pattern: Multiple Page Components

```typescript
// DON'T DO THIS - Creates fixed pages and blank pages
<Document>
  <Page size="A4">
    <View>Page 1 Content</View>
  </Page>
  <Page size="A4">
    <View>Page 2 Content</View>
  </Page>
  <Page size="A4">
    <View>Page 3 Content</View>
  </Page>
</Document>
```

---

## Page Breaks Management

### The `wrap` Prop - Your Best Friend

The `wrap` prop controls whether a component can be split across pages:

```typescript
// ✅ ALLOW page breaks (default)
<View wrap={true}>
  <Text>This text can be split across pages if needed</Text>
</View>

// ❌ PREVENT page breaks
<View wrap={false}>
  <Text>This entire block stays together</Text>
  <Text>Even if it means moving to next page</Text>
</View>
```

### Strategic Wrap Usage

```typescript
const ReportPDF = ({ sections }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header} fixed>
        <Text>Header</Text>
      </View>

      <View style={styles.content}>
        {sections.map((section, index) => (
          <React.Fragment key={index}>
            {/* Section title - keep with first paragraph */}
            <View wrap={false}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.firstParagraph}>
                {section.content.slice(0, 200)}
              </Text>
            </View>

            {/* Rest of content - can break */}
            <View wrap={true}>
              <Text>{section.content.slice(200)}</Text>
            </View>

            {/* Spacing between sections */}
            <View style={styles.sectionGap} />
          </React.Fragment>
        ))}
      </View>
    </Page>
  </Document>
);
```

### The `break` Prop - Force Page Breaks

```typescript
// Force a page break BEFORE this element
<View break>
  <Text>This will always start on a new page</Text>
</View>
```

### Common Page Break Scenarios

```typescript
const styles = StyleSheet.create({
  // 1. Tables - prevent row splitting
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #ddd",
    // Will be used with wrap={false}
  },

  // 2. Card/Box components - keep together
  card: {
    padding: 15,
    border: "2 solid #3b82f6",
    borderRadius: 8,
    marginBottom: 10,
    // Will be used with wrap={false}
  },

  // 3. Signatures - never split
  signatureBox: {
    border: "1 solid #000",
    padding: 12,
    marginTop: 20,
    // Will be used with wrap={false}
  },
});

// Usage
<View style={styles.card} wrap={false}>
  <Text style={styles.cardTitle}>Important Card</Text>
  <Text style={styles.cardContent}>This card stays together</Text>
</View>;
```

---

## Overflow Issues & Solutions

### Problem 1: Text Overflow (Most Common)

#### ❌ Problem:

```typescript
// Text gets cut off or overflows container
<View style={{ width: 200, height: 50 }}>
  <Text>This is a very long text that will overflow the container</Text>
</View>
```

#### ✅ Solution 1: Remove Fixed Heights

```typescript
// Let height be dynamic
<View style={{ width: 200 }}>
  <Text>This is a very long text that will wrap naturally</Text>
</View>
```

#### ✅ Solution 2: Use minHeight Instead

```typescript
<View style={{ width: 200, minHeight: 50 }}>
  <Text>This text can grow beyond 50pt if needed</Text>
</View>
```

#### ✅ Solution 3: Text Wrapping Styles

```typescript
const styles = StyleSheet.create({
  textContainer: {
    width: "100%",
    padding: 10,
    // No height - let content determine it
  },
  text: {
    fontSize: 10,
    lineHeight: 1.4,
    // Text automatically wraps in React PDF
  },
});
```

### Problem 2: Content Overflow in Fixed Height Containers

#### ❌ Problem:

```typescript
// Content overflows page margins
<View style={{ height: 800 }}>
  {largeDataArray.map((item) => (
    <Text>{item}</Text>
  ))}
</View>
```

#### ✅ Solution: Use flex and Natural Flow

```typescript
// Content automatically flows to next page
<View style={{ flex: 1 }}>
  {largeDataArray.map((item, index) => (
    <View key={index} wrap={false} style={styles.item}>
      <Text>{item}</Text>
    </View>
  ))}
</View>
```

### Problem 3: Image Overflow

#### ❌ Problem:

```typescript
<Image src={largeImage} style={{ width: 1000, height: 800 }} />
```

#### ✅ Solution: Constrain with max dimensions

```typescript
const styles = StyleSheet.create({
  image: {
    maxWidth: 500, // Max width
    maxHeight: 400, // Max height
    objectFit: "contain", // Maintain aspect ratio
  },
});

<Image src={largeImage} style={styles.image} />;
```

### Problem 4: Table Overflow

#### ✅ Solution: Responsive Table Pattern

```typescript
const ResponsiveTable = ({ data }) => (
  <View style={styles.table}>
    {/* Header */}
    <View style={styles.tableHeader} wrap={false}>
      <Text style={[styles.tableCell, { width: "40%" }]}>Name</Text>
      <Text style={[styles.tableCell, { width: "30%" }]}>Email</Text>
      <Text style={[styles.tableCell, { width: "30%" }]}>Phone</Text>
    </View>

    {/* Rows - each row prevents splitting */}
    {data.map((row, index) => (
      <View key={index} style={styles.tableRow} wrap={false}>
        <Text style={[styles.tableCell, { width: "40%" }]}>{row.name}</Text>
        <Text style={[styles.tableCell, { width: "30%" }]}>{row.email}</Text>
        <Text style={[styles.tableCell, { width: "30%" }]}>{row.phone}</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  table: {
    width: "100%",
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#3b82f6",
    borderBottom: "2 solid #2563eb",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #e5e7eb",
    minHeight: 25, // Minimum, but can grow
  },
  tableCell: {
    padding: 8,
    fontSize: 9,
    // Width set inline for flexibility
  },
});
```

---

## Height Calculations

### Understanding Height Calculation in React PDF

React PDF calculates heights automatically based on content. Here's how to work with it:

### Rule 1: Avoid Fixed Heights Unless Necessary

```typescript
// ❌ BAD - Fixed height causes overflow
const badStyles = StyleSheet.create({
  section: {
    height: 200, // Fixed = problems
  },
});

// ✅ GOOD - Dynamic height
const goodStyles = StyleSheet.create({
  section: {
    minHeight: 200, // Minimum, can grow
    // or just omit height entirely
  },
});
```

### Rule 2: Use Flex for Proportional Layouts

```typescript
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 30,
    paddingTop: 100, // Fixed header space
    paddingBottom: 60, // Fixed footer space
  },
  content: {
    flex: 1, // Takes available space
  },
});
```

### Rule 3: Calculate Heights for Special Cases

```typescript
// When you need to estimate if content fits on page
const estimateContentHeight = (text: string): number => {
  const CHARS_PER_LINE = 80; // Average for 10pt font, A4 width
  const LINE_HEIGHT = 14; // pts
  const BASE_PADDING = 20; // pts

  const lines = Math.ceil(text.length / CHARS_PER_LINE);
  return lines * LINE_HEIGHT + BASE_PADDING;
};

// Usage
const shouldBreakPage = (content: string): boolean => {
  const A4_HEIGHT = 842; // pts
  const USABLE_HEIGHT = 642; // pts (minus header/footer)

  const estimatedHeight = estimateContentHeight(content);
  return estimatedHeight > USABLE_HEIGHT;
};
```

### Rule 4: Height Constants for A4 Pages

```typescript
// A4 Page Dimensions (in points - 72 pts = 1 inch)
const PAGE_SIZES = {
  A4: {
    width: 595, // pts
    height: 842, // pts
  },
  LETTER: {
    width: 612, // pts
    height: 792, // pts
  },
};

// Usable area calculation
const calculateUsableArea = (
  pageHeight: number,
  headerHeight: number,
  footerHeight: number,
  topPadding: number,
  bottomPadding: number
) => {
  return pageHeight - headerHeight - footerHeight - topPadding - bottomPadding;
};

// Example
const USABLE_HEIGHT = calculateUsableArea(
  842, // A4 height
  80, // Header
  50, // Footer
  30, // Top padding
  30 // Bottom padding
);
// Result: 652 pts available for content
```

### Rule 5: Smart Content Splitting

```typescript
const SmartContentRenderer = ({ content }: { content: string }) => {
  const MAX_CHARS_PER_PAGE = 4000;

  if (content.length <= MAX_CHARS_PER_PAGE) {
    // Fits on one chunk
    return (
      <View wrap={true}>
        <Text>{content}</Text>
      </View>
    );
  }

  // Split into chunks
  const chunks: string[] = [];
  for (let i = 0; i < content.length; i += MAX_CHARS_PER_PAGE) {
    chunks.push(content.slice(i, i + MAX_CHARS_PER_PAGE));
  }

  return (
    <>
      {chunks.map((chunk, index) => (
        <View key={index} wrap={true}>
          <Text>{chunk}</Text>
          {index < chunks.length - 1 && (
            <View style={{ height: 20 }} /> // Spacing
          )}
        </View>
      ))}
    </>
  );
};
```

---

## Blank Pages Prevention

Blank pages are caused by:

1. Fixed height containers that force content to next page
2. `wrap={false}` on large content
3. Page breaks at wrong positions
4. Excessive spacing

### Solution 1: Remove Unnecessary Breaks

```typescript
// ❌ BAD - Can create blank page
<View style={{ marginBottom: 100 }}>
  <Text>Content</Text>
</View>
<View break> {/* Forced break might create blank page */}
  <Text>Next content</Text>
</View>

// ✅ GOOD - Natural flow
<View style={{ marginBottom: 20 }}>
  <Text>Content</Text>
</View>
<View>
  <Text>Next content</Text>
</View>
```

### Solution 2: Conditional Rendering for Last Page

```typescript
const ReportPDF = ({ items }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.content}>
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <View style={styles.item} wrap={false}>
                <Text>{item.content}</Text>
              </View>

              {/* Only add spacing if not last item */}
              {index < items.length - 1 && <View style={styles.spacing} />}
            </React.Fragment>
          ))}
        </View>
      </Page>
    </Document>
  );
};
```

### Solution 3: Dynamic Page Components

```typescript
const DynamicPagePDF = ({ sections }) => {
  // Only create pages for sections that have content
  const validSections = sections.filter((s) => s.content && s.content.trim());

  return (
    <Document>
      {validSections.length > 0 ? (
        <Page size="A4" style={styles.page}>
          <View style={styles.content}>
            {validSections.map((section, index) => (
              <View key={index} style={styles.section}>
                <Text style={styles.title}>{section.title}</Text>
                <Text>{section.content}</Text>
              </View>
            ))}
          </View>
        </Page>
      ) : (
        <Page size="A4" style={styles.page}>
          <Text>No content available</Text>
        </Page>
      )}
    </Document>
  );
};
```

---

## Space Optimization

### Maximize Content per Page

```typescript
const styles = StyleSheet.create({
  page: {
    padding: 30, // Reasonable padding
    paddingTop: 90, // Just enough for header
    paddingBottom: 60, // Just enough for footer
    fontSize: 10, // Optimal reading size
    lineHeight: 1.4, // Not too sparse
  },

  // Compact section spacing
  section: {
    marginBottom: 12, // Not 20+
  },

  // Compact paragraph spacing
  paragraph: {
    marginBottom: 8,
  },

  // Efficient table design
  tableCell: {
    padding: 6, // Not 10+
    fontSize: 9, // Slightly smaller for tables
  },
});
```

### Reduce Wasted Space with Smart Typography

```typescript
const typographyStyles = StyleSheet.create({
  // Headers - compact but clear
  h1: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 12,
  },
  h2: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
    marginTop: 10,
  },
  h3: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
    marginTop: 8,
  },

  // Body text - optimal line height
  body: {
    fontSize: 10,
    lineHeight: 1.4, // Sweet spot for readability
    marginBottom: 6,
  },

  // Small text - for captions
  caption: {
    fontSize: 8,
    color: "#666",
    marginBottom: 4,
  },
});
```

### Two-Column Layout for Space Efficiency

```typescript
const TwoColumnSection = ({ leftContent, rightContent }) => (
  <View style={styles.twoColumn}>
    <View style={styles.column}>{leftContent}</View>
    <View style={styles.column}>{rightContent}</View>
  </View>
);

const styles = StyleSheet.create({
  twoColumn: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 10,
  },
  column: {
    flex: 1,
  },
});
```

---

## Advanced Patterns

### Pattern 1: Responsive Sections with Break Logic

```typescript
const ResponsiveSection = ({
  title,
  content,
  keepTogether = false,
}: {
  title: string;
  content: string;
  keepTogether?: boolean;
}) => {
  const contentHeight = estimateHeight(content);
  const shouldBreak = contentHeight > 600; // 600pts threshold

  if (keepTogether && !shouldBreak) {
    return (
      <View wrap={false} style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionContent}>{content}</Text>
      </View>
    );
  }

  return (
    <View wrap={true} style={styles.section}>
      <View wrap={false}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <Text style={styles.sectionContent}>{content}</Text>
    </View>
  );
};

const estimateHeight = (text: string): number => {
  const CHARS_PER_LINE = 80;
  const LINE_HEIGHT = 14;
  const PADDING = 20;
  return Math.ceil(text.length / CHARS_PER_LINE) * LINE_HEIGHT + PADDING;
};
```

### Pattern 2: Dynamic Goal/Item Cards (Real-world Example)

```typescript
interface Goal {
  number: number;
  title: string;
  description: string;
  rating: string;
  dueDate: string;
}

const DynamicGoalsPDF = ({ goals }: { goals: Goal[] }) => {
  // Extract only goals with content
  const validGoals = goals.filter((g) => g.title && g.title.trim());

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Text>Goals Report</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.pageTitle}>Goals & Objectives</Text>

          {validGoals.length > 0 ? (
            validGoals.map((goal, index) => (
              <React.Fragment key={index}>
                {/* Each goal card stays together */}
                <View style={styles.goalCard} wrap={false}>
                  <View style={styles.goalHeader}>
                    <Text style={styles.goalNumber}>Goal {goal.number}</Text>
                    <Text style={styles.goalRating}>{goal.rating}</Text>
                  </View>

                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Text style={styles.goalDescription}>{goal.description}</Text>

                  <View style={styles.goalFooter}>
                    <Text style={styles.goalDate}>
                      Due: {formatDate(goal.dueDate)}
                    </Text>
                  </View>
                </View>

                {/* Spacing between cards (except last) */}
                {index < validGoals.length - 1 && (
                  <View style={styles.cardSpacing} />
                )}
              </React.Fragment>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text>No goals have been set yet.</Text>
            </View>
          )}
        </View>

        <View style={styles.footer} fixed>
          <Text>Generated: {new Date().toLocaleDateString()}</Text>
        </View>
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    padding: 30,
    paddingTop: 100,
    paddingBottom: 60,
    fontFamily: "Helvetica",
  },
  header: {
    position: "absolute",
    top: 20,
    left: 30,
    right: 30,
    borderBottom: "2 solid #3b82f6",
    paddingBottom: 10,
  },
  content: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
  },
  goalCard: {
    border: "2 solid #3b82f6",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#eff6ff",
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    borderBottom: "1 solid #3b82f6",
    paddingBottom: 6,
  },
  goalNumber: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1e40af",
  },
  goalRating: {
    fontSize: 9,
    backgroundColor: "#dbeafe",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  goalTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 6,
  },
  goalDescription: {
    fontSize: 9,
    lineHeight: 1.4,
    marginBottom: 8,
  },
  goalFooter: {
    marginTop: 6,
  },
  goalDate: {
    fontSize: 8,
    color: "#666",
    fontStyle: "italic",
  },
  cardSpacing: {
    height: 15, // Space between cards
  },
  emptyState: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    borderTop: "1 solid #ccc",
    paddingTop: 8,
    fontSize: 9,
  },
});

const formatDate = (dateString: string): string => {
  if (!dateString) return "Not set";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};
```

### Pattern 3: Dynamic Tables with Pagination

```typescript
const DynamicTablePDF = ({ data, columns }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Text>Data Report</Text>
        </View>

        <View style={styles.content}>
          {/* Table Header - fixed at top of each page */}
          <View style={styles.tableHeader} fixed>
            {columns.map((col, index) => (
              <Text
                key={index}
                style={[styles.headerCell, { width: col.width }]}
              >
                {col.label}
              </Text>
            ))}
          </View>

          {/* Table Rows - flow across pages */}
          {data.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.tableRow} wrap={false}>
              {columns.map((col, colIndex) => (
                <Text
                  key={colIndex}
                  style={[styles.cell, { width: col.width }]}
                >
                  {row[col.key] || "-"}
                </Text>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.footer} fixed>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    padding: 30,
    paddingTop: 120, // Space for header + table header
    paddingBottom: 60,
  },
  header: {
    position: "absolute",
    top: 20,
    left: 30,
    right: 30,
  },
  content: {
    flex: 1,
  },
  tableHeader: {
    position: "absolute",
    top: 80,
    left: 30,
    right: 30,
    flexDirection: "row",
    backgroundColor: "#3b82f6",
    borderBottom: "2 solid #2563eb",
  },
  headerCell: {
    padding: 8,
    fontSize: 9,
    fontWeight: "bold",
    color: "#ffffff",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #e5e7eb",
    minHeight: 30,
  },
  cell: {
    padding: 8,
    fontSize: 9,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: "center",
  },
});
```

### Pattern 4: Handling Long Text Fields

```typescript
const LongTextRenderer = ({ label, text }) => {
  // Check if text is very long
  const isVeryLong = text && text.length > 500;

  return (
    <View style={styles.longTextContainer}>
      {/* Label - keep with first bit of text */}
      <View wrap={false}>
        <Text style={styles.label}>{label}</Text>
        {isVeryLong && (
          <Text style={styles.textPreview}>{text.slice(0, 200)}...</Text>
        )}
      </View>

      {/* Rest of text - can break across pages */}
      {isVeryLong ? (
        <Text style={styles.textContinuation}>...{text.slice(200)}</Text>
      ) : (
        <Text style={styles.text}>{text || "Not provided"}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  longTextContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 6,
  },
  text: {
    fontSize: 10,
    lineHeight: 1.5,
    padding: 10,
    border: "1 solid #d1d5db",
    borderRadius: 4,
    backgroundColor: "#f9fafb",
  },
  textPreview: {
    fontSize: 10,
    lineHeight: 1.5,
    padding: 10,
    border: "1 solid #d1d5db",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: "#f9fafb",
  },
  textContinuation: {
    fontSize: 10,
    lineHeight: 1.5,
    padding: 10,
    paddingTop: 0,
    border: "1 solid #d1d5db",
    borderTop: "none",
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: "#f9fafb",
  },
});
```

---

## Complete Working Examples

### Example 1: Emergency Drill Report (Production-Ready)

```typescript
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    paddingTop: 110,
    paddingBottom: 50,
    fontFamily: "Helvetica",
    fontSize: 10,
  },
  header: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  headerLogo: {
    width: 180,
    height: 70,
    objectFit: "contain",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    fontStyle: "italic",
    color: "#666",
    textAlign: "center",
  },
  divider: {
    borderBottom: "0.5 solid #999",
    marginBottom: 16,
    marginTop: 12,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 10,
  },
  fieldRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  fieldLabel: {
    width: 180,
    fontSize: 9,
    fontWeight: "bold",
  },
  fieldValue: {
    flex: 1,
    fontSize: 9,
  },
  radioGroup: {
    flexDirection: "row",
    gap: 12,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    border: "0.5 solid #000",
    marginRight: 4,
    backgroundColor: "#fff",
  },
  radioCircleSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    border: "0.5 solid #000",
    marginRight: 4,
    backgroundColor: "#2563eb",
  },
  radioLabel: {
    fontSize: 9,
  },
  textAreaField: {
    marginBottom: 10,
  },
  textAreaLabel: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 4,
  },
  textAreaValue: {
    padding: 8,
    minHeight: 50,
    fontSize: 9,
    border: "1 solid #ddd",
    borderRadius: 4,
  },
  signatureBox: {
    border: "1 solid #000",
    padding: 12,
    marginBottom: 16,
  },
  signatureTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 12,
  },
  signatureGrid: {
    flexDirection: "row",
    gap: 16,
  },
  signatureItem: {
    flex: 1,
  },
  signatureLabel: {
    fontSize: 9,
    marginBottom: 4,
  },
  signatureImageContainer: {
    border: "0.5 solid #ccc",
    padding: 8,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  signatureImage: {
    maxHeight: 50,
    maxWidth: 200,
    objectFit: "contain",
  },
  footer: {
    position: "absolute",
    bottom: 15,
    left: 30,
    right: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: "1 solid #ddd",
    paddingTop: 8,
    fontSize: 9,
    color: "#666",
  },
});

interface EmergencyDrillPDFProps {
  formData: any;
  commonFieldsData: any;
  settings: any;
  logoDataUrl: string;
}

const EmergencyDrillPDF: React.FC<EmergencyDrillPDFProps> = ({
  formData,
  commonFieldsData,
  settings,
  logoDataUrl,
}) => {
  const getValue = (key: string): string => {
    return formData?.[key] ?? "";
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("en-US");
    } catch {
      return dateString || "";
    }
  };

  const renderRadioGroup = (fieldName: string, options: string[]) => (
    <View style={styles.radioGroup}>
      {options.map((option) => (
        <View key={option} style={styles.radioItem}>
          <View
            style={
              getValue(fieldName) === option
                ? styles.radioCircleSelected
                : styles.radioCircle
            }
          />
          <Text style={styles.radioLabel}>{option}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Fixed Header */}
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>

        {/* Content - flows naturally */}
        <View>
          {/* Title - only on first page */}
          <Text style={styles.title}>Emergency Drill Reporting Form</Text>
          <Text style={styles.subtitle}>
            (For Disability Support Workers in a Client's Home)
          </Text>
          <View style={styles.divider} />

          {/* Section 1: General Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. General Information:</Text>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Date of Drill:</Text>
              <Text style={styles.fieldValue}>
                {formatDate(getValue("drillDate"))}
              </Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Time of Drill:</Text>
              <Text style={styles.fieldValue}>{getValue("drillTime")}</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Client's Name:</Text>
              <Text style={styles.fieldValue}>{getValue("clientName")}</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Support Worker(s) Involved:</Text>
              <Text style={styles.fieldValue}>
                {getValue("supportWorkers")}
              </Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>
                Supervisor/Manager Notified:
              </Text>
              {renderRadioGroup("supervisorNotified", ["Yes", "No"])}
            </View>
          </View>

          {/* Section 2: Type of Emergency Drill */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              2. Type of Emergency Drill Conducted:
            </Text>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Selected Drill Type:</Text>
              <Text style={styles.fieldValue}>
                {getValue("selectedDrillType") || "No selection made"}
              </Text>
            </View>
          </View>

          {/* Section 3: Drill Execution Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Drill Execution Details:</Text>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>
                Was the emergency plan followed?
              </Text>
              {renderRadioGroup("planFollowed", ["Yes", "No"])}
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>
                Were all safety measures implemented?
              </Text>
              {renderRadioGroup("safetyProtocols", ["Yes", "No"])}
            </View>

            <View style={styles.textAreaField}>
              <Text style={styles.textAreaLabel}>
                Client response and involvement:
              </Text>
              <Text style={styles.textAreaValue}>
                {getValue("clientResponse") || "Not provided"}
              </Text>
            </View>

            <View style={styles.textAreaField}>
              <Text style={styles.textAreaLabel}>Support worker actions:</Text>
              <Text style={styles.textAreaValue}>
                {getValue("supportAction") || "Not provided"}
              </Text>
            </View>
          </View>

          {/* Section 4: Observations & Challenges */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              4. Observations & Challenges:
            </Text>

            <View style={styles.textAreaField}>
              <Text style={styles.textAreaLabel}>What went well?</Text>
              <Text style={styles.textAreaValue}>
                {getValue("whatWentWell") || "Not provided"}
              </Text>
            </View>

            <View style={styles.textAreaField}>
              <Text style={styles.textAreaLabel}>
                Difficulties encountered?
              </Text>
              <Text style={styles.textAreaValue}>
                {getValue("challenges") || "Not provided"}
              </Text>
            </View>
          </View>

          {/* Section 5: Recommendations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              5. Recommendations & Improvements:
            </Text>

            <View style={styles.textAreaField}>
              <Text style={styles.textAreaLabel}>
                Suggested changes to procedures:
              </Text>
              <Text style={styles.textAreaValue}>
                {getValue("procedureChanges") || "Not provided"}
              </Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>
                Additional training required?
              </Text>
              {renderRadioGroup("additionalTrainingRequired", ["Yes", "No"])}
            </View>
          </View>
        </View>

        {/* Signature Box - prevent splitting */}
        {getValue("supportWorkerSignature") && (
          <View style={styles.signatureBox} wrap={false}>
            <Text style={styles.signatureTitle}>Support Worker Signature</Text>
            <View style={styles.signatureGrid}>
              <View style={styles.signatureItem}>
                <Text style={styles.signatureLabel}>Signature:</Text>
                <View style={styles.signatureImageContainer}>
                  <Image
                    src={getValue("supportWorkerSignature")}
                    style={styles.signatureImage}
                  />
                </View>
              </View>
              <View style={styles.signatureItem}>
                <Text style={styles.signatureLabel}>Date:</Text>
                <Text>{formatDate(getValue("signatureDate"))}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>Email: {settings?.email || ""}</Text>
          <Text>Form ID: {settings?.formId || ""}</Text>
          <Text>Date: {formatDate(settings?.reviewDate)}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default EmergencyDrillPDF;
```

### Example 2: Person-Centered Plan with Dynamic Goals

```typescript
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  // Cover page styles
  coverPage: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 0,
    fontFamily: "Helvetica",
    position: "relative",
  },
  coverHeader: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    flexDirection: "column",
    alignItems: "center",
  },
  coverLogo: {
    width: 300,
    height: 90,
  },
  coverCircle: {
    position: "absolute",
    top: 380,
    left: 200,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "#f0ad7a",
    border: "1 solid #dda36f",
    justifyContent: "center",
    alignItems: "center",
  },
  coverTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    lineHeight: 1.2,
  },
  coverFooter: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 50,
    fontSize: 10,
  },

  // Regular page styles
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    paddingTop: 100,
    paddingBottom: 60,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.4,
  },
  header: {
    position: "absolute",
    top: 20,
    left: 30,
    right: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
  },
  headerLogo: {
    width: 200,
    height: 60,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: "1 solid #e5e7eb",
    paddingTop: 10,
    fontSize: 9,
    color: "#666",
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#111827",
    backgroundColor: "#f3f4f6",
    border: "1 solid #d1d5db",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },

  // Key-value table
  kvTable: {
    border: "1 solid #000",
    marginBottom: 10,
  },
  kvRow: {
    flexDirection: "row",
    borderBottom: "1 solid #000",
  },
  kvCellLabel: {
    width: 170,
    padding: 4,
    backgroundColor: "#e5e7eb",
    borderRight: "1 solid #000",
    fontSize: 9,
    fontWeight: "bold",
  },
  kvCellValue: {
    flex: 1,
    padding: 4,
    fontSize: 9,
  },

  // Long answer fields
  longAnswer: {
    marginBottom: 12,
  },
  longAnswerLabel: {
    fontWeight: "bold",
    marginBottom: 8,
    fontSize: 12,
    color: "#111827",
  },
  longAnswerValue: {
    fontSize: 10,
    color: "#111827",
    lineHeight: 1.5,
    padding: 15,
    border: "1 solid #d1d5db",
    borderRadius: 4,
    backgroundColor: "#f9fafb",
    minHeight: 60,
  },

  // Goal card styles - DYNAMIC
  goalCard: {
    marginBottom: 15,
    padding: 12,
    border: "1.5 solid #3b82f6",
    borderRadius: 8,
    backgroundColor: "#eff6ff",
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingBottom: 6,
    borderBottom: "1 solid #3b82f6",
  },
  goalTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1e40af",
  },
  outcomeRating: {
    fontSize: 8,
    backgroundColor: "#dbeafe",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    color: "#1e40af",
    fontWeight: "bold",
  },
  goalDescription: {
    marginBottom: 8,
  },
  goalDescriptionLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 3,
  },
  goalDescriptionValue: {
    fontSize: 9,
    color: "#111827",
    lineHeight: 1.4,
  },
});

interface Goal {
  number: number;
  goal: string;
  rating: string;
  actions: string;
  byWhom: string;
  byWhen: string;
  reviewDate: string;
}

interface PersonCentredPlanPDFProps {
  formData: any;
  commonFieldsData: any;
  settings: any;
  logoDataUrl: string;
}

const PersonCentredPlanPDF: React.FC<PersonCentredPlanPDFProps> = ({
  formData,
  commonFieldsData,
  settings,
  logoDataUrl,
}) => {
  const getValue = (key: string): string => {
    return formData?.[key] || commonFieldsData?.[key] || "";
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return String(dateString);
      return date.toLocaleDateString("en-AU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return String(dateString);
    }
  };

  // ✅ DYNAMIC GOAL EXTRACTION (1-10 goals)
  const extractGoals = (): Goal[] => {
    const goals: Goal[] = [];
    for (let i = 1; i <= 10; i++) {
      const goalKey = `goal${i}`;
      if (formData?.[goalKey] && formData[goalKey].trim()) {
        goals.push({
          number: i,
          goal: formData[goalKey] || "",
          rating: formData[`rating${i}`] || "Not specified",
          actions: formData[`actions${i}`] || "Not specified",
          byWhom: formData[`byWhom${i}`] || "Not specified",
          byWhen: formData[`byWhen${i}`] || "",
          reviewDate: formData[`reviewDate${i}`] || "",
        });
      }
    }
    return goals;
  };

  const goals = extractGoals();

  return (
    <Document>
      {/* ========================================
          COVER PAGE
      ======================================== */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverHeader}>
          <Image src={logoDataUrl} style={styles.coverLogo} />
        </View>

        <View style={styles.coverCircle}>
          <Text style={styles.coverTitle}>PERSON{"\n"}CENTRED PLAN</Text>
        </View>

        <View style={styles.coverFooter}>
          <Text>{settings?.email || ""}</Text>
          <Text>{settings?.formId || ""}</Text>
          <Text>Date: {formatDate(settings?.date)}</Text>
        </View>
      </Page>

      {/* ========================================
          CONTENT PAGES (Dynamic - creates N pages)
      ======================================== */}
      <Page size="A4" style={styles.page}>
        {/* Fixed header */}
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>

        <View style={styles.content}>
          {/* Section 1: Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Personal Information</Text>
            <View style={styles.kvTable}>
              <View style={styles.kvRow}>
                <Text style={styles.kvCellLabel}>Name</Text>
                <Text style={styles.kvCellValue}>{getValue("name")}</Text>
              </View>
              <View style={styles.kvRow}>
                <Text style={styles.kvCellLabel}>Address</Text>
                <Text style={styles.kvCellValue}>{getValue("address")}</Text>
              </View>
              <View style={styles.kvRow}>
                <Text style={styles.kvCellLabel}>Date of Birth</Text>
                <Text style={styles.kvCellValue}>
                  {formatDate(getValue("dob"))}
                </Text>
              </View>
              <View style={styles.kvRow}>
                <Text style={styles.kvCellLabel}>NDIS Number</Text>
                <Text style={styles.kvCellValue}>{getValue("ndisNumber")}</Text>
              </View>
            </View>
          </View>

          {/* Section 2: About Me */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. About Me</Text>

            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>My Story:</Text>
              <Text style={styles.longAnswerValue}>
                {getValue("myStory") || "No information provided"}
              </Text>
            </View>

            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>My Strengths:</Text>
              <Text style={styles.longAnswerValue}>
                {getValue("strengths") || "No information provided"}
              </Text>
            </View>

            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>My Challenges:</Text>
              <Text style={styles.longAnswerValue}>
                {getValue("challenges") || "No information provided"}
              </Text>
            </View>
          </View>

          {/* Section 3: Goals (DYNAMIC 1-10 goals) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Goals</Text>

            {goals.length > 0 ? (
              goals.map((goal, index) => (
                <View key={index} style={styles.goalCard} wrap={false}>
                  <View style={styles.goalHeader}>
                    <Text style={styles.goalTitle}>Goal {goal.number}</Text>
                    <Text style={styles.outcomeRating}>{goal.rating}</Text>
                  </View>

                  <View style={styles.goalDescription}>
                    <Text style={styles.goalDescriptionLabel}>
                      Goal Description:
                    </Text>
                    <Text style={styles.goalDescriptionValue}>{goal.goal}</Text>
                  </View>

                  <View style={styles.goalDescription}>
                    <Text style={styles.goalDescriptionLabel}>
                      Actions & Resources:
                    </Text>
                    <Text style={styles.goalDescriptionValue}>
                      {goal.actions}
                    </Text>
                  </View>

                  <Text style={styles.goalDescriptionLabel}>
                    By Whom: {goal.byWhom}
                  </Text>
                  <Text style={styles.goalDescriptionLabel}>
                    By When: {formatDate(goal.byWhen) || "Not specified"}
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.longAnswer}>
                <Text style={styles.longAnswerValue}>
                  No goals have been set yet.
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Fixed footer */}
        <View style={styles.footer} fixed>
          <Text>{settings?.email || ""}</Text>
          <Text>{settings?.formId || ""}</Text>
          <Text>Date: {formatDate(settings?.date)}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PersonCentredPlanPDF;
```

---

## Troubleshooting Guide

### Problem: Content Gets Cut Off

**Symptoms:**

- Text disappears mid-sentence
- Content not visible at bottom of page

**Solutions:**

```typescript
// 1. Remove fixed heights
// ❌ BAD
style={{ height: 200 }}

// ✅ GOOD
style={{ minHeight: 200 }}

// 2. Increase page padding
paddingBottom: 60  // More space before footer

// 3. Check for overflow hidden
// React PDF doesn't support overflow: hidden
// Remove any such styles
```

### Problem: Blank Pages Appearing

**Symptoms:**

- Empty pages between content
- Last page is blank

**Solutions:**

```typescript
// 1. Check for excessive spacing
marginBottom: 20; // Not 100+

// 2. Remove forced breaks
// Remove: <View break>

// 3. Conditional rendering for last items
{
  index < items.length - 1 && <View style={styles.spacing} />;
}

// 4. Check for empty sections
{
  section.content && section.content.trim() && (
    <View style={styles.section}>
      <Text>{section.content}</Text>
    </View>
  );
}
```

### Problem: Content Overlapping

**Symptoms:**

- Text overlaps with header/footer
- Elements appear on top of each other

**Solutions:**

```typescript
// 1. Ensure proper padding for fixed elements
const styles = StyleSheet.create({
  page: {
    padding: 30,
    paddingTop: 100, // Space for fixed header
    paddingBottom: 60, // Space for fixed footer
  },
  header: {
    position: "absolute",
    top: 20,
    // ...
  },
  footer: {
    position: "absolute",
    bottom: 20,
    // ...
  },
});

// 2. Avoid position: absolute unless necessary
// 3. Use flexbox for layout instead
```

### Problem: Page Breaks in Wrong Places

**Symptoms:**

- Tables split mid-row
- Headers separated from content
- Cards/boxes split across pages

**Solutions:**

```typescript
// 1. Use wrap={false} on units that should stay together
<View wrap={false}>
  <Text style={styles.title}>Section Title</Text>
  <Text style={styles.content}>First paragraph...</Text>
</View>

// 2. Keep related content together
<View wrap={false}>
  <View style={styles.header}>
    <Text>Header</Text>
  </View>
  <View style={styles.content}>
    <Text>Related content</Text>
  </View>
</View>

// 3. Allow long content to split naturally
<View wrap={true}>
  <Text>{veryLongText}</Text>
</View>
```

### Problem: Performance Issues

**Symptoms:**

- Slow PDF generation
- High memory usage
- Timeouts

**Solutions:**

```typescript
// 1. Optimize images
// - Compress before using
// - Use appropriate dimensions
// - Consider using PNG instead of JPEG for logos

// 2. Limit dynamic content
const MAX_ITEMS = 1000;
const limitedItems = items.slice(0, MAX_ITEMS);

// 3. Use pagination for large datasets
const ITEMS_PER_PAGE = 50;
const pages = Math.ceil(items.length / ITEMS_PER_PAGE);

// 4. Render asynchronously on server
import { renderToBuffer } from "@react-pdf/renderer";

const buffer = await renderToBuffer(<MyPDF />);
```

---

## Best Practices Summary

### ✅ DO:

1. Use single `<Page>` component and let React PDF handle pagination
2. Use `wrap={false}` on components that should stay together
3. Use `minHeight` instead of fixed `height`
4. Use `fixed` prop for headers/footers
5. Test with various data sizes (small, medium, large)
6. Use proper padding to avoid overlap with fixed elements
7. Validate data before rendering
8. Handle empty/null values gracefully
9. Compress images before using
10. Use TypeScript for type safety

### ❌ DON'T:

1. Create multiple `<Page>` components for unknown content length
2. Use fixed heights on content containers
3. Use `overflow: hidden` or similar unsupported CSS
4. Forget to handle empty data scenarios
5. Use very large images without optimization
6. Nest too many `wrap={false}` components (causes blank pages)
7. Use complex CSS that React PDF doesn't support
8. Forget to test with edge cases (no data, lots of data)

---

## Next.js Server-Side Generation Example

```typescript
// app/api/generate-pdf/route.ts
import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import MyPDF from "@/components/pdf/MyPDF";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");

    // Fetch data
    const data = await fetchDataFromDatabase(id);

    // Generate PDF
    const pdfDoc = <MyPDF data={data} />;
    const pdfBuffer = await renderToBuffer(pdfDoc);

    // Return as downloadable file
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="report-${id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
```

---

## Conclusion

This guide covers 100% of the common issues and patterns you'll encounter with React PDF:

1. ✅ **Dynamic Pages**: Use single Page component with natural flow
2. ✅ **Page Breaks**: Strategic use of `wrap` prop
3. ✅ **Overflow Issues**: Avoid fixed heights, use minHeight
4. ✅ **Height Calculations**: Use estimation functions for special cases
5. ✅ **Blank Pages**: Conditional spacing, proper break logic
6. ✅ **Space Optimization**: Compact styles, efficient layouts
7. ✅ **Advanced Patterns**: Dynamic content, tables, forms

**Key Takeaway**: Let React PDF handle pagination automatically. Your job is to provide well-structured components with appropriate `wrap` props, and React PDF will do the rest.

---

## Additional Resources

- Official Docs: https://react-pdf.org/
- Examples: https://react-pdf.org/repl
- GitHub: https://github.com/diegomura/react-pdf
- Community: https://github.com/diegomura/react-pdf/discussions

---

**Created for your project** | Based on production code from `client-infinity-supports`
