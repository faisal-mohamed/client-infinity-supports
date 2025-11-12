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
  listItem: {
    fontSize: 9,
    lineHeight: 1.4,
    marginBottom: 3,
    paddingLeft: 10,
  },
  subListItem: {
    fontSize: 9,
    lineHeight: 1.4,
    marginBottom: 2,
    paddingLeft: 24,
  },
});

const Page4: React.FC = () => {
  return (
    <View>
      {/* Experience, Qualifications and Skills */}
      <Text style={styles.sectionHeader}>Experience, Qualifications and Skills</Text>
      <View style={styles.contentBox}>
        <Text style={styles.listItem}>• Maintain current Australian driver's license.</Text>
        <Text style={styles.listItem}>• A current first aid and CPR certification</Text>
        <Text style={styles.listItem}>• Medication Competency (Desirable)</Text>
        <Text style={styles.listItem}>• Manual Handling Training (Desirable)</Text>
        <Text style={styles.listItem}>• NDIS worker's screening</Text>
        <Text style={styles.listItem}>• Working with children check</Text>
        <Text style={styles.listItem}>
          • Australian citizenship or visa with legal right to work in Australia.
        </Text>
        <Text style={styles.listItem}>• Car with current registration and comprehensive insurance</Text>
        <Text style={styles.listItem}>• NDIS Online Trainings:</Text>
        <Text style={styles.subListItem}>• NDIS worker orientation module</Text>
        <Text style={styles.subListItem}>• NDIS worker induction modules</Text>
        <Text style={styles.subListItem}>• NDIS supporting effective communication training.</Text>
        <Text style={styles.subListItem}>• NDIS supporting safe and enjoyable meal training.</Text>
        <Text style={styles.listItem}>• Safe waste management training</Text>
        <Text style={styles.listItem}>• Infection control training</Text>
        <Text style={styles.listItem}>• COVID Vaccination including third/booster dose.</Text>
        <Text style={styles.listItem}>• Behaviour support training</Text>
        <Text style={styles.listItem}>• Seizure training</Text>
      </View>

      {/* Key Requirements & Attributes */}
      <Text style={styles.sectionHeader}>Key Requirements & Attributes</Text>
      <View style={styles.contentBox}>
        <Text style={styles.listItem}>
          • Ability to adapt to different environments and cultures, demonstrating flexibility and a 
          passion for providing a high level of care to the client.
        </Text>
        <Text style={styles.listItem}>
          • Understanding of services offered and systems to follow.
        </Text>
        <Text style={styles.listItem}>
          • Ability to make sound decisions under pressure and de-escalate crises.
        </Text>
        <Text style={styles.listItem}>
          • Excellent interpersonal and listening skills with evidence of empathy, tact and patience 
          towards others.
        </Text>
        <Text style={styles.listItem}>• Critical thinking and complex problem-solving skills</Text>
        <Text style={styles.listItem}>
          • Emerging knowledge of the local area and health services and other community services.
        </Text>
      </View>

    </View>
  );
};

export default Page4;

