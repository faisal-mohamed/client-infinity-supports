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
      Your regular ordinary hours will generally be worked in accordance with Appendix 
      A (attached to your contract); however the employer may change the roster 
      by providing notice in writing at any time. You may be requested to work reasonable
       additional hours which may include Afternoons, evening, night shift, weekends or 
       public holidays. 
      </Text>
      
      <Text style={styles.subsection}>3.4 Punctuality</Text>
      <Text style={styles.paragraph}>
      You are required to be present and ready to commence work at least five minutes prior
       to your rostered starting time. The Employer considers lack of punctuality a serious 
       performance issue.  All staff are expected to clock in and out of their rostered shifts
        at the right time and at the right geographical location using shiftcare. 
        The management reserves the right to cross check these matters on a regular basis.
         Failure to follow this expectation will result in initiation of disciplinary action.
          It is also expected that all staff complete their shift notes in a prompt and 
          consistent manner prior to completion of their shift or immediately after. 
          Failure to complete shift reports will also result in initiation of disciplinary 
          action.


      </Text>
      
      <Text style={styles.subsection}>3.5 Employee Training</Text>
      <Text style={styles.paragraph}>
      At the commencement of your employment, you will receive any training necessary for
       your specific job. As your employment progresses, your role may be extended to 
       encompass new activities within the Employer’s business. You are expected to 
       participate in any training deemed necessary for you to perform your role at the
        required standards. 

      </Text>
      
      {/* Mandatory Learning Modules */}
      <Text style={{ ...styles.paragraph, fontWeight: 'bold', marginTop: 8 }}>
        Mandatory Learning Modules:
      </Text>
      <Text style={styles.listItem}>These learning modules form part of a suite of learning products that
         new disability workers may complete as part of their induction:</Text>
      
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

