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

const Page21: React.FC = () => {
  return (
    <View>
      {/* Continuation from previous page */}
      <Text style={styles.paragraph}>
      We retain discretion in respect of the disciplinary procedures to take account of your length of service and the
       severity of the misconduct to vary the procedures accordingly. If you have a short amount of service, 
       you may not be in receipt of any warnings before termination, but you will retain the right to a disciplinary hearing. 
       If a disciplinary penalty is imposed it will be in line with the procedure outlined above, which may encompass a formal 
       verbal warning, written warning, final written warning, or termination, and full details will be given to you. 
There may be occasions where the performance or conduct of an employee is serious enough to by-pass one of the above 
steps and move immediately to a first and final written warning but not a summary termination. 

      </Text>
      
  
      <Text style={styles.paragraph}>
      This option might be used in circumstances where the Employer’s policy is breached but it is not so serious as
       to warrant instant termination. 
      </Text>
      
      
      <Text style={styles.paragraph}>
      In all cases, warnings will be issued for misconduct, irrespective of the precise matters concerned and any
       further breach of the rules in relation to similar or entirely independent matters of misconduct will be treated as
        further disciplinary matters and allow the continuation of the disciplinary process through to termination if the warnings 
        do not change behaviour. 

      </Text>
      <Text style={styles.subsection}>5.6 Duration of Warnings</Text>
      
      <Text style={styles.paragraph}>
        i) Formal verbal warning – This will be disregarded for disciplinary purposes after a six-month 
        period.
      </Text>
      
      <Text style={styles.paragraph}>
        ii) Written warning – This will be disregarded for disciplinary purposes after a 12-month period.
      </Text>
      
      <Text style={styles.paragraph}>
        iii) Final written warning – This will be disregarded for disciplinary purposes after an 18-month 
        period.
      </Text>
      
      <Text style={styles.subsection}>5.7 General Notes</Text>
      
      <Text style={styles.paragraph}>
        If you are in a supervisory or managerial position then demotion to a lower status at an 
        appropriate rate of pay may be considered as an alternative to termination, except in cases of 
        serious misconduct.
      </Text>
    </View>
  );
};

export default Page21;

