"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getStaffFormComponent } from '@/app/forms/staff-registry';
import { useToast } from '@/components/ui/Toast';
import StaffFormHeader from '@/app/admin/components/StaffFormHeader';

export default function StaffSuperChoiceFormView() {
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
      const res = await fetch(`/api/staff/${staffId}/forms/super-choice-form`);
      if (!res.ok) throw new Error("Failed to load Superannuation Standard Choice Form");
      const data = await res.json();
      setStaff(data.staff);
      setFormData(data.data);
    } catch (error: any) {
      console.error("Error loading Superannuation Standard Choice Form:", error);
      showToast({
        type: 'error',
        title: 'Error Loading Form',
        message: error.message || 'Failed to load form data',
        duration: 4000,
      });
      setFormData(null);
    } finally {
      setLoading(false);
    }
  }, [staffId, showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDownload = async () => {
    if (!formData) return;
    setDownloading(true);
    try {
      const res = await fetch("/api/generate-pdf/super-choice-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to download PDF");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Superannuation_Standard_Choice_Form_${staff?.firstName || ""}_${staff?.surname || ""}.pdf`;
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
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const SuperChoiceFormView = getStaffFormComponent('super_choice_form', 'view');
  const staffName = staff ? `${staff.firstName || ''} ${staff.surname || ''}`.trim() : '';
  const staffEmail = staff?.email || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Universal Header */}
      <StaffFormHeader
        staffId={staffId.toString()}
        formTitle="Superannuation Standard Choice Form"
        staffName={staffName}
        staffEmail={staffEmail}
        onDownload={handleDownload}
        downloading={downloading}
        showDownload={!!formData}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!formData ? (
          <div className="bg-white rounded-2xl shadow-md border border-dashed border-gray-200 p-8 text-center text-gray-500">
            No Superannuation Standard Choice Form has been submitted for this staff member yet.
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-2 md:p-6 space-y-8">
            <div className="w-full">
              <SuperChoiceFormView
                initialData={formData}
                onDataChange={() => {}}
                readOnly
                showButtons={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

