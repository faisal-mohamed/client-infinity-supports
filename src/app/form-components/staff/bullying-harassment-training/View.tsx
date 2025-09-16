"use client";

import React, { useEffect, useRef, useState } from 'react';

export default function BullyingHarassmentTrainingView({ excludeLastPage = false, children }: { excludeLastPage?: boolean; children?: React.ReactNode }) {
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
        console.log('Starting PDF rendering for Bullying and Harassment Training');
        console.log('Injecting PDF.js scripts...');
        await injectScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
        await injectScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js');
        const w: any = window as any;
        console.log('Checking for pdfjsLib...');
        if (!w['pdfjsLib']) throw new Error('pdfjsLib not available');
        console.log('pdfjsLib found, setting worker source...');
        w['pdfjsLib'].GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const url = '/stafForms/Bullying and Harassment Training 2023.pdf';
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
        for (let pageIndex = 1; pageIndex <= lastPage; pageIndex++) {
          const page = await pdf.getPage(pageIndex);
          const viewport = page.getViewport({ scale: 1 });
          const scale = displayWidth / viewport.width;
          const displayViewport = page.getViewport({ scale });

          const pageWrapper = document.createElement('div');
          pageWrapper.className = 'bg-white mx-auto border shadow p-0 print:p-0 mb-4';
          pageWrapper.style.width = displayWidth + 'px';

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (!context) continue;

          canvas.width = Math.floor(displayViewport.width * devicePixelRatioValue * qualityMultiplier);
          canvas.height = Math.floor(displayViewport.height * devicePixelRatioValue * qualityMultiplier);
          canvas.style.width = displayViewport.width + 'px';
          canvas.style.height = displayViewport.height + 'px';
          canvas.style.display = 'block';

          context.scale(devicePixelRatioValue * qualityMultiplier, devicePixelRatioValue * qualityMultiplier);
          await page.render({ canvasContext: context, viewport: displayViewport }).promise;

          pageWrapper.appendChild(canvas);
          fragment.appendChild(pageWrapper);
        }

        // Append all pages at once to avoid progressive layout shifts/scroll jumps
        container.appendChild(fragment);
      } catch (e: any) {
        console.error('Error rendering PDF:', e);
        setError(e?.message || 'Failed to render PDF');
      } finally {
        setIsRendering(false);
      }
    };

    renderPdf();
  }, []);

  function injectScript(src: string) {
    return new Promise<void>((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) return resolve();
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Failed to load ' + src));
      document.body.appendChild(s);
    });
  }

  return (
    <div className="bg-slate-50 py-8">
      <div className="bg-white w-full max-w-[900px] mx-auto rounded-xl shadow border p-4">
        {isRendering && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Bullying and Harassment Training...</p>
          </div>
        )}
        <div ref={pdfContainerRef} className="w-full" />
        {error && (
          <div className="text-sm text-red-600 mt-2">
            <p>Error: {error}</p>
            <p className="mt-2">Attempting to show PDF directly:</p>
            <iframe 
              src="/stafForms/Bullying and Harassment Training 2023.pdf" 
              className="w-full h-96 border border-gray-300"
              title="Bullying and Harassment Training PDF"
            />
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
