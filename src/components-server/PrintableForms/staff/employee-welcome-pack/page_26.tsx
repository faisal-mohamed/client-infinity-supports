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
  tableContainer: {
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#000000',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#d1d5db',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    padding: 8,
    fontWeight: 'bold',
    fontSize: 11,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 8,
    fontSize: 10,
    minHeight: 30,
  },
  tableCol1: {
    width: '70%',
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },
  tableCol2: {
    width: '30%',
    paddingLeft: 8,
    textAlign: 'center',
  },
  headerCol1: {
    width: '70%',
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: '#000000',
  },
  headerCol2: {
    width: '30%',
    paddingLeft: 8,
    textAlign: 'center',
  },
  redText: {
    fontSize: 11,
    color: '#dc2626',
    lineHeight: 1.6,
    marginTop: 10,
    textAlign: 'justify',
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
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCol1}>Reportable incident</Text>
          <Text style={styles.headerCol2}>Required timeframe</Text>
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
        
        <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.tableCol1}>
            the use of a restrictive practice in relation to a person with disability if the use is not 
            in accordance with a required state or territory authorisation and/or not in accordance with 
            a behaviour support plan
          </Text>
          <Text style={styles.tableCol2}>Five business days</Text>
        </View>
      </View>
      
      <Text style={styles.redText}>
        Incident and Hazard reporting is to be completed on shiftcare. Infinity Supports WA instructs all 
        its staff to report all incidents and hazards irrespective of their levels of severity. This helps 
        in ensuring appropriate measures are put in place to minimize occurrences of such incidents.
      </Text>
    </View>
  );
};

export default Page26;

