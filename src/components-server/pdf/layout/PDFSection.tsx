import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PDF_FONT_SIZES, PDF_SPACING, PDF_LINE_HEIGHTS, PDF_COLORS, PDF_FONT_FAMILY_BOLD } from '../styles/commonPDFStyles';

interface PDFSectionProps {
  title: string;
  wrap?: boolean;
  children: React.ReactNode;
  marginBottom?: number;
}

const PDFSection: React.FC<PDFSectionProps> = ({ title, wrap = true, children, marginBottom }) => {
  return (
    <View style={[styles.section, marginBottom ? { marginBottom } : {}]} wrap={wrap}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    width: '100%',
    marginBottom: PDF_SPACING.sectionMarginBottom,
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
});

export default PDFSection;
