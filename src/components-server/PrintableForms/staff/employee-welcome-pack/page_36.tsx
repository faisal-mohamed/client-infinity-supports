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
  contactItem: {
    fontSize: 11,
    lineHeight: 1.6,
    marginBottom: 4,
    paddingLeft: 15,
  },
});

const Page36: React.FC = () => {
  return (
    <View>
      <Text style={styles.paragraph}>
        If you bring a complaint of bullying or harassment you will not be victimised for having brought 
        the complaint.
      </Text>
      
      <Text style={styles.paragraph}>
        However, if the report concludes that the complaint is both untrue and has been brought with 
        malicious intent, appropriate action will be taken against you. Appropriate action in relation to 
        an employee will include disciplinary action in accordance with the Employer's disciplinary and 
        disciplinary termination procedure. For other workers, appropriate action may include termination 
        of their engagement with the Employer.
      </Text>
      
      <Text style={styles.section}>Important Contacts</Text>
      
      <Text style={styles.paragraph}>
        Infinity Supports WA is not an emergency service. We are unable to answer phone calls outside of 
        our normal working hours (8.30 am to 4.30 pm Monday to Friday).
      </Text>
      
      <Text style={styles.subsection}>Emergency</Text>
      <Text style={styles.contactItem}>Dial 000</Text>
      
      <Text style={styles.subsection}>Crisis and Mental Health Support</Text>
      <Text style={styles.contactItem}>Beyond Blue: 1300 224 636</Text>
      <Text style={styles.contactItem}>Lifeline Australia: 13 11 14</Text>
      <Text style={styles.contactItem}>Suicide Call Back Service: 1300 659 467</Text>
      <Text style={styles.contactItem}>Mental Health Emergency Response Line: 1300 555 788 (Metro) / 1800 676 822 (Peel)</Text>
      <Text style={styles.contactItem}>Kids Helpline: 1800 55 1800</Text>
      <Text style={styles.contactItem}>Mensline Australia: 130 78 99 78</Text>
      <Text style={styles.contactItem}>Sexual Assault, Family and Domestic Violence Line: 1800 424 017</Text>
      
      <Text style={styles.subsection}>Medical</Text>
      <Text style={styles.contactItem}>Health Direct (24 hours health advice): 1800 022 222</Text>
      <Text style={styles.contactItem}>Poisons Information Line: 131 126</Text>
      
      <Text style={{ borderBottom: '1 solid #9ca3af', marginVertical: 8 }} />
      
      <Text style={styles.subsection}>Company Contact</Text>
      <Text style={styles.contactItem}>Email: admin@infinitysupportswa.org</Text>
      <Text style={styles.contactItem}>Mobile: 0493282661 / 0493141688</Text>
      <Text style={styles.contactItem}>Operating Hours: Monday to Friday 08.30 AM to 4.30 PM</Text>
    </View>
  );
};

export default Page36;

