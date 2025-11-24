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

const Page20: React.FC = () => {
  return (
    <View>
      <Text style={styles.subsection}>5.4 Serious Misconduct</Text>
      
      <Text style={styles.paragraph}>
      Occurrences of serious misconduct are significant because the penalty may be termination without notice, 
      even without any previous warning being issued. It is not possible to provide an exhaustive list of examples of serious misconduct. 
      However, any behaviour or negligence resulting in a fundamental breach of your contractual terms that irrevocably destroys
       the trust and confidence necessary to continue the employment relationship will constitute serious misconduct. 
       Examples of offences that will normally be considered to be serious misconduct include serious instances of: 
      </Text>
      
    
      <Text style={styles.listItem}>• theft or fraud;</Text>
      <Text style={styles.listItem}>• physical violence or bullying;</Text>
      <Text style={styles.listItem}>• deliberate damage to property;</Text>
      <Text style={styles.listItem}>• deliberate acts of unlawful discrimination or harassment;</Text>
      <Text style={styles.listItem}>
        • possession, or being under the influence, of illegal drugs at work;
      </Text>
      <Text style={styles.listItem}>
        • breach of the Employer's health and safety policies and procedures and your general health 
        and safety responsibilities or any actions that endangers the lives of, or may cause serious 
        injury to, employees or any other person.
      </Text>
      
      <Text style={styles.subsection}>5.5 Disciplinary Procedure</Text>
      
      <Text style={styles.paragraph}>
      Disciplinary action taken against you may be based on the following procedure:
      </Text>
      
      <Text style={styles.paragraph}>
        Offence{'\n'}
        1st occasion {'\n'}
        2nd occasion {'\n'}
        3rd occasion  {'\n'}
        Unsatisfactory conduct{'\n'}
        Formal verbal warning{'\n'}
        Written warning{'\n'}
        Final written warning{'\n'}
        Termination
      </Text>
      
     
    

    </View>
  );
};

export default Page20;

