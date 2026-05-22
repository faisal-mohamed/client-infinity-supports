"use client";

import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Set worker to internal source to avoid CDN issues
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface AnnexurePDFViewerProps {
  pdfUrl: string;
  pdfName?: string;
  images: any;
  settings: any;
}

const AnnexurePDFViewer: React.FC<AnnexurePDFViewerProps> = ({
  pdfUrl,
  pdfName,
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log("📄 [DEBUG] Annexure PDF Loaded with pages:", numPages);
    setNumPages(numPages);
  };

  return (
    <div className="flex flex-col gap-8 w-full items-center print:hidden mt-8">
      {/* Premium Header indicating the Annexure name and total pages */}
      {pdfName && (
        <div className="w-full max-w-[794px] px-4">
          <div className="flex items-center justify-between border-b pb-2 border-gray-200">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Preview: {pdfName}
            </span>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              {numPages ? `${numPages} Page(s)` : "Loading..."}
            </span>
          </div>
        </div>
      )}
      
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        className="flex flex-col gap-6 w-full items-center"
        loading={
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 w-full max-w-[794px] min-h-[400px] bg-white rounded-3xl shadow-md border border-gray-100">
            <div className="w-10 h-10 border-4 border-t-indigo-600 border-indigo-200 rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-medium text-gray-600">Loading document pages...</p>
          </div>
        }
      >
        {numPages &&
          Array.from(new Array(numPages), (el, index) => (
            <div
              key={`annexure_page_${index + 1}`}
              className="relative w-full max-w-[794px] bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 p-4 md:p-6"
            >
              {/* Page number pill in the corner of the preview */}
              <div className="absolute top-4 right-4 z-10 bg-gray-900/60 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                Page {index + 1} of {numPages}
              </div>

              {/* Render PDF page content cleanly */}
              <div className="flex items-center justify-center overflow-hidden bg-gray-50 border border-gray-100 rounded-xl p-1">
                <Page
                  pageNumber={index + 1}
                  width={720} // Fit perfectly inside the padded 794px container
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="max-w-full shadow-sm rounded-lg"
                />
              </div>
            </div>
          ))}
      </Document>
    </div>
  );
};

export default AnnexurePDFViewer;
