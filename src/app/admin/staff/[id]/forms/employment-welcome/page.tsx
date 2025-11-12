"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PDFViewerWrapper from './PDFViewerWrapper';

export default function AdminEmployeeWelcomeViewPage() {
  const params = useParams();
  const router = useRouter();
  const staffId = parseInt(params.id as string);
  
  const [staff, setStaff] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔵 [Admin View] Loading Employee Welcome data for staff:', staffId);
        
        // Fetch form submission (includes staff data)
        const formRes = await fetch(`/api/staff/${staffId}/forms/employment-welcome`);
        const formSubmission = await formRes.json();
        
        if (!formRes.ok) throw new Error(formSubmission.error || 'Failed to load form');
        
        console.log('✅ [Admin View] Form submission:', formSubmission);
        
        // Extract staff and form data
        setStaff(formSubmission.staff || {});
        setFormData(formSubmission || {});
        
        // Fetch settings from API
        try {
          const settingsRes = await fetch('/api/settings');
          if (settingsRes.ok) {
            const settingsData = await settingsRes.json();
            setSettings(settingsData || {});
            console.log('✅ [Admin View] Settings loaded:', settingsData);
          }
        } catch (err) {
          console.warn('⚠️ [Admin View] Settings not available, footer will be hidden');
        }
        
      } catch (error: any) {
        console.error('❌ [Admin View] Error loading data:', error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (staffId) loadData();
  }, [staffId]);

  const handleDownloadPDF = async () => {
    console.log('📥 [Admin View] Downloading PDF for staff:', staffId);
    try {
      const pdfUrl = `/api/staff/${staffId}/forms/employee-welcome/pdf`;
      
      // Fetch the PDF
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Employee_Welcome_Pack_${staff?.firstName}_${staff?.surname}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Header with Download Button */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Employee Welcome Pack</h1>
              <p className="text-gray-600">
                {staff?.firstName} {staff?.surname} ({staff?.email})
              </p>
              {formData?.staffSignedAt && (
                <p className="text-sm text-green-600">
                  ✓ Submitted on {new Date(formData.staffSignedAt).toLocaleDateString('en-AU')}
                </p>
              )}
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </button>
              <button
                onClick={() => router.push(`/admin/staff/${staffId}`)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                ← Back to Staff
              </button>
            </div>
          </div>
        </div>

        {/* PDF Viewer - Clean display without container */}
        <PDFViewerWrapper staffId={staffId} />
      </div>
    </div>
  );
}
