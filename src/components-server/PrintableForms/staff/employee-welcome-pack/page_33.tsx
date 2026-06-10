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

const Page33: React.FC = () => {
  return (
    <View>
      <Text style={styles.paragraph}>
        We recognise that bullying and harassment can exist in the workplace, as well as outside, and that 
        this can seriously affect workers' working lives by detracting from a productive working environment 
        and can impact on the health, confidence, morale and performance of those affected by it, including 
        anyone who witnesses or has knowledge of the unwanted or unacceptable behaviour.
      </Text>
      
      <Text style={styles.subsection}>11.2 Harassment</Text>
      
      <Text style={styles.paragraph}>
        The intention of these procedures is to inform workers of the type of behaviour that is unacceptable 
        and to provide procedural guidance.
      </Text>
      
      <Text style={styles.paragraph}>
        We recognise that we have a duty to implement this policy and all workers are expected to comply 
        with it.
      </Text>
      
      <Text style={styles.paragraph}>
        Harassment is any unwanted physical, verbal or non-verbal conduct based on grounds of age, 
        disability, gender identity, marriage and civil partnership, pregnancy or maternity, race, religion 
        or belief, sex or sexual orientation which affects the dignity of anyone at work or creates an 
        intimidating, hostile, degrading, humiliating or offensive environment.
      </Text>
      
      <Text style={styles.paragraph}>
        A single incident of unwanted or offensive behaviour can amount to harassment.
      </Text>
      
      <Text style={styles.paragraph}>
        Harassment can take many forms and individuals may not always realise that their behaviour 
        constitutes harassment. Examples of harassment include:
      </Text>
      
      <Text style={styles.listItem}>* insensitive jokes and pranks;</Text>
      <Text style={styles.listItem}>* lewd or abusive comments about appearance;</Text>
      <Text style={styles.listItem}>* deliberate exclusion from conversations;</Text>
      <Text style={styles.listItem}>* displaying abusive or offensive writing or material;</Text>
      <Text style={styles.listItem}>* unwelcome touching; and</Text>
      <Text style={styles.listItem}>* abusive, threatening or insulting words or behaviour.</Text>
      
      <Text style={styles.paragraph}>
        These examples are not exhaustive and disciplinary action at the appropriate level will be taken 
        against employees committing any form of harassment. Appropriate action in relation to an employee 
        will include disciplinary action in accordance with the Employer's disciplinary and disciplinary 
        termination procedure. For other workers, appropriate action may include termination of their 
        engagement with the Employer.
      </Text>
    </View>
  );
};

export default Page33;

