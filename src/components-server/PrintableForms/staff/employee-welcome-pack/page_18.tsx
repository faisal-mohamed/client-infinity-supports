import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  section: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 12,
  },
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

const Page18: React.FC = () => {
  return (
    <View>
      <Text style={styles.subsection}>Return to Work</Text>
      
      <Text style={styles.paragraph}>
        You should notify your manager as soon as you know on which day you will be returning to work, 
        if this differs from a date of return previously notified. You may be required to provide a 
        certificate from your own doctor stating that you are fit to return to your duties. This will 
        always be required where you have suffered a workplace injury/illness that required medical 
        treatment. If you have been suffering from an infectious or contagious disease or illness such 
        as rubella or hepatitis, you must not report for work without clearance from your own doctor.
      </Text>
      
      <Text style={styles.section}>5. Disciplinary Procedure</Text>
      
      <Text style={styles.subsection}>5.1 Introduction</Text>
      
      <Text style={styles.paragraph}>
      This sets standards of performance and behaviour expected by the Employer, together with the 
      procedure to be followed in the event of disciplinary issues. The policy aims to help promote fairness and order
       in the treatment of individuals. It is the Employer’s aim that the rules and procedures should emphasise and encourage 
       improvement in the conduct of individuals where they are failing to meet the required standards, 
      and not be seen merely as a means of punishment. We reserve the right to amend these rules and procedures where appropriate. 
      </Text>
      
      <Text style={styles.paragraph}>
      Every effort will be made to ensure that any action taken under this procedure is fair,
       with you being given the opportunity to state your case.
      </Text>
      
      <Text style={styles.paragraph}>
      The following rules and procedures should ensure that: 
      </Text>
      
      <Text style={styles.listItem}>
        • the correct procedure is used when requiring you to attend a disciplinary hearing; 
      </Text>
      
      <Text style={styles.listItem}>
        • you are fully aware of the standards of performance, action and behaviour required of you;
      </Text>
      
      <Text style={styles.listItem}>
        • disciplinary action, where necessary, is taken speedily and in a fair, uniform and consistent manner; 
      </Text>
      
      <Text style={styles.listItem}>
        • you will only be disciplined after careful investigation of the facts and the opportunity to present your side of the case; 
      </Text>
      
      <Text style={styles.listItem}>
        • at all disciplinary hearings, rather than investigatory meetings, you have the right to be
         accompanied by a support person at all stages of the formal disciplinary process; 

      </Text>
      
      <Text style={styles.listItem}>
        • you will not normally be dismissed for a first breach of discipline, except in the case of serious 
misconduct; and if you are disciplined, you will receive an explanation of the penalty imposed. 

      </Text >
      <Text style={styles.paragraph}>On some occasions temporary suspension on contractual pay may be necessary in order 
        that an uninterrupted investigation can take place. This should not be regarded as disciplinary action 
        or a penalty of any kind. 
      </Text>
    </View>
  );
};

export default Page18;

