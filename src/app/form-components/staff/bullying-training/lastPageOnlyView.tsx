"use client";

import React from 'react';

export default function BullyingTrainingAckView({ data = {} }: { data?: any }) {
  const acknowledgerName = data?.acknowledgerName || '';
  const hrFocusDate = data?.hrFocusDate || '';
  const staffName = data?.staffName || (data?.staff?.firstName && data?.staff?.surname 
    ? `${data.staff.firstName} ${data.staff.surname}` 
    : '');
  const staffSignature = data?.staffSignature || '';
  const date = data?.date || data?.staffSignedAt 
    ? new Date(data.date || data.staffSignedAt).toLocaleDateString('en-AU')
    : '';
  const managerName = data?.managerName || '';
  const managerSignature = data?.managerSignature || '';

  return (
    <div className="w-full flex justify-center">
      <div className="bg-white w-full max-w-[794px] min-h-[1123px] border shadow relative px-[96px] pt-12 pb-[112px] a4-ack">
        {/* Header with logo */}
        <div className="flex justify-center mt-2 mb-8">
          <img src="/client_full_logo.jpg" alt="Company Logo" className="h-16 object-contain" />
        </div>

        {/* Acknowledgment Statement */}
        <div className="mb-8">
          <p className="text-[12pt] leading-relaxed text-left">
            I{' '}
            <span className="inline-block border-b-2 border-black min-w-[200px] text-center mx-1">
              {acknowledgerName || '_________________'}
            </span>
            {' '}acknowledge that I completed{' '}
            <strong className="text-red-600">Bullying and harassment training</strong>
            {' '}conducted by Infinity Supports WA and HR Focus on{' '}
            <span className="inline-block border-b-2 border-black min-w-[150px] text-center mx-1">
              {hrFocusDate || '__________'}
            </span>
            . I also acknowledge that I have received training/study materials for the above-mentioned training.
          </p>
        </div>

        {/* Fields */}
        <div className="space-y-6 mt-12">
          {/* Staff Name */}
          <div>
            <div className="flex items-end">
              <span className="text-[12pt] font-medium mr-4">Staff Name:</span>
              <span className="flex-1 border-b-2 border-black pb-1 min-h-[24px]">
                {staffName || '_________________'}
              </span>
            </div>
          </div>

          {/* Staff Signature */}
          <div>
            <div className="flex items-start">
              <span className="text-[12pt] font-medium mr-4 mt-2">Staff Signature:</span>
              <div className="flex-1 border-b-2 border-black pb-1 min-h-[60px] flex items-center">
                {staffSignature ? (
                  <img 
                    src={staffSignature} 
                    alt="Staff Signature" 
                    className="max-h-12 object-contain"
                  />
                ) : (
                  <span>_________________</span>
                )}
              </div>
            </div>
          </div>

          {/* Date */}
          <div>
            <div className="flex items-end">
              <span className="text-[12pt] font-medium mr-4">Date:</span>
              <span className="flex-1 border-b-2 border-black pb-1 min-h-[24px]">
                {date || '_________________'}
              </span>
            </div>
          </div>

          {/* Manager's Name */}
          <div>
            <div className="flex items-end">
              <span className="text-[12pt] font-medium mr-4">Manager's Name:</span>
              <span className="flex-1 border-b-2 border-black pb-1 min-h-[24px]">
                {managerName || '_________________'}
              </span>
            </div>
          </div>

          {/* Manager's Signature */}
          <div>
            <div className="flex items-start">
              <span className="text-[12pt] font-medium mr-4 mt-2">Manager's Signature:</span>
              <div className="flex-1 border-b-2 border-black pb-1 min-h-[60px] flex items-center">
                {managerSignature ? (
                  <img 
                    src={managerSignature} 
                    alt="Manager Signature" 
                    className="max-h-12 object-contain"
                  />
                ) : (
                  <span>_________________</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
