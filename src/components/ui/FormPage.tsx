"use client";

import React from 'react';

interface FormPageProps {
  children: React.ReactNode;
  title?: string;
  showTitle?: boolean;
  meta?: {
    website?: string | null;
    version?: string | null;
    reviewDate?: string | null;
  };
}

export default function FormPage({ children, title, showTitle = true, meta }: FormPageProps) {
  const usingCustomMeta = !!meta;
  const finalMeta = usingCustomMeta
    ? {
        website: meta?.website ?? '',
        version: meta?.version ?? '',
        reviewDate: meta?.reviewDate ?? '',
      }
    : {
        website: 'infinitysupportswa.org',
        version: 'S1004',
        reviewDate: '01/03/2005',
      }

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString('en-AU');
    } catch {
      return date;
    }
  };

  const shouldRenderFooter =
    usingCustomMeta ? !!(finalMeta.website || finalMeta.version || finalMeta.reviewDate) : true;

  return (
    <div className="bg-white w-full max-w-[794px] mx-auto sm:min-h-[1123px] border shadow p-4 sm:p-8 print:p-6 flex flex-col">
      {/* Header with Logo and Company Name */}
      <div className="text-center mb-6">
        <div className="flex justify-center items-center gap-4 mb-4">
          <img src="/infinity_logo.png" alt="Infinity Support WA" className="h-16 w-auto" />
        </div>
        {showTitle && title && (
          <h2 className="text-4xl font-bold text-gray-900">{title}</h2>
        )}
      </div>

      {/* Content - Full width with proper margins from logo/footer */}
      <div className="flex-1 w-full px-2 sm:px-6">
        {children}
      </div>

      {/* Footer - Fixed at bottom */}
      {shouldRenderFooter && (
        <div className="mt-auto pt-4 text-[10px] text-gray-600 grid grid-cols-3">
          <div>{finalMeta.website ? `Website: ${finalMeta.website}` : ''}</div>
          <div className="text-center">{finalMeta.version || ''}</div>
          <div className="text-right">
            {finalMeta.reviewDate ? `Review Date: ${formatDate(finalMeta.reviewDate)}` : ''}
          </div>
        </div>
      )}
    </div>
  );
}
