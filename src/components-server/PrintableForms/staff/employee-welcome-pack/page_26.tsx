import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  subsection: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 8,
  },
  paragraph: {
    fontSize: 11,
    lineHeight: 1.6,
    marginBottom: 10,
    textAlign: 'justify',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#d1d5db',
    padding: 6,
    fontWeight: 'bold',
    fontSize: 11,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #e5e7eb',
    padding: 6,
    fontSize: 10,
  },
  tableCol1: {
    width: '70%',
  },
  tableCol2: {
    width: '30%',
  },
});

const Page26: React.FC = () => {
  return (
    <View>
      <Text style={styles.subsection}>Step 2: Submit a 5-business day form:</Text>
      
      <Text style={styles.paragraph}>
        this form should be submitted via the "My Reportable Incidents" portal within 5 business days 
        after key management personnel are notified. Some additional information, including the corrective 
        actions, is recorded in this form. any unauthorised use of restrictive practices is recorded by 
        this form.
      </Text>
      
      <Text style={styles.subsection}>Step 3: If required, the final report should be submitted:</Text>
      
      <Text style={styles.paragraph}>
        If this is required, the NDIS Commission will contact the provider and advise the due date for 
        this matter. The final report field will be accessible on the NDIS Commission portal if the 
        provider is required to submit a final report.
      </Text>
      
      {/* Table */}
      <View style={{ marginTop: 10 }}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableCol1}>Reportable incident</Text>
          <Text style={styles.tableCol2}>Required timeframe</Text>
        </View>
        
        <View style={styles.tableRow}>
          <Text style={styles.tableCol1}>death of a person with disability</Text>
          <Text style={styles.tableCol2}>24 hours</Text>
        </View>
        
        <View style={styles.tableRow}>
          <Text style={styles.tableCol1}>serious injury of a person with disability</Text>
          <Text style={styles.tableCol2}>24 hours</Text>
        </View>
        
        <View style={styles.tableRow}>
          <Text style={styles.tableCol1}>abuse or neglect of a person with disability</Text>
          <Text style={styles.tableCol2}>24 hours</Text>
        </View>
        
        <View style={styles.tableRow}>
          <Text style={styles.tableCol1}>
            unlawful sexual or physical contact with, or assault of, a person with disability
          </Text>
          <Text style={styles.tableCol2}>24 hours</Text>
        </View>
        
        <View style={styles.tableRow}>
          <Text style={styles.tableCol1}>
            sexual misconduct committed against, or in the presence of, a person with disability, 
            including grooming of the person for sexual activity
          </Text>
          <Text style={styles.tableCol2}>24 hours</Text>
        </View>
      </View>
    </View>
  );
};

export default Page26;

