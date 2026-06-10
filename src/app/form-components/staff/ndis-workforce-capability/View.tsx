"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import SignatureCanvas from '@/components/ui/SignatureCanvas';
import LoadingView from '@/components/ui/LoadingView';
import NdisWorkforceCapabilityAcknowledgementOverlay from './AcknowledgementOverlay';

type NdisWorkforceAcknowledgementMode = 'hidden' | 'readonly' | 'editable';

interface NdisWorkforceCapabilityViewProps {
  excludeLastPage?: boolean;
  children?: React.ReactNode;
  data?: any;
  meta?: {
    website?: string | null;
    formId?: string | null;
    reviewDate?: string | null;
    footerLeft?: string | null;
    footerCenter?: string | null;
    footerRight?: string | null;
  };
  acknowledgementMode?: NdisWorkforceAcknowledgementMode;
  onAcknowledgementChange?: (updates: Record<string, any>) => void;
  showDocument?: boolean;
  onRenderingChange?: (isRendering: boolean) => void;
}

export default function NdisWorkforceCapabilityView({
  excludeLastPage = false,
  children,
  data = {},
  meta = {},
  acknowledgementMode,
  onAcknowledgementChange,
  showDocument = true,
  onRenderingChange,
}: NdisWorkforceCapabilityViewProps) {
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const hasRenderedRef = useRef(false);
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const derivedStaffName = useMemo(
    () => data?.fullName || data?.staffName || '',
    [data?.fullName, data?.staffName]
  );
  const derivedAcknowledged = useMemo(
    () => data?.readAcknowledgement || false,
    [data?.readAcknowledgement]
  );
  const derivedSignature = useMemo(() => {
    // If signature is explicitly empty string or null, return empty string
    if (data?.signature === '' || data?.signature === null || data?.signature === undefined) {
      if (data?.staffSignature === '' || data?.staffSignature === null || data?.staffSignature === undefined) {
        return '';
      }
    }
    return data?.signature || data?.staffSignature || '';
  }, [data?.signature, data?.staffSignature]);
  const derivedDate = useMemo(
    () => data?.date || data?.staffSignedAt || '',
    [data?.date, data?.staffSignedAt]
  );

  const hasAcknowledgementData =
    !!derivedStaffName || !!derivedSignature || !!derivedDate || !!derivedAcknowledged;

  const resolvedAcknowledgementMode: NdisWorkforceAcknowledgementMode =
    acknowledgementMode ?? (hasAcknowledgementData ? 'readonly' : 'hidden');

  const handleInputChange = (key: string, value: any) => {
    if (!onAcknowledgementChange) return;
    onAcknowledgementChange({ [key]: value });
  };

  const injectScript = (src: string): Promise<void> =>
    new Promise((resolve, reject) => {
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

  useEffect(() => {
    // Don't render PDF pages when in editable mode - user only needs to fill first page
    if (acknowledgementMode === 'editable') {
      hasRenderedRef.current = true;
      setIsRendering(false);
      onRenderingChange?.(false);
      if (pdfContainerRef.current) {
        pdfContainerRef.current.innerHTML = '';
      }
      return;
    }

    if (!showDocument) {
      hasRenderedRef.current = false;
      if (pdfContainerRef.current) {
        pdfContainerRef.current.innerHTML = '';
      }
      return;
    }

    const renderPdf = async () => {
      if (hasRenderedRef.current) return;

      // Wait for container to be available before starting rendering
      const checkContainer = () => pdfContainerRef.current;

      // Wait a bit for the ref to be set (up to 500ms)
      let container = checkContainer();
      let retries = 0;
      while (!container && retries < 5) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        container = checkContainer();
        retries++;
      }

      if (!container) {
        console.error('Container not available after waiting');
        setError('Failed to initialize PDF container');
        return;
      }

      // Now that container is confirmed, mark as rendering
      hasRenderedRef.current = true;
      setIsRendering(true);
      onRenderingChange?.(true);
      try {
        console.log('Starting PDF rendering for NDIS Workforce Capability Framework');
        await injectScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
        await injectScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js');
        const w: any = window as any;
        if (!w['pdfjsLib']) throw new Error('pdfjsLib not available');
        w['pdfjsLib'].GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const url = '/stafForms/NDIS WORKFORCE CAPABILITY FRAMEWORK.pdf';
        console.log('Loading PDF from:', url);
        const loadingTask = w['pdfjsLib'].getDocument(url);
        const pdf = await loadingTask.promise;
        console.log('PDF loaded successfully, pages:', pdf.numPages);

        // Check container again after async operations
        let finalContainer = pdfContainerRef.current;
        if (!finalContainer) {
          // Wait a bit more if container is still not available
          await new Promise((resolve) => setTimeout(resolve, 100));
          finalContainer = pdfContainerRef.current;
          if (!finalContainer) {
            console.warn('Container not available after async operations, will retry or fail gracefully');
            hasRenderedRef.current = false; // Reset so we can try again
            setIsRendering(false);
            onRenderingChange?.(false);
            setError('PDF container became unavailable. Please refresh the page.');
            return;
          }
        }

        finalContainer.innerHTML = '';
        console.log('Container cleared, starting PDF rendering...');

        // Get container again to ensure it's still available
        let renderContainer = pdfContainerRef.current;
        if (!renderContainer) {
          console.error('Container lost during rendering setup');
          setIsRendering(false);
          onRenderingChange?.(false);
          setError('Container became unavailable during rendering');
          return;
        }

        const containerWidth = renderContainer.clientWidth || 794;
        const devicePixelRatioValue = Math.max(window.devicePixelRatio || 1, 1);

        let maxWidth: number;
        let qualityMultiplier: number;
        if (window.innerWidth < 480) {
          maxWidth = 350;
          qualityMultiplier = 1.2;
        } else if (window.innerWidth < 768) {
          maxWidth = 450;
          qualityMultiplier = 1.5;
        } else if (window.innerWidth < 1024) {
          maxWidth = 650;
          qualityMultiplier = 1.8;
        } else if (window.innerWidth < 1440) {
          maxWidth = 850;
          qualityMultiplier = 2;
        } else {
          maxWidth = 950;
          qualityMultiplier = 2.2;
        }

        const displayWidth = Math.min(containerWidth * 0.9, maxWidth);
        const fragment = document.createDocumentFragment();

        // For admin view (readonly mode), only show the first page
        // Don't render any pages when in editable mode (handled above)
        const startPage = 1; // Only render first page
        const lastPage = 1; // Only render first page

        for (let i = startPage; i <= lastPage; i++) {
          // Check container before each page render
          renderContainer = pdfContainerRef.current;
          if (!renderContainer) {
            console.error('Container lost during page rendering');
            break;
          }
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: displayWidth / page.getViewport({ scale: 1 }).width });
          const outputScale = devicePixelRatioValue * qualityMultiplier;

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d', {
            alpha: false,
            desynchronized: true,
            willReadFrequently: false,
          });
          if (!context) {
            console.error('Failed to get canvas context');
            continue;
          }

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
          canvas.style.height = 'auto';

          const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
            transform: transform,
          };

          await page.render(renderContext).promise;
          fragment.appendChild(canvas);
        }

        // Check container one more time before appending
        const appendContainer = pdfContainerRef.current;
        if (appendContainer && fragment.childNodes.length > 0) {
          appendContainer.appendChild(fragment);
          console.log('PDF rendering complete.');
        } else if (!appendContainer) {
          console.error('Container not available when appending fragments');
          setError('Container became unavailable before completing render');
        }
      } catch (err: any) {
        console.error('Error rendering PDF:', err);
        setError(err.message || 'Failed to render PDF.');
      } finally {
        setIsRendering(false);
        onRenderingChange?.(false);
      }
    };

    renderPdf();
  }, [excludeLastPage, showDocument, onRenderingChange, acknowledgementMode]);

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  const renderAcknowledgementSection = () => {
    if (resolvedAcknowledgementMode === 'hidden') return null;

    if (resolvedAcknowledgementMode === 'readonly') {
      return (
        <div className="flex justify-center w-full mt-10 font-['Open_Sans'] px-4 pb-6">
          <div className="bg-white w-full max-w-[794px] min-h-[960px] border shadow relative px-[96px] pt-12 pb-[112px]">
            <div className="flex justify-center mb-8">
              <img src="/client_full_logo.jpg" alt="Company Logo" className="h-16 object-contain" />
            </div>

            <h2 className="text-center font-semibold mb-6 text-[12pt]">
              NDIS Workforce Capability Framework Acknowledgement Form
            </h2>

            <p className="mb-4 text-[11pt] leading-relaxed">
              I confirm I have received the NDIS Workforce Capability Framework from Infinity Supports and have read
              and understood the content.
            </p>
            <p className="mb-8 text-[11pt] leading-relaxed">
              A printed version of this framework is also available. If you would like a printed version, please
              contact us.
            </p>

            <div className="space-y-6 text-[11pt]">
              <div className="flex items-start gap-3 p-4 border border-azure-100 rounded-lg bg-gray-50">
                <input
                  id="readAcknowledgementReadonly"
                  type="checkbox"
                  checked={!!derivedAcknowledged}
                  readOnly
                  className="mt-1 w-5 h-5 accent-gold-500 rounded border-azure-100 cursor-default"
                />
                <label htmlFor="readAcknowledgementReadonly" className="leading-relaxed">
                  <strong>I acknowledge that:</strong>
                  <br />• I have received the NDIS Workforce Capability Framework from Infinity Supports
                  <br />• I have read and understood the content
                  <br />• I agree to comply with all policies and procedures outlined in the framework
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
                  <div className="w-full border border-dashed border-azure-200 rounded-lg px-3 py-6 text-gray-400 italic">
                    No signature provided
                  </div>
                )}
              </div>

              <div>
                <label className="block mb-1">Date</label>
                <div className="w-full border-b border-black/60 px-1 py-2 text-gray-800 min-h-[32px]">
                  {derivedDate ? new Date(derivedDate).toLocaleDateString('en-AU') : (
                    <span className="text-gray-400 italic">—</span>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            {(meta?.website || meta?.formId || meta?.reviewDate || meta?.footerLeft || meta?.footerCenter || meta?.footerRight) && (
              <div className="absolute bottom-6 left-[96px] right-[96px] text-[10pt] text-gray-600 flex items-center justify-between">
                <div>{meta?.footerLeft ?? meta?.website ?? ''}</div>
                <div>{meta?.footerCenter ?? meta?.formId ?? ''}</div>
                <div>{meta?.footerRight ?? (meta?.reviewDate ? `Review Date: ${meta.reviewDate}` : '')}</div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="flex justify-center w-full mt-10 font-['Open_Sans'] px-4 pb-6">
        <div className="bg-white w-full max-w-[794px] border shadow relative px-[96px] pt-12 pb-[112px]">
          <div className="flex justify-center mb-8">
            <img src="/client_full_logo.jpg" alt="Company Logo" className="h-16 object-contain" />
          </div>

          <h2 className="text-center font-semibold mb-6 text-[12pt]">
            NDIS Workforce Capability Framework Acknowledgement Form
          </h2>

          <p className="mb-4 text-[11pt] leading-relaxed">
            I confirm I have received the NDIS Workforce Capability Framework from Infinity Supports and have read
            and understood the content.
          </p>
          <p className="mb-8 text-[11pt] leading-relaxed">
            A printed version of this framework is also available. If you would like a printed version, please
            contact us.
          </p>
          <p className="mb-8 text-[11pt] leading-relaxed">
            All fields marked with <span className="text-red-500">*</span> are required.
          </p>

          <div className="space-y-6 text-[11pt]">
            <div className="flex items-start gap-3 p-4 border border-azure-100 rounded-lg bg-gray-50">
              <input
                id="readAcknowledgementEditable"
                type="checkbox"
                checked={!!derivedAcknowledged}
                onChange={(e) => handleInputChange('readAcknowledgement', e.target.checked)}
                className="mt-1 w-5 h-5 accent-gold-500 rounded border-azure-100"
              />
              <label htmlFor="readAcknowledgementEditable" className="leading-relaxed">
                <strong>I acknowledge that:</strong>
                <br />• I have received the NDIS Workforce Capability Framework from Infinity Supports
                <br />• I have read and understood the content
                <br />• I agree to comply with all policies and procedures outlined in the framework
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
                className="w-full border border-azure-100 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed opacity-70"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-800">
                Signature <span className="text-red-500">*</span>
              </label>
              <SignatureCanvas
                onSignatureEnd={(sig) => handleInputChange('signature', sig)}
                onSignatureClear={() => handleInputChange('signature', '')}
                existingSignature={derivedSignature}
                width={400}
                height={150}
                showClearButton={true}
                clearButtonText="Clear Signature"
                placeholder="Draw your signature in the box above"
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-800">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={derivedDate || ''}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full border border-azure-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500"
              />
            </div>
          </div>

          {/* Footer */}
          {(meta?.website || meta?.formId || meta?.reviewDate || meta?.footerLeft || meta?.footerCenter || meta?.footerRight) && (
            <div className="absolute bottom-6 left-[96px] right-[96px] text-[10pt] text-gray-600 flex items-center justify-between">
              <div>{meta?.footerLeft ?? meta?.website ?? ''}</div>
              <div>{meta?.footerCenter ?? meta?.formId ?? ''}</div>
              <div>{meta?.footerRight ?? (meta?.reviewDate ? `Review Date: ${meta.reviewDate}` : '')}</div>
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
            title="Loading NDIS Workforce Capability Framework" 
            message="Rendering PDF pages, please wait..." 
          />
        )}
        
        {/* Cover page with overlay form (editable) */}
        {!isRendering && acknowledgementMode === 'editable' && (
          <NdisWorkforceCapabilityAcknowledgementOverlay
            key={`overlay-${derivedSignature || 'empty'}-${derivedDate || 'nodate'}`}
            data={{
              fullName: derivedStaffName,
              signature: derivedSignature || undefined, // Pass undefined if empty, not empty string
              date: derivedDate || undefined,
            }}
            onDataChange={(updates) => {
              console.log('🔵 [View] onDataChange received from overlay:', {
                keys: Object.keys(updates),
                hasSignature: !!updates.signature,
                signatureLength: updates.signature?.length || 0
              });
              if (onAcknowledgementChange) {
                onAcknowledgementChange(updates);
              }
            }}
            readOnly={false}
          />
        )}
        
        {/* PDF pages - only show first page for admin view (readonly mode), hidden for editable mode */}
        {acknowledgementMode !== 'editable' && (
          <div
            ref={pdfContainerRef}
            className="pdf-container flex flex-col items-center justify-center"
            style={{
              gap: '16px',
              padding: '20px 0',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          ></div>
        )}
        
        {/* Fallback acknowledgement section for readonly mode - removed, not needed anymore */}
        {children}
      </div>
    </div>
  );
}
