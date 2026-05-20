"use client";
import React, { useState } from 'react';
import { usePDF } from '@react-pdf/renderer';
import { Document, Page, pdfjs } from 'react-pdf';
import ConflictOfInterestPDF from '../../../../components-server/PrintableForms/ConflictOfInterest_MATCHING';


// Set worker to internal source to avoid CDN issues
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PDFViewWrapperProps {
    formData: any;
    commonFieldsData: any;
}

const PDFViewWrapper: React.FC<PDFViewWrapperProps> = ({ formData, commonFieldsData }) => {
    const [numPages, setNumPages] = useState<number | null>(null);

    // 1. Generate the PDF blob using @react-pdf/renderer
    const [instance, updateInstance] = usePDF({
        document: <ConflictOfInterestPDF formData={formData} commonFieldsData={commonFieldsData} />
    });

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        console.log('📄 [DEBUG] PDF Loaded with pages:', numPages);
        setNumPages(numPages);
    };

    if (instance.loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-azure-50 text-azure-400">
                <div className="w-10 h-10 border-4 border-t-azure-600 border-azure-100 rounded-full animate-spin mb-3"></div>
                <p>Generating Form Preview...</p>
            </div>
        );
    }

    if (instance.error) {
        return <div className="p-8 text-red-500 border border-red-200 bg-red-50 rounded-lg">Error generating PDF: {instance.error}</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center bg-azure-100 p-8 min-h-screen">
            {/* 2. Display the generated PDF using react-pdf (display lib) */}
            <Document
                file={instance.url}
                onLoadSuccess={onDocumentLoadSuccess}
                className="flex flex-col gap-8"
                loading={
                    <div className="flex flex-col items-center justify-center py-20 text-azure-400">
                        <div className="w-8 h-8 border-4 border-t-azure-600 border-azure-100 rounded-full animate-spin mb-3"></div>
                        <p>Rendering Pages...</p>
                    </div>
                }
            >
                {numPages && Array.from(new Array(numPages), (el, index) => (
                    <div key={`page_${index + 1}`} className="shadow-lg rounded-sm overflow-hidden bg-white">
                        <Page
                            pageNumber={index + 1}
                            width={800} // Fixed width for A4-like appearance on desktop
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                        />
                    </div>
                ))}
            </Document>
        </div>
    );
};

export default PDFViewWrapper;
