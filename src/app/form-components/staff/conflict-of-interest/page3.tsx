"use client";
import React from "react";

interface ConflictFormPage3Props {
  formData: Record<string, any>;
}

export default function ConflictFormPage3({ formData }: ConflictFormPage3Props) {
  return (
    <div className="bg-white text-black px-6 py-8 max-w-3xl mx-auto font-['Open_Sans']">
      <div className="flex justify-center mb-8">
        <img
          src="/infinity_logo.png"
          alt="Infinity Supports WA logo with stylized infinity symbol in muted red above text"
          className="w-[200px] h-[80px] object-contain"
          width={200}
          height={80}
        />
      </div>

      <div className="text-sm leading-relaxed text-justify">
        <p className="font-semibold mb-3">
          Section 4: Acknowledgment and Certification
        </p>
        <p className="mb-6">
          I certify that the information provided above is complete and accurate
          to the best of my knowledge. I understand that failure to disclose a
          potential conflict of interest may result in disciplinary action, up
          to and including termination of employment. If a potential conflict
          arises after signing this form, I will promptly notify Infinity
          Supports WA in writing.
        </p>

        <p className="font-semibold mb-1">
          Employee Signature: {formData.employeeSignature || "____________________________"}
        </p>
        <p className="font-semibold mb-6">
          Date: {formData.employeeDate || "_______________"}
        </p>

        <hr className="border-t border-gray-300 mb-6" />

        <p className="font-semibold mb-3">For HR/Management Use Only:</p>
        <p className="mb-1">
          Reviewed by: {formData.reviewedBy || "____________________________"}
        </p>
        <p className="mb-1">
          Title: {formData.reviewerTitle || "____________________________"}
        </p>
        <p className="mb-6">
          Date: {formData.reviewDate || "____________________________"}
        </p>

        <p className="mb-2">Action Taken (if applicable):</p>
        <div className="border border-gray-300 p-2 mb-6 min-h-[60px]">
          {formData.actionTaken || "____________________________"}
        </div>

        <div className="mb-6 space-y-2 text-sm">
          <label className="inline-flex items-center">
            <input className="form-checkbox" type="checkbox" checked={!!formData.decisionNoConflict} readOnly />
            <span className="ml-2">No conflict found</span>
          </label>
          <label className="inline-flex items-center">
            <input className="form-checkbox" type="checkbox" checked={!!formData.decisionMitigation} readOnly />
            <span className="ml-2">Conflict identified and mitigation plan implemented</span>
          </label>
          <label className="inline-flex items-center">
            <input className="form-checkbox" type="checkbox" checked={!!formData.decisionFurtherReview} readOnly />
            <span className="ml-2">Further review required</span>
          </label>
        </div>

        <p className="font-semibold mb-1">
          Signature of Reviewer: {formData.reviewerSignature || "____________________________"}
        </p>
        <p className="font-semibold">
          Date: {formData.reviewerDate || "_______________"}
        </p>
      </div>
    </div>
  );
}
