"use client";
import React, { useState } from "react";

export default function ConflictOfInterestEditPage() {
  const formSchema = [
    { label: "Name", key: "name", type: "text" },
    { label: "Position", key: "position", type: "text" },
    { label: "Department", key: "department", type: "text" },
    { label: "Date", key: "date", type: "date" },
    { label: "Conflict of Interest", key: "conflict", type: "select", options: ["", "No", "Yes"] },
    { label: "Conflict Description", key: "conflictDescription", type: "textarea" },
    { label: "Vendor Relationship", key: "vendor", type: "select", options: ["", "No", "Yes"] },
    { label: "Vendor Relationship Details", key: "vendorDetails", type: "textarea" },
    { label: "Outside Employment", key: "employment", type: "select", options: ["", "No", "Yes"] },
    { label: "Outside Employment Details", key: "employmentDetails", type: "textarea" },
    { label: "Employee Signature", key: "employeeSignature", type: "text" },
    { label: "Employee Date", key: "employeeDate", type: "date" },
    { label: "Reviewed By", key: "reviewedBy", type: "text" },
    { label: "Reviewer Title", key: "reviewerTitle", type: "text" },
    { label: "Review Date", key: "reviewDate", type: "date" },
    { label: "Action Taken", key: "actionTaken", type: "textarea" },
    { label: "HR Decision", key: "hrDecision", type: "select", options: ["", "No Conflict", "Mitigation", "Further Review"] },
    { label: "Reviewer Signature", key: "reviewerSignature", type: "text" },
    { label: "Reviewer Date", key: "reviewerDate", type: "date" }
  ];

  const [formData, setFormData] = useState(() => {
    const initialData: any = {};
    formSchema.forEach(field => {
      initialData[field.key] = "";
    });
    return initialData;
  });

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev : any) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = () => {
    console.log("Form Data:", formData);
  };

  const renderInput = (field: any) => {
    const { label, key, type, options } = field;
    
    if (type === "select") {
      return (
        <div key={key} className="bg-white p-4 rounded-lg border shadow-sm">
          <label className="block mb-2 text-gray-700 font-medium">{label}</label>
          <select
            value={formData[key]}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {options.map((option: string) => (
              <option key={option} value={option}>
                {option || "Select an option"}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (type === "textarea") {
      return (
        <div key={key} className="bg-white p-4 rounded-lg border shadow-sm">
          <label className="block mb-2 text-gray-700 font-medium">{label}</label>
          <textarea
            value={formData[key]}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={`Enter ${label.toLowerCase()}`}
            rows={3}
          />
        </div>
      );
    }

    if (type === "date") {
      return (
        <div key={key} className="bg-white p-4 rounded-lg border shadow-sm">
          <label className="block mb-2 text-gray-700 font-medium">{label}</label>
          <input
            type="date"
            value={formData[key]}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      );
    }

    return (
      <div key={key} className="bg-white p-4 rounded-lg border shadow-sm">
        <label className="block mb-2 text-gray-700 font-medium">{label}</label>
        <input
          type="text"
          value={formData[key]}
          onChange={(e) => handleInputChange(key, e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Conflict of Interest Form</h1>
          <p className="text-gray-600 mb-8">Please fill out all required information below</p>
          
          <div className="space-y-6">
            {formSchema.map(field => renderInput(field))}
          </div>

          <div className="mt-8 pt-6 border-t">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Submit Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
