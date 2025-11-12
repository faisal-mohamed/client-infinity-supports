import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 60,
  },
  logo: {
    width: 400,
    height: 200,
    objectFit: 'contain',
  },
});

interface Page1Props {
  images?: any;
}

const Page1: React.FC<Page1Props> = ({ images = {} }) => {
  // Use base64 if available (from download API), otherwise use path (for browser PDFViewer)
  const logoSrc = images?.clientLogo || '/client_logo.png';
  
  return (
    <View style={styles.container}>
      {/* Main title */}
      <Text style={styles.title}>EMPLOYEE WELCOME PACK</Text>
      
      {/* Subtitle */}
      <Text style={styles.subtitle}>HELPING YOU ACHIEVE GOALS AND BEYOND</Text>
      
      {/* Client logo image */}
      <Image src={logoSrc} style={styles.logo} />
    </View>
  );
};

export default Page1;

