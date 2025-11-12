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
        Serious misconduct is particularly important because it may lead to termination without notice, 
        even without any previous warning being issued. It is not possible to provide an exhaustive 
        list of examples of serious misconduct. However, serious misconduct is generally defined as any 
        behaviour or negligence that results in a fundamental breach of your contractual terms and that 
        irrevocably destroys the trust and confidence necessary to continue the employment relationship.
      </Text>
      
      <Text style={styles.paragraph}>
        Examples of actions that will normally be regarded as serious misconduct are:
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
        1st occasion - Formal verbal warning{'\n'}
        2nd occasion - Written warning{'\n'}
        3rd occasion - Final written warning{'\n'}
        Unsatisfactory conduct - Termination
      </Text>
      
      <Text style={styles.paragraph}>
        We retain discretion to vary these procedures as appropriate and to determine the number of 
        warnings given, depending on your length of service and the severity of the misconduct.
      </Text>
      
      <Text style={styles.paragraph}>
        If you have a short amount of service with us, you may not receive warnings before we terminate 
        your employment. However, you will retain the right to a disciplinary hearing.
      </Text>
      
      <Text style={styles.paragraph}>
        If a disciplinary penalty is imposed it will be in
      </Text>
    </View>
  );
};

export default Page20;

