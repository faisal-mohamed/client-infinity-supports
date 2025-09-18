"use client";

import React, { useEffect, useRef, useState } from 'react';

export default function OrientationView({ excludeLastPage = false, children, data = {} }: { excludeLastPage?: boolean; children?: React.ReactNode; data?: any }) {
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const hasRenderedRef = useRef(false);
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const injectScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
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
  }, [excludeLastPage]);

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

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
        {children}
      </div>
    </div>
  );
}
