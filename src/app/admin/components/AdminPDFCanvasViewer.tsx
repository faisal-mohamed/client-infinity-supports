"use client";

import { useEffect, useState } from "react";

const PDF_JS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const PDF_JS_WORKER_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

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

interface AdminPDFCanvasViewerProps {
  pdfUrl: string;
  minHeight?: number;
  maxPages?: number; // Optional: limit number of pages to render
}

export default function AdminPDFCanvasViewer({
  pdfUrl,
  minHeight = 900,
  maxPages,
}: AdminPDFCanvasViewerProps) {
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const renderPdf = async () => {
      setLoading(true);
      setError(null);
      setPageImages([]);
      try {
        await loadScript(PDF_JS_CDN);
        await loadScript(PDF_JS_WORKER_CDN);
        const w: any = window as any;
        const pdfjsLib = w.pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_JS_WORKER_CDN;

        const loadingTask = pdfjsLib.getDocument({
          url: pdfUrl,
          withCredentials: true,
        });
        const pdf = await loadingTask.promise;

        const images: string[] = [];
        const devicePixelRatio = Math.max(window.devicePixelRatio || 1, 1);
        
        // Calculate responsive scale based on container
        const containerWidth = window.innerWidth;
        const basePageWidth = 595; // A4 width in points
        const maxWidth = Math.min(containerWidth * 0.95, 1200);
        const responsiveScale = maxWidth / basePageWidth;
        
        // Use much higher scale for maximum quality (3.5x max for ultra-crisp rendering)
        const baseScale = Math.min(responsiveScale * 2, 3.5);
        const outputScale = devicePixelRatio * baseScale;
        
        // Limit pages if maxPages is specified
        const totalPagesToRender = maxPages ? Math.min(maxPages, pdf.numPages) : pdf.numPages;
        
        for (let i = 1; i <= totalPagesToRender; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: baseScale });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d", { 
            alpha: false,
            desynchronized: false,
            willReadFrequently: false
          });
          if (!context) continue;

          // Set canvas size accounting for device pixel ratio for ultra-crisp rendering
          canvas.width = Math.floor(viewport.width * devicePixelRatio);
          canvas.height = Math.floor(viewport.height * devicePixelRatio);
          
          // Set display size (CSS pixels)
          canvas.style.width = `${Math.floor(viewport.width)}px`;
          canvas.style.height = `${Math.floor(viewport.height)}px`;

          // Use transform array for better quality (like orientation view)
          const transform = devicePixelRatio !== 1
            ? [devicePixelRatio, 0, 0, devicePixelRatio, 0, 0]
            : null;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
            transform: transform,
          };

          await page.render(renderContext).promise;
          
          // Use maximum quality for image export
          images.push(canvas.toDataURL("image/png", 1.0));

          if (cancelled) return;
        }

        setPageImages(images);
      } catch (err: any) {
        console.error("PDF render error:", err);
        setError(err.message || "Failed to load PDF");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    renderPdf();
    return () => {
      cancelled = true;
    };
  }, [pdfUrl]);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 min-h-[400px] flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading document...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-red-200 p-8 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {pageImages.map((src, idx) => (
        <div
          key={idx}
          className="bg-gradient-to-b from-gray-50 to-white rounded-3xl shadow-xl border border-gray-200 p-4 md:p-8"
        >
          <img
            src={src}
            alt={`PDF page ${idx + 1}`}
            className="w-full h-auto rounded-2xl border border-gray-100 shadow-lg"
            style={{ minHeight }}
          />
        </div>
      ))}
    </div>
  );
}


