import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    paddingTop: 70,
    paddingBottom: 40,
    paddingLeft: 40,
    paddingRight: 40,
    fontFamily: 'Helvetica',
    fontSize: 9,
    lineHeight: 1.3,
  },
  header: {
    position: 'absolute',
    top: 20,
    left: 40,
    right: 40,
    alignItems: 'center',
  },
  headerLogo: {
    width: 120,
    height: 40,
    objectFit: 'contain',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#111827',
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#111827',
  },
  table: {
    width: '100%',
    border: '1 solid #d1d5db',
    marginBottom: 6,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #d1d5db',
    minHeight: 18,
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    fontWeight: 'bold',
    fontSize: 8,
    padding: 4,
    borderRight: '1 solid #d1d5db',
  },
  tableHeaderItem: {
    flex: 2.5,
  },
  tableHeaderYesNo: {
    flex: 0.6,
    textAlign: 'center',
  },
  tableHeaderAction: {
    flex: 2,
  },
  tableCell: {
    fontSize: 8,
    padding: 4,
    borderRight: '1 solid #d1d5db',
    color: '#111827',
    flex: 2.5,
  },
  tableCellYesNo: {
    fontSize: 8,
    padding: 2,
    borderRight: '1 solid #d1d5db',
    flex: 0.6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableCellLabel: {
    fontSize: 8,
    padding: 4,
    borderRight: '1 solid #d1d5db',
    backgroundColor: '#f9fafb',
    fontWeight: 'bold',
    flex: 1,
    color: '#374151',
  },
  tableCellInput: {
    fontSize: 8,
    padding: 4,
    flex: 1,
    color: '#111827',
    minHeight: 16,
  },
  checkbox: {
    width: 8,
    height: 8,
    border: '1 solid #9ca3af',
    margin: 'auto',
  },
  checkboxChecked: {
    width: 8,
    height: 8,
    border: '1 solid #2563eb',
    backgroundColor: '#2563eb',
    margin: 'auto',
  },
  subsectionHeader: {
    backgroundColor: '#f3f4f6',
    padding: 4,
    fontSize: 9,
    fontWeight: 'bold',
    borderBottom: '1 solid #d1d5db',
    flexDirection: 'row',
  },
  subsectionNote: {
    fontSize: 7,
    color: '#6b7280',
    padding: 3,
    fontStyle: 'italic',
    backgroundColor: '#fafafa',
  },
  actionCell: {
    fontSize: 7,
    padding: 3,
    borderRight: '1 solid #d1d5db',
    flex: 2,
    color: '#111827',
    minHeight: 20,
    wrap: true,
  },
  // Acknowledgment form styles
  paragraph: {
    fontSize: 11,
    marginBottom: 12,
    lineHeight: 1.5,
    color: '#111827',
  },
  acknowledgementBox: {
    border: '1 solid #d1d5db',
    borderRadius: 4,
    padding: 12,
    marginBottom: 20,
    backgroundColor: '#f9fafb',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  ackCheckbox: {
    width: 12,
    height: 12,
    border: '1 solid #9ca3af',
    marginRight: 8,
    marginTop: 2,
  },
  ackCheckboxChecked: {
    width: 12,
    height: 12,
    border: '1 solid #2563eb',
    backgroundColor: '#2563eb',
    marginRight: 8,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 1.5,
    color: '#374151',
  },
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#111827',
  },
  fieldLine: {
    borderBottom: '1 dotted #111827',
    paddingBottom: 4,
    minHeight: 20,
  },
  fieldValue: {
    fontSize: 11,
    color: '#111827',
  },
  signatureBox: {
    border: '1 dotted #111827',
    minHeight: 60,
    padding: 8,
    marginTop: 6,
    backgroundColor: '#ffffff',
  },
});

interface VehicleSafetyInspectionPDFProps {
  data?: any;
  staff?: any;
  settings?: any;
  images?: any;
  acknowledgmentOnly?: boolean;
}

const VehicleSafetyInspectionPDF: React.FC<VehicleSafetyInspectionPDFProps> = ({
  data = {},
  staff = {},
  settings = {},
  images = {},
  acknowledgmentOnly = false,
}) => {
  console.log('🔵 [PDF Component] VehicleSafetyInspectionPDF rendering:', {
    acknowledgmentOnly,
    acknowledgmentOnlyType: typeof acknowledgmentOnly,
    acknowledgmentOnlyValue: acknowledgmentOnly,
    hasData: !!data,
    hasStaff: !!staff,
    dataKeys: Object.keys(data || {}),
    formDataKeys: Object.keys(data?.data || {}),
    acknowledgmentData: !!(data?.data?.acknowledgmentData || data?.acknowledgmentData),
    fullDataStructure: JSON.stringify(data, null, 2).substring(0, 500) // First 500 chars for debugging
  });
  
  const formData = data?.data || data || {};
  const staffName = `${staff.firstName || ''} ${staff.surname || ''}`.trim();
  
  console.log('🔵 [PDF Component] Extracted formData:', {
    formDataKeys: Object.keys(formData),
    hasAcknowledgmentData: !!formData.acknowledgmentData,
    acknowledgmentDataKeys: formData.acknowledgmentData ? Object.keys(formData.acknowledgmentData) : [],
    hasSignature: !!formData.signature,
    hasStaffSignature: !!formData.staffSignature
  });

  // Helper functions
  const getValue = (key: string): string => {
    return formData[key] || '';
  };

  const getYesNo = (key: string): 'yes' | 'no' | '' => {
    const value = formData[key];
    if (value === 'yes' || value === true) return 'yes';
    if (value === 'no' || value === false) return 'no';
    return '';
  };

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-AU');
    } catch {
      return dateStr;
    }
  };

  const renderCheckbox = (checked: boolean) => {
    return (
      <View style={checked ? styles.checkboxChecked : styles.checkbox}>
        {checked && <Text style={{ fontSize: 7, color: '#ffffff', fontWeight: 'bold' }}>✓</Text>}
      </View>
    );
  };

  const renderHeader = () => {
    if (!images?.infinityLogo) return null;
    return (
      <View style={styles.header} fixed>
        <Image src={images.infinityLogo} style={styles.headerLogo} />
      </View>
    );   
  };


  // Driver Information Section
  const renderDriverInformation = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Driver Information</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCellLabel}>
            <Text>Driver</Text>
          </View>
          <View style={styles.tableCellInput}>
            <Text>{getValue('driver')}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCellLabel}>
            <Text>Licence number</Text>
          </View>
          <View style={styles.tableCellInput}>
            <Text>{getValue('licenceNumber')}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCellLabel}>
            <Text>Plant ID No</Text>
          </View>
          <View style={styles.tableCellInput}>
            <Text>{getValue('plantIdNo')}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCellLabel}>
            <Text>Vehicle registration</Text>
          </View>
          <View style={styles.tableCellInput}>
            <Text>{getValue('vehicleRegistration')}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCellLabel}>
            <Text>Insurance policy</Text>
          </View>
          <View style={styles.tableCellInput}>
            <Text>{getValue('insurancePolicy')}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCellLabel}>
            <Text>Date of inspection</Text>
          </View>
          <View style={styles.tableCellInput}>
            <Text>{formatDate(getValue('dateOfInspection'))}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  // Inspection Checklist Row
  const renderInspectionRow = (item: string, field: string, actionField: string) => {
    const yesNo = getYesNo(field);
    return (
      <View style={styles.tableRow}>
        <View style={styles.tableCell}>
          <Text style={{ fontSize: 8 }}>{item}</Text>
        </View>
        <View style={styles.tableCellYesNo}>
          {renderCheckbox(yesNo === 'yes')}
        </View>
        <View style={styles.tableCellYesNo}>
          {renderCheckbox(yesNo === 'no')}
        </View>
        <View style={styles.actionCell}>
          <Text style={{ fontSize: 7 }}>{getValue(actionField)}</Text>
        </View>
      </View>
    );
  };

  // Inspection Checklist Section
  const renderInspectionChecklist = () => (
    <View style={styles.section}>
      <View style={styles.table}>
        {/* Header */}
        <View style={[styles.tableRow, { backgroundColor: '#f3f4f6' }]}>
          <View style={[styles.tableHeader, styles.tableHeaderItem]}>
            <Text>Item</Text>
          </View>
          <View style={[styles.tableHeader, styles.tableHeaderYesNo]}>
            <Text>Yes</Text>
          </View>
          <View style={[styles.tableHeader, styles.tableHeaderYesNo]}>
            <Text>No</Text>
          </View>
          <View style={[styles.tableHeader, styles.tableHeaderAction]}>
            <Text>Action To Be Taken</Text>
          </View>
        </View>

        {/* Lights Section */}
        <View style={[styles.subsectionHeader, { borderBottom: '1 solid #d1d5db' }]}>
          <Text>Lights</Text>
        </View>
        {renderInspectionRow('Check operation and visibility of:', 'checkOperationVisibility', 'checkOperationVisibilityAction')}
        {renderInspectionRow('Headlights', 'headlights', 'headlightsAction')}
        {renderInspectionRow('Parking lights', 'parkingLights', 'parkingLightsAction')}

        {/* Indicators/Blinker Section */}
        <View style={[styles.subsectionHeader, { borderBottom: '1 solid #d1d5db' }]}>
          <Text>Indicators/blinker</Text>
        </View>
        {renderInspectionRow('Hazard lights', 'hazardLights', 'hazardLightsAction')}
        {renderInspectionRow('Brake lights', 'brakeLights', 'brakeLightsAction')}
        {renderInspectionRow('Reverse lights', 'reverseLights', 'reverseLightsAction')}
        <View style={[styles.subsectionNote, { borderBottom: '1 solid #d1d5db' }]}>
          <Text>If trailer attached:</Text>
        </View>
        {renderInspectionRow('Parking lights', 'trailerParkingLights', 'trailerParkingLightsAction')}

        {/* Brakes and Warnings Section */}
        <View style={[styles.subsectionHeader, { borderBottom: '1 solid #d1d5db' }]}>
          <Text>Brakes and Warnings</Text>
        </View>
        {renderInspectionRow('Check operation of handbrake', 'handbrake', 'handbrakeAction')}
        {renderInspectionRow('Check for firm brake pedal', 'brakePedal', 'brakePedalAction')}
        {renderInspectionRow('Check operation of horn', 'horn', 'hornAction')}

        {/* Interior Section */}
        <View style={[styles.subsectionHeader, { borderBottom: '1 solid #d1d5db' }]}>
          <Text>Interior</Text>
        </View>
        {renderInspectionRow("'No Smoking' signs displayed prominently", 'noSmokingSigns', 'noSmokingSignsAction')}
      </View>
    </View>
  );

  // Additional Inspection Items
  const renderAdditionalInspection = () => (
    <View style={styles.section}>
      <View style={styles.table}>
        {/* Header */}
        <View style={[styles.tableRow, { backgroundColor: '#f3f4f6' }]}>
          <View style={[styles.tableHeader, styles.tableHeaderItem]}>
            <Text>Item</Text>
          </View>
          <View style={[styles.tableHeader, styles.tableHeaderYesNo]}>
            <Text>Yes</Text>
          </View>
          <View style={[styles.tableHeader, styles.tableHeaderYesNo]}>
            <Text>No</Text>
          </View>
          <View style={[styles.tableHeader, styles.tableHeaderAction]}>
            <Text>Action To Be Taken</Text>
          </View>
        </View>

        {/* General Vehicle Interior/Safety */}
        {renderInspectionRow('Internal cleanliness maintained, including upholstery', 'internalCleanliness', 'internalCleanlinessAction')}
        {renderInspectionRow('Cargo barrier in place, where appropriate', 'cargoBarrier', 'cargoBarrierAction')}
        {renderInspectionRow('Safety belts in good order', 'safetyBelts', 'safetyBeltsAction')}

        {/* Exterior Section */}
        <View style={[styles.subsectionHeader, { borderBottom: '1 solid #d1d5db' }]}>
          <Text>Exterior</Text>
        </View>
        {renderInspectionRow('Any damage to body work noted', 'bodyDamage', 'bodyDamageAction')}
        {renderInspectionRow('Windscreen in good order and clean', 'windscreen', 'windscreenAction')}
        {renderInspectionRow('Windscreen wipers and washers operating', 'wipersWashers', 'wipersWashersAction')}
        {renderInspectionRow('Water in windscreen washer reservoir', 'washerReservoir', 'washerReservoirAction')}
        {renderInspectionRow('Tyre tread checked for wear', 'tyreTread', 'tyreTreadAction')}
        {renderInspectionRow('Treads matching for front and rear tyres', 'treadMatching', 'treadMatchingAction')}
        {renderInspectionRow('Tyre pressure checked', 'tyrePressure', 'tyrePressureAction')}

        {/* General Safety Section */}
        <View style={[styles.subsectionHeader, { borderBottom: '1 solid #d1d5db' }]}>
          <Text>General Safety</Text>
        </View>
        {renderInspectionRow('System in place for reporting problems', 'reportingSystem', 'reportingSystemAction')}
        {renderInspectionRow('Servicing as required', 'servicing', 'servicingAction')}

        {/* First Aid Kit Section */}
        <View style={[styles.subsectionHeader, { borderBottom: '1 solid #d1d5db' }]}>
          <Text>First Aid Kit, Sunscreen, Insect Repellent</Text>
        </View>
        {renderInspectionRow('Contents assessed in compliance with first aid requirements', 'firstAidContents', 'firstAidContentsAction')}
        {renderInspectionRow('Container and contents clean and orderly', 'firstAidClean', 'firstAidCleanAction')}
        {renderInspectionRow('System in place to replenish kit items', 'firstAidReplenish', 'firstAidReplenishAction')}
        {renderInspectionRow('Expiry dates checked', 'expiryDatesChecked', 'expiryDatesCheckedAction')}
        {renderInspectionRow('Out of date items disposed of', 'outOfDateDisposed', 'outOfDateDisposedAction')}

        {/* Transportation of Clients Section */}
        <View style={[styles.subsectionHeader, { borderBottom: '1 solid #d1d5db' }]}>
          <Text>Transportation of Clients</Text>
        </View>
        {renderInspectionRow('Wheelchair hoist fitted, if required', 'wheelchairHoist', 'wheelchairHoistAction')}
        {renderInspectionRow('Appropriate for the transport of clients', 'appropriateForClients', 'appropriateForClientsAction')}
        {renderInspectionRow('Facility to secure clients appropriately', 'secureClients', 'secureClientsAction')}
      </View>
    </View>
  );

  // Client Behavior Assessment
  const renderClientBehaviorAssessment = () => (
    <View style={styles.section}>
      <View style={styles.table}>
        {/* Header */}
        <View style={[styles.tableRow, { backgroundColor: '#f3f4f6' }]}>
          <View style={[styles.tableHeader, styles.tableHeaderItem]}>
            <Text>Item</Text>
          </View>
          <View style={[styles.tableHeader, styles.tableHeaderYesNo]}>
            <Text>Yes</Text>
          </View>
          <View style={[styles.tableHeader, styles.tableHeaderYesNo]}>
            <Text>No</Text>
          </View>
          <View style={[styles.tableHeader, styles.tableHeaderAction]}>
            <Text>Action To Be Taken</Text>
          </View>
        </View>

        {renderInspectionRow('Client behaviour while travelling in a vehicle is known', 'clientBehaviourKnown', 'clientBehaviourKnownAction')}

        {/* Other Issues Section */}
        <View style={[styles.subsectionHeader, { borderBottom: '1 solid #d1d5db' }]}>
          <Text>Other Issues</Text>
        </View>
        {[1, 2, 3, 4].map((num) => {
          const issue = getValue(`otherIssue${num}`);
          return (
            <View key={num} style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={{ fontSize: 8 }}>{issue || ''}</Text>
              </View>
              <View style={styles.tableCellYesNo}>
                {renderCheckbox(getYesNo(`otherIssue${num}Yes`) === 'yes')}
              </View>
              <View style={styles.tableCellYesNo}>
                {renderCheckbox(getYesNo(`otherIssue${num}Yes`) === 'no')}
              </View>
              <View style={styles.actionCell}>
                <Text style={{ fontSize: 7 }}>{getValue(`otherIssue${num}Action`) || ''}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );

  // Review Section
  const renderReviewSection = () => (
    <View style={styles.section}>
      <View style={{ marginBottom: 12, flexDirection: 'row', alignItems: 'flex-end', flexWrap: 'nowrap' }}>
        <Text style={{ fontSize: 9, marginRight: 4 }}>Return completed form to :</Text>
        <View style={{ flex: 1, borderBottom: '1 dotted #111827', minHeight: 18, paddingBottom: 2, marginRight: 8 }}>
          <Text style={{ fontSize: 9 }}>{getValue('returnTo') || ''}</Text>
        </View>
        <Text style={{ fontSize: 9 }}>Position</Text>
      </View>

      <View style={styles.table} wrap={false}>
        <View style={styles.tableRow}>
          <View style={styles.tableCellLabel}>
            <Text>Reviewed by [name]:</Text>
          </View>
          <View style={styles.tableCellInput}>
            <Text>{getValue('reviewedByName') || ''}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCellLabel}>
            <Text>Position:</Text>
          </View>
          <View style={styles.tableCellInput}>
            <Text>{getValue('reviewedByPosition') || ''}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCellLabel}>
            <Text>Date:</Text>
          </View>
          <View style={styles.tableCellInput}>
            <Text>{formatDate(getValue('reviewedByDate')) || ''}</Text>
          </View>
        </View>
      </View>

      <View style={styles.table} wrap={false}>
        <View style={styles.tableRow}>
          <View style={styles.tableCellLabel}>
            <Text>Date for next inspection:</Text>
          </View>
          <View style={styles.tableCellInput}>
            <Text>{formatDate(getValue('nextInspectionDate')) || ''}</Text>
          </View>
        </View>
      </View>
    </View>
  );


  const renderAcknowledgmentPage = () => {
    console.log('🔵 [PDF Component] renderAcknowledgmentPage called');
    console.log('🔵 [PDF Component] formData:', {
      hasAcknowledgmentData: !!formData.acknowledgmentData,
      acknowledgmentDataKeys: formData.acknowledgmentData ? Object.keys(formData.acknowledgmentData) : [],
      hasSignature: !!formData.signature,
      hasStaffSignature: !!formData.staffSignature
    });
    
    const ackData = formData.acknowledgmentData || {};
    const acknowledged = ackData.acknowledged || false;
    const acknowledgmentDate = ackData.acknowledgmentDate || '';
    const signature = ackData.signature || formData.signature || formData.staffSignature || '';
    
    console.log('🔵 [PDF Component] Acknowledgment data extracted:', {
      acknowledged,
      acknowledgmentDate,
      hasSignature: !!signature,
      signatureLength: signature?.length || 0,
      ackDataKeys: Object.keys(ackData)
    });
    
    // Format date for display
    const formatAckDate = (dateStr: string): string => {
      if (!dateStr) return '';
      try {
        const date = new Date(dateStr);
        const formatted = date.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
        console.log('🔵 [PDF Component] Date formatted:', dateStr, '->', formatted);
        return formatted;
      } catch (e) {
        console.warn('⚠️ [PDF Component] Date formatting error:', e, dateStr);
        return dateStr;
      }
    };

    return (
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        
        <Text style={styles.title}>Vehicle Safety Inspection Checklist – Acknowledgement</Text>
        
        <Text style={styles.paragraph}>
          I confirm that I have received, read, and understood the Vehicle Safety Inspection Checklist document provided to me by Infinity Supports WA. I understand the inspection requirements and procedures outlined in the document.
        </Text>
        
        <Text style={styles.paragraph}>
          I acknowledge that it is my responsibility to conduct vehicle safety inspections in accordance with the checklist and to report any issues or concerns identified during inspections.
        </Text>

        {/* Acknowledgment Box */}
        <View style={styles.acknowledgementBox}>
          <View style={styles.checkboxRow}>
            <View style={acknowledged ? styles.ackCheckboxChecked : styles.ackCheckbox}>
              {acknowledged && <Text style={{ fontSize: 8, color: '#ffffff', fontWeight: 'bold' }}>✓</Text>}
            </View>
            <Text style={styles.checkboxText}>
              <Text style={{ fontWeight: 'bold' }}>I acknowledge that:</Text>{'\n'}
              • I have received the Vehicle Safety Inspection Checklist from Infinity Supports WA{'\n'}
              • I have read and understood the inspection requirements and procedures{'\n'}
              • I will conduct vehicle safety inspections in accordance with the checklist{'\n'}
              • I will report any issues or concerns identified during inspections
            </Text>
          </View>
        </View>

        {/* Name Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Name *</Text>
          <View style={styles.fieldLine}>
            <Text style={styles.fieldValue}>{staffName || 'N/A'}</Text>
          </View>
        </View>

        {/* Date Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Date *</Text>
          <View style={styles.fieldLine}>
            <Text style={styles.fieldValue}>{formatAckDate(acknowledgmentDate)}</Text>
          </View>
        </View>

        {/* Signature Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Signature *</Text>
          <View style={styles.signatureBox}>
            {signature ? (
              <Image src={signature} style={{ width: '100%', maxHeight: 60, objectFit: 'contain' }} />
            ) : (
              <Text style={{ fontSize: 9, color: '#9ca3af', fontStyle: 'italic' }}>
                Signature not provided
              </Text>
            )}
          </View>
        </View>
      </Page>
    );
  };

  // If acknowledgmentOnly is true, render only the acknowledgment page
  console.log('🔵 [PDF Component] Checking acknowledgmentOnly flag:', {
    acknowledgmentOnly,
    isTrue: acknowledgmentOnly === true,
    type: typeof acknowledgmentOnly,
    willEnterIfBlock: acknowledgmentOnly === true
  });
  
  if (acknowledgmentOnly === true) {
    console.log('✅ [PDF Component] acknowledgmentOnly is TRUE - entering acknowledgment-only mode');
    console.log('🔵 [PDF Component] Checking for acknowledgment data in formData:', {
      formDataKeys: Object.keys(formData),
      hasAcknowledgmentData: !!formData.acknowledgmentData,
      acknowledgmentDataValue: formData.acknowledgmentData,
      hasSignature: !!formData.signature,
      hasStaffSignature: !!formData.staffSignature,
      staffSignatureValue: formData.staffSignature ? 'EXISTS' : 'NULL'
    });
    
    const hasAcknowledgment = formData.acknowledgmentData || formData.signature || formData.staffSignature;
    console.log('🔵 [PDF Component] Final acknowledgment check result:', {
      hasAcknowledgment,
      hasAcknowledgmentData: !!formData.acknowledgmentData,
      hasSignature: !!formData.signature,
      hasStaffSignature: !!formData.staffSignature,
      acknowledgmentDataKeys: formData.acknowledgmentData ? Object.keys(formData.acknowledgmentData) : [],
      willRenderAcknowledgment: !!hasAcknowledgment
    });
    
    if (!hasAcknowledgment) {
      console.warn('⚠️ [PDF Component] No acknowledgment data found, returning empty document');
      // Return empty document if no acknowledgment data
      return (
        <Document>
          <Page size="A4" style={styles.page}>
            {renderHeader()}
            <Text style={styles.title}>Vehicle Safety Inspection Checklist – Acknowledgement</Text>
            <Text style={styles.paragraph}>No acknowledgment form has been completed yet.</Text>
          </Page>
        </Document>
      );
    }
    console.log('✅ [PDF Component] Rendering acknowledgment page ONLY (acknowledgmentOnly mode)');
    return (
      <Document>
        {renderAcknowledgmentPage()}
      </Document>
    );
  }
  
  console.log('🔵 [PDF Component] acknowledgmentOnly is FALSE - rendering FULL checklist with all pages');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Text style={styles.title}>Vehicle Safety Inspection Checklist</Text>
        {renderDriverInformation()}
        {renderInspectionChecklist()}
      </Page>

      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Text style={styles.title}>Vehicle Safety Inspection Checklist</Text>
        {renderAdditionalInspection()}
      </Page>

      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Text style={styles.title}>Vehicle Safety Inspection Checklist</Text>
        {renderClientBehaviorAssessment()}
        {renderReviewSection()}
      </Page>

      {/* Acknowledgment Page - NOT included in staff downloads, only shown when acknowledgmentOnly=true */}
    </Document>
  );
};

export default VehicleSafetyInspectionPDF;

