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
  listItem: {
    fontSize: 11,
    lineHeight: 1.6,
    marginBottom: 6,
    paddingLeft: 15,
  },
  checkmark: {
    fontSize: 11,
    lineHeight: 1.6,
    marginBottom: 6,
    paddingLeft: 15,
  },
});

const Page24: React.FC = () => {
  return (
    <View>
      {/* Continuation from previous page */}
      <Text style={styles.paragraph}>
        individual, enhancing area safety, aiding police investigations, or handling the deceased, site 
        disturbance may occur.)
      </Text>
      
      <Text style={styles.paragraph}>
        The area will be inspected and verified to ensure that no new hazards have arisen while securing it.
      </Text>
      
      <Text style={styles.paragraph}>
        If medical treatment beyond first aid is required, the Safety representative will promptly notify 
        the relevant person via phone or email.
      </Text>
      
      <Text style={styles.paragraph}>
        Any Incidents, including near misses, must be reported to the manager or supervisor using Incident 
        Report, and recorded in our Incident Register.
      </Text>
      
      <Text style={styles.paragraph}>
        In the event of an incident, injury, or illness, Infinity Supports WA will take immediate and 
        appropriate action to minimize the risk of further harm or damage, provided it is safe to do so.
      </Text>
      
      <Text style={styles.subsection}>7.1 Report Notifiable Incident</Text>
      
      <Text style={styles.paragraph}>
        The incident notification process consists of 3 steps. These steps are as follows:
      </Text>
      
      <Text style={styles.subsection}>Step 1: Notify the NDIS Commission:</Text>
      
      <Text style={styles.checkmark}>
        ✓ Safety representative is responsible for reporting incidents that are reportable incidents to 
        the Commissioner. In addition, any key personnel can notify Commissioner of reportable Incidents.
      </Text>
      
      <Text style={styles.checkmark}>
        ✓ A notifiable incident shall be reported as soon as possible. The following information is 
        required to be registered in the incident report form:
      </Text>
      
      <Text style={styles.listItem}>
        • the name and contact details of the registered NDIS provider.
      </Text>
      
      <Text style={styles.listItem}>
        • a description of the reportable incident (a description of the impact on, or harm caused to, 
        the person with disability)
      </Text>
      
      <Text style={styles.listItem}>
        • the immediate actions taken in response to the reportable incident, including actions taken to 
        ensure the health, safety and wellbeing of persons with disability affected by the incident and 
        whether the incident has been reported to police or any other body
      </Text>
      
      <Text style={styles.listItem}>
        • the name and contact details of the person making the notification
      </Text>
      
      <Text style={styles.listItem}>
        • the time, date and place at which the reportable incident occurred (if known)
      </Text>
      
      <Text style={styles.listItem}>
        • the names and contact details of the persons involved in the reportable incident
      </Text>
    </View>
  );
};

export default Page24;

