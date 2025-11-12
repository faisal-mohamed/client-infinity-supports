"use client";

import React, { useEffect, useRef, useState } from 'react';
import EmployeeWelcomeAckView from './lastPageOnlyView';

export default function EmployeeWelcomeView({ excludeLastPage = false, children, data = {} }: { excludeLastPage?: boolean; children?: React.ReactNode; data?: any }) {
  console.log('🔵 [Employee Welcome] Rendering acknowledgement form only (no PDF pages)');
  
  return (
    <div className="bg-white w-full max-w-[900px] mx-auto rounded-xl shadow-lg border p-8">
      {/* Download Button at Top */}
      <div className="flex flex-col items-center mb-8 pb-6 border-b-2 border-gray-200">
        <p className="text-gray-700 text-center mb-4 text-sm">
          📄 Please download and read the Employee Welcome Pack before completing this acknowledgement form
        </p>
        <a
          href="/stafForms/Employee Welcome Pack.pdf"
          download="Employee_Welcome_Pack.pdf"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Employee Welcome Pack
        </a>
      </div>
      
      {/* Acknowledgement Form */}
      {children}
      <EmployeeWelcomeAckView data={data} />
    </div>
  );
}


