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

const Page35: React.FC = () => {
  return (
    <View>
      <Text style={styles.paragraph}>
      If you are the victim of minor bullying or harassment you should make it clear to the alleged bully or
       harasser on an informal basis that their behaviour is unwelcome and ask the individual to stop. If you feel
        unable to do this 
      verbally then you should hand a written request to the individual, and your confidential helper can assist you in this. 
      </Text>
      
      <Text style={styles.paragraph}>
        ii) Formal complaint
      </Text>
      
      <Text style={styles.paragraph}>
      Where the informal approach fails or if the bullying or harassment is more serious,
       you should bring the matter to the attention of management as a formal written complaint and again 
       your confidential helper can assist you in this. If possible, you should keep notes of the bullying or
        harassment so that the written complaint can include: 
      </Text>
      
     
      
      <Text style={styles.listItem}>• the name of the alleged bully or harasser;</Text>
      <Text style={styles.listItem}>• the nature of the alleged incident of bullying or harassment;</Text>
      <Text style={styles.listItem}>• the dates and times when the alleged incident occurred;</Text>
      <Text style={styles.listItem}>• the names of any witnesses; and</Text>
      <Text style={styles.listItem}>
        • any action already taken by you to attempt to stop the alleged bullying or harassment.
      </Text>
      
      <Text style={styles.paragraph}>
      On receipt of a formal complaint, we will take action to separate you from the alleged bully or harasser 
      to enable an uninterrupted investigation to take place. This may involve a temporary transfer of the 
alleged bully or harasser to another work area or suspension of employees (with contractual pay) 
until the matter has been resolved. 

      </Text>
      
      <Text style={styles.paragraph}>
      The person dealing with the complaint will invite you to attend a meeting, at a reasonable time and 
      location, to discuss the matter and carry out a thorough investigation. You have the right to be 
      accompanied at such a meeting by your confidential helper or another work colleague of your choice and 
      you must take all reasonable steps to attend. Those involved in the investigation will be expected to act 
      in confidence and any breach of confidence will be a disciplinary matter. 

      </Text>
      
      <Text style={styles.paragraph}>
      On conclusion of the investigation which will normally be within ten working days of the 
      meeting with you, a report of the findings and of the investigator's decision will be sent, 
      in writing, to you and to the alleged bully or harasser. 

      </Text>
      

      
      
    </View>
  );
};

export default Page35;

