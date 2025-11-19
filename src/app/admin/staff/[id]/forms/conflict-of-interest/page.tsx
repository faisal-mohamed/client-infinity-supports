"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import SignatureCanvas from '@/components/ui/SignatureCanvas';

export default function AdminConflictOfInterestViewPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const staffId = parseInt(params.id as string);
  
  const [staff, setStaff] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [initialFormData, setInitialFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  
  // PDF rendering state
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [rendering, setRendering] = useState(false);
  const [renderedPages, setRenderedPages] = useState<number[]>([]);
  
  // Admin section state (separate from staff form data)
  const [adminFormData, setAdminFormData] = useState({
    reviewedBy: '',
    reviewerTitle: '',
    reviewDate: '',
    actionTaken: '',
    hrDecision: '' as 'noConflict' | 'mitigation' | 'furtherReview' | '',
    reviewerSignature: '',
    reviewerDate: '',
  });

  // Load PDF.js script
  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  };

  // Load PDF when URL is set
  useEffect(() => {
    if (!pdfUrl) return;

    const loadPDF = async () => {
      try {
        setRendering(true);
        
        if (!(window as any).pdfjsLib) {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
        }
        
        const pdfjsLib = (window as any).pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setRendering(false);
      } catch (error) {
        console.error('Error loading PDF:', error);
        setRendering(false);
      }
    };

    loadPDF();
  }, [pdfUrl]);

  // Render all pages with high quality and responsive sizing
  useEffect(() => {
    if (!pdfDoc || totalPages === 0) return;

    const renderAllPages = async () => {
      const pages: number[] = [];
      
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        try {
          const page = await pdfDoc.getPage(pageNum);
          const canvas = document.getElementById(`pdf-canvas-${pageNum}`) as HTMLCanvasElement;
          if (!canvas) continue;

          const context = canvas.getContext('2d');
          if (!context) continue;

          // Get container width for responsive sizing
          const container = canvas.parentElement;
          const containerWidth = container?.clientWidth || window.innerWidth;
          
          // Calculate responsive scale based on container width
          // A4 page width is approximately 595 points
          const basePageWidth = 595;
          const maxWidth = Math.min(containerWidth * 0.95, 1200); // Max 1200px or 95% of container
          const responsiveScale = maxWidth / basePageWidth;
          
          // Use higher scale for quality, but cap it for performance
          const scale = Math.min(responsiveScale * 1.2, 2.5);
          const devicePixelRatio = window.devicePixelRatio || 1;

          const viewport = page.getViewport({ scale: scale });
          
          // Set canvas size accounting for device pixel ratio
          canvas.width = Math.floor(viewport.width * devicePixelRatio);
          canvas.height = Math.floor(viewport.height * devicePixelRatio);
          
          // Set display size (CSS pixels) - responsive to container
          canvas.style.width = '100%';
          canvas.style.maxWidth = Math.floor(viewport.width) + 'px';
          canvas.style.height = 'auto';

          // Scale context for device pixel ratio
          const transform = devicePixelRatio !== 1
            ? [devicePixelRatio, 0, 0, devicePixelRatio, 0, 0]
            : null;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
            transform: transform,
          };

          await page.render(renderContext).promise;
          pages.push(pageNum);
        } catch (error) {
          console.error(`Error rendering page ${pageNum}:`, error);
        }
      }
      
      setRenderedPages(pages);
    };

    renderAllPages();

    // Re-render on window resize
    const handleResize = () => {
      renderAllPages();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [pdfDoc, totalPages]);

  const loadData = async () => {
    try {
      const response = await fetch(`/api/staff/${staffId}/forms/conflict-of-interest`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        showToast({
          type: 'error',
          title: 'Failed to Load Form',
          message: errorData.message || 'Unable to load form data.',
          duration: 5000,
        });
        return;
      }

      const formSubmission = await response.json();
      setStaff(formSubmission.staff || {});
      
      // Extract form data
      const submissionData = formSubmission.data || formSubmission || {};
      setInitialFormData(submissionData);
      setFormData(submissionData);
      
      // Set PDF URL for viewing
      if (submissionData.employeeSignature || formSubmission?.staffSignature) {
        setPdfUrl(`/api/staff/${staffId}/forms/conflict-of-interest/pdf`);
      }
      
      // Initialize admin form data with existing HR data if available
      setAdminFormData({
        reviewedBy: submissionData.reviewedBy || '',
        reviewerTitle: submissionData.reviewerTitle || '',
        reviewDate: submissionData.reviewDate || '',
        actionTaken: submissionData.actionTaken || '',
        hrDecision: submissionData.hrDecision || '',
        reviewerSignature: submissionData.reviewerSignature || '',
        reviewerDate: submissionData.reviewerDate || '',
      });
    } catch (error: any) {
      console.error('Error loading data:', error);
      showToast({
        type: 'error',
        title: 'Connection Error',
        message: 'Unable to connect to the server.',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (staffId) loadData();
  }, [staffId, showToast]);

  const handleDownloadPDF = async () => {
    // Check if staff has signed
    const hasEmployeeSignature = formData?.employeeSignature || formData?.staffSignature;
    if (!hasEmployeeSignature) {
      showToast({
        type: 'warning',
        title: 'PDF Not Available',
        message: 'PDF will be available after staff member signs the form.',
        duration: 4000,
      });
      return;
    }

    setDownloading(true);
    try {
      const pdfUrl = `/api/staff/${staffId}/forms/conflict-of-interest/pdf`;
      
      // Fetch the PDF
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error('Failed to generate PDF');
      
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Conflict_of_Interest_${staff?.firstName}_${staff?.surname}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showToast({
        type: 'success',
        title: 'PDF Downloaded',
        message: 'PDF has been downloaded successfully.',
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Error downloading PDF:', error);
      showToast({
        type: 'error',
        title: 'Download Failed',
        message: 'Failed to download PDF. Please try again.',
        duration: 5000,
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`/api/staff/${staffId}/forms/conflict-of-interest/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminFormData),
      });

      const result = await response.json();

      if (response.ok) {
        showToast({
          type: 'success',
          title: 'HR Section Submitted',
          message: 'The HR section has been submitted successfully. Form status updated to completed.',
          duration: 4000,
        });

        // Reload data to get updated status and refresh PDF
        setTimeout(() => {
          loadData();
          // Force PDF to reload by updating URL with timestamp
          setPdfUrl(`/api/staff/${staffId}/forms/conflict-of-interest/pdf?t=${Date.now()}`);
        }, 500);
      } else {
        showToast({
          type: 'error',
          title: 'Save Failed',
          message: result.message || result.error || 'Failed to save HR section.',
          duration: 5000,
        });
      }
    } catch (error: any) {
      console.error('Error saving HR section:', error);
      showToast({
        type: 'error',
        title: 'Network Error',
        message: 'Unable to connect to the server.',
        duration: 5000,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  const hasEmployeeSignature = formData?.employeeSignature;
  const hasAdminSignature = formData?.reviewerSignature;

  return (
    <div className="min-h-screen bg-gray-100 py-4 md:py-8">
      <div className="w-full max-w-7xl mx-auto px-2 md:px-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-4 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Conflict of Interest Disclosure Form</h1>
              <p className="text-gray-600">{staff?.firstName} {staff?.surname}</p>
              {hasEmployeeSignature && (
                <p className="text-sm text-green-600 mt-1">
                  ✓ Staff submitted on {formData?.createdAt ? new Date(formData.createdAt).toLocaleDateString('en-AU') : ''}
                </p>
              )}
            </div>
            <button 
              onClick={() => router.push(`/admin/staff/${staffId}`)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 self-start sm:self-auto"
            >
              ← Back to Staff
            </button>
          </div>
        </div>

        {/* Warning if staff hasn't signed */}
        {!hasEmployeeSignature && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-4">
            <p className="text-sm text-yellow-800 font-semibold">
              ⚠️ Staff member has not yet signed the form. Please wait for staff to complete their section before filling the HR section.
            </p>
          </div>
        )}

        {/* PDF Viewer - Clean Page Display */}
        {hasEmployeeSignature && (
          <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 lg:p-6 mb-6">
            {rendering ? (
              <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
                <div className="text-gray-600">Loading PDF pages...</div>
              </div>
            ) : totalPages === 0 ? (
              <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
                <div className="text-gray-600">No pages to display</div>
              </div>
            ) : (
              <div className="space-y-8 sm:space-y-10 lg:space-y-12">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <div key={pageNum} className="w-full">
                    {/* Page Container - Clean separation */}
                    <div className="bg-gradient-to-b from-gray-50 to-white p-4 sm:p-6 lg:p-8 rounded-xl border-2 border-gray-300 shadow-2xl">
                      {/* PDF Page Content */}
                      <div className="flex justify-center bg-white p-2 rounded-lg border border-gray-200">
                        <canvas 
                          id={`pdf-canvas-${pageNum}`}
                          className="shadow-xl bg-white max-w-full h-auto"
                          style={{
                            imageRendering: 'crisp-edges',
                            WebkitFontSmoothing: 'antialiased',
                            MozOsxFontSmoothing: 'grayscale',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Admin Section - Editable */}
        {hasEmployeeSignature && !hasAdminSignature && (
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-2">For HR/Management Use Only</h2>
              <p className="text-sm text-gray-600 mb-4">
                Please complete the HR/Management section below to approve this form.
              </p>
            </div>

            <form onSubmit={handleAdminSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Reviewed by: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={adminFormData.reviewedBy}
                    onChange={(e) => setAdminFormData({...adminFormData, reviewedBy: e.target.value})}
                    className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={adminFormData.reviewerTitle}
                    onChange={(e) => setAdminFormData({...adminFormData, reviewerTitle: e.target.value})}
                    className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date: <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={adminFormData.reviewDate}
                  onChange={(e) => setAdminFormData({...adminFormData, reviewDate: e.target.value})}
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Action Taken (if applicable):
                </label>
                <textarea
                  value={adminFormData.actionTaken}
                  onChange={(e) => setAdminFormData({...adminFormData, actionTaken: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  HR Decision: <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="hrDecision"
                      value="noConflict"
                      checked={adminFormData.hrDecision === 'noConflict'}
                      onChange={(e) => setAdminFormData({...adminFormData, hrDecision: e.target.value as any})}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      required
                    />
                    <span className="text-sm">No conflict found</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="hrDecision"
                      value="mitigation"
                      checked={adminFormData.hrDecision === 'mitigation'}
                      onChange={(e) => setAdminFormData({...adminFormData, hrDecision: e.target.value as any})}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      required
                    />
                    <span className="text-sm">Conflict identified and mitigation plan implemented</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="hrDecision"
                      value="furtherReview"
                      checked={adminFormData.hrDecision === 'furtherReview'}
                      onChange={(e) => setAdminFormData({...adminFormData, hrDecision: e.target.value as any})}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      required
                    />
                    <span className="text-sm">Further review required</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Signature of Reviewer: <span className="text-red-500">*</span>
                </label>
                <div className="border border-gray-300 rounded-lg p-2">
                  <SignatureCanvas
                    existingSignature={adminFormData.reviewerSignature}
                    onSignatureEnd={(signature) => setAdminFormData({...adminFormData, reviewerSignature: signature})}
                    onSignatureClear={() => setAdminFormData({...adminFormData, reviewerSignature: ''})}
                    width={600}
                    height={100}
                    className="bg-white"
                    disabled={false}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date: <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={adminFormData.reviewerDate}
                  onChange={(e) => setAdminFormData({...adminFormData, reviewerDate: e.target.value})}
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 w-full sm:w-auto"
                >
                  {saving ? 'Saving...' : 'Submit HR Section & Complete Form'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Show completed message if admin has already signed */}
        {hasAdminSignature && (
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800 font-semibold">
              ✅ HR/Management section has been completed. This form is fully approved.
            </p>
          </div>
        )}

        {/* Download PDF Button - Below everything */}
        {hasEmployeeSignature && (
          <div className="flex justify-center pt-4 sm:pt-6 mt-4 sm:mt-6 border-t">
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {downloading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Downloading...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

