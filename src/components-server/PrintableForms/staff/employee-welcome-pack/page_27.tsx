import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  section: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 12,
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
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #e5e7eb',
    padding: 6,
    fontSize: 10,
  },
  tableCol1: {
    width: '70%',
  },
  tableCol2: {
    width: '30%',
  },
  redItalic: {
    fontSize: 11,
    lineHeight: 1.6,
    marginBottom: 10,
    marginTop: 10,
    color: '#dc2626',
    fontStyle: 'italic',
  },
});

const Page27: React.FC = () => {
  return (
    <View>
      {/* Table row continuation */}
      <View style={styles.tableRow}>
        <Text style={styles.tableCol1}>
          the use of a restrictive practice in relation to a person with disability if the use is not in 
          accordance with a required state or territory authorisation and/or not in accordance with a 
          behaviour support plan.
        </Text>
        <Text style={styles.tableCol2}>Five business days</Text>
      </View>
      
      {/* Red italic text */}
      <Text style={styles.redItalic}>
        Incident and Hazard reporting is to be completed on shiftcare. Infinity Supports WA instructs all 
        its staff to report all incidents and hazards irrespective of their levels of severity. This helps 
        in ensuring appropriate measures are put in place to minimize occurrences of such incidents.
      </Text>
      
      <Text style={styles.section}>8. Feedback and Complaints</Text>
      
      <Text style={styles.paragraph}>
        Your feedback allows us to provide you with high-quality services; we actively seek your input. 
        Feedback can be provided using Form31.Participant Survey (Client Satisfaction Survey). We would 
        like your feedback on:
      </Text>
      
      <Text style={styles.listItem}>• quality of care received</Text>
      <Text style={styles.listItem}>• consistency of services provided</Text>
      <Text style={styles.listItem}>• support worker performance</Text>
      <Text style={styles.listItem}>• supports that work for you</Text>
      <Text style={styles.listItem}>• changes you want made to assist you</Text>
      <Text style={styles.listItem}>• what you like and dislike about our services</Text>
      
      <Text style={styles.paragraph}>
        You always have the right to expect the best possible standard of service from us, and we will 
        treat any concern or complaint you provide as a serious issue. No matter what the situation, a 
        Staff will not react badly to your complaint; you should feel safe knowing that they will not 
        retaliate or hurt you in any way.
      </Text>
      
      <Text style={styles.paragraph}>
        You can make an anonymous complaint using Complaint Report Form. Remember not to identify yourself 
        during this process if you wish us not to know who is making the complaint.
      </Text>
    </View>
  );
};

export default Page27;

