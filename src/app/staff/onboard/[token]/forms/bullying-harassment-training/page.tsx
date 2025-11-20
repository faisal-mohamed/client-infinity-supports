"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import BullyingHarassmentTrainingAckForm, { BullyingHarassmentTrainingAckFormRef } from '../../components/BullyingHarassmentTrainingAckForm';
import { useToast } from '@/components/ui/Toast';
import LoadingView from '@/components/ui/LoadingView';

export default function BullyingHarassmentTrainingFormPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [staff, setStaff] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [showDownloadToast, setShowDownloadToast] = useState(false);
  const formRef = useRef<BullyingHarassmentTrainingAckFormRef>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      console.log('🔵 [Bullying & Harassment Training Page] Loading data for token:', token);
      try {
        const res = await fetch(`/api/staff/onboard/${token}`);
        const data = await res.json();
        console.log('🔵 [Bullying & Harassment Training Page] API Response:', data);
        
        if (!res.ok) throw new Error(data.error);
        
        setStaff(data.staff);
        const trainingData = data.submissions['bullying_harassment_training'] || {};
        console.log('✅ [Bullying & Harassment Training Page] Loaded form data:', trainingData);
        setFormData(trainingData);
      } catch (error: any) {
        console.error('❌ [Bullying & Harassment Training Page] Error loading data:', error);
        showToast({
          type: 'error',
          title: 'Error Loading Form',
          message: error.message || 'Failed to load form data',
          duration: 4000,
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) loadData();
  }, [token]);

  const handleSave = async (isSubmit = false) => {
    if (!formRef.current) return;
    
    console.log('🔵 [Bullying & Harassment Training Page] Saving form... isSubmit:', isSubmit);
    setSaving(true);
    try {
      const success = await formRef.current.save(isSubmit);
      console.log('✅ [Bullying & Harassment Training Page] Save result:', success);
      
      if (success && isSubmit) {
        console.log('🔵 [Bullying & Harassment Training Page] Redirecting to main forms page...');
        showToast({
          type: 'success',
          title: 'Form Submitted',
          message: 'Form submitted successfully!',
          duration: 3000,
        });
        setTimeout(() => {
          router.push(`/staff/onboard/${token}`);
        }, 1000);
      } else if (success) {
        showToast({
          type: 'success',
          title: 'Draft Saved',
          message: 'Draft saved successfully!',
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error('❌ [Bullying & Harassment Training Page] Error saving:', error);
      showToast({
        type: 'error',
        title: 'Save Failed',
        message: error.message || 'Failed to save form',
        duration: 4000,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingView title="Loading Bullying Harassment Training Form" message="Please wait..." />;
  }

  const handleDownloadClick = () => {
    console.log('✅ [Bullying & Harassment Training Page] User clicked download button');
    setHasDownloaded(true);
    setShowDownloadToast(true);
    showToast({
      type: 'success',
      title: 'Download Started',
      message: 'You can now complete the acknowledgement form below',
      duration: 5000,
    });
    setTimeout(() => setShowDownloadToast(false), 5000);
  };

  const handleFormClick = (e: React.MouseEvent) => {
    if (!hasDownloaded) {
      e.preventDefault();
      e.stopPropagation();
      showToast({
        type: 'warning',
        title: 'Form Locked',
        message: 'Please download and read the Bullying & Harassment Training document before completing this form.',
        duration: 5000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bullying & Harassment Training</h1>
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
              📄 Please download and read the Bullying & Harassment Training document before completing the acknowledgement form below
            </p>
            <a
              href="/stafForms/Bullying and Harassment Training 2023.pdf"
              download="Bullying_and_Harassment_Training_2023.pdf"
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
              {hasDownloaded ? '✓ Downloaded - Click to Download Again' : 'Download Bullying & Harassment Training 2023'}
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
                  Please download the Bullying & Harassment Training document above before filling out this acknowledgement form.
                </p>
              </div>
            </div>
          )}
          <BullyingHarassmentTrainingAckForm 
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

    </div>
  );
}




