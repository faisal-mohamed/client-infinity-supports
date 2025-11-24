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
  listItem: {
    fontSize: 11,
    lineHeight: 1.6,
    marginBottom: 6,
    paddingLeft: 15,
  },
});

const Page16: React.FC = () => {
  return (
    <View>
      {/* Continuation from previous page */}
      <Text style={styles.listItem}>• Covid 19 Lockdown</Text>
      <Text style={styles.listItem}>
        • a cause which the Employer cannot reasonably be held responsible, such as natural disaster.
      </Text>
      
      <Text style={styles.paragraph}>
        This list is not exhaustive. Generally, you will not be paid for this time. However, by 
        agreement you may be able to access accrued leave.
      </Text>
      
      <Text style={styles.subsection}>4.7 Annual Leave</Text>
      
      <Text style={styles.paragraph}>
        You are entitled to accrue annual leave in accordance with the National Employment Standards 
        (NES), unless otherwise stated in your contract of employment. For the avoidance of doubt, 
        casual employees are not entitled to annual leave. Your annual leave pay will be at your normal 
        basic pay unless shown otherwise in your contract of employment. It is the Employer's policy 
        to encourage you to take all your holiday entitlement in the current year.
      </Text>
      
      <Text style={styles.paragraph}>
        Permanent staff must submit your leave request through XERO and have it approved by management 
        before you make any firm holiday arrangements. Annual leave dates will normally be allocated 
        on a 'first come, first served' basis whilst ensuring that operational efficiency and appropriate 
        staffing levels are maintained throughout the year. Due to the nature of the business, the 
        Employer can only accommodate a limited number of employees taking annual leave at the same time. 
        Casual Staff are to send leave requests to their respective line manager with two weeks' notice.
      </Text>
      
      <Text style={styles.paragraph}>
        You must give at least two weeks' notice of your intention to take annual leave of a week or 
        more and one week's notice is required for odd single days. It is your responsibility to ensure 
        you have cover for your shifts and that your clients are aware of your absence.
      </Text>
      
      <Text style={styles.subsection}>4.8 Public Holidays</Text>
      
      <Text style={styles.paragraph}>
        You are expected to work public holidays if this is a normal day of work on your roster unless 
        the client has chosen not to have public holiday support. Public holidays not worked are paid 
        at 'Base Rate'.
      </Text>
      
      <Text style={styles.subsection}>4.9 Personal Leave Entitlements</Text>
      
      <Text style={styles.paragraph}>
      You are entitled to be paid for personal leave in accordance with the Schads Award, 
      unless otherwise stated in your contract of employment. For the avoidance of doubt, 
      casual employees are not entitled to paid personal leave. Paid personal leave accrues 
      over the course of your employment.
      </Text>
    </View>
  );
};

export default Page16;

