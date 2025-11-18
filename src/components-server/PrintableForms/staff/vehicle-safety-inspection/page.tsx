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
});

interface VehicleSafetyInspectionPDFProps {
  data?: any;
  staff?: any;
  settings?: any;
  images?: any;
}

const VehicleSafetyInspectionPDF: React.FC<VehicleSafetyInspectionPDFProps> = ({
  data = {},
  staff = {},
  settings = {},
  images = {},
}) => {
  const formData = data?.data || data || {};
  const staffName = `${staff.firstName || ''} ${staff.surname || ''}`.trim();

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
      <Text style={styles.sectionTitle}>Vehicle Safety Inspection Checklist</Text>
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
        <View style={[styles.subsectionNote, { borderBottom: '1 solid #d1d5db' }]}>
          <Text>Check operation and visibility of:</Text>
        </View>
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
      <Text style={styles.sectionTitle}>Vehicle Safety Inspection Checklist (Continued)</Text>
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
      <Text style={styles.sectionTitle}>Client Behavior Assessment</Text>
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
        {[1, 2, 3, 4, 5].map((num) => {
          const issue = getValue(`otherIssue${num}`);
          if (!issue) return null;
          return (
            <View key={num} style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={{ fontSize: 8 }}>{issue}</Text>
              </View>
              <View style={styles.tableCellYesNo}>
                {renderCheckbox(getYesNo(`otherIssue${num}Yes`) === 'yes')}
              </View>
              <View style={styles.tableCellYesNo}>
                {renderCheckbox(getYesNo(`otherIssue${num}Yes`) === 'no')}
              </View>
              <View style={styles.actionCell}>
                <Text style={{ fontSize: 7 }}>{getValue(`otherIssue${num}Action`)}</Text>
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
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCellLabel}>
            <Text>Return completed form to:</Text>
          </View>
          <View style={styles.tableCellInput}>
            <Text>{getValue('returnToPosition')}</Text>
            <Text>Position</Text>
          </View>
        </View>
      </View>

      <View style={styles.table} wrap={false}>
        <View style={styles.tableRow}>
          <View style={styles.tableCellLabel}>
            <Text>Reviewed by [name]:</Text>
          </View>
          <View style={styles.tableCellInput}>
            <Text>{getValue('reviewedByName')}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCellLabel}>
            <Text>Position:</Text>
          </View>
          <View style={styles.tableCellInput}>
            <Text>{getValue('reviewedByPosition')}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCellLabel}>
            <Text>Date:</Text>
          </View>
          <View style={styles.tableCellInput}>
            <Text>{formatDate(getValue('reviewedByDate'))}</Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 6 }}>
        <Text style={{ fontSize: 8 }}>
          Date for next inspection: {formatDate(getValue('nextInspectionDate'))}
        </Text>
      </View>
    </View>
  );

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
    </Document>
  );
};

export default VehicleSafetyInspectionPDF;

