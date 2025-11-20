"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import FairWorkInformationView from "@/app/form-components/staff/fair-work-information/View";
import LoadingView from '@/components/ui/LoadingView';

export default function StaffFairworkInformationView() {
  const { id } = useParams<{ id: string }>();
  const staffId = parseInt(id);
  const [staff, setStaff] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!staffId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/staff/${staffId}/forms/fair-work-information`);
      if (!res.ok) throw new Error("Failed to load acknowledgement");
      const data = await res.json();
      setStaff(data.staff);
      setFormData(data.data);
    } catch (error) {
      console.error("Error loading fairwork acknowledgement:", error);
      setFormData(null);
    } finally {
      setLoading(false);
    }
  }, [staffId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const { showToast } = useToast();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch(
        `/api/staff/${staffId}/forms/fair-work-information/pdf?download=true`
      );
      if (!res.ok) throw new Error("Failed to download PDF");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Fairwork_Information_${staff?.firstName || ""}_${staff?.surname || ""}.pdf`;
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
    return <LoadingView title="Loading Fair Work Information Form" message="Please wait..." />;
  }

  const staffName = staff ? `${staff.firstName || ''} ${staff.surname || ''}`.trim() : '';
  const staffEmail = staff?.email || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Universal Header */}
      <StaffFormHeader
        staffId={staffId.toString()}
        formTitle="Fairwork Information Statements"
        staffName={staffName}
        staffEmail={staffEmail}
        onDownload={handleDownload}
        downloading={downloading}
        showDownload={true}
      />

      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
        {!formData ? (
          <div className="bg-white rounded-2xl shadow-md border border-dashed border-gray-200 p-8 text-center text-gray-500">
            No acknowledgement has been submitted for this staff member yet.
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-2 md:p-6">
            <FairWorkInformationView
              data={formData}
              acknowledgementMode="readonly"
              showDocument={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}


