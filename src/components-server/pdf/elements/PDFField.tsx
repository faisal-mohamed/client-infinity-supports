import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PDF_FONT_SIZES, PDF_SPACING, PDF_LINE_HEIGHTS, PDF_COLORS, PDF_FONT_FAMILY, PDF_FONT_FAMILY_BOLD } from '../styles/commonPDFStyles';

interface PDFFieldProps {
  label: string;
  value?: string | null;
  fullWidth?: boolean;
}

export const PDFField: React.FC<PDFFieldProps> = ({ label, value, fullWidth = false }) => {
  const fieldStyles = [styles.field];
  if (fullWidth) {
    fieldStyles.push(styles.fullWidth);
  }

  return (
    <View style={fieldStyles}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value || ''}</Text>
    </View>
  );
};

export const PDFFieldRow: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap }) => (
  <View style={[styles.row, gap ? { gap } : {}]}>{children}</View>
);

export const PDFFieldFullWidth: React.FC<PDFFieldProps> = (props) => (
  <PDFField {...props} fullWidth />
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
    gap: PDF_SPACING.fieldRowGap,
  },
  field: {
    width: '48%',
    marginBottom: PDF_SPACING.fieldMarginBottom,
  },
  fullWidth: {
    width: '100%',
    marginBottom: PDF_SPACING.fieldMarginBottom,
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
    fontFamily: PDF_FONT_FAMILY,
    color: PDF_COLORS.text,
    borderBottom: `1 solid ${PDF_COLORS.border}`,
    paddingBottom: 4,
    paddingLeft: 4,
    paddingTop: 2,
    lineHeight: PDF_LINE_HEIGHTS.body,
    minHeight: 18, // Ensure consistent height for better visual clarity
  },
});

export default PDFField;
