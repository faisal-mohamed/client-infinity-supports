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
        Where you have been subject to minor, unintentional bullying or harassment you may wish to address 
        it yourself. You should tell the individual in question that their behaviour is unwelcome and ask 
        them to stop. If speaking directly to the alleged bully or harasser is too difficult or embarrassing, 
        you can provide them with a written request instead. A confidential helper can assist you with this.
      </Text>
      
      <Text style={styles.paragraph}>
        ii) Formal complaint
      </Text>
      
      <Text style={styles.paragraph}>
        Where the matter is more serious or informal discussions have not been successful, you should bring 
        the matter to the attention of management as a formal written complaint. Again, a confidential helper 
        can assist you with this.
      </Text>
      
      <Text style={styles.paragraph}>
        You are encouraged to keep a written record of the bullying or harassment. This should include:
      </Text>
      
      <Text style={styles.listItem}>• the name of the alleged bully or harasser;</Text>
      <Text style={styles.listItem}>• the nature of the alleged incident of bullying or harassment;</Text>
      <Text style={styles.listItem}>• the dates and times when the alleged incident occurred;</Text>
      <Text style={styles.listItem}>• the names of any witnesses; and</Text>
      <Text style={styles.listItem}>
        • any action already taken by you to attempt to stop the alleged bullying or harassment.
      </Text>
      
      <Text style={styles.paragraph}>
        On receipt of a formal complaint we will take action to separate you from the alleged bully or 
        harasser to enable an uninterrupted investigation to take place. This may involve a temporary 
        transfer of the alleged bully or harasser to another work area or suspension with contractual pay 
        until the matter has been resolved.
      </Text>
      
      <Text style={styles.paragraph}>
        The person dealing with the complaint will invite you to a meeting, at a reasonable time and 
        location, to discuss the matter and carry out a thorough investigation. You have the right to be 
        accompanied by a confidential helper or another work colleague at such a meeting.
      </Text>
      
      <Text style={styles.paragraph}>
        Where your complaint is about an employee, we may consider it necessary to hold a meeting with the 
        alleged bully or harasser to hear that person's version of events. In these circumstances the 
        alleged bully or harasser may also be accompanied by a work colleague.
      </Text>
      
      <Text style={styles.paragraph}>
        Irrespective of whether your complaint is ultimately upheld, all those involved have the right to 
        expect that the matter will be dealt with confidentially. During the investigation, you, any 
        witnesses and the alleged bully or harasser will be expected to act in confidence. Any breach of 
        confidence will be a disciplinary matter.
      </Text>
      
      <Text style={styles.paragraph}>
        We will write to you and the alleged bully or harasser, usually within ten working days of the 
        investigation meeting, confirming our findings and, where appropriate, our decision regarding the 
        complaint.
      </Text>
      
      <Text style={styles.subsection}>11.5 General Notes</Text>
      
      <Text style={styles.paragraph}>
        If the report concludes that the allegation is well-founded, we will invoke the appropriate action 
        against the bully or harasser.
      </Text>
    </View>
  );
};

export default Page35;

