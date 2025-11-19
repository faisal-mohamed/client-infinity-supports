import React from 'react';
import { View, Text, StyleSheet, Svg, Rect, Path } from '@react-pdf/renderer';
import { PDF_FONT_SIZES, PDF_SPACING, PDF_LINE_HEIGHTS, PDF_COLORS, PDF_FONT_FAMILY, PDF_FONT_FAMILY_BOLD } from '../styles/commonPDFStyles';

interface PDFCheckboxGroupProps {
  label: string;
  value?: string | boolean | number | null;
  trueLabel?: string;
  falseLabel?: string;
}

const normalizeValue = (value?: string | boolean | number | null) => {
  // Handle boolean
  if (value === true) return 'true';
  if (value === false) return 'false';
  
  // Handle string
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    if (lower === 'true' || lower === 'yes' || lower === '1') return 'true';
    if (lower === 'false' || lower === 'no' || lower === '0') return 'false';
    return lower; // Return lowercase for other strings
  }
  
  // Handle number
  if (typeof value === 'number') {
    if (value === 1) return 'true';
    if (value === 0) return 'false';
  }
  
  return '';
};

export const CheckboxItem: React.FC<{ checked: boolean; label: string }> = ({ checked, label }) => (
  <View style={styles.optionItem}>
    <Svg width={12} height={12} style={styles.checkboxSvg}>
      <Rect
        x={0.5}
        y={0.5}
        width={11}
        height={11}
        rx={2}
        ry={2}
        stroke="#1d4ed8"
        strokeWidth={1}
        fill={checked ? '#1d4ed8' : '#ffffff'}
      />
      {checked && (
        <Path
          d="M3 6.3 L5.2 8.5 L9 3.8"
          stroke="#ffffff"
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </Svg>
    <Text style={styles.optionLabel}>{label}</Text>
  </View>
);

const PDFCheckboxGroup: React.FC<PDFCheckboxGroupProps> = ({
  label,
  value,
  trueLabel = 'Yes',
  falseLabel = 'No',
}) => {
  const normalized = normalizeValue(value);
  const isTrue = normalized === 'true';
  const isFalse = normalized === 'false';

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.options}>
        <CheckboxItem checked={isTrue} label={trueLabel} />
        <CheckboxItem checked={isFalse} label={falseLabel} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: PDF_SPACING.fieldMarginBottom,
  },
  label: {
    fontSize: PDF_FONT_SIZES.label,
    fontWeight: 'bold',
    fontFamily: PDF_FONT_FAMILY_BOLD,
    color: PDF_COLORS.text,
    flexShrink: 0,
    lineHeight: PDF_LINE_HEIGHTS.label,
  },
  options: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  checkboxSvg: {
    marginTop: 1,
  },
  optionLabel: {
    fontSize: PDF_FONT_SIZES.body,
    fontFamily: PDF_FONT_FAMILY,
    color: PDF_COLORS.text,
    lineHeight: PDF_LINE_HEIGHTS.body,
  },
});

export default PDFCheckboxGroup;
