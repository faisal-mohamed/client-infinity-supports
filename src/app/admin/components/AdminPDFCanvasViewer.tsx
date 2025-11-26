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
        
        // Calculate responsive scale and quality multiplier based on screen size
        // This ensures optimal quality for all screen sizes
        const containerWidth = window.innerWidth;
        const basePageWidth = 595; // A4 width in points
        let maxWidth, qualityMultiplier;
        
        if (containerWidth < 480) {
          maxWidth = 350;
          qualityMultiplier = 2.0; // Very small mobile - high quality
        } else if (containerWidth < 768) {
          maxWidth = 450;
          qualityMultiplier = 2.5; // Mobile - very high quality
        } else if (containerWidth < 1024) {
          maxWidth = 650;
          qualityMultiplier = 3.0; // Tablet - ultra high quality
        } else if (containerWidth < 1440) {
          maxWidth = 850;
          qualityMultiplier = 3.5; // Small desktop - maximum quality
        } else {
          maxWidth = 950;
          qualityMultiplier = 4.0; // Large desktop - ultra maximum quality
        }
        
        const displayWidth = Math.min(containerWidth * 0.95, maxWidth);
        const responsiveScale = displayWidth / basePageWidth;
        
        // Limit pages if maxPages is specified
        const totalPagesToRender = maxPages ? Math.min(maxPages, pdf.numPages) : pdf.numPages;
        
        for (let i = 1; i <= totalPagesToRender; i++) {
          const page = await pdf.getPage(i);
          
          // Get viewport with responsive scale
          const viewport = page.getViewport({ scale: responsiveScale });
          
          // Calculate output scale with quality multiplier for ultra-crisp rendering
          const outputScale = devicePixelRatio * qualityMultiplier;
          
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d", { 
            alpha: false,
            desynchronized: false,
            willReadFrequently: false,
            // Enable high-quality image smoothing
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high' as ImageSmoothingQuality
          });
          if (!context) continue;

          // Set canvas size with high resolution (outputScale multiplier)
          canvas.width = Math.floor(viewport.width * outputScale);
          canvas.height = Math.floor(viewport.height * outputScale);
          
          // Set display size (CSS pixels) - responsive to container
          canvas.style.width = `${Math.floor(viewport.width)}px`;
          canvas.style.height = `${Math.floor(viewport.height)}px`;

          // Use transform array for better quality (same approach as other high-quality viewers)
          const transform = outputScale !== 1 
            ? [outputScale, 0, 0, outputScale, 0, 0] 
            : null;

          // Render with high quality settings
          const renderContext = {
            canvasContext: context,
            viewport: viewport,
            transform: transform as any,
          };

          await page.render(renderContext).promise;
          
          // Use maximum quality PNG export (quality 1.0 = 100%)
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
        <div className="text-center">
          {/* Spinner */}
          <div className="w-20 h-20 border-4 border-t-rose-500 border-rose-200 rounded-full animate-spin mx-auto mb-6"></div>

          {/* Text */}
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            Loading Document
          </h3>
          <p className="text-slate-600 font-medium">
            Please wait...
          </p>

          {/* Bouncing dots */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-rose-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-rose-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
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


