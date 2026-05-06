"use client";
import React, { useState } from 'react';
import { usePDF } from '@react-pdf/renderer';
import { Document, Page, pdfjs } from 'react-pdf';
import SupportActionPlanMatchingPDF from '../../../../components-server/PrintableForms/SupportActionPlan_MATCHING';

// Set worker to internal source to avoid CDN issues
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PDFViewWrapperProps {
    formData: any;
    commonFieldsData: any;
    settings: any;
    logoDataUrl: string;
}

const PDFViewWrapper: React.FC<PDFViewWrapperProps> = ({ formData, commonFieldsData, settings, logoDataUrl }) => {
    const [numPages, setNumPages] = useState<number | null>(null);

    const [instance] = usePDF({
        document: <SupportActionPlanMatchingPDF formData={formData} commonFieldsData={commonFieldsData} settings={settings} logoDataUrl={logoDataUrl} />
    });

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    if (instance.loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-azure-50 text-azure-400">
                <div className="w-10 h-10 border-4 border-t-black border-azure-100 rounded-full animate-spin mb-4"></div>
                <p>Generating Form PDF Preview...</p>
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
        <div className="flex flex-col items-center justify-center bg-azure-100 p-8 min-h-screen">
            <div className="mb-6">
                <a
                    href={instance.url || '#'}
                    download={`Support_Action_Plan_${formData?.participantName || 'Form'}.pdf`}
                    className="bg-black hover:bg-azure-700 text-white px-6 py-2 rounded-lg shadow-md transition-colors font-medium flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Download PDF
                </a>
            </div>

            <Document
                file={instance.url}
                onLoadSuccess={onDocumentLoadSuccess}
                className="flex flex-col gap-8"
                loading={
                    <div className="flex flex-col items-center justify-center py-20 text-azure-400">
                        <div className="w-8 h-8 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mb-4"></div>
                        <p>Rendering Pages...</p>
                    </div>
                }
            >
                {numPages && Array.from(new Array(numPages), (el, index) => (
                    <div key={`page_${index + 1}`} className="shadow-lg rounded-sm overflow-hidden bg-white max-w-full">
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
