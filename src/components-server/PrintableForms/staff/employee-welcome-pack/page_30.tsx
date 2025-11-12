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
  redBold: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 10,
    marginTop: 10,
  },
  agencyBox: {
    backgroundColor: '#f97316',
    padding: 8,
    marginBottom: 2,
    fontSize: 10,
    color: '#ffffff',
  },
});

const Page30: React.FC = () => {
  return (
    <View>
      <Text style={styles.paragraph}>
        Individuals can make a complaint directly to the following agencies at any time they wish to:
      </Text>
      
      {/* Agency list with gradient colors */}
      <View style={{ marginVertical: 10 }}>
        <View style={{ ...styles.agencyBox, backgroundColor: '#f97316' }}>
          <Text>Commission for Children and Young People</Text>
        </View>
        <View style={{ ...styles.agencyBox, backgroundColor: '#ea580c' }}>
          <Text>NDIS Commissions, Complaints, Integrity and Privacy Unit</Text>
        </View>
        <View style={{ ...styles.agencyBox, backgroundColor: '#dc2626' }}>
          <Text>Ombudsman</Text>
        </View>
        <View style={{ ...styles.agencyBox, backgroundColor: '#c2410c' }}>
          <Text>The National Disability Insurance Agency (NDIA)</Text>
        </View>
        <View style={{ ...styles.agencyBox, backgroundColor: '#991b1b' }}>
          <Text>Office of the Commissioner for Privacy and Data Protection</Text>
        </View>
        <View style={{ ...styles.agencyBox, backgroundColor: '#7f1d1d' }}>
          <Text>Independent Broad-based Anti-Corruption Commission (IBAC)</Text>
        </View>
        <View style={{ ...styles.agencyBox, backgroundColor: '#6b7280' }}>
          <Text>Disability Services Commission</Text>
        </View>
      </View>
      
      <Text style={styles.section}>9 Drugs & Alcohol</Text>
      
      <Text style={styles.redBold}>ZERO TOLERANCE</Text>
      
      <Text style={styles.paragraph}>
        The use of drugs or alcohol jeopardises a safe workplace. The Employer has a zero-tolerance policy 
        in regard to this issue and will not allow workers to work while under the influence of drugs or 
        alcohol. Non-compliance by employees or other workers will result in disciplinary action up to and 
        including termination.
      </Text>
      
      <Text style={styles.paragraph}>
        The Employer acknowledges alcohol and other drug dependencies as treatable conditions and encourages 
        individuals to seek assistance from appropriate Employers or support groups.
      </Text>
      
      <Text style={styles.paragraph}>
        Workers and visitors must not be adversely affected by drugs or alcohol at work or while at work 
        functions and must at all times be fit to perform their work safely.
      </Text>
      
      <Text style={styles.paragraph}>
        Alcohol may be consumed at some Employer events. We encourage responsible alcohol consumption and 
        prohibit being drunk or behave in a manner which is inappropriate.
      </Text>
      
      <Text style={styles.paragraph}>
        Infinity Supports WA strictly promotes a smoking free culture. Employees are strictly prohibited 
        from smoking whilst supporting clients. It is our smoke free culture due to health & safety concerns 
        and to promote healthy lifestyle for both clients and staff.
      </Text>
    </View>
  );
};

export default Page30;

