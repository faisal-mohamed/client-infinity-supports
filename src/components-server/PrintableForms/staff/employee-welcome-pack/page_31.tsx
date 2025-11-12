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

const Page31: React.FC = () => {
  return (
    <View>
      <Text style={styles.paragraph}>
        Smoking is classified as a lifestyle risk factor and can affect clients who are being supported 
        directly and indirectly. This is in line with The Occupational Safety and Health Act 1984(WA) and 
        The Occupational Safety and Health Regulations 1996 (WA).
      </Text>
      
      <Text style={styles.subsection}>9.1 Prescribed Medication</Text>
      
      <Text style={styles.paragraph}>
        Employees who are taking any prescribed medication or drugs which may affect their ability to 
        perform their work must notify management as soon as possible. You may be required to produce a 
        medical certificate stating that you are fit for work or specifying any restrictions.
      </Text>
      
      <Text style={styles.subsection}>9.2 Screening</Text>
      
      <Text style={styles.paragraph}>
        The Employer may require screening for alcohol and drugs. For employees, this may include 
        pre-employment testing. Testing may be conducted based on reasonable suspicion or following an 
        incident or accident. The Employer reserves the right to carry out random testing across all levels 
        of employees.
      </Text>
      
      <Text style={styles.paragraph}>
        The following provides examples of activities which may result in disciplinary procedures, up to 
        and including termination of your employment or engagement with the Employer. If you:
      </Text>
      
      <Text style={styles.listItem}>
        • are removed from the workplace due to impairment or reasonable suspicion of impairment;
      </Text>
      
      <Text style={styles.listItem}>
        • return a positive result following testing;
      </Text>
      
      <Text style={styles.listItem}>
        • return a blood alcohol level of more than 0.00 or the equivalent in urine or breath samples;
      </Text>
      
      <Text style={styles.listItem}>
        • refuse reasonable direction to undertake drug and alcohol screening; or
      </Text>
      
      <Text style={styles.listItem}>
        • are in possession of illegal drugs for supply or consumption in the workplace
      </Text>
      
      <Text style={styles.paragraph}>
        This list is not exhaustive.
      </Text>
      
      <Text style={styles.paragraph}>
        If you perform work on a client site which conducts regular or random drug and alcohol testing, 
        you will be required to participate.
      </Text>
      
      <Text style={styles.paragraph}>
        Where you are suspected of being affected by drugs or alcohol, you may be required to participate 
        in appropriate testing. Positive readings at any time will result in disciplinary procedures up to 
        and including termination of your employment or engagement with the Employer.
      </Text>
      
      <Text style={styles.paragraph}>
        If you return a positive result or refuse to participate in testing, you will be required to cease 
        work immediately and leave the workplace. This time will be unpaid until such a time that you
      </Text>
    </View>
  );
};

export default Page31;

