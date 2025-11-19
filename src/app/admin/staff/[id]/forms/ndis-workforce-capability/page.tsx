"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminPDFCanvasViewer from '@/app/admin/components/AdminPDFCanvasViewer';
import StaffFormHeader from '@/app/admin/components/StaffFormHeader';
import { useToast } from '@/components/ui/Toast';

export default function StaffNdisWorkforceCapabilityView() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [staff, setStaff] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const res = await fetch(`/api/staff/${id}`);
        if (res.ok) {
          const data = await res.json();
          setStaff(data);
        }
      } catch (error) {
        console.error('Error loading staff:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadStaff();
  }, [id]);

  const { showToast } = useToast();
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      // Use merge=true to get the framework PDF + signed acknowledgement form
      const response = await fetch(`/api/staff/${id}/forms/ndis-workforce-capability/pdf?merge=true`);
      if (!response.ok) throw new Error('Failed to download PDF');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `NDIS_Workforce_Capability_${staff?.firstName}_${staff?.surname}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Universal Header */}
      <StaffFormHeader
        staffId={id as string}
        formTitle="NDIS Workforce Capability Framework"
        staffName={staffName}
        staffEmail={staffEmail}
        onDownload={handleDownloadPDF}
        downloading={downloading}
        showDownload={true}
      />

      {/* PDF Viewer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminPDFCanvasViewer pdfUrl={`/api/staff/${id}/forms/ndis-workforce-capability/pdf`} />
      </div>
    </div>
  );
}

