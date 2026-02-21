"use client";
import React, { useState } from 'react';
import { usePDF } from '@react-pdf/renderer';
import { Document, Page, pdfjs } from 'react-pdf';
import NDISConsentPDF from '../../../../components-server/PrintableForms/NDISConsent_MATCHING';

// Set worker to internal source to avoid CDN issues
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PDFViewWrapperProps {
    formData: any;
    commonFieldsData: any;
}

const PDFViewWrapper: React.FC<PDFViewWrapperProps> = ({ formData, commonFieldsData }) => {
    const [numPages, setNumPages] = useState<number | null>(null);

    const [instance] = usePDF({
        document: <NDISConsentPDF formData={formData} commonFieldsData={commonFieldsData} />
    });

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    if (instance.loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 text-gray-500">
                <div className="w-10 h-10 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin mb-4"></div>
                <p>Generating Form Preview...</p>
            </div>
        );
    }

    if (instance.error) {
        const errorMessage = typeof instance.error === 'string'
            ? instance.error
            : (instance.error as any).message || 'Unknown error';
        return <div className="p-8 text-red-500 border border-red-200 bg-red-50 rounded-lg">Error generating PDF: {errorMessage}</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center bg-gray-100 p-8 min-h-screen">
            <Document
                file={instance.url}
                onLoadSuccess={onDocumentLoadSuccess}
                className="flex flex-col gap-8"
                loading={
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <div className="w-8 h-8 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin mb-4"></div>
                        <p>Rendering Pages...</p>
                    </div>
                }
            >
                {numPages && Array.from(new Array(numPages), (el, index) => (
                    <div key={`page_${index + 1}`} className="shadow-lg rounded-sm overflow-hidden bg-white">
                        <Page
                            pageNumber={index + 1}
                            width={800}
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
