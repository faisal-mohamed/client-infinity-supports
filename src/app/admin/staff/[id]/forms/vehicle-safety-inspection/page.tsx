"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminPDFCanvasViewer from '@/app/admin/components/AdminPDFCanvasViewer';

export default function AdminVehicleSafetyInspectionViewPage() {
  const params = useParams();
  const router = useRouter();
  const staffId = parseInt(params.id as string);
  
  const [staff, setStaff] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔵 [Admin View] Loading Vehicle Safety Inspection data for staff:', staffId);
        
        // Fetch form data
        const formRes = await fetch(`/api/staff/${staffId}/forms/vehicle-safety-inspection`);
        
        if (!formRes.ok) {
          const errorData = await formRes.json();
          throw new Error(errorData.error || 'Failed to load form');
        }
        
        const formSubmission = await formRes.json();
        console.log('✅ [Admin View] Form submission:', formSubmission);
        
        // Extract staff and form data
        setStaff(formSubmission.staff || {});
        setFormData(formSubmission || {});
        
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
      const pdfUrl = `/api/staff/${staffId}/forms/vehicle-safety-inspection/pdf`;
      
      // Fetch the PDF
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Vehicle_Safety_Inspection_${staff?.firstName}_${staff?.surname}.pdf`;
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
    <div className="min-h-screen bg-gray-100">
      {/* Header Bar - Compact at top */}
      <div className="bg-white shadow-md p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Vehicle Safety Inspection Checklist</h1>
            <p className="text-sm text-gray-600">
              {staff?.firstName} {staff?.surname} ({staff?.email})
              {formData?.isSubmitted && (
                <span className="ml-3 text-green-600">
                  ✓ Submitted {formData?.createdAt ? new Date(formData.createdAt).toLocaleDateString('en-AU') : ''}
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-3">
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
              ← Back
            </button>
          </div>
        </div>
      </div>

      {/* Full Screen PDF Viewer */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <AdminPDFCanvasViewer pdfUrl={`/api/staff/${staffId}/forms/vehicle-safety-inspection/pdf`} />
      </div>
    </div>
  );
}

