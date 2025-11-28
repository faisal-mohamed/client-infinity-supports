import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 11,
    lineHeight: 1.6,
    marginBottom: 10,
    textAlign: 'justify',
  },
  subsection: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 8,
  },
  listItem: {
    fontSize: 11,
    lineHeight: 1.6,
    marginBottom: 6,
    paddingLeft: 15,
  },
});

const Page14: React.FC = () => {
  return (
    <View>
 
      
      <Text style={styles.subsection}>3.16 Whistleblowers</Text>
      
      <Text style={styles.paragraph}>
        If you believe that the Employer or any of its officers or employees is 
        involved in any form of wrongdoing such as:
      </Text>
      
      <Text style={styles.listItem}>• committing a criminal offence;</Text>
      
      <Text style={styles.listItem}>• failing to comply with a legal obligation;</Text>
      
      <Text style={styles.listItem}>• endangering the health and safety of an individual;</Text>
      
      <Text style={styles.listItem}>• environmental damage; or</Text>
      
      <Text style={styles.listItem}>• concealing any information relating to the above,</Text>
      
      <Text style={styles.paragraph}>
        You should, in the first instance, report your concerns to management who will 
        treat the matter with complete confidence. If you are not satisfied with the 
        explanation or reason given to you, you should raise the matter with the 
        appropriate organisation or body, e.g. the police, the Environment Protection 
        Agency or Work Cover.
      </Text>
      
      <Text style={styles.paragraph}>
        You will not suffer any detriment as a result of any genuine 
        attempt to bring to light matters of concern. However,
         if this procedure has not been invoked in good faith 
         (eg for malicious reasons or in pursuit of a personal grudge), 
         then you may be subject to disciplinary action up to and including termination.
      </Text>
      
      <Text style={styles.subsection}>3.17 EAP (Employee Assistance Program)</Text>
      
      <Text style={styles.paragraph}>
        An Employee Assistance Program is available to all employees. This is a 
        confidential service accessible to all employees. EAP is delivered by Breathe 
        Counselling. Employees are entitled to 3 free sessions in a calendar year.
      </Text>
      
      <Text style={styles.paragraph}>
        Breathe Counselling contact details are as follows:{'\n'}
        Moana Chambers, 2F/618 Hay St, Perth WA 6000{'\n'}
        admin@breathecounselling.com{'\n'}
        www.breathecounsellingperth.com.au
      </Text>
      
      <Text style={styles.paragraph}>
        Location of Offices:{'\n'}
        • Perth CBD - Moana Chambers, 2F/ 618 Hay Street (mall){'\n'}
        • Rockingham - Suite 8, 63 Penguin Road, Safety Bay{'\n'}
        • Midland - 12 Cale Street Pinjarra 289 Wilson Road
      </Text>
    </View>
  );
};

export default Page14;

