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
  redItalic: {
    fontSize: 11,
    lineHeight: 1.6,
    marginBottom: 10,
    color: '#dc2626',
    fontStyle: 'italic',
  },
});

const Page11: React.FC = () => {
  return (
    <View>
      {/* Important notice in red italic */}
      <Text style={styles.redItalic}>
        It is expected all staff keep their trainings, certifications, and any other documents such 
        as driving license, comprehensive care insurance etc up to date at all times. Failure to 
        provide valid and current copies of documents relating to employment will result in staff 
        being stood down.
      </Text>
      
      <Text style={styles.subsection}>3.6 Induction</Text>
      <Text style={styles.paragraph}>
        At the start of your employment, you may be required to complete an induction programme, 
        during which all our policies and procedures will be explained and/or provided to you, as 
        necessary. Information relating to these will be given to you at the induction.
      </Text>
      
      <Text style={styles.subsection}>3.7 Job Description</Text>
      <Text style={styles.paragraph}>
        Amendments may be made to your job description from time to time in relation to the Employer's 
        changing needs and your own ability.
      </Text>
      
      <Text style={styles.subsection}>3.8 Performance and Review</Text>
      <Text style={styles.paragraph}>
        The Employer's policy is to monitor your work performance on a continual basis so that we can 
        maximise your strengths and help you with any development areas. We have an employee appraisal 
        system in place for the purpose of monitoring employee performance levels with a view to 
        maximising the effectiveness of individuals.
      </Text>
      
      <Text style={styles.subsection}>3.9 Convictions and Offenses</Text>
      <Text style={styles.paragraph}>
        During your employment, you are required to immediately report to the Employer any convictions 
        or offences with which you may be potentially or have been charged.
      </Text>
      
      <Text style={styles.subsection}>3.10 First Aid Certification</Text>
      <Text style={styles.paragraph}>
        All employees are required to have first aid certification and CPR certification to fulfil the 
        inherent requirements of their role. The Employer will pay first aid allowance as per the SCHADS 
        awards. You are required to inform the Employer at least four weeks prior to the expiration of 
        your first aid certificate that it requires renewal
      </Text>
    </View>
  );
};

export default Page11;

