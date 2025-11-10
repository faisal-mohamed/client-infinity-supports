import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

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

export const PDFFieldRow: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 6 }) => (
  <View style={[styles.row, { gap }]}>{children}</View>
);

export const PDFFieldFullWidth: React.FC<PDFFieldProps> = (props) => (
  <PDFField {...props} fullWidth />
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
  },
  field: {
    width: '48%',
    marginBottom: 6,
  },
  fullWidth: {
    width: '100%',
    marginBottom: 6,
  },
  label: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 2,
  },
  value: {
    fontSize: 9,
    color: '#111827',
    borderBottom: '1 solid #d1d5db',
    paddingBottom: 3,
    paddingLeft: 4,
  },
});

export default PDFField;
