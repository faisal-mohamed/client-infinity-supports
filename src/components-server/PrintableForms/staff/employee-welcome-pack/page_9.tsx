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
  chartContainer: {
    marginBottom: 16,
    marginTop: 8,
  },
  chartBox: {
    backgroundColor: '#0d9488',
    color: '#ffffff',
    padding: 6,
    borderRadius: 3,
    fontSize: 8,
    textAlign: 'center',
  },
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  chartRowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 2,
  },
  verticalLine: {
    borderLeft: '1 solid #6b7280',
    height: 8,
    width: 1,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  horizontalLine: {
    borderTop: '1 solid #6b7280',
    width: '100%',
    height: 1,
  },
  arrowDown: {
    width: 0,
    height: 0,
    borderLeft: '3 solid transparent',
    borderRight: '3 solid transparent',
    borderTop: '5 solid #6b7280',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});

const Page9: React.FC = () => {
  return (
    <View>
      {/* Section 3: Joining the Organisation */}
      <Text style={styles.section}>3. Joining the Organisation</Text>
      
      <Text style={styles.subsection}>3.1 Organisational Chart</Text>
      
      {/* Organizational Chart */}
      <View style={styles.chartContainer}>
        {/* Top Level: Company */}
        <View style={styles.chartRowCenter}>
          <View style={{ ...styles.chartBox, width: 160 }}>
            <Text>Infinity Support WA Pty Ltd</Text>
          </View>
        </View>
        
        {/* Vertical line from top */}
        <View style={styles.verticalLine} />
        
        {/* Horizontal line connecting to 3 branches */}
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <View style={{ width: '80%', borderTop: '1 solid #6b7280', marginVertical: 2 }} />
        </View>
        
        {/* Three vertical lines down */}
        <View style={styles.chartRow}>
          <View style={{ width: '30%', alignItems: 'center' }}>
            <View style={styles.verticalLine} />
            <View style={styles.arrowDown} />
          </View>
          <View style={{ width: '30%', alignItems: 'center' }}>
            <View style={styles.verticalLine} />
            <View style={styles.arrowDown} />
          </View>
          <View style={{ width: '30%', alignItems: 'center' }}>
            <View style={styles.verticalLine} />
            <View style={styles.arrowDown} />
          </View>
        </View>
        
        {/* Second Level: Directors & Nurse */}
        <View style={styles.chartRow}>
          <View style={{ width: '30%', alignItems: 'center' }}>
            <View style={{ ...styles.chartBox, width: 90 }}>
              <Text>Sharon Mays</Text>
              <Text>Director</Text>
            </View>
          </View>
          <View style={{ width: '30%', alignItems: 'center' }}>
            <View style={{ ...styles.chartBox, width: 90 }}>
              <Text>Nurse</Text>
              <Text>Consultant</Text>
            </View>
          </View>
          <View style={{ width: '30%', alignItems: 'center' }}>
            <View style={{ ...styles.chartBox, width: 90 }}>
              <Text>Anand Sekar</Text>
              <Text>Director</Text>
            </View>
          </View>
        </View>
        
        {/* Vertical lines down from each director */}
        <View style={styles.chartRow}>
          <View style={{ width: '30%', alignItems: 'center' }}>
            <View style={styles.verticalLine} />
            <View style={styles.arrowDown} />
          </View>
          <View style={{ width: '30%', alignItems: 'center' }}>
            <View style={styles.verticalLine} />
            <View style={styles.arrowDown} />
          </View>
          <View style={{ width: '30%', alignItems: 'center' }}>
            <View style={styles.verticalLine} />
            <View style={styles.arrowDown} />
          </View>
        </View>
        
        {/* Third Level: Main Departments */}
        <View style={styles.chartRow}>
          {/* Left: Service Delivery */}
          <View style={{ width: '30%', alignItems: 'center' }}>
            <View style={{ ...styles.chartBox, width: 90, marginBottom: 3 }}>
              <Text>Service</Text>
              <Text>Delivery</Text>
            </View>
            <View style={{ ...styles.verticalLine, height: 6 }} />
            <View style={styles.arrowDown} />
            <View style={{ ...styles.chartBox, width: 90 }}>
              <Text>Service</Text>
              <Text>coordinator</Text>
            </View>
          </View>
          
          {/* Middle: Support Workers */}
          <View style={{ width: '30%', alignItems: 'center' }}>
            <View style={{ ...styles.chartBox, width: 90 }}>
              <Text>Support</Text>
              <Text>Workers</Text>
            </View>
          </View>
          
          {/* Right: HR & Finance */}
          <View style={{ width: '30%', alignItems: 'center' }}>
            <View style={{ ...styles.chartBox, width: 90, marginBottom: 3 }}>
              <Text>Human</Text>
              <Text>Resources</Text>
            </View>
            <View style={{ ...styles.verticalLine, height: 6 }} />
            <View style={styles.arrowDown} />
            <View style={{ ...styles.chartBox, width: 90, marginBottom: 3 }}>
              <Text style={{ fontSize: 7 }}>Payroll, Finance</Text>
              <Text style={{ fontSize: 7 }}>and Accounting</Text>
            </View>
            <View style={{ ...styles.verticalLine, height: 6 }} />
            <View style={styles.arrowDown} />
            <View style={{ ...styles.chartBox, width: 90 }}>
              <Text style={{ fontSize: 7 }}>Registration &</Text>
              <Text style={{ fontSize: 7 }}>Compliance</Text>
            </View>
          </View>
        </View>
        
        {/* Lines to fourth level */}
        <View style={styles.chartRow}>
          <View style={{ width: '30%', alignItems: 'center' }}>
            <View style={{ ...styles.verticalLine, height: 6 }} />
            <View style={styles.arrowDown} />
          </View>
          <View style={{ width: '30%', alignItems: 'center' }}>
            <View style={{ ...styles.verticalLine, height: 6 }} />
            <View style={styles.arrowDown} />
          </View>
          <View style={{ width: '30%', alignItems: 'center' }}>
            <View style={{ ...styles.verticalLine, height: 6 }} />
            <View style={styles.arrowDown} />
          </View>
        </View>
        
        {/* Fourth Level: Sub-departments */}
        <View style={styles.chartRow}>
          {/* Left: Service Delivery sub-items */}
          <View style={{ width: '30%', alignItems: 'center' }}>
            <View style={{ ...styles.chartBox, width: 90, marginBottom: 2, fontSize: 7 }}>
              <Text>Client</Text>
              <Text>Onboarding</Text>
            </View>
            <View style={{ ...styles.chartBox, width: 90, marginBottom: 2, fontSize: 7 }}>
              <Text>Service</Text>
              <Text>Delivery</Text>
            </View>
            <View style={{ ...styles.chartBox, width: 90, fontSize: 7 }}>
              <Text>Quality and</Text>
              <Text>Safeguarding</Text>
            </View>
          </View>
          
          {/* Middle: Business Development */}
          <View style={{ width: '30%', alignItems: 'center' }}>
            <View style={{ ...styles.chartBox, width: 90, fontSize: 7 }}>
              <Text>Business</Text>
              <Text>Development &</Text>
              <Text>Marketing</Text>
            </View>
          </View>
          
          {/* Right: Accountant */}
          <View style={{ width: '30%', alignItems: 'center' }}>
            <View style={{ ...styles.chartBox, width: 90, fontSize: 7 }}>
              <Text>Accurate Tax</Text>
              <Text>Partners</Text>
              <Text>Accountant</Text>
            </View>
          </View>
        </View>
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


