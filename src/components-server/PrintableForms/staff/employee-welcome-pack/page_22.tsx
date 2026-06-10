import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  section: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 12,
  },
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
});

const Page22: React.FC = () => {
  return (
    <View>
      <Text style={styles.paragraph}>
        In exceptional circumstances, suspension from work without pay for up to five days as an 
        alternative to termination (except termination for serious misconduct) may be considered by 
        the person authorised to dismiss.
      </Text>
      
      <Text style={styles.paragraph}>
        Serious misconduct offences will result in termination without notice.
      </Text>
      
      <Text style={styles.section}>6 Grievance Procedure</Text>
      
      <Text style={styles.paragraph}>
        It is important that if you feel dissatisfied with any matter relating to your employment you 
        should have an effective means by which to raise such a grievance and, where appropriate, have 
        it resolved.
      </Text>
      
      <Text style={styles.paragraph}>
        Nothing in this procedure is intended to prevent you from informally raising with your manager 
        any matter you may wish to mention. Informal discussion can frequently solve problems without 
        the need for a written record.
      </Text>
      
      <Text style={styles.paragraph}>
        However, if you wish to raise a formal grievance you should normally do so in writing from the 
        outset. If you feel aggrieved at any matter relating to your work (except harassment, for which 
        there is a separate procedure) you should first raise the matter with your manager, explaining 
        fully the nature and extent of your grievance. You will then be invited to a meeting at a 
        reasonable time and location at which your grievance will be investigated fully. You must take 
        all reasonable steps to attend this meeting. You will be notified of the decision, in writing, 
        normally within ten working days of the meeting.
      </Text>
      
      <Text style={styles.section}>7 Incident Management</Text>
      
      <Text style={styles.paragraph}>
        While we hope that an incident reporting does not occur, in the event it does, we are prepared 
        to support and assist you by following procedures that appropriately deal with a critical Incident.
      </Text>
      
      <Text style={styles.paragraph}>
        An incident is classified as an event (or alleged event) that occurs because of, or during, the 
        delivery of services and has caused, or is likely to cause, a significant negative impact on 
        your health, safety or wellbeing.
      </Text>
      
      <Text style={styles.paragraph}>
        If an incident does occur, we will engage the required authorities to support you during this time.
      </Text>
    </View>
  );
};

export default Page22;

