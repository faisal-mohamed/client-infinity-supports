import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2563eb',
  },
  tocRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '1 dotted #9ca3af',
    paddingBottom: 2,
    marginBottom: 3,
    fontSize: 10,
  },
  tocRowIndent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '1 dotted #9ca3af',
    paddingBottom: 2,
    marginBottom: 3,
    paddingLeft: 12,
    fontSize: 10,
  },
});

const Page5: React.FC = () => {
  return (
    <View>
      <Text style={styles.heading}>Contents</Text>
      
      <View style={styles.tocRow}>
        <Text>1. Introduction</Text>
        <Text>7</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>1.1 Welcome</Text>
        <Text>7</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>1.2 Purpose of this Employee Handbook</Text>
        <Text>7</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>1.3 Principle of Equality</Text>
        <Text>7</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>1.4 General</Text>
        <Text>7</Text>
      </View>
      <View style={styles.tocRow}>
        <Text>2. Code of Conduct</Text>
        <Text>8</Text>
      </View>
      <View style={styles.tocRow}>
        <Text>3. Joining the Organisation</Text>
        <Text>9</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>3.1 Organisational Chart</Text>
        <Text>9</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>3.2 Probationary Period</Text>
        <Text>9</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>3.3 Hours of Work</Text>
        <Text>10</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>3.4 Punctuality</Text>
        <Text>10</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>3.5 Employee Training</Text>
        <Text>10</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>3.6 Induction</Text>
        <Text>11</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>3.7 Job Description</Text>
        <Text>11</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>3.8 Performance and Review</Text>
        <Text>11</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>3.9 Convictions and Offenses</Text>
        <Text>11</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>3.10 First Aid Certification</Text>
        <Text>11</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>3.11 Workplaces Policies</Text>
        <Text>12</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>3.12 Conflicts of interest</Text>
        <Text>12</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>3.13 Privacy</Text>
        <Text>12</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>3.14 Mobile Phone Usage & Social Media</Text>
        <Text>13</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>3.15 Dress and Appearance</Text>
        <Text>13</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>3.16 Whistleblowers</Text>
        <Text>14</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>3.17 EAP</Text>
        <Text>14</Text>
      </View>
      <View style={styles.tocRow}>
        <Text>4. Salaries and Wages</Text>
        <Text>15</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>4.1 Renumeration</Text>
        <Text>15</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>4.2 Tax</Text>
        <Text>15</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>4.3 Pay reviews</Text>
        <Text>15</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>4.4 Superannuation</Text>
        <Text>15</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>4.5 Shortage of Work</Text>
        <Text>15</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>4.6 Stand Down</Text>
        <Text>15</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>4.7 Annual Leave</Text>
        <Text>16</Text>
      </View>
      <View style={styles.tocRowIndent}>
        <Text>4.9 Personal Leave Entitlements</Text>
        <Text>16</Text>
      </View>
    </View>
  );
};

export default Page5;

