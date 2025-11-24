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
      <Text style={styles.paragraph}>
        Any deliberate or persistent breaches of this policy may result in disciplinary action being 
        taken against you.
      </Text>
      
      <Text style={styles.paragraph}>
        If you are in any doubt whether any aspect of your appearance or attire is appropriate for 
        your job role you should contact management.
      </Text>
      
      <Text style={styles.subsection}>3.16 Whistleblowers</Text>
      
      <Text style={styles.paragraph}>
        It is important to the Employer that any fraud, misconduct or wrongdoing by workers or officers 
        of the Employer is reported and properly dealt with. We therefore encourage all individuals to 
        raise any concerns that they may have about the conduct of others in the business or the way in 
        which the business is run. This policy sets out the way in which individuals may raise any 
        concerns that they have and how those concerns will be dealt with.
      </Text>
      
      <Text style={styles.paragraph}>
        You may raise your concerns with your manager or, if you feel unable to do so, with the directors. 
        You should provide as much detail as possible about the wrongdoing including dates, times, and 
        names of those involved.
      </Text>
      
      <Text style={styles.paragraph}>
        The matters raised may include: committing a criminal offence; failing to comply with a legal 
        obligation; endangering the health and safety of an individual; damaging the environment; or 
        concealing information relating to any of the above.
      </Text>
      
      <Text style={styles.paragraph}>
        You will not suffer any detriment for raising a genuine concern. However, this procedure should 
        not be used for making trivial or vexatious allegations and the making of such may result in 
        disciplinary action.
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

