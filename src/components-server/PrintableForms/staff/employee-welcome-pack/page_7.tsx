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

const Page7: React.FC = () => {
  return (
    <View>
      {/* Section 1: Introduction */}
      <Text style={styles.section}>1. Introduction</Text>
      
      <Text style={styles.subsection}>1.1 Welcome</Text>
      <Text style={styles.paragraph}>
        Infinity Supports WA (the Employer) would like to wish you every success during your 
        employment, whether you recently joined or whether you are an existing employee. It is 
        hoped that your experience of working with us is positive and rewarding.
      </Text>
      
      <Text style={styles.subsection}>1.2 Purpose of this Employee Handbook</Text>
      <Text style={styles.paragraph}>
        The Employee Handbook (Employee Handbook) sets out the Employer's rules and regulations, 
        the policies and procedures relating to your employment and contains information on your 
        benefits and protections. If you require any clarification or additional information, please 
        speak to your manager. All employees are required to comply with the Employee Handbook. 
        Therefore, we ask that you read the content carefully as you may be subject to appropriate 
        disciplinary action (up to an including termination) if you breach the Employee Handbook.
      </Text>
      
      <Text style={styles.subsection}>1.3 Principle of Equality</Text>
      <Text style={styles.paragraph}>
        The Employer is committed to providing equal opportunities and the principle of equality in 
        accordance with relevant legislative provisions. We are confident that you share our commitment 
        in implementing these policies. We will not tolerate any unlawful discriminatory act or attitude 
        in the course of your employment or in your dealings with our clients, suppliers, contractors, 
        members of the public or fellow colleagues. Acts of unlawful discrimination, harassment or 
        victimisation will result in disciplinary action.
      </Text>
      
      <Text style={styles.subsection}>1.4 General</Text>
    </View>
  );
};

export default Page7;

