"use client";

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SignatureCanvas from '@/components/ui/SignatureCanvas';
import FormButton from '@/components/ui/FormButton';
import { useToast } from '@/components/ui/Toast';
import AdminPDFCanvasViewer from '@/app/admin/components/AdminPDFCanvasViewer';
import StaffFormHeader from '@/app/admin/components/StaffFormHeader';

interface BullyingTrainingData {
  staff?: { firstName: string; surname: string; email: string };
  data?: any;
  staffSignature?: string;
  staffSignedAt?: string;
  adminSignature?: string;
  adminSignedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function StaffBullyingTrainingView() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [data, setData] = useState<BullyingTrainingData | null>(null);
  const [managerName, setManagerName] = useState('');
  const [managerSignature, setManagerSignature] = useState('');
  const [managerSignedAt, setManagerSignedAt] = useState(new Date().toISOString().split('T')[0]);
  const [refreshKey, setRefreshKey] = useState(0);

  const pdfUrl = useMemo(
    () => `/api/staff/${id}/forms/bullying-training/pdf?cache=${refreshKey}`,
    [id, refreshKey]
  );

  const loadData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/staff/${id}/forms/bullying-training`);
      if (!res.ok) {
        throw new Error('Failed to load form data');
      }
      const result = await res.json();
      setData(result);

      const existingData = result.data || result;
      if (existingData.managerName) setManagerName(existingData.managerName);
      if (existingData.managerSignature) setManagerSignature(existingData.managerSignature);
      if (existingData.managerSignedAt) {
        setManagerSignedAt(existingData.managerSignedAt.split('T')[0]);
      }
    } catch (error: any) {
      console.error('Error loading bullying training data:', error);
      showToast({
        type: 'error',
        title: 'Failed to load form',
        message: error.message || 'Unable to load form data.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDownload = async () => {
    if (!data?.staffSignature) {
      showToast({
        type: 'info',
        title: 'Staff Signature Required',
        message: 'The staff member must sign before downloading the PDF.',
      });
      return;
    }

    if (!managerSignature) {
      showToast({
        type: 'warning',
        title: 'Manager Acknowledgement Pending',
        message: 'Please complete the manager acknowledgement before downloading.',
      });
      return;
    }

    try {
      setDownloading(true);
      const response = await fetch(`${pdfUrl}&download=true`);
      if (!response.ok) throw new Error('Failed to generate PDF');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${data?.staff?.firstName || 'staff'}_${data?.staff?.surname || ''}_bullying_training.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error downloading PDF:', error);
      showToast({
        type: 'error',
        title: 'Download Failed',
        message: error.message || 'Unable to download PDF.',
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleSaveManager = async () => {
    if (!managerName.trim()) {
      showToast({
        type: 'error',
        title: 'Manager Name Required',
        message: 'Please enter the manager’s name.',
      });
      return;
    }
    if (!managerSignature) {
      showToast({
        type: 'error',
        title: 'Manager Signature Required',
        message: 'Please add the manager’s signature.',
      });
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`/api/staff/${id}/forms/bullying-training/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          managerName: managerName.trim(),
          managerSignature,
          managerSignedAt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save manager acknowledgement');
      }

      showToast({
        type: 'success',
        title: 'Manager Acknowledgement Saved',
        message: 'Manager details have been recorded successfully.',
      });

      setRefreshKey((prev) => prev + 1);
      await loadData();
    } catch (error: any) {
      console.error('Error saving manager acknowledgement:', error);
      showToast({
        type: 'error',
        title: 'Save Failed',
        message: error.message || 'Unable to save manager acknowledgement.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-sm">Loading Bullying Training form...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-700">Form data not found.</p>
        </div>
      </div>
    );
  }

  const staffSigned = !!data.staffSignature;
  const managerCompleted = !!(data.data?.managerSignature || data.adminSignature);
  const staffName = data.staff ? `${data.staff.firstName || ''} ${data.staff.surname || ''}`.trim() : '';
  const staffEmail = data.staff?.email || '';

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
      {/* Universal Header */}
      <StaffFormHeader
        staffId={id as string}
        formTitle="Bullying Training Acknowledgment"
        staffName={staffName}
        staffEmail={staffEmail}
        onDownload={handleDownload}
        downloading={downloading}
        showDownload={!!staffSigned}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
          {staffSigned ? (
            <div
              className={`flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 rounded-xl border-2 ${
                managerCompleted
                  ? 'bg-green-50 border-green-200'
                  : 'bg-orange-50 border-orange-200'
              }`}
            >
              <div className="text-sm font-semibold text-gray-800">
                {managerCompleted ? '✅ Manager acknowledgement complete.' : '⏳ Awaiting manager acknowledgement.'}
              </div>
              <div className="flex gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  Staff Signed
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    managerCompleted ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  {managerCompleted ? 'Manager Acknowledged' : 'Manager Pending'}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50">
              <div className="text-sm font-semibold text-gray-700">
                Staff member has not completed their signature yet.
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                Pending
              </span>
            </div>
          )}
        </div>

        {/* PDF Viewer */}
        <AdminPDFCanvasViewer pdfUrl={pdfUrl} key={refreshKey} />

        {/* Manager Section */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Manager Acknowledgement</h2>
            <p className="text-sm text-gray-600 mt-1">
              This section is completed by the manager after the staff member has signed their acknowledgement.
            </p>
          </div>

          {!staffSigned ? (
            <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50 text-yellow-800 text-sm">
              Staff must sign the acknowledgement before you can complete the manager section.
            </div>
          ) : (
            <>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Manager&apos;s Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Enter manager's full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manager&apos;s Signature <span className="text-red-500">*</span>
                  </label>
                  <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <SignatureCanvas
                      existingSignature={managerSignature || undefined}
                      onSignatureEnd={(sig) => {
                        if (sig && sig.length > 50) {
                          setManagerSignature(sig);
                        }
                      }}
                      onSignatureClear={() => setManagerSignature('')}
                      clearButtonText="Clear Signature"
                      className="items-center"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={managerSignedAt}
                    onChange={(e) => setManagerSignedAt(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t">
                <FormButton
                  onClick={handleSaveManager}
                  loading={saving}
                  disabled={!staffSigned}
                  icon="submit"
                  variant="success"
                >
                  Save Manager Acknowledgement
                </FormButton>

                <FormButton
                  onClick={handleDownload}
                  loading={downloading}
                  disabled={!staffSigned || !managerSignature}
                  icon="download"
                  variant="primary"
                >
                  Download Signed PDF
                </FormButton>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

