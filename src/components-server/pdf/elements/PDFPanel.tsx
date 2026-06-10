import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PDF_FONT_SIZES, PDF_SPACING, PDF_LINE_HEIGHTS, PDF_COLORS, PDF_FONT_FAMILY_BOLD } from '../styles/commonPDFStyles';

interface PDFPanelProps {
  title?: string;
  children: React.ReactNode;
  padding?: number;
}

const PDFPanel: React.FC<PDFPanelProps> = ({ title, children, padding }) => (
  <View style={[styles.panel, padding ? { padding } : {}]}> 
    {title && <Text style={styles.title}>{title}</Text>}
    <View style={styles.body}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  panel: {
    border: `1 solid ${PDF_COLORS.border}`,
    borderRadius: 4,
    marginTop: PDF_SPACING.panelMargin,
    marginBottom: PDF_SPACING.panelMargin,
    padding: PDF_SPACING.panelPadding,
  },
  title: {
    fontSize: PDF_FONT_SIZES.label,
    fontWeight: 'bold',
    fontFamily: PDF_FONT_FAMILY_BOLD,
    marginBottom: 8,
    color: PDF_COLORS.text,
    lineHeight: PDF_LINE_HEIGHTS.label,
  },
  body: {
    width: '100%',
  },
});

export default PDFPanel;
