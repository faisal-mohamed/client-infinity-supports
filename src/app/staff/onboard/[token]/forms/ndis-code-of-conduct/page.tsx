"use client";
import React, { useState } from "react";
import NDISCodeOfConduct from "../../../../../form-components/staff/code_of_conduct/page";

export default function NDISCodeOfConductEditPage() {
  const [formData, setFormData] = useState({
    signature: "",
    date: "",
    position: "",
  });

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = () => {
    console.log("Form Data:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">NDIS Code of Conduct Form</h1>
          <p className="text-gray-600 mb-8">Please fill out the required information below</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <label className="block mb-2 text-gray-700 font-medium">Signature</label>
              <input
                type="text"
                value={formData.signature}
                onChange={(e) => handleInputChange("signature", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your signature"
              />
            </div>

            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <label className="block mb-2 text-gray-700 font-medium">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <label className="block mb-2 text-gray-700 font-medium">Position</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your position"
              />
            </div>
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

        {/* Preview */}
        
      </div>
    </div>
  );
}
