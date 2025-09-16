"use client";
import React from "react";

interface ConflictFormPage2Props {
  formData: Record<string, any>;
}

export default function ConflictFormPage2({ formData }: ConflictFormPage2Props) {
  return (
    <div className="bg-white">
      <div className="max-w-3xl mx-auto px-6 pt-10">
        <div className="flex justify-center mb-10">
          <img
            src="/infinity_logo.png"
            alt="Infinity Supports WA logo with a pink infinity symbol above the text 'Infinity Supports WA' and tagline 'Achieving Goals and Beyond' in smaller pink text below"
            className="w-[200px] h-[80px] object-contain"
            width={200}
            height={80}
          />
        </div>

        <div className="text-sm text-gray-900 font-sans">
          {/* Vendor Relationship */}
          <div className="mb-6">
            <label className="inline-flex items-center space-x-2">
              <input
                className="form-checkbox border border-gray-400 rounded-sm"
                type="checkbox"
                checked={!!formData.vendorNo}
                readOnly
              />
              <span>No</span>
            </label>

            <label className="inline-flex items-start space-x-2 mt-3">
              <input
                className="form-checkbox border border-gray-400 rounded-sm mt-1"
                type="checkbox"
                checked={!!formData.vendorYes}
                readOnly
              />
              <span>Yes (If yes, please describe the relationship below.)</span>
            </label>

            <div className="mt-4 border border-gray-400 p-2 min-h-[80px] text-sm">
              {formData.vendorDetails || "____________________________"}
            </div>
          </div>

          {/* Outside Employment */}
          <div>
            <p className="font-bold text-xs mb-2">
              Section 3: Outside Employment or Business Activities
            </p>
            <p className="text-xs mb-4 max-w-xl">
              Are you engaged in any outside employment, consulting, or business
              activities that may impact your role at Infinity Supports WA?
            </p>

            <label className="inline-flex items-center space-x-2">
              <input
                className="form-checkbox border border-gray-400 rounded-sm"
                type="checkbox"
                checked={!!formData.employmentNo}
                readOnly
              />
              <span>No</span>
            </label>

            <label className="inline-flex items-start space-x-2 mt-3">
              <input
                className="form-checkbox border border-gray-400 rounded-sm mt-1"
                type="checkbox"
                checked={!!formData.employmentYes}
                readOnly
              />
              <span>Yes (If yes, please describe below.)</span>
            </label>

            <div className="mt-4 border border-gray-400 p-2 min-h-[80px] text-sm">
              {formData.employmentDetails || "____________________________"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
