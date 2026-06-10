import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  sectionHeader: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: 8,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 4,
  },
  contentBox: {
    border: '1 solid #d1d5db',
    padding: 10,
    marginBottom: 12,
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    width: 100,
  },
  fieldValue: {
    fontSize: 10,
    flex: 1,
    borderBottom: '1 solid #9ca3af',
    paddingBottom: 2,
  },
  paragraph: {
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 6,
  },
  listItem: {
    fontSize: 9,
    lineHeight: 1.4,
    marginBottom: 3,
    paddingLeft: 10,
  },
});

interface Page1Props {
  data?: any;
}

const Page1: React.FC<Page1Props> = ({ data = {} }) => {
  return (
    <View>
      {/* Position Description */}
      <Text style={styles.sectionHeader}>Position Description</Text>
      <View style={styles.contentBox}>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Position Title:</Text>
          <Text style={styles.fieldValue}>Support Worker</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Business Unit:</Text>
          <Text style={styles.fieldValue}>Service Delivery</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Reports To:</Text>
          <Text style={styles.fieldValue}>Co-ordinator / Director</Text>
        </View>
      </View>

      {/* Purpose */}
      <Text style={styles.sectionHeader}>Purpose</Text>
      <View style={styles.contentBox}>
        <Text style={styles.paragraph}>
          The purpose of a Support Worker is to support clients to live their lives more independently and help them to reach their potential by providing both physical and emotional support.
        </Text>
      </View>
      <Text style={styles.sectionHeader}>Responsibilities and Accountabilities – for the Workplace</Text>
      <View style={styles.contentBox}>
        <Text style={styles.listItem}>
          • Follow company policies including Code of Conduct, Anti-Discrimination, 
          Harassment/Victimisation policies.
        </Text>
        <Text style={styles.listItem}>• Adhere to Workplace Health and Safety.</Text>
        <Text style={styles.listItem}>
          • Ensure all Company Standard Operating Procedures are adhered too.
        </Text>
        <Text style={styles.listItem}>
          • Display a positive attitude and be an active, dependable member of the team.
        </Text>
        <Text style={styles.listItem}>• Lead by example in everything you do.</Text>
        <Text style={styles.listItem}>• Support and treat others with respect.</Text>
        <Text style={styles.listItem}>
          • Always provide constructive feedback in a way that does not blame.
        </Text>
        <Text style={styles.listItem}>• Be accountable for your actions and results.</Text>
        <Text style={styles.listItem}>• Be consistent and speak the truth.</Text>
      </View>

      {/* Responsibilities for Position - Part 1 only */}
      <Text style={styles.sectionHeader}>Responsibilities and Accountabilities – for the Position</Text>
      <View style={styles.contentBox}>
        <Text style={styles.paragraph}>
        The specific duties that you will undertake as a Support Worker will be set and agreed by the person you support or their family. Please refer to the "Support Plan" section of each person's profile for an overview of the duties required by each person you support.
        </Text>
        <Text style={styles.paragraph}>
        You are invited to reach out to people seeking support where the job description, as detailed in the "Support Plan" section, appeals to you.
        </Text>
        <Text style={styles.paragraph}>
        Further verbal and/or written instructions will be provided by the person seeking support or their
         family at the time of meeting. It is the responsibility of the person seeking support or their family
          to explain to you exactly what tasks need to be performed daily.

        </Text>
      </View>
    </View>
  );
};

export default Page1;

