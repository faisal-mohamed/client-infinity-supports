import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

// Standardized table styles based on Client Intake Form architecture
const tableStyles = StyleSheet.create({
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: 10,
    breakInside: 'avoid',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#d1d5db', // bg-gray-300 equivalent
    borderBottom: '1 solid #000000',
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
    paddingHorizontal: 2,
    textAlign: 'left',
    borderRight: '1 solid #000000',
  },
  tableHeaderCellSpan: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
    paddingHorizontal: 2,
    textAlign: 'left',
    backgroundColor: '#d1d5db',
    paddingVertical: 4,
    borderBottom: '1 solid #000000',
    borderTop: '1 solid #000000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #000000',
    minHeight: 20,
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
    color: '#000000',
    paddingHorizontal: 2,
    paddingVertical: 2,
    textAlign: 'left',
    borderRight: '1 solid #000000',
    lineHeight: 1.2,
  },
  tableCellSpan: {
    fontSize: 9,
    color: '#000000',
    paddingHorizontal: 2,
    paddingVertical: 2,
    textAlign: 'left',
    borderBottom: '1 solid #000000',
    lineHeight: 1.2,
  },
  tableCellTextarea: {
    fontSize: 9,
    color: '#000000',
    paddingHorizontal: 2,
    paddingVertical: 4,
    textAlign: 'left',
    borderBottom: '1 solid #000000',
    lineHeight: 1.2,
    minHeight: 40,
  },
});

interface TableColumn {
  key: string;
  label: string;
  width?: number;
  type?: 'text' | 'textarea';
}

interface TableRow {
  [key: string]: string | number;
}

interface TableComponentProps {
  columns: TableColumn[];
  data: TableRow[];
  title?: string;
  showHeader?: boolean;
}

export const TableComponent: React.FC<TableComponentProps> = ({
  columns,
  data,
  title,
  showHeader = true
}) => {
  return (
    <View style={tableStyles.table}>
      {title && (
        <View style={tableStyles.tableHeaderCellSpan}>
          <Text style={tableStyles.tableHeaderCellSpan}>{title}</Text>
        </View>
      )}
      
      {showHeader && (
        <View style={tableStyles.tableHeader}>
          {columns.map((column, index) => (
            <Text
              key={column.key}
              style={[
                tableStyles.tableHeaderCell,
                index === columns.length - 1 && { borderRight: 'none' }
              ]}
            >
              {column.label}
            </Text>
          ))}
        </View>
      )}
      
      {data.map((row, rowIndex) => (
        <View key={rowIndex} style={tableStyles.tableRow}>
          {columns.map((column, colIndex) => (
            <Text
              key={column.key}
              style={[
                column.type === 'textarea' ? tableStyles.tableCellTextarea : tableStyles.tableCell,
                colIndex === columns.length - 1 && { borderRight: 'none' }
              ]}
            >
              {String(row[column.key] || '')}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
};

// Specialized table for Support Information (like Client Intake Form)
export const SupportInfoTable: React.FC<{
  data: {
    pbsSupportPlanIncluded?: string;
    restrictivePractices?: string;
    organizationName?: string;
    contactPersonOrg?: string;
    contactNumberOrg?: string;
  };
}> = ({ data }) => {
  const supportData = [
    { label: 'PBS Support Plan included?', value: data.pbsSupportPlanIncluded || 'No' },
    { label: 'Any Restrictive Practices?', value: data.restrictivePractices || 'No' },
    { label: 'Name of organization:', value: data.organizationName || 'Not specified' },
    { label: 'Contact person:', value: data.contactPersonOrg || 'Not specified' },
    { label: 'Contact number:', value: data.contactNumberOrg || 'Not specified' },
  ];

  return (
    <View style={tableStyles.table}>
      {supportData.map((item, index) => (
        <View key={index} style={tableStyles.tableRow}>
          <Text style={[tableStyles.tableCell, { flex: 2, fontWeight: 'bold' }]}>
            {item.label}
          </Text>
          <Text style={[tableStyles.tableCell, { flex: 3, borderRight: 'none' }]}>
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default TableComponent;

