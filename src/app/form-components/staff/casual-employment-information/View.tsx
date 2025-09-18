"use client";

import React, { useEffect, useRef, useState } from 'react';

export default function CasualEmploymentInformationView({ excludeLastPage = false, children, data = {} }: { excludeLastPage?: boolean; children?: React.ReactNode; data?: any }) {
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const hasRenderedRef = useRef(false);
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Render the PDF into canvases without the built-in viewer
    const renderPdf = async () => {
      if (hasRenderedRef.current) return;
      hasRenderedRef.current = true;
      setIsRendering(true);
      try {
        console.log('Starting PDF rendering for Casual Employment Information Statement');
        console.log('Injecting PDF.js scripts...');
        await injectScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
        await injectScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js');
        const w: any = window as any;
        console.log('Checking for pdfjsLib...');
        if (!w['pdfjsLib']) throw new Error('pdfjsLib not available');
        console.log('pdfjsLib found, setting worker source...');
        w['pdfjsLib'].GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const url = '/stafForms/casual-employment-information-statement.pdf';
        console.log('Loading PDF from:', url);
        const loadingTask = w['pdfjsLib'].getDocument(url);
        const pdf = await loadingTask.promise;
        console.log('PDF loaded successfully, pages:', pdf.numPages);

        const container = pdfContainerRef.current;
        console.log('Container ref:', container);
        if (!container) {
          console.error('Container not available');
          return;
        }
        container.innerHTML = '';
        console.log('Container cleared, starting PDF rendering...');

        const containerWidth = container.clientWidth || 794;
        const devicePixelRatioValue = Math.max(window.devicePixelRatio || 1, 1);
        const displayWidth = Math.min(containerWidth, 794);
        const qualityMultiplier = 2; // render sharper, then downscale for crispness

        const fragment = document.createDocumentFragment();

        const lastPage = excludeLastPage ? (pdf.numPages - 1) : pdf.numPages;

        for (let pageNum = 1; pageNum <= lastPage; pageNum++) {
          console.log(`Rendering page ${pageNum}...`);
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1 });
          const scale = (displayWidth / viewport.width) * qualityMultiplier;
          const scaledViewport = page.getViewport({ scale });

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (!context) throw new Error('Canvas context not available');

          canvas.height = scaledViewport.height;
          canvas.width = scaledViewport.width;
          canvas.style.width = `${displayWidth}px`;
          canvas.style.height = `${scaledViewport.height / qualityMultiplier}px`;
          canvas.style.display = 'block';
          canvas.style.margin = '0 auto 20px auto';
          canvas.style.border = '1px solid #ddd';
          canvas.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';

          const renderContext = {
            canvasContext: context,
            viewport: scaledViewport,
          };

          await page.render(renderContext).promise;
          console.log(`Page ${pageNum} rendered successfully`);
          fragment.appendChild(canvas);
        }

        container.appendChild(fragment);
        console.log('All pages rendered successfully');
        setError(null);
      } catch (err: any) {
        console.error('PDF rendering error:', err);
        setError(err.message || 'Failed to render PDF');
      } finally {
        setIsRendering(false);
      }
    };

    renderPdf();
  }, [excludeLastPage]);

  const injectScript = (src: string): Promise<void> => {
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

  return (
    <div className="bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto">
        {isRendering && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Casual Employment Information Statement...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-8">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Document</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => {
                hasRenderedRef.current = false;
                setError(null);
                window.location.reload();
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        <div ref={pdfContainerRef} className="pdf-container" />
        {children}
      </div>
    </div>
  );
}
