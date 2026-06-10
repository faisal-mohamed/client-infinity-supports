import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { PDF_FONT_SIZES, PDF_SPACING, PDF_LINE_HEIGHTS, PDF_COLORS, PDF_FONT_FAMILY, PDF_FONT_FAMILY_BOLD } from '../styles/commonPDFStyles';

interface PDFSignatureBlockProps {
  label: string;
  image?: string | null;
  date?: string | null;
}

const PDFSignatureBlock: React.FC<PDFSignatureBlockProps> = ({ label, image, date }) => (
  <View style={styles.container} wrap={false} minPresenceAhead={120}>
    <Text style={styles.label} wrap={false}>{label}</Text>
    <View style={styles.row} wrap={false}>
      <View style={styles.signatureBox}>
        {image ? (
          <Image src={image} style={styles.signatureImage} />
        ) : (
          <Text style={styles.placeholder}>No signature</Text>
        )}
      </View>
      <View style={styles.dateBox}>
        <Text style={styles.dateLabel}>Date:</Text>
        <Text style={styles.dateValue}>{formatDate(date)}</Text>
      </View>
    </View>
  </View>
);

const formatDate = (date?: string | null) => {
  if (!date) return '';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;
    return d.toLocaleDateString('en-AU');
  } catch {
    return date;
  }
};

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
    marginBottom: PDF_SPACING.sectionMarginBottom,
  },
  label: {
    fontSize: PDF_FONT_SIZES.label,
    fontWeight: 'bold',
    fontFamily: PDF_FONT_FAMILY_BOLD,
    marginBottom: 8,
    color: PDF_COLORS.text,
    lineHeight: PDF_LINE_HEIGHTS.label,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  signatureBox: {
    flex: 1,
    border: `1 solid ${PDF_COLORS.border}`,
    borderRadius: 4,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PDF_COLORS.background,
  },
  signatureImage: {
    maxHeight: 55,
    maxWidth: 150,
    objectFit: 'contain',
  },
  placeholder: {
    fontSize: PDF_FONT_SIZES.small,
    color: PDF_COLORS.textMuted,
    fontStyle: 'italic',
    lineHeight: PDF_LINE_HEIGHTS.small,
  },
  dateBox: {
    width: '30%',
    justifyContent: 'center',
  },
  dateLabel: {
    fontSize: PDF_FONT_SIZES.label,
    fontWeight: 'bold',
    fontFamily: PDF_FONT_FAMILY_BOLD,
    marginBottom: PDF_SPACING.labelMarginBottom,
    color: PDF_COLORS.textSecondary,
    lineHeight: PDF_LINE_HEIGHTS.label,
  },
  dateValue: {
    fontSize: PDF_FONT_SIZES.body,
    fontFamily: PDF_FONT_FAMILY,
    color: PDF_COLORS.text,
    borderBottom: `1 solid ${PDF_COLORS.border}`,
    paddingBottom: 4,
    paddingLeft: 4,
    paddingTop: 2,
    lineHeight: PDF_LINE_HEIGHTS.body,
    minHeight: 18,
  },
});

export default PDFSignatureBlock;
