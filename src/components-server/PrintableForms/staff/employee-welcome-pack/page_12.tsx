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

const Page12: React.FC = () => {
  return (
    <View>
      <Text style={styles.subsection}>3.11 Workplaces Policies</Text>
      
      <Text style={styles.paragraph}>
      The employer may from time to time have workplace practices and policies in place which deal with a variety of matters concerning how the workplace operates, procedures to be followed and expectations in relation to aspects of business. The purpose of these policies is to make clear what the employer expects from you in relation to the aspect of the business dealt with by the policy. You are required to be familiar with contents of all such policies and to always comply with their terms. Any failure to do so may result in disciplinary action. 
If you are uncertain of where these policies are located or what obligations they impose, you have an express obligation to raise this with your manager. Your manager will then provide you with or direct you to the required information. 

      </Text>
      
      <Text style={styles.paragraph}>
        If you are uncertain about any workplace policy or your obligations in respect of a particular 
        policy, you should raise this with your manager who will take steps to ensure that you are 
        provided with the information you need.
      </Text>
      
      <Text style={styles.redItalic}>
        Policies and procedures are available on website www.infinitysupportswa.org. A copy can also 
        be provided on written request from staff.
      </Text>
      
      <Text style={styles.subsection}>3.12 Conflicts of interest</Text>
      
      <Text style={styles.paragraph}>
      You are required to immediately disclose any potential, perceived or actual conflict 
      of interest (whether direct or indirect) that may give rise to a conflict with the 
      performance of your employment obligations to the employer, or the employer’s business
       or reputational interests. The employer may require you to take action to eliminate or 
       reduce any such conflict. If in the opinion of the employer you fail or refuse to
        declare any such conflict, or to resolve it in a manner satisfactory to the employer 
        in accordance with its directions, then notwithstanding any other provision of this
         contract, the employer may terminate your employment. 

      </Text>
      
      <Text style={styles.redItalic}>
        Conflict of interest form will be provided on written request from staff.
      </Text>
      
      <Text style={styles.subsection}>3.13 Privacy</Text>
      
      <Text style={styles.paragraph}>
      You consent to the employer collecting and using personal information and sensitive 
      personal information as defined in the Privacy Act 1988 (Commonwealth) for any purpose
       relating to your employment with the employer. The personal information will be held
        in a secure location. 

      </Text>
      <Text style={styles.paragraph}>You also consent to the employer disclosing personal 
        information and sensitive personal information about you to other persons for reasons
         relating to your employment or for the employer’s business requirements. 
         These persons include the Australian Tax Office, superannuation fund trustees and 
         administrators, insurers, medical or occupational practitioners, 
         financial and legal advisers, potential purchasers on sale of business and law 
         enforcement bodies. 
      </Text>
    </View>
  );
};

export default Page12;

