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
    paddingTop: 80,
    paddingBottom: 50, // Increased to make room for footer
    paddingLeft: 50,
    paddingRight: 50,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
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
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
    textAlign: 'center',
    color: '#111827',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 8,
    color: '#111827',
  },
  table: {
    width: '100%',
    border: '1 solid #d1d5db',
    marginBottom: 12,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #d1d5db',
    minHeight: 24,
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    fontWeight: 'bold',
    fontSize: 9,
    padding: 6,
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
    fontSize: 9,
    padding: 6,
    borderRight: '1 solid #d1d5db',
    color: '#111827',
    flex: 2.5,
    lineHeight: 1.4,
  },
  tableCellYesNo: {
    fontSize: 9,
    padding: 4,
    borderRight: '1 solid #d1d5db',
    flex: 0.6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableCellLabel: {
    fontSize: 9,
    padding: 6,
    borderRight: '1 solid #d1d5db',
    backgroundColor: '#f9fafb',
    fontWeight: 'bold',
    flex: 1,
    color: '#374151',
  },
  tableCellInput: {
    fontSize: 9,
    padding: 6,
    flex: 1,
    color: '#111827',
    minHeight: 20,
    lineHeight: 1.4,
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
    padding: 6,
    fontSize: 10,
    fontWeight: 'bold',
    borderBottom: '1 solid #d1d5db',
    flexDirection: 'row',
  },
  subsectionNote: {
    fontSize: 8,
    color: '#6b7280',
    padding: 5,
    fontStyle: 'italic',
    backgroundColor: '#fafafa',
    lineHeight: 1.4,
  },
  actionCell: {
    fontSize: 8,
    padding: 5,
    borderRight: '1 solid #d1d5db',
    flex: 2,
    color: '#111827',
    minHeight: 24,
    wrap: true,
    lineHeight: 1.4,
  },
  // Acknowledgment form styles
  paragraph: {
    fontSize: 11,
    marginBottom: 16,
    lineHeight: 1.6,
    color: '#111827',
  },
  acknowledgementBox: {
    border: '1 solid #d1d5db',
    borderRadius: 4,
    padding: 16,
    marginBottom: 24,
    marginTop: 8,
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
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111827',
  },
  fieldLine: {
    borderBottom: '1 dotted #111827',
    paddingBottom: 6,
    paddingTop: 4,
    minHeight: 24,
  },
  fieldValue: {
    fontSize: 11,
    color: '#111827',
    lineHeight: 1.5,
  },
  signatureBox: {
    border: '1 dotted #111827',
    minHeight: 70,
    padding: 12,
    marginTop: 8,
    backgroundColor: '#ffffff',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 8,
    color: '#6b7280',
    borderTop: '1 solid #e5e7eb',
    paddingTop: 6,
  },
  footerText: {
    fontSize: 8,
    color: '#6b7280',
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

  // Footer data from settings
  const footerWebsite = settings?.website || settings?.company_website;
  const footerId = settings?.vehicle_safety_inspection_form_id;
  const footerDate = settings?.vehicle_safety_inspection_review_date || settings?.review_date;
  const hasFooterData = footerWebsite || footerId || footerDate;

  console.log('🔍 [Vehicle Safety PDF] Footer data:', {
    hasSettings: !!settings,
    settingsKeys: Object.keys(settings || {}),
    footerWebsite,
    footerId,
    footerDate,
    hasFooterData,
  });

  const renderFooter = () => {
    if (!hasFooterData) return null;
    return (
      <View style={styles.footer} fixed>
        {footerWebsite && <Text style={styles.footerText}>Website: {footerWebsite}</Text>}
        {footerId && <Text style={styles.footerText}>{footerId}</Text>}
        {footerDate && <Text style={styles.footerText}>Review Date: {footerDate}</Text>}
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
          <Text style={{ fontSize: 9, lineHeight: 1.4 }}>{item}</Text>
        </View>
        <View style={styles.tableCellYesNo}>
          {renderCheckbox(yesNo === 'yes')}
        </View>
        <View style={styles.tableCellYesNo}>
          {renderCheckbox(yesNo === 'no')}
        </View>
        <View style={styles.actionCell}>
          <Text style={{ fontSize: 8, lineHeight: 1.4 }}>{getValue(actionField)}</Text>
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
                <Text style={{ fontSize: 9, lineHeight: 1.4 }}>{issue || ''}</Text>
              </View>
              <View style={styles.tableCellYesNo}>
                {renderCheckbox(getYesNo(`otherIssue${num}Yes`) === 'yes')}
              </View>
              <View style={styles.tableCellYesNo}>
                {renderCheckbox(getYesNo(`otherIssue${num}Yes`) === 'no')}
              </View>
              <View style={styles.actionCell}>
                <Text style={{ fontSize: 8, lineHeight: 1.4 }}>{getValue(`otherIssue${num}Action`) || ''}</Text>
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
      <View style={{ marginBottom: 16, flexDirection: 'row', alignItems: 'flex-end', flexWrap: 'nowrap' }}>
        <Text style={{ fontSize: 10, marginRight: 6 }}>Return completed form to :</Text>
        <View style={{ flex: 1, borderBottom: '1 dotted #111827', minHeight: 22, paddingBottom: 4, marginRight: 10 }}>
          <Text style={{ fontSize: 10 }}>{getValue('returnTo') || ''}</Text>
        </View>
        <Text style={{ fontSize: 10 }}>Position</Text>
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

        {renderFooter()}
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
            {renderFooter()}
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
        {renderFooter()}
      </Page>

      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Text style={styles.title}>Vehicle Safety Inspection Checklist</Text>
        {renderAdditionalInspection()}
        {renderFooter()}
      </Page>

      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Text style={styles.title}>Vehicle Safety Inspection Checklist</Text>
        {renderClientBehaviorAssessment()}
        {renderReviewSection()}
        {renderFooter()}
      </Page>

      {/* Acknowledgment Page - NOT included in staff downloads, only shown when acknowledgmentOnly=true */}
    </Document>
  );
};

export default VehicleSafetyInspectionPDF;

