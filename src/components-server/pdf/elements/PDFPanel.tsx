import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

interface PDFPanelProps {
  title?: string;
  children: React.ReactNode;
  padding?: number;
}

const PDFPanel: React.FC<PDFPanelProps> = ({ title, children, padding = 10 }) => (
  <View style={[styles.panel, { padding }]}> 
    {title && <Text style={styles.title}>{title}</Text>}
    <View style={styles.body}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  panel: {
    border: '1 solid #d1d5db',
    borderRadius: 4,
    marginTop: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  body: {
    width: '100%',
  },
});

export default PDFPanel;
