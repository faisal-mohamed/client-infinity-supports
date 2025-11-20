"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import TFNOverlayForm from "@/app/form-components/staff/tax/page";
import { useToast } from '@/components/ui/Toast';
import StaffFormHeader from '@/app/admin/components/StaffFormHeader';
import LoadingView from '@/components/ui/LoadingView';

export default function StaffGovtTaxView() {
  const { id } = useParams<{ id: string }>();
  const staffId = parseInt(id, 10);
  const { showToast } = useToast();
  const [staff, setStaff] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!staffId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/staff/${staffId}/forms/govt-tax`);
      if (!res.ok) throw new Error("Failed to load TFN declaration");
      const data = await res.json();
      setStaff(data.staff);
      setFormData(data.data);
    } catch (error) {
      console.error("Error loading TFN declaration:", error);
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
      const res = await fetch("/api/generate-pdf/tax-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to download PDF");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `TFN_Declaration_${staff?.firstName || ""}_${staff?.surname || ""}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showToast({
        type: 'success',
        title: 'PDF Downloaded',
        message: 'Form has been downloaded successfully',
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
    return <LoadingView title="Loading Government Tax Form" message="Please wait..." />;
  }

  const staffName = staff ? `${staff.firstName || ''} ${staff.surname || ''}`.trim() : '';
  const staffEmail = staff?.email || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Universal Header */}
      <StaffFormHeader
        staffId={staffId.toString()}
        formTitle="TFN Declaration"
        staffName={staffName}
        staffEmail={staffEmail}
        onDownload={handleDownload}
        downloading={downloading}
        showDownload={!!formData}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!formData ? (
          <div className="bg-white rounded-2xl shadow-md border border-dashed border-gray-200 p-8 text-center text-gray-500">
            No TFN declaration has been submitted for this staff member yet.
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-2 md:p-6 space-y-8">
            <TFNOverlayForm
              initialData={formData}
              onDataChange={() => {}}
              readOnly
              lockSectionB
              showButtons={false}
            />
            <div className="w-full flex justify-center">
              <div className="border rounded-xl overflow-hidden shadow-inner w-full max-w-[820px]">
                <img
                  src="/7.TFN_declaration_form_page2_image.jpg"
                  alt="TFN Declaration - Payer Information"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

