"use client";

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface PDFFormViewProps {
  formType: string;
  formTitle: string;
  apiEndpoint: string;
  pdfEndpoint: string;
  downloadFilename: (data: any) => string;
}

// Helper function to load external scripts (only once)
const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if script already exists
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
};

export default function PDFFormView({ 
  formType, 
  formTitle, 
  apiEndpoint, 
  pdfEndpoint, 
  downloadFilename 
}: PDFFormViewProps) {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [totalPages, setTotalPages] = useState(0);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [rendering, setRendering] = useState(false);
  const [renderedPages, setRenderedPages] = useState<number[]>([]);

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const res = await fetch(apiEndpoint);
        const result = await res.json();
        setData(result);
        
        // Generate PDF URL for viewing
        setPdfUrl(pdfEndpoint);
      } catch (error) {
        console.error('Error loading form data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadFormData();
  }, [id, apiEndpoint, pdfEndpoint]);

  // Load PDF.js from CDN and render PDF page by page
  useEffect(() => {
    if (!pdfUrl) return;

    const loadPDF = async () => {
      try {
        setRendering(true);
        
        // Load PDF.js library from CDN
        if (!(window as any).pdfjsLib) {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
        }
        
        const pdfjsLib = (window as any).pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        // Load the PDF
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setRendering(false);
      } catch (error) {
        console.error('Error loading PDF:', error);
        setRendering(false);
      }
    };

    loadPDF();
  }, [pdfUrl]);

  // Render all pages with high quality and responsive sizing
  useEffect(() => {
    if (!pdfDoc || totalPages === 0) return;

    const renderAllPages = async () => {
      const pages: number[] = [];
      
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        try {
          const page = await pdfDoc.getPage(pageNum);
          const canvas = document.getElementById(`pdf-canvas-${pageNum}`) as HTMLCanvasElement;
          if (!canvas) continue;

          const context = canvas.getContext('2d');
          if (!context) continue;

          // Get container width for responsive sizing
          const container = canvas.parentElement;
          const containerWidth = container?.clientWidth || window.innerWidth;
          
          // Calculate responsive scale based on container width
          // A4 page width is approximately 595 points
          const basePageWidth = 595;
          const maxWidth = Math.min(containerWidth * 0.95, 1200); // Max 1200px or 95% of container
          const responsiveScale = maxWidth / basePageWidth;
          
          // Use higher scale for quality, but cap it for performance
          const scale = Math.min(responsiveScale * 1.2, 2.5);
          const devicePixelRatio = window.devicePixelRatio || 1;

          const viewport = page.getViewport({ scale: scale });
          
          // Set canvas size accounting for device pixel ratio
          canvas.width = Math.floor(viewport.width * devicePixelRatio);
          canvas.height = Math.floor(viewport.height * devicePixelRatio);
          
          // Set display size (CSS pixels) - responsive to container
          canvas.style.width = '100%';
          canvas.style.maxWidth = Math.floor(viewport.width) + 'px';
          canvas.style.height = 'auto';

          // Scale context for device pixel ratio
          const transform = devicePixelRatio !== 1
            ? [devicePixelRatio, 0, 0, devicePixelRatio, 0, 0]
            : null;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
            transform: transform,
          };

          await page.render(renderContext).promise;
          pages.push(pageNum);
        } catch (error) {
          console.error(`Error rendering page ${pageNum}:`, error);
        }
      }
      
      setRenderedPages(pages);
    };

    renderAllPages();

    // Re-render on window resize
    const handleResize = () => {
      renderAllPages();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [pdfDoc, totalPages]);

  const handleDownloadPDF = async () => {
    try {
      // Add download=true parameter to trigger download
      const downloadUrl = `${pdfEndpoint}?download=true`;
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error('Failed to generate PDF');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadFilename(data);
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="p-8 flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white min-h-screen">
        <div className="p-8 flex items-center justify-center">
          <div className="text-gray-600">Form data not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header - Responsive */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">{formTitle}</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">{data.staff?.firstName} {data.staff?.surname}</p>
          </div>
          <Link href={`/admin/staff/${id}`} className="text-xs sm:text-sm text-rose-600 hover:underline whitespace-nowrap">
            Back to Forms
          </Link>
        </div>
      </div>

      {/* Main Content - Responsive Container */}
      <div className="w-full mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-3 sm:p-4 lg:p-6">
          
          {/* Form Status - Responsive */}
          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-green-50 rounded-lg mb-4 sm:mb-6">
            <div className="w-3 h-3 flex-shrink-0 bg-green-500 rounded-full"></div>
            <div className="min-w-0">
              <p className="text-sm sm:text-base font-medium text-green-800">Form Completed</p>
              <p className="text-xs sm:text-sm text-green-600 break-words">
                Submitted on {new Date(data.createdAt).toLocaleDateString()}
                {data.staffSignature && ' • Digitally Signed'}
              </p>
            </div>
          </div>

          {/* PDF Viewer - Clean Page Display */}
          {rendering ? (
            <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
              <div className="text-gray-600">Loading PDF pages...</div>
            </div>
          ) : totalPages === 0 ? (
            <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
              <div className="text-gray-600">No pages to display</div>
            </div>
          ) : (
            <div className="space-y-8 sm:space-y-10 lg:space-y-12">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <div key={pageNum} className="w-full">
                  {/* Page Container - Clean separation */}
                  <div className="bg-gradient-to-b from-gray-50 to-white p-4 sm:p-6 lg:p-8 rounded-xl border-2 border-gray-300 shadow-2xl">
                    {/* PDF Page Content */}
                    <div className="flex justify-center bg-white p-2 rounded-lg border border-gray-200">
                      <canvas 
                        id={`pdf-canvas-${pageNum}`}
                        className="shadow-xl bg-white max-w-full h-auto"
                        style={{
                          imageRendering: 'crisp-edges',
                          WebkitFontSmoothing: 'antialiased',
                          MozOsxFontSmoothing: 'grayscale',
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actions - Responsive Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t">
            <button 
              onClick={handleDownloadPDF}
              disabled={!data.staffSignature}
              className={`w-full sm:w-auto px-4 py-2 sm:py-2 text-sm sm:text-base rounded-lg ${
                data.staffSignature 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {data.staffSignature ? 'Download PDF' : 'PDF Available After Signing'}
            </button>
            <Link 
              href={`/admin/staff/${id}/forms/${formType}/edit`}
              className="w-full sm:w-auto px-4 py-2 sm:py-2 text-sm sm:text-base bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-center"
            >
              Edit Form
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

