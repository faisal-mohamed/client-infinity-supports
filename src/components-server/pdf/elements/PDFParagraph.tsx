import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PDF_FONT_SIZES, PDF_SPACING, PDF_LINE_HEIGHTS, PDF_COLORS, PDF_FONT_FAMILY, PDF_FONT_FAMILY_BOLD } from '../styles/commonPDFStyles';

interface PDFParagraphProps {
  label: string;
  value?: string | null;
  bordered?: boolean;
}

const PDFParagraph: React.FC<PDFParagraphProps> = ({ label, value, bordered = true }) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    {bordered ? (
      <Text style={styles.bordered}>{value || 'Not provided'}</Text>
    ) : (
      <Text style={styles.plain}>{value || 'Not provided'}</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
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
  bordered: {
    fontSize: PDF_FONT_SIZES.body,
    fontFamily: PDF_FONT_FAMILY,
    color: PDF_COLORS.text,
    paddingVertical: 8,
    paddingHorizontal: 10,
    border: `1 solid ${PDF_COLORS.border}`,
    borderRadius: 4,
    backgroundColor: PDF_COLORS.backgroundLight,
    minHeight: 40,
    lineHeight: PDF_LINE_HEIGHTS.body,
  },
  plain: {
    fontSize: PDF_FONT_SIZES.body,
    fontFamily: PDF_FONT_FAMILY,
    color: PDF_COLORS.text,
    lineHeight: PDF_LINE_HEIGHTS.body,
  },
});

export default PDFParagraph;
