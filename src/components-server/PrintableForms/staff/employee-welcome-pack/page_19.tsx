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
    
      
      <Text style={styles.subsection}>5.2 Disciplinary Rules</Text>
      
      <Text style={styles.paragraph}>
      It is not practicable to specify all disciplinary rules or offences that may result in disciplinary action, as they may vary depending 
      on the nature of the work. In addition to the specific examples of unsatisfactory conduct, misconduct and serious misconduct shown 
      in this policy, a breach of other specific conditions, procedures and practices set out elsewhere in this Employee Handbook or that 
      have otherwise been made known to you, will also result in this procedure being used to deal with such. 

      </Text>
      
      <Text style={styles.subsection}>5.3 Rules Covering Unsatisfactory Conduct and Misconduct</Text>
      
      <Text style={styles.paragraph}>
      You will be liable to disciplinary action if you are found to have acted in any of the following ways: 
      </Text>
      
      <Text style={styles.listItem}>
        • Failure to abide by the Employer's health and safety policies and procedures and general 
        health and safety responsibilities.
      </Text>
      
      <Text style={styles.listItem}>
        • Actions which could threaten the health and safety of yourself, your colleagues or others; 


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

