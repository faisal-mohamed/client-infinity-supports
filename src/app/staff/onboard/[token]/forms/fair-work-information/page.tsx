"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getStaffFormComponent } from "@/app/forms/staff-registry";
import { useToast } from "@/components/ui/Toast";
import LoadingView from '@/components/ui/LoadingView';

export default function FairWorkInformationFormPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const [staff, setStaff] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    staffName: "",
    acknowledged: false,
    date: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`/api/staff/onboard/${token}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error);

        setStaff(data.staff);
        const existing =
          data.submissions["fair_work_information"] ||
          {
            staffName: `${data.staff?.firstName ?? ""} ${
              data.staff?.surname ?? ""
            }`.trim(),
            date: new Date().toISOString().split("T")[0],
          };
        setFormData(existing);
      } catch (error: any) {
        console.error("Error loading Fairwork Information form:", error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) loadData();
  }, [token]);

  const handleAcknowledgementChange = (updates: Record<string, any>) => {
    setFormData((prev: any) => ({ ...prev, ...updates }));
  };

  const handleSave = async (isSubmit: boolean) => {
    setSaving(true);
    try {
      if (isSubmit) {
        const nameFilled = !!formData.staffName?.trim();
        const signatureFilled =
          !!formData.signature ||
          !!formData.staffSignature ||
          !!formData.acknowledgementSignature;
        const dateValue =
          formData.date || formData.acknowledgedAt || formData.staffSignedAt;
        const acknowledgedChecked =
          formData.acknowledged ||
          formData.readAcknowledgement ||
          formData.fairworkAcknowledged;

        if (!nameFilled || !signatureFilled || !dateValue || !acknowledgedChecked) {
          setSaving(false);
          showToast({
            type: "error",
            title: "Complete the acknowledgement form",
            message: [
              !acknowledgedChecked && "• Tick the acknowledgement checkbox",
              !nameFilled && "• Enter your full name",
              !signatureFilled && "• Provide your signature",
              !dateValue && "• Select the acknowledgement date",
            ]
              .filter(Boolean)
              .join("\n"),
          });
          return;
        }
      }

      const res = await fetch(`/api/staff/onboard/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formKey: "fair_work_information",
          data: formData,
          submit: isSubmit,
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Failed to save");

      if (isSubmit) {
        showToast({
          type: "success",
          title: "Acknowledgement submitted",
          message: "Fairwork Information Statements acknowledgement completed.",
        });
        const isSignatureLink = window.location.pathname.includes('/staff/signature/');
        router.push(isSignatureLink ? `/staff/signature/${token}` : `/staff/onboard/${token}`);
      } else {
        showToast({
          type: "success",
          title: "Draft saved",
          message: "Your acknowledgement draft has been saved.",
        });
      }
    } catch (error: any) {
      console.error("Error saving Fairwork Information form:", error);
      showToast({
        type: "error",
        title: "Save failed",
        message: error.message || "Unable to save the acknowledgement.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingView title="Loading Fair Work Information Form" message="Please wait..." />;
  }

  const FairWorkInformationView = getStaffFormComponent(
    "fair_work_information",
    "view"
  );

  return (
    <div className="min-h-screen bg-gray-100 py-4 md:py-8">
      <style jsx>{`
        .view-component-wrapper .text-gray-700 {
          color: #374151 !important;
        }
        .view-component-wrapper .text-gray-600 {
          color: #4b5563 !important;
        }
        .view-component-wrapper .text-gray-800 {
          color: #1f2937 !important;
        }
        .view-component-wrapper .text-xs {
          font-size: 0.875rem !important;
        }
        .view-component-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
      <div className="w-full max-w-7xl mx-auto px-2 md:px-6">
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-4 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                Fairwork Information Statements
              </h1>
              <p className="text-gray-600">
                {staff?.firstName} {staff?.surname}
              </p>
            </div>
            <button
              onClick={() => {
                const isSignatureLink = window.location.pathname.includes('/staff/signature/');
                router.push(isSignatureLink ? `/staff/signature/${token}` : `/staff/onboard/${token}`);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 self-start sm:self-auto"
            >
              ← Back to Forms
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-2 md:p-6">
          <div className="view-component-wrapper w-full">
            <FairWorkInformationView
              data={formData}
              acknowledgementMode="editable"
              onAcknowledgementChange={handleAcknowledgementChange}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6 md:mt-8 pt-4 md:pt-6 border-t">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 w-full sm:w-auto"
            >
              {saving ? "Saving..." : "Save Draft"}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 w-full sm:w-auto"
            >
              {saving ? "Submitting..." : "Submit & Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


