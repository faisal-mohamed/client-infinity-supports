"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AdminPDFCanvasViewer from '@/app/admin/components/AdminPDFCanvasViewer';
import StaffFormHeader from '@/app/admin/components/StaffFormHeader';
import LoadingView from '@/components/ui/LoadingView';
import { useToast } from '@/components/ui/Toast';

export default function StaffBullyingHarassmentTrainingView() {
  const { id } = useParams<{ id: string }>();
  const staffId = parseInt(id, 10);
  const [staff, setStaff] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const res = await fetch(`/api/staff/${staffId}`);
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
    if (staffId) loadStaff();
  }, [staffId]);

  const { showToast } = useToast();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Download only the acknowledgement form PDF (not merged with training PDF)
      const res = await fetch(
        `/api/staff/${staffId}/forms/bullying-harassment-training/pdf?download=true`
      );
      if (!res.ok) throw new Error("Failed to download PDF");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Bullying_Harassment_Training_Acknowledgement_${staff?.firstName || ""}_${staff?.surname || ""}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showToast({
        type: 'success',
        title: 'PDF Downloaded',
        message: 'Acknowledgement form PDF has been downloaded successfully.',
        duration: 3000,
      });
    } catch (error) {
      console.error("Download error", error);
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
    return <LoadingView title="Loading Bullying Harassment Training Form" message="Please wait..." />;
  }

  const staffName = staff ? `${staff.firstName || ''} ${staff.surname || ''}`.trim() : '';
  const staffEmail = staff?.email || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Universal Header */}
      <StaffFormHeader
        staffId={staffId.toString()}
        formTitle="Bullying & Harassment Training"
        staffName={staffName}
        staffEmail={staffEmail}
        onDownload={handleDownload}
        downloading={downloading}
        showDownload={true}
      />

      {/* PDF Viewer - Shows generated acknowledgement form PDF only */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminPDFCanvasViewer pdfUrl={`/api/staff/${staffId}/forms/bullying-harassment-training/pdf`} />
      </div>
    </div>
  );
}





