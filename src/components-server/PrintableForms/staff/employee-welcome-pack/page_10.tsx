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
    paddingLeft: 20,
  },
  redItalic: {
    fontSize: 11,
    lineHeight: 1.6,
    marginBottom: 10,
    color: '#dc2626',
    fontStyle: 'italic',
  },
});

const Page10: React.FC = () => {
  return (
    <View>
      <Text style={styles.subsection}>3.3 Hours of Work</Text>
      <Text style={styles.paragraph}>
        Your regular ordinary hours will be worked in accordance with Appendix A of your contract. 
        The Employer reserves the right to change the roster and will give you written notice at any 
        time. You may from time to time be requested to work additional hours, which may be required 
        to be performed on afternoons, evenings, night shift, weekends or public holidays.
      </Text>
      
      <Text style={styles.subsection}>3.4 Punctuality</Text>
      <Text style={styles.paragraph}>
        You are required to be present at your workplace and ready to commence work at least five 
        minutes before your rostered starting time. Lack of punctuality is a serious performance issue. 
        All staff are required to clock in and out of shifts at the correct time and geographical 
        location on shiftcare. Management reserve the right to cross check these matters on a regular 
        basis and failure to comply with these expectations will lead to disciplinary action. Staff are 
        also expected to complete their shift notes in a timely and consistent manner before or 
        immediately after their shift. Failure to complete shift reports will lead to disciplinary action.
      </Text>
      
      <Text style={styles.subsection}>3.5 Employee Training</Text>
      <Text style={styles.paragraph}>
        On commencement of your employment with us, you will be given the training that is necessary 
        to undertake your job. As your employment with the employer progresses, your role may expand 
        to cover new activities. You are expected to undertake any training that is considered necessary 
        to enable you to perform your role to the required standard.
      </Text>
      
      {/* Mandatory Learning Modules */}
      <Text style={{ ...styles.paragraph, fontWeight: 'bold', marginTop: 8 }}>
        Mandatory Learning Modules for new disability workers induction:
      </Text>
      
      <Text style={styles.listItem}>a. NDIS worker orientation Module</Text>
      <Text style={styles.listItem}>b. NDIS worker induction modules</Text>
      <Text style={styles.listItem}>c. NDIS supporting effective communication module</Text>
      <Text style={styles.listItem}>d. NDIS supporting safe and enjoyable meals training</Text>
      <Text style={styles.listItem}>e. DSC Safe waste management training</Text>
      <Text style={styles.listItem}>f. DSC Supporting people to stay infection free training</Text>
      <Text style={styles.listItem}>g. Hand Hygiene training</Text>
    </View>
  );
};

export default Page10;

