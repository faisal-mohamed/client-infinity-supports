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
  checkmark: {
    fontSize: 11,
    lineHeight: 1.6,
    marginBottom: 8,
    paddingLeft: 15,
  },
  bold: {
    fontWeight: 'bold',
  },
});

const Page25: React.FC = () => {
  return (
    <View>
      <Text style={styles.checkmark}>
        ✓ For an incident to be reportable a certain act or event needs to have happened (or alleged to 
        have happened) in connection with the provision of supports or services by the registered NDIS 
        provider. This includes:
      </Text>
      
      <Text style={styles.listItem}>• The death of a person with disability</Text>
      <Text style={styles.listItem}>• Serious Injury of a person with disability</Text>
      <Text style={styles.listItem}>• Abuse or neglect of a person with disability</Text>
      <Text style={styles.listItem}>
        • Unlawful sexual or physical contact with, or assault of, a person with disability
      </Text>
      <Text style={styles.listItem}>
        • Sexual misconduct, committed against, or in the presence of, a person with disability. Including 
        grooming of the person with disability for sexual activity
      </Text>
      
      <Text style={styles.checkmark}>
        ✓ Infinity Supports WA will submit a notification form via NDIS commission portal within 24 hours, 
        if any above incidents occur.
      </Text>
      
      <Text style={styles.checkmark}>
        ✓ Commissioner shall be provided with the following information within 5 business days after the 
        provider became aware that the incident occurred:
      </Text>
      
      <Text style={styles.listItem}>
        • the names and contact details of any witnesses to the reportable incident
      </Text>
      
      <Text style={styles.listItem}>
        • any further actions proposed to be taken in response to the reportable incident
      </Text>
      
      <Text style={styles.checkmark}>
        ✓ If an unauthorised restrictive practice is used, NDIS should be notified in 5 business days of 
        being notified of the incident. However, the incident should be reported in 24 hours if the incident 
        has resulted in injury to a disabled person.
      </Text>
      
      <Text style={styles.checkmark}>
        ✓ In cases where there is a need for police intervention, even after consideration of the incident, 
        it should be reported as soon as possible. If there is any uncertainty about whether the incident 
        needs to be reported or not, the notifier or approver should contact the NDIS Commission to seek 
        further advice.
      </Text>
      
      <Text style={styles.checkmark}>
        ✓ Infinity Supports WA will also inform:
      </Text>
      
      <Text style={styles.listItem}>
        • Authorities for notifiable work-related injuries, fatalities or dangerous occurrences
      </Text>
      
      <Text style={styles.listItem}>
        • Police if the incident relates to the death of a person
      </Text>
      
      <Text style={styles.checkmark}>
        ✓ Where an Incident is referred to NDIS, the NDIS investigation takes precedence over any 
        organisational process.
      </Text>
      
      <Text style={styles.checkmark}>
        ✓ The progress of the incidents, accidents and near misses will be tracked in incident report form.
      </Text>
    </View>
  );
};

export default Page25;

