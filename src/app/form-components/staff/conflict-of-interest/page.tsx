"use client";
import React, { useState } from "react";
import ConflictFormPage1 from "./page1";
import ConflictFormPage2 from "./page2";
import ConflictFormPage3 from "./page3";

export default function ConflictFormMain() {
  // formSchema.ts
 const formSchema = [
  { label: "Name", key: "name", type: "text" },
  { label: "Position", key: "position", type: "text" },
  { label: "Department", key: "department", type: "text" },
  { label: "Date", key: "date", type: "date" },
  { label: "Conflict (No)", key: "noConflict", type: "boolean" },
  { label: "Conflict (Yes)", key: "yesConflict", type: "boolean" },
  { label: "Conflict Description", key: "conflictDescription", type: "text" },

  { label: "Vendor Relationship (No)", key: "vendorNo", type: "boolean" },
  { label: "Vendor Relationship (Yes)", key: "vendorYes", type: "boolean" },
  { label: "Vendor Relationship Details", key: "vendorDetails", type: "text" },
  { label: "Outside Employment (No)", key: "employmentNo", type: "boolean" },
  { label: "Outside Employment (Yes)", key: "employmentYes", type: "boolean" },
  { label: "Outside Employment Details", key: "employmentDetails", type: "text" },

   { label: "Employee Signature", key: "employeeSignature", type: "text" },
  { label: "Employee Date", key: "employeeDate", type: "date" },
  { label: "Reviewed By", key: "reviewedBy", type: "text" },
  { label: "Reviewer Title", key: "reviewerTitle", type: "text" },
  { label: "Review Date", key: "reviewDate", type: "date" },
  { label: "Action Taken", key: "actionTaken", type: "text" },
  { label: "HR Decision - No Conflict", key: "decisionNoConflict", type: "boolean" },
  { label: "HR Decision - Mitigation", key: "decisionMitigation", type: "boolean" },
  { label: "HR Decision - Further Review", key: "decisionFurtherReview", type: "boolean" },
  { label: "Reviewer Signature", key: "reviewerSignature", type: "text" },
  { label: "Reviewer Date", key: "reviewerDate", type: "date" }
];

const formResponse = {
  "name": "",
  "position": "",
  "department": "",
  "date": "",
  "noConflict": false,
  "yesConflict": false,
  "conflictDescription": "",

    vendorNo: false,
  vendorYes: false,
  vendorDetails: "",
  employmentNo: false,
  employmentYes: false,
  employmentDetails: "",

    "employeeSignature": "",
  "employeeDate": "",
  "reviewedBy": "",
  "reviewerTitle": "",
  "reviewDate": "",
  "actionTaken": "",
  "decisionNoConflict": false,
  "decisionMitigation": false,
  "decisionFurtherReview": false,
  "reviewerSignature": "",
  "reviewerDate": ""

}

  return (
    <div className="space-y-8">
      {/* Page 1 */}
      <div className="w-[210mm] h-[297mm] bg-white p-8 mx-auto relative overflow-hidden">
       
        <div className="mt-8">
          <ConflictFormPage1 formData={formResponse} />
        </div>
      </div>

      {/* Page 2 */}
      <div className="w-[210mm] h-[297mm] bg-white p-8 mx-auto relative overflow-hidden">
    
        <div className="mt-8">
          <ConflictFormPage2 formData={formResponse} />
        </div>
      </div>

      {/* Page 3 */}
      <div className="w-[210mm] h-[297mm] bg-white p-8 mx-auto relative overflow-hidden">
     
        <div className="mt-8">
          <ConflictFormPage3 formData={formResponse} />
        </div>
      </div>
    </div>
  );
}
