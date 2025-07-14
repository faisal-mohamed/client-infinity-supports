# A4 Page Implementation for Person Centred Plan

## Overview
All page components in the Person Centred Plan have been updated to fit standard A4 dimensions (210mm x 297mm) while preserving their original design and functionality.

## Changes Made

### 1. A4PageWrapper Component
- **File**: `A4PageWrapper.tsx`
- **Purpose**: Wraps each page component with proper A4 dimensions
- **Features**:
  - Standard A4 size: 210mm x 297mm
  - 15mm margins (standard document margins)
  - Scale factor of 0.75 for better screen viewing
  - Print-optimized styling
  - Shadow and border for visual separation

### 2. Updated Page Components

#### Page 1 (Cover Page)
- **File**: `page_1.tsx`
- **Changes**:
  - Wrapped with A4PageWrapper
  - Adjusted logo size (h-16 instead of h-20)
  - Optimized image sizing (65% max-width, 60% max-height)
  - Added border-top to footer for better separation

#### Page 2 (Personal Information Table)
- **File**: `page_2.tsx`
- **Changes**:
  - Wrapped with A4PageWrapper
  - Reduced logo size for better space utilization
  - Optimized table cell sizing (30% width for labels)
  - Smaller font sizes (text-xs) for better fit
  - Added background color to label cells for better readability

#### Page 3 (Health Information Table)
- **File**: `page_3.tsx`
- **Changes**:
  - Wrapped with A4PageWrapper
  - Adjusted label column width (35%)
  - Optimized checkbox and text rendering
  - Improved spacing and typography

#### Page 4 (Goals Table)
- **File**: `page_4.tsx`
- **Changes**:
  - Wrapped with A4PageWrapper
  - Compact table design with smaller fonts
  - Minimum height for table cells (40px)
  - Better column distribution
  - Optimized header styling

#### Page 5 (Support Information)
- **File**: `page_5.tsx`
- **Changes**:
  - Wrapped with A4PageWrapper
  - Two-table layout optimized for A4
  - Flexible spacer for proper content distribution
  - Compact text and table styling
  - Proper spacing between sections

### 3. Main Container Update
- **File**: `page.tsx`
- **Changes**:
  - Added gray background for better page separation
  - Padding for visual spacing between pages
  - Each page now renders as a separate A4 document

### 4. Print Styles
- **File**: `print-styles.css`
- **Features**:
  - A4 page setup with proper margins
  - Page break controls
  - Print-specific styling
  - Color and shadow adjustments for print
  - Table break prevention

## Key Features

### Screen Display
- **Scale Factor**: 0.75 for comfortable viewing
- **Visual Separation**: Shadows and borders between pages
- **Responsive**: Maintains aspect ratio on different screen sizes
- **Preview**: Accurate representation of print output

### Print Output
- **Standard A4**: 210mm x 297mm pages
- **Proper Margins**: 15mm on all sides
- **Page Breaks**: Each page prints separately
- **Color Accuracy**: Maintains design colors in print
- **Table Integrity**: Tables don't break across pages

### Design Preservation
- **Original Layout**: All original design elements maintained
- **Typography**: Font sizes optimized for A4 without losing readability
- **Spacing**: Proper spacing maintained within A4 constraints
- **Images**: Logos and graphics properly sized and positioned

## Usage

### Viewing
```tsx
import PersonCentredPlan from './person_centred_plan/page';

// Component automatically renders all pages in A4 format
<PersonCentredPlan />
```

### Printing
- Use browser's print function (Ctrl+P / Cmd+P)
- Select "More settings" → "Paper size" → "A4"
- Ensure "Print backgrounds" is enabled for full design
- Each page will print on a separate A4 sheet

### Customization
To adjust the scale factor for screen viewing:
```tsx
// In A4PageWrapper.tsx
style={{
  transform: 'scale(0.8)', // Adjust this value (0.5 to 1.0)
}}
```

## Benefits

1. **Professional Output**: Clean, properly formatted A4 documents
2. **Print Ready**: Optimized for physical printing
3. **Consistent Sizing**: All pages follow standard document dimensions
4. **Preserved Design**: Original styling and layout maintained
5. **Flexible**: Easy to adjust scaling and margins
6. **Responsive**: Works well on different screen sizes

## Technical Details

### Dimensions
- **Width**: 210mm (8.27 inches)
- **Height**: 297mm (11.69 inches)
- **Margins**: 15mm (0.59 inches) on all sides
- **Content Area**: 180mm x 267mm

### CSS Classes
- `.a4-page-wrapper`: Main container class
- Print-specific styles in `print-styles.css`
- Responsive scaling for screen display

### Browser Compatibility
- Works in all modern browsers
- Print functionality tested in Chrome, Firefox, Safari, Edge
- CSS Grid and Flexbox for layout stability

The A4 implementation ensures that your Person Centred Plan forms are professional, printable, and maintain their visual integrity across different viewing and printing scenarios.
