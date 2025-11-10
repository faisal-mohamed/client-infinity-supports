import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

interface PDFSectionProps {
  title: string;
  wrap?: boolean;
  children: React.ReactNode;
  marginBottom?: number;
}

const PDFSection: React.FC<PDFSectionProps> = ({ title, wrap = true, children, marginBottom = 12 }) => {
  return (
    <View style={[styles.section, { marginBottom }]} wrap={wrap}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a1a1a',
    backgroundColor: '#f3f4f6',
    padding: 6,
    borderBottom: '1 solid #d1d5db',
  },
});

export default PDFSection;
