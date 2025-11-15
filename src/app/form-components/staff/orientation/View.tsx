"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import SignaturePad from '@/app/components/forms/SignaturePad';

type OrientationAcknowledgementMode = 'hidden' | 'readonly' | 'editable';

interface OrientationViewProps {
  excludeLastPage?: boolean;
  children?: React.ReactNode;
  data?: any;
  acknowledgementMode?: OrientationAcknowledgementMode;
  onAcknowledgementChange?: (updates: Record<string, any>) => void;
  showDocument?: boolean;
}

export default function OrientationView({
  excludeLastPage = false,
  children,
  data = {},
  acknowledgementMode,
  onAcknowledgementChange,
  showDocument = true,
}: OrientationViewProps) {
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const hasRenderedRef = useRef(false);
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const derivedStaffName = useMemo(
    () => data?.staffName || data?.employeeName || '',
    [data?.staffName, data?.employeeName]
  );
  const derivedAcknowledged = useMemo(
    () => data?.acknowledged || data?.orientationAcknowledged || data?.readOrientation || false,
    [data?.acknowledged, data?.orientationAcknowledged, data?.readOrientation]
  );
  const derivedSignature = useMemo(
    () => data?.signature || data?.staffSignature || data?.orientationSignature || '',
    [data?.signature, data?.staffSignature, data?.orientationSignature]
  );
  const derivedDate = useMemo(
    () => data?.date || data?.acknowledgedAt || data?.staffSignedAt || '',
    [data?.date, data?.acknowledgedAt, data?.staffSignedAt]
  );

  const hasAcknowledgementData =
    !!derivedStaffName || !!derivedSignature || !!derivedDate || !!derivedAcknowledged;

  const resolvedAcknowledgementMode: OrientationAcknowledgementMode =
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
    const renderPdf = async () => {
      if (hasRenderedRef.current) return;
      hasRenderedRef.current = true;
      setIsRendering(true);
      try {
        console.log('Starting PDF rendering for Staff Orientation');
        console.log('Injecting PDF.js scripts...');
        await injectScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
        await injectScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js');
        const w: any = window as any;
        if (!w['pdfjsLib']) throw new Error('pdfjsLib not available');
        w['pdfjsLib'].GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const url = '/stafForms/Orientation.pdf';
        console.log('Loading PDF from:', url);
        const loadingTask = w['pdfjsLib'].getDocument(url);
        const pdf = await loadingTask.promise;
        console.log('PDF loaded successfully, pages:', pdf.numPages);

        const container = pdfContainerRef.current;
        if (!container) {
          console.error('Container not available');
          return;
        }
        container.innerHTML = '';
        console.log('Container cleared, starting PDF rendering...');

        const containerWidth = container.clientWidth || 794;
        const devicePixelRatioValue = Math.max(window.devicePixelRatio || 1, 1);
        
        // More responsive sizing based on screen width - ensure proper centering
        let maxWidth, qualityMultiplier;
        if (window.innerWidth < 480) {
          maxWidth = 350; // Very small mobile
          qualityMultiplier = 1.2;
        } else if (window.innerWidth < 768) {
          maxWidth = 450; // Mobile
          qualityMultiplier = 1.5;
        } else if (window.innerWidth < 1024) {
          maxWidth = 650; // Tablet
          qualityMultiplier = 1.8;
        } else if (window.innerWidth < 1440) {
          maxWidth = 850; // Small desktop
          qualityMultiplier = 2;
        } else {
          maxWidth = 950; // Large desktop
          qualityMultiplier = 2.2;
        }
        
        // Ensure the PDF is centered by using a consistent width
        const displayWidth = Math.min(containerWidth * 0.9, maxWidth);

        const fragment = document.createDocumentFragment();

        const lastPage = excludeLastPage ? (pdf.numPages - 1) : pdf.numPages;

        for (let i = 1; i <= lastPage; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: displayWidth / page.getViewport({ scale: 1 }).width });
          const outputScale = devicePixelRatioValue * qualityMultiplier;

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
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
        container.appendChild(fragment);
        console.log('PDF rendering complete.');
      } catch (err: any) {
        console.error('Error rendering PDF:', err);
        setError(err.message || 'Failed to render PDF.');
      } finally {
        setIsRendering(false);
      }
    };

    renderPdf();
  }, [excludeLastPage, showDocument]);

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  const renderAcknowledgementSection = () => {
    if (resolvedAcknowledgementMode === 'hidden') return null;

    if (resolvedAcknowledgementMode === 'readonly') {
      return (
        <div className="flex justify-center w-full mt-10 font-['Open_Sans'] px-4 pb-6">
          <div className="bg-white w-full max-w-[794px] min-h-[960px] border shadow relative px-[60px] pt-10 pb-16">
            <div className="flex justify-center mb-8">
              <img
                src="/client_full_logo.jpg"
                alt="Infinity Supports WA logo"
                className="h-16 object-contain"
              />
            </div>

            <h2 className="text-center font-semibold mb-6 text-[12pt]">
              Staff Orientation Acknowledgement
            </h2>

            <p className="mb-4 text-[11pt] leading-relaxed">
              I confirm that I have read and understood the{' '}
              <strong>Infinity Supports WA Staff Orientation Handbook</strong>, including workplace
              expectations, safety procedures, and organisational policies.
            </p>
            <p className="mb-8 text-[11pt] leading-relaxed">
              I understand it is my responsibility to seek clarification if I have any questions and
              to comply with the requirements outlined in the handbook.
            </p>

            <div className="space-y-6 text-[11pt]">
              <div className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg bg-gray-50">
                <input
                  id="orientationAcknowledgementReadonly"
                  type="checkbox"
                  checked={!!derivedAcknowledged}
                  readOnly
                  className="mt-1 w-5 h-5 accent-blue-600 rounded border-gray-300 cursor-default"
                />
                <label htmlFor="orientationAcknowledgementReadonly" className="leading-relaxed">
                  <strong>I acknowledge that:</strong>
                  <br />• I have received the Staff Orientation Handbook
                  <br />• I have read and understood the content
                  <br />• I will comply with the policies and procedures described
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
                  {derivedDate ? new Date(derivedDate).toLocaleDateString('en-AU') : (
                    <span className="text-gray-400 italic">—</span>
                  )}
                </div>
              </div>
            </div>
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
            Staff Orientation Acknowledgement Form
          </h2>

          <p className="mb-4 text-[11pt] leading-relaxed">
            Please confirm you have received and read the{' '}
            <strong>Staff Orientation Handbook</strong>. Complete this acknowledgement to confirm you
            understand Infinity Supports WA policies and procedures.
          </p>
          <p className="mb-8 text-[11pt] leading-relaxed">
            All fields marked with <span className="text-red-500">*</span> are required.
          </p>

          <div className="space-y-6 text-[11pt]">
            <div className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg bg-gray-50">
              <input
                id="orientationAcknowledgementEditable"
                type="checkbox"
                checked={!!derivedAcknowledged}
                onChange={(e) =>
                  handleInputChange('acknowledged', e.target.checked, [
                    'orientationAcknowledged',
                    'readOrientation',
                  ])
                }
                className="mt-1 w-5 h-5 accent-blue-600 rounded border-gray-300"
              />
              <label htmlFor="orientationAcknowledgementEditable" className="leading-relaxed">
                <strong>I acknowledge that:</strong>
                <br />• I have received the Staff Orientation Handbook
                <br />• I have read and understood the content
                <br />• I will comply with the policies and procedures described
              </label>
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-800">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={derivedStaffName}
                onChange={(e) =>
                  handleInputChange('staffName', e.target.value, ['employeeName'])
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-800">
                Signature <span className="text-red-500">*</span>
              </label>
              <SignaturePad
                onEnd={(value) =>
                  handleInputChange('signature', value, ['staffSignature', 'orientationSignature'])
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
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex justify-center p-2 md:p-4">
      <div className="w-full max-w-6xl mx-auto">
        {isRendering && <div className="text-center text-gray-500 mb-4">Loading PDF...</div>}
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
        {renderAcknowledgementSection()}
        {children}
      </div>
    </div>
  );
}
