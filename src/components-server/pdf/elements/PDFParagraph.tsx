import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

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
    marginBottom: 10,
  },
  label: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  bordered: {
    fontSize: 9,
    color: '#111827',
    paddingVertical: 6,
    paddingHorizontal: 8,
    border: '1 solid #d1d5db',
    borderRadius: 4,
    backgroundColor: '#f9fafb',
    minHeight: 36,
    lineHeight: 1.4,
  },
  plain: {
    fontSize: 9,
    color: '#111827',
    lineHeight: 1.6,
  },
});

export default PDFParagraph;
