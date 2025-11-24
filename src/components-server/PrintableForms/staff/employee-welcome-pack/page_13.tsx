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

const Page13: React.FC = () => {
  return (
    <View>
    
      
      <Text style={styles.subsection}>3.14 Mobile Phone Usage & Social Media</Text>
      
      <Text style={styles.paragraph}>
      All staff are to refrain from using mobile phone during work hours except during authorised breaks. 
      </Text>
      
      <Text style={styles.paragraph}>
      Any work-related issue or material that could identify an individual who is a 
      customer/client or colleague, which could adversely affect the Employer, 
      a customer/client or the Employer’s relationship with any customer/client must not be 
      placed on any social networking site. This means that, unless otherwise authorised, 
      work related matters must not be placed on any such site at any time either during or 
      outside of working hours and this includes access via any mobile computer equipment, 
      including mobile phone or other devices.
      </Text>
      
      <Text style={styles.paragraph}>
      Likewise, all employees are strictly prohibited from using social media
       (whether on the Employer’s devices or their own personal device) during work time.
      </Text>
      
      <Text style={styles.subsection}>3.15 Dress and Appearance</Text>
      
      <Text style={styles.paragraph}>
      Consistent with the culture of the Employer, you will be expected to present a 
      professional image about your appearance and standards of dress. You should wear 
      clothes appropriate to your job responsibilities, and they should be always kept clean
       and tidy. The Employer
       expects all employees to always maintain excellent standards of personal hygiene.
      </Text>
      
      <Text style={styles.paragraph}>
      Personal protective equipment (PPE) and clothing may be issued for your protection 
      because of the nature of your job and if issued must be worn and used at all appropriate
       times. Failure to do so could be a contravention of your health and safety 
       responsibilities. Once issued, this protective wear/equipment is your responsibility. 

      </Text>
      <Text style={styles.paragraph}>
      If you arrive for work in a manner that does not comply with this policy, 
      your manager will advise you that you are not dressed or groomed appropriately to 
      perform your duties. As a result, you may be sent home to change with any resulting lost time being unpaid. 
Any deliberate or persistent breaches of this policy may result in disciplinary action 
being taken against you. 

      </Text>
      
      <Text style={styles.paragraph}>
      If you are in any doubt whether any aspect of your 
      appearance or attire is appropriate for your job role you should contact management
      </Text>
    </View>
  );
};

export default Page13;

