"use client";

import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import NdisWorkforceCapabilityAcknowledgementOverlay from '@/app/form-components/staff/ndis-workforce-capability/AcknowledgementOverlay';
import StaffFormHeader from '@/app/admin/components/StaffFormHeader';
import LoadingView from '@/components/ui/LoadingView';
import { useToast } from '@/components/ui/Toast';

export default function StaffNdisWorkforceCapabilityView() {
  const { id } = useParams<{ id: string }>();
  const staffId = id;
  const { showToast } = useToast();
  const [staff, setStaff] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!staffId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/staff/${staffId}/forms/ndis-workforce-capability`);
      if (!res.ok) throw new Error("Failed to load NDIS Workforce Capability form");
      const data = await res.json();
      setStaff(data.staff);
      setFormData(data.data);
    } catch (error) {
      console.error("Error loading NDIS Workforce Capability form:", error);
      setFormData(null);
    } finally {
      setLoading(false);
    }
  }, [staffId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDownload = async () => {
    if (!formData) return;
    setDownloading(true);
    try {
      // Use merge=true to get the framework PDF + signed acknowledgement form
      const res = await fetch(`/api/staff/${staffId}/forms/ndis-workforce-capability/pdf?merge=true`);
      if (!res.ok) throw new Error("Failed to download PDF");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `NDIS_Workforce_Capability_${staff?.firstName || ""}_${staff?.surname || ""}.pdf`;
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
    } catch (error: any) {
      console.error("Download error", error);
      showToast({
        type: 'error',
        title: 'Download Failed',
        message: error.message || 'Failed to download PDF',
        duration: 5000,
      });
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return <LoadingView title="Loading NDIS Workforce Capability Form" message="Please wait..." />;
  }

  const staffName = staff ? `${staff.firstName || ''} ${staff.surname || ''}`.trim() : '';
  const staffEmail = staff?.email || '';

  // Prepare data for overlay component
  const overlayData = formData ? {
    fullName: formData.fullName || formData.staffName || staffName,
    signature: formData.signature || formData.staffSignature || '',
    date: formData.date || formData.staffSignedAt || '',
  } : null;

  return (
    <div className="">
      {/* Universal Header */}
      <StaffFormHeader
        staffId={staffId.toString()}
        formTitle="NDIS Workforce Capability Framework"
        staffName={staffName}
        staffEmail={staffEmail}
        onDownload={handleDownload}
        downloading={downloading}
        showDownload={!!formData}
      />

      <div className="">
        {!formData ? (
          <div className="bg-white rounded-2xl shadow-soft border border-dashed border-azure-200 p-8 text-center text-azure-400">
            No acknowledgement has been submitted for this staff member yet.
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-soft border border-azure-100 p-2 md:p-6">
            <NdisWorkforceCapabilityAcknowledgementOverlay
              data={overlayData || {}}
              onDataChange={() => {}}
              readOnly={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}

