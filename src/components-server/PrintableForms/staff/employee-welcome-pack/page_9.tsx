import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';

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
  chartContainer: {
    marginBottom: 16,
    marginTop: 8,
    alignItems: 'center',
  },
  chartImage: {
    width: '100%',
    maxWidth: 500,
    objectFit: 'contain',
  },
});

interface Page9Props {
  images?: any;
}

const Page9: React.FC<Page9Props> = ({ images = {} }) => {
  // Use base64 if available (from download API), otherwise use path (for browser PDFViewer)
  const chartImageSrc = images?.organizationalChart || images?.image || '/image.png';
  
  return (
    <View>
      {/* Section 3: Joining the Organisation */}
      <Text style={styles.section}>3. Joining the Organisation</Text>
      
      <Text style={styles.subsection}>3.1 Organisational Chart</Text>
      
      {/* Organizational Chart Image */}
      <View style={styles.chartContainer}>
        <Image src={chartImageSrc} style={styles.chartImage} />
      </View>
      
      <Text style={styles.subsection}>3.2 Probationary Period</Text>
      <Text style={styles.paragraph}>
        The period of your probationary period is set out in your contract of employment. Casual employees 
        are not subject to a probationary period. During this period, your work performance and general 
        suitability will be assessed and, if it is satisfactory, your employment will continue. However, 
        if your work performance is assessed as generally unsuitable, the Employer may either take remedial 
        action (which may include the extension of your probationary period) or terminate your employment 
        at any time prior to confirmation of your employment. We reserve the right not to apply full 
        capability and disciplinary procedures during your probationary period.
      </Text>
    </View>
  );
};

export default Page9;


