"use client";

import React, { useEffect } from "react";

export default function NdisWorkforceCapabilityView({
  data = {},
  meta = { website: "", formId: "", reviewDate: "" },
}: {
  data?: any
  meta?: { website?: string; formId?: string; reviewDate?: string };
}) {

  useEffect(() => {
    console.log("data: ", data)
  }, [data])
  
  return (
    <div className="w-full flex justify-center">
      <div className="bg-white w-full max-w-[794px] min-h-[1123px] border shadow relative px-[96px] pt-12 pb-[112px] a4-ack">
        {/* Header with logo */}
        <div className="flex justify-center mt-2 mb-6">
          <img src="/client_full_logo.jpg" alt="Company Logo" className="h-16 object-contain" />
        </div>

        <h2 className="text-center font-semibold mb-6 text-[12pt]">
          NDIS Workforce Capability Framework Acknowledgement Form
        </h2>

        <p className="mb-4">
          I confirm I have received the NDIS Workforce Capability Framework from Infinity Supports and have read and
          understood the content.
        </p>
        <p className="mb-8">
          A printed version of this framework is also available. If you would like a printed version,
          please contact us.
        </p>

        <div className="space-y-6">
          {/* Acknowledgement Checkbox (read-only display) */}
          <div className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg bg-gray-50">
            <input
              id="readAcknowledgement"
              type="checkbox"
              checked={data?.readAcknowledgement || false}
              readOnly
              className="mt-1 w-5 h-5 text-rose-600 border-gray-300 rounded"
            />
            <label htmlFor="readAcknowledgement" className="text-[12pt] leading-relaxed">
              <strong>I acknowledge that:</strong>
              <br />• I have received the NDIS Workforce Capability Framework from Infinity Supports
              <br />• I have read and understood the content
              <br />• I agree to comply with all policies and procedures outlined in the framework
            </label>
          </div>

          {/* Name */}
          <div>
            <label className="block text-[12pt] mb-1">Name</label>
            <div className="w-full border-b border-black/60 px-1 py-2 text-gray-800">
              {data?.fullName || (data?.staff ? `${data.staff.firstName || ''} ${data.staff.surname || ''}`.trim() : '') || <span className="text-gray-400 italic">—</span>}
            </div>
          </div>

          {/* Signature */}
          <div className="mb-8">
            <label className="block text-[12pt] mb-2">Signature</label>
            {data?.signature || data?.staffSignature ? (
              <img
                src={data?.signature || data?.staffSignature}
                alt="Employee Signature"
                className="border max-h-20 bg-white"
              />
            ) : (
              <div className="text-gray-400 italic">No signature provided</div>
            )}
          </div>

          {/* Date */}
          <div className="mb-6">
            <label className="block text-[12pt] mb-1">Date</label>
            <div className="w-full border-b border-black/60 px-1 py-2 text-gray-800">
              {data?.date || (data?.staffSignedAt
                ? new Date(data?.staffSignedAt).toLocaleDateString("en-AU")
                : <span className="text-gray-400 italic">—</span>)}
            </div>
          </div>
        </div>

        {/* Footer - Only show if settings exist */}
        {(meta.website || meta.formId || meta.reviewDate) && (
          <div className="absolute bottom-6 left-[96px] right-[96px] text-[10pt] text-gray-600 flex items-center justify-between">
            {meta.website && <div>Website: {meta.website}</div>}
            {meta.formId && <div>{meta.formId}</div>}
            {meta.reviewDate && <div>Review Date: {meta.reviewDate}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
