"use client";
import React, { useRef, useState } from "react";
import SignatureCanvas, { SignatureCanvasRef } from "@/components/ui/SignatureCanvas";

export default function AcknowledgementEditPage() {
  const [formData, setFormData] = useState({
    staffName: "",
    signature: "", // Will store base64 PNG
    date: "",
  });

  const sigPadRef = useRef<SignatureCanvasRef | null>(null);

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSignatureEnd = (signatureDataUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      signature: signatureDataUrl,
    }));
  };

  const handleSignatureClear = () => {
    setFormData((prev) => ({
      ...prev,
      signature: "",
    }));
  };

  const handleSubmit = () => {
    console.log("Form Data:", formData);
  };

  return (
    <div className="min-h-screen bg-azure-100 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-soft p-8 mb-8">
          <h1 className="text-3xl font-bold text-azure-700 mb-2">
            Documentation Acknowledgement Form
          </h1>
          <p className="text-azure-400 mb-8">
            Please fill out the required information below
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Staff Name */}
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <label className="block mb-2 text-azure-600 font-medium">
                Staff Name
              </label>
              <input
                type="text"
                value={formData.staffName}
                onChange={(e) => handleInputChange("staffName", e.target.value)}
                className="w-full p-3 border border-azure-300 rounded-md focus:ring-2 focus:ring-gold-500 focus:border-azure-500"
                placeholder="Enter staff name"
              />
            </div>

            {/* Signature */}
            <div className="bg-white p-4 rounded-lg border shadow-sm col-span-1 md:col-span-2">
              <label className="block mb-2 text-azure-600 font-medium">
                Signature
              </label>
              <SignatureCanvas
                ref={sigPadRef}
                onSignatureEnd={handleSignatureEnd}
                onSignatureClear={handleSignatureClear}
                existingSignature={formData.signature}
                width={400}
                height={150}
                penColor="black"
                className="w-full"
              />
            </div>

            {/* Date */}
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <label className="block mb-2 text-azure-600 font-medium">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className="w-full p-3 border border-azure-300 rounded-md focus:ring-2 focus:ring-gold-500 focus:border-azure-500"
              />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <button
              onClick={handleSubmit}
              className="bg-azure-700 text-white px-8 py-3 rounded-lg hover:bg-azure-700 transition-colors font-medium"
            >
              Submit Form
            </button>
          </div>
        </div>

        {/* Preview Section (optional) */}
        {formData.signature && (
          <div className="bg-white p-6 rounded-lg shadow-soft">
            <h2 className="text-lg font-semibold mb-4">Signature Preview</h2>
            <img
              src={formData.signature}
              alt="Signature preview"
              className="border rounded-md max-h-40"
            />
          </div>
        )}
      </div>
    </div>
  );
}
