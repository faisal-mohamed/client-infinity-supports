import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  valuesImage: {
    width: 200,
    height: 160,
    objectFit: 'contain',
    marginBottom: 16,
  },
  valuesList: {
    width: '100%',
    maxWidth: 500,
  },
  valueItem: {
    fontSize: 11,
    lineHeight: 1.6,
    marginBottom: 16,
    textAlign: 'justify',
  },
});

interface Page4Props {
  images?: any;
}

const Page4: React.FC<Page4Props> = ({ images = {} }) => {
  // Use base64 if available, otherwise use path for browser
  const valuesSrc = images?.p4_1 || '/welcomeimg/p4-1.png';
  
  return (
    <View style={styles.container}>
      {/* Our Values graphic */}
      <Image src={valuesSrc} style={styles.valuesImage} />
      
      <View style={styles.valuesList}>
        <Text style={styles.valueItem}>
          <Text style={{ fontWeight: 'bold' }}>Individuals</Text> – Giving every individual a voice, 
          choice & control and the opportunity to live a fulfilled life.
        </Text>
        
        <Text style={styles.valueItem}>
          <Text style={{ fontWeight: 'bold' }}>Passion</Text> – We are passionate to listen and empower 
          people with disabilities to achieve their goals.
        </Text>
        
        <Text style={styles.valueItem}>
          <Text style={{ fontWeight: 'bold' }}>Integrity</Text> – We protect privacy of those we work 
          with whilst being always honest and transparent.
        </Text>
        
        <Text style={styles.valueItem}>
          <Text style={{ fontWeight: 'bold' }}>Respect</Text> – We embrace diversity. We believe in 
          inclusiveness and equality.
        </Text>
      </View>
    </View>
  );
};

export default Page4;

