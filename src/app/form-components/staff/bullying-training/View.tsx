"use client";

import React from 'react';
import BullyingTrainingAckView from './lastPageOnlyView';

export default function BullyingTrainingView({ excludeLastPage = false, children, data = {} }: { excludeLastPage?: boolean; children?: React.ReactNode; data?: any }) {
  console.log('🔵 [Bullying Training View] Rendering acknowledgement form only (no PDF pages)');
  
  return (
    <div className="bg-white w-full max-w-[900px] mx-auto rounded-xl shadow-lg border p-8">
      {/* Acknowledgement Form */}
      {children}
      <BullyingTrainingAckView data={data} />
    </div>
  );
}
