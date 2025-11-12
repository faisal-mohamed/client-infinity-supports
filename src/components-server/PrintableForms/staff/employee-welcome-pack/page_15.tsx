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
  address: {
    fontSize: 11,
    marginBottom: 10,
    color: '#4b5563',
  },
});

const Page15: React.FC = () => {
  return (
    <View>
      <Text style={styles.address}>
        Midland - 12 Cale Street{'\n'}
        Pinjarra 289 Wilson Road
      </Text>
      
      <Text style={styles.section}>4. Salaries and Wages</Text>
      
      <Text style={styles.subsection}>4.1 Remuneration</Text>
      
      <Text style={styles.paragraph}>
        Payment will be at the gross hourly rate in line with the SCHADS award. Payment is fortnightly 
        to your nominated bank account. Infinity Supports WA will process pays prior to 12.00 pm on 
        Fridays on a fortnightly basis.
      </Text>
      
      <Text style={styles.paragraph}>
        Your remuneration will be reviewed annually and may be increased at the Employer's discretion. 
        Any applicable award rate increases will be applied automatically by the Employer.
      </Text>
      
      <Text style={styles.subsection}>4.2 Tax</Text>
      
      <Text style={styles.paragraph}>
        At the end of each tax year, you will be provided with a summary statement showing your total 
        pay and deductions for tax and other matters. You should keep this document safe as you will 
        need it when completing your self-assessment tax return.
      </Text>
      
      <Text style={styles.subsection}>4.3 Pay reviews</Text>
      
      <Text style={styles.paragraph}>
        Your pay is reviewed annually and increased in accordance with minimum wage or award requirements. 
        However, there is no guarantee that you will receive an increase in your pay because of any review.
      </Text>
      
      <Text style={styles.subsection}>4.4 Superannuation</Text>
      
      <Text style={styles.paragraph}>
        Superannuation contributions will be made on your behalf in accordance with legislation.
      </Text>
      
      <Text style={styles.subsection}>4.5 Shortage of Work</Text>
      
      <Text style={styles.paragraph}>
        Where there is a temporary shortage of work, the Employer will try to maintain your continuity 
        of employment. This may involve placing you on reduced hours or temporary leave. If you agree 
        to work reduced hours, your pay will be reduced according to the time actually worked. If you 
        agree to temporary leave, this will be processed as leave without pay unless you wish to utilise 
        any accrued leave entitlements.
      </Text>
      
      <Text style={styles.subsection}>4.6 Stand Down</Text>
      
      <Text style={styles.paragraph}>
        The Employer may send you home where there is no useful work for you to do, such as during
      </Text>
    </View>
  );
};

export default Page15;

