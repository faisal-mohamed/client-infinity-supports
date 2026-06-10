"use client";
import React from "react";

interface ConflictFormPage1Props {
  formData: Record<string, any>;
}

export default function ConflictFormPage1({ formData }: ConflictFormPage1Props) {
  return (
    <div className="bg-white text-black px-6 py-6 max-w-3xl mx-auto font-['Open_Sans']">
      <div className="flex justify-center mb-2">
        <img
          src="/infinity_logo.png"
          alt="Infinity Supports WA logo with stylized infinity symbol in muted red above text"
          className="w-[150px] h-[70px] object-contain"
          width={200}
          height={80}
        />
      </div>

      <p className="text-center text-[9px] font-semibold mb-4">
        Conflict of Interest Disclosure Form
      </p>

      <p className="font-bold mb-1">Employee Information:</p>
      <ul className="list-disc list-inside mb-6 space-y-2">
        <li>
          <span className="font-normal">
            Name: {formData.name || "____________________________"}
          </span>
        </li>
        <li>
          <span className="font-normal">
            Position: {formData.position || "____________________________"}
          </span>
        </li>
        <li>
          <span className="font-normal">
            Department: {formData.department || "____________________________"}
          </span>
        </li>
        <li>
          <span className="font-normal">
            Date: {formData.date || "____________________________"}
          </span>
        </li>
      </ul>

      <hr className="border-t border-azure-200 mb-6" />

      <p className="font-bold mb-2">
        Section 1: Disclosure of Potential Conflict of Interest
      </p>
      <p className="mb-4 text-sm">
        Do you have any financial, personal, or professional interests that may
        conflict, or appear to conflict, with your duties at Infinity Supports
        WA Pty Ltd?
      </p>

      <div className="mb-6 text-sm space-y-2">
        <div>
          <input
            className="align-middle"
            type="checkbox"
            checked={!!formData.noConflict}
            readOnly
          />
          <label className="align-middle ml-2">
            No, I do not have any conflicts to disclose.
          </label>
        </div>
        <div>
          <input
            className="align-middle"
            type="checkbox"
            checked={!!formData.yesConflict}
            readOnly
          />
          <label className="align-middle ml-2">
            Yes, I have a potential conflict to disclose. (Please provide
            details below.)
          </label>
        </div>
      </div>

      <p className="font-bold mb-2">
        Description of the potential conflict of interest:
      </p>
      <div className="border border-azure-200 p-2 mb-6 min-h-[80px] text-sm">
        {formData.conflictDescription || "____________________________"}
      </div>

      <p className="font-bold mb-2">
        Section 2: Relationships with Vendors, Clients, or Competitors
      </p>
      <p className="text-sm">
        Do you or any immediate family members have any financial interest,
        employment, or any other relationship with any vendors, clients, or
        competitors of Infinity Supports WA?
      </p>
    </div>
  );
}
