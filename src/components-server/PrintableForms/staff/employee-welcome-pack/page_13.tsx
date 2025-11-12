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
      {/* Consent for disclosure */}
      <Text style={styles.paragraph}>
        You consent to the Employer disclosing personal and sensitive personal information to third 
        parties for reasons related to your employment or the business requirements of the Employer. 
        You understand that the Employer may disclose information to third parties including but not 
        limited to: the Australian Tax Office; superannuation fund trustees and administrators; 
        insurers; medical or occupational practitioners; financial and legal advisers; and potential 
        purchasers on sale of business; and law enforcement bodies.
      </Text>
      
      <Text style={styles.subsection}>3.14 Mobile Phone Usage & Social Media</Text>
      
      <Text style={styles.paragraph}>
        All staff must refrain from using mobile phones during work hours except during authorised breaks.
      </Text>
      
      <Text style={styles.paragraph}>
        You must not place any work-related issue or material which might identify a customer/client 
        or colleague or which might adversely affect the Employer, a customer/client or the Employer's 
        relationship with a customer/client on any social networking site. This applies whether access 
        is during or outside working hours and whether access is via the Employer's or your own computer 
        equipment or by any mobile computer equipment including mobile phones or other devices. It is 
        a serious offence and may, after investigation, result in your summary termination.
      </Text>
      
      <Text style={styles.paragraph}>
        All employees are strictly prohibited from using social media (whether on Employer's devices 
        or their own personal devices) during work time.
      </Text>
      
      <Text style={styles.subsection}>3.15 Dress and Appearance</Text>
      
      <Text style={styles.paragraph}>
        You should ensure that you present a professional image and wear clothes which are appropriate 
        to your job responsibilities. They should be kept clean and tidy and you should maintain 
        excellent standards of personal hygiene.
      </Text>
      
      <Text style={styles.paragraph}>
        Personal Protective Equipment (PPE) and Clothing. If issued to you to protect you because of 
        the nature of your job, this must be worn/used at all appropriate times. Failure to do so could 
        be in contravention of your health and safety responsibilities and may also be deemed as 
        misconduct for which disciplinary action may be taken. Once issued, this protective 
        wear/equipment is your responsibility.
      </Text>
      
      <Text style={styles.paragraph}>
        If you arrive for work not complying with this policy, your manager will advise you and you 
        may be sent home to change. Any time taken as a result of you being sent home to change will 
        be unpaid.
      </Text>
    </View>
  );
};

export default Page13;

