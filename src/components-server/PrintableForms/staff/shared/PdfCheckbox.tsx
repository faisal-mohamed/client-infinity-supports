import React from 'react';
import { Text, View } from '@react-pdf/renderer';

export type PdfCheckboxVariant = 'outline';

export interface PdfCheckboxProps {
  checked: boolean;
  size?: number; // points
  variant?: PdfCheckboxVariant;
  /**
   * Character to render when checked.
   * Use "X" to match staff forms requirement.
   */
  mark?: string;
}

/**
 * Reusable checkbox for React-PDF.
 * Renders a square outline and an "X" when checked.
 *
 * Note: CSS does not affect PDFs; use this component in PDF generators.
 */
export default function PdfCheckbox({
  checked,
  size = 12,
  variant = 'outline',
  mark = 'X',
}: PdfCheckboxProps) {
  const boxStyle = {
    width: size,
    height: size,
    borderWidth: 1,
    borderColor: '#2563eb', // blue-600
    backgroundColor: '#ffffff',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  };

  const markStyle = {
    fontSize: Math.max(Math.floor(size * 0.85), 8),
    lineHeight: 1,
    color: '#2563eb', // blue-600
    fontWeight: 700 as const,
  };

  if (variant !== 'outline') {
    // Future-proof if we add variants later.
  }

  return (
    <View style={boxStyle}>
      {checked ? <Text style={markStyle}>{mark}</Text> : <Text style={{ fontSize: 1 }}> </Text>}
    </View>
  );
}

