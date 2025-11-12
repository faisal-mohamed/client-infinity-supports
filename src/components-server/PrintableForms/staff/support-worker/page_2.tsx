import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
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
  listItem: {
    fontSize: 9,
    lineHeight: 1.4,
    marginBottom: 3,
    paddingLeft: 10,
  },
});

const Page2: React.FC = () => {
  return (
    <View>
      {/* ALL content in ONE box - continuation from page 1 */}
      <View style={styles.contentBox}>
        {/* Continuation of Responsibilities for Position */}
        <Text style={styles.paragraph}>
        As a rule, Infinity Supports WA requires Support Workers to perform
         all tasks within the following guidelines:
        </Text>
        <Text style={styles.listItem}>• Perform all duties with professionalism and care.</Text>
        <Text style={styles.listItem}>
        • You must only work with one individual at a time unless agreed with your Line Manager and you are
         working in a 'Group Setting'.

        </Text>
        
        {/* General Responsibilities */}
        <Text style={styles.listItem}>
        • At all times, work under general guidance from the person seeking support or their family, 
        within clearly defined guidelines. This means that the tasks you undertake should be clearly explained to you, with guidance given should you need it as you go.

        </Text>
        <Text style={styles.listItem}>
        • You are responsible for managing your time, and for planning and organising activities on support.
        </Text>
        <Text style={styles.listItem}>
        • You may be asked to work with limited supervision. This is appropriate if instructions on how to perform the task have been given in advance.
        </Text>
        <Text style={styles.listItem}>
        • Perform activities requiring the exercise of sound judgment, initiative, confidentiality, and sensitivity in the performance of work. However, guidance is available to you should you need it.
        </Text>
        <Text style={styles.listItem}>
        • Follow all Infinity Supports WA guidelines regarding incident reporting, mandatory reporting, providing feedback and flagging risks.

        </Text>
        
        {/* Specific Areas of Support */}
        <Text style={{ ...styles.paragraph, marginTop: 8 }}>
        Infinity Supports WA Support Workers may be asked to provide support in the following areas:
        </Text>
        
        <Text style={styles.listItem}>
        • Support Worker provides one on one support to client in their home or in a community setting.

        </Text>
        <Text style={styles.listItem}>
        • Provide support to a client to meet emotional and psychological needs.

        </Text>
        <Text style={styles.listItem}>
        • Provide care support which is responsive to the client's individual needs.

        </Text>
        <Text style={styles.listItem}>
        • Support Worker is required to conduct all manual handling tasks when required during provision 
        of transport of client. Individual care plan provides information and levels of assistance, 
        equipment/aids used to maintain client and support worker safety. 

        </Text>
        <Text style={styles.listItem}>
        • Always maintain the dignity and respect of the client.

        </Text>
        <Text style={styles.listItem}>
        • Always maintain the rights of the clients during service provision.

        </Text>
        <Text style={styles.listItem}>• Incident reporting as identified.</Text>
        <Text style={styles.listItem}>
        • The Support Worker ensures the clients safety and supervision during service provision. 

        </Text>
        <Text style={styles.listItem}>
        • Individualised care plan and documentation provides strategies to engage and communicate effectively 
        with the client to enhance service delivery. 

        </Text>
        <Text style={styles.listItem}>
        • Support Worker is required to maintain regular communication with the Service Delivery Manager.
        </Text>
        <Text style={styles.listItem}>
        • Maintain Workplace Health and Safety by adhering to the client's care plan. 

        </Text>
        <Text style={styles.listItem}>
        • Identification and reporting of hazards – environmental, mechanical, 
        and other potential hazards noted during service provision. 
        </Text>
        <Text style={styles.listItem}>
        • Use of PPE as identified on care plan and when extraordinary event occurs. 

        </Text>
        <Text style={styles.listItem}>
        • Comply with all policies and procedures relevant to performing tasks within a client's home.
        </Text>
        <Text style={styles.listItem}>
        • Required to perform and complete other duties as required keeping within a support workers scope of practice.
        </Text>
      </View>
    </View>
  );
};

export default Page2;

