import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  visionImage: {
    width: 200,
    height: 130,
    objectFit: 'contain',
    marginBottom: 12,
  },
  visionText: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 1.5,
    marginBottom: 48,
    maxWidth: 320,
  },
  missionImage: {
    width: 280,
    height: 100,
    objectFit: 'contain',
    marginBottom: 12,
  },
  missionText: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 1.5,
    maxWidth: 320,
  },
});

interface Page3Props {
  images?: any;
}

const Page3: React.FC<Page3Props> = ({ images = {} }) => {
  // Use base64 if available, otherwise use paths for browser
  const visionSrc = images?.p3_1 || '/welcomeimg/p3-1.png';
  const missionSrc = images?.p3_2 || '/welcomeimg/p3-2.png';
  
  return (
    <View style={styles.container}>
      {/* Vision graphic */}
      <Image src={visionSrc} style={styles.visionImage} />
      
      <Text style={styles.visionText}>
        To work with people with disabilities to empower them to live their best lives by 
        employing a person-centred approach
      </Text>
      
      {/* Mission graphic */}
      <Image src={missionSrc} style={styles.missionImage} />
      
      <Text style={styles.missionText}>
        Our Mission is to assist individuals 'achieve goals and beyond'
      </Text>
    </View>
  );
};

export default Page3;

