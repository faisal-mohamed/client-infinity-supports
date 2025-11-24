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
       a resolution. The Managing Director will write a letter to confirm that your complaint has been received. 
       This letter will provide you with the expected date Infinity Supports WA of the complaint resolution.

      </Text>
      
      <Text style={styles.paragraph}>
      The complaint will then be investigated, and a plan to resolve it created. You will be informed of this plan, 
      and we will ask you to provide your opinion on our recommended solution. You can advise if you are happy
       with the proposed solution or unhappy with the outcome and feel the matter is not resolved. Any ongoing issue 
       could be identified by tracking and analysing feedback and complaint data. As a part of the continuous 
       improvement process, the feedback, complaints and dispute resolution will be discussed in management 
       team meetings regularly.

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

