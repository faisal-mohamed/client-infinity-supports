"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import EmployeeWelcomeAckForm, { EmployeeWelcomeAckFormRef } from '../../components/EmployeeWelcomeAckForm';

export default function EmployeeWelcomeFormPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [staff, setStaff] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const formRef = useRef<EmployeeWelcomeAckFormRef>(null);

  useEffect(() => {
    const loadData = async () => {
      console.log('🔵 [Employee Welcome Pack Page] Loading data for token:', token);
      try {
        const res = await fetch(`/api/staff/onboard/${token}`);
        const data = await res.json();
        console.log('🔵 [Employee Welcome Pack Page] API Response:', data);
        
        if (!res.ok) throw new Error(data.error);
        
        setStaff(data.staff);
        const welcomeData = data.submissions['employee_welcome'] || {};
        console.log('✅ [Employee Welcome Pack Page] Loaded form data:', welcomeData);
        setFormData(welcomeData);
      } catch (error: any) {
        console.error('❌ [Employee Welcome Pack Page] Error loading data:', error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) loadData();
  }, [token]);

  const handleSave = async (isSubmit = false) => {
    if (!formRef.current) return;
    
    console.log('🔵 [Employee Welcome Pack Page] Saving form... isSubmit:', isSubmit);
    setSaving(true);
    try {
      const success = await formRef.current.save(isSubmit);
      console.log('✅ [Employee Welcome Pack Page] Save result:', success);
      
      if (success && isSubmit) {
        console.log('🔵 [Employee Welcome Pack Page] Redirecting to main forms page...');
        router.push(`/staff/onboard/${token}`);
      } else if (success) {
        alert('Draft saved successfully!');
      }
    } catch (error: any) {
      console.error('❌ [Employee Welcome Page] Error saving:', error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const handleDownloadClick = () => {
    console.log('✅ [Employee Welcome Page] User clicked download button');
    setHasDownloaded(true);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  const handleFormClick = (e: React.MouseEvent) => {
    if (!hasDownloaded) {
      e.preventDefault();
      e.stopPropagation();
      alert('⚠️ Please download and read the Employee Welcome Pack before completing this form.');
    }
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
                <p className="text-sm">You can now complete the acknowledgement form below</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Employee Welcome</h1>
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

        {/* Download Section - FORCE download before form */}
        <div className={`bg-white rounded-lg shadow-lg p-8 mb-8 ${!hasDownloaded ? 'ring-4 ring-blue-400 ring-offset-2' : ''}`}>
          <div className="flex flex-col items-center">
            {!hasDownloaded && (
              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 mb-4 w-full">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-yellow-800 font-semibold text-sm">
                    ⚠️ You must download the PDF before completing the form
                  </p>
                </div>
              </div>
            )}
            <p className="text-gray-700 text-center mb-4">
              📄 Please download and read the Employee Welcome Pack before completing the acknowledgement form below
            </p>
            <a
              href={`/api/staff/${staff?.id}/forms/employee-welcome/pdf?blank=true`}
              download={`Employee_Welcome_Pack_${staff?.firstName}_${staff?.surname}.pdf`}
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
              {hasDownloaded ? '✓ Downloaded - Click to Download Again' : 'Download Employee Welcome Pack'}
            </a>
          </div>
        </div>

        {/* Acknowledgement Form - LOCKED until download */}
        <div 
          className={`bg-white rounded-lg shadow-lg p-6 relative ${!hasDownloaded ? 'opacity-50 pointer-events-none' : ''}`}
          onClick={handleFormClick}
        >
          {!hasDownloaded && (
            <div className="absolute inset-0 bg-gray-900 bg-opacity-10 backdrop-blur-sm rounded-lg flex items-center justify-center z-10 cursor-not-allowed">
              <div className="bg-white p-6 rounded-xl shadow-2xl text-center max-w-md">
                <svg className="w-16 h-16 text-yellow-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Form Locked</h3>
                <p className="text-gray-600">
                  Please download the Employee Welcome Pack above before filling out this acknowledgement form.
                </p>
              </div>
            </div>
          )}
          <EmployeeWelcomeAckForm 
            ref={formRef}
            token={token}
          />
          
          {/* Action Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t">
            <button
              onClick={() => handleSave(false)}
              disabled={saving || !hasDownloaded}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving || !hasDownloaded}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Submitting...' : 'Submit & Continue'}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
