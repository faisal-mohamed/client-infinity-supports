// Example component showing how to use settings in forms
"use client";

import { useFormMetadata, useSetting } from '@/hooks/useSettings';
import { FaSpinner, FaBuilding, FaGlobe, FaCalendarAlt } from 'react-icons/fa';

interface FormWithSettingsProps {
  children?: React.ReactNode;
  showMetadata?: boolean;
}

/**
 * Example component that demonstrates how to use settings in forms
 * This can be used as a wrapper for forms that need access to common metadata
 */
export default function FormWithSettings({ children, showMetadata = true }: FormWithSettingsProps) {
  const { metadata, loading, error } = useFormMetadata();
  const { value: companyName, loading: companyNameLoading } = useSetting('company_name', 'Your Company');

  if (loading || companyNameLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <FaSpinner className="animate-spin h-6 w-6 text-azure-700 mr-2" />
        <span className="text-azure-500">Loading form settings...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="text-red-800 font-medium">Settings Error</div>
        <div className="text-red-600 text-sm mt-1">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Form Header with Company Info */}
      {showMetadata && (
        <div className="bg-gradient-to-r from-azure-50 to-blue-50 rounded-xl p-6 border border-azure-200">
          <div className="flex items-center mb-4">
            <FaBuilding className="h-6 w-6 text-azure-700 mr-3" />
            <h2 className="text-xl font-semibold text-azure-700">
              {companyName || 'Company Name Not Set'}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {metadata.companyWebsite && (
              <div className="flex items-center text-azure-600">
                <FaGlobe className="h-4 w-4 mr-2 text-azure-600" />
                <span className="font-medium mr-2">Website:</span>
                <a 
                  href={metadata.companyWebsite} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-azure-700 hover:text-azure-800 underline"
                >
                  {metadata.companyWebsite}
                </a>
              </div>
            )}
            
            {metadata.reviewDate && (
              <div className="flex items-center text-azure-600">
                <FaCalendarAlt className="h-4 w-4 mr-2 text-azure-600" />
                <span className="font-medium mr-2">Review Date:</span>
                <span>{new Date(metadata.reviewDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
          
          {(!metadata.companyWebsite || !metadata.reviewDate) && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="text-amber-800 text-sm">
                <strong>Note:</strong> Some form metadata is missing. 
                <a href="/admin/settings" className="text-amber-700 underline ml-1">
                  Configure settings
                </a> to complete the form information.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Form Content */}
      <div className="bg-white rounded-xl shadow-sm border border-azure-100 p-6">
        {children}
      </div>

      {/* Hidden fields for form submission (if needed) */}
      <div className="hidden">
        <input type="hidden" name="company_website" value={metadata.companyWebsite || ''} />
        <input type="hidden" name="review_date" value={metadata.reviewDate || ''} />
        <input type="hidden" name="company_name" value={companyName || ''} />
      </div>
    </div>
  );
}

/**
 * Hook to get form metadata for use in form submissions
 */
export function useFormSubmissionData() {
  const { metadata } = useFormMetadata();
  const { value: companyName } = useSetting('company_name');

  return {
    companyWebsite: metadata.companyWebsite,
    reviewDate: metadata.reviewDate,
    companyName,
    // Add more settings as needed
    getFormData: () => ({
      company_website: metadata.companyWebsite || '',
      review_date: metadata.reviewDate || '',
      company_name: companyName || '',
    })
  };
}

/**
 * Component for displaying settings status in forms
 */
export function SettingsStatus() {
  const { metadata, loading, error } = useFormMetadata();

  if (loading) {
    return (
      <div className="flex items-center text-sm text-azure-400">
        <FaSpinner className="animate-spin h-4 w-4 mr-2" />
        Loading settings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center text-sm text-red-600">
        <span className="mr-2">⚠️</span>
        Settings error: {error}
      </div>
    );
  }

  const missingSettings = [];
  if (!metadata.companyWebsite) missingSettings.push('Company Website');
  if (!metadata.reviewDate) missingSettings.push('Review Date');

  if (missingSettings.length > 0) {
    return (
      <div className="flex items-center text-sm text-amber-600">
        <span className="mr-2">⚠️</span>
        Missing settings: {missingSettings.join(', ')}
      </div>
    );
  }

  return (
    <div className="flex items-center text-sm text-green-600">
      <span className="mr-2">✅</span>
      All form settings configured
    </div>
  );
}
