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
        the form of a formal verbal warning, a written warning or a final written warning. Such warnings 
        will set out the nature of the misconduct, the change in behaviour required and the right of 
        appeal. The employee will be advised that a final written warning may result in termination if 
        there is no satisfactory improvement.
      </Text>
      
      <Text style={styles.paragraph}>
        In particularly serious cases, we reserve the right to move directly to a first and final 
        written warning where warranted by poor performance or conduct. This is not applicable to 
        summary termination, which means instant dismissal without any previous warnings.
      </Text>
      
      <Text style={styles.paragraph}>
        Where it is considered appropriate by the Employer, bypassing the progressive steps of the 
        disciplinary procedure will be in circumstances where a policy of the Employer has been breached, 
        but the breach is not of a sufficiently serious nature to warrant instant termination.
      </Text>
      
      <Text style={styles.paragraph}>
        Warnings are issued for misconduct and, should there be a further breach of standards (either 
        similar or independent of the original misconduct) during the period in which a warning is 
        considered 'live', the Employer will continue with the disciplinary action resulting in 
        termination where there is no change in behaviour.
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

