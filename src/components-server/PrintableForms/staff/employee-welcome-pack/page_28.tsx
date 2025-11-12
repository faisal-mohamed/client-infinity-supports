import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 11,
    lineHeight: 1.6,
    marginBottom: 10,
    textAlign: 'justify',
  },
  listItem: {
    fontSize: 11,
    lineHeight: 1.6,
    marginBottom: 6,
    paddingLeft: 15,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #e5e7eb',
    padding: 6,
    marginBottom: 4,
  },
  tableLabel: {
    width: '25%',
    fontSize: 11,
    fontWeight: 'bold',
  },
  tableContent: {
    width: '75%',
    fontSize: 11,
  },
});

const Page28: React.FC = () => {
  return (
    <View>
      <Text style={styles.paragraph}>
        You can make a complaint regarding our services, or a Staff provided to work with you. If you do 
        not feel comfortable making a complaint, someone else can do this on your behalf, including:
      </Text>
      
      <Text style={styles.listItem}>• an advocate</Text>
      <Text style={styles.listItem}>• a family member</Text>
      <Text style={styles.listItem}>• a close friend</Text>
      <Text style={styles.listItem}>• your care worker</Text>
      <Text style={styles.listItem}>• a person you know and trust.</Text>
      
      <Text style={styles.paragraph}>
        You can complain about your services and supports when:
      </Text>
      
      <Text style={styles.listItem}>• something has gone wrong</Text>
      <Text style={styles.listItem}>• something is not working well</Text>
      <Text style={styles.listItem}>• something has not been done the right way</Text>
      <Text style={styles.listItem}>• something makes you unhappy</Text>
      <Text style={styles.listItem}>• you have been treated badly.</Text>
      
      <Text style={{ ...styles.paragraph, marginTop: 10 }}>
        Please send your complaints addressed to the Complaint Manager via any of the below means:
      </Text>
      
      {/* Email */}
      <View style={styles.tableRow}>
        <Text style={styles.tableLabel}>Email:</Text>
        <Text style={styles.tableContent}>admin@infinitysupportswa.org</Text>
      </View>
      
      {/* Postal address */}
      <View style={styles.tableRow}>
        <Text style={styles.tableLabel}>Postal address:</Text>
        <View style={styles.tableContent}>
          <Text style={styles.listItem}>
            • Complete Form02 Complaint Report Form should you wish to remain anonymous do not fill in 
            the participant details and mail it to PO BOX 4275, Baldivis 6171
          </Text>
        </View>
      </View>
      
      {/* Phone */}
      <View style={styles.tableRow}>
        <Text style={styles.tableLabel}>Phone</Text>
        <View style={styles.tableContent}>
          <Text style={styles.listItem}>• Speak to your support worker or coordinator</Text>
          <Text style={styles.listItem}>• Call us on 0493282661 or 0493141688</Text>
          <Text style={{ fontSize: 10, paddingLeft: 15 }}>(Monday to Friday 8.30 am to 4.30pm)</Text>
        </View>
      </View>
      
      {/* Website */}
      <View style={styles.tableRow}>
        <Text style={styles.tableLabel}>Website</Text>
        <View style={styles.tableContent}>
          <Text style={styles.listItem}>
            • visit our website and complete an online complaint/feedback form.
          </Text>
          <Text style={{ fontSize: 10, paddingLeft: 15 }}>
            https://infinitysupportswa.org/feedback-and-complaints/
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Page28;

