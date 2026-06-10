import { StyleSheet } from '@react-pdf/renderer';

/**
 * Common PDF Styles for all Staff Forms (excluding Tax and Super Choice forms)
 * 
 * This ensures consistent typography, spacing, and visual clarity across all PDF forms.
 */

// Common Font Settings
export const PDF_FONT_FAMILY = 'Helvetica';
export const PDF_FONT_FAMILY_BOLD = 'Helvetica-Bold';

// Common Font Sizes
export const PDF_FONT_SIZES = {
  title: 14,        // Form titles
  sectionTitle: 12, // Section headers
  label: 10,        // Field labels
  body: 10,         // Body text and field values
  small: 9,         // Small text, footers
  footer: 8,        // Footer text
} as const;

// Common Spacing
export const PDF_SPACING = {
  pagePadding: 30,
  pagePaddingTop: 110,
  pagePaddingBottom: 70,
  sectionMarginBottom: 14,  // Increased from 12
  fieldMarginBottom: 8,      // Increased from 6
  fieldRowGap: 8,            // Increased from 6
  labelMarginBottom: 3,      // Increased from 2
  panelPadding: 12,           // Increased from 10
  panelMargin: 10,            // Increased from 8
} as const;

// Common Line Heights (for better readability and clarity)
export const PDF_LINE_HEIGHTS = {
  title: 1.3,
  sectionTitle: 1.4,
  label: 1.3,
  body: 1.5,        // Increased for better readability
  small: 1.4,
} as const;

// Common Colors
export const PDF_COLORS = {
  text: '#111827',
  textSecondary: '#374151',
  textMuted: '#6b7280',
  border: '#d1d5db',
  borderLight: '#e5e7eb',
  background: '#ffffff',
  backgroundLight: '#f9fafb',
  backgroundSection: '#f3f4f6',
} as const;

// Common Base Styles
export const commonPDFStyles = StyleSheet.create({
  // Page base
  page: {
    flexDirection: 'column',
    backgroundColor: PDF_COLORS.background,
    padding: PDF_SPACING.pagePadding,
    paddingTop: PDF_SPACING.pagePaddingTop,
    paddingBottom: PDF_SPACING.pagePaddingBottom,
    fontFamily: PDF_FONT_FAMILY,
    fontSize: PDF_FONT_SIZES.body,
    lineHeight: PDF_LINE_HEIGHTS.body,
  },
  
  // Typography
  title: {
    fontSize: PDF_FONT_SIZES.title,
    fontWeight: 'bold',
    fontFamily: PDF_FONT_FAMILY_BOLD,
    textAlign: 'center',
    color: PDF_COLORS.text,
    lineHeight: PDF_LINE_HEIGHTS.title,
  },
  
  sectionTitle: {
    fontSize: PDF_FONT_SIZES.sectionTitle,
    fontWeight: 'bold',
    fontFamily: PDF_FONT_FAMILY_BOLD,
    marginBottom: 10,
    color: PDF_COLORS.text,
    backgroundColor: PDF_COLORS.backgroundSection,
    padding: 8,
    borderBottom: `1 solid ${PDF_COLORS.border}`,
    lineHeight: PDF_LINE_HEIGHTS.sectionTitle,
  },
  
  label: {
    fontSize: PDF_FONT_SIZES.label,
    fontWeight: 'bold',
    fontFamily: PDF_FONT_FAMILY_BOLD,
    color: PDF_COLORS.textSecondary,
    marginBottom: PDF_SPACING.labelMarginBottom,
    lineHeight: PDF_LINE_HEIGHTS.label,
  },
  
  value: {
    fontSize: PDF_FONT_SIZES.body,
    color: PDF_COLORS.text,
    borderBottom: `1 solid ${PDF_COLORS.border}`,
    paddingBottom: 4,
    paddingLeft: 4,
    paddingTop: 2,
    lineHeight: PDF_LINE_HEIGHTS.body,
    minHeight: 18, // Ensure consistent height
  },
  
  // Layout
  section: {
    width: '100%',
    marginBottom: PDF_SPACING.sectionMarginBottom,
  },
  
  field: {
    width: '48%',
    marginBottom: PDF_SPACING.fieldMarginBottom,
  },
  
  fieldFullWidth: {
    width: '100%',
    marginBottom: PDF_SPACING.fieldMarginBottom,
  },
  
  row: {
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
    gap: PDF_SPACING.fieldRowGap,
  },
  
  // Footer
  footerText: {
    fontSize: PDF_FONT_SIZES.footer,
    color: PDF_COLORS.textMuted,
    lineHeight: PDF_LINE_HEIGHTS.small,
  },
});

export default commonPDFStyles;

