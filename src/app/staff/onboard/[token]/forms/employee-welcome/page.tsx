"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import SignatureCanvas from '@/components/ui/SignatureCanvas';
import LoadingView from '@/components/ui/LoadingView';

const PDF_JS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const PDF_JS_WORKER_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const styles = `
  @media (max-width: 768px) {
    .a4-ack-form {
      padding: 24px 32px 60px 32px !important;
    }
  }
`;

const loadScript = (src: string): Promise<void> =>
  new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });

export default function EmployeeWelcomeFormPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [staff, setStaff] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pdfPages, setPdfPages] = useState<string[]>([]);
  const [page37Image, setPage37Image] = useState<string>('');
  const [rendering, setRendering] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({ readAcknowledgement: false, fullName: '', signature: '', date: '' });
  const { showToast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      console.log('🔵 [Employee Welcome Pack Page] Loading data for token:', token);
      try {
        const res = await fetch(`/api/staff/onboard/${token}`);
        const data = await res.json();
        console.log('🔵 [Employee Welcome Pack Page] API Response:', data);
        
        if (!res.ok) throw new Error(data.error);
        
        setStaff(data.staff);
      } catch (error: any) {
        console.error('❌ [Employee Welcome Pack Page] Error loading data:', error);
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
  }, [token, showToast]);

  // Load and render PDF pages 1-36
  useEffect(() => {
    if (!staff?.id) return;

    const renderPdf = async () => {
      setRendering(true);
      try {
        await loadScript(PDF_JS_CDN);
        await loadScript(PDF_JS_WORKER_CDN);
        const w: any = window as any;
        const pdfjsLib = w.pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_JS_WORKER_CDN;

        const pdfUrl = `/api/staff/${staff.id}/forms/employee-welcome/pdf?blank=true`;
        const loadingTask = pdfjsLib.getDocument({
          url: pdfUrl,
          withCredentials: true,
        });
        const pdf = await loadingTask.promise;

        const images: string[] = [];
        const devicePixelRatio = Math.max(window.devicePixelRatio || 1, 1);
        
        // Responsive max width based on screen size (optimized for speed)
        let maxWidth: number;
        let qualityMultiplier: number;
        if (window.innerWidth < 480) {
          maxWidth = 350;
          qualityMultiplier = 1.0; // Reduced from 1.2
        } else if (window.innerWidth < 768) {
          maxWidth = 450;
          qualityMultiplier = 1.3; // Reduced from 1.5
        } else if (window.innerWidth < 1024) {
          maxWidth = 650;
          qualityMultiplier = 1.5; // Reduced from 1.8
        } else if (window.innerWidth < 1440) {
          maxWidth = 800;
          qualityMultiplier = 1.7; // Reduced from 2.0
        } else {
          maxWidth = 900;
          qualityMultiplier = 1.9; // Reduced from 2.2
        }
        
        const basePageWidth = 595; // A4 width in points
        const displayWidth = Math.min(window.innerWidth * 0.95, maxWidth);
        const responsiveScale = displayWidth / basePageWidth;
        // Further optimize scale for faster rendering (15% reduction for speed)
        const adjustedQualityMultiplier = qualityMultiplier * 0.85;
        const baseScale = Math.min(responsiveScale * adjustedQualityMultiplier, 2.0); // Reduced max to 2.0 for faster rendering

        // Render pages 1-36 in parallel batches for optimal performance
        const pagesToRender = Math.min(36, pdf.numPages);
        const BATCH_SIZE = 8; // Render 8 pages at a time to avoid overwhelming the browser
        
        // Render pages in batches for better memory management and performance
        for (let batchStart = 0; batchStart < pagesToRender; batchStart += BATCH_SIZE) {
          const batchEnd = Math.min(batchStart + BATCH_SIZE, pagesToRender);
          const batchPromises = Array.from({ length: batchEnd - batchStart }, async (_, batchIndex) => {
            const pageIndex = batchStart + batchIndex;
            const pageNum = pageIndex + 1;
            try {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: baseScale });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d", { 
              alpha: false,
              desynchronized: true, // Enable for better performance
              willReadFrequently: false
            });
            if (!context) return null;

            canvas.width = Math.floor(viewport.width * devicePixelRatio);
            canvas.height = Math.floor(viewport.height * devicePixelRatio);
            
            // Set responsive display size
            canvas.style.width = '100%';
            canvas.style.maxWidth = `${Math.floor(viewport.width)}px`;
            canvas.style.height = 'auto';
            canvas.style.margin = '0 auto';
            canvas.style.display = 'block';

            const transform = devicePixelRatio !== 1
              ? [devicePixelRatio, 0, 0, devicePixelRatio, 0, 0]
              : null;

            const renderContext = {
              canvasContext: context,
              viewport: viewport,
              transform: transform,
            };

            await page.render(renderContext).promise;
            // Use JPEG with lower quality for faster rendering and smaller file size
            return {
              index: pageIndex,
              image: canvas.toDataURL("image/jpeg", 0.85) // JPEG at 85% quality - faster and smaller than PNG
            };
          } catch (error) {
            console.error(`Error rendering page ${pageNum}:`, error);
            return null;
          }
          });
          
          // Wait for this batch to complete
          const batchResults = await Promise.all(batchPromises);
          
          // Add completed pages to images array in order
          batchResults
            .filter((page): page is { index: number; image: string } => page !== null)
            .sort((a, b) => a.index - b.index)
            .forEach((page) => {
              images.push(page.image);
            });
        }

        // Render page 37 separately for editable form
        if (pdf.numPages >= 37) {
          const page37 = await pdf.getPage(37);
          const viewport37 = page37.getViewport({ scale: baseScale });
          const canvas37 = document.createElement("canvas");
          const context37 = canvas37.getContext("2d", { 
            alpha: false,
            desynchronized: false,
            willReadFrequently: false
          });
          if (context37) {
            canvas37.width = Math.floor(viewport37.width * devicePixelRatio);
            canvas37.height = Math.floor(viewport37.height * devicePixelRatio);
            canvas37.style.width = '100%';
            canvas37.style.maxWidth = `${Math.floor(viewport37.width)}px`;
            canvas37.style.height = 'auto';
            canvas37.style.margin = '0 auto';
            canvas37.style.display = 'block';

            const transform37 = devicePixelRatio !== 1
              ? [devicePixelRatio, 0, 0, devicePixelRatio, 0, 0]
              : null;

            const renderContext37 = {
              canvasContext: context37,
              viewport: viewport37,
              transform: transform37,
            };

            await page37.render(renderContext37).promise;
            // Use JPEG with lower quality for faster rendering and smaller file size
            setPage37Image(canvas37.toDataURL("image/jpeg", 0.85)); // JPEG at 85% quality - faster and smaller
          }
        }

        setPdfPages(images);
      } catch (err: any) {
        console.error("PDF render error:", err);
        showToast({
          type: 'error',
          title: 'PDF Load Error',
          message: err.message || 'Failed to load PDF',
          duration: 5000,
        });
      } finally {
        setRendering(false);
      }
    };

    renderPdf();
  }, [staff?.id, showToast]);

  useEffect(() => {
    const loadFormData = async () => {
      if (!token) return;
      try {
        const res = await fetch(`/api/staff/onboard/${token}`);
        if (res.ok) {
          const data = await res.json();
          const welcomeData = data.submissions?.employee_welcome || {};
          // Get staff name from database (like other forms)
          const staffName = data.staff 
            ? `${data.staff.firstName || ''} ${data.staff.surname || ''}`.trim()
            : '';
          setFormData({
            readAcknowledgement: welcomeData.readAcknowledgement || false,
            fullName: welcomeData.fullName || staffName, // Use saved name or fetch from staff data
            signature: welcomeData.signature || '',
            date: welcomeData.date || ''
          });
        }
      } catch (error) {
        console.error('Error loading form data:', error);
      }
    };
    loadFormData();
  }, [token]);

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (isSubmit = false) => {
    // Validate required fields before submitting
    if (isSubmit) {
      const missingFields: string[] = [];
      
      if (!formData.readAcknowledgement) {
        missingFields.push('Acknowledgement checkbox');
      }
      if (!formData.fullName || formData.fullName.trim() === '') {
        missingFields.push('Name');
      }
      if (!formData.signature || formData.signature.trim() === '') {
        missingFields.push('Signature');
      }
      if (!formData.date || formData.date.trim() === '') {
        missingFields.push('Date');
      }
      
      if (missingFields.length > 0) {
        showToast({
          type: 'error',
          title: 'Validation Error',
          message: `Please fill in required fields: ${missingFields.join(', ')}`,
          duration: 5000,
        });
        return false;
      }
    }
    
    setSaving(true);
    try {
      const response = await fetch(`/api/staff/onboard/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formKey: 'employee_welcome',
          data: formData,
          submit: isSubmit,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        if (isSubmit) {
        showToast({
          type: 'success',
          title: 'Form Submitted',
          message: 'Form submitted successfully!',
          duration: 3000,
        });
          // Check if this is a signature link by checking the URL path
          const isSignatureLink = window.location.pathname.includes('/staff/signature/');
        setTimeout(() => {
            router.push(isSignatureLink ? `/staff/signature/${token}` : `/staff/onboard/${token}`);
        }, 1000);
        } else {
        showToast({
          type: 'success',
          title: 'Draft Saved',
          message: 'Draft saved successfully!',
          duration: 3000,
        });
        }
        return true;
      } else {
        throw new Error(result.message || result.error || 'Failed to save form');
      }
    } catch (error: any) {
      console.error('❌ [Employee Welcome Page] Error saving:', error);
      showToast({
        type: 'error',
        title: 'Save Failed',
        message: error.message || 'Failed to save form',
        duration: 4000,
      });
      return false;
    } finally {
      setSaving(false);
    }
  };


  // Show loading until initial data is loaded AND PDF rendering is complete
  if (loading || rendering) {
    return <LoadingView title="Loading Employee Welcome Pack" message="Please wait while we prepare the form..." />;
  }

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
        <div className="max-w-4xl mx-auto px-2 sm:px-4 md:px-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Employee Welcome Pack</h1>
              <p className="text-sm sm:text-base text-gray-600">{staff?.firstName} {staff?.surname}</p>
            </div>
            <button
              onClick={() => {
                const isSignatureLink = window.location.pathname.includes('/staff/signature/');
                router.push(isSignatureLink ? `/staff/signature/${token}` : `/staff/onboard/${token}`);
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 self-start sm:self-auto transition-colors"
            >
              ← Back to Forms
            </button>
          </div>
        </div>

        {/* PDF Pages 1-36 (Read-only) - Only show after rendering is complete */}
        {pdfPages.length > 0 && (
          <div className="space-y-4 sm:space-y-5 mb-6 sm:mb-8">
            {pdfPages.map((src, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 flex justify-center"
              >
                <img
                  src={src}
                  alt={`PDF page ${idx + 1}`}
                  className="w-full h-auto rounded-md"
                  style={{
                    maxWidth: '100%',
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain'
                  }}
                />
                </div>
            ))}
              </div>
            )}

        {/* Page 37: Editable Acknowledgement Form - A4 page size matching PDF design - Only show after PDF pages are loaded */}
        {pdfPages.length > 0 && (
        <div className="flex justify-center mb-4 sm:mb-6">
          <div 
            className="bg-white shadow-sm border border-gray-200 mx-auto a4-ack-form"
            style={{
              width: '100%',
              maxWidth: '794px',
              minHeight: '1123px',
              padding: '48px 96px 112px 96px',
              boxSizing: 'border-box',
              position: 'relative'
            }}
          >
            {/* Header with logo matching PDF */}
            <div className="flex justify-center mt-2 mb-6">
              <img src="/client_full_logo.jpg" alt="Company Logo" className="h-16 object-contain" />
            </div>

            <h2 className="text-center font-semibold mb-6" style={{ fontSize: '14pt' }}>
              Employee Handbook Acknowledgement Form
            </h2>

            <p className="mb-4" style={{ fontSize: '11pt', lineHeight: 1.6 }}>
              I confirm I have received the Employee handbook from Infinity Supports and have read and understood the content.
            </p>
            <p className="mb-8" style={{ fontSize: '11pt', lineHeight: 1.6 }}>
              A printed version of this handbook is also available. If you would like a printed version, please contact us.
            </p>

            <div className="space-y-5" style={{ marginTop: '40px' }}>
              {/* Acknowledgement Checkbox - Required */}
              <div className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg bg-gray-50 mb-6">
                <input
                  id="readAcknowledgement"
                  type="checkbox"
                  checked={formData.readAcknowledgement}
                  onChange={(e) => handleChange('readAcknowledgement', e.target.checked)}
                  className="mt-1 w-5 h-5 x-mark rounded border-gray-300 focus:ring-blue-500 focus:ring-2 cursor-pointer"
                />
                <label htmlFor="readAcknowledgement" className="text-[11pt] leading-relaxed">
                  <strong>I acknowledge that:</strong><br />
                  • I have received the Employee Handbook from Infinity Supports<br />
                  • I have read and understood the content<br />
                  • I agree to comply with all policies and procedures outlined in the handbook
                  <span className="text-red-500 ml-1">*</span>
                </label>
              </div>

              {/* Name Field - matching PDF layout - Required and Read-only (from DB) */}
              <div className="flex items-end" style={{ gap: '16px', marginBottom: '20px' }}>
                <label className="font-normal flex-shrink-0" style={{ fontSize: '11pt', width: '80px' }}>
                  Name <span className="text-red-500">*</span>
                </label>
                <div className="flex-1 border-b border-dotted border-gray-900" style={{ minHeight: '20px', paddingBottom: '4px', paddingLeft: '8px', backgroundColor: '#f9fafb' }}>
                  <input
                    type="text"
                    value={formData.fullName}
                    readOnly
                    disabled
                    placeholder=""
                    className="w-full bg-transparent focus:outline-none cursor-not-allowed opacity-70"
                    style={{ fontSize: '11pt', border: 'none', padding: 0, color: '#374151' }}
                  />
                </div>
              </div>

              {/* Signature Field - using regular signature component - Required */}
              <div className="flex items-start" style={{ gap: '16px', marginBottom: '20px' }}>
                <label className="font-normal flex-shrink-0 pt-2" style={{ fontSize: '11pt', width: '80px' }}>
                  Signature <span className="text-red-500">*</span>
                </label>
                <div className="flex-1" style={{ minWidth: 0 }}>
                  {!formData.signature && (
                    <div className="text-xs text-red-500 mb-1">Signature is required</div>
                  )}
                  <SignatureCanvas
                    onSignatureEnd={(sig) => handleChange('signature', sig)}
                    onSignatureClear={() => handleChange('signature', '')}
                    existingSignature={formData.signature}
                    width={400}
                    height={100}
                    backgroundColor="white"
                    showClearButton={true}
                    clearButtonText="Clear Signature"
                    placeholder="Draw your signature in the box above"
                    className={`w-full ${!formData.signature ? 'border-2 border-red-300 rounded' : ''}`}
                  />
                </div>
              </div>

              {/* Date Field - matching PDF layout - Required */}
              <div className="flex items-end" style={{ gap: '16px' }}>
                <label className="font-normal flex-shrink-0" style={{ fontSize: '11pt', width: '80px' }}>
                  Date <span className="text-red-500">*</span>
                </label>
                <div className={`flex-1 border-b border-dotted ${!formData.date ? 'border-red-500' : 'border-gray-900'}`} style={{ minHeight: '20px', paddingBottom: '4px', paddingLeft: '8px' }}>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className="w-full bg-transparent focus:outline-none"
                    style={{ fontSize: '11pt', border: 'none', padding: 0 }}
                    required
                  />
                </div>
              </div>
            </div>
              </div>
            </div>
          )}
        
        {/* Action Buttons - Only show after PDF is loaded */}
        {pdfPages.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-6 py-2 text-sm sm:text-base bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="px-6 py-2 text-sm sm:text-base bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Submitting...' : 'Submit & Continue'}
            </button>
          </div>
        </div>
        )}
      </div>
    </div>
    </>
  );
}
