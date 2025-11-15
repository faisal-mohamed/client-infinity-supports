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
}

export default function AdminPDFCanvasViewer({
  pdfUrl,
  minHeight = 900,
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
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.25 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (!context) continue;

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvasContext: context, viewport }).promise;
          images.push(canvas.toDataURL("image/png"));

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


