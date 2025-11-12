import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
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
  bold: {
    fontWeight: 'bold',
  },
});

const Page17: React.FC = () => {
  return (
    <View>
      {/* Continuation */}
      <Text style={styles.paragraph}>
        are not entitled to paid personal leave. Paid personal leave accrues over the course of your 
        employment. Full time employees will accrue up to ten days of paid personal leave for each year 
        of continuous service. Part time and fixed-term employees are entitled to this entitlement on a 
        pro-rata basis. Personal leave accrues, and will be credited to you, progressively throughout 
        the year.
      </Text>
      
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Entitlement to take personal leave.</Text> You are entitled to take 
        personal leave if:
      </Text>
      
      <Text style={styles.listItem}>
        • you are not fit for work due to a personal illness or personal injury affecting you; or
      </Text>
      
      <Text style={styles.listItem}>
        • to provide care or support to a member of your immediate family, or a member of your household 
        who requires your care and support because of:
      </Text>
      
      <Text style={styles.listItem}>
        &nbsp;&nbsp;&nbsp;&nbsp;○ a personal illness or injury affecting the member, or
      </Text>
      
      <Text style={styles.listItem}>
        &nbsp;&nbsp;&nbsp;&nbsp;○ a sudden or emergency affecting the member.
      </Text>
      
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Unpaid carer's leave.</Text> If your entitlement to personal leave 
        is exhausted, you may take two days' unpaid carer's leave for each occasion when a member of 
        your immediate family or a member of your household requires your care and support because of:
      </Text>
      
      <Text style={styles.listItem}>
        • a personal illness or personal injury affecting the member, or
      </Text>
      
      <Text style={styles.listItem}>
        • a sudden or emergency affecting the member.
      </Text>
      
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Immediate family member.</Text> An immediate family member is a:
      </Text>
      
      <Text style={styles.listItem}>• spouse;</Text>
      <Text style={styles.listItem}>• de facto partner;</Text>
      <Text style={styles.listItem}>• child;</Text>
      <Text style={styles.listItem}>• parent;</Text>
      <Text style={styles.listItem}>• grandparent;</Text>
      <Text style={styles.listItem}>• grandchild;</Text>
      <Text style={styles.listItem}>• sibling, or</Text>
      <Text style={styles.listItem}>
        • child, parent, grandparent, grandchild or sibling of the employee's spouse or de facto partner.
      </Text>
      
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Household member.</Text> A household member is any person who lives 
        with you.
      </Text>
      
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Notification of personal leave and evidence of incapacity.</Text> A 
        medical certificate from a registered health practitioner or if not reasonably practical, a 
        statutory declaration is required for all personal leave where you will be absent for more than 
        2 days.
      </Text>
    </View>
  );
};

export default Page17;

