"use client";

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import SignaturePad from '@/app/components/forms/SignaturePad';

interface PDFFormViewProps {
  formType: string;
  formTitle: string;
  apiEndpoint: string;
  pdfEndpoint: string;
  downloadFilename: (data: any) => string;
  showAdminSection?: boolean; // For forms that need admin approval
}

// Helper function to load external scripts (only once)
const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if script already exists
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
};

export default function PDFFormView({ 
  formType, 
  formTitle, 
  apiEndpoint, 
  pdfEndpoint, 
  downloadFilename,
  showAdminSection = false 
}: PDFFormViewProps) {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [totalPages, setTotalPages] = useState(0);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [rendering, setRendering] = useState(false);
  const [renderedPages, setRenderedPages] = useState<number[]>([]);
  
  // Admin section state
  const [adminFormData, setAdminFormData] = useState({
    employmentStatus: '',
    payRate: '',
    schadsLevel: '',
    adminSignature: '',
    adminSignatureDate: new Date().toISOString().split('T')[0], // Default to today
  });
  const [submittingAdmin, setSubmittingAdmin] = useState(false);

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const res = await fetch(apiEndpoint);
        const result = await res.json();
        setData(result);
        
        // Generate PDF URL for viewing
        setPdfUrl(pdfEndpoint);
      } catch (error) {
        console.error('Error loading form data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadFormData();
  }, [id, apiEndpoint, pdfEndpoint]);

  // Load PDF.js from CDN and render PDF page by page
  useEffect(() => {
    if (!pdfUrl) return;

    const loadPDF = async () => {
      try {
        setRendering(true);
        
        // Load PDF.js library from CDN
        if (!(window as any).pdfjsLib) {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
        }
        
        const pdfjsLib = (window as any).pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        // Load the PDF
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

  const handleDownloadPDF = async () => {
    // Check if admin section is required and not completed
    if (showAdminSection && !data?.adminSignature) {
      alert('⚠️ Admin section must be completed before downloading.\n\nPlease fill and sign the "Office Use Only" section below.');
      return;
    }

    try {
      // Add download=true parameter to trigger download
      const downloadUrl = `${pdfEndpoint}?download=true`;
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error('Failed to generate PDF');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadFilename(data);
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate admin form
    if (!adminFormData.employmentStatus) {
      alert('Please select employment status');
      return;
    }
    if (!adminFormData.payRate) {
      alert('Please enter pay rate');
      return;
    }
    if (!adminFormData.schadsLevel) {
      alert('Please enter SCHADS level');
      return;
    }
    if (!adminFormData.adminSignature) {
      alert('Please add your signature');
      return;
    }

    try {
      setSubmittingAdmin(true);
      
      const response = await fetch(`${apiEndpoint}/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employmentStatus: adminFormData.employmentStatus,
          payRate: adminFormData.payRate,
          schadsLevel: adminFormData.schadsLevel,
          adminSignature: adminFormData.adminSignature,
          adminSignedAt: new Date(adminFormData.adminSignatureDate).toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to submit admin section');
      
      const result = await response.json();
      
      // Reload data to show updated form
      const refreshRes = await fetch(apiEndpoint);
      const refreshedData = await refreshRes.json();
      setData(refreshedData);
      
      alert('✅ Admin section submitted successfully! You can now download the PDF.');
      
      // Reload PDF to show admin signature
      setPdfUrl(''); // Clear
      setTimeout(() => setPdfUrl(pdfEndpoint), 100); // Reload
      
    } catch (error) {
      console.error('Error submitting admin section:', error);
      alert('Failed to submit admin section. Please try again.');
    } finally {
      setSubmittingAdmin(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="p-8 flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white min-h-screen">
        <div className="p-8 flex items-center justify-center">
          <div className="text-gray-600">Form data not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header - Responsive */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">{formTitle}</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">{data.staff?.firstName} {data.staff?.surname}</p>
          </div>
          <Link href={`/admin/staff/${id}`} className="text-xs sm:text-sm text-rose-600 hover:underline whitespace-nowrap">
            Back to Forms
          </Link>
        </div>
      </div>

      {/* Main Content - Responsive Container */}
      <div className="w-full mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-3 sm:p-4 lg:p-6">
          
          {/* Form Status - Responsive with proper status logic */}
          {data.staffSignature && data.adminSignature ? (
            // Fully completed - both signatures
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-green-50 rounded-lg mb-4 sm:mb-6 border-2 border-green-300">
              <div className="w-3 h-3 flex-shrink-0 bg-green-500 rounded-full"></div>
              <div className="min-w-0 flex-1">
                <p className="text-sm sm:text-base font-medium text-green-800">✅ Form Fully Completed</p>
                <p className="text-xs sm:text-sm text-green-600 break-words">
                  Staff Submitted: {new Date(data.createdAt).toLocaleDateString()} • 
                  Admin Approved: {data.adminSignedAt ? new Date(data.adminSignedAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          ) : data.staffSignature && !data.adminSignature && showAdminSection ? (
            // Staff completed, waiting for admin
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-orange-50 rounded-lg mb-4 sm:mb-6 border-2 border-orange-300">
              <div className="w-3 h-3 flex-shrink-0 bg-orange-500 rounded-full animate-pulse"></div>
              <div className="min-w-0 flex-1">
                <p className="text-sm sm:text-base font-medium text-orange-800">⏳ Awaiting Admin Approval</p>
                <p className="text-xs sm:text-sm text-orange-600 break-words">
                  Staff submitted on {new Date(data.createdAt).toLocaleDateString()} • Waiting for office approval
                </p>
              </div>
            </div>
          ) : data.staffSignature ? (
            // Staff completed (no admin section needed)
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-green-50 rounded-lg mb-4 sm:mb-6 border-2 border-green-300">
              <div className="w-3 h-3 flex-shrink-0 bg-green-500 rounded-full"></div>
              <div className="min-w-0 flex-1">
                <p className="text-sm sm:text-base font-medium text-green-800">✅ Form Completed</p>
                <p className="text-xs sm:text-sm text-green-600 break-words">
                  Submitted on {new Date(data.createdAt).toLocaleDateString()} • Digitally Signed
                </p>
              </div>
            </div>
          ) : (
            // Not yet completed
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg mb-4 sm:mb-6 border-2 border-gray-300">
              <div className="w-3 h-3 flex-shrink-0 bg-gray-400 rounded-full"></div>
              <div className="min-w-0 flex-1">
                <p className="text-sm sm:text-base font-medium text-gray-800">⏸️ Form Pending</p>
                <p className="text-xs sm:text-sm text-gray-600 break-words">
                  Not yet submitted by staff
                </p>
              </div>
            </div>
          )}

          {/* PDF Viewer - Clean Page Display */}
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

          {/* Admin Section - Only for forms requiring admin approval */}
          {showAdminSection && !data?.adminSignature && data?.staffSignature && (
            <div className="mt-8 border-t-4 border-orange-500 pt-6">
              <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-4 sm:p-6 lg:p-8">
                {/* Admin Section Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <h2 className="text-xl sm:text-2xl font-bold text-orange-900">
                    ⚠️ Office Use Only - Admin Approval Required
                  </h2>
                </div>

                <p className="text-sm text-orange-700 mb-6">
                  The staff member has completed their section. Please complete the office section below to approve this form.
                </p>

                <form onSubmit={handleAdminSubmit} className="space-y-6">
                  {/* Office Use Only Section */}
                  <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Office Use Only</h3>
                    
                    <div className="space-y-4">
                      {/* Employment Status */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Employment Status: <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="employmentStatus"
                              value="FullTime"
                              checked={adminFormData.employmentStatus === 'FullTime'}
                              onChange={(e) => setAdminFormData({...adminFormData, employmentStatus: e.target.value})}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm">Full Time</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="employmentStatus"
                              value="PartTime"
                              checked={adminFormData.employmentStatus === 'PartTime'}
                              onChange={(e) => setAdminFormData({...adminFormData, employmentStatus: e.target.value})}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm">Part Time</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="employmentStatus"
                              value="Casual"
                              checked={adminFormData.employmentStatus === 'Casual'}
                              onChange={(e) => setAdminFormData({...adminFormData, employmentStatus: e.target.value})}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm">Casual</span>
                          </label>
                        </div>
                      </div>

                      {/* Pay Rate */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Pay Rate: <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={adminFormData.payRate}
                          onChange={(e) => setAdminFormData({...adminFormData, payRate: e.target.value})}
                          placeholder="e.g., $25.00/hour"
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        />
                      </div>

                      {/* SCHADS Level */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          SCHADS Level: <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={adminFormData.schadsLevel}
                          onChange={(e) => setAdminFormData({...adminFormData, schadsLevel: e.target.value})}
                          placeholder="e.g., Level 3"
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Admin Signature Section */}
                  <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Admin Approval</h3>
                    
                    <div className="space-y-4">
                      {/* Signature Pad */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Admin Signature: <span className="text-red-500">*</span>
                        </label>
                        {adminFormData.adminSignature ? (
                          <div className="border-2 border-green-400 rounded-lg p-4 bg-green-50">
                            <img src={adminFormData.adminSignature} alt="Admin Signature" className="max-h-32 mx-auto" />
                            <button
                              type="button"
                              onClick={() => setAdminFormData({...adminFormData, adminSignature: ''})}
                              className="mt-2 w-full px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                            >
                              Clear Signature
                            </button>
                          </div>
                        ) : (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <SignaturePad
                              onEnd={(dataUrl) => {
                                if (dataUrl && dataUrl.length > 100) {
                                  setAdminFormData({...adminFormData, adminSignature: dataUrl});
                                }
                              }}
                              readOnly={false}
                            />
                            <p className="text-xs text-gray-500 text-center mt-2">
                              Sign above using your mouse, stylus, or finger
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Date - Editable */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Date: <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={adminFormData.adminSignatureDate}
                          onChange={(e) => setAdminFormData({...adminFormData, adminSignatureDate: e.target.value})}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submittingAdmin}
                    className={`w-full py-3 rounded-lg font-semibold ${
                      submittingAdmin
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {submittingAdmin ? 'Submitting...' : '✅ Submit Admin Section & Approve Form'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Admin Section Already Completed */}
          {showAdminSection && data?.adminSignature && (
            <div className="mt-8 border-t-4 border-green-500 pt-6">
              <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <h3 className="text-lg font-bold text-green-900">✅ Admin Section Completed</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700">Employment Status:</span>
                    <span className="ml-2 text-gray-900">{data.data?.employmentStatus || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Pay Rate:</span>
                    <span className="ml-2 text-gray-900">{data.data?.payRate || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">SCHADS Level:</span>
                    <span className="ml-2 text-gray-900">{data.data?.schadsLevel || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Approved on:</span>
                    <span className="ml-2 text-gray-900">
                      {data.adminSignedAt ? new Date(data.adminSignedAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions - Responsive Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t">
            <button 
              onClick={handleDownloadPDF}
              disabled={!data.staffSignature || (showAdminSection && !data?.adminSignature)}
              className={`w-full sm:w-auto px-4 py-2 sm:py-2 text-sm sm:text-base rounded-lg ${
                data.staffSignature && (!showAdminSection || data?.adminSignature)
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {!data.staffSignature 
                ? 'PDF Available After Staff Signs' 
                : (showAdminSection && !data?.adminSignature)
                  ? 'Complete Admin Section to Download'
                  : 'Download PDF'}
            </button>
            <Link 
              href={`/admin/staff/${id}/forms/${formType}/edit`}
              className="w-full sm:w-auto px-4 py-2 sm:py-2 text-sm sm:text-base bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-center"
            >
              Edit Form
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

