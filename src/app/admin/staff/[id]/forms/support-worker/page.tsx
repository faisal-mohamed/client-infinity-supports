"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminPDFCanvasViewer from '@/app/admin/components/AdminPDFCanvasViewer';
import StaffFormHeader from '@/app/admin/components/StaffFormHeader';
import { useToast } from '@/components/ui/Toast';

export default function AdminSupportWorkerViewPage() {
  const params = useParams();
  const router = useRouter();
  const staffId = parseInt(params.id as string);
  
  const [staff, setStaff] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔵 [Admin View] Loading Position Description data for staff:', staffId);
        
        // Fetch form submission (includes staff data)
        const formRes = await fetch(`/api/staff/${staffId}/forms/support-worker`);
        const formSubmission = await formRes.json();
        
        if (!formRes.ok) {
          console.log('⚠️ No submission found, loading staff data only');
          // If no submission, just load staff info
          const staffRes = await fetch(`/api/admin/staff/${staffId}`);
          const staffData = await staffRes.json();
          if (staffRes.ok) {
            setStaff(staffData);
            setFormData({});
          }
        } else {
          console.log('✅ [Admin View] Form submission:', formSubmission);
          setStaff(formSubmission.staff || {});
          setFormData(formSubmission || {});
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

  const { showToast } = useToast();
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const pdfUrl = `/api/staff/${staffId}/forms/support-worker/pdf`;
      
      // Fetch the PDF
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error('Failed to generate PDF');
      
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Support_Worker_${staff?.firstName}_${staff?.surname}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showToast({
        type: 'success',
        title: 'PDF Downloaded',
        message: 'PDF has been downloaded successfully.',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      showToast({
        type: 'error',
        title: 'Download Failed',
        message: 'Failed to download PDF. Please try again.',
        duration: 5000,
      });
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const staffName = staff ? `${staff.firstName || ''} ${staff.surname || ''}`.trim() : '';
  const staffEmail = staff?.email || '';
  const hasSignature = formData?.signature || formData?.staffSignature;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Universal Header */}
      <StaffFormHeader
        staffId={staffId.toString()}
        formTitle="Position Description"
        staffName={staffName}
        staffEmail={staffEmail}
        onDownload={handleDownloadPDF}
        downloading={downloading}
        showDownload={!!hasSignature}
      />

      {/* Full Screen PDF Viewer */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <AdminPDFCanvasViewer pdfUrl={`/api/staff/${staffId}/forms/support-worker/pdf`} />
      </div>
    </div>
  );
}
