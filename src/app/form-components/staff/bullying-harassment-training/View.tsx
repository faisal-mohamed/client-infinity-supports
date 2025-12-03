"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import SignaturePad from '@/app/components/forms/SignaturePad';
import LoadingView from '@/components/ui/LoadingView';

type AcknowledgementMode = 'hidden' | 'readonly' | 'editable';

interface BullyingHarassmentTrainingViewProps {
  excludeLastPage?: boolean;
  children?: React.ReactNode;
  data?: any;
  meta?: { website?: string; formId?: string; reviewDate?: string };
  acknowledgementMode?: AcknowledgementMode;
  onAcknowledgementChange?: (updates: Record<string, any>) => void;
  showDocument?: boolean;
  onRenderingChange?: (isRendering: boolean) => void;
  staffId?: number; // Staff ID for generating PDF URL
  usePdfViewer?: boolean; // Option to use iframe PDF viewer instead of canvas
  generatedPdfUrl?: string; // Direct URL to generated PDF
}

const PDF_URL = "/stafForms/Bullying and Harassment Training 2023.pdf";

export default function BullyingHarassmentTrainingView({
  excludeLastPage = false,
  children,
  data = {},
  meta = { website: "", formId: "", reviewDate: "" },
  acknowledgementMode,
  onAcknowledgementChange,
  showDocument = true,
  onRenderingChange,
  staffId,
  usePdfViewer = false, // Default to canvas for static PDF, but allow iframe for generated PDF
  generatedPdfUrl,
}: BullyingHarassmentTrainingViewProps) {
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const hasRenderedRef = useRef(false);
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Generate PDF URL if staffId is provided
  const pdfUrl = generatedPdfUrl || (staffId ? `/api/staff/${staffId}/forms/bullying-harassment-training/pdf` : null);

  const derivedStaffName = useMemo(
    () => data?.staffName || data?.fullName || data?.employeeName || '',
    [data?.staffName, data?.fullName, data?.employeeName]
  );
  const derivedAcknowledged = useMemo(
    () => data?.readAcknowledgement || data?.acknowledged || false,
    [data?.readAcknowledgement, data?.acknowledged]
  );
  const derivedSignature = useMemo(
    () => data?.signature || data?.staffSignature || '',
    [data?.signature, data?.staffSignature]
  );
  const derivedDate = useMemo(
    () => data?.date || data?.acknowledgedAt || data?.staffSignedAt || '',
    [data?.date, data?.acknowledgedAt, data?.staffSignedAt]
  );

  // Helper function to format date without timezone issues
  const formatDateSafe = (dateStr: string): string => {
    if (!dateStr) return '';
    try {
      // Extract date part from string (handles both "2025-11-27" and "2025-11-27T00:00:00.000Z")
      let datePart = dateStr;
      if (typeof dateStr === 'string' && dateStr.includes('T')) {
        datePart = dateStr.split('T')[0];
      }
      
      // Check if it's in YYYY-MM-DD format
      if (typeof datePart === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
        const [year, month, day] = datePart.split('-').map(Number);
        // Create date using local timezone (month is 0-indexed)
        const date = new Date(year, month - 1, day);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString('en-AU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
      
      // Fallback: try to parse the original string
      const dateObj = new Date(dateStr);
      if (isNaN(dateObj.getTime())) return dateStr;
      
      // Extract date components and create new local date to avoid timezone issues
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate();
      const localDate = new Date(year, month - 1, day);
      return localDate.toLocaleDateString('en-AU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const hasAcknowledgementData =
    !!derivedStaffName || !!derivedSignature || !!derivedDate || !!derivedAcknowledged;

  const resolvedAcknowledgementMode: AcknowledgementMode =
    acknowledgementMode ?? (hasAcknowledgementData ? 'readonly' : 'hidden');

  const handleInputChange = (key: string, value: any, duplicateKeys: string[] = []) => {
    if (!onAcknowledgementChange) return;
    onAcknowledgementChange(
      duplicateKeys.reduce(
        (acc, duplicateKey) => ({ ...acc, [duplicateKey]: value }),
        { [key]: value }
      )
    );
  };

  const injectScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        console.log(`Script loaded: ${src}`);
        resolve();
      };
      script.onerror = () => {
        console.error(`Failed to load script: ${src}`);
        reject(new Error(`Failed to load script: ${src}`));
      };
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    if (!showDocument) {
      hasRenderedRef.current = false;
      if (pdfContainerRef.current) {
        pdfContainerRef.current.innerHTML = '';
      }
      return;
    }
    
    // If using PDF viewer (iframe) and we have a PDF URL, use iframe instead of canvas
    if (usePdfViewer && pdfUrl) {
      const container = pdfContainerRef.current;
      if (!container) return;
      
      container.innerHTML = '';
      setIsRendering(true);
      onRenderingChange?.(true);
      
      const iframe = document.createElement('iframe');
      iframe.src = pdfUrl;
      iframe.style.width = '100%';
      iframe.style.minHeight = '800px';
      iframe.style.border = '1px solid #e5e7eb';
      iframe.style.borderRadius = '8px';
      iframe.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
      iframe.style.backgroundColor = 'white';
      iframe.onload = () => {
        setIsRendering(false);
        onRenderingChange?.(false);
        hasRenderedRef.current = true;
      };
      iframe.onerror = () => {
        setError('Failed to load PDF');
        setIsRendering(false);
        onRenderingChange?.(false);
      };
      
      container.appendChild(iframe);
      return;
    }
    
    const renderPdf = async () => {
      if (hasRenderedRef.current) return;
      
      const checkContainer = () => pdfContainerRef.current;
      let container = checkContainer();
      let retries = 0;
      while (!container && retries < 5) {
        await new Promise(resolve => setTimeout(resolve, 100));
        container = checkContainer();
        retries++;
      }
      
      if (!container) {
        console.error('Container not available after waiting');
        setError('Failed to initialize PDF container');
        return;
      }
      
      hasRenderedRef.current = true;
      setIsRendering(true);
      onRenderingChange?.(true);
      try {
        console.log('Starting PDF rendering for Bullying & Harassment Training');
        await injectScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
        await injectScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js');
        const w: any = window as any;
        if (!w['pdfjsLib']) throw new Error('pdfjsLib not available');
        w['pdfjsLib'].GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        console.log('Loading PDF from:', PDF_URL);
        const loadingTask = w['pdfjsLib'].getDocument(PDF_URL);
        const pdf = await loadingTask.promise;
        console.log('PDF loaded successfully, pages:', pdf.numPages);

        const finalContainer = pdfContainerRef.current;
        if (!finalContainer) {
          console.error('Container not available after async operations');
          return;
        }
        finalContainer.innerHTML = '';
        console.log('Container cleared, starting PDF rendering...');

        const containerWidth = container.clientWidth || 794;
        const devicePixelRatioValue = Math.max(window.devicePixelRatio || 1, 1);
        
        let maxWidth, qualityMultiplier;
        if (window.innerWidth < 480) {
          maxWidth = 350;
          qualityMultiplier = 3.0; // Increased for ultra-high quality
        } else if (window.innerWidth < 768) {
          maxWidth = 450;
          qualityMultiplier = 3.5; // Increased for maximum quality
        } else if (window.innerWidth < 1024) {
          maxWidth = 650;
          qualityMultiplier = 4.0; // Increased for ultra-maximum quality
        } else if (window.innerWidth < 1440) {
          maxWidth = 850;
          qualityMultiplier = 4.5; // Increased for premium quality
        } else {
          maxWidth = 950;
          qualityMultiplier = 5.0; // Increased for ultra-premium quality
        }

        const displayWidth = Math.min(containerWidth * 0.9, maxWidth);
        const fragment = document.createDocumentFragment();
        const lastPage = excludeLastPage ? pdf.numPages - 1 : pdf.numPages;

        for (let i = 1; i <= lastPage; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({
            scale: displayWidth / page.getViewport({ scale: 1 }).width,
          });
          const outputScale = devicePixelRatioValue * qualityMultiplier;

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d', { 
            alpha: false,
            desynchronized: false,
            willReadFrequently: false,
            // Enable high-quality image smoothing
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high' as ImageSmoothingQuality,
          }) as CanvasRenderingContext2D;
          if (!context) continue;

          // Enable maximum quality rendering
          context.imageSmoothingEnabled = true;
          context.imageSmoothingQuality = 'high';

          canvas.width = Math.floor(viewport.width * outputScale);
          canvas.height = Math.floor(viewport.height * outputScale);
          canvas.style.width = `${Math.floor(viewport.width)}px`;
          canvas.style.height = `${Math.floor(viewport.height)}px`;
          canvas.style.display = 'block';
          canvas.style.margin = '0 auto 16px auto';
          canvas.style.border = '1px solid #e5e7eb';
          canvas.style.borderRadius = '8px';
          canvas.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          canvas.style.backgroundColor = 'white';
          canvas.style.maxWidth = '100%';

          const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

          await page.render({
            canvasContext: context,
            viewport,
            transform: transform as any,
          }).promise;
          fragment.appendChild(canvas);
        }

        finalContainer.appendChild(fragment);
        console.log('PDF rendering completed');
      } catch (err: any) {
        console.error('Error rendering Bullying & Harassment Training PDF:', err);
        setError(err.message || 'Failed to render PDF.');
      } finally {
        setIsRendering(false);
        onRenderingChange?.(false);
      }
    };

    renderPdf();
  }, [showDocument, excludeLastPage, onRenderingChange, usePdfViewer, pdfUrl]);

  const renderAcknowledgementSection = () => {
    if (resolvedAcknowledgementMode === 'hidden') return null;

    if (resolvedAcknowledgementMode === 'readonly') {
      return (
        <div className="flex justify-center w-full mt-10 font-['Open_Sans'] px-4 pb-6">
          <div className="bg-white w-full max-w-[794px] border shadow relative px-[60px] pt-10 pb-16">
            <div className="flex justify-center mb-8">
              <img
                src="/client_full_logo.jpg"
                alt="Infinity Supports WA logo"
                className="h-16 object-contain"
              />
            </div>

            <h2 className="text-center font-semibold mb-6 text-[12pt]">
              Bullying & Harassment Training Acknowledgement Form
            </h2>

            <p className="mb-4 text-[11pt] leading-relaxed">
              I acknowledge that I have received, read, and understood the Bullying & Harassment Training materials provided to me.
            </p>

            <div className="space-y-6 text-[11pt]">
              <div className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg bg-gray-50">
                <input
                  id="readAcknowledgementReadonly"
                  type="checkbox"
                  checked={!!derivedAcknowledged}
                  readOnly
                  className="mt-1 w-5 h-5 accent-blue-600 rounded border-gray-300 cursor-default"
                />
                <label htmlFor="readAcknowledgementReadonly" className="leading-relaxed">
                  <strong>I acknowledge that:</strong>
                  <br />• I have completed the Bullying & Harassment Training
                  <br />• I understand the key concepts and procedures covered in the training
                  <br />• I will apply this knowledge in my work environment
                  <br />• I am aware of the complaint procedures and support available
                </label>
              </div>

              <div>
                <label className="block mb-1">Name</label>
                <div className="w-full border-b border-black/60 px-1 py-2 text-gray-800 min-h-[32px]">
                  {derivedStaffName || <span className="text-gray-400 italic">—</span>}
                </div>
              </div>

              <div>
                <label className="block mb-1">Signature</label>
                {derivedSignature ? (
                  <img src={derivedSignature} alt="Employee Signature" className="border max-h-20 bg-white" />
                ) : (
                  <div className="w-full border border-dashed border-gray-400 rounded-lg px-3 py-6 text-gray-400 italic">
                    No signature provided
                  </div>
                )}
              </div>

              <div>
                <label className="block mb-1">Date</label>
                <div className="w-full border-b border-black/60 px-1 py-2 text-gray-800 min-h-[32px]">
                  {derivedDate ? formatDateSafe(derivedDate) : (
                    <span className="text-gray-400 italic">—</span>
                  )}
                </div>
              </div>
            </div>

            {(meta.website || meta.formId || meta.reviewDate) && (
              <div className="absolute bottom-6 left-[60px] right-[60px] text-[10pt] text-gray-600 flex items-center justify-between">
                {meta.website && <div>Website: {meta.website}</div>}
                {meta.formId && <div>{meta.formId}</div>}
                {meta.reviewDate && <div>Review Date: {meta.reviewDate}</div>}
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="flex justify-center w-full mt-10 font-['Open_Sans'] px-4 pb-6">
        <div className="bg-white w-full max-w-[794px] border shadow relative px-[60px] pt-10 pb-16">
          <div className="flex justify-center mb-8">
            <img
              src="/client_full_logo.jpg"
              alt="Infinity Supports WA logo"
              className="h-16 object-contain"
            />
          </div>

          <h2 className="text-center font-semibold mb-6 text-[12pt]">
            Bullying & Harassment Training Acknowledgement Form
          </h2>

          <p className="mb-4 text-[11pt] leading-relaxed">
            I acknowledge that I have received, read, and understood the Bullying & Harassment Training materials provided to me.
          </p>
          <p className="mb-8 text-[11pt] leading-relaxed">
            All fields marked with <span className="text-red-500">*</span> are required.
          </p>

          <div className="space-y-6 text-[11pt]">
            <div className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg bg-gray-50">
              <input
                id="readAcknowledgementEditable"
                type="checkbox"
                checked={!!derivedAcknowledged}
                onChange={(e) =>
                  handleInputChange('readAcknowledgement', e.target.checked, ['acknowledged'])
                }
                className="mt-1 w-5 h-5 accent-blue-600 rounded border-gray-300"
              />
              <label htmlFor="readAcknowledgementEditable" className="leading-relaxed">
                <strong>I acknowledge that:</strong>
                <br />• I have completed the Bullying & Harassment Training
                <br />• I understand the key concepts and procedures covered in the training
                <br />• I will apply this knowledge in my work environment
                <br />• I am aware of the complaint procedures and support available
              </label>
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-800">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={derivedStaffName}
                readOnly
                disabled
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed opacity-70"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-800">
                Signature <span className="text-red-500">*</span>
              </label>
              <SignaturePad
                onEnd={(value) =>
                  handleInputChange('signature', value, ['staffSignature'])
                }
                initialValue={derivedSignature}
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-800">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={derivedDate || ''}
                onChange={(e) =>
                  handleInputChange('date', e.target.value, ['acknowledgedAt', 'staffSignedAt'])
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>
          </div>

          {(meta.website || meta.formId || meta.reviewDate) && (
            <div className="absolute bottom-6 left-[60px] right-[60px] text-[10pt] text-gray-600 flex items-center justify-between">
              {meta.website && <div>Website: {meta.website}</div>}
              {meta.formId && <div>{meta.formId}</div>}
              {meta.reviewDate && <div>Review Date: {meta.reviewDate}</div>}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex justify-center p-2 md:p-4">
      <div className="w-full max-w-6xl mx-auto">
        {isRendering && (
          <LoadingView 
            title="Loading Bullying & Harassment Training" 
            message="Rendering PDF pages, please wait..." 
          />
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}
        <div 
          ref={pdfContainerRef} 
          className="pdf-container flex flex-col items-center justify-center"
          style={{ 
            gap: '16px',
            padding: '20px 0',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        ></div>
        {!isRendering && renderAcknowledgementSection()}
        {children}
      </div>
    </div>
  );
}
