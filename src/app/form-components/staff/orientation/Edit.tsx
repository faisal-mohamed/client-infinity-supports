"use client";

import React, { forwardRef } from 'react';
import OrientationView from './View';

export interface OrientationFormRef {
  // No specific methods needed for a read-only form
}

const OrientationEdit = forwardRef<OrientationFormRef, { token: string; onValidityChange?: (v: boolean) => void }>(
  function OrientationEdit({ token, onValidityChange }, ref) {
    // For a read-only form, validity is always true
    React.useEffect(() => {
      onValidityChange?.(true);
    }, [onValidityChange]);

    return (
      <div className="p-4">
        <OrientationView />
      </div>
    );
  }
);

export default OrientationEdit;
