"use client";

import React, { useState, useEffect } from "react";
import { FaSignature, FaTimes, FaCheck } from "react-icons/fa";
import SignaturePad from "@/app/components/forms/SignaturePad";

interface SignatureRequirement {
  id: string;
  label: string;
  description?: string;
  required: boolean;
  dataKey?: string;
}

interface SignatureCollectionModalProps {
  isOpen: boolean;
  signatures: SignatureRequirement[];
  formData: any;
  onSignaturesComplete: (signatureData: string) => void;
  onCancel: () => void;
}

const SignatureCollectionModal: React.FC<SignatureCollectionModalProps> = ({
  isOpen,
  signatures,
  formData,
  onSignaturesComplete,
  onCancel,
}) => {
  const [signedBy, setSignedBy] = useState("");
  const [signatureData, setSignatureData] = useState("");
  const [hasSignature, setHasSignature] = useState(false);

  // Since we only have one signature for home visit risk assessment
  const currentSignature = signatures[0];

  useEffect(() => {
    if (isOpen && currentSignature?.dataKey && formData[currentSignature.dataKey]) {
      setSignedBy(formData[currentSignature.dataKey]);
    }
  }, [isOpen, currentSignature, formData]);

  const handleSignatureEnd = (dataUrl: string) => {
    console.log("Signature captured:", dataUrl ? "Yes" : "No"); // Debug log
    setSignatureData(dataUrl);
    setHasSignature(!!dataUrl && dataUrl.trim() !== "" && !dataUrl.includes("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="));
  };

  const handleSaveSignature = () => {
    if (!hasSignature || !signedBy.trim()) {
      return;
    }

    onSignaturesComplete(signatureData);
  };

  const handleCancel = () => {
    // Reset state when canceling
    setSignedBy("");
    setSignatureData("");
    setHasSignature(false);
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      style={{ zIndex: 9999 }} // Ensure high z-index
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FaSignature className="w-6 h-6 text-indigo-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {currentSignature?.label || "Signature Required"}
              </h2>
              <p className="text-sm text-gray-500">
                Please provide your signature to complete the form
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          {currentSignature?.description && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                {currentSignature.description}
              </p>
            </div>
          )}

          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={signedBy}
              onChange={(e) => setSignedBy(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Signature Pad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Signature *
            </label>
            <div className="flex justify-center bg-gray-50 p-4 rounded-lg">
              <div 
                style={{ 
                  pointerEvents: 'auto',
                  touchAction: 'none' 
                }}
              >
                <SignaturePad
                  onEnd={handleSignatureEnd}
                  readOnly={false}
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              Draw your signature in the box above
            </p>
            {/* Debug info */}
            <div className="text-xs text-gray-400 mt-1">
              Has signature: {hasSignature ? "Yes" : "No"}
              <br />
              Signature data length: {signatureData.length}
              <br />
              <button 
                type="button"
                onClick={() => console.log("SignaturePad test click")}
                className="text-blue-500 underline"
              >
                Test Click
              </button>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="text"
              value={new Date().toLocaleDateString()}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveSignature}
            disabled={!hasSignature || !signedBy.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <FaCheck className="w-4 h-4" />
            Save Signature
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignatureCollectionModal;
