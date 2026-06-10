"use client";

import React, { useState, useEffect, useRef } from 'react';
import FormPage from '@/components/ui/FormPage';
import SignatureCanvas from '@/components/ui/SignatureCanvas';

interface DocumentationAcknowledgementFormData {
  staffName: string;
  signature: string;
  date: string;
}

interface DocumentationAcknowledgementEditProps {
  initialData?: Partial<DocumentationAcknowledgementFormData>;
  onDataChange?: (data: DocumentationAcknowledgementFormData) => void;
  readOnly?: boolean;
  showButtons?: boolean;
}

export default function DocumentationAcknowledgementEdit({
  initialData = {},
  onDataChange,
  readOnly = false,
}: DocumentationAcknowledgementEditProps) {
  const [formData, setFormData] = useState<DocumentationAcknowledgementFormData>({
    staffName: '',
    signature: '',
    date: '',
    ...initialData,
  });

  // Use ref to store the callback to avoid infinite loops
  const onDataChangeRef = useRef(onDataChange);
  const isInitialMount = useRef(true);
  const skipNextUpdate = useRef(false);

  useEffect(() => {
    onDataChangeRef.current = onDataChange;
  }, [onDataChange]);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      skipNextUpdate.current = true;
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (skipNextUpdate.current) {
        skipNextUpdate.current = false;
        onDataChangeRef.current?.(formData);
      }
      return;
    }
    if (skipNextUpdate.current) {
      skipNextUpdate.current = false;
      onDataChangeRef.current?.(formData);
      return;
    }
    onDataChangeRef.current?.(formData);
  }, [formData]);

  const handleInputChange = (field: keyof DocumentationAcknowledgementFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto">
        <FormPage
          title="Documentation Acknowledgement"
          meta={{ website: '', version: '', reviewDate: '' }}
        >
          {/* Document Receipt Confirmation Section */}
          <div className="mb-6">
            <p className="text-sm text-gray-700 mb-4">
              I confirm I have received copies of the following documents from Infinity Supports WA.
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 text-sm text-gray-700">
              <li>First aid policy</li>
              <li>Vehicle safety policy</li>
              <li>Vehicle safety inspection checklist</li>
              <li>Training on bullying and harassment</li>
            </ul>
            <p className="text-sm text-gray-700 mb-4">
              Copies of the same documents are available on{' '}
              <a
                href="http://www.infinitysupportswa.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-azure-700 underline"
              >
                www.infinitysupportswa.org
              </a>
              {' '}and could also be requested via email. I have read and understood the contents of these documents.
            </p>
          </div>

          {/* Commitments Section */}
          <div className="mb-6">
            <p className="text-sm text-gray-700 mb-4">I also confirm that,</p>
            <ul className="list-disc list-inside mb-4 space-y-2 text-sm text-gray-700">
              <li>
                I will conduct vehicle safety inspection as per the checklist provided by Infinity Supports WA at the start of each working day.
              </li>
              <li>
                I will ensure that my driving license is valid, vehicle used for work purposes is registered, comprehensively insured and mechanically sound.
              </li>
              <li>
                I understand that I will be provided with a first aid kit to be always kept in my vehicle and the onus is on me to inform management should any contents of the first aid kits expire.
              </li>
              <li>I will work in compliance with NDIS code of conduct.</li>
            </ul>
          </div>

          {/* Signature Section */}
          <div className="mt-8 border-t border-azure-100 pt-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Staff Name: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.staffName}
                readOnly
                disabled
                className="w-full h-10 px-3 border border-azure-100 bg-gray-100 rounded cursor-not-allowed opacity-70"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Signature: <span className="text-red-500">*</span>
              </label>
              <div className="border border-azure-100 rounded">
                <SignatureCanvas
                  existingSignature={formData.signature}
                  onSignatureEnd={(signature) => handleInputChange('signature', signature)}
                  onSignatureClear={() => handleInputChange('signature', '')}
                  width={600}
                  height={100}
                  className="bg-white"
                  disabled={readOnly}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Date: <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                disabled={readOnly}
                className={`w-full h-10 px-3 border border-azure-100 bg-white rounded ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                required
              />
            </div>
          </div>
        </FormPage>
      </div>
    </div>
  );
}

