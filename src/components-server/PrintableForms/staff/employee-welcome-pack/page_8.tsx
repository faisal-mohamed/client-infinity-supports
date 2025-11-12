import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 11,
    lineHeight: 1.6,
    marginBottom: 10,
    textAlign: 'justify',
  },
  redItalic: {
    fontSize: 11,
    lineHeight: 1.6,
    marginBottom: 10,
    color: '#dc2626',
    fontStyle: 'italic',
  },
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
});

const Page8: React.FC = () => {
  return (
    <View>
      {/* General continuation */}
      <Text style={styles.paragraph}>
        Amendments to this Employee Handbook will be issued from time to time. This Employee Handbook 
        does not form part of your contract of employment, unless expressly stated otherwise. However, 
        in any event, the Employee Handbook may be considered when interpreting your rights and 
        obligations under your terms of employment.
      </Text>
      
      {/* Section 2: Code of Conduct */}
      <Text style={styles.section}>2. Code of Conduct</Text>
      
      <Text style={styles.paragraph}>
        The code of conduct will be set in conjunction with employees and reviewed on an annual basis.
      </Text>
      
      <Text style={styles.paragraph}>
        The Approved Provider, Managers, Support Staff, volunteers, and students will always uphold 
        the following ethical conduct principles and promote positive Interactions within our Service 
        and the local community.
      </Text>
      
      {/* Numbered list of principles */}
      <Text style={{ ...styles.paragraph, paddingLeft: 12 }}>
        1. Commitment to our values, our vision and our mission including the promotion of a meaningful 
        connection to the NDIS and best practice in individual support in partnership with our clients 
        and families
      </Text>
      
      <Text style={{ ...styles.paragraph, paddingLeft: 12 }}>
        2. Effective, open, and respectful two-way communication and feedback between employees, clients, 
        families and management
      </Text>
      
      <Text style={{ ...styles.paragraph, paddingLeft: 12 }}>
        3. Honesty and integrity in all interactions between clients, families, employees, and managers
      </Text>
      
      <Text style={{ ...styles.paragraph, paddingLeft: 12 }}>
        4. Consistency and reliability in all exchanges with clients, families, employees and managers
      </Text>
      
      <Text style={{ ...styles.paragraph, paddingLeft: 12 }}>
        5. Commitment to a workplace which values and promotes the safety, health and wellbeing of 
        employees, volunteers, clients and families.
      </Text>
      
      <Text style={{ ...styles.paragraph, paddingLeft: 12 }}>
        6. Commitment to an Equal Opportunity workplace and culture which values the knowledge, experience 
        and professionalism of all employees, managers, and the diverse heritage of our clients and families.
      </Text>
    </View>
  );
};

export default Page8;

