"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaDownload, FaPrint } from 'react-icons/fa';
import { generatePdfUrl } from '@/lib/api';

type FormSubmissionProps = {
  formSubmission: {
    id: string | number;
    clientId: string | number;
    formId: string | number;
    formVersion: number;
    data: any;
    isSubmitted: boolean;
    submittedAt: string | null;
    client: {
      name: string;
      email: string | null;
    };
    form: {
      title: string;
      version: number;
    };
  };
};

export default function FormSubmissionDetails({ formSubmission }: any) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'formatted' | 'raw'>('formatted');

  const handleDownloadPdf = () => {
    const pdfUrl = generatePdfUrl({
      formId: formSubmission.formId,
      clientId: formSubmission.clientId,
      download: true,
    });
    
    window.open(pdfUrl, '_blank');
  };

  const renderFormattedData = () => {
    // This is a simple implementation - you might want to use your form schema to render this better
    if (!formSubmission.data || typeof formSubmission.data !== 'object') {
      return <p>No data available</p>;
    }

    return (
      <div className="space-y-6">
        {Object.entries(formSubmission.data).map(([key, value]) => {
          // Skip internal or technical fields
          if (key.startsWith('_') || key === 'schema' || key === 'uischema') {
            return null;
          }

          return (
            <div key={key} className="border-b pb-4">
              <h3 className="text-base font-semibold text-azure-600 mb-2 capitalize">
                {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
              </h3>
              <div className="text-azure-700">
                {renderValue(value)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderValue = (value: any) => {
    if (value === null || value === undefined) {
      return <span className="text-azure-300">Not provided</span>;
    }

    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return (
          <ul className="list-disc pl-5">
            {value.map((item, index) => (
              <li key={index}>{renderValue(item)}</li>
            ))}
          </ul>
        );
      }

      return (
        <div className="pl-4 border-l-2 border-azure-100">
          {Object.entries(value).map(([k, v]) => (
            <div key={k} className="mb-2">
              <div className="text-sm font-medium text-azure-400 capitalize">
                {k.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
              </div>
              <div>{renderValue(v)}</div>
            </div>
          ))}
        </div>
      );
    }

    return String(value);
  };

  return (
    <div className="bg-white shadow-soft rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-azure-100 bg-azure-50 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 text-azure-500 hover:text-azure-700"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-xl font-bold text-azure-700">
            {formSubmission.form.title} (v{formSubmission.form.version})
          </h1>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleDownloadPdf}
            className="flex items-center bg-azure-600 hover:bg-azure-700 text-white py-2 px-4 rounded-md"
          >
            <FaDownload className="mr-2" /> Download PDF
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center bg-azure-500 hover:bg-azure-600 text-white py-2 px-4 rounded-md"
          >
            <FaPrint className="mr-2" /> Print
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Submission Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-azure-600">
                <span className="font-medium">Client:</span> {formSubmission.client.name}
              </p>
              {formSubmission.client.email && (
                <p className="text-azure-600">
                  <span className="font-medium">Email:</span> {formSubmission.client.email}
                </p>
              )}
            </div>
            <div>
              <p className="text-azure-600">
                <span className="font-medium">Submitted:</span>{' '}
                {formSubmission.submittedAt
                  ? new Date(formSubmission.submittedAt).toLocaleString()
                  : 'Not submitted'}
              </p>
              <p className="text-azure-600">
                <span className="font-medium">Form ID:</span> {formSubmission.formId}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4 border-b border-azure-100">
          <div className="flex flex-col md:flex-row">
            <button
              className={`py-2 px-2 md:px-4 font-medium ${
                activeTab === 'formatted'
                  ? 'text-azure-600 border-b-2 border-azure-600'
                  : 'text-azure-400 hover:text-azure-600'
              }`}
              onClick={() => setActiveTab('formatted')}
            >
              Formatted View
            </button>
            <button
              className={`py-2 px-2 md:px-4 font-medium ${
                activeTab === 'raw'
                  ? 'text-azure-600 border-b-2 border-azure-600'
                  : 'text-azure-400 hover:text-azure-600'
              }`}
              onClick={() => setActiveTab('raw')}
            >
              Raw Data
            </button>
          </div>
        </div>

        <div className="bg-white rounded-md">
          {activeTab === 'formatted' ? (
            renderFormattedData()
          ) : (
            <pre className="bg-azure-50 p-4 rounded-md overflow-x-auto text-sm">
              {JSON.stringify(formSubmission.data, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
