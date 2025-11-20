"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import PreEmploymentMedicalForm, { PreEmploymentMedicalFormRef } from '../../components/PreEmploymentMedicalForm';

export default function PreEmploymentMedicalFormPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [staff, setStaff] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const formRef = useRef<PreEmploymentMedicalFormRef>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`/api/staff/onboard/${token}`);
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error);
        
        setStaff(data.staff);
      } catch (error: any) {
        console.error('Error loading data:', error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) loadData();
  }, [token]);

  const handleSave = async (isSubmit = false) => {
    if (!formRef.current) return;
    
    setSaving(true);
    try {
      const success = await formRef.current.save(isSubmit);
      
      if (success && isSubmit) {
        router.push(`/staff/onboard/${token}`);
      } else if (success) {
        alert('Draft saved successfully!');
      }
    } catch (error: any) {
      console.error('Error saving:', error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingView title="Loading Pre-Employment Medical Form" message="Please wait..." />;
  }

  const handleDownloadClick = () => {
    console.log('✅ [Pre-Employment Medical Page] User clicked download button');
    setHasDownloaded(true);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Toast Notification */}
        {showToast && (
          <div className="fixed top-4 right-4 z-50 animate-slide-in">
            <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold">Download Started!</p>
                <p className="text-sm">You can view your completed form as a PDF</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pre-Employment Medical</h1>
              <p className="text-gray-600">{staff?.firstName} {staff?.surname}</p>
            </div>
            <button
              onClick={() => router.push(`/staff/onboard/${token}`)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              ← Back to Forms
            </button>
          </div>
        </div>

        {/* Download Section */}
        <div className={`bg-white rounded-lg shadow-lg p-8 mb-8 ${!hasDownloaded ? 'ring-4 ring-blue-400 ring-offset-2' : ''}`}>
          <div className="flex flex-col items-center">
            <p className="text-gray-700 text-center mb-4">
              📄 Download your completed Pre-Employment Medical form as a PDF
            </p>
            <a
              href={`/api/staff/${staff?.id}/forms/pre-employment-medical/pdf`}
              download={`Pre_Employment_Medical_${staff?.firstName}_${staff?.surname}.pdf`}
              onClick={handleDownloadClick}
              className={`inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg shadow transition-all duration-200 ${
                hasDownloaded 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl transform hover:scale-105 animate-pulse'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {hasDownloaded ? '✓ Downloaded - Click to Download Again' : 'Download Pre-Employment Medical PDF'}
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <PreEmploymentMedicalForm 
            ref={formRef}
            token={token}
          />
          
          <div className="flex gap-4 mt-8 pt-6 border-t">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {saving ? 'Submitting...' : 'Submit & Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
