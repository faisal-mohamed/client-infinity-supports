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
  contactInfo: {
    fontSize: 11,
    lineHeight: 1.6,
    marginBottom: 4,
    paddingLeft: 15,
  },
});

const Page29: React.FC = () => {
  return (
    <View>
      <Text style={styles.paragraph}>
        Once a complaint has been received, Infinity Supports WA will investigate the complaint and find 
        a resolution. The Managing Director will send a letter to confirm we have received the complaint 
        and provide an expected date that a decision will be reached on the matter.
      </Text>
      
      <Text style={styles.paragraph}>
        We will investigate the complaint and create a resolution plan. You will be informed of the plan 
        and asked for your opinion on the recommended solution indicating whether you are happy or unhappy. 
        Ongoing issues will be identified by tracking and analysing feedback and complaint data. Feedback, 
        complaints and dispute resolution are regularly discussed in our management team meetings as part 
        of our continuous improvement process.
      </Text>
      
      <Text style={styles.paragraph}>
        If you are not happy with the solution proposed by Infinity Supports WA regarding your complaint, 
        you can speak to other organisations, such as:
      </Text>
      
      <Text style={styles.subsection}>Commonwealth Ombudsman - Disability Services</Text>
      
      <Text style={styles.contactInfo}>Telephone: 1300 362 072</Text>
      <Text style={styles.contactInfo}>Email: ombudsman@ombudsman.gov.au</Text>
      <Text style={styles.contactInfo}>Website: www.ombudsman.gov.au</Text>
      
      <Text style={styles.subsection}>NDIS Complaints</Text>
      
      <Text style={styles.contactInfo}>Telephone: 1800 800 110</Text>
      <Text style={styles.contactInfo}>Email: feedback@ndis.gov.au or</Text>
      <Text style={styles.contactInfo}>
        Website: https://www.ndis.gov.au/contact/feedback-and-complaints
      </Text>
    </View>
  );
};

export default Page29;

