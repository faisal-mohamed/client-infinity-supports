import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  heading: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tocRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '1 dotted #9ca3af',
    paddingBottom: 2,
    marginBottom: 3,
    fontSize: 10,
  },
  tocRowIndent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '1 dotted #9ca3af',
    paddingBottom: 2,
    marginBottom: 3,
    paddingLeft: 12,
    fontSize: 10,
  },
});

const Page6: React.FC = () => {
  return (
    <View>
      {/* Section 5: Disciplinary Procedure */}
      <View style={styles.tocRow}>
        <Text>5. Disciplinary Procedure</Text>
        <Text>18</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>5.1 Introduction</Text>
        <Text>18</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>5.2 Disciplinary Rules</Text>
        <Text>19</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>5.3 Rules Covering Unsatisfactory Conduct and Misconduct</Text>
        <Text>19</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>5.4 Serious Misconduct</Text>
        <Text>20</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>5.5 Disciplinary Procedure</Text>
        <Text>20</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>5.6 Duration of Warnings</Text>
        <Text>21</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>5.7 General Notes</Text>
        <Text>21</Text>
      </View>
      
      {/* Section 6: Grievance Procedure */}
      <View style={styles.tocRow}>
        <Text>6 Grievance Procedure</Text>
        <Text>22</Text>
      </View>
      
      {/* Section 7: Incident Management */}
      <View style={styles.tocRow}>
        <Text>7 Incident Management</Text>
        <Text>22</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>7.1 Report Notifiable Incident</Text>
        <Text>24</Text>
      </View>
      
      {/* Section 8: Feedback and Complaints */}
      <View style={styles.tocRow}>
        <Text>8. Feedback and Complaints</Text>
        <Text>27</Text>
      </View>
      
      {/* Section 9: Drugs & Alcohol */}
      <View style={styles.tocRow}>
        <Text>9 Drugs & Alcohol</Text>
        <Text>30</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>9.1 Prescribed Medication</Text>
        <Text>31</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>9.2 Screening</Text>
        <Text>31</Text>
      </View>
      
      {/* Section 10: Termination of Employment */}
      <View style={styles.tocRow}>
        <Text>10 Termination of Employment</Text>
        <Text>32</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>10.1 Resignations</Text>
        <Text>32</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>10.2 Termination without Notice</Text>
        <Text>32</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>10.3 Return of Employer Property</Text>
        <Text>32</Text>
      </View>
      
      {/* Section 11: Bullying and Harassment */}
      <View style={styles.tocRow}>
        <Text>11 Bullying and Harassment</Text>
        <Text>32</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>11.1 Introduction</Text>
        <Text>32</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>11.2 Harassment</Text>
        <Text>33</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>11.3 Bullying</Text>
        <Text>34</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>11.4 Bullying & Harassment Complaint Procedure</Text>
        <Text>34</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>11.5 General Notes</Text>
        <Text>35</Text>
      </View>
    </View>
  );
};

export default Page6;

