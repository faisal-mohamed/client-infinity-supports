import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';

interface PDFSignatureBlockProps {
  label: string;
  image?: string | null;
  date?: string | null;
}

const PDFSignatureBlock: React.FC<PDFSignatureBlockProps> = ({ label, image, date }) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.row}>
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
    marginTop: 16,
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  signatureBox: {
    flex: 1,
    border: '1 solid #d1d5db',
    borderRadius: 4,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  signatureImage: {
    maxHeight: 50,
    maxWidth: 150,
    objectFit: 'contain',
  },
  placeholder: {
    fontSize: 8,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  dateBox: {
    width: '30%',
    justifyContent: 'center',
  },
  dateLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 9,
    borderBottom: '1 solid #d1d5db',
    paddingBottom: 3,
    paddingLeft: 4,
  },
});

export default PDFSignatureBlock;
