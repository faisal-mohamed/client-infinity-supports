import React from 'react';
import { View, Text, StyleSheet, Svg, Rect, Path } from '@react-pdf/renderer';

interface PDFCheckboxGroupProps {
  label: string;
  value?: string | boolean | null;
  trueLabel?: string;
  falseLabel?: string;
}

const normalizeValue = (value?: string | boolean | null) => {
  if (typeof value === 'string') return value.toLowerCase();
  if (value === true) return 'true';
  if (value === false) return 'false';
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
    marginBottom: 6,
  },
  label: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#111827',
    flexShrink: 0,
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
    fontSize: 9,
    color: '#0f172a',
  },
});

export default PDFCheckboxGroup;
