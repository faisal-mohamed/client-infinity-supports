"use client";

import React, { forwardRef } from 'react';
import VehicleSafetyInspectionView from './View';

export interface VehicleSafetyInspectionFormRef {
  // No specific methods needed for a read-only form
}

const VehicleSafetyInspectionEdit = forwardRef<VehicleSafetyInspectionFormRef, { token: string; onValidityChange?: (v: boolean) => void }>(
  function VehicleSafetyInspectionEdit({ token, onValidityChange }, ref) {
    // For a read-only form, validity is always true
    React.useEffect(() => {
      onValidityChange?.(true);
    }, [onValidityChange]);

    return (
      <div className="p-4">
        <VehicleSafetyInspectionView />
      </div>
    );
  }
);

export default VehicleSafetyInspectionEdit;
