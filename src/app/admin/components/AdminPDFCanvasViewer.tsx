"use client";

import { useEffect, useState, useRef, useCallback } from "react";

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
  // Store rendered page images in state (cached)
  const [pageImages, setPageImages] = useState<(string | null)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  
  // Use refs for tracking to avoid dependency issues
  const renderedPagesRef = useRef<Set<number>>(new Set());
  const renderingPagesRef = useRef<Set<number>>(new Set());
  
  // Store PDF document and rendering settings in refs to avoid re-rendering
  const pdfDocRef = useRef<any>(null);
  const renderSettingsRef = useRef<{
    devicePixelRatio: number;
    maxWidth: number;
    baseScale: number;
    qualityMultiplier: number;
    responsiveScale: number;
    outputScale: number;
  } | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Render a single page and cache it in state
  const renderPage = useCallback(async (pageNum: number) => {
    if (!pdfDocRef.current || !renderSettingsRef.current) return;
    // Skip if already rendered or currently rendering
    if (renderedPagesRef.current.has(pageNum) || renderingPagesRef.current.has(pageNum)) return;

    renderingPagesRef.current.add(pageNum);
    // Only update state if page image doesn't exist yet (to avoid unnecessary re-renders)
    setPageImages(prev => {
      if (prev[pageNum - 1]) return prev; // Already has image, don't trigger re-render
      const next = [...prev];
      next[pageNum - 1] = null; // Mark as loading
      return next;
    });

    try {
      const page = await pdfDocRef.current.getPage(pageNum);
      const settings = renderSettingsRef.current;
      
      // Get viewport with responsive scale
      const viewport = page.getViewport({ scale: settings.responsiveScale });
      
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d", { 
        alpha: false,
        desynchronized: false,
        willReadFrequently: false,
        colorSpace: 'srgb',
      });
      if (!context) {
        renderingPagesRef.current.delete(pageNum);
        return;
      }
      
      // Type guard to ensure we have CanvasRenderingContext2D
      if (context instanceof CanvasRenderingContext2D) {
        context.imageSmoothingEnabled = false;
      }

      // Set canvas size with optimized resolution for faster rendering
      // Cap the maximum canvas size to prevent memory issues and improve speed
      const maxCanvasWidth = 3000; // Cap at 3000px width for performance
      const maxCanvasHeight = 4000; // Cap at 4000px height for performance
      const calculatedWidth = Math.floor(viewport.width * settings.outputScale);
      const calculatedHeight = Math.floor(viewport.height * settings.outputScale);
      
      // Scale down if exceeds maximum to improve rendering speed
      const widthScale = calculatedWidth > maxCanvasWidth ? maxCanvasWidth / calculatedWidth : 1;
      const heightScale = calculatedHeight > maxCanvasHeight ? maxCanvasHeight / calculatedHeight : 1;
      const finalScale = Math.min(widthScale, heightScale, 1);
      
      canvas.width = Math.floor(calculatedWidth * finalScale);
      canvas.height = Math.floor(calculatedHeight * finalScale);
      
      // Adjust output scale if we had to scale down
      const adjustedOutputScale = settings.outputScale * finalScale;
      
      // Set display size (CSS pixels)
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      // Scale the context (use adjusted scale if canvas was capped)
      context.scale(adjustedOutputScale, adjustedOutputScale);

      // Render page
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
      
      // Convert to data URL and cache in state
      // PNG format doesn't support quality parameter, but we can use JPEG for smaller size if needed
      // Using PNG for best quality (text clarity is important)
      const imageDataUrl = canvas.toDataURL("image/png");
      
      setPageImages(prev => {
        const next = [...prev];
        next[pageNum - 1] = imageDataUrl;
        return next;
      });
      
      renderedPagesRef.current.add(pageNum);
      renderingPagesRef.current.delete(pageNum);
      // State already updated above, no need for additional trigger
    } catch (err: any) {
      console.error(`Error rendering page ${pageNum}:`, err);
      setPageImages(prev => {
        const next = [...prev];
        next[pageNum - 1] = null; // Mark as failed
        return next;
      });
      renderingPagesRef.current.delete(pageNum);
    }
  }, []);

  // Initialize PDF and render first few pages immediately
  useEffect(() => {
    let cancelled = false;
    // Store the current pdfUrl to prevent clearing if it hasn't changed
    const currentPdfUrl = pdfUrl;

    const initializePdf = async () => {
      // Only clear if this is a new PDF URL
      setLoading(true);
      setError(null);
      // Only clear images if pdfUrl actually changed (not on every render)
      setPageImages(prev => {
        // If we already have images and pdfUrl hasn't changed, keep them
        if (prev.length > 0 && pdfDocRef.current) {
          return prev;
        }
        return [];
      });
      // Only clear refs if we're starting fresh
      if (!pdfDocRef.current) {
        renderedPagesRef.current.clear();
        renderingPagesRef.current.clear();
      }
      
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

        // Check if pdfUrl changed during async operation
        if (cancelled || currentPdfUrl !== pdfUrl) {
          return;
        }

        pdfDocRef.current = pdf;
        
        const totalPagesToRender = maxPages ? Math.min(maxPages, pdf.numPages) : pdf.numPages;
        setTotalPages(totalPagesToRender);
        
        // Initialize page images array with nulls only if we don't have existing images
        setPageImages(prev => {
          if (prev.length === totalPagesToRender) {
            // Already have the right number of pages, keep them
            return prev;
          }
          // Initialize with nulls for new pages
          return new Array(totalPagesToRender).fill(null);
        });

        // Calculate rendering settings once and store in ref
        // Optimized for faster rendering - reduced quality multipliers for speed
        const devicePixelRatio = Math.max(window.devicePixelRatio || 1, 1);
        const containerWidth = window.innerWidth;
        const basePageWidth = 595; // A4 width in points
        let maxWidth, qualityMultiplier, baseScale;
        
        // Reduced quality multipliers for faster rendering while maintaining good quality
        if (containerWidth < 480) {
          maxWidth = 350;
          baseScale = 1.3;
          qualityMultiplier = 2.5; // Reduced from 6.0 for speed
        } else if (containerWidth < 768) {
          maxWidth = 450;
          baseScale = 1.4;
          qualityMultiplier = 3.0; // Reduced from 7.0 for speed
        } else if (containerWidth < 1024) {
          maxWidth = 650;
          baseScale = 1.5;
          qualityMultiplier = 3.5; // Reduced from 8.0 for speed
        } else if (containerWidth < 1440) {
          maxWidth = 850;
          baseScale = 1.6;
          qualityMultiplier = 4.0; // Reduced from 9.0 for speed
        } else {
          maxWidth = 950;
          baseScale = 1.7;
          qualityMultiplier = 4.5; // Reduced from 10.0 for speed
        }
        
        const displayWidth = Math.min(containerWidth * 0.95, maxWidth);
        const responsiveScale = (displayWidth / basePageWidth) * baseScale;
          const outputScale = devicePixelRatio * qualityMultiplier;
          
        renderSettingsRef.current = {
          devicePixelRatio,
          maxWidth,
          baseScale,
          qualityMultiplier,
          responsiveScale,
          outputScale,
        };

        // Render all pages after initial load (but don't block UI)
        // Start rendering all pages in background with optimized batching
        setLoading(false); // Show UI immediately
        
        // Render all pages progressively with optimized batching for speed
        const renderAllPages = async () => {
          // Check if pdfUrl changed
          if (cancelled || currentPdfUrl !== pdfUrl) return;
          
          // Strategy: Render pages 1-5 and page 6 in parallel for fastest initial display
          // This ensures page 6 (which was slow) loads with the initial batch
          const priorityPages = [1, 2, 3, 4, 5, 6].filter(p => p <= totalPagesToRender);
          const priorityPromises = priorityPages.map(pageNum => {
            // Check before each render
            if (cancelled || currentPdfUrl !== pdfUrl) return Promise.resolve();
            return renderPage(pageNum);
          });
          await Promise.all(priorityPromises);
          
          // Check again before continuing
          if (cancelled || currentPdfUrl !== pdfUrl) return;
          
          // Render remaining pages (7+) in batches of 5 for faster loading
          const remainingPages: number[] = [];
          for (let i = 7; i <= totalPagesToRender; i++) {
            remainingPages.push(i);
          }
          
          // Render remaining pages in batches
          for (let i = 0; i < remainingPages.length; i += 5) {
            if (cancelled || currentPdfUrl !== pdfUrl) return;
            const batch = remainingPages.slice(i, i + 5);
            const batchPromises = batch.map(pageNum => {
              if (cancelled || currentPdfUrl !== pdfUrl) return Promise.resolve();
              return renderPage(pageNum);
            });
            await Promise.all(batchPromises);
            // Yield to UI thread after each batch for smooth rendering
            await new Promise(resolve => requestAnimationFrame(resolve));
          }
        };
        
        // Start rendering all pages in background
        renderAllPages();
      } catch (err: any) {
        console.error("PDF initialization error:", err);
        setError(err.message || "Failed to load PDF");
        setLoading(false);
      }
    };

    initializePdf();
    return () => {
      cancelled = true;
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
    // Only depend on pdfUrl and maxPages, not renderPage (which is stable)
    
  }, [pdfUrl, maxPages]);

  // Note: Intersection Observer removed - all pages render after initial load

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-azure-100 p-8 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          {/* Spinner */}
          <div className="w-20 h-20 border-4 border-t-rose-500 border-rose-200 rounded-full animate-spin mx-auto mb-6"></div>

          {/* Text */}
          <h3 className="text-xl font-bold text-azure-800 mb-2">
            Loading Document
          </h3>
          <p className="text-azure-600 font-medium">
            Please wait...
          </p>

          {/* Bouncing dots */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-gold-500 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-gold-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-gold-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-azure-100 p-8 text-center">
        <p className="text-azure-500 text-sm mb-2">PDF preview is not available for this form.</p>
        <p className="text-azure-400 text-xs">Form data can be viewed and edited from the form detail page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {pageImages.map((src, idx) => {
        const pageNum = idx + 1;
        // Check if page is already rendered (has image data)
        const isRendered = src !== null && src !== undefined;
        const isRendering = renderingPagesRef.current.has(pageNum) && !isRendered;
        
        return (
        <div
          key={idx}
            ref={(el) => {
              pageRefs.current[idx] = el;
            }}
            data-page-num={pageNum}
          className="bg-gradient-to-b from-gray-50 to-white rounded-3xl shadow-xl border border-azure-200 p-4 md:p-8"
        >
            {isRendered ? (
          <img
            src={src}
                alt={`PDF page ${pageNum}`}
            className="w-full h-auto rounded-2xl border border-azure-100 shadow-lg"
            style={{ 
              minHeight,
                  imageRendering: 'crisp-edges',
                }}
              />
            ) : isRendering ? (
              <div 
                className="w-full flex items-center justify-center rounded-2xl border border-azure-100"
                style={{ minHeight }}
              >
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-azure-400 text-sm">Loading page {pageNum}...</p>
                </div>
              </div>
            ) : (
              <div 
                className="w-full flex items-center justify-center rounded-2xl border border-azure-100 bg-azure-50"
                style={{ minHeight }}
              >
                <p className="text-azure-300 text-sm">Page {pageNum}</p>
              </div>
            )}
        </div>
        );
      })}
    </div>
  );
}


