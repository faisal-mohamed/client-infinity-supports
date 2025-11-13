"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function StaffBullyingHarassmentTrainingView() {
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

  const handleDownloadPDF = async () => {
    try {
      // Use merge=true to get the training PDF + signed acknowledgement form
      const response = await fetch(`/api/staff/${id}/forms/bullying-harassment-training/pdf?merge=true`);
      if (!response.ok) throw new Error('Failed to download PDF');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Bullying_Harassment_Training_${staff?.firstName}_${staff?.surname}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const pdfUrl = `/api/staff/${id}/forms/bullying-harassment-training/pdf#view=FitH&toolbar=0`;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bullying & Harassment Training</h1>
              <p className="text-sm text-gray-600 mt-1">
                {staff?.firstName} {staff?.surname}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Download PDF
              </button>
              <Link
                href={`/admin/staff/${id}`}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                ← Back to Staff
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <iframe
            src={pdfUrl}
            className="w-full"
            style={{ height: 'calc(100vh - 200px)', minHeight: '900px' }}
            title="Bullying & Harassment Training PDF"
          />
        </div>
      </div>
    </div>
  );
}





