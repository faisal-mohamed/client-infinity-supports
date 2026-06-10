"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useToast } from '@/components/ui/Toast';
import LoadingView from '@/components/ui/LoadingView';
import SignatureCanvas, { SignatureCanvasRef } from '@/components/ui/SignatureCanvas';

export default function VehicleSafetyInspectionFormPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const [staff, setStaff] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [documentDownloaded, setDocumentDownloaded] = useState(false);
  const [acknowledgmentData, setAcknowledgmentData] = useState({
    acknowledged: false,
    acknowledgmentDate: '',
    signature: ''
  });
  const sigRef = useRef<SignatureCanvasRef | null>(null);


  useEffect(() => {
    const loadData = async () => {
      try {
        // Detect if this is a signature link or onboard link
        const isSignatureLink = window.location.pathname.includes('/staff/signature/');
        const apiEndpoint = isSignatureLink 
          ? `/api/staff/signature/${token}` 
          : `/api/staff/onboard/${token}`;
        
        const response = await fetch(apiEndpoint);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          showToast({
            type: 'error',
            title: 'Failed to Load Form',
            message: errorData.message || 'Unable to load form data. Please refresh the page and try again.',
            duration: 5000,
          });
          return;
        }

        const staffData = await response.json();
        setStaff(staffData.staff || staffData);
        
        // Load saved form data - handle both signature and onboard structures
        let formSubmission: any = {};
        if (isSignatureLink) {
          const vehicleForm = staffData.signatureForms?.find(
            (f: any) => f.formSubmission?.form?.formKey === 'vehicle_safety_inspection'
          );
          if (vehicleForm && vehicleForm.formSubmission?.data) {
            formSubmission = vehicleForm.formSubmission.data;
          }
        } else {
          // Check submissions dictionary
          if (staffData.submissions && staffData.submissions['vehicle_safety_inspection']) {
            formSubmission = staffData.submissions['vehicle_safety_inspection'];
          }
        }
        
        setFormData(formSubmission);
        
        // Load download and acknowledgment states
        if (formSubmission.documentDownloaded) {
          setDocumentDownloaded(true);
        }
        if (formSubmission.acknowledgmentData) {
          setAcknowledgmentData(formSubmission.acknowledgmentData);
        }
      } catch (error: any) {
        console.error('Error loading data:', error);
        showToast({
          type: 'error',
          title: 'Connection Error',
          message: 'Unable to connect to the server. Please check your internet connection and try again.',
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadData();
    }
  }, [token, showToast]);


  const [pdfUrl, setPdfUrl] = useState<string>('');

  useEffect(() => {
    if (staff?.id) {
      // Generate PDF URL - it will work even with empty form data
      const pdfEndpoint = `/api/staff/${staff.id}/forms/vehicle_safety_inspection/pdf`;
      setPdfUrl(pdfEndpoint);
    }
  }, [staff]);

  // Handle document download
  const handleDownload = useCallback(async () => {
    try {
      setDownloading(true);
      
      if (!staff?.id || !pdfUrl) {
        showToast({
          type: 'error',
          title: 'Error',
          message: 'Staff information not loaded. Please refresh the page.',
          duration: 5000,
        });
        return;
      }

      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `Vehicle_Safety_Inspection_Checklist_${staff.firstName}_${staff.surname}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      
      // Wait a bit before removing the link
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);

      // Mark as downloaded and save state
      setDocumentDownloaded(true);
      
      const isSignatureLink = window.location.pathname.includes('/staff/signature/');
      const apiEndpoint = isSignatureLink
        ? `/api/staff/signature/${token}/forms/vehicle_safety_inspection`
        : `/api/staff/onboard/${token}`;
      
      await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formKey: 'vehicle_safety_inspection',
          data: {
            ...formData,
            documentDownloaded: true,
            acknowledgmentData: acknowledgmentData
          },
          submit: false,
        }),
      });

      showToast({
        type: 'success',
        title: 'Document Downloaded',
        message: 'You can now proceed to fill the acknowledgment form.',
        duration: 4000,
      });
    } catch (error: any) {
      console.error('Error downloading document:', error);
      showToast({
        type: 'error',
        title: 'Download Error',
        message: 'Failed to download document. Please try again.',
        duration: 5000,
      });
    } finally {
      setDownloading(false);
    }
  }, [staff, token, pdfUrl, formData, acknowledgmentData, showToast]);

  // Handle acknowledgment form changes
  const handleAcknowledgmentChange = useCallback((field: string, value: any) => {
    setAcknowledgmentData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Handle signature
  const handleSignatureEnd = useCallback((signatureDataUrl: string) => {
    handleAcknowledgmentChange('signature', signatureDataUrl);
  }, [handleAcknowledgmentChange]);

  const handleSignatureClear = useCallback(() => {
    handleAcknowledgmentChange('signature', '');
  }, [handleAcknowledgmentChange]);

  // Validate and submit acknowledgment
  const handleSubmitAcknowledgment = useCallback(async () => {
    if (!acknowledgmentData.acknowledged) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please acknowledge that you have read and understood the document.',
        duration: 5000,
      });
      return;
    }
    if (!acknowledgmentData.acknowledgmentDate) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please provide the acknowledgment date.',
        duration: 5000,
      });
      return;
    }
    if (!acknowledgmentData.signature) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please provide your signature.',
        duration: 5000,
      });
      return;
    }

    setSaving(true);
    try {
      const isSignatureLink = window.location.pathname.includes('/staff/signature/');
      const apiEndpoint = isSignatureLink
        ? `/api/staff/signature/${token}/forms/vehicle_safety_inspection`
        : `/api/staff/onboard/${token}`;
      
      // Save with signature - this marks the form as submitted
      // The API expects signature in the data object as 'signature' or 'staffSignature'
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formKey: 'vehicle_safety_inspection',
          data: {
            ...formData,
            documentDownloaded: true,
            acknowledgmentData: acknowledgmentData,
            // Include signature in data for API to extract
            signature: acknowledgmentData.signature,
            staffSignature: acknowledgmentData.signature,
            staffSignedAt: new Date().toISOString(),
          },
          submit: true,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        showToast({
          type: 'success',
          title: 'Form Submitted',
          message: 'Your acknowledgment has been submitted successfully.',
          duration: 4000,
        });
        
        setTimeout(() => {
          router.push(isSignatureLink ? `/staff/signature/${token}` : `/staff/onboard/${token}`);
        }, 1000);
      } else {
        showToast({
          type: 'error',
          title: 'Submission Failed',
          message: result.message || result.error || 'Failed to submit acknowledgment. Please try again.',
          duration: 5000,
        });
      }
    } catch (error: any) {
      console.error('Error submitting acknowledgment:', error);
      showToast({
        type: 'error',
        title: 'Network Error',
        message: 'Unable to connect to the server. Please check your internet connection and try again.',
        duration: 5000,
      });
    } finally {
      setSaving(false);
    }
  }, [acknowledgmentData, formData, token, router, showToast]);

  if (loading) {
    return <LoadingView title="Loading Vehicle Safety Inspection Form" message="Please wait..." />;
  }

  return (
    <div className=" py-6 md:py-10">
      <div className="w-full max-w-5xl mx-auto px-4 md:px-6">
        {/* Professional Header */}
        <div className="bg-white rounded-xl shadow-soft border border-azure-200 p-6 md:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-azure-200">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-azure-700 mb-2">Vehicle Safety Inspection Checklist</h1>
              <div className="flex items-center gap-2 text-azure-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-medium">{staff?.firstName} {staff?.surname}</span>
              </div>
            </div>
            <button
              onClick={() => {
                const isSignatureLink = window.location.pathname.includes('/staff/signature/');
                router.push(isSignatureLink ? `/staff/signature/${token}` : `/staff/onboard/${token}`);
              }}
              className="flex items-center gap-2 px-4 py-2 text-azure-600 hover:text-azure-700 hover:bg-azure-50 rounded-lg transition-colors self-start sm:self-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Forms
            </button>
          </div>
        </div>

        {/* Step 1: Download PDF */}
        <div className="bg-white rounded-xl shadow-soft border border-azure-200 p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg ${
              documentDownloaded 
                ? 'bg-emerald-500 text-white' 
                : 'bg-azure-700 text-white'
            }`}>
              {documentDownloaded ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                '1'
              )}
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-azure-700">Step 1: Download Document</h2>
              <p className="text-sm text-azure-400">Download the PDF checklist before proceeding</p>
            </div>
          </div>
          
          <div className="bg-gold-50 border-l-4 border-gold-500 p-4 rounded-r-lg mb-6">
            <p className="text-azure-600">
              Please download the Vehicle Safety Inspection Checklist PDF document before proceeding to the acknowledgment form.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            {pdfUrl && (
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-bold text-lg transition-all bg-azure-700 text-white hover:bg-azure-700 shadow-soft  transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {downloading ? (
                  <>
                    <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Downloading...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {documentDownloaded ? 'Download PDF Again' : 'Download PDF Document'}
                  </>
                )}
              </button>
            )}
            {documentDownloaded && (
              <p className="text-sm text-azure-400 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Document downloaded. You can download again anytime if needed.
              </p>
            )}
          </div>
        </div>

        {/* Step 2: Acknowledgment Form - Locked until download */}
        <div className={`bg-white rounded-xl shadow-soft border border-azure-200 p-6 md:p-8 mb-6 transition-all ${
          !documentDownloaded ? 'opacity-60 pointer-events-none' : ''
        }`}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg ${
              documentDownloaded 
                ? 'bg-azure-700 text-white' 
                : 'bg-azure-200 text-azure-400'
            }`}>
              2
            </div>
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-azure-700">Step 2: Acknowledgment Form</h2>
              <p className="text-sm text-azure-400">Complete and submit your acknowledgment</p>
            </div>
            {!documentDownloaded && (
              <span className="flex items-center gap-2 text-sm text-gold-700 bg-gold-50 border border-gold-200 px-4 py-2 rounded-lg font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Complete Step 1 first
              </span>
            )}
          </div>
          
          {documentDownloaded ? (
            <div className="w-full flex justify-center">
              <div className="bg-white w-full max-w-[794px] min-h-[1123px] border shadow relative px-[96px] pt-12 pb-[112px] a4-ack">
                {/* Header with logo */}
                <div className="flex justify-center mb-8">
                  <img 
                    src="/client_full_logo.jpg" 
                    alt="Infinity Supports WA logo" 
                    className="h-16 object-contain" 
                  />
                </div>

                {/* Title */}
                <h2 className="text-center font-semibold mb-6 text-[14pt]">
                  Vehicle Safety Inspection Checklist – Acknowledgement
                </h2>

                {/* Acknowledgment Paragraphs */}
                <p className="mb-4 text-[11pt] leading-relaxed">
                  I confirm that I have received, read, and understood the Vehicle Safety Inspection Checklist document provided to me by Infinity Supports WA. I understand the inspection requirements and procedures outlined in the document.
                </p>
                <p className="mb-8 text-[11pt] leading-relaxed">
                  I acknowledge that it is my responsibility to conduct vehicle safety inspections in accordance with the checklist and to report any issues or concerns identified during inspections.
                </p>

                {/* Acknowledgment Box */}
                <div className="border border-azure-300 rounded-lg p-4 mb-8 bg-azure-50">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={acknowledgmentData.acknowledged}
                      onChange={(e) => handleAcknowledgmentChange('acknowledged', e.target.checked)}
                      className="mt-1 w-5 h-5 text-gold-600 border-azure-300 rounded focus:ring-gold-500 flex-shrink-0 cursor-pointer"
                    />
                    <div className="flex-1">
                      <p className="text-[11pt] font-bold mb-2">I acknowledge that:</p>
                      <ul className="text-[11pt] space-y-1 list-disc list-inside text-azure-600">
                        <li>I have received the Vehicle Safety Inspection Checklist from Infinity Supports WA</li>
                        <li>I have read and understood the inspection requirements and procedures</li>
                        <li>I will conduct vehicle safety inspections in accordance with the checklist</li>
                        <li>I will report any issues or concerns identified during inspections</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Name Field */}
                <div className="mb-6">
                  <label className="block text-[11pt] font-bold mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <div className="border-b border-dotted border-azure-900 min-h-[28px] pb-1 px-1">
                    <span className="text-[11pt] text-azure-700">
                      {staff?.firstName} {staff?.surname}
                    </span>
                  </div>
                </div>

                {/* Date Field */}
                <div className="mb-6">
                  <label className="block text-[11pt] font-bold mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <div className="border-b border-dotted border-azure-900 min-h-[28px] pb-1 px-1">
                    <input
                      type="date"
                      value={acknowledgmentData.acknowledgmentDate}
                      onChange={(e) => handleAcknowledgmentChange('acknowledgmentDate', e.target.value)}
                      className="w-full text-[11pt] bg-transparent border-none outline-none focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Signature Field */}
                <div className="mb-8">
                  <label className="block text-[11pt] font-bold mb-2">
                    Signature <span className="text-red-500">*</span>
                  </label>
                  <div className="border border-dotted border-azure-900 min-h-[80px] p-3 bg-white">
                    <SignatureCanvas
                      ref={sigRef}
                      onSignatureEnd={handleSignatureEnd}
                      onSignatureClear={handleSignatureClear}
                      existingSignature={acknowledgmentData.signature}
                      width={600}
                      height={150}
                      penColor="black"
                      className="w-full"
                    />
                  </div>
                  {!acknowledgmentData.signature && (
                    <p className="text-[10pt] text-azure-400 mt-2 italic">
                      Please draw your signature above
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-6 border-t border-azure-200">
                  <button
                    onClick={handleSubmitAcknowledgment}
                    disabled={saving || !acknowledgmentData.acknowledged || !acknowledgmentData.acknowledgmentDate || !acknowledgmentData.signature}
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-azure-700 text-white rounded-lg hover:bg-azure-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-[12pt] shadow-soft  transition-all"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Submit Acknowledgment
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-azure-50 rounded-xl border-2 border-dashed border-azure-300">
              <svg className="w-16 h-16 text-azure-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-azure-400 font-medium text-lg">Please complete Step 1 to unlock this form</p>
              <p className="text-azure-400 text-sm mt-2">Download the PDF document first</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
