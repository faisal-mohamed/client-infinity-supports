import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  sectionHeader: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: 8,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 4,
  },
  contentBox: {
    border: '1 solid #d1d5db',
    padding: 10,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 6,
  },
  subHeading: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  listItem: {
    fontSize: 9,
    lineHeight: 1.4,
    marginBottom: 3,
    paddingLeft: 10,
  },
});

const Page3: React.FC = () => {
  return (
    <View>
      {/* Workplace Health & Safety */}
      <Text style={styles.sectionHeader}>Workplace Health & Safety</Text>
      <View style={styles.contentBox}>
        <Text style={styles.paragraph}>As an employee you are required to:</Text>
        
        <Text style={styles.listItem}>
          • Conduct own work and ensure direct reports work in a safe manner and in accordance with WHS 
          Policies and Procedures.
        </Text>
        <Text style={styles.listItem}>
          • Identify and raise hazards and WHS issues on an on-going basis in relation to area of 
          responsibility to ensure that risks are known to management and are controlled.
        </Text>
        <Text style={styles.listItem}>
          • Adhere to all safe working procedures in accordance with instructions/operating procedures.
        </Text>
        <Text style={styles.listItem}>
          • WHS issues are identified and addressed in a timely manner.
        </Text>
        <Text style={styles.listItem}>
          • Take reasonable care of yourself and others who may be affected by your actions.
        </Text>
        <Text style={styles.listItem}>• Abide by all Company Policies.</Text>
        <Text style={styles.listItem}>• Where appropriate PPE as required.</Text>
        <Text style={styles.listItem}>
          • Follow all Safety Instructions from your manager or the business.
        </Text>
        
        <Text style={styles.subHeading}>Assessing risk:</Text>
        
        <Text style={styles.paragraph}>
          Support Workers must assess risk in determining whether tasks, activities or duties are beyond 
          the scope that could reasonably be expected from someone in the role of a Support Worker.
        </Text>
        
        <Text style={styles.paragraph}>
          Examples of tasks, duties, or activities outside the remit of a Support Worker include:
        </Text>
        
        <Text style={styles.listItem}>
          • Any activity involving specialist knowledge, skill, or abilities that you do not possess.
        </Text>
        <Text style={styles.listItem}>
          • Performing any sort of medical procedure or intervention without clear instruction, and which 
          are beyond your skills, experience, and qualifications.
        </Text>
        <Text style={styles.listItem}>• Operating heavy machinery</Text>
        <Text style={styles.listItem}>
          • Using substances, tools, or equipment (e.g., hoists) not fit for purpose or without adequate 
          training and guidelines from the person you support or their family.
        </Text>
        <Text style={styles.listItem}>
          • Performing any activity that has the potential to affect health and safety tools without first 
          assessing risks and ensuring effective controls are in place.
        </Text>
      </View>

      {/* Quality & Environmental Aspects */}
      <Text style={styles.sectionHeader}>Quality & Environmental Aspects</Text>
      <View style={styles.contentBox}>
        <Text style={styles.paragraph}>As an employee you are required to:</Text>
        
        <Text style={styles.listItem}>• Understand customer expectations from service and products.</Text>
        <Text style={styles.listItem}>• Maintain company quality standards.</Text>
        <Text style={styles.listItem}>• Follow company quality control processes.</Text>
        <Text style={styles.listItem}>• Report any customer complaints with management.</Text>
        <Text style={styles.listItem}>• Recycle and use appropriate waste storage bins.</Text>
        <Text style={styles.listItem}>
          • Minimise paper and electricity use where it is possible and practical.
        </Text>
        <Text style={styles.listItem}>• Report ideas and opportunities to your manager.</Text>
      </View>
    </View>
  );
};

export default Page3;

