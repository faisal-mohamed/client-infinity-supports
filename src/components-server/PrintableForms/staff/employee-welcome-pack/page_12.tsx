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
  redItalic: {
    fontSize: 11,
    lineHeight: 1.6,
    marginBottom: 10,
    color: '#dc2626',
    fontStyle: 'italic',
  },
});

const Page12: React.FC = () => {
  return (
    <View>
      <Text style={styles.subsection}>3.11 Workplaces Policies</Text>
      
      <Text style={styles.paragraph}>
        The employer has workplace practices and policies in place to help manage our operations and 
        employee expectations. You must make yourself familiar with and abide by our workplace policies. 
        Failure to comply with our workplace policies may lead to disciplinary action being taken.
      </Text>
      
      <Text style={styles.paragraph}>
        If you are uncertain about any workplace policy or your obligations in respect of a particular 
        policy, you should raise this with your manager who will take steps to ensure that you are 
        provided with the information you need.
      </Text>
      
      <Text style={styles.redItalic}>
        Policies and procedures are available on website www.infinitysupportswa.org. A copy can also 
        be provided on written request from staff.
      </Text>
      
      <Text style={styles.subsection}>3.12 Conflicts of interest</Text>
      
      <Text style={styles.paragraph}>
        You must immediately disclose any potential, perceived or actual conflicts of interest that 
        could affect your employment obligations or the business or reputational interests of the 
        employer. The employer may require you to take action to resolve any conflict of interest. 
        Failure to satisfactorily declare or resolve a conflict of interest may result in the 
        termination of your employment.
      </Text>
      
      <Text style={styles.redItalic}>
        Conflict of interest form will be provided on written request from staff.
      </Text>
      
      <Text style={styles.subsection}>3.13 Privacy</Text>
      
      <Text style={styles.paragraph}>
        You consent to the employer collecting and using personal and sensitive personal information 
        as defined in the Privacy Act 1988 (Commonwealth) for all purposes related to your employment. 
        This information will be held in a secure location.
      </Text>
    </View>
  );
};

export default Page12;

