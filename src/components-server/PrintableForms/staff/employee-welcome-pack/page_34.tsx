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

const Page34: React.FC = () => {
  return (
    <View>
      <Text style={styles.subsection}>11.3 Bullying</Text>
      
      <Text style={styles.paragraph}>
        Bullying is repeated, offensive, abusive, intimidating, insulting or unreasonable behaviour directed 
        towards an individual or a group, which makes the recipient(s) feel threatened, humiliated or 
        vulnerable. Single incidents of bullying will not be tolerated.
      </Text>
      
      <Text style={styles.paragraph}>
        Bullying can happen in the workplace and outside of the workplace at events connected to the 
        workplace, such as social functions or business trips. It can be a form of harassment and cause an 
        individual to suffer negative physical and mental effects. It can take the form of physical, verbal 
        and non-verbal conduct.
      </Text>
      
      <Text style={styles.paragraph}>
        Examples of bullying include:
      </Text>
      
      <Text style={styles.listItem}>• abusive, insulting or offensive language or comments;</Text>
      <Text style={styles.listItem}>• unjustified criticism or complaints;</Text>
      <Text style={styles.listItem}>• physical or emotional threats;</Text>
      <Text style={styles.listItem}>• deliberate exclusion from workplace activities;</Text>
      <Text style={styles.listItem}>• the spreading of misinformation or malicious rumours; and</Text>
      <Text style={styles.listItem}>
        • the denial of access to information, supervision or resources such that it has a detrimental 
        impact on the individual or group.
      </Text>
      
      <Text style={styles.paragraph}>
        These examples are not exhaustive and disciplinary action at the appropriate level will be taken 
        against employees committing any form of bullying. Appropriate action in relation to an employee 
        will include disciplinary action in accordance with the Employer's disciplinary and disciplinary 
        termination procedure. For other workers, appropriate action may include termination of their 
        engagement with the Employer.
      </Text>
      
      <Text style={styles.subsection}>11.4 Bullying & Harassment Complaint Procedure</Text>
      
      <Text style={styles.paragraph}>
        i) Informal complaint
      </Text>
      
      <Text style={styles.paragraph}>
      We recognise that complaints of bullying, harassment, and particularly of sexual harassment, can sometimes
       be of a sensitive or intimate nature and that it may not be appropriate for you to raise the issue 
       through our normal grievance procedure. In these circumstances you are encouraged to raise such issues 
       with a senior colleague of your choice (whether that person has a direct supervisory responsibility for you)
        as a confidential helper. 

      </Text>
    </View>
  );
};

export default Page34;

