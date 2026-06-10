import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 11,
    lineHeight: 1.6,
    marginBottom: 10,
    textAlign: 'justify',
  },
});

const Page2: React.FC = () => {
  return (
    <View>
      <Text style={styles.header}>About Us</Text>
      
      <Text style={styles.paragraph}>
        Infinity Supports WA Pty Ltd was started by Sharon Birkett and Anand Sekar in 2021. 
        As individuals in the industry of supporting people with disabilities, we are both very 
        passionate about supporting individuals to live their best lives and achieve their life goals. 
        Everyone should be given the opportunity to the best quality individual support, and this was 
        our drive to develop Infinity Supports WA. We had identified areas we wanted to improve on and 
        listened to the individuals we had both worked with. From this information and the support of 
        some amazing support workers it is our vision to ensure we deliver services to our clients in 
        a person-centred manner.
      </Text>
    </View>
  );
};

export default Page2;

