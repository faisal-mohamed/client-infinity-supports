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
});

const Page19: React.FC = () => {
  return (
    <View>
      <Text style={styles.paragraph}>
        Temporary suspension on contractual pay pending an uninterrupted investigation should not be 
        regarded as disciplinary action or a penalty.
      </Text>
      
      <Text style={styles.subsection}>5.2 Disciplinary Rules</Text>
      
      <Text style={styles.paragraph}>
        It is not practicable to specify all disciplinary rules or offences that may result in 
        disciplinary action, as they may vary depending on the nature of the business. In addition to 
        the specific examples of unsatisfactory conduct, misconduct and serious misconduct set out in 
        this procedure, a breach of other conditions detailed in your Employee Handbook or rules and 
        procedures in force from time to time will result in disciplinary action being taken.
      </Text>
      
      <Text style={styles.subsection}>5.3 Rules Covering Unsatisfactory Conduct and Misconduct</Text>
      
      <Text style={styles.paragraph}>
        The following are examples of matters that will normally give rise to disciplinary action:
      </Text>
      
      <Text style={styles.listItem}>
        • Failure to abide by the Employer's health and safety policies and procedures and general 
        health and safety responsibilities.
      </Text>
      
      <Text style={styles.listItem}>
        • Action, negligence or behaviour likely to result in injury to yourself, a fellow employee or 
        a member of the public.
      </Text>
      
      <Text style={styles.listItem}>
        • Persistent absenteeism and/or lateness.
      </Text>
      
      <Text style={styles.listItem}>
        • Unsatisfactory standards or output of work.
      </Text>
      
      <Text style={styles.listItem}>
        • Rudeness towards customers/clients, members of the public or fellow employees, objectionable 
        or insulting behaviour, harassment, bullying or bad language.
      </Text>
      
      <Text style={styles.listItem}>
        • Failure to devote the whole of your time, attention and abilities to our business and its 
        affairs during your normal working hours.
      </Text>
      
      <Text style={styles.listItem}>
        • Unauthorised use of email, internet and/or social media.
      </Text>
      
      <Text style={styles.listItem}>
        • Failure to carry out all reasonable instructions or follow our rules and procedures.
      </Text>
      
      <Text style={styles.listItem}>
        • Unauthorised use or negligent damage or loss of our property.
      </Text>
      
      <Text style={styles.listItem}>
        • Failure to report immediately any damage to property or premises caused by you.
      </Text>
      
      <Text style={styles.paragraph}>
        This list is not exhaustive.
      </Text>
    </View>
  );
};

export default Page19;

