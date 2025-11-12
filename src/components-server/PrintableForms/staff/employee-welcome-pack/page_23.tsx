import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
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
  bold: {
    fontWeight: 'bold',
  },
});

const Page23: React.FC = () => {
  return (
    <View>
      <Text style={styles.paragraph}>
        Incidents that relate to you may include, but are not necessarily limited to:
      </Text>
      
      <Text style={styles.listItem}>
        • an unexpected death, serious injury or alleged assault (including physical, sexual abuse, 
        sexual assault or indecent assault) that occurs as a result or during the delivery of services
      </Text>
      
      <Text style={styles.listItem}>
        • allegations of serious, unlawful or criminal activity or conduct involving [Organisation Name] 
        employee, subcontractor or volunteer that has caused, or has the potential to cause, serious harm 
        to you
      </Text>
      
      <Text style={styles.listItem}>
        • an incident where you assault or cause serious harm to others (including our employees, 
        volunteers or contractors), as a result, or during the delivery, of services
      </Text>
      
      <Text style={styles.listItem}>
        • a severe fire, natural disaster, accident or other incidents that will, or is likely to prevent 
        service provision, or that results in closure or significant damage to premises or property, or 
        that poses a substantial threat to your health and safety.
      </Text>
      
      <Text style={styles.paragraph}>
        Infinity Supports WA has established procedures that identify, manage and resolve incidents which 
        include:
      </Text>
      
      <Text style={styles.listItem}>
        • Staff members will report all incidents to the Infinity Supports WA
      </Text>
      
      <Text style={styles.listItem}>
        • completion of an incident report that identifies and records an incident
      </Text>
      
      <Text style={styles.listItem}>
        • the Infinity Supports WA is responsible for reporting incidents that are 'reportable incidents' 
        to the NDIS Commissioner and other required agencies
      </Text>
      
      <Text style={styles.listItem}>
        • compliance with the National Disability Insurance Scheme (Incident Management and Reportable) 
        Rules 2018
      </Text>
      
      <Text style={styles.listItem}>
        • supporting and assisting you if you are affected by the incident
      </Text>
      
      <Text style={styles.listItem}>
        • review of the incident by the Infinity Supports WA if you or others were affected
      </Text>
      
      <Text style={styles.listItem}>
        • collaborating with you, your family and/or advocate to manage and resolve the Incident
      </Text>
      
      <Text style={styles.listItem}>
        • reviewing the incident and making necessary amendments to systems and processes to reduce the 
        risk of recurrence.
      </Text>
      
      <Text style={styles.paragraph}>
        Infinity Supports WA will put in place appropriate preventive measures to mitigate further harm 
        or injury as necessary. As part of the investigation process, the incident scene and evidence must 
        be preserved until its conclusion. (In situations such as assisting an injured
      </Text>
    </View>
  );
};

export default Page23;

