"use client";

import React from 'react';

export default function BullyingTrainingAckView({ data = {} }: { data?: any }) {
  return (
    <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Bullying Training Acknowledgment
          </h3>
          <p className="text-gray-600">
            I acknowledge that I completed <strong className="text-red-600">Bullying training</strong> conducted by Infinity Supports WA.
          </p>
          <p className="text-gray-600 mt-2">
            I also acknowledge that I have received training/study materials for the above-mentioned training.
          </p>
        </div>

        <div className="space-y-4">
          {/* Staff Name */}
          <div className="flex items-center">
            <span className="font-medium text-gray-700 w-32">Staff Name:</span>
            <span className="flex-1 border-b border-gray-400 pb-1 min-h-[24px]">
              {data?.staffName || data?.staff?.firstName && data?.staff?.surname 
                ? `${data.staff.firstName} ${data.staff.surname}` 
                : '_________________'}
            </span>
          </div>

          {/* Staff Signature */}
          <div className="flex items-start">
            <span className="font-medium text-gray-700 w-32 mt-2">Staff Signature:</span>
            <div className="flex-1 border-b border-gray-400 pb-1 min-h-[60px]">
              {data?.staffSignature ? (
                <img 
                  src={data.staffSignature} 
                  alt="Staff Signature" 
                  className="max-h-12 object-contain"
                />
              ) : (
                <span className="text-gray-400 italic">No signature provided</span>
              )}
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center">
            <span className="font-medium text-gray-700 w-32">Date:</span>
            <span className="flex-1 border-b border-gray-400 pb-1 min-h-[24px]">
              {data?.date || data?.staffSignedAt 
                ? new Date(data.date || data.staffSignedAt).toLocaleDateString()
                : '_________________'}
            </span>
          </div>

          {/* Manager Name */}
          <div className="flex items-center">
            <span className="font-medium text-gray-700 w-32">Manager's Name:</span>
            <span className="flex-1 border-b border-gray-400 pb-1 min-h-[24px]">
              {data?.managerName || '_________________'}
            </span>
          </div>

          {/* Manager Signature */}
          <div className="flex items-start">
            <span className="font-medium text-gray-700 w-32 mt-2">Manager's Signature:</span>
            <div className="flex-1 border-b border-gray-400 pb-1 min-h-[60px]">
              {data?.managerSignature ? (
                <img 
                  src={data.managerSignature} 
                  alt="Manager Signature" 
                  className="max-h-12 object-contain"
                />
              ) : (
                <span className="text-gray-400 italic">No signature provided</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>This acknowledgment confirms completion of the Bullying Training program.</p>
        </div>
      </div>
    </div>
  );
}
