"use client";

import React from "react";

interface NDISCodeOfConductViewProps {
  data?: any;
  excludeLastPage?: boolean;
  children?: React.ReactNode;
}

export default function NDISCodeOfConductView({ 
  data = {}, 
  excludeLastPage = false, 
  children 
}: NDISCodeOfConductViewProps) {
  return (
    <div className="bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Page 1 */}
        <div className="bg-white shadow-lg border border-gray-300 mb-6" style={{ minHeight: '1056px' }}>
          {/* Header */}
          <div className="flex border-b-2 border-black">
            <div className="w-1/2 border-r-2 border-black flex items-center justify-center p-6">
              <img
                src="/client_full_logo-bg-removed.png"
                alt="Infinity Supports WA logo"
                className="max-h-[160px] object-contain"
              />
            </div>
            <div className="w-1/2 bg-purple-600 flex items-center justify-center p-6">
              <h1 className="text-white font-bold text-3xl text-center leading-tight">
                NDIS Code of Conduct
              </h1>
            </div>
          </div>

          {/* Meta Information */}
          <div className="flex border-b border-gray-400 text-sm">
            <div className="w-1/2 border-r border-gray-400 p-3 text-gray-600">
              <strong>Doc No:</strong> NDIS Manual
            </div>
            <div className="w-1/4 border-r border-gray-400 p-3 text-gray-600">
              <strong>Version No:</strong> 01
            </div>
            <div className="w-1/4 p-3 text-gray-600">
              <strong>Version Date:</strong> 10/01/2024
            </div>
          </div>

          {/* Content - All NDIS Content */}
          <div className="px-8 py-6 text-sm leading-relaxed">
            <div className="mb-4">
              <p className="text-base">
                <span className="text-green-600 text-lg mr-2">✓</span>
                <span className="font-semibold text-red-600">Infinity Supports WA</span> and their workers are committed to following the NDIS Code of Conduct which is as per below:
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex">
                <span className="font-bold text-gray-700 mr-3 min-w-[20px]">1.</span>
                <p>Act with respect for individual rights for the freedom of expression, self-determination and decision-making with applicable laws and conventions.</p>
              </div>
              
              <div className="flex">
                <span className="font-bold text-gray-700 mr-3 min-w-[20px]">2.</span>
                <p>Respect the privacy of people with <span className="underline font-semibold">disability</span>.</p>
              </div>
              
              <div className="flex">
                <span className="font-bold text-gray-700 mr-3 min-w-[20px]">3.</span>
                <p>Provide <span className="underline font-semibold">supports</span> and services in a manner that is safely and competently, with care and skill.</p>
              </div>
              
              <div className="flex">
                <span className="font-bold text-gray-700 mr-3 min-w-[20px]">4.</span>
                <p>Act with integrity, honesty and transparency.</p>
              </div>
              
              <div className="flex">
                <span className="font-bold text-gray-700 mr-3 min-w-[20px]">5.</span>
                <p>Promptly take steps to raise and act on concerns about matters that may impact the quality and safety of supports and services provided to people with disability.</p>
              </div>
              
              <div className="flex">
                <span className="font-bold text-gray-700 mr-3 min-w-[20px]">6.</span>
                <p>Take all reasonable steps to prevent and respond to all forms of violence against exploitation, neglect, and abuse of people with disability.</p>
              </div>
              
              <div className="flex">
                <span className="font-bold text-gray-700 mr-3 min-w-[20px]">7.</span>
                <p>Take all reasonable steps to prevent and respond to sexual misconduct.</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm leading-relaxed">
                The NDIS Commission requires <span className="font-semibold text-red-600">Infinity Supports WA</span> to demonstrate honesty, integrity, and transparency in all their dealings. This extends to how they determine pricing for products and services offered to NDIS scheme participants, along with providing clear justifications for their pricing decisions. Additionally, providers are bound by the Australian Consumer Law (ACL), which prohibits misleading or deceptive conduct, false statements, and unfair contract terms, including those related to the pricing of goods and services, thus ensuring fair treatment of NDIS participants and plan managers.
              </p>
            </div>

            <div className="mb-6">

              <p className="mb-4">
                Price differentiation occurs when a provider charges NDIS participants a higher price for identical products, supports, or services compared to other customers. The recently updated NDIS Code of Conduct Provider and Worker Guidance (Guidance) (April 22nd, 2024) recognises price differentiation as a potential form of 'sharp practice'. The Commission expects NDIS providers to refrain from engaging in or endorsing such practices. This entails:
              </p>
              
              <ul className="list-disc list-inside space-y-3 ml-4">
                <li>
                  Avoiding charging participants more than others for essentially the same product, support, or service without valid justification.
                </li>
                <li>
                  Abstaining from promoting, advertising, or publicizing higher prices for essentially the same products, supports, or services for participants compared to others without valid justification.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Page 2 - Header and Signature Only */}
        <div className="bg-white shadow-lg border border-gray-300" style={{ minHeight: '1056px' }}>
          {/* Header - Same as Page 1 */}
          <div className="flex border-b-2 border-black">
            <div className="w-1/2 border-r-2 border-black flex items-center justify-center p-6">
              <img
                src="/client_full_logo-bg-removed.png"
                alt="Infinity Supports WA logo"
                className="max-h-[160px] object-contain"
              />
            </div>
            <div className="w-1/2 bg-purple-600 flex items-center justify-center p-6">
              <h1 className="text-white font-bold text-3xl text-center leading-tight">
                NDIS Code of Conduct
              </h1>
            </div>
          </div>

          {/* Meta Information - Same as Page 1 */}
          <div className="flex border-b border-gray-400 text-sm">
            <div className="w-1/2 border-r border-gray-400 p-3 text-gray-600">
              <strong>Doc No:</strong> NDIS Manual
            </div>
            <div className="w-1/4 border-r border-gray-400 p-3 text-gray-600">
              <strong>Version No:</strong> 01
            </div>
            <div className="w-1/4 p-3 text-gray-600">
              <strong>Version Date:</strong> 10/01/2024
            </div>
          </div>

          {/* Signature Section - Direct on Page */}
          <div className="px-8 py-6">
            <div className="mt-16">
              {/* Signature Fields - Direct on Page */}
              <div className="flex justify-between items-start gap-8">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Signature <span className="text-red-500">*</span></label>
                  <div className="border-b-2 border-gray-400 h-12 bg-transparent flex items-center">
                    {data?.signature ? (
                      <img src={data.signature} alt="Signature" className="max-h-8 max-w-full object-contain" />
                    ) : (
                      <span className="text-gray-400 text-xs">Signature required</span>
                    )}
                  </div>
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date <span className="text-red-500">*</span></label>
                  <div className="border-b-2 border-gray-400 h-12 bg-transparent flex items-center">
                    <span className="text-gray-700">{data?.date || 'Date required'}</span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Position <span className="text-red-500">*</span></label>
                  <div className="border-b-2 border-gray-400 h-12 bg-transparent flex items-center">
                    <span className="text-gray-700">{data?.position || 'Position required'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
