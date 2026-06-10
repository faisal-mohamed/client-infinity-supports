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

const Page32: React.FC = () => {
  return (
    <View>
      {/* Continuation from previous page */}
      <Text style={styles.paragraph}>
        are fit to return to work. You will not be able to return to the workplace until you return a 
        negative result. If you are required to leave the workplace, you will be required to report to 
        management on your return or when you are no longer under the influence of drugs or alcohol, to 
        discuss the incident.
      </Text>
      
      <Text style={styles.section}>10 Termination of Employment</Text>
      
      <Text style={styles.subsection}>10.1 Resignations</Text>
      
      <Text style={styles.paragraph}>
        All resignations must be provided in writing, stating the reason for resigning your post.
      </Text>
      
      <Text style={styles.subsection}>10.2 Termination without Notice</Text>
      
      <Text style={styles.paragraph}>
        If you terminate your employment without giving or working the required period of notice, as 
        indicated in your contract of employment, you will have an amount equal to any additional cost of 
        covering your duties during the notice period not worked deducted from any termination pay due to you.
      </Text>
      
      <Text style={styles.subsection}>10.3 Return of Employer Property</Text>
      
      <Text style={styles.paragraph}>
        On the termination of your employment, you must return all Employer property which is in your 
        possession or for which you have responsibility. Failure to return such items within 7 days will 
        result in the cost of the items being deducted from any monies outstanding to you. All Employer 
        property should be returned to management.
      </Text>
      
      <Text style={styles.section}>11 Bullying and Harassment</Text>
      
      <Text style={styles.subsection}>11.1 Introduction</Text>
      
      <Text style={styles.paragraph}>
        The Employer is committed to the provision of a fair, healthy and safe workplace in which everyone 
        is treated with dignity and respect and in which no individual or group feels bullied, threatened 
        or intimidated. Bullying or harassment in any form is unacceptable behaviour and will not be 
        permitted or condoned.
      </Text>
    </View>
  );
};

export default Page32;

