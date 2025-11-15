"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import OrientationView from "@/app/form-components/staff/orientation/View";

export default function StaffOrientationView() {
  const { id } = useParams<{ id: string }>();
  const staffId = parseInt(id, 10);
  const [staff, setStaff] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!staffId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/staff/${staffId}/forms/orientation`);
      if (!res.ok) throw new Error("Failed to load orientation acknowledgement");
      const data = await res.json();
      setStaff(data.staff);
      setFormData(data.data);
    } catch (error) {
      console.error("Error loading orientation acknowledgement:", error);
      setFormData(null);
    } finally {
      setLoading(false);
    }
  }, [staffId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDownload = async () => {
    try {
      const res = await fetch(
        `/api/staff/${staffId}/forms/orientation/pdf?download=true`
      );
      if (!res.ok) throw new Error("Failed to download PDF");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Staff_Orientation_${staff?.firstName || ""}_${staff?.surname || ""}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error", error);
      alert("Failed to download PDF");
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
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Staff Orientation
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {staff?.firstName} {staff?.surname}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Download PDF
              </button>
              <button
                onClick={fetchData}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                Refresh View
              </button>
              <Link
                href={`/admin/staff/${staffId}`}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                ← Back to Staff
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
        {!formData ? (
          <div className="bg-white rounded-2xl shadow-md border border-dashed border-gray-200 p-8 text-center text-gray-500">
            No acknowledgement has been submitted for this staff member yet.
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-2 md:p-6">
            <OrientationView
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

